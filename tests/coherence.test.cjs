const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const context = vm.createContext({ URL, URLSearchParams });
for (const name of ['catalog', 'coherence', 'prompt', 'presets']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'docs', name + '.js'), 'utf8'), context);
}
const catalog = vm.runInContext('catalog', context);
const directions = vm.runInContext('directionGroups', context);
const options = catalog.flatMap(branch => branch.options.map(option => ({ ...option, category: branch.name })));
const analyze = ids => vm.runInContext('analyzeSelection', context)(options, new Set(ids));
const prompt = ids => vm.runInContext('buildPrompt', context)(options, new Set(ids));
const presets = vm.runInContext('builtInPresets', context);
const hasConflict = (ids, dimension) => analyze(ids).conflicts.some(item => item.dimension === dimension);

test('catalog branches describe prompt behavior and every option has a unique home', () => {
  assert.deepEqual(Array.from(catalog, branch => branch.name), [
    'Do what?', 'Use what?', 'How far?', 'When unsure?', 'Stop when?', 'Show what?'
  ]);
  assert.equal(new Set(options.map(item => item.id)).size, options.length);
  for (const item of options) {
    assert.ok(item.label && item.detail && item.sentences && item.group);
    assert.ok(!item.sentences.includes(item.category));
    if (item.exclusiveGroup) assert.ok(directions[item.exclusiveGroup]?.question);
    for (const covered of item.covers || []) assert.ok(options.some(other => other.id === covered));
    for (const constraint of item.constraints || []) {
      assert.ok(constraint.dimension && constraint.allowed.length);
      assert.ok(['hard', 'soft'].includes(constraint.strength));
    }
  }
});

test('planning, finding plan gaps, reviewing, and implementing can form one request', () => {
  const result = analyze(['make-changes', 'plan-ahead', 'critique-plan', 'review-result', 'finish-task']);
  assert.equal(result.conflicts.length, 0);
  assert.equal(result.cautions.length, 0);
});

test('a supplied plan can be critiqued without asking the model to create one', () => {
  const text = prompt(['critique-plan']);
  assert.match(text, /If a plan is supplied or produced/);
  assert.doesNotMatch(text, /outline the necessary steps/);
});

test('specific output requests can accompany an implementation', () => {
  const ids = ['make-changes', 'show-system-map', 'show-contract', 'show-decision'];
  assert.equal(analyze(ids).conflicts.length, 0);
  assert.match(prompt(ids), /services, and data stores/);
});

test('plan only absorbs redundant plan and no-change directions', () => {
  const ids = ['plan-only', 'plan-ahead', 'no-changes', 'show-plan'];
  assert.equal(analyze(ids).conflicts.length, 0);
  assert.equal(prompt(ids), options.find(item => item.id === 'plan-only').sentences);
});

test('edit permissions conflict with actions requiring edits', () => {
  assert.ok(hasConflict(['make-changes', 'no-changes'], 'fileEdits'));
  assert.ok(hasConflict(['plan-only', 'one-change'], 'fileEdits'));
  assert.ok(hasConflict(['review-only', 'red-green'], 'fileEdits'));
  assert.equal(analyze(['make-changes', 'one-change']).conflicts.length, 0);
});

test('alternatives conflict within their own question', () => {
  for (const ids of [
    ['make-changes', 'plan-only'],
    ['no-changes', 'one-change'],
    ['ask-decisions', 'proceed-assumptions'],
    ['relevant-tests', 'skip-tests'],
    ['brief-response', 'detailed-response']
  ]) {
    assert.ok(analyze(ids).conflicts.some(item => item.dimension.startsWith('choice:')), ids.join(' / '));
  }
});

test('cross-branch effects detect real contradictions', () => {
  assert.ok(hasConflict(['skip-tests', 'red-green'], 'automatedTests'));
  assert.ok(hasConflict(['plan-only', 'deploy'], 'projectState'));
  assert.ok(hasConflict(['no-changes', 'commit-changes'], 'projectState'));
  assert.ok(hasConflict(['no-commit', 'push-changes'], 'commitAction'));
  assert.equal(analyze(['make-changes', 'plan-ahead', 'commit-changes', 'push-changes']).conflicts.length, 0);
});

test('many compatible choices prompt review without claiming a conflict', () => {
  const ids = [
    'make-changes', 'plan-ahead', 'critique-plan', 'trace-cause', 'review-result',
    'inspect-relevant', 'use-supplied', 'reproduce-issue', 'search-current',
    'prefer-primary', 'use-examples', 'finish-task'
  ];
  const result = analyze(ids);
  assert.equal(result.conflicts.length, 0);
  assert.ok(result.cautions.some(item => item.dimension === 'length'));
});

