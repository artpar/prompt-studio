// UX engineering controls the user problem, experience model, and evidence.
Object.assign(directionGroups, {
  uxEvidence: { question: "What evidence may it rely on?", subject: "evidence rule", title: "Choose one evidence rule" },
  uxScope: { question: "How much of the journey should it cover?", subject: "journey scope", title: "Choose one journey scope" },
  uxValidation: { question: "What validation is possible?", subject: "validation rule", title: "Choose one validation rule" },
  uxArtifact: { question: "What may it change or deliver?", subject: "artifact boundary", title: "Choose one artifact boundary" },
  uxDetail: { question: "How detailed should the output be?", subject: "output detail", title: "Choose one output detail" }
});

const uxCatalog = [
  { name: "Do what?", description: "Choose the primary UX request and the work that supports it.", options: [
    o("ux-redesign", "Redesign a user journey", "Improve how a user completes a goal.", "Map the steps to the stated goal. Mark observed friction and inferred risks, then show a revised path and the reason for each change.", "Requested work"),
    o("ux-audit", "Audit an existing experience", "Find consequential usability problems.", "Follow the task through the supplied experience. For each breakdown, name the step, user consequence, evidence, and proposed correction.", "Requested work"),
    o("ux-research-plan", "Plan user research", "Frame questions, participants, and methods.", "State the design decision research must inform. Specify questions, participants, method, tasks, and how findings will inform that decision. Do not claim research occurred.", "Requested work"),
    o("ux-critique", "Critique a proposed UX design", "Review a supplied flow or concept.", "Compare the proposed flow with the user goal and supplied evidence. Name steps that help, steps that block, and changes to test.", "Requested work"),
    o("ux-map-journey", "Map the current journey", "Show steps, handoffs, and breakdowns.", "List the trigger, entry point, actions, decisions, handoffs, exit, and places where users may stop. Mark steps without observations as hypotheses.", "Add an action"),
    o("ux-conceptual-model", "Check the user's mental model", "Make controls and outcomes understandable.", "At each decision, check whether the available action, its result, and system feedback match what users would expect. Identify mismatches and evidence.", "Add an action"),
    o("ux-heuristics", "Apply usability heuristics", "Inspect status, control, consistency, and errors.", "Check status, control, consistency, error prevention, recognition, and recovery at each task step. Tie each finding to a screen or action.", "Add an action"),
    o("ux-thinking-styles", "Compare ways people approach the goal", "Look for behavior patterns without demographic stereotypes.", "Use supplied observations to compare how people approach the goal and where each approach meets friction. Do not assign styles by demographics.", "Add an action"),
    o("ux-self-evident", "Make the next action obvious", "Reduce unnecessary interpretation.", "At each task step, identify the next action, the label that signals it, and the way back from an error. Flag hidden instructions.", "Add an action"),
    o("ux-reframe", "Question the requested solution", "Check the user need behind a feature request.", "State the user problem behind the requested feature. Identify which parts of the feature request lack evidence of user need.", "Add an action"),
    o("ux-compare", "Compare alternative flows", "Assess real tradeoffs for the user.", "Compare paths to the same goal by steps, decisions, error recovery, and access needs. Recommend one and name its tradeoff.", "Add an action"),
    o("ux-content", "Improve task content", "Make labels and guidance support action.", "For each label or message that blocks action, show the current copy when present, replacement copy, and the action it should support.", "Add an action"),
    o("ux-prioritize", "Prioritize UX problems", "Order problems by user impact.", "Rank problems by the task they block, the number of users or steps affected when known, and strength of evidence. Explain ties.", "Add an action")
  ]},
  { name: "Use what?", description: "Tell the agent which UX evidence exists and what it can infer from it.", options: [
    o("ux-supplied", "Use supplied research", "Ground claims in attached findings.", "Cite supplied interviews, observations, or findings behind user claims. Separate what participants did or said from interpretation; name evidence gaps.", "Available evidence"),
    o("ux-analytics", "Use behavioral data", "Examine funnels, search, or support signals.", "Use available funnels, searches, and support reports to locate drop-offs or repeated requests. Treat user motives as hypotheses until observed.", "Available evidence"),
    o("ux-current", "Inspect the current experience", "Follow the actual task path.", "Follow the current task path from entry through completion, error, and return. Record the screen and action at each point of friction.", "Available evidence"),
    o("ux-users", "Include varied user needs", "Account for different abilities and contexts.", "Check how ability, device, language, and context affect the task path. Mark needs supported by evidence and needs still to test.", "Available evidence"),
    o("ux-evidence-only", "Use only observed evidence", "Do not fill research gaps with invented facts.", "Make user claims from supplied or observed evidence. Cite the observation for each claim and list questions the evidence cannot answer.", "Evidence boundary", { exclusiveGroup: "uxEvidence" }),
    o("ux-hypotheses", "Allow explicit hypotheses", "Explore possibilities without presenting them as facts.", "For each claim about users without evidence, label it a hypothesis, state what would confirm it, and keep it out of findings.", "Evidence boundary", { exclusiveGroup: "uxEvidence" }),
    o("ux-constraints", "Use service constraints", "Include policy, operations, and technical limits.", "List supplied policy, operations, and technical limits that shape the journey. Show the step each limit affects and the user cost.", "Available evidence")
  ]},
  { name: "How far?", description: "Set the journey boundary and the form of the deliverable.", options: [
    o("ux-one-task", "Focus on one touchpoint", "Keep the experience boundary narrow.", "Cover the named touchpoint, how users enter it, and where they go next. Include other steps only when they change this touchpoint.", "Journey boundary", { exclusiveGroup: "uxScope" }),
    o("ux-end-to-end", "Cover the end-to-end journey", "Include before and after the screen.", "Cover the trigger, entry, task steps, confirmation, and follow-up, including handoffs between channels that affect completion.", "Journey boundary", { exclusiveGroup: "uxScope" }),
    o("ux-recommend", "Recommend changes only", "Deliver a proposal without modifying artifacts.", "Provide proposed changes and the evidence behind them in the response. Do not edit files or publish a prototype.", "Deliverable boundary", { exclusiveGroup: "uxArtifact", constraints: [c("fileEdits", ["none"], "forbids deliverable edits")] }),
    o("ux-prototype", "Create a testable prototype", "Make enough to test the journey.", "Create a prototype that lets a participant attempt the task, reach completion, and exercise a failure and recovery path.", "Deliverable boundary", { exclusiveGroup: "uxArtifact", constraints: [c("fileEdits", ["one", "many"], "requires deliverable edits")] }),
    o("ux-design-files", "Update the UX artifacts", "Revise flows, copy, or wireframes.", "Update the flow, screen descriptions, and task copy needed to review the proposed journey, including its error and completion states.", "Deliverable boundary", { exclusiveGroup: "uxArtifact", constraints: [c("fileEdits", ["one", "many"], "requires deliverable edits")] }),
    o("ux-ia", "Include information architecture", "Organize content around findability.", "Show content groups, navigation labels, and paths to the task. Identify where users would look for each step and what changed.", "Coverage"),
    o("ux-recovery", "Include failure and recovery", "Design beyond the happy path.", "Show the user action after an error, interruption, or return visit. Preserve entered work where the product permits it.", "Coverage"),
    o("ux-existing-patterns", "Use established patterns", "Reuse familiar interaction patterns.", "Reuse a product or design-system pattern for the same user action. Name any departure and the task need behind it.", "Coverage")
  ]},
  { name: "When unsure?", description: "Handle missing user evidence and decisions explicitly.", options: [
    o("ux-ask", "Ask about critical user facts", "Pause for a decision that changes the journey.", "Ask when the user group, goal, or constraint is unknown and different answers would change the journey. Continue work that can proceed.", "Missing decisions", { exclusiveGroup: "uncertainty" }),
    o("ux-assume", "Proceed with stated assumptions", "Keep ordinary gaps visible.", "State each assumption used to fill a gap, how it affects the journey, and what user evidence could confirm it.", "Missing decisions", { exclusiveGroup: "uncertainty" }),
    o("ux-no-personas", "Do not invent user findings", "Keep claims traceable to evidence.", "Do not invent participant quotes, demographics, test results, or measured gains. Label unsupported user claims as hypotheses.", "Evidence integrity"),
    o("ux-conflict", "Flag user and business tension", "Expose decisions with real tradeoffs.", "When a business rule blocks a user need, show the affected step, user cost, and choices for resolving the rule.", "Evidence integrity")
  ]},
  { name: "Stop when?", description: "Choose a validation level that matches available access.", options: [
    o("ux-review", "Run an expert walkthrough", "Check the journey against realistic tasks.", "Walk through a task from entry to completion and through one failure path. Record where the next action, feedback, or recovery is unclear.", "Validation"),
    o("ux-test-users", "Test with actual users", "Use recruited participants when available.", "If participants are available, give them tasks, observe where they succeed or stop, and revise from the findings. Otherwise, provide a test plan without results.", "Validation"),
    o("ux-test-plan", "Provide a usability test plan", "Specify tasks and success signals.", "Specify participant criteria, task scenarios, observation points, success measures, and the decision each test result will inform. Do not invent results.", "Validation"),
    o("ux-check-needs", "Check inclusive use cases", "Review barriers for varied users.", "Check task steps for barriers involving language, assistive technology, device, connection, or time. Name cases that require participant testing.", "Additional checks"),
    o("ux-measures", "Define task measures", "Make future evaluation possible.", "Define task completion, time, errors, or confidence measures that fit the goal. State how each is collected and what it cannot show.", "Additional checks")
  ]},
  { name: "Show what?", description: "Choose the UX artifacts and explanation the answer must contain.", options: [
    o("ux-brief", "Keep the answer concise", "Lead with the proposed result.", "State the recommendation, evidence behind it, and question still open.", "Answer detail", { exclusiveGroup: "uxDetail" }),
    o("ux-detailed", "Show detailed rationale", "Make each decision reviewable.", "For each design choice, state the user need, evidence, option chosen, option rejected, and consequence.", "Answer detail", { exclusiveGroup: "uxDetail" }),
    o("ux-user-needs", "State user needs", "Express goals as problems to solve.", "State each need as a user goal in context and the obstacle to that goal. Keep proposed features out of the need statement.", "Artifacts"),
    o("ux-flow", "Show a task flow", "Make decisions and branches visible.", "Show entry, actions, decisions, alternate paths, error recovery, and completion for the task.", "Artifacts"),
    o("ux-journey", "Show a journey map", "Connect steps to friction and evidence.", "For each journey step, show the user action, question, friction, and evidence. Mark steps without observed evidence.", "Artifacts"),
    o("ux-wireframes", "Show wireframes", "Describe key screens and states.", "Show each screen needed for the task, its controls, content, states, and the transition triggered by each action.", "Artifacts"),
    o("ux-copy", "Include interface copy", "Write labels, help, and recovery text.", "Write the labels, instructions, confirmations, and error messages at task decisions and recovery points.", "Artifacts"),
    o("ux-findings", "Show prioritized findings", "Tie issues to user impact.", "List findings by impact. For each, name the task step, observation, user consequence, and proposed action.", "Artifacts")
  ]}
];
