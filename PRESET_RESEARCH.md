# Preset research and selection rules

Research date: 2026-10-04. Presets are curated collections of existing instruction IDs. They apply a complete selection, remain editable, and add no invisible prompt text. The builder's ordinary contradiction checker runs after applying every preset. A name describes an approach, not a guarantee that its instructions fit every task.

## Torvalds-inspired patch

The [Linux kernel coding style](https://www.kernel.org/doc/html/latest/process/coding-style.html) emphasizes readable, maintainable code, simple expressions, and short functions that do one thing. In [Torvalds's message to the Git mailing list](https://marc.info/?l=git&m=115401850825206), he argues for designing code around data structures and their relationships. In his [TED interview](https://www.ted.com/talks/linus_torvalds_the_mind_behind_linux), he uses removal of a special case to illustrate good design. The kernel's [patch submission guide](https://www.kernel.org/doc/html/latest/process/submitting-patches.html) asks contributors to describe the underlying problem, explain the user-visible effect and reason for the change, solve one problem per patch, and review the resulting diff. The [patch checklist](https://www.kernel.org/doc/html/latest/process/submit-checklist.html) calls for technical checks before submission.

The preset selects **Make the changes**, **Examine data relationships**, **Inspect relevant project files**, **Solve one problem per change**, **Keep control flow simple**, **Follow local conventions**, **Preserve existing behavior**, **Keep existing interfaces**, **Run relevant tests**, **Review the final diff**, and **Explain why this change is needed**. The interface choice reflects the kernel's [no regressions rule](https://www.kernel.org/doc/html/latest/admin-guide/reporting-regressions.html). This is an interpretation of public kernel guidance, not a claim to reproduce Linus Torvalds's personal voice or every kernel convention. In particular, one problem per patch does not mean one file or one edit; the preset selects neither of those limits.

## Other approaches

| Preset | Reason for the selection | Source |
| --- | --- | --- |
| General implementation | Small neutral starting set for a software change | Product default, not attributed to an external method |
| Reproduce and repair | Observe the failure, identify its cause, make a bounded fix, and check the failure path | [Linux patch submission guide](https://www.kernel.org/doc/html/latest/process/submitting-patches.html) and [Google review guidance](https://google.github.io/eng-practices/review/reviewer/looking-for.html) |
| Test first | Use a focused failing test, implement, then check the result | [Martin Fowler's description of TDD](https://martinfowler.com/bliki/TestDrivenDevelopment.html). The preset uses a conditional test-first instruction because not every task admits a useful focused test. |
| Review without edits | Inspect the result and report prioritized findings with sources | [Google code review guidance](https://google.github.io/eng-practices/review/reviewer/looking-for.html) |
| Architecture decision | Compare approaches and record a significant choice, its context, and consequences without editing files | [AWS ADR process](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html) and [Microsoft ADR guidance](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record) |

The latter presets are product syntheses of these sources. The sources describe development and review methods, not exact prompt bundles. We chose checkbox sets that express their useful behavior without copying process terminology into the generated prompt.

## Editing and saving

Applying a preset replaces the current set of checks. Toggling any check makes an edited selection; it can be saved under a new name. Saved presets live in this browser's local storage and are not part of the GitHub repository or shared with other devices. Built-in presets stay unchanged. A custom preset keeps IDs rather than copied sentences, so improvements to catalog wording carry through to it. If a saved ID is removed from the catalog, the app drops that ID while loading the saved preset. `?preset=torvalds-inspired` opens a built-in set; `?checks=id1,id2` opens any valid collection, including one shared from a custom preset. The URL carries check IDs, not the custom preset's browser-local name.
