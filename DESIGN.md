# Feed Claus design

## Overview

Feed Claus is a reading page for an AI agent and its token holders. It presents a feasibility proposal with source links, not a registration or transaction flow. The visual idea is a bowl of compute: a simple SVG serving bowl containing chips, paired with a warm paper surface and an editorial serif headline.

The main action is the filled **Read the ask** anchor. Content follows the requested argument: ask, loop, ideas, sizing, checks, comparison, risks and timeline. There are no fixed overlays, decorative counters, entrance animations or loading states. The implementation lives in `src/App.tsx`, `src/Art.tsx` and `src/styles.css`.

## Colors

The canonical format is hexadecimal. Components use semantic CSS variables. Light neutrals and the main green refer to primitives at the start of `src/styles.css`; dark mode overrides semantic values. The manual `data-theme` attribute takes precedence, and the system preference is also supported without JavaScript.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--color-page` | `#f6f4ed` | `#151e1a` | Page background |
| `--color-surface` | `#fbfaf6` | `#1b2821` | Cards, food section and footer |
| `--color-soft` | `#e8ecdf` | `#223127` | Milestones, boundaries, comparison and icon circles |
| `--color-text` | `#23382d` | `#edf0df` | Headings and primary text |
| `--color-muted` | `#536357` | `#bdc7b9` | Supporting text and source underlines |
| `--color-line` | `#d3d8c9` | `#405043` | Structural dividers |
| `--color-connector` | `#7b8a76` | `#8b9f85` | Directional SVG loop paths |
| `--color-accent` | `#244c3d` | `#dbe89c` | Main action and brand mark |
| `--color-on-accent` | `#fbfaf6` | `#23382d` | Main action label |
| `--color-focus` | `#547a30` | `#dbe89c` | Keyboard outline |
| `--color-hover` | `#e4e8d6` | `#2e4032` | Neutral interactive hover |
| `--color-button-hover` | `#34654f` | `#e9f2bb` | Main action hover |

Badges have distinct semantic pairs. `now` uses `#e1eacb / #36512c` in light and `#2c402c / #dbe89c` in dark. `conditional` uses `#efe5cd / #6b511d` and `#3c3422 / #ead7a9`. `later` uses `#e7e7de / #505b51` and `#303b33 / #d0d7c8`. Text labels carry the status in every case.

The `--art-*` tokens are reserved for the decorative bowl SVG. They are independent of functional UI colors. Rendered text contrast is measured in `artifacts/browser-validation.json`: the lowest sampled light text pair is 5.32:1, and the lowest sampled dark pair is 7.83:1. These measurements are not a claim about every possible state or decorative pixel.

## Typography

All fonts are bundled WOFF2 files in `public/fonts/`, with `font-display: swap`.

| Role | Family and weight | Size | Line height |
| --- | --- | --- | --- |
| Hero | DM Serif Display 400, Georgia fallback | 40 px, then 64 px at 62 rem | 1.08 |
| Hero second sentence | DM Sans 400, Arial fallback | 20 px, then 28 px at 62 rem | 1.4 |
| Section headings | DM Serif Display 400 | 28 px, then 40 px at 46 rem | 1.15 |
| Card and step headings | DM Sans 600 | 20 px | 1.3 |
| Body | DM Sans 400 | 16 px | 1.6 |
| Labels and supporting text | DM Sans 400 or 600 | 14 px | 1.5 or inherited 1.6 |
| Allocation results | DM Sans 600 | 28 px | 1.2 |

The complete scale is 14, 16, 20, 28, 40 and 64 px at the default root size, expressed in rem. There are two loaded weights, 400 and 600. Compact job IDs use the platform monospace stack at 14 px. The bowl label is SVG art at 28 px.

Display headings track at `-.025em`; card headings at `-.015em`; the brand at `-.035em`. Body tracking is natural. Paragraph measure is normally 66 characters, with a 48 character hero introduction and an 80 character explanatory paragraph beneath the diagram. Headings use balanced wrapping. Tables use tabular numerals. Numeric claims are links, and no important text is clipped or truncated.

## Layout

`.wrap` has a maximum width of 70 rem. It leaves 20 px on each side at small widths, increasing to 32 px at 46 rem. The spacing tokens provide 4, 8, 12, 16, 24, 32, 48, 64, 80 and 96 px increments. Sections use 64 px vertical padding on small screens and 80 px above 46 rem.

