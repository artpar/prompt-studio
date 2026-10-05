// UI engineering controls rendered interfaces, component behavior, and checks.
Object.assign(directionGroups, {
  uiFidelity: { question: "How closely should it follow the reference?", subject: "visual direction", title: "Choose one visual direction" },
  uiScope: { question: "What part of the interface may change?", subject: "interface scope", title: "Choose one interface scope" },
  uiArtifact: { question: "May it edit implementation files?", subject: "edit boundary", title: "Choose one edit boundary" },
  uiStates: { question: "How many states should it implement?", subject: "state coverage", title: "Choose one state coverage" },
  uiVisualCheck: { question: "What visual check should it perform?", subject: "visual check", title: "Choose one visual check" },
  uiDetail: { question: "How detailed should its report be?", subject: "report detail", title: "Choose one report detail" }
});

const uiCatalog = [
  { name: "Do what?", description: "Choose the primary UI request and supporting implementation work.", options: [
    o("ui-build", "Build the interface", "Implement the requested screen or component.", "Implement the requested screen or component in its page context. Connect the controls, states, and data needed to complete the task.", "Requested work", { constraints: [c("fileEdits", ["one", "many"], "requires implementation edits")] }),
    o("ui-recreate", "Recreate a reference", "Translate a supplied design into working UI.", "Build the supplied reference in the project. Match its structure, content order, and control behavior within the selected scope and fidelity.", "Requested work", { constraints: [c("fileEdits", ["one", "many"], "requires implementation edits")] }),
    o("ui-audit", "Audit an existing UI", "Find visual and interaction defects.", "Inspect the interface at task steps and viewport sizes. For each defect, name its location, trigger, user effect, and correction.", "Requested work"),
    o("ui-spec", "Specify the interface", "Describe the UI in implementation detail.", "Specify the page structure, control behavior, data states, viewport changes, keyboard actions, and accessible names needed for implementation.", "Requested work"),
    o("ui-fix", "Repair an interface defect", "Trace and correct a visible problem.", "Reproduce the reported defect, trace the render or event path that causes it, change that path, and check the result in the interface.", "Requested work", { constraints: [c("fileEdits", ["one", "many"], "requires implementation edits")] }),
    o("ui-componentize", "Extract reusable components", "Define clear props and responsibilities.", "Extract a component where code repeats or state spans sections. Define its inputs, outputs, state owner, and responsibility.", "Add an action"),
    o("ui-part-whole", "Design parts in page context", "Check components alone and together.", "Render each component alone and on its page. Check that sizing, spacing, and state changes work in both contexts.", "Add an action"),
    o("ui-hierarchy", "Sharpen visual hierarchy", "Make importance clear through weight and contrast.", "Identify the primary action, supporting content, and secondary controls. Use type, contrast, and spacing to show that order in the rendered page.", "Add an action"),
    o("ui-layout-model", "Reason from CSS layout behavior", "Fix the cause of a layout defect.", "Trace the CSS layout mode, intrinsic size, container constraints, and content flow behind the defect. Change the rule that causes it.", "Add an action"),
    o("ui-responsive", "Adapt responsive layout", "Make the interface usable across widths.", "Check where content or controls stop fitting. Reflow the layout while preserving reading order, control access, and touch use.", "Add an action"),
    o("ui-motion", "Design motion behavior", "Use animation to clarify state changes.", "Animate a state change only when motion shows where content went or what changed. Honor reduced-motion settings and preserve use without animation.", "Add an action")
  ]},
  { name: "Use what?", description: "Identify the reference and the implementation system to follow.", options: [
    o("ui-design", "Use supplied design files", "Treat the design as the visual target.", "Read the supplied design or screenshot for layout, type, color, and states. Mark measurements and behaviors the reference does not show.", "References"),
    o("ui-system", "Use the existing design system", "Reuse tokens, components, and patterns.", "Inspect product tokens, components, and interaction patterns before styling. Reuse the matching ones for the new interface.", "Project system"),
    o("ui-code", "Inspect the current UI code", "Follow the relevant component and style path.", "Trace the affected component, styles, state logic, and page use before editing. Identify where the rendered behavior comes from.", "Project system"),
    o("ui-content", "Use realistic content", "Check layout against actual copy lengths.", "Use supplied copy or content with comparable length. Check long labels, errors, and empty data for wrapping and overflow.", "References"),
    o("ui-platform", "Follow platform conventions", "Honor browser and device behavior.", "Keep browser behavior for focus, scrolling, forms, and touch. Name any custom behavior and the task it serves.", "Project system"),
    o("ui-specs", "Check accessibility standards", "Use current WAI guidance.", "Find the WCAG criteria and any WAI pattern for controls in scope. Apply their name, state, keyboard, and feedback rules to the interaction.", "Standards")
  ]},
  { name: "How far?", description: "Set change scope, fidelity, and state coverage.", options: [
    o("ui-one-component", "Change one component", "Keep work to one named component.", "Change the named component and the styles or tests it needs. Report any required edit outside that boundary.", "Interface boundary", { exclusiveGroup: "uiScope" }),
    o("ui-page", "Complete the full page", "Integrate all affected sections.", "Complete each affected page section and the interactions between them. Check layout and controls at narrow and wide widths.", "Interface boundary", { exclusiveGroup: "uiScope" }),
    o("ui-no-edit", "Describe changes only", "Leave implementation files untouched.", "Do not edit implementation files. Put the interface specification or findings in the response.", "Edit boundary", { exclusiveGroup: "uiArtifact", constraints: [c("fileEdits", ["none"], "forbids implementation edits")] }),
    o("ui-edit", "Edit the implementation", "Make the code and styles needed.", "Edit the components, styles, and state logic needed for the interface. Leave code outside the affected path untouched.", "Edit boundary", { exclusiveGroup: "uiArtifact", constraints: [c("fileEdits", ["one", "many"], "requires implementation edits")] }),
    o("ui-match", "Match the reference closely", "Treat visual differences as defects.", "Compare the rendered page with the supplied reference for layout, type, spacing, color, and proportions. Explain changes needed for access or reflow.", "Visual direction", { exclusiveGroup: "uiFidelity" }),
    o("ui-interpret", "Interpret the reference", "Adapt it to the product system.", "Use the reference to guide structure and emphasis. Apply project components, content, and viewport rules; name departures from the reference.", "Visual direction", { exclusiveGroup: "uiFidelity" }),
    o("ui-core-states", "Implement core states only", "Cover normal interaction and a failure path.", "Implement the states needed for the main path: default, active, loading, error, and success where they occur. Leave other states out of scope.", "State coverage", { exclusiveGroup: "uiStates" }),
    o("ui-all-states", "Implement full state matrix", "Cover edge cases and transitions.", "Implement empty, loading, populated, error, disabled, success, and interrupted states where they occur. Connect entry, exit, and recovery actions.", "State coverage", { exclusiveGroup: "uiStates" }),
    o("ui-native", "Prefer native controls", "Keep keyboard and browser behavior.", "Use HTML controls for the action when they fit. For a custom control, implement its keyboard actions, focus, name, role, and state.", "Interaction boundary"),
    o("ui-spacing", "Use a consistent spacing scale", "Avoid arbitrary gaps and ambiguous grouping.", "Use spacing values from the product scale to group related content and separate sections. Remove gaps that imply the wrong grouping.", "Interaction boundary"),
    o("ui-focus", "Make focus and status visible", "Give keyboard and assistive technology users clear feedback.", "Show focus on the control that has it and keep it in view. Present state changes in text and announce changes that need notice.", "Interaction boundary"),
    o("ui-no-deps", "Use the existing stack", "Avoid adding UI dependencies.", "Use the project framework and packages. If a package is required, name the missing capability before adding it.", "Interaction boundary")
  ]},
  { name: "When unsure?", description: "Make design ambiguities and inaccessible directions visible.", options: [
    o("ui-ask", "Ask about critical design gaps", "Pause when missing detail changes behavior.", "Ask when a missing design choice would change control behavior or accessibility. Continue work that does not depend on the answer.", "Missing decisions", { exclusiveGroup: "uncertainty" }),
    o("ui-infer", "Infer from the product system", "Use local patterns for ordinary gaps.", "Fill unspecified states and measurements from project components and patterns. Name choices the supplied design does not settle.", "Missing decisions", { exclusiveGroup: "uncertainty" }),
    o("ui-a11y-conflict", "Flag inaccessible design details", "Explain necessary departures.", "If the reference blocks access, name the element and barrier, then implement or propose a version that preserves the task.", "Design conflicts"),
    o("ui-unknown", "Mark unverified behavior", "Separate implementation from observation.", "Name each viewport, browser, device, or assistive technology you tested. Mark behavior outside that coverage as unverified.", "Design conflicts")
  ]},
  { name: "Stop when?", description: "Choose checks that can verify the rendered interface.", options: [
    o("ui-visual", "Compare rendered UI to the design", "Inspect the result at target sizes.", "Render at the target viewport sizes, compare with the reference, and correct differences in hierarchy, spacing, type, and alignment.", "Visual check", { exclusiveGroup: "uiVisualCheck" }),
    o("ui-functional", "Review rendered UI without a reference", "Inspect usability and consistency.", "Render at narrow and wide widths. Inspect content order, overflow, clipping, and alignment with nearby screens.", "Visual check", { exclusiveGroup: "uiVisualCheck" }),
    o("ui-keyboard", "Check keyboard operation", "Follow focus through each interaction.", "Use a keyboard to reach and activate each control. Check focus order, visibility, escape behavior, and focus traps.", "Interaction checks"),
    o("ui-screenreader", "Check accessible semantics", "Inspect labels, roles, and announcements.", "Inspect control names, roles, states, errors, and announcements. Use assistive technology when available and report what was tested.", "Interaction checks"),
    o("ui-widths", "Check narrow and wide widths", "Catch overflow and layout breaks.", "Check narrow and wide viewports with long content and zoom. Fix clipped controls, page overflow, and order changes that block reading.", "Interaction checks"),
    o("ui-tests", "Run relevant UI tests", "Exercise changed behavior.", "Run tests that exercise changed components or interactions. Report each command, result, and failure.", "Interaction checks", { exclusiveGroup: "tests", constraints: [c("automatedTests", ["run"], "requires automated tests")] }),
    o("ui-skip-tests", "Skip automated UI tests", "Do not run a test command.", "Do not run automated UI tests. State that no UI test command was run.", "Interaction checks", { exclusiveGroup: "tests", constraints: [c("automatedTests", ["skip"], "forbids automated tests")] }),
    o("ui-performance", "Check interaction responsiveness", "Avoid delayed feedback and heavy work.", "Operate the main controls and check when feedback appears. Measure input delay if a response feels slow; report the result.", "Interaction checks")
  ]},
  { name: "Show what?", description: "Choose what the agent must return with the interface.", options: [
    o("ui-brief", "Keep the report concise", "Summarize the result and checks.", "State what the interface now does, which checks ran, and what remains unverified.", "Report detail", { exclusiveGroup: "uiDetail" }),
    o("ui-detailed", "Explain implementation decisions", "Make the component choices reviewable.", "Explain the component boundaries, style choices, interactions, and access behavior needed to review the result.", "Report detail", { exclusiveGroup: "uiDetail" }),
    o("ui-state-list", "Show a state matrix", "List states and transitions.", "List each state, its trigger, visible content, exit action, and recovery path.", "Artifacts"),
    o("ui-component-api", "Show component contracts", "Name inputs, outputs, and responsibilities.", "List component inputs, emitted events, state owner, and the responsibility of each component.", "Artifacts"),
    o("ui-screens", "Provide screenshots", "Show the rendered result when possible.", "Provide screenshots of the rendered interface when capture is available. Name each viewport and distinguish renders from mockups.", "Artifacts"),
    o("ui-a11y-notes", "Report accessibility checks", "List what was tested and what remains.", "List each access check performed, its observed result, and devices or assistive technology still untested.", "Artifacts"),
    o("ui-diff", "Summarize changed files", "Connect code changes to visible effects.", "List changed files and the user-visible behavior each change affects.", "Artifacts")
  ]}
];
