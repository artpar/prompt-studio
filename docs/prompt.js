// The catalog is a visual authoring surface. Its labels and branch names never
// appear in the copied text. A more specific selected instruction can cover a
// redundant one without losing either selection in the UI.
function buildPrompt(options, selectedIds) {
  const selected = options.filter(option => selectedIds.has(option.id));
  const covered = new Set(selected.flatMap(option => option.covers || []));
  const paragraphs = selected
    .filter(option => !covered.has(option.id))
    .map(option => option.sentences.trim())
    .filter(Boolean);
  return [...new Set(paragraphs)].join("\n\n");
}
