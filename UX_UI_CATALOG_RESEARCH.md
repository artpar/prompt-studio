# UX and UI prompt catalogs

These catalogs are parallel ways to build instructions for a later task. They do not try to encode a complete professional workflow. The six tab names stay the same across catalogs because each tab answers a predictable question about the **prompt**: requested action, inputs, boundary, uncertainty, checks, and output. The options within each tab differ by discipline.

## UX engineering

The UX catalog focuses on the user's goal and the experience around it. Its primary requests are redesign, audit, research plan, and critique. Supporting actions include mapping a journey, questioning a proposed solution, comparing paths, improving content, and prioritizing friction. This placement follows the [GOV.UK guidance on learning user needs](https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs), which distinguishes a user's problem from a suggested solution and points to interviews, observation, analytics, search logs, and support data as inputs. The [GOV.UK user research overview](https://www.gov.uk/service-manual/user-research) covers research and usability methods, while its [research planning guidance](https://www.gov.uk/service-manual/user-research/plan-user-research-for-your-service) calls for focused questions and recruitment decisions.

The *Use what?* branch separates supplied findings, behavioral data, the current experience, varied user needs, and service constraints. The two evidence directions are deliberately distinct: stay within observed evidence or form labeled, testable hypotheses. Neither permits fabricated participant quotes or test results. [W3C's user stories](https://www.w3.org/WAI/people-use-web/user-stories/) support including different abilities and contexts; they are examples, not evidence about a particular product's users.

The *How far?* branch distinguishes a single touchpoint from a whole journey, and recommendations from artifacts or a testable prototype. These are independent choices where they can coexist. [GOV.UK's guidance on mapping the whole problem](https://www.gov.uk/service-manual/design/map-a-users-whole-problem) and [prototyping](https://www.gov.uk/service-manual/design/making-prototypes) support those boundaries. A prototype is described as an artifact for learning, not automatically a production implementation.

The *Stop when?* branch offers a walkthrough, a plan for usability testing, and testing with actual users if access exists. They can be combined; the checker does not flag them as competing methods. [GOV.UK's usability benchmarking guidance](https://www.gov.uk/service-manual/measuring-success/usability-benchmarking-a-website-or-whole-service) supports task completion, time, and other observed measures. The prompt text explicitly prohibits reporting a test as performed when participants were unavailable.

The *Show what?* branch offers user needs, task flows, journey maps, wireframes, interface copy, and prioritized findings. These are output formats rather than competing stages.

## UI engineering

The UI catalog focuses on the rendered interface and implementation behavior. Its primary requests are build, recreate a visual reference, audit, specify, and repair. *Use what?* covers design files, existing components and tokens, UI code, realistic content, platform conventions, and accessibility standards. Reusing established patterns is informed by the [GOV.UK Design System patterns](https://design-system.service.gov.uk/patterns/) and [MDN's guidance on semantic HTML](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML).

*How far?* controls component versus page scope, edit permission, fidelity to a reference, state coverage, native controls, and dependency boundaries. State coverage includes loading, error, empty, success, and recovery where applicable. The distinct "core states only" and "full state matrix" options are genuine alternatives. Native controls and custom widget obligations follow the [WAI ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/about/introduction/) and [MDN form controls guidance](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_forms).

*When unsure?* asks the agent to infer ordinary gaps from the local product system, ask about consequential missing decisions, and flag inaccessible design instructions. *Stop when?* covers visual comparison, keyboard use, semantics, viewport behavior, tests, and interaction responsiveness. These checks come from [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [WAI interface patterns](https://www.w3.org/WAI/ARIA/apg/patterns/), [web.dev responsive design guidance](https://web.dev/learn/design/welcome), and [web.dev's INP guidance](https://web.dev/articles/inp). The catalog does not turn a visual inspection into an unverified accessibility or performance claim.

*Show what?* offers a state matrix, component contract, screenshots, accessibility results, and changed-file summary. The screenshot instruction asks for a rendered result at a named viewport, not a mockup labeled as tested output.

## Coherence decisions

The existing constraint intersection checks alternatives within a question and cross-branch edit/test conflicts. We kept independent actions compatible: a UX audit, research plan, and redesign can be requested together; a redesign can be recommendation-only; an expert walkthrough can accompany a usability test plan; a UI audit and specification can accompany a build. Explicit no-edit directions conflict with prototype or implementation directions that require edits. The checker analyzes catalog metadata, not the external task; a clean status means only that no **encoded** instruction conflict was found.

## Built-in starting sets

UX: journey redesign, evidence-led audit, research plan, prototype for testing, and task content review. UI: complete page, design recreation, component and states, accessibility audit, and responsive repair. Each is an editable selection of normal catalog checks. They were assembled to represent common prompt intents supported by the sources above, not to imply one universal workflow.
