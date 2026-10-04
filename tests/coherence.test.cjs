const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'docs/catalog.js'), 'utf8') + '\nthis.catalogData = catalog; this.directions = directionGroups;', context);
vm.runInContext(fs.readFileSync(path.join(root, 'docs/coherence.js'), 'utf8') + '\nthis.analyze = analyzeSelection; this.intersect = intersectAllowed; this.core = minimalIncompatibleSet;', context);
const options = context.catalogData.flatMap(tab => tab.options.map(option => ({ ...option, category: tab.name })));
const analyze = ids => context.analyze(options, new Set(ids));
const titles = issues => Array.from(issues, issue => issue.title);

test('catalog has unique IDs and valid constraint values', () => {
  assert.equal(new Set(options.map(option => option.id)).size, options.length);
  const directionLocation = new Map();
  for (const option of options) {
    assert.ok(option.sentences);
    if (option.primaryWorkProduct) assert.equal(option.workProduct, option.primaryWorkProduct);
    if (option.exclusiveWorkProduct) assert.ok(option.primaryWorkProduct);
    if (option.exclusiveGroup) {
      assert.ok(context.directions[option.exclusiveGroup]?.question);
      const location = `${option.category}/${option.group || 'Core'}`;
      if (directionLocation.has(option.exclusiveGroup)) assert.equal(directionLocation.get(option.exclusiveGroup), location);
      else directionLocation.set(option.exclusiveGroup, location);
    }
    for (const constraint of option.constraints || []) {
      assert.ok(constraint.dimension);
      assert.ok(constraint.allowed.length);
      assert.ok(['hard', 'soft'].includes(constraint.strength));
    }
  }
});

test('direction choices cover every catalog tab', () => {
  const tabsWithDirections = new Set(options.filter(option => option.exclusiveGroup).map(option => option.category));
  assert.deepEqual([...tabsWithDirections].sort(), Array.from(context.catalogData, tab => tab.name).sort());
});

test('new direction choices conflict within their dimension', () => {
  for (const [left, right] of [
    ['no-changes', 'one-change'],
    ['one-file', 'allow-multiple-files'],
    ['compare-paths', 'choose-direct-path'],
    ['inspect-codebase', 'inspect-named-paths'],
    ['public-contracts', 'allow-breaking-contracts'],
    ['no-new-dependencies', 'allow-new-dependencies'],
    ['review-working-tree', 'review-named-diff'],
    ['targeted-tests', 'skip-automated-tests'],
    ['commit-changes', 'no-commit'],
    ['push-changes', 'no-push'],
    ['release-deploy', 'no-deploy']
  ]) {
    assert.ok(analyze([left, right]).conflicts.some(issue => issue.dimension.startsWith('choice:')), `${left} / ${right}`);
  }
});

test('cross-tab technical constraints find incompatible directions', () => {
  assert.ok(titles(analyze(['keep-boundaries', 'redesign-scope']).conflicts).includes('Architecture policy conflict'));
  assert.ok(titles(analyze(['skip-automated-tests', 'red-green']).conflicts).includes('Automated test policy conflict'));
  assert.ok(titles(analyze(['no-deploy', 'staged-release']).conflicts).includes('Deployment policy conflict'));
});

test('planning, implementation, and review create competing work requests', () => {
  const result = analyze(['make-changes', 'plan-ahead', 'review-working-tree']);
  assert.ok(titles(result.conflicts).includes('Competing work requests'));
  const issue = result.conflicts.find(item => item.dimension === 'workProducts');
  assert.ok(issue.detail.includes('Make changes'));
  assert.ok(issue.detail.includes('Plan ahead'));
  assert.ok(issue.detail.includes('Review current changes'));
});

test('sequenced work requests remain separate work products', () => {
  const result = analyze(['make-changes', 'plan-ahead', 'implement-plan', 'correctness-review']);
  assert.ok(titles(result.conflicts).includes('Competing work requests'));
});

test('one supporting work product produces a caution', () => {
  const result = analyze(['make-changes', 'plan-ahead']);
  assert.equal(result.conflicts.length, 0);
  assert.ok(titles(result.cautions).includes('Multiple work requests'));
});

test('engineering lenses and delivery steps are not independent work requests', () => {
  const result = analyze(['make-changes', 'system-context', 'api-contract', 'release-summary', 'commit-changes']);
  assert.equal(result.conflicts.length, 0);
  assert.equal(result.cautions.length, 0);
});

test('a supporting architecture view does not turn one review request into a three-way conflict', () => {
  const result = analyze(['make-changes', 'system-context', 'review-working-tree']);
  assert.equal(result.conflicts.length, 0);
  assert.ok(titles(result.cautions).includes('Multiple work requests'));
});

test('planning and release operations can support implementation together', () => {
  const result = analyze(['make-changes', 'plan-ahead', 'release-deploy']);
  assert.equal(result.conflicts.length, 0);
  assert.ok(titles(result.cautions).includes('Multiple work requests'));
});

test('a broad set cannot silently report no issues', () => {
  const ids = options.filter(option => !option.workProduct).slice(0, 12).map(option => option.id);
  const result = analyze(ids);
  assert.ok(result.conflicts.length || result.cautions.length);
});

test('compatible defaults produce no issues', () => {
  const result = analyze(['make-changes', 'inspect-codebase', 'evidence-check']);
  assert.equal(result.conflicts.length, 0);
  assert.equal(result.cautions.length, 0);
});

test('planning or reviewing can explicitly forbid edits', () => {
  assert.equal(analyze(['plan-only', 'no-changes']).conflicts.length, 0);
  assert.equal(analyze(['review-only', 'no-changes']).conflicts.length, 0);
  assert.equal(analyze(['make-changes', 'one-change']).conflicts.length, 0);
});

test('implementation conflicts with a no-edit policy', () => {
  const result = analyze(['make-changes', 'no-changes']);
  assert.deepEqual(titles(result.conflicts), ['Edit requirements conflict']);
});

test('read-only actions conflict with edit instructions across tabs', () => {
  const result = analyze(['no-changes', 'implement-plan']);
  assert.deepEqual(titles(result.conflicts), ['Edit requirements conflict']);
});

test('exactly one edit conflicts with multi-edit work', () => {
  const result = analyze(['one-change', 'full-scope']);
  assert.deepEqual(titles(result.conflicts), ['Edit requirements conflict']);
});

test('soft file-count tension is a caution and not a conflict', () => {
  const result = analyze(['one-file', 'full-scope']);
  assert.equal(result.conflicts.length, 0);
  assert.deepEqual(titles(result.cautions), ['File scope needs review']);
});

test('technical consistency choices conflict', () => {
  const result = analyze(['strong-consistency', 'eventual-consistency']);
  assert.deepEqual(titles(result.conflicts), ['Choose one consistency guarantee']);
});

test('read-only planning conflicts with deployment as a project-state change', () => {
  const result = analyze(['plan-only', 'release-deploy']);
  assert.deepEqual(titles(result.conflicts), ['Project state conflict']);
});

test('intersection catches a collective conflict even when every pair overlaps', () => {
  const constraints = [
    { allowed: ['a', 'b'] },
    { allowed: ['b', 'c'] },
    { allowed: ['a', 'c'] }
  ];
  assert.equal(context.intersect(constraints).size, 0);
  assert.equal(context.core(constraints).length, 3);
});