Below 46 rem, content is a single column. Header section navigation is hidden; the brand, theme control and primary reading action stay available. The hero places its copy first, then the milestone chips, then the illustration. Actions wrap within the content margin. Cards show all five required fields without disclosure. The extra validator conditions and footer provenance use native disclosures.

At 46 rem, the ask, idea cards, sizing, comparison and risks use two columns. Milestones become three columns. Timeline labels and descriptions share rows, and header navigation appears.

At 62 rem, the hero becomes a copy and illustration pair, and the food loop becomes a two row diagram. The semantic list remains in logical process order. CSS positions the second row in the reverse visual direction; SVG arrows connect it and return to side work. At smaller widths, the list becomes a vertical sequence with an SVG return path. No SVG text is scaled down to fit a phone.

The final export was checked at 320, 390, 768, 1024 and 1440 px in both themes and in both browser engines. At 390 px, the primary action is on the first screen. The header wraps at enlarged text sizes. Cards allow long words to wrap and table cell padding adapts to available width. A 200% text resize passed at 390 and 1440 px. This was not browser native zoom.

## Elevation and depth

Surfaces are flat. Cards use a single 1 px structural border, with no shadow. Background changes distinguish the food, comparison and footer sections. Horizontal rules separate major argument stages. There are no gradients, elevated overlays or nested card surfaces.

## Shapes

Actions and the theme hover use a 6 px radius. Milestone chips and the boundary panel use 8 px; idea cards use 10 px; badges use 4 px. Step and diagram icons sit in circles. These are independent patterns rather than an outer and inner card pair. The illustration uses ellipses and chip rectangles from `Bowl` in `src/Art.tsx`.

## Components

| Pattern | Source | Behavior |
| --- | --- | --- |
| `Cite` | `src/App.tsx` | Native source anchor with descriptive text; numeric claims are part of the link |
| `ThemeToggle` | `src/App.tsx` | Button names the next action, follows system until overridden, saves only the theme, works when storage is blocked |
| `IdeaCard` | `src/App.tsx` | Title, explicit status badge, introduction and consistent five field definition list; optional native disclosure |
| `Bowl` | `src/Art.tsx` | Decorative SVG with a `small` brand variant; hidden from assistive technology |
| `FoodLoop` | `src/Art.tsx` | Semantic ordered labels plus decorative SVG connectors and a caption; numeric labels link to sources |
| `.button-primary` | `src/styles.css` | Filled main action, hover color, visible keyboard outline and optional press feedback |
| `.text-link` | `src/styles.css` | Secondary navigation with an arrow and a 44 px minimum height |
| `details` and `summary` | `src/App.tsx`, `src/styles.css` | Native open state, Enter and Space support, plus/minus cue, no JavaScript dependency |
| Allocation table | `src/App.tsx` | Caption, scoped headers, tabular values and a linked calculation note |
| `.question-list` | `src/styles.css` | Whole row source links with comfortable spacing |

The first keyboard stop is **Skip to content**. Interactive elements receive a 2 px focus outline with 5 px offset. Anchor targets have scroll margin. Hover styles are gated by a hover capable pointer. The main action has a 120 ms transform transition and a `.96` press scale only when reduced motion is not requested. Theme changes have no color transitions. Forced colors preserve system focus colors. No dialogs, validation forms, network loading states or asynchronous actions exist.

## Maintenance rules

Use `.wrap`, `.section` and existing type tokens for another section. Add content to the existing `Idea` structure to preserve the comparison format. Keep source links around numeric claims and label draft protocol quantities. Use native links for navigation and reserve buttons for local actions. Keep the diagram labels in HTML so they reflow and remain accessible.

Do not add a new font size, shadow layer, remote asset, wallet action, ticker or price forecast without a new product requirement. Preserve the current proposal voice and supplied headline. Regenerate the share image when changing its typography or bowl art, then rebuild the static export.

Design guidance is adapted from Jakub Krehel’s Better Interface (MIT). The documentation method is adapted from Paul Bakaus’s Impeccable (Apache 2.0). Pinned source details and retained license texts are listed in README.md and `artifacts/licenses/design-guidance.txt`.