test('prompt contains only selected instruction text in branch order', () => {
  const ids = ['make-changes', 'brief-response', 'show-system-map'];
  const text = prompt(ids);
  assert.ok(text.indexOf('Implement the requested result') < text.indexOf('Keep the final response concise'));
  assert.ok(text.indexOf('Keep the final response concise') < text.indexOf('Show the relevant applications'));
  assert.doesNotMatch(text, /Do what\?|Show what\?|Specific outputs|Main request/);
});

test('minimal incompatible set can expose a collective conflict', () => {
  const intersect = vm.runInContext('intersectAllowed', context);
  const core = vm.runInContext('minimalIncompatibleSet', context);
  const constraints = [
    { allowed: ['a', 'b'] },
    { allowed: ['b', 'c'] },
    { allowed: ['a', 'c'] }
  ];
  assert.equal(intersect(constraints).size, 0);
  assert.equal(core(constraints).length, 3);
});

test('built-in presets refer to known checks and have no encoded conflicts', () => {
  const known = new Set(options.map(option => option.id));
  assert.ok(presets.some(preset => preset.id === 'torvalds-inspired'));
  assert.equal(new Set(presets.map(preset => preset.id)).size, presets.length);
  for (const preset of presets) {
    assert.ok(preset.name && preset.description && preset.ids.length);
    assert.equal(new Set(preset.ids).size, preset.ids.length, preset.name);
    for (const id of preset.ids) assert.ok(known.has(id), `${preset.name}: ${id}`);
    assert.equal(analyze(preset.ids).conflicts.length, 0, preset.name);
    assert.ok(prompt(preset.ids).length > 0);
  }
});

test('Torvalds-inspired preset means one problem, not one file or one edit', () => {
  const preset = presets.find(item => item.id === 'torvalds-inspired');
  assert.ok(preset.ids.includes('one-problem'));
  assert.ok(preset.ids.includes('examine-data'));
  assert.ok(preset.ids.includes('simple-control-flow'));
  assert.ok(preset.ids.includes('review-diff'));
  assert.ok(preset.ids.includes('preserve-interfaces'));
  assert.ok(preset.ids.includes('explain-why'));
  assert.ok(!preset.ids.includes('one-change'));
  assert.ok(!preset.ids.includes('one-file'));
});

test('custom presets are cleaned and exact selection matching honors the active preset', () => {
  const clean = vm.runInContext('cleanPreset', context);
  const match = vm.runInContext('findMatchingPreset', context);
  const valid = new Set(options.map(option => option.id));
  const saved = clean({ id: 'custom-example', name: '  My preset  ', ids: ['make-changes', 'make-changes', 'missing'] }, valid);
  assert.equal(saved.name, 'My preset');
  assert.deepEqual(Array.from(saved.ids), ['make-changes']);
  assert.equal(match([saved], new Set(['make-changes']), saved.id).id, saved.id);
  assert.equal(match([saved], new Set(['make-changes', 'finish-task'])), null);
  assert.equal(clean({ id: 'invalid', name: 'X', ids: ['make-changes'] }, valid), null);
});

test('built-in and edited selections have portable deep links', () => {
  const parse = vm.runInContext('selectionFromQuery', context);
  const link = vm.runInContext('selectionURL', context);
  const ordered = options.map(option => option.id);
  const valid = new Set(ordered);
  const torvalds = presets.find(item => item.id === 'torvalds-inspired');
  const builtInURL = link('https://example.test/app/?old=1', new Set(torvalds.ids), ordered);
  assert.match(builtInURL, /preset=torvalds-inspired/);
  assert.ok(!builtInURL.includes('checks='));
  assert.deepEqual(Array.from(parse(new URL(builtInURL).search, valid, []).ids), Array.from(torvalds.ids));
  const customURL = link('https://example.test/app/', new Set(['make-changes', 'review-diff']), ordered);
  assert.match(customURL, /checks=/);
  assert.deepEqual(Array.from(parse(new URL(customURL).search, valid, []).ids), ['make-changes', 'review-diff']);
  assert.deepEqual(Array.from(parse('?checks=missing,make-changes,make-changes', valid, []).ids), ['make-changes']);
  assert.deepEqual(Array.from(parse('?checks=', valid, torvalds.ids).ids), []);
});
