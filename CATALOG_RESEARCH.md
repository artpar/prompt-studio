# Prompt catalog research

Historical exploration: this document describes the earlier engineering-topic catalog. The current prompt behavior framework and catalog rules are in [PROMPT_FRAMEWORK.md](PROMPT_FRAMEWORK.md).

Research date: 2026-10-04. Scope: software development prompts for coding agents. This is a synthesis of documented practices and practitioner examples, not a survey of how often developers use each style. The checkbox wording below is original and intended for the prompt builder.

## Personal log audit as a wording check

I scanned all 1,358 available Codex session JSONL files (about 8.1 GB) for user-authored messages. After exact deduplication, removing structured review boilerplate and environment blocks, and limiting this phrase check to messages under 1,500 characters, 6,154 distinct prompts remained. Counts below are **prompts containing a normalized theme**, not counts of an exact quoted phrase or estimates of general developer usage.

| Theme in a prompt | Distinct prompts |
| --- | ---: |
| Test or tests | 347 |
| Commit | 283 |
| Implement or implementation | 275 |
| Verify or validate | 261 |
| Fix | 255 |
| Prompt or prompts | 245 |
| UI or interface | 209 |
| Research or web search | 161 |
| Review | 111 |
| Deploy or publish | 98 |
| Architecture or system design | 59 |

The raw frequent phrases were dominated by paths and repeated review boilerplate. This audit is useful for checking familiar wording and ensuring common operations are covered. It does not determine the tabs or imply that these frequencies represent other users. The external sources below supply the broader range of engineering approaches.

After removing paths and looking only at short verb-led fragments, recurring literal phrases included “commit push” (36 prompts), “plan ahead” (29), “make the changes” (26), “research and plan” (24), “review the code” (18), and “update docs” (15). These are fragment counts after filtering, not a complete ranking of user intent; repeated project workflows can dominate them.

## What different approaches emphasize

