// The catalog is a visual authoring surface. Its labels and branch names never
// appear in the copied text. A more specific selected instruction can cover a
// redundant one without losing either selection in the UI.
function buildPromptEntries(options, selectedIds) {
  const selected = options.filter(option => selectedIds.has(option.id));
  const covered = new Set(selected.flatMap(option => option.covers || []));
  const entries = [];
  const byText = new Map();
  selected.filter(option => !covered.has(option.id)).forEach(option => {
    const text = option.sentences.trim();
    if (!text) return;
    const duplicate = byText.get(text);
    if (duplicate) duplicate.ids.push(option.id);
    else {
      const entry = { ids: [option.id], text };
      byText.set(text, entry);
      entries.push(entry);
    }
  });
  return entries;
}

function buildPrompt(options, selectedIds) {
  return buildPromptEntries(options, selectedIds).map(entry => entry.text).join("\n\n");
}
