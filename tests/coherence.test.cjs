const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const context = vm.createContext({});
for (const name of ['catalog', 'coherence', 'prompt']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'docs', name + '.js'), 'utf8'), context);
}
const catalog = vm.runInContext('catalog', context);
const directions = vm.runInContext('directionGroups', context);
const options = catalog.flatMap(branch => branch.options.map(option => ({ ...option, category: branch.name })));
const analyze = ids => vm.runInContext('analyzeSelection', context)(options, new Set(ids));
const prompt = ids => vm.runInContext('buildPrompt', context)(options, new Set(ids));
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
