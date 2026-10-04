# Prompt Builder

Live site: [Prompt Studio](https://artpar.github.io/prompt-studio/)

A static, three-panel instruction builder for software development prompts. Browse checkboxes on the left, review selected instructions grouped by their source tab in the middle, and copy the generated prompt from the right. Checked options remain in their original tabs as well as the middle panel.

The prompt preview displays exactly the text copied by **Copy prompt**. Selection counts, status, and word count sit outside the prompt area.

## Customize the catalog

Edit [`docs/catalog.js`](docs/catalog.js). Each category becomes a tab. Each option becomes a checkbox, and its `sentences` value becomes a paragraph in the copied prompt. Keep option `id` values unique. The initial selections are set in `docs/index.html` in the `selected` set.

Options can specify `group` to create a section inside a tab. Options sharing an `exclusiveGroup` render together in a nested directions checklist. Each group has a question and conflict label in the `directionGroups` map at the top of `docs/catalog.js`. This covers directions in every tab, including test, dependency, compatibility, review, and delivery policies. The same metadata drives the conflict check. `editOnly` and `multiChange` describe edit counts, and `constraints` describe other dimensions. A constraint has `dimension`, `allowed`, `strength` (`hard` or `soft`), and `meaning` fields. Options that request an independent outcome also declare a `workProduct` (`plan`, `implementation`, or `review`). Supporting design views and delivery operations do not need a work product. Action choices can declare `primaryWorkProduct`; `exclusiveWorkProduct` means that action cannot share the request with another outcome.

[`docs/coherence.js`](docs/coherence.js) intersects the allowed values from selected options on each dimension. An empty intersection of hard constraints is a conflict and blocks copying. A soft constraint outside the hard intersection produces a caution. It also checks requested work products: one extra outcome is a caution; two or more outcomes beyond the declared primary are a conflict. If no primary is declared, two different outcomes conflict. A broad set of 12 or more instructions receives a caution even if no specific conflict is encoded. The evaluator preserves every selection and names the options behind each issue. This catches encoded contradictions and competing requests; it cannot prove that an arbitrary task or prompt is semantically sound for a specific project. See [`CATALOG_RESEARCH.md`](CATALOG_RESEARCH.md) for the source-backed framework and worked combinations.

## Preview locally

```sh
python3 -m http.server 8000 --directory docs
```

Open `http://localhost:8000`.

Run the coherence checks with `node --test tests/coherence.test.cjs`.

## Publish with GitHub Pages

The site is published from the `main` branch's `/docs` folder. Push changes to `main` to trigger a new Pages deployment. The site uses only static files and needs no build step.
