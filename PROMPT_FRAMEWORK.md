# Prompt instruction framework

Research date: 2026-10-04. This document describes the current product model. [CATALOG_RESEARCH.md](CATALOG_RESEARCH.md) records the earlier engineering-topic catalog exploration and is historical.

## What the product models

The builder composes reusable directions for an LLM. The concrete task is supplied separately. The visual tree answers six plain questions: **Do what? Use what? How far? When unsure? Stop when? Show what?** These are questions about the behavior requested by a prompt, not a map of the software engineering lifecycle.

This separation follows [PromptPrism](https://aclanthology.org/2026.findings-eacl.61/), which distinguishes functional structure, semantic components, and syntax in prompts. The UI groups instructions by their purpose. The copied text expresses their meaning in natural language; it does not copy navigation labels.

The [ROPE study](https://doi.org/10.1145/3731756) found that learning to articulate requirements improved novice prompt quality more than conventional prompt-engineering training in its controlled study. [OpenAI's reasoning guidance](https://developers.openai.com/api/docs/guides/reasoning-best-practices) recommends simple, direct instructions and does not recommend routine chain-of-thought requests for reasoning models. The tree therefore foregrounds concrete behavior and limits rather than role-play or reasoning slogans.

The [PromptFlow visual authoring study](https://doi.org/10.1145/3772363.3799168) supports using separate nodes whose relationships are composed into complete instructions. It does not validate this exact six-branch layout. This layout is our design synthesis and should be tested with users.

## Branch placement rule

Place a choice under the question it directly answers. A word inside its sentence does not determine its branch.

| Branch | Instruction role | Example |
| --- | --- | --- |
| Do what? | Requested action | Make changes; critique a supplied or proposed plan |
| Use what? | Material to consult | Inspect relevant project files; check current sources |
| How far? | Permissions and limits | No edits; exactly one edit; commit or stay local |
| When unsure? | Choice under uncertainty | Ask at important decisions; proceed with stated assumptions |
| Stop when? | Completion and checks | Finish the requested result; run relevant tests |
| Show what? | Returned content and shape | Brief response; map services and data stores |

For example, **Find gaps in a plan** is an action applied to a plan. It can examine a supplied plan, so it does not require **Plan before acting**. **Map services and data stores** requests a specific output. Its C4 name is detail, not a category. Specialist outputs remain optional leaves.

## Relationships between choices

Each choice has a unique ID, sentence bundle, visual group, and optional machine-readable meaning:

- **Alternative:** options sharing one exclusiveGroup answer the same question. Selecting two is a conflict.
- **Independent:** additive instructions may coexist. Planning, critiquing the plan, reviewing the result, and implementing can describe one request.
- **Constraint:** an option narrows allowed values of a dimension such as file edits, project state, or automated tests. An empty hard intersection is a conflict.
- **Coverage:** a selected option can cover another option's prose. **Make a plan only** already says not to edit; choosing **Make no changes** too reinforces its meaning without copying a duplicate paragraph.

The conflict evaluator reports the smallest selected set that explains an encoded contradiction. For example, **Make changes** requires edits and **Make no changes** forbids them. **Make a plan only** and **Make no changes** are compatible. **Skip automated tests** and **Use a failing test first** conflict. The evaluator does not count verbs or work products and declare a conflict merely because several appear together.

[ConInstruct](https://ojs.aaai.org/index.php/AAAI/article/view/40356) found that models frequently fail to notify users about conflicting instructions, even when capable of detecting them. The builder therefore checks explicit meanings before copying. It cannot know whether selected instructions suit the concrete task supplied later. The status says **No encoded conflicts**, not that the prompt is guaranteed coherent.

## Keep the copied prompt focused

A [CMU study of prompt underspecification](https://www.cs.cmu.edu/~sherryw/assets/pubs/2025-underspec.pdf) found that adding every possible requirement is an anti-pattern in its tested tasks and models: average adherence fell when many requirements were combined. The builder gives a review note when many choices are selected. It does not claim that a universal numerical limit exists. It removes exact duplicate paragraphs and covered instructions, while preserving every visible selection.

The generated prompt contains only the chosen instruction sentences. It does not contain branch names, UI descriptions, counts, or status messages. The user attaches a concrete task when using the copied instructions. The exact text on the right is what the Copy button places on the clipboard.

## Validation still needed

The current checks cover explicit alternatives, cross-branch contradictions, and redundant prose. The next product test should ask people to locate representative instructions without coaching, then compare their expected branch with the one used here. A second test should run several assembled prompts on representative tasks and record missed instructions, redundant wording, and false conflict reports. The exact branch tree and sentence bundles should be revised from those observations.
