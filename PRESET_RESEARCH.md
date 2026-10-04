# Preset research and selection rules

Research date: 2026-10-04. All visible built-in presets name a person whose published work shaped the selection. They apply a complete checkbox set, remain editable, and add no invisible prompt text. The ordinary contradiction checker runs after applying them. “Inspired” means a focused interpretation of documented methods, not a claim that the prompt reproduces someone's voice or every aspect of their practice.

## Torvalds-inspired patch

The [Linux kernel coding style](https://www.kernel.org/doc/html/latest/process/coding-style.html) emphasizes readable, maintainable code, simple expressions, and short functions that do one thing. In [Torvalds's message to the Git mailing list](https://marc.info/?l=git&m=115401850825206), he argues for designing code around data structures and their relationships. In his [TED interview](https://www.ted.com/talks/linus_torvalds_the_mind_behind_linux), he uses removal of a special case to illustrate good design. The kernel's [patch submission guide](https://www.kernel.org/doc/html/latest/process/submitting-patches.html) asks contributors to describe the underlying problem, explain the user-visible effect and reason for the change, solve one problem per patch, and review the resulting diff. The [patch checklist](https://www.kernel.org/doc/html/latest/process/submit-checklist.html) calls for technical checks before submission.

The preset selects **Make the changes**, **Examine data relationships**, **Inspect relevant project files**, **Solve one problem per change**, **Keep control flow simple**, **Follow local conventions**, **Preserve existing behavior**, **Keep existing interfaces**, **Run relevant tests**, **Review the final diff**, and **Explain why this change is needed**. The interface choice reflects the kernel's [no regressions rule](https://www.kernel.org/doc/html/latest/admin-guide/reporting-regressions.html). This is an interpretation of public kernel guidance, not a claim to reproduce Linus Torvalds's personal voice or every kernel convention. In particular, one problem per patch does not mean one file or one edit; the preset selects neither of those limits.

## Other named approaches

| Person | Distinct instructions selected | Primary source |
| --- | --- | --- |
| Kent Beck | Failing focused test, implementation, then small behavior-preserving cleanup and another check | [Beck's account of red–green–refactor and Tidy First](https://newsletter.kentbeck.com/p/augmented-coding-beyond-the-vibes) |
| Martin Fowler | Small structural steps, stable observable behavior, tests between steps, and a final diff review | [Fowler's refactoring workflow](https://martinfowler.com/articles/workflowsOfRefactoring/fallback.html) and [*Refactoring*](https://martinfowler.com/books/refactoring.html) |
| Michael Feathers | Inspect poorly understood code, find a seam, characterize existing behavior before editing, and preserve it | [Feathers's original legacy-code paper](https://objectmentor.com/resources/articles/WorkingEffectivelyWithLegacyCode.pdf) and [his book's publisher page](https://www.pearson.com/en-us/subject-catalog/p/working-effectively-with-legacy-code/P200000008984) |
| Simon Brown | Plan without edits, map containers and responsibilities, show interfaces, compare alternatives, and record the decision | [Brown's official C4 model](https://c4model.com/) and its [container-diagram guide](https://c4model.com/diagrams/container) |
| Rich Hickey | Examine data relationships, untangle coupled concerns, allow justified boundary changes, and check behavior | [Hickey's Clojure rationale](https://clojure.org/about/rationale) and [his Simple Made Easy talk transcript](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/SimpleMadeEasy.md) |
| Trisha Gee | Keep the review purpose explicit, inspect task fit and maintainability, and report focused findings instead of style trivia | [Gee's code-review guidance](https://trishagee.com/2019/07/03/code-review-best-practices/) |

Each preset is a product synthesis. The Simon Brown set asks for a C4 container view when useful; it does not require all four C4 diagram levels. The Feathers set records current behavior before deciding whether surprising behavior is a bug. The Hickey set does not demand Clojure or a functional rewrite.

## Editing and saving

Applying a preset replaces the current set of checks. Toggling any check makes an edited selection; it can be saved under a new name. Saved presets live in this browser's local storage and are not part of the GitHub repository or shared with other devices. Built-in presets stay unchanged. A custom preset keeps IDs rather than copied sentences, so improvements to catalog wording carry through to it. If a saved ID is removed from the catalog, the app drops that ID while loading the saved preset. `?preset=torvalds-inspired` opens a built-in set; `?checks=id1,id2` opens any valid collection. Previously shared generic preset URLs still open their original checkbox sets, though those sets no longer appear in the built-in picker. The URL carries check IDs, not a browser-local custom preset name.
