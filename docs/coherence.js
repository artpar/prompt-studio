// Evaluate explicit instruction meanings. A clean result means the encoded
// choices are compatible; it cannot prove fit for a task supplied elsewhere.
const coherenceDimensions = {
  fileEdits: { title: "Edit instructions conflict", subject: "edit count" },
  projectState: { title: "Project-state instructions conflict", subject: "project state" },
  automatedTests: { title: "Test instructions conflict", subject: "test policy" },
  commitAction: { title: "Commit instructions conflict", subject: "commit action" }
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

// Return an inclusion-minimal explanation, including collective conflicts.
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
      dimension: "choice:" + option.exclusiveGroup,
      allowed: [option.id],
      strength: "hard",
      meaning: "selects this alternative",
      option
    });
  }
  return result;
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
      : coherenceDimensions[dimension] || { title: "Incompatible instructions", subject: dimension };
    const detail = dimension.startsWith("choice:")
      ? core.map(item => item.option.label).join(" and ") + " answer the same question. Select one."
      : core.map(item => item.option.label + " " + item.meaning).join("; ") +
        ". No " + metadata.subject + " satisfies all of them.";
    const issue = {
      title: softTension ? "Possible tension" : metadata.title,
      detail,
      ids: [...new Set(core.map(item => item.option.id))],
      dimension
    };
    (hardConflict ? conflicts : cautions).push(issue);
  });

  if (selected.length >= 12) {
    cautions.push({
      title: "Many instructions selected",
      detail: selected.length + " choices are active. Check that each one matters for the task you will attach.",
      ids: selected.map(option => option.id),
      dimension: "length"
    });
  }

  // Two dimensions can explain the same selected pair. Keep the clearer
  // alternative-choice explanation and retain distinct cross-branch issues.
  const distinct = issues => {
    const ranked = [...issues].sort((a, b) =>
      Number(b.dimension.startsWith("choice:")) - Number(a.dimension.startsWith("choice:")));
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
