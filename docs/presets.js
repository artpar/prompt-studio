// Presets are selections, not new prompt text. They use the catalog's normal
// prompt assembly and coherence checks, and can be edited after applying.
const builtInPresets = [
  {
    id: "torvalds-inspired",
    name: "Linus Torvalds · focused patch",
    description: "One clear problem, sound data structures, simple code, and a reviewable patch.",
    ids: ["make-changes", "examine-data", "inspect-relevant", "one-problem", "simple-control-flow", "local-conventions", "preserve-behavior", "preserve-interfaces", "relevant-tests", "review-diff", "explain-why"]
  },
  {
    id: "kent-beck-inspired",
    name: "Kent Beck · test first",
    description: "Drive a small change with a failing test, then make it clean.",
    ids: ["make-changes", "inspect-relevant", "red-green", "small-refactor-steps", "relevant-tests", "review-result", "preserve-behavior", "finish-task"]
  },
  {
    id: "martin-fowler-inspired",
    name: "Martin Fowler · safe refactor",
    description: "Restructure in small steps while preserving observable behavior.",
    ids: ["make-changes", "inspect-relevant", "small-refactor-steps", "preserve-behavior", "local-conventions", "relevant-tests", "review-diff", "explain-why"]
  },
  {
    id: "michael-feathers-inspired",
    name: "Michael Feathers · legacy code",
    description: "Characterize existing behavior, find a seam, and change it safely.",
    ids: ["make-changes", "inspect-relevant", "find-seam", "characterize-behavior", "preserve-behavior", "relevant-tests", "review-diff", "report-remaining"]
  },
  {
    id: "simon-brown-inspired",
    name: "Simon Brown · architecture map",
    description: "Make system boundaries and responsibilities visible before deciding.",
    ids: ["plan-only", "inspect-relevant", "use-supplied", "compare-paths", "state-unknowns", "show-system-map", "show-contract", "show-decision"]
  },
  {
    id: "rich-hickey-inspired",
    name: "Rich Hickey · simplify the model",
    description: "Untangle concerns and choose data relationships that reduce complexity.",
    ids: ["make-changes", "examine-data", "separate-concerns", "inspect-relevant", "simple-control-flow", "allow-boundaries", "preserve-behavior", "relevant-tests", "review-diff", "explain-why"]
  },
  {
    id: "trisha-gee-inspired",
    name: "Trisha Gee · purposeful review",
    description: "Review for task fit and human judgment, then report focused findings.",
    ids: ["review-only", "review-purpose", "inspect-relevant", "state-unknowns", "check-edge-cases", "prioritized-findings", "cite-material", "brief-response"]
  }
];

// Retired preset URLs still resolve to their original checkbox sets.
const legacySoftwarePresets = [
  { id: "general-implementation", ids: ["make-changes", "inspect-relevant", "finish-task"] },
  { id: "reproduce-and-repair", ids: ["make-changes", "trace-cause", "inspect-relevant", "reproduce-issue", "preserve-behavior", "finish-task", "relevant-tests", "check-edge-cases", "report-remaining"] },
  { id: "test-first", ids: ["make-changes", "inspect-relevant", "preserve-behavior", "finish-task", "relevant-tests", "red-green", "review-result"] },
  { id: "review-only", ids: ["review-only", "inspect-relevant", "state-unknowns", "prioritized-findings", "cite-material", "brief-response"] },
  { id: "architecture-decision", ids: ["plan-only", "inspect-relevant", "use-supplied", "compare-paths", "state-unknowns", "show-system-map", "show-contract", "show-decision"] }
];

const presetStorageKey = "prompt-builder-presets-v1";

function cleanPreset(raw, validIds, usedIds = new Set()) {
  if (!raw || typeof raw !== "object" || typeof raw.id !== "string" ||
      typeof raw.name !== "string" || !Array.isArray(raw.ids)) return null;
  const id = raw.id.trim();
  const name = raw.name.trim().slice(0, 48);
  if (!/^custom-[a-z0-9-]+$/.test(id) || usedIds.has(id) || !name) return null;
  const ids = [...new Set(raw.ids.filter(value => typeof value === "string" && validIds.has(value)))];
  if (!ids.length) return null;
  return { id, name, description: "Saved on this browser", ids, custom: true };
}

function findMatchingPreset(presets, selection, preferredId) {
  const matches = presets.filter(preset => preset.ids.length === selection.size &&
    preset.ids.every(id => selection.has(id)));
  return matches.find(preset => preset.id === preferredId) || matches[0] || null;
}

function selectionFromQuery(search, validIds, fallbackIds, presets = builtInPresets, legacyPresets = []) {
  const query = new URLSearchParams(search);
  if (query.has('checks')) {
    return { ids: [...new Set(query.get('checks').split(',').filter(id => validIds.has(id)))], presetId: null };
  }
  const preset = presets.find(item => item.id === query.get('preset'));
  if (preset) return { ids: preset.ids, presetId: preset.id };
  const legacy = legacyPresets.find(item => item.id === query.get('preset'));
  return legacy ? { ids: legacy.ids.filter(id => validIds.has(id)), presetId: null } :
    { ids: fallbackIds, presetId: presets[0].id };
}

function selectionURL(href, selection, orderedIds, presets = builtInPresets, catalogId = 'software') {
  const url = new URL(href);
  if (catalogId === 'software') url.searchParams.delete('catalog');
  else url.searchParams.set('catalog', catalogId);
  url.searchParams.delete('preset');
  url.searchParams.delete('checks');
  const builtin = findMatchingPreset(presets, selection);
  if (builtin) url.searchParams.set('preset', builtin.id);
  else url.searchParams.set('checks', orderedIds.filter(id => selection.has(id)).join(','));
  return url.toString();
}