| Style | Typical instruction | Useful when | Source |
| --- | --- | --- | --- |
| Direct task | State the requested behavior, relevant files, constraints, and done condition; let the agent act. | Small, clear changes. | [GitHub Copilot prompt guidance](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/prompting/prompt-engineering), [OpenAI task-specific guidance](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) |
| Discuss, then edit | Explore the code and compare options before switching to implementation. | Requirements or solution are uncertain. | [Aider ask/code modes](https://aider.chat/docs/usage/modes.html) |
| Spec first | Write user-visible behavior and acceptance criteria; clarify ambiguity; make a plan and small tasks. | Multi-file features and handoffs. | [GitHub Spec Kit](https://github.github.com/spec-kit/reference/agentic-sdd.html), [Addy Osmani](https://addyosmani.com/blog/good-spec/) |
| Maintained prompt artifact | Keep requirements, domain model, approach, structure, operations, norms, and safeguards versioned with code. | Repeated team delivery in one domain. | [Thoughtworks SPDD](https://martinfowler.com/articles/structured-prompt-driven/) |
| Architecture first | Document context, boundaries, runtime scenarios, deployment, quality goals, and risks before major changes. | System shape or ownership is changing. | [arc42](https://arc42.org/overview/), [C4 model](https://c4model.com/diagrams) |
| Decision record | Compare credible alternatives and record the chosen option, context, consequences, and confidence. | A consequential technical choice. | [Martin Fowler on ADRs](https://martinfowler.com/bliki/ArchitectureDecisionRecord.html) |
| Test first | Run a baseline; add a test that fails for the intended reason; implement until it passes. | Behavior can be specified with focused tests. | [Simon Willison: first run tests](https://simonwillison.net/guides/agentic-engineering-patterns/first-run-the-tests/), [red/green TDD](https://simonwillison.net/guides/agentic-engineering-patterns/red-green-tdd/) |
| Evidence first | Reproduce the issue, trace the relevant path, and support the diagnosis with code and observed behavior. | Bugs with uncertain causes. | [GitHub codebase exploration](https://docs.github.com/en/enterprise-cloud@latest/copilot/tutorials/explore-a-codebase), [Simon Willison: manual testing](https://feeds.simonwillison.net/guides/agentic-engineering-patterns/agentic-manual-testing/) |
| Reviewer | Inspect a diff for correctness, design, security, performance, tests, and actionable findings. | Reviewing existing changes. | [GitHub review prompt](https://docs.github.com/en/copilot/tutorials/customization-library/prompt-files/review-code), [Google engineering review](https://google.github.io/eng-practices/review/reviewer/looking-for.html) |
| Production and operations | State service targets, load, failure modes, monitoring, rollout, and rollback. | Changes to a live service. | [Google SRE system design](https://sre.google/workbook/non-abstract-design/), [canary releases](https://sre.google/workbook/canarying-releases/) |
| Threat model | Map assets, data flows, entry points, trust boundaries, threats, and mitigations. | Sensitive data or expanded attack surface. | [OWASP threat modeling](https://community.owasp.org/Threat_Modeling_Process) |
| Migration | Preserve behavior while moving behind an interface or replacing a component in stages. | Legacy replacement or data movement. | [Martin Fowler: Strangler Fig](https://martinfowler.com/bliki/OriginalStranglerFigApplication.html), [OpenAI: code modernization](https://developers.openai.com/cookbook/examples/codex/code_modernization) |

These are selectable **approaches**, not a single mandatory workflow. Some can be combined: a spec-first feature may also need threat modeling and a rollout plan. Others need a clear mode distinction: “plan only” and “implement now” should not both control the same generated prompt.

## Direction and constraint model

A prompt choice needs a relationship type, not just a checkbox label. [Feature-oriented domain analysis](https://www.sei.cmu.edu/library/feature-oriented-domain-analysis-foda-feasibility-study/) provides a useful distinction between alternative and optional features; the builder applies that idea to instructions rather than software products. [OpenAI's Codex usage guide](https://openai.com/business/guides-and-resources/how-openai-uses-codex/) likewise separates planning in Ask mode from implementation in Code mode for larger changes.

| Relationship | Meaning in this builder | Example | UI and coherence behavior |
| --- | --- | --- | --- |
| Alternative direction | Different answers to one decision | Implement / plan only / review only | One nested checklist for the dimension; selecting two produces an explicit conflict. |
| Additive lens | A concern that can accompany another instruction | Threat model plus API contract | Independent checkbox; combination is allowed unless a specific constraint conflicts. |
| Requirement or exclusion | One option needs or forbids a state selected elsewhere | Plan only forbids file edits | Cross-dimension constraint check, with the incompatible choices named. |
| Separate work request | Another independently requested outcome | A written implementation plan, code changes, review findings | Count distinct outcomes and flag a competing request when they exceed the chosen primary outcome. |
| Supporting artifact | Material used to make or explain the main outcome | A context diagram or API contract for an implementation | Keep it in the generated prompt without counting it as a second primary task. |
| Delivery operation | An action on the completed work | Commit, push, deploy | Check state-changing constraints without counting the operation as another work product. |

The catalog now has direction sets in every tab:

| Tab | Direction sets |
| --- | --- |
| Task contract | Primary outcome, edit policy, change scope, file scope, autonomy, response depth |
| Requirements | Compare approaches or choose a direct path |
| Codebase & diagnosis | Inspect relevant code or only named paths |
| Architecture | Preserve or change component boundaries |
| Interfaces & data | Preserve or intentionally break contracts; strong or eventual consistency |
| Implementation | Forbid or permit a justified new dependency |
| Quality & risk | Review the working tree or only a named diff |
| Validation | Targeted tests, full suite, or no automated tests |
| Operations | Commit or leave uncommitted; push or stay local; deploy or stop before deployment |

These choices render the same way wherever they appear. Visual nesting is a property of the dimension: it does not mean one option logically contains another. **Task outcome and edit policy are orthogonal:** “Plan only” and “Make no changes” reinforce one another; “Make changes” and “Make only one change” can coexist. Cross-dimension constraints catch genuine incompatibilities: a boundary-preservation choice conflicts with a redesign request; skipping automated tests conflicts with red/green testing; and forbidding deployment conflicts with a staged rollout. New direction families should be modeled with clear choice cardinality and cross-dimension constraints before adding checkboxes. Do not auto-generate a “do not” variant for every instruction: many instructions are additive lenses, and a negative variant would add noise without expressing a real decision.

The initial catalog tagged almost every architecture output as a `plan` and every release step as a `release` work product. That produced false conflicts: implementing a feature while showing a context view and committing it is one coherent request. The catalog now reserves `workProduct` for independent requests such as producing a plan, changing code, or reporting review findings. Supporting architecture and interface descriptions remain selectable, and commit/push/deploy are checked through their state constraints. This is a modeling decision for this builder, not a claim that an architecture view can never be a standalone deliverable.

## Prompt construction framework

The checkbox builder supplies reusable instructions about how to proceed and what evidence to return. The actual task is supplied separately when the generated instructions are used. This separates task-specific facts from general preferences, as illustrated by [GitHub's guidance to give Copilot relevant context](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/prompting/prompt-engineering) and [Spec Kit's required feature description](https://github.github.com/spec-kit/reference/workflows.html). The builder does not infer a task from selected checkboxes.

| Layer | Question answered | Current representation |
| --- | --- | --- |
| Task | What concrete behavior, defect, design question, or diff matters? | Supplied by the user outside the builder. |
| Primary outcome | Should the agent implement, plan, or review? | One action direction. |
| Permissions and boundaries | May it edit, how much, where, and may it commit, push, or deploy? | Separate direction sets and hard constraints. |
| Engineering approach | What evidence, design views, safeguards, and quality targets matter? | Additive checkboxes across technical tabs. |
| Verification | Which tests or observations count as evidence? | Validation choices and constraints. |
| Response | How should decisions, findings, and remaining work be reported? | Response direction set and selected sentence bundles. |

The order of paragraphs in a prompt is not itself a conflict rule. A plan followed by implementation can be sensible, as [Spec Kit's workflow](https://github.github.com/spec-kit/reference/workflows.html) demonstrates. A prompt can still be overloaded if it independently demands a full plan, an implementation, and review findings in one response. The builder labels that a competing work request rather than claiming the sequence is impossible. A single extra work request is a caution; multiple extras without an unambiguous primary outcome are a conflict. The user can split the task or remove a requested outcome.

The checker has three mechanisms. Alternatives in one dimension allow at most one direction. Cross-dimension hard constraints are intersected; an empty intersection is a conflict, while a soft mismatch is a caution. Separate requested outcomes are counted by type. For an empty intersection, the evaluator reports an inclusion-minimal set of selected instructions that explains it, including cases where three constraints conflict even though every pair overlaps. This follows the general [feature-model idea of alternatives and cross-tree constraints](https://www.sei.cmu.edu/library/feature-oriented-domain-analysis-foda-feasibility-study/) and the [minimal-unsatisfiable-subset literature](https://arxiv.org/abs/1402.3011); our small in-browser evaluator is a domain-specific implementation, not a full SAT solver.

The check is intentionally bounded. It evaluates encoded catalog semantics, not the meaning of arbitrary task text or facts about an unseen repository. “No modeled conflicts found” therefore means the selected metadata is satisfiable, not that the final prompt is guaranteed coherent. False positives deserve catalog fixes, and new real contradictions need constraints or a new dimension with examples on both sides.

## Worked combinations

| Selection | Result | Reason |
| --- | --- | --- |
| Plan only + Make no changes | Compatible | Outcome and edit policy reinforce each other. |
| Make changes + Make only one change | Compatible | Implementation is allowed within a one-edit limit. |
| Make changes + Make no changes | Conflict | Required edits and forbidden edits have no common state. |
| Make changes + context diagram + API contract + commit | Compatible | Design views support the implementation; committing is a delivery operation. |
| Make changes + Plan ahead | Caution | A separate plan is requested alongside implementation; the user may intend it as a supporting artifact. |
| Make changes + Plan ahead + Review current changes | Conflict | Three independent outcomes are requested in one task. |
| Plan only + deploy | Conflict | A read-only outcome cannot also change deployment state. |
| Skip automated tests + red/green regression test | Conflict | One option forbids the execution the other requires. |

## Proposed catalog

The current builder organizes choices by technical concern: Task contract, Requirements, Codebase & diagnosis, Architecture, Interfaces & data, Implementation, Quality & risk, Validation, and Operations. The workflow sections below remain a research inventory of candidate prompts, not a prescription for tab names. The earlier workflow-tab proposal was superseded after user feedback.

### Approach

| Checkbox | Effect on generated prompt |
| --- | --- |
| Direct and concise | Ask for the smallest complete solution and a compact final report. |
| Discuss before editing | Examine relevant code, offer options, then wait for a choice if the choice materially changes scope. |
| Spec first | State actors, behavior, scope, exclusions, acceptance criteria, and unresolved questions. |
| Plan first | Produce ordered tasks, dependencies, validation, and risks before implementation. |
| Implement now | Make the change, verify it, and report results. |
| Architecture first | Establish current context and target boundaries before selecting implementation steps. |
| Test first | Capture current behavior and add a failing regression test before the fix. |
| Debug from evidence | Reproduce, isolate, explain cause, fix, and rerun the reproducer. |
| Review only | Inspect changes and report prioritized findings with precise locations; make no edits. |
| Teach as you go | Explain the relevant flow and decisions in plain language. |
| Long-running goal | Define an outcome, verification surface, constraints, and a way to resume across sessions. |
| Time-boxed spike | Explore a limited question, report what was learned, and identify a decision or next experiment. |

The last two styles draw on [OpenAI's goal guidance](https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex) and the wider planning patterns above. A time-boxed spike is this report's proposed prompt-builder synthesis.

### Architecture and system design

Use these as conditional callouts. The structure/behavior/decision split follows [C4](https://c4model.com/diagrams), [arc42](https://arc42.org/overview/), [Google SRE](https://sre.google/workbook/non-abstract-design/), and [Fowler's ADR guidance](https://martinfowler.com/bliki/ArchitectureDecisionRecord.html).

| Checkbox | Questions the agent should answer |
| --- | --- |
| System context | Who uses the system? Which external systems, teams, and dependencies matter? |
| Ownership boundaries | Which component owns each behavior and piece of data? Where are the seams? |
| C4 context view | Show people, the target system, and external systems at a useful zoom. |
| C4 container view | Show deployable applications and stores, their responsibilities, and communication paths. |
| Component view | Zoom into a container only where internal boundaries affect the decision. |
| Runtime sequence | Trace the main success path and an important failure path, including state changes. |
| Deployment topology | Show regions, services, stores, queues, and failure domains when deployment affects the choice. |
| API contract | Define inputs, outputs, errors, auth, idempotency, versioning, and compatibility. |
| Data model and invariants | Name entities, ownership, constraints, transaction boundaries, and consistency needs. |
| Concurrency and ordering | Examine races, duplicate work, ordering, retries, and replay behavior. |
| Workload and capacity | State traffic, data size, growth, bottlenecks, and rough capacity calculations. |
| Quality targets | State measurable latency, availability, durability, freshness, and recovery targets. |
| Failure and degradation | Explain timeout, backpressure, partial outage, fallback, and recovery behavior. |
| Security boundaries | Mark untrusted inputs, sensitive data, authz boundaries, threats, and mitigations. |
| Operational visibility | Define metrics, logs, traces, alerts, and what success or failure looks like in production. |
| Alternatives and trade-offs | Compare credible designs against the same criteria and record a decision. |
| Constraints and assumptions | Separate facts from assumptions; name cost, team, platform, and compliance constraints. |
| Migration and compatibility | Plan coexistence, backfill, cutover, old-client support, and parity checks. |
| Rollout and rollback | Define staged release, canary signal, abort threshold, and reversal path. |
| Risks and technical debt | List known risks, unresolved decisions, and debt introduced by the chosen path. |
| Simplicity check | Ask whether the proposed abstraction or service boundary earns its cost for the current scope. |

Specific source support: C4's [diagram set](https://c4model.com/diagrams) covers context, containers, components, dynamic, and deployment views. [Google's API design guide](https://docs.cloud.google.com/apis/design) covers interface conventions, errors, versioning, and backward compatibility. [Google SRE](https://sre.google/workbook/non-abstract-design/) illustrates checking a design against load and service targets. [AWS Well-Architected](https://docs.aws.amazon.com/wellarchitected/latest/framework/definitions.html) supplies operational, security, reliability, performance, cost, and sustainability lenses. [OWASP](https://community.owasp.org/Threat_Modeling_Process) covers data flows and trust boundaries. [Google SRE's canary guidance](https://sre.google/workbook/canarying-releases/) supports staged release and rollback signals.

#### Draft sentence bundles for architecture checkboxes

Each bundle can become one checkbox value. These are original paraphrases, not quotations from the sources.

1. **Map system context.** “Identify the users, external systems, and major dependencies involved in this change. Name the component that owns each relevant responsibility, and point to code or documentation that supports the map.”
2. **Show useful architecture views.** “Show a context or container diagram at the smallest level that explains the decision. Add a component, runtime, or deployment view only when it resolves a specific uncertainty.”
3. **Trace the runtime path.** “Walk through one successful request and one meaningful failure path. Include calls, state changes, synchronous and asynchronous boundaries, retries, and error propagation.”
4. **Define the contract.** “Specify the public inputs, outputs, error cases, authentication requirements, and compatibility rules. Explain how existing consumers continue to work during the change.”
5. **Protect data invariants.** “Identify the source of truth, ownership of each field, invariants, and transaction boundaries. Explain how partial failure, concurrent writes, and migration affect them.”
6. **Quantify scale.** “State expected traffic, payload and data growth, latency targets, and a rough capacity estimate. Identify which assumption would force a different design.”
7. **Design for failure.** “Describe timeout, retry, duplicate, overload, and dependency outage behavior. State what degrades, what must remain available, and how the system recovers.”
8. **Threat model.** “Identify assets, attacker-controlled entry points, sensitive data flows, and trust boundaries. Prioritize plausible threats and the controls that address them.”
9. **Compare options.** “Present two or three credible designs against the same criteria. Record the chosen option, rejected alternatives, consequences, and uncertainty in a short decision record.”
10. **Plan the migration.** “Describe an incremental transition, coexistence period, data backfill, compatibility checks, and cutover criteria. State how behavior parity will be verified.”
11. **Plan operations.** “Define the metrics, logs, and traces needed to distinguish a healthy rollout from a regression. Specify canary stages, abort signals, rollback steps, and who operates the change.”
12. **Check complexity.** “Explain why each new component or abstraction is needed now. Prefer a simpler design when it meets the stated requirements and quality targets.”

### Investigate

Add: **Map entry points**, **Trace data flow**, **Find similar patterns**, **Reproduce failure**, **Establish baseline**, **Separate fact from assumption**, **Identify constraints and owners**. These align with [GitHub's codebase exploration examples](https://docs.github.com/en/enterprise-cloud@latest/copilot/tutorials/explore-a-codebase), [Aider's advice to provide relevant context](https://aider.chat/docs/usage/tips.html), and [Simon Willison's baseline-testing pattern](https://simonwillison.net/guides/agentic-engineering-patterns/first-run-the-tests/).

### Plan

Add: **User story and acceptance criteria**, **Scope in/out**, **Clarifying questions**, **Compare approaches**, **Design review**, **Milestones and dependencies**, **Risk register**, **Definition of done**, **Decision record**. Sources: [Spec Kit](https://github.github.com/spec-kit/reference/agentic-sdd.html), [Addy Osmani](https://addyosmani.com/blog/good-spec/), [Thoughtworks SPDD](https://martinfowler.com/articles/structured-prompt-driven/).

### Build

Add: **Small reviewable increments**, **Follow repository conventions**, **Preserve public contracts**, **Handle errors explicitly**, **Concurrency safety**, **Accessibility**, **Minimal dependencies**, **Update documentation**, **Keep change scoped**. Sources: [GitHub Copilot prompting](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/prompting/prompt-engineering), [Google code review criteria](https://google.github.io/eng-practices/review/reviewer/looking-for.html).

### Review

Add: **Correctness and regression**, **Architecture fit**, **Interface compatibility**, **Security/privacy**, **Performance**, **Operational impact**, **Maintainability**, **Test quality**, **Prioritized findings with file locations**. Sources: [GitHub's review prompt](https://docs.github.com/en/copilot/tutorials/customization-library/prompt-files/review-code), [Google review practices](https://google.github.io/eng-practices/review/reviewer/looking-for.html).

### Verify

Add: **Baseline before change**, **Red/green regression**, **Happy and edge cases**, **Integration path**, **Manual UI/API exercise**, **Observed output**, **Failure injection**, **Performance check**, **Requirements traceability**. Sources: [Simon Willison's testing patterns](https://simonwillison.net/guides/agentic-engineering-patterns/), [Aider's lint/test loop](https://aider.chat/docs/usage/lint-test.html), [Spec Kit's requirements checklist](https://github.github.com/spec-kit/reference/agentic-sdd.html).

### Ship

Add: **Release summary**, **Migration steps**, **Feature flag/staged rollout**, **Canary health**, **Rollback**, **Monitoring and alerts**, **Handoff/runbook**, **Open risks and follow-ups**. Sources: [Google SRE canary releases](https://sre.google/workbook/canarying-releases/), [AWS Well-Architected](https://docs.aws.amazon.com/wellarchitected/latest/framework/definitions.html).

## Next research and product questions

1. Test catalog combinations against real tasks and record false positives and missed contradictions. The current metadata is a transparent model, not a substitute for semantic evaluation of free text.
2. Decide whether a separate plan should be a caution or a conflict when implementation is primary. The current caution keeps “plan before coding” available, while a third independent review request makes the bundle a conflict.
3. Consider presets only after observing useful recurring combinations. Presets should populate the same visible checkboxes so their effects remain inspectable.
4. Keep the builder focused on reusable instructions. The user supplies task context when using the copied prompt; the catalog must not invent it.
5. Keep architecture callouts conditional. For a CSS fix, a full C4/ADR/rollout packet is wasted effort. For a service split or data migration, those views may be central. This selective use follows the tailoring advice in [arc42](https://arc42.org/overview/) and [OpenAI's task-specific prompt guidance](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra).
