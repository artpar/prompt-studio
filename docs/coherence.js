// Generic constraint evaluator. Each selected option narrows the valid values of one
// or more dimensions. An empty intersection is a conflict; a soft constraint that
// misses the hard intersection is a caution. The catalog owns domain knowledge.
const coherenceDimensions = {
  fileEdits: { title: "Edit requirements conflict", subject: "edit count" },
  fileCount: { title: "File scope conflict", cautionTitle: "File scope needs review", subject: "file count" },
  projectState: { title: "Project state conflict", cautionTitle: "Possible state change", subject: "state-change policy" },
  architecturePolicy: { title: "Architecture policy conflict", subject: "component boundaries" },
  automatedTestExecution: { title: "Automated test policy conflict", subject: "automated test policy" },
  deployment: { title: "Deployment policy conflict", subject: "deployment policy" }
};

function intersectAllowed(constraints) {
  if (!constraints.length) return new Set();
  const common = new Set(constraints[0].allowed);
  for (const constraint of constraints.slice(1)) {
    for (const value of common) {
      if (!constraint.allowed.includes(value)) common.delete(value);
    }
  }
  return common;
}

// Find an inclusion-minimal incompatible set, including cases where every pair
// overlaps but three or more constraints have no common value.
function minimalIncompatibleSet(constraints) {
  let core = [...constraints];
  for (let index = 0; index < core.length;) {
    const without = core.filter((_, candidate) => candidate !== index);
    if (without.length > 1 && intersectAllowed(without).size === 0) core = without;
    else index += 1;
  }
  return core;
}

function constraintsFor(option) {
  const result = (option.constraints || []).map(constraint => ({ ...constraint, option }));
  if (option.exclusiveGroup) {
    result.push({
      dimension: `choice:${option.exclusiveGroup}`, allowed: [option.id], strength: "hard",
      meaning: "selects this alternative", option
    });
  }
  if (option.editOnly) {
    result.push({ dimension: "fileEdits", allowed: ["one", "many"], strength: "hard", meaning: "requires file edits", option });
  }
  if (option.multiChange) {
    result.push({ dimension: "fileEdits", allowed: ["many"], strength: "hard", meaning: "requires multiple edits", option });
  }
  return result;
}

const workProductNames = {
  plan: "a plan or design",
  implementation: "code changes",
  review: "review findings"
};

// A request can contain many constraints on one piece of work. Separate
// requested work products are different: the builder needs a clear primary
// outcome before it can treat the rest as supporting instructions.
function analyzeWorkProducts(selected) {
  const byProduct = new Map();
  selected.forEach(option => {
    if (!option.workProduct) return;
    if (!byProduct.has(option.workProduct)) byProduct.set(option.workProduct, []);
    byProduct.get(option.workProduct).push(option);
  });
  if (byProduct.size < 2) return null;

  const primary = selected.find(option => option.primaryWorkProduct)?.primaryWorkProduct;
  const secondary = [...byProduct.keys()].filter(product => product !== primary);
  const exclusive = selected.some(option => option.primaryWorkProduct && option.exclusiveWorkProduct && secondary.length);
  const conflict = exclusive || !primary || secondary.length > 1;
  const evidence = [...byProduct.entries()].map(([product, choices]) =>
    `${workProductNames[product] || product} (${choices.map(option => option.label).join(", ")})`
  );
  return {
    severity: conflict ? "conflict" : "caution",
    issue: {
      title: conflict ? "Competing work requests" : "Multiple work requests",
      detail: `Separate outcomes requested: ${evidence.join("; ")}. ${conflict ? "Choose one primary outcome and remove or split the other work requests." : "Check that the extra work is essential to the primary outcome."}`,
      ids: [...byProduct.values()].flat().map(option => option.id),
      dimension: "workProducts"
    }
  };
}

function analyzeSelection(options, selectedIds) {
  const selected = options.filter(option => selectedIds.has(option.id));
  const byDimension = new Map();
  selected.flatMap(constraintsFor).forEach(constraint => {
    if (!byDimension.has(constraint.dimension)) byDimension.set(constraint.dimension, []);
    byDimension.get(constraint.dimension).push(constraint);
  });

  const conflicts = [];
  const cautions = [];
  byDimension.forEach((constraints, dimension) => {
    const hard = constraints.filter(constraint => constraint.strength !== "soft");
    const hardConflict = hard.length > 1 && intersectAllowed(hard).size === 0;
    const softTension = !hardConflict && constraints.length > 1 && intersectAllowed(constraints).size === 0;
    if (!hardConflict && !softTension) return;

    const core = minimalIncompatibleSet(hardConflict ? hard : constraints);
    const metadata = dimension.startsWith("choice:")
      ? directionGroups[dimension.slice(7)] || { title: "Choose one direction", subject: "direction" }
      : coherenceDimensions[dimension] || { title: "Incompatible constraints", subject: dimension };
    const detail = dimension.startsWith("choice:")
      ? `${core.map(item => item.option.label).join(" and ")} are alternatives for the same ${metadata.subject}. Uncheck all but one.`
      : `${core.map(item => `${item.option.label} ${item.meaning}`).join('; ')}. No valid ${metadata.subject} satisfies all of them.`;
    const issue = { title: softTension ? metadata.cautionTitle || metadata.title : metadata.title, detail, ids: [...new Set(core.map(item => item.option.id))], dimension };
    (hardConflict ? conflicts : cautions).push(issue);
  });

  const workProducts = analyzeWorkProducts(selected);
  if (workProducts) (workProducts.severity === "conflict" ? conflicts : cautions).push(workProducts.issue);

  if (selected.length >= 12 && !workProducts) {
    cautions.push({
      title: "Broad instruction set",
      detail: `${selected.length} instructions are selected. Check that each one serves the same concrete task and that the prompt has a clear primary outcome.`,
      ids: selected.map(option => option.id),
      dimension: "breadth"
    });
  }

  // Two dimensions can explain the exact same selected pair. Prefer the more
  // specific choice-group explanation while retaining distinct cross-axis issues.
  const distinct = issues => {
    const ranked = [...issues].sort((a, b) => Number(b.dimension.startsWith("choice:")) - Number(a.dimension.startsWith("choice:")));
    const seen = new Set();
    return ranked.filter(issue => {
      const key = [...issue.ids].sort().join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  return { conflicts: distinct(conflicts), cautions: distinct(cautions) };
}
