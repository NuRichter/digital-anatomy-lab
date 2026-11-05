# Web Design Research — Digital Anatomy Laboratory

Agent 6 (Website Art Director & UX Researcher) · researched 2026-10-14
Scope: rules extracted from the design-skill resources the team was pointed to, plus a survey of how professional anatomy viewers structure navigation. Nothing was installed. Every source below was fetched live on the research date unless marked otherwise.

---

## 1. Source register (status and license)

| Resource | What it is | License | Status on 2026-10-14 | Use for this project |
|---|---|---|---|---|
| `Leonxlnx/taste-skill` (default skill `design-taste-frontend`, v2.0.0) | Agent skills that steer coding agents away from the "average landing page"; includes `lint.mjs` and `inspect.mjs` (renders at 1440/768/390 px) | MIT (c) 2026 Leonxlnx | Active, ~95.6k stars, 213 commits on `main` | Anti-slop rules, type/colour discipline, QA viewports |
| `taste-skill/skills/image-to-code-skill/SKILL.md` | Workflow: generate design images first, analyse them, then implement | MIT (same repo) | Present on `main` | "Image is the design source, code is the translation layer"; anti-nesting rule |
| `vercel-labs/agent-skills` → `skills/web-design-guidelines/SKILL.md` (v1.0.0) | Review skill: fetch the guidelines and report violations as `file:line` | No license stated on the SKILL page; check repo root before redistributing (we only *apply* the rules, we don't copy the skill) | Active | Main a11y / interaction / content checklist |
| ↳ `vercel-labs/web-interface-guidelines/main/command.md` | The rule set that the skill fetches at review time | Same repo family; treat as reference | Fetched live | Section 3 below |
| `VoltAgent/awesome-design-md` | 84 DESIGN.md files ("Stitch DESIGN.md format, extended") that describe real sites' design systems | MIT | ~121k stars, 65 commits | Format of our root `DESIGN.md` |
| `microsoft/playwright-cli` (`@playwright/cli`) | CLI for agents to drive a browser (snapshots, screenshots, resize) | Apache-2.0 | ~14.1k stars, 113 commits; Node ≥ 18 | Visual QA at fixed viewports (later phase; **not installed**) |

Anatomy viewer references (section 6): BodyParts3D/Anatomography (DBCLS), Z-Anatomy, BioDigital Human, Visible Body Human Anatomy Atlas, Complete Anatomy (3D4Medical/Elsevier).

---

## 2. taste-skill: rules we adopt (and where we deliberately deviate)

taste-skill is written for marketing and landing pages. Our product is a **tool-first web app** with one about/sources page. Its typography, colour and anti-slop rules carry over directly. Its rules about motion volume and photo count do not, because they would harm a study tool.

### Adopted
- **Type discipline:** at most 2 type families and 5 sizes per view. Body 16–20 px with 1.45–1.6 leading and 45–75 characters per line. Headlines no longer than 2 lines at every width. Display tracking −0.02 to −0.05 em, leading 0.85–1.05.
- **Body text is full ink.** Grey is only for secondary notes.
- **Left-aligned by default,** with at most one centred moment (the loading state).
- **Banned type moves:** tiny letter-spaced uppercase "eyebrow" labels; a styled accent word (italic, colour or underline) inside a headline. *Exception:* Latin anatomical names are set in italic serif because that is the atlas convention for nomenclature, not decoration.
- **Palette roles:** one ground, one ink, one accent. The accent goes on the primary action and the selection state, nowhere else. Surfaces are separated by a **small tone step, not by shadows**.
- **Palette fits the subject.** We take our colours from print anatomy atlases (bone ivory, muscle red, arterial red, venous blue, nerve yellow, lymph green) instead of tech colours.
- **Banned:** gradients (except a neutral scrim under text over imagery), glows, resting shadows, glass panels, the cream-and-terracotta "assistant palette", violet/indigo UI accents, emoji, gradient blobs, fake dashboards, fake stats, icon-topped feature-card rows, "01 / 02 / 03" index numbering, floating pill nav bars.
- **Navigation bar:** a wordmark, 3–5 plain links and at most one action.
- **Buttons:** flat with a single fill. Choose the corner radius once and use it everywhere.
- **Every control responds** to hover, press and focus.
- **Animate only `transform` and `opacity`,** and always provide a `prefers-reduced-motion` fallback that keeps the content and drops the movement.
- **Credits:** every external image or dataset is credited on the page. We never present found material as our own. This maps directly onto BodyParts3D's CC BY-SA attribution duty.
- **QA viewports:** 1440, 768 and 390 px. Fix every FAIL, and treat every WARN as wrong unless it can be defended.
- **image-to-code:** avoid cards inside cards inside cards; no filler pills, fake system labels or decorative tags. Implementation must not drift from the reference mockups into a generic template.

### Deliberate deviations (documented so reviewers don't flag them)
| taste-skill rule | Our decision | Why |
|---|---|---|
| ≥ 8 moving elements on load/scroll | **No decorative motion** in the viewer; motion is functional only (camera fly-to, panel and sheet transitions, highlight pulse) | Users study for 30–90 min. Motion competes with the 3D model. |
| ≥ 4 real photographs | The 3D model *is* the imagery. The about page may use 1–2 credited images (e.g. a photo of a BodyParts3D render) | An honest picture of the subject already exists: the model itself. |
| No hairlines or outlined boxes | Tone steps are preferred. **Hairline rules are allowed only in dense data UI** (tree rows, property tables, panel edges against the 3D stage) | Dense hierarchical lists need row separation to stay scannable. |
| No monospace outside code | FMA IDs use the sans face with `tabular-nums`, not mono | Keeps us within 2 families. |
| Section gaps 120–220 px | Applies to the about page only | The app view is a fixed-viewport tool. |

---

## 3. Vercel Web Interface Guidelines: applicable checklist

Applied to our stack (React + Three.js canvas). Items that don't apply (SSR hydration, auth forms) are omitted.

### Accessibility and semantics
- [ ] Icon-only buttons (hide, isolate, x-ray, reset, zoom) have `aria-label` in Bahasa Indonesia plus a visible tooltip.
- [ ] Decorative icons use `aria-hidden="true"`.
- [ ] `<button>` for actions, `<a>` for navigation; no `div` with `onClick`.
- [ ] Heading hierarchy is correct, with a **skip link** that jumps to "Lewati ke penampil 3D" and another to the structure panel.
- [ ] Async updates (selection changed, "12 struktur disembunyikan", load errors) are announced through an `aria-live="polite"` region.
- [ ] The `<canvas>` has `role="img"` plus an `aria-label` that describes the current view. Everything the canvas does can also be done from the tree and the info panel (the DOM is the accessible twin of the 3D scene).
- [ ] Meaningful media has descriptions. Each structure's info panel serves as its text description.

### Focus
- [ ] Every interactive element shows a visible `:focus-visible` ring. Never use `outline: none` without a replacement.
- [ ] Use `:focus-within` on compound controls (search combobox, tree rows with inline actions).
- [ ] Sticky header, toolbar and bottom sheet must never cover the focused element.

### Forms (search field)
- [ ] The search input has a `<label>` (can be visually hidden), `type="search"`, `name`, `autocomplete="off"` and `spellCheck={false}`. Never block paste.
- [ ] Placeholder ends with an ellipsis and shows an example: `Cari struktur, mis. "femur" atau "arteria carotis"…`.

### Animation
- [ ] Honour `prefers-reduced-motion`: camera moves cut instantly and sheet transitions become fades.
- [ ] Only `transform` and `opacity` are animated; never `transition: all`.
- [ ] All animation is interruptible: any pointer input cancels a camera fly-to.
- [ ] No autoplaying motion over 5 s. The optional auto-rotate has a pause control and is **off by default**.

### Typography and content
- [ ] Use `…` not `...`, and curly quotes.
- [ ] Use non-breaking spaces in units and shortcuts (`12&nbsp;mm`, `Ctrl&nbsp;K`).
- [ ] Loading states end with `…` ("Memuat model…").
- [ ] Number columns (counts, FMA IDs, volumes) use `font-variant-numeric: tabular-nums`.
- [ ] Headings use `text-wrap: balance`; paragraphs use `text-wrap: pretty`.
- [ ] Long Latin names (e.g. *Musculus flexor digitorum superficialis*) wrap or truncate safely. Flex children get `min-width: 0`. The full name appears in a tooltip or `title`.
- [ ] Empty states are designed, never blank (see UX IA doc §8).
- [ ] Copy is in active voice and second person ("Pilih struktur untuk melihat detail"). Counts use numerals ("214 struktur"). Button labels are specific ("Isolasi struktur", not "OK"). Error messages state the next step.
- [ ] Wrap Latin/English terms and identifiers in `lang="la"` / `lang="en"` and `translate="no"` so browser auto-translate doesn't mangle *Arteria* into something else.

### Images and performance
- [ ] Images have explicit `width`/`height`; below-fold images use `loading="lazy"`.
- [ ] **Virtualise the structure tree and search results** (>50 items is the guideline; BodyParts3D has thousands of parts).
- [ ] No layout reads during render; batch DOM reads and writes. Canvas sizing uses `ResizeObserver`.
- [ ] Preload the 1–2 critical font files with `font-display: swap`. Fonts are self-hosted through @fontsource, so no third-party preconnect is needed.
- [ ] Add `preconnect` only if model files are served from a separate CDN host.

### Navigation and state
- [ ] **The URL reflects state:** selected structure, visible systems, mode (x-ray), layer depth and camera preset all live in query params. A lecturer can paste a link into a slide and students land on the same view.
- [ ] Links are real `<a>` elements, so Ctrl/middle-click works.
- [ ] Destructive or bulk actions ("Sembunyikan semua", "Reset tampilan") get an **undo** toast rather than a confirm modal.

### Touch, safe areas, theming
- [ ] Use `touch-action: none` on the canvas only (the 3D controls own gestures) and `touch-action: manipulation` on UI.
- [ ] Use `overscroll-behavior: contain` on the bottom sheet and side panels.
- [ ] Every gesture has a tap/keyboard alternative: zoom buttons, rotate buttons, a "Fokus" action.
- [ ] Never use `autoFocus` on mobile.
- [ ] The full-bleed viewer respects `env(safe-area-inset-*)`.
- [ ] Use `color-scheme` per theme and set `<meta name="theme-color">` to the ground colour. Native `<select>` gets explicit colours.
- [ ] **Never** use `user-scalable=no` or `maximum-scale=1`.
- [ ] Use `Intl.NumberFormat('id-ID')` for counts and measurements.

---

## 4. awesome-design-md: format rules for our DESIGN.md

- Section order (Stitch format, extended): **Visual Theme & Atmosphere → Color Palette & Roles → Typography Rules → Component Stylings → Layout Principles → Depth & Elevation → Do's and Don'ts → Responsive Behavior → Agent Prompt Guide.**
- Newer entries (e.g. WIRED) add a **YAML front matter** block with machine-readable tokens (`colors`, `typography`, `rounded`, `spacing`, `components`). Components reference tokens with `"{colors.accent}"` syntax.
- Colours are described by role, with the token and hex given together: `**Hairline** ({colors.hairline} — #e0e0e0): use…`.
- Typography is given as a table: token / size / weight / line-height / tracking / use.
- Elevation is given as a levels table. Editorial brands often declare "no drop shadows".
- Responsive behaviour is given as a breakpoint table.
- Closest references in the collection: **WIRED** (paper-white broadsheet density, serif + sans pairing, no shadows), **Oura** (health, warm editorial serif) and **Mintlify** (documentation readability). There is no medical or scientific entry, so our file is original and we copy no brand.
- Lesson from the WIRED file's own inconsistencies (YAML vs prose mismatch): **keep the YAML tokens as the single source of truth, and generate the CSS variables from them.**

---

## 5. Playwright CLI: QA procedure (for the build/QA agents, not installed now)

- Package: `@playwright/cli`, Apache-2.0, Node ≥ 18.
- Install (when the QA phase is approved): `npm install -g @playwright/cli@latest`, then `playwright-cli --help`. For agent skills: `playwright-cli install --skills`. Without a global install: check with `npx --no-install playwright --version`, then run `npx playwright cli`.
- Core commands: `open [url] [--headed]`, `goto <url>`, `resize <w> <h>`, `snapshot [--depth=N] [--boxes]` (accessibility tree with refs), `click <ref>`, `fill <ref> <text> [--submit]`, `press <key>`, `hover <ref>`, `screenshot [--filename=f] [--hires]`, `console`, `requests`, `eval <fn>`, sessions with `-s=name`.
- **Our QA script (proposal):**
  1. `open http://localhost:5173/`
  2. For each of 1440×900, 1024×768, 768×1024 and 390×844: `resize`, `screenshot`, then `snapshot`, and check that the tree, search and info panel appear in the accessibility tree.
  3. Fill search with "femur", press Enter, then take a screenshot. Check that the URL contains `?s=` and the info panel shows *Femur*.
  4. Press `i` (isolate), `x` (x-ray) and `Escape`; take a screenshot after each.
  5. Run `console` and expect no errors. Run `requests` and flag model files over the size budget.
  6. Repeat the run with `prefers-reduced-motion` emulated via `run-code`.

---

## 6. Professional anatomy viewers: navigation patterns

| Product | Navigation model | Visibility tools | Notes for us |
|---|---|---|---|
| **BodyParts3D / Anatomography** (DBCLS, Japan; our data source) | FMA concept trees: **IS-A tree** (class) and **HAS-PART tree** (part–whole). Filters by type (bone/muscle/vessel/internal), body segment and volume. Each concept can have several models (element vs compound). | Picked-part colour, clipping plane in mm, scale bar, X/Y/Z readout, auto-rotate | Data: BodyParts3D is **CC BY-SA 2.1 Japan** (DBCLS). The fetched Anatomography page shows only "©2010 DBCLS", so the licence is confirmed from the project's licence page/README, and the legal agent must re-verify it. Our tree should hide the IS-A/HAS-PART duality behind a single teaching hierarchy, but keep the FMA ID visible. |
| **Z-Anatomy** (open source, Lluís Vinent / Z-Anatomy project) | Systems as collections; labels with leader lines; definitions per structure | Hide, isolate, transparency | Repo licence **CC BY-SA 4.0**. Unity PC app; models are distributed as .blend/FBX. The website is a JS app that did not render in our fetch, so its UI was not inspected directly. Treat it as a peer/reference, not a source of UI to copy. |
| **BioDigital Human** (commercial) | **Anatomy Tree**: "interactive, expandable list of all of the anatomical structures" (glossary). Since Nov 2020 there is streamlined navigation. 2024 added "system-by-system anatomy layers" and a new highlight colour. | Tools consolidated (Nov 2019) into **Select (default), Hide, Fade**; Isolate Mode hides everything except the selection; older X-ray view | The help-centre tree article returned 403, so the summary comes from the glossary and release notes. Use this pattern: one tool menu, with Select as the default mode. |
| **Visible Body — Human Anatomy Atlas** (commercial) | **Systems Tray** to add/remove large groups quickly; a **Region** button to focus a body region | Hide, Fade, Dissect; **Radius Blast** to peel layers locally | Systems and regions are *both* first-class filters. This is why our tree has a System/Region toggle. |
| **Complete Anatomy** (3D4Medical/Elsevier, commercial) | Systems menu with **numbered layers per system** (+/− to add or remove layers, e.g. skeletal "Insertion" layer 4); infobox per structure | Infobox actions: **Hide, Fade, Isolate, Hide Others, Fade Others**. Mac shortcuts: Isolate ⌘I, Hide Backspace, Fade ⌘J, Hide Others ⌘⇧Backspace, Fade Others ⌘⇧J; multi-select with ⌘-click; Reset restores everything | Basis for our layer slider (stepped, not continuous) and our "…Others" actions. Our shortcuts are Backspace/Delete-compatible for users who come from CA. |

### Converging conventions we adopt
1. **The selection opens an info panel** with the visibility actions *inside it* (Hide / Fade / Isolate / Hide others / Fade others).
2. **Systems are toggled as whole groups;** regions are a second lens on the same structures.
3. **Layers are discrete steps** (superficial → deep), not a continuous opacity slider.
4. **Fade** (per-structure transparency) is distinct from **X-ray** (global see-through mode).
5. **Reset** is always one click away, and undo exists for bulk actions.
6. **Labels/pins** are optional overlays, off by default to keep the model clean.
7. Commercial apps hide ontology IDs. Our audience is Master's students, so we **show the FMA ID and Latin (TA) name** as secondary data. This is a differentiator.

---

## 7. Consolidated checklist (gate for build and QA agents)

**Visual**
- [ ] Only tokens from `DESIGN.md`; no raw hex in components.
- [ ] At most 2 font families (Source Serif 4 + IBM Plex Sans) and at most 5 sizes per view.
- [ ] No gradients, glows, glass/backdrop blur, resting shadows, neon or violet UI.
- [ ] No fake stats, testimonials or "trusted by" bars. Every number shown is computed from the dataset.
- [ ] The accent (`#C2410C`) is used only on the primary action, focus and selection.
- [ ] System colours are used only for anatomy (mesh tint, legend swatch, tree dot), never for UI chrome.
- [ ] Latin names are italic serif with `lang="la"`; Indonesian names are roman.

**Interaction**
- [ ] Every 3D action is reachable from the DOM (tree, search, info panel) and from the keyboard.
- [ ] State is in the URL and survives a reload.
- [ ] Undo exists for hide-all, isolate and reset.
- [ ] Reduced-motion variant is in place.

**A11y**
- [ ] Contrast ≥ 4.5:1 for text and ≥ 3:1 for UI boundaries and focus ring, in both themes.
- [ ] Visible focus everywhere; skip links; `aria-live` region; tree uses the ARIA `tree`/`treeitem` pattern.
- [ ] Touch targets ≥ 44×44 px on coarse pointers.

**Performance**
- [ ] Virtualised tree and search results.
- [ ] Progressive model loading per system (skeleton first) with a determinate progress bar.
- [ ] Fonts preloaded, subset to Latin and Latin-ext.

**Licensing**
- [ ] The about page lists BodyParts3D (CC BY-SA 2.1 JP, © DBCLS) with a link, the FMA credit, font licences (SIL OFL 1.1) and a ShareAlike notice for derived meshes.

**QA**
- [ ] Playwright CLI screenshots at 1440 / 1024 / 768 / 390 px, with an accessibility-tree snapshot for each.
