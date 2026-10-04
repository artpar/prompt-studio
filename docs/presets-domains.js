const uxBuiltInPresets = [
  { id: "ux-journey-redesign", name: "Journey redesign", description: "Use the current path and evidence to improve an end-to-end journey.", ids: ["ux-redesign", "ux-map-journey", "ux-current", "ux-supplied", "ux-end-to-end", "ux-design-files", "ux-recovery", "ux-review", "ux-flow", "ux-copy"] },
  { id: "ux-evidence-audit", name: "Evidence-led UX audit", description: "Find and prioritize friction without inventing research.", ids: ["ux-audit", "ux-current", "ux-analytics", "ux-evidence-only", "ux-one-task", "ux-recommend", "ux-no-personas", "ux-review", "ux-prioritize", "ux-findings"] },
  { id: "ux-research-plan", name: "Research plan", description: "Turn open questions into a usable study plan.", ids: ["ux-research-plan", "ux-reframe", "ux-users", "ux-evidence-only", "ux-one-task", "ux-recommend", "ux-no-personas", "ux-test-plan", "ux-measures", "ux-user-needs"] },
  { id: "ux-prototype-test", name: "Prototype for testing", description: "Make an end-to-end concept realistic enough to evaluate.", ids: ["ux-redesign", "ux-map-journey", "ux-current", "ux-hypotheses", "ux-end-to-end", "ux-prototype", "ux-recovery", "ux-test-plan", "ux-flow", "ux-wireframes"] },
  { id: "ux-content-review", name: "Task content review", description: "Improve the words and recovery paths in an existing flow.", ids: ["ux-critique", "ux-content", "ux-current", "ux-one-task", "ux-recommend", "ux-review", "ux-copy", "ux-findings"] }
];

const uiBuiltInPresets = [
  { id: "ui-build-page", name: "Build a complete page", description: "Integrate a responsive page with core states and checks.", ids: ["ui-build", "ui-code", "ui-system", "ui-page", "ui-edit", "ui-core-states", "ui-native", "ui-functional", "ui-keyboard", "ui-widths", "ui-brief"] },
  { id: "ui-reference", name: "Recreate a design", description: "Implement and visually compare a supplied reference.", ids: ["ui-recreate", "ui-design", "ui-system", "ui-code", "ui-page", "ui-edit", "ui-match", "ui-core-states", "ui-visual", "ui-widths", "ui-keyboard", "ui-screens"] },
  { id: "ui-component", name: "Component and states", description: "Build one reusable component with its full behavior.", ids: ["ui-build", "ui-componentize", "ui-code", "ui-system", "ui-one-component", "ui-edit", "ui-all-states", "ui-native", "ui-functional", "ui-keyboard", "ui-screenreader", "ui-component-api"] },
  { id: "ui-accessibility-audit", name: "Accessibility audit", description: "Inspect an interface and report actionable barriers.", ids: ["ui-audit", "ui-code", "ui-specs", "ui-one-component", "ui-no-edit", "ui-functional", "ui-keyboard", "ui-screenreader", "ui-widths", "ui-a11y-notes"] },
  { id: "ui-responsive-repair", name: "Responsive repair", description: "Fix a layout defect and check it across widths.", ids: ["ui-fix", "ui-responsive", "ui-code", "ui-system", "ui-one-component", "ui-edit", "ui-interpret", "ui-functional", "ui-widths", "ui-diff"] }
];
