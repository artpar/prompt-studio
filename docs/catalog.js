// Technical prompt dimensions. Each selected option contributes its sentences.
// Coherence metadata: exclusiveGroup, editOnly, multiChange, constraints, and workProduct.
// workProduct is reserved for an independently requested outcome. Supporting
// design views and delivery steps have constraints but do not add work products.
// primaryWorkProduct names an action's main outcome.
const directionGroups = {
  action: { question: "What should the agent deliver?", title: "Choose one primary outcome", subject: "primary outcome" },
  editPolicy: { question: "How many changes may it make?", title: "Choose one edit policy", subject: "edit policy" },
  scope: { question: "How far should changes go?", title: "Choose one scope", subject: "scope" },
  fileScope: { question: "How many files may change?", title: "Choose one file scope", subject: "file scope" },
  autonomy: { question: "When should it ask?", title: "Choose one autonomy style", subject: "autonomy style" },
  response: { question: "How should it explain?", title: "Choose one response style", subject: "response style" },
  approachComparison: { question: "Compare paths or choose directly?", title: "Choose one approach style", subject: "approach style" },
  inspectionScope: { question: "How far should it inspect?", title: "Choose one inspection scope", subject: "inspection scope" },
  architecturePolicy: { question: "May component boundaries change?", title: "Choose one architecture policy", subject: "architecture policy" },
  contractCompatibility: { question: "Must public contracts stay compatible?", title: "Choose one compatibility policy", subject: "compatibility policy" },
  consistency: { question: "Which consistency model fits?", title: "Choose one consistency guarantee", subject: "consistency guarantee" },
  dependencyPolicy: { question: "May it add a dependency?", title: "Choose one dependency policy", subject: "dependency policy" },
  reviewScope: { question: "What should the review cover?", title: "Choose one review scope", subject: "review scope" },
  testPolicy: { question: "How much automated testing?", title: "Choose one test policy", subject: "test policy" },
  commitPolicy: { question: "Should it create a commit?", title: "Choose one commit policy", subject: "commit policy" },
  pushPolicy: { question: "Should it push the branch?", title: "Choose one push policy", subject: "push policy" },
  deployPolicy: { question: "Should it deploy?", title: "Choose one deployment policy", subject: "deployment policy" }
};
const catalog = [
  {
    "name": "Task contract",
    "description": "Set intent, boundaries, autonomy, and response shape.",
    "options": [
      {
        "id": "make-changes",
        "label": "Make changes",
        "detail": "Implement and verify the request.",
        "sentences": "Make the requested changes in the project. Finish the related wiring and verify the result before reporting completion.",
        "group": "Action",
        "exclusiveGroup": "action",
        "constraints": [
          {
            "dimension": "fileEdits",
            "allowed": [
              "one",
              "many"
            ],
            "strength": "hard",
            "meaning": "requires file edits"
          }
        ],
        "workProduct": "implementation",
        "primaryWorkProduct": "implementation"
      },
      {
        "id": "no-changes",
        "label": "Make no changes",
        "detail": "Leave project state untouched.",
        "sentences": "Do not edit files or change project state. Complete the requested analysis, plan, or review in the response, and report any changes that would require a later implementation step.",
        "group": "Edit policy",
        "exclusiveGroup": "editPolicy",
        "constraints": [
          {
            "dimension": "fileEdits",
            "allowed": [
              "none"
            ],
            "strength": "hard",
            "meaning": "forbids file edits"
          },
          {
            "dimension": "projectState",
            "allowed": [
              "unchanged"
            ],
            "strength": "hard",
            "meaning": "requires unchanged project state"
          }
        ]
      },
      {
        "id": "one-change",
        "label": "Make only one change",
        "detail": "Stop after one focused edit.",
        "sentences": "Make exactly one focused change that addresses the stated priority. Do not expand into adjacent fixes; report remaining work separately.",
        "group": "Edit policy",
        "exclusiveGroup": "editPolicy",
        "constraints": [
          {
            "dimension": "fileEdits",
            "allowed": [
              "one"
            ],
            "strength": "hard",
            "meaning": "allows exactly one edit"
          }
        ],
        "workProduct": "implementation"
      },
      {
        "id": "changes-as-needed",
        "label": "Make changes as needed",
        "detail": "Use as many focused edits as correctness requires.",
        "sentences": "Make the related edits needed to complete the task correctly. Keep each change within the requested scope and report any adjacent work that remains separate.",
        "group": "Edit policy",
        "exclusiveGroup": "editPolicy",
        "editOnly": true,
        "workProduct": "implementation"
      },
      {
        "id": "plan-only",
        "label": "Plan only",
        "detail": "Produce a plan without implementing it.",
        "sentences": "Inspect enough context to produce a concrete implementation plan. Do not edit files; include decisions, dependencies, validation, and unresolved questions.",
        "group": "Action",
        "exclusiveGroup": "action",
        "constraints": [
          {
            "dimension": "fileEdits",
            "allowed": [
              "none"
            ],
            "strength": "hard",
            "meaning": "forbids file edits"
          },
          {
            "dimension": "projectState",
            "allowed": [
              "unchanged"
            ],
            "strength": "hard",
            "meaning": "forbids project changes"
          }
        ],
        "workProduct": "plan",
        "primaryWorkProduct": "plan",
        "exclusiveWorkProduct": true
      },
      {
        "id": "review-only",
        "label": "Review only",
        "detail": "Assess existing work without edits.",
        "sentences": "Review the relevant code or diff and report actionable findings with evidence. Do not modify files or implement proposed fixes.",
        "group": "Action",
        "exclusiveGroup": "action",
        "constraints": [
          {
            "dimension": "fileEdits",
            "allowed": [
              "none"
            ],
            "strength": "hard",
            "meaning": "forbids file edits"
          },
          {
            "dimension": "projectState",
            "allowed": [
              "unchanged"
            ],
            "strength": "hard",
            "meaning": "forbids project changes"
          }
        ],
        "workProduct": "review",
        "primaryWorkProduct": "review",
        "exclusiveWorkProduct": true
      },
      {
        "id": "minimal-patch",
        "label": "Smallest viable patch",
        "detail": "Keep the diff narrow.",
        "sentences": "Choose the smallest change that fully resolves the requested behavior. Avoid unrelated cleanup and explain any adjacent change that is genuinely required.",
        "group": "Scope",
        "exclusiveGroup": "scope",
        "editOnly": true,
        "workProduct": "implementation"
      },
      {
        "id": "full-scope",
        "label": "Complete the full feature",
        "detail": "Cover all requested paths and states.",
        "sentences": "Implement the requested feature end to end, including integration points, error states, and necessary documentation. Divide the work into reviewable steps while keeping the overall goal in view.",
        "group": "Scope",
        "exclusiveGroup": "scope",
        "editOnly": true,
        "multiChange": true,
        "constraints": [
          {
            "dimension": "fileCount",
            "allowed": [
              "many"
            ],
            "strength": "soft",
            "meaning": "may need multiple files"
          }
        ],
        "workProduct": "implementation"
      },
      {
        "id": "redesign-scope",
        "label": "Redesign the architecture",
        "detail": "Change boundaries when justified.",
        "sentences": "Reconsider the relevant component boundaries and choose a target design that meets the stated quality goals. Plan migration and compatibility before changing the structure.",
        "group": "Scope",
        "exclusiveGroup": "scope",
        "editOnly": true,
        "multiChange": true,
        "constraints": [
          {
            "dimension": "fileCount",
            "allowed": [
              "many"
            ],
            "strength": "soft",
            "meaning": "may need multiple files"
          },
          {
            "dimension": "architecturePolicy",
            "allowed": [
              "change"
            ],
            "strength": "hard",
            "meaning": "requires changed boundaries"
          }
        ],
        "workProduct": "implementation"
      },
      {
        "id": "one-file",
        "label": "Limit edits to one file",
        "detail": "Keep file scope explicit.",
        "sentences": "Make the implementation change in one file only. If that constraint prevents a correct result, explain the conflict before expanding the file scope.",
        "group": "Scope",
        "exclusiveGroup": "fileScope",
        "editOnly": true,
        "constraints": [
          {
            "dimension": "fileCount",
            "allowed": [
              "one"
            ],
            "strength": "hard",
            "meaning": "limits edits to one file"
          }
        ],
        "workProduct": "implementation"
      },
      {
        "id": "allow-multiple-files",
        "label": "Allow related files to change",
        "detail": "Edit the files needed for a complete result.",
        "sentences": "Change the related files needed for a correct result, including integration points and tests. Keep the set of files focused on this task and explain any expansion of scope.",
        "group": "Scope",
        "exclusiveGroup": "fileScope",
        "editOnly": true,
        "workProduct": "implementation"
      },
      {
        "id": "ask-decisions",
        "label": "Ask at decision points",
        "detail": "Pause for choices that change the outcome.",
        "sentences": "Resolve routine details from the code and stated constraints. Ask for input when a product or architecture choice would materially change the result.",
        "group": "Autonomy",
        "exclusiveGroup": "autonomy"
      },
      {
        "id": "proceed-assumptions",
        "label": "Proceed with assumptions",
        "detail": "Keep momentum on reversible choices.",
        "sentences": "Make reasonable, reversible choices when details are missing. State important assumptions and continue unless a decision would materially change the requested outcome.",
        "group": "Autonomy",
        "exclusiveGroup": "autonomy"
      },
      {
        "id": "concise-output",
        "label": "Keep the answer concise",
        "detail": "Report decisions and evidence briefly.",
        "sentences": "Give a short final report of what happened, what was verified, and any remaining issue. Omit a long narration of routine steps.",
        "group": "Response",
        "exclusiveGroup": "response"
      },
      {
        "id": "teaching-output",
        "label": "Explain the reasoning",
        "detail": "Make the mechanism understandable.",
        "sentences": "Explain the relevant code path and reasoning behind the chosen approach in plain language. Include a small example when it clarifies the behavior.",
        "group": "Response",
        "exclusiveGroup": "response"
      }
    ]
  },
  {
    "name": "Requirements",
    "description": "Define behavior, acceptance, and decisions.",
    "options": [
      {
        "id": "compare-paths",
        "label": "Compare repair paths",
        "detail": "Weigh maintenance, risk, and performance.",
        "sentences": "Identify the viable implementation paths and compare their maintenance cost, compatibility risk, and performance impact. Recommend one path and explain why it fits this codebase.",
        "exclusiveGroup": "approachComparison"
      },
      {
        "id": "choose-direct-path",
        "label": "Choose a direct path",
        "detail": "Skip a broad alternatives comparison.",
        "sentences": "Choose the most direct viable approach from the code and stated constraints. Explain the deciding reason briefly; compare alternatives only if a real tradeoff could change the choice.",
        "exclusiveGroup": "approachComparison"
      },
      {
        "id": "plan-ahead",
        "label": "Plan ahead",
        "detail": "Sequence the work and name its dependencies.",
        "sentences": "Create a concrete implementation plan before editing. Sequence the work so prerequisites come first, and call out migrations, integrations, or release steps that could affect the outcome.",
        "workProduct": "plan"
      },
      {
        "id": "close-gaps",
        "label": "Identify gaps in the plan",
        "detail": "Challenge missing cases before implementation.",
        "sentences": "Critically review the proposed plan for missing behavior, edge cases, and contradictions. Resolve important gaps or mark them as explicit decisions before coding."
      },
      {
        "id": "acceptance-criteria",
        "label": "Write acceptance criteria",
        "detail": "Define observable success.",
        "sentences": "State user-visible behavior, important edge cases, and acceptance criteria. Make each criterion specific enough to verify through a test or direct observation.",
        "group": "Requirements"
      },
      {
        "id": "scope-boundaries",
        "label": "State scope in and out",
        "detail": "Draw a clear task boundary.",
        "sentences": "List what this task includes and excludes. Explain any dependency that must be handled to deliver the included behavior safely.",
        "group": "Requirements"
      },
      {
        "id": "small-milestones",
        "label": "Break work into milestones",
        "detail": "Keep each step reviewable.",
        "sentences": "Break the work into small deliverable milestones with dependencies and verification for each. Keep the steps aligned to the final outcome rather than treating the first step as completion.",
        "group": "Execution",
        "workProduct": "plan"
      }
    ]
  },
  {
    "name": "Codebase & diagnosis",
    "description": "Ground claims in code and observed behavior.",
    "options": [
      {
        "id": "inspect-codebase",
        "label": "Inspect the codebase first",
        "detail": "Read the relevant code and project instructions.",
        "sentences": "Inspect the relevant code, project instructions, and recent changes before proposing a solution. Follow the actual call path and existing conventions instead of guessing how the system works.",
        "exclusiveGroup": "inspectionScope"
      },
      {
        "id": "inspect-named-paths",
        "label": "Inspect only named paths",
        "detail": "Keep investigation inside the supplied files.",
        "sentences": "Limit the initial investigation to the files or modules named in the task. If that boundary prevents a sound conclusion, identify the missing context before expanding the search.",
        "exclusiveGroup": "inspectionScope"
      },
      {
        "id": "reproduce-issue",
        "label": "Reproduce the issue",
        "detail": "Establish what fails before changing it.",
        "sentences": "Try to reproduce the reported behavior using the project's normal setup. Record the input, observed result, and expected result so the failure is concrete."
      },
      {
        "id": "root-cause",
        "label": "Find the root cause",
        "detail": "Test explanations against code and evidence.",
        "sentences": "Investigate plausible causes and test them against the code and observed behavior. Explain the root cause precisely, and distinguish it from symptoms or unrelated issues."
      },
      {
        "id": "map-entry-points",
        "label": "Map entry points",
        "detail": "Find where the behavior begins.",
        "sentences": "Identify the entry points that lead to this behavior and the modules they call. Cite the relevant files and explain which path is active in the reported scenario.",
        "group": "Code paths"
      },
      {
        "id": "find-patterns",
        "label": "Find similar implementations",
        "detail": "Reuse established local solutions.",
        "sentences": "Search for a comparable feature or fix in the repository. Explain which existing pattern applies and where this case differs.",
        "group": "Code paths"
      },
      {
        "id": "baseline",
        "label": "Establish a baseline",
        "detail": "Run checks before the change.",
        "sentences": "Run relevant existing tests or checks before changing anything. Separate pre-existing failures from failures introduced by this task.",
        "group": "Evidence"
      },
      {
        "id": "facts-assumptions",
        "label": "Separate facts and assumptions",
        "detail": "Mark uncertainty explicitly.",
        "sentences": "List facts established by code, documentation, or reproduction. Label assumptions and identify the fastest check for any assumption that could change the solution.",
        "group": "Evidence"
      },
      {
        "id": "research-current",
        "label": "Research current behavior",
        "detail": "Check documentation and external facts when needed.",
        "sentences": "Check the current documentation, code, and any relevant external sources before relying on an assumption. Cite or link the evidence for decisions that depend on behavior outside this repository."
      }
    ]
  },
  {
    "name": "Architecture",
    "description": "Describe structure, runtime paths, and design choices.",
    "options": [
      {
        "id": "system-context",
        "label": "Map system context",
        "detail": "People, external systems, dependencies.",
        "sentences": "Identify the users, external systems, and major dependencies involved in this change. Name each responsibility and support the map with code or documentation.",
        "group": "Structure"
      },
      {
        "id": "ownership",
        "label": "Call out ownership boundaries",
        "detail": "Who owns behavior and data?",
        "sentences": "Identify the component or team that owns each relevant behavior and piece of data. Highlight boundaries where responsibility is unclear or duplicated.",
        "group": "Structure"
      },
      {
        "id": "c4-context",
        "label": "Show a context view",
        "detail": "System and neighboring actors.",
        "sentences": "Show a C4-style system context view at a useful level of detail. Include people, the target system, external systems, and important relationships.",
        "group": "Structure"
      },
      {
        "id": "c4-containers",
        "label": "Show a container view",
        "detail": "Apps, services, and stores.",
        "sentences": "Show the main deployable applications, services, and data stores involved. Label responsibilities and communication paths rather than drawing unexplained boxes.",
        "group": "Structure"
      },
      {
        "id": "component-view",
        "label": "Zoom into components",
        "detail": "Internal boundaries where they matter.",
        "sentences": "Show an internal component view only for the part of the system that drives this decision. Explain the responsibilities and interfaces of the components shown.",
        "group": "Structure"
      },
      {
        "id": "runtime-sequence",
        "label": "Trace runtime sequences",
        "detail": "Success and failure paths.",
        "sentences": "Trace one successful request and one meaningful failure path through the system. Include calls, state changes, sync or async boundaries, retries, and error propagation.",
        "group": "Behavior"
      },
      {
        "id": "deployment-view",
        "label": "Show deployment topology",
        "detail": "Regions, queues, stores, failure domains.",
        "sentences": "Describe the deployment topology relevant to this change, including regions, services, stores, and queues. Identify failure domains and infrastructure assumptions that affect the design.",
        "group": "Behavior"
      },
      {
        "id": "adr",
        "label": "Write a decision record",
        "detail": "Alternatives, consequences, confidence.",
        "sentences": "Compare credible design options against the same criteria. Record the chosen decision, context, rejected alternatives, consequences, and uncertainty in a short ADR.",
        "group": "Decisions"
      },
      {
        "id": "keep-boundaries",
        "label": "Keep current boundaries",
        "detail": "Avoid moving responsibilities between components.",
        "sentences": "Keep the current component and service boundaries for this task. Work within existing ownership seams and explain if a correct solution would require crossing one.",
        "group": "Decisions",
        "exclusiveGroup": "architecturePolicy",
        "constraints": [
          {
            "dimension": "architecturePolicy",
            "allowed": [
              "preserve"
            ],
            "strength": "hard",
            "meaning": "requires existing boundaries"
          }
        ]
      },
      {
        "id": "allow-boundary-changes",
        "label": "Allow boundary changes",
        "detail": "Move ownership when the design justifies it.",
        "sentences": "You may change component or service boundaries when the current ownership obstructs the requested outcome. Explain the new responsibility split and the migration needed for existing callers.",
        "group": "Decisions",
        "exclusiveGroup": "architecturePolicy",
        "constraints": [
          {
            "dimension": "architecturePolicy",
            "allowed": [
              "change"
            ],
            "strength": "hard",
            "meaning": "allows changed boundaries"
          }
        ]
      },
      {
        "id": "simplicity-check",
        "label": "Check design complexity",
        "detail": "Require a reason for abstractions.",
        "sentences": "Explain why each new component, service, or abstraction is needed for current requirements. Choose a simpler design when it meets the same stated quality targets.",
        "group": "Decisions"
      },
      {
        "id": "architecture-audit",
        "label": "Audit architecture and debt",
        "detail": "Find structural issues beyond the immediate diff.",
        "sentences": "Inspect the relevant architecture for coupling, duplicated logic, fragile boundaries, and maintenance debt. Separate urgent defects from longer-term improvements so the next action is clear.",
        "workProduct": "review"
      },
      {
        "id": "module-boundaries",
        "label": "Assess module boundaries",
        "detail": "Cohesion and dependency direction.",
        "sentences": "Identify modules by responsibility and the dependencies between them. Check whether the proposed change creates a cycle, leaks internal details, or places behavior with the wrong owner.",
        "group": "Structure"
      },
      {
        "id": "sync-async",
        "label": "Choose sync or async flow",
        "detail": "Latency, delivery, and failure trade-offs.",
        "sentences": "Compare synchronous and asynchronous communication for this path. Account for latency, delivery guarantees, ordering, retries, operational cost, and the user-visible result.",
        "group": "Behavior"
      }
    ]
  },
  {
    "name": "Interfaces & data",
    "description": "Specify contracts, state, consistency, and migration.",
    "options": [
      {
        "id": "trace-payload",
        "label": "Trace the API and payload",
        "detail": "Follow data through request, logic, and response.",
        "sentences": "Trace the request and payload through each relevant layer, including validation, storage, and response construction. Point to the exact place where actual behavior diverges from intended behavior."
      },
      {
        "id": "api-contract",
        "label": "Define the API contract",
        "detail": "Inputs, errors, auth, compatibility.",
        "sentences": "Specify public inputs, outputs, errors, authentication, idempotency, and versioning. Explain how existing consumers remain compatible during the change.",
        "group": "Contracts"
      },
      {
        "id": "data-invariants",
        "label": "State data invariants",
        "detail": "Ownership, transactions, consistency.",
        "sentences": "Identify the source of truth, data ownership, invariants, and transaction boundaries. Explain how partial failures, concurrent writes, and migration affect those guarantees.",
        "group": "Contracts"
      },
      {
        "id": "concurrency",
        "label": "Analyze concurrency",
        "detail": "Races, duplicate work, ordering.",
        "sentences": "Examine races, duplicate requests, retries, and event ordering. State the required idempotency or locking behavior and how it will be verified.",
        "group": "Contracts"
      },
      {
        "id": "migration-design",
        "label": "Plan migration and coexistence",
        "detail": "Backfill, cutover, old clients.",
        "sentences": "Describe an incremental transition, coexistence period, data backfill, compatibility checks, and cutover criteria. State how behavior parity will be verified.",
        "group": "Decisions"
      },
      {
        "id": "public-contracts",
        "label": "Preserve public contracts",
        "detail": "Protect consumers and stored data.",
        "sentences": "Check callers, API clients, and persisted data before changing a public contract. Provide a compatible transition or a clear migration when a breaking change is necessary.",
        "group": "Guardrails",
        "editOnly": true,
        "exclusiveGroup": "contractCompatibility"
      },
      {
        "id": "allow-breaking-contracts",
        "label": "Allow breaking contract changes",
        "detail": "Name affected consumers and migration.",
        "sentences": "An intentional breaking API or data contract change is allowed for this task. Identify affected consumers, version or migration steps, and the point at which the old contract can be removed.",
        "group": "Guardrails",
        "exclusiveGroup": "contractCompatibility"
      },
      {
        "id": "domain-model",
        "label": "Define the domain model",
        "detail": "Entities, identities, lifecycle.",
        "sentences": "Define the domain entities, their identities, relationships, and lifecycle states. Separate business rules from storage representation and name the owner of each invariant.",
        "group": "Domain model"
      },
      {
        "id": "state-machine",
        "label": "Model state transitions",
        "detail": "Allowed states and invalid moves.",
        "sentences": "List valid states and transitions for the affected workflow. Specify guards, side effects, and how invalid or repeated transitions are handled.",
        "group": "Domain model"
      },
      {
        "id": "strong-consistency",
        "label": "Require strong consistency",
        "detail": "Read-after-write and atomic behavior.",
        "sentences": "Treat the selected data flow as requiring strong consistency. State the transaction boundary, the observable guarantee, and the cost of enforcing it.",
        "group": "Consistency",
        "exclusiveGroup": "consistency"
      },
      {
        "id": "eventual-consistency",
        "label": "Allow eventual consistency",
        "detail": "Define lag and reconciliation.",
        "sentences": "Treat the selected data flow as eventually consistent. State the allowed delay, user-visible interim state, reconciliation process, and failure recovery.",
        "group": "Consistency",
        "exclusiveGroup": "consistency"
      },
      {
        "id": "idempotency",
        "label": "Specify idempotency",
        "detail": "Retries and duplicate requests.",
        "sentences": "Identify operations that may be retried or delivered twice. Define an idempotency key or deduplication strategy and how conflicting repeats are handled.",
        "group": "Contracts"
      },
      {
        "id": "schema-evolution",
        "label": "Plan schema evolution",
        "detail": "Expand, backfill, contract.",
        "sentences": "Plan schema or event changes as an expand, backfill, and contract sequence when existing readers or writers remain active. Define compatibility checks and a safe point for removing the old shape.",
        "group": "Migration"
      },
      {
        "id": "pagination-limits",
        "label": "Define limits and pagination",
        "detail": "Bound queries and payloads.",
        "sentences": "Specify page size, ordering, cursor or offset behavior, and maximum request or response size. Explain how clients handle empty, partial, and changing result sets.",
        "group": "Contracts"
      },
      {
        "id": "contract-tests",
        "label": "Add contract verification",
        "detail": "Check producer and consumer expectations.",
        "sentences": "Verify the interface from both producer and consumer perspectives. Cover required fields, errors, version compatibility, and a representative older client.",
        "group": "Contracts"
      }
    ]
  },
  {
    "name": "Implementation",
    "description": "Control code changes and local engineering choices.",
    "options": [
      {
        "id": "implement-plan",
        "label": "Implement the plan",
        "detail": "Finish the whole requested change.",
        "sentences": "Implement the agreed plan end to end rather than stopping after a partial slice. Keep the project working as you proceed and finish the related wiring, error states, and documentation that the change requires.",
        "editOnly": true,
        "multiChange": true,
        "workProduct": "implementation"
      },
      {
        "id": "preserve-behavior",
        "label": "Preserve existing behavior",
        "detail": "Avoid accidental changes outside the task.",
        "sentences": "Preserve behavior outside the requested scope. Check callers and neighboring flows before changing shared code, and avoid unrelated refactors that make the result harder to review.",
        "editOnly": true
      },
      {
        "id": "reuse-patterns",
        "label": "Use the project’s patterns",
        "detail": "Build on existing components and test setup.",
        "sentences": "Use the repository's established architecture, utilities, components, and test framework when they fit. Avoid one-off infrastructure or dependencies when the project already has a suitable path.",
        "editOnly": true
      },
      {
        "id": "no-new-dependencies",
        "label": "Add no new dependencies",
        "detail": "Use the existing stack and platform APIs.",
        "sentences": "Use dependencies and platform facilities already present in the project. Do not add a package or service; explain if that constraint blocks a sound implementation.",
        "group": "Dependencies",
        "exclusiveGroup": "dependencyPolicy"
      },
      {
        "id": "allow-new-dependencies",
        "label": "Allow a justified dependency",
        "detail": "Compare it with facilities already available.",
        "sentences": "You may add a dependency if it materially improves the solution. Compare it with existing facilities and justify its maintenance, security, and deployment cost before adding it.",
        "group": "Dependencies",
        "exclusiveGroup": "dependencyPolicy"
      },
      {
        "id": "performance-priority",
        "label": "Make performance a priority",
        "detail": "Check the cost of the chosen design.",
        "sentences": "Treat performance as a design constraint for this change. Inspect hot paths, unnecessary allocations or requests, and the cost of the proposed solution; measure where practical before claiming an improvement.",
        "editOnly": true
      },
      {
        "id": "explicit-errors",
        "label": "Handle errors explicitly",
        "detail": "Cover expected failure states.",
        "sentences": "Handle expected failures with clear errors and safe state transitions. Avoid swallowing errors or presenting success after a partial failure.",
        "group": "Guardrails",
        "editOnly": true
      },
      {
        "id": "accessibility",
        "label": "Include accessibility",
        "detail": "Keyboard, labels, contrast, feedback.",
        "sentences": "Make interactive UI usable with keyboard and assistive technology. Check labels, focus behavior, contrast, and status feedback for the changed flow.",
        "group": "Quality",
        "editOnly": true
      },
      {
        "id": "update-docs",
        "label": "Update relevant documentation",
        "detail": "Keep usage and design guidance accurate.",
        "sentences": "Update documentation that users or maintainers rely on for the changed behavior. Correct statements that no longer match the implementation.",
        "group": "Quality",
        "editOnly": true,
        "workProduct": "implementation"
      }
    ]
  },
  {
    "name": "Quality & risk",
    "description": "Examine security, reliability, performance, and review findings.",
    "options": [
      {
        "id": "capacity",
        "label": "Estimate workload and capacity",
        "detail": "Traffic, growth, bottlenecks.",
        "sentences": "State expected traffic, data size, growth, and latency needs. Make a rough capacity estimate, identify likely bottlenecks, and name assumptions that would force a different design.",
        "group": "Quality"
      },
      {
        "id": "quality-targets",
        "label": "Set measurable quality targets",
        "detail": "Latency, availability, recovery.",
        "sentences": "State relevant latency, availability, durability, freshness, or recovery targets. Use those targets to judge the proposed design rather than vague claims of scalability.",
        "group": "Quality"
      },
      {
        "id": "failure-design",
        "label": "Design failure behavior",
        "detail": "Timeouts, overload, degradation.",
        "sentences": "Describe timeouts, retries, overload, dependency outage, and recovery behavior. State what may degrade and which functions must remain available.",
        "group": "Quality"
      },
      {
        "id": "threat-model",
        "label": "Mark security boundaries",
        "detail": "Assets, trust, threats, controls.",
        "sentences": "Identify sensitive assets, attacker-controlled entry points, data flows, and trust boundaries. Prioritize plausible threats and the controls that address them.",
        "group": "Quality"
      },
      {
        "id": "observability",
        "label": "Design observability",
        "detail": "Metrics, logs, traces, alerts.",
        "sentences": "Define the metrics, logs, traces, and alerts needed to operate this change. Explain how an operator will distinguish a healthy system from a regression.",
        "group": "Quality"
      },
      {
        "id": "risk-debt",
        "label": "Record risks and debt",
        "detail": "Known weak spots and open decisions.",
        "sentences": "List important risks, unresolved decisions, and technical debt created or exposed by this design. Give each a consequence and a practical follow-up.",
        "group": "Decisions"
      },
      {
        "id": "review-working-tree",
        "label": "Review current changes",
        "detail": "Include staged, unstaged, and untracked files.",
        "sentences": "Review the current code changes, including staged, unstaged, and untracked files. Read enough surrounding code to understand how each change interacts with existing behavior.",
        "workProduct": "review",
        "exclusiveGroup": "reviewScope"
      },
      {
        "id": "review-named-diff",
        "label": "Review only the named diff",
        "detail": "Keep findings inside the supplied scope.",
        "sentences": "Review only the diff or files explicitly named in the task. Read surrounding code only as needed to judge those changes, and note when missing context limits a conclusion.",
        "exclusiveGroup": "reviewScope",
        "workProduct": "review"
      },
      {
        "id": "prioritized-findings",
        "label": "Give prioritized findings",
        "detail": "Lead with actionable defects and evidence.",
        "sentences": "Report discrete, actionable findings in priority order. For each finding, identify the affected behavior and the code or evidence that supports it; avoid speculative or cosmetic noise.",
        "workProduct": "review"
      },
      {
        "id": "review-docs",
        "label": "Review docs and spec",
        "detail": "Keep claims aligned with implementation.",
        "sentences": "Review the relevant documentation and specification alongside the code. Identify statements contradicted by actual behavior, propose corrections, and note gaps that still need a decision.",
        "workProduct": "review"
      },
      {
        "id": "correctness-review",
        "label": "Check correctness and regressions",
        "detail": "Trace changed behavior through callers.",
        "sentences": "Check whether the change implements the requested behavior and preserves affected existing paths. Look for missing branches, bad state transitions, and unsupported assumptions.",
        "group": "Review lens",
        "workProduct": "review"
      },
      {
        "id": "security-review",
        "label": "Review security and privacy",
        "detail": "Check trust boundaries and data handling.",
        "sentences": "Inspect attacker-controlled inputs, authorization checks, sensitive data handling, and new exposure paths. Report plausible risks with a concrete path to impact.",
        "group": "Review lens",
        "workProduct": "review"
      },
      {
        "id": "performance-review",
        "label": "Review performance impact",
        "detail": "Find expensive paths and scaling risks.",
        "sentences": "Inspect queries, loops, network calls, and resource use affected by the change. Explain the workload under which a suspected performance issue would matter.",
        "group": "Review lens",
        "workProduct": "review"
      },
      {
        "id": "latency-budget",
        "label": "Allocate a latency budget",
        "detail": "End-to-end and tail latency.",
        "sentences": "Set an end-to-end latency target and allocate budget across the main calls. Examine p95 or p99 behavior and the effect of retries or fan-out on the tail.",
        "group": "Performance"
      },
      {
        "id": "capacity-cost",
        "label": "Estimate capacity and cost",
        "detail": "Load, storage, and unit economics.",
        "sentences": "Estimate peak traffic, storage growth, and resource cost under stated assumptions. Identify the scaling limit and the measurement that would validate the estimate.",
        "group": "Performance"
      },
      {
        "id": "recovery-objectives",
        "label": "Set recovery objectives",
        "detail": "RTO, RPO, and backup checks.",
        "sentences": "State acceptable recovery time and data loss for the affected workload. Connect backup, replication, and restore tests to those targets.",
        "group": "Reliability"
      },
      {
        "id": "privacy-lifecycle",
        "label": "Map sensitive data lifecycle",
        "detail": "Collection through deletion.",
        "sentences": "Identify sensitive data collected, stored, logged, shared, and deleted by this flow. Minimize exposure and define retention and access boundaries.",
        "group": "Security"
      },
      {
        "id": "failure-matrix",
        "label": "Build a failure matrix",
        "detail": "Dependency failure and degraded modes.",
        "sentences": "List relevant failure modes and the expected response for each, including timeout, duplicate work, stale data, and partial outage. Include detection and recovery signals.",
        "group": "Reliability"
      }
    ]
  },
  {
    "name": "Validation",
    "description": "Specify evidence that would prove the result.",
    "options": [
      {
        "id": "targeted-tests",
        "label": "Run relevant tests",
        "detail": "Use the repository’s established test framework.",
        "sentences": "Run targeted tests for the changed behavior and the project's relevant build or type checks. Add regression coverage when it would catch a real failure, using the existing test framework.",
        "exclusiveGroup": "testPolicy",
        "constraints": [
          {
            "dimension": "automatedTestExecution",
            "allowed": [
              "yes"
            ],
            "strength": "hard",
            "meaning": "runs automated tests"
          }
        ]
      },
      {
        "id": "full-test-suite",
        "label": "Run the full test suite",
        "detail": "Include broad regression coverage.",
        "sentences": "Run the project's full available automated test suite and relevant build or type checks. Report the scope, failures, and any suite that could not be run.",
        "exclusiveGroup": "testPolicy",
        "constraints": [
          {
            "dimension": "automatedTestExecution",
            "allowed": [
              "yes"
            ],
            "strength": "hard",
            "meaning": "runs automated tests"
          }
        ]
      },
      {
        "id": "skip-automated-tests",
        "label": "Skip automated tests",
        "detail": "State what remains unverified.",
        "sentences": "Do not run or add automated tests for this task. Use inspection or a manual check where practical, and state clearly which behavior remains unverified.",
        "exclusiveGroup": "testPolicy",
        "constraints": [
          {
            "dimension": "automatedTestExecution",
            "allowed": [
              "no"
            ],
            "strength": "hard",
            "meaning": "forbids automated tests"
          }
        ]
      },
      {
        "id": "real-flow",
        "label": "Check a real user flow",
        "detail": "Use the app or API, not only isolated code.",
        "sentences": "Exercise the primary user flow through a real local app, server, or API when the environment allows it. Verify the actual response and state change rather than inferring success from code inspection alone.",
        "constraints": [
          {
            "dimension": "projectState",
            "allowed": [
              "changed"
            ],
            "strength": "soft",
            "meaning": "may change runtime data"
          }
        ]
      },
      {
        "id": "evidence-check",
        "label": "Back claims with evidence",
        "detail": "Report exactly what was verified.",
        "sentences": "Report the commands or actions used to verify the result and what they showed. Do not claim a reproduction, test pass, or deployment unless it actually happened."
      },
      {
        "id": "edge-cases",
        "label": "Test important edge cases",
        "detail": "Check boundaries and failure paths.",
        "sentences": "Check the inputs and states most likely to break the implementation, including relevant empty, invalid, and error cases. Explain any material case that remains unverified."
      },
      {
        "id": "red-green",
        "label": "Use red/green tests",
        "detail": "Show failure before the fix.",
        "sentences": "Add a focused test that fails for the expected reason before implementing the fix. Make it pass with the change, then rerun nearby regression tests.",
        "group": "Automated",
        "editOnly": true,
        "workProduct": "implementation",
        "constraints": [
          {
            "dimension": "automatedTestExecution",
            "allowed": [
              "yes"
            ],
            "strength": "hard",
            "meaning": "requires automated tests"
          }
        ]
      },
      {
        "id": "integration-test",
        "label": "Verify the integration path",
        "detail": "Cross module and service boundaries.",
        "sentences": "Test behavior across relevant components or service boundaries. Verify the contract, state changes, and failure path rather than only an isolated helper.",
        "group": "Automated",
        "constraints": [
          {
            "dimension": "automatedTestExecution",
            "allowed": [
              "yes"
            ],
            "strength": "hard",
            "meaning": "requires automated tests"
          }
        ]
      },
      {
        "id": "failure-injection",
        "label": "Test failure behavior",
        "detail": "Exercise timeouts and partial failure.",
        "sentences": "Simulate a relevant dependency failure, timeout, or duplicate request. Confirm the system responds and recovers as the design requires.",
        "group": "Observed"
      },
      {
        "id": "requirements-check",
        "label": "Check acceptance criteria",
        "detail": "Map outcomes to the request.",
        "sentences": "Map each acceptance criterion to a test, observed behavior, or documented limitation. Identify any requested behavior that remains unverified.",
        "group": "Reporting"
      }
    ]
  },
  {
    "name": "Operations",
    "description": "Plan rollout, recovery, and handoff.",
    "options": [
      {
        "id": "rollout-design",
        "label": "Plan rollout and rollback",
        "detail": "Stages, health signals, reversal.",
        "sentences": "Define staged rollout steps, canary health signals, abort thresholds, and rollback actions. Identify what must be reversible and who will operate the release.",
        "group": "Decisions"
      },
      {
        "id": "status-handoff",
        "label": "Summarize what remains",
        "detail": "Show the current state and next action.",
        "sentences": "Summarize what is complete, what remains, and any blocker. Keep the handoff concrete so the next person can continue without reconstructing the whole session."
      },
      {
        "id": "commit-changes",
        "label": "Commit the changes",
        "detail": "Create a reviewable commit after checks.",
        "sentences": "After verifying the requested work, commit the relevant changes with a clear message. Confirm which files are included and leave unrelated work untouched.",
        "constraints": [
          {
            "dimension": "projectState",
            "allowed": [
              "changed"
            ],
            "strength": "hard",
            "meaning": "creates a commit"
          }
        ],
        "exclusiveGroup": "commitPolicy"
      },
      {
        "id": "no-commit",
        "label": "Do not commit",
        "detail": "Leave the working tree for review.",
        "sentences": "Do not create a commit for this task. Leave the relevant changes in the working tree and report what was changed and verified.",
        "exclusiveGroup": "commitPolicy"
      },
      {
        "id": "push-changes",
        "label": "Push the branch",
        "detail": "Send the verified commit to its remote.",
        "sentences": "Push the verified commit to the intended remote branch. Confirm the push succeeded and report the branch and commit for review.",
        "constraints": [
          {
            "dimension": "projectState",
            "allowed": [
              "changed"
            ],
            "strength": "hard",
            "meaning": "changes the remote branch"
          }
        ],
        "exclusiveGroup": "pushPolicy"
      },
      {
        "id": "no-push",
        "label": "Do not push",
        "detail": "Keep the branch local.",
        "sentences": "Do not push commits or branches to a remote. Report the local branch and commit state so the user can decide when to publish it.",
        "exclusiveGroup": "pushPolicy"
      },
      {
        "id": "release-deploy",
        "label": "Release or deploy",
        "detail": "Follow the project’s actual delivery path.",
        "sentences": "Follow the project's established release or deployment process for this change. Verify the resulting version or deployment status before reporting it as shipped.",
        "constraints": [
          {
            "dimension": "projectState",
            "allowed": [
              "changed"
            ],
            "strength": "hard",
            "meaning": "changes the deployment"
          },
          {
            "dimension": "deployment",
            "allowed": [
              "yes"
            ],
            "strength": "hard",
            "meaning": "requires deployment"
          }
        ],
        "exclusiveGroup": "deployPolicy"
      },
      {
        "id": "no-deploy",
        "label": "Do not deploy",
        "detail": "Stop before a release or production change.",
        "sentences": "Do not release or deploy this change. Prepare any requested release information locally and report what would still be needed to ship it.",
        "exclusiveGroup": "deployPolicy",
        "constraints": [
          {
            "dimension": "deployment",
            "allowed": [
              "no"
            ],
            "strength": "hard",
            "meaning": "forbids deployment"
          }
        ]
      },
      {
        "id": "release-summary",
        "label": "Write release notes",
        "detail": "Describe user-visible changes.",
        "sentences": "Summarize user-visible changes, compatibility considerations, and any migration step. Keep the release note accurate to what was actually verified.",
        "group": "Handoff"
      },
      {
        "id": "runbook",
        "label": "Prepare an operations runbook",
        "detail": "Give operators useful steps.",
        "sentences": "Document operational checks, common failure signals, and recovery actions for this change. Include the owner and where to find relevant dashboards or logs.",
        "group": "Handoff"
      },
      {
        "id": "staged-release",
        "label": "Use a staged rollout",
        "detail": "Start small and watch signals.",
        "sentences": "Roll out in stages or behind a flag when the project supports it. Watch agreed health signals at each stage before increasing exposure.",
        "group": "Release",
        "constraints": [
          {
            "dimension": "deployment",
            "allowed": [
              "yes"
            ],
            "strength": "hard",
            "meaning": "requires deployment"
          }
        ]
      },
      {
        "id": "rollback",
        "label": "Define rollback",
        "detail": "Know the reversal path.",
        "sentences": "Specify how to reverse the release and what data or state cannot be rolled back automatically. State the signal that should trigger rollback.",
        "group": "Release"
      }
    ]
  }
];
