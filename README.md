# Prompt Builder

Live site: [Prompt Studio](https://artpar.github.io/prompt-studio/)

A static prompt instruction builder. The left panel is a small skill tree organized by questions about the prompt: **Do what?**, **Use what?**, **How far?**, **When unsure?**, **Stop when?**, and **Show what?** Selected instructions stay visible in their original branches and in the middle panel. The right panel shows exactly what **Copy prompt** copies, with a separate status bar.

The builder supplies reusable instructions for a task the user gives to an LLM separately. Branch labels and option details are navigation aids and never enter the generated prompt.

## Presets

Choose a built-in preset to replace the selected checks with a named starting set. You can then toggle checks freely; the picker shows when the set has been edited. **Save as…** stores the current coherent selection under a new name in this browser. Saved presets can be applied or deleted, and built-in presets cannot be changed. The prompt preview and conflict checks use the resulting checkboxes exactly as they do for a manual selection.

Built-in sets live in [docs/presets.js](docs/presets.js) as arrays of catalog IDs. The choices and primary sources behind them are recorded in [PRESET_RESEARCH.md](PRESET_RESEARCH.md). “Torvalds-inspired patch” is a researched interpretation of public kernel guidance, not an impersonation or a claim that one patch must touch one file.

## Catalog and prompt assembly

Edit [docs/catalog.js](docs/catalog.js) to change the catalog. Each branch has groups, and each option has a unique ID, label, detail, and sentence bundle. The groups form a shallow visual tree. Options sharing an exclusiveGroup appear under the same question; selecting incompatible answers produces a conflict. The directionGroups map supplies the question and issue label.

An option may declare constraints: allowed values for a named dimension, with hard or soft strength and a plain-language meaning. [docs/coherence.js](docs/coherence.js) intersects the selected constraints. An empty hard intersection is a conflict; a soft mismatch is a note. It identifies an inclusion-minimal set of selections behind each issue. Explicit alternatives are checked in the same system. The checker does not infer the meaning of a task that has not been supplied.

[docs/prompt.js](docs/prompt.js) assembles selected sentence bundles in branch order. A more specific option may list IDs in covers to suppress redundant prose from those selected options. The selections still appear in both UI lists. For example, **Make a plan only** already forbids edits, so selecting **Make no changes** with it does not repeat that sentence in the copied prompt.

The catalog favors prompt controls over software engineering topic categories. Specific things to request, such as a system map or interface contract, live as optional leaves under **Show what?** See [PROMPT_FRAMEWORK.md](PROMPT_FRAMEWORK.md) for the research and design rules behind this structure.

## Run locally

From the repository root, serve the docs directory:

    python3 -m http.server 8000 --directory docs

Open http://localhost:8000. Run the behavior checks with:

    node --test tests/coherence.test.cjs

## Publish

GitHub Pages serves the main branch's docs folder. Push to main to deploy. The site uses static files and has no build step.
