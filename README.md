# Feed Claus

A one page feasibility proposal for Claus and his holders. The finished site is in `dist/`. It includes the sourced proposal, a responsive SVG compute loop, all six idea cards, allocation examples, open questions and a timeline. The main action is **Read the ask**.

The site has no wallet, forms, trackers, backend or remote runtime dependencies. Fonts, art, scripts and the share image are local. Only the theme preference is saved in browser storage. All proposal content is rendered into the exported HTML, so reading, links and native disclosures also work without JavaScript.

## Install, preview and rebuild

Use Node 22.12 or newer and npm.

```sh
npm ci
npm run typecheck
npm run build
npm run preview -- --host 127.0.0.1
```

Open the URL printed by Vite. For development, use `npm run dev`. `npm run build` runs Vite and then prerenders the React page into `dist/index.html`. It replaces the export, so rebuild after changing the source. The lockfile pins the dependencies.

For a preview under a gateway style subpath:

```sh
node scripts/preview.mjs
```

Open `http://127.0.0.1:4173/preview/`. This local preview closes after thirty minutes. The validation script manages its own temporary server and closes it when done.

## Static delivery and IPFS

Publish the **contents of `dist/`** as the site root. Vite uses `base: './'`; exported scripts, styles, fonts, favicon, provenance and share image use relative paths. Navigation uses hash anchors and needs no server rewrites.

The assignment publisher pins this export to IPFS after submission. No publishing command was run and no CID is claimed here. A site address was not invented for metadata. The relative `og:image` resolves to the bundled `social.png` at the published location. Metadata includes title, description, favicon, Open Graph fields and a Twitter share card.

## Validation

The final production build and TypeScript check both passed. The worker tested the export under `/preview/`, not the development server. Chromium and WebKit passed **94 assertions** covering:

* The first screen and primary action at 390 px.
* Keyboard skip navigation, anchor navigation and native disclosures.
* Light and dark themes, persistence, system changes and blocked storage.
* Reflow at 320, 390, 768, 1024 and 1440 px in both themes.
* Text resized to 200%, reduced motion, source links, numeric citations and local assets.
* Automated accessibility checks in both themes, with disclosures open.
* Reading and navigation with JavaScript disabled.
* No third party runtime requests, script errors or failed resources.

The pinned `taste@1` probe passed **16 of 16 checks**. Results and the consolidated Better Interface review are in [artifacts/validation.md](artifacts/validation.md), with [browser results](artifacts/browser-validation.json), [probe results](artifacts/taste.json) and [screenshots](artifacts/screenshots/). These are worker observations, not independent certification.

To run the interaction checks locally:

```sh
npx playwright install --with-deps chromium webkit
npm run build
npm run validate
node scripts/check-export.mjs
```

The validator writes to `artifacts/`. Browser packages and system libraries are development dependencies only. During this assignment, npm packages and browser support libraries were installed in temporary storage outside the repository; the same package scripts built the source there, and the resulting export was copied back intact. No dependency directory or registry archive is submitted.

The pinned probe was run from the repository root with:

```sh
node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste --offline
```

Its supplied input is removed before submission, so it is not a runtime dependency or a delivered script. A temporary Playwright module path was supplied through `IMD_PLAYWRIGHT` for that run.

Limitations: no physical phone, screen reader session, browser native zoom, print pagination or deployed gateway was tested. The text resize check is distinct from native zoom. WebKit was a Linux WebKit build, not a physical iPhone. External sources can change or become unavailable. No FLOP inference, identity enrollment, receipt settlement or blockchain operation was performed by this website.

## Source and maintenance

* `src/App.tsx`: content, source citations, theme control and reusable idea cards.
* `src/Art.tsx`: original bowl illustration and responsive SVG loop connectors with semantic HTML labels.
* `src/sources.ts`: source URL registry.
* `src/styles.css`: design tokens, type, themes and responsive layouts.
* `scripts/prerender.tsx`: static HTML export.
* `public/`: fonts, licenses, favicon, provenance and share image.
* [DESIGN.md](DESIGN.md): implemented design system.
* [artifacts/sources.md](artifacts/sources.md): evidence and decisions where the report qualifies the brief.

To regenerate the share image after changing its design, install Chromium as above and run `npm run share`, then rebuild. Its source is `scripts/share-card.tsx`; it uses the same local fonts and bowl SVG.

The research job is `2b996151-e811-41ca-98ff-553f3176e90c`. The build job is `b86ac11d-0522-44e4-915a-43ecdfc513bc`. The page displays compact UUIDs to keep its visible copy free of dashes. Canonical IDs are preserved in `public/provenance.json` and the export.

The submission limit is 8,388,608 bytes. `.gitignore` has an explicit **1,024 byte path budget** and excludes dependency, tool output and cache directories at every nesting level. `dist/` stays included. [artifacts/submission-size.json](artifacts/submission-size.json) records the actual export inventory and raw submission size, with an additional packaging allowance. Source, lockfile and required runtime assets remain complete.

## Attribution

The design review applies Jakub Krehel’s [Better Interface](https://github.com/jakubkrehel/skills/tree/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/better-interface), MIT, and the documentation method adapted from Paul Bakaus’s [Impeccable](https://github.com/pbakaus/impeccable/blob/9d715cc4f5564a990ca8345abfdd5df6dc9b41c8/skill/reference/document.md), Apache 2.0. Their notices and license texts are retained in `artifacts/licenses/design-guidance.txt`. Font and React license texts are included in `public/licenses/` and the export.
