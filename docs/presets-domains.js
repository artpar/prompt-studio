// Names credit published methods. Only the selected checkbox sentences are copied.
const uxBuiltInPresets = [
  { id: "don-norman-inspired", name: "Don Norman · understandable journey", description: "Expose possible actions, feedback, recovery, and the user's whole goal.", ids: ["ux-redesign", "ux-conceptual-model", "ux-reframe", "ux-current", "ux-users", "ux-end-to-end", "ux-design-files", "ux-recovery", "ux-review", "ux-flow", "ux-user-needs"] },
  { id: "jakob-nielsen-inspired", name: "Jakob Nielsen · heuristic audit", description: "Inspect usability principles and rank concrete problems.", ids: ["ux-audit", "ux-heuristics", "ux-current", "ux-one-task", "ux-recommend", "ux-review", "ux-prioritize", "ux-findings"] },
  { id: "erika-hall-inspired", name: "Erika Hall · right research question", description: "Challenge assumptions and choose research that informs a decision.", ids: ["ux-research-plan", "ux-reframe", "ux-supplied", "ux-analytics", "ux-evidence-only", "ux-recommend", "ux-no-personas", "ux-test-plan", "ux-measures", "ux-user-needs"] },
  { id: "indi-young-inspired", name: "Indi Young · thinking styles", description: "Study distinct ways people reason toward the same goal.", ids: ["ux-research-plan", "ux-thinking-styles", "ux-reframe", "ux-supplied", "ux-users", "ux-evidence-only", "ux-end-to-end", "ux-recommend", "ux-no-personas", "ux-user-needs", "ux-journey"] },
  { id: "steve-krug-inspired", name: "Steve Krug · obvious next step", description: "Reduce interpretation and plan lean task-based usability checks.", ids: ["ux-audit", "ux-self-evident", "ux-current", "ux-one-task", "ux-recommend", "ux-review", "ux-test-plan", "ux-copy", "ux-findings"] }
];

const uiBuiltInPresets = [
  { id: "brad-frost-inspired", name: "Brad Frost · parts and whole", description: "Build reusable components that work as a coherent interface.", ids: ["ui-build", "ui-componentize", "ui-part-whole", "ui-system", "ui-code", "ui-page", "ui-edit", "ui-all-states", "ui-native", "ui-functional", "ui-component-api"] },
  { id: "dan-mall-inspired", name: "Dan Mall · start from what exists", description: "Audit existing UI, then improve one reusable component.", ids: ["ui-audit", "ui-build", "ui-componentize", "ui-system", "ui-code", "ui-one-component", "ui-edit", "ui-core-states", "ui-functional", "ui-component-api"] },
  { id: "sara-soueidan-inspired", name: "Sara Soueidan · accessible UI", description: "Use native semantics, visible focus, and tested interaction states.", ids: ["ui-build", "ui-code", "ui-specs", "ui-one-component", "ui-edit", "ui-all-states", "ui-native", "ui-focus", "ui-keyboard", "ui-screenreader", "ui-a11y-notes"] },
  { id: "josh-comeau-inspired", name: "Josh W. Comeau · layout diagnosis", description: "Trace CSS layout behavior before repairing responsive failures.", ids: ["ui-fix", "ui-layout-model", "ui-responsive", "ui-code", "ui-system", "ui-one-component", "ui-edit", "ui-functional", "ui-widths", "ui-diff"] },
  { id: "steve-schoger-inspired", name: "Steve Schoger · visual hierarchy", description: "Sharpen emphasis and spacing while keeping the page usable.", ids: ["ui-build", "ui-hierarchy", "ui-code", "ui-content", "ui-system", "ui-page", "ui-edit", "ui-spacing", "ui-functional", "ui-widths", "ui-screens"] }
];

// Keep previously shared preset URLs useful without showing generic sets in the picker.
const legacyUxPresets = [
  { id: "ux-journey-redesign", ids: ["ux-redesign", "ux-map-journey", "ux-current", "ux-supplied", "ux-end-to-end", "ux-design-files", "ux-recovery", "ux-review", "ux-flow", "ux-copy"] },
  { id: "ux-evidence-audit", ids: ["ux-audit", "ux-current", "ux-analytics", "ux-evidence-only", "ux-one-task", "ux-recommend", "ux-no-personas", "ux-review", "ux-prioritize", "ux-findings"] },
  { id: "ux-research-plan", ids: ["ux-research-plan", "ux-reframe", "ux-users", "ux-evidence-only", "ux-one-task", "ux-recommend", "ux-no-personas", "ux-test-plan", "ux-measures", "ux-user-needs"] },
  { id: "ux-prototype-test", ids: ["ux-redesign", "ux-map-journey", "ux-current", "ux-hypotheses", "ux-end-to-end", "ux-prototype", "ux-recovery", "ux-test-plan", "ux-flow", "ux-wireframes"] },
  { id: "ux-content-review", ids: ["ux-critique", "ux-content", "ux-current", "ux-one-task", "ux-recommend", "ux-review", "ux-copy", "ux-findings"] }
];

const legacyUiPresets = [
  { id: "ui-build-page", ids: ["ui-build", "ui-code", "ui-system", "ui-page", "ui-edit", "ui-core-states", "ui-native", "ui-functional", "ui-keyboard", "ui-widths", "ui-brief"] },
  { id: "ui-reference", ids: ["ui-recreate", "ui-design", "ui-system", "ui-code", "ui-page", "ui-edit", "ui-match", "ui-core-states", "ui-visual", "ui-widths", "ui-keyboard", "ui-screens"] },
  { id: "ui-component", ids: ["ui-build", "ui-componentize", "ui-code", "ui-system", "ui-one-component", "ui-edit", "ui-all-states", "ui-native", "ui-functional", "ui-keyboard", "ui-screenreader", "ui-component-api"] },
  { id: "ui-accessibility-audit", ids: ["ui-audit", "ui-code", "ui-specs", "ui-one-component", "ui-no-edit", "ui-functional", "ui-keyboard", "ui-screenreader", "ui-widths", "ui-a11y-notes"] },
  { id: "ui-responsive-repair", ids: ["ui-fix", "ui-responsive", "ui-code", "ui-system", "ui-one-component", "ui-edit", "ui-interpret", "ui-functional", "ui-widths", "ui-diff"] }
];
