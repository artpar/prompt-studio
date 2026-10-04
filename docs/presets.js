// Presets are selections, not new prompt text. They use the catalog's normal
// prompt assembly and coherence checks, and can be edited after applying.
const builtInPresets = [
  {
    id: "general-implementation",
    name: "General implementation",
    description: "Inspect the relevant code, make the requested change, and finish it.",
    ids: ["make-changes", "inspect-relevant", "finish-task"]
  },
  {
    id: "torvalds-inspired",
    name: "Torvalds-inspired patch",
    description: "One clear problem, sound data structures, simple code, and a reviewable patch.",
    ids: ["make-changes", "examine-data", "inspect-relevant", "one-problem", "simple-control-flow", "local-conventions", "preserve-behavior", "preserve-interfaces", "relevant-tests", "review-diff", "explain-why"]
  },
  {
    id: "reproduce-and-repair",
    name: "Reproduce and repair",
    description: "Observe a defect, find its cause, fix it, and check the failure path.",
    ids: ["make-changes", "trace-cause", "inspect-relevant", "reproduce-issue", "preserve-behavior", "finish-task", "relevant-tests", "check-edge-cases", "report-remaining"]
  },
  {
    id: "test-first",
    name: "Test first",
    description: "Use a failing focused test to guide an implementation.",
    ids: ["make-changes", "inspect-relevant", "preserve-behavior", "finish-task", "relevant-tests", "red-green", "review-result"]
  },
  {
    id: "review-only",
    name: "Review without edits",
    description: "Inspect the work and return prioritized, sourced findings.",
    ids: ["review-only", "inspect-relevant", "state-unknowns", "prioritized-findings", "cite-material", "brief-response"]
  },
  {
    id: "architecture-decision",
    name: "Architecture decision",
    description: "Compare approaches and document a design without changing files.",
    ids: ["plan-only", "inspect-relevant", "use-supplied", "compare-paths", "state-unknowns", "show-system-map", "show-contract", "show-decision"]
  }
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

function selectionFromQuery(search, validIds, fallbackIds, presets = builtInPresets) {
  const query = new URLSearchParams(search);
  if (query.has('checks')) {
    return { ids: [...new Set(query.get('checks').split(',').filter(id => validIds.has(id)))], presetId: null };
  }
  const preset = presets.find(item => item.id === query.get('preset'));
  return preset ? { ids: preset.ids, presetId: preset.id } :
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
