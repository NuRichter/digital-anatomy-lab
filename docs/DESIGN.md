---
version: 1.0
name: Laboratorium-Anatomi-Digital
description: >
  Medical Atlas × Premium Scientific Editorial × Interactive 3D Visualization.
  A quiet, paper-toned scientific instrument around a full-body BodyParts3D model.
  Bahasa Indonesia UI; Latin (TA) names in italic serif; FMA IDs as tabular data.
updated: 2026-10-14

colors:
  # Atlas theme (default, light)
  paper: "#F3F3F0"          # app ground
  panel: "#FAFAF8"          # side panels, sheet
  stage: "#E4E5E1"          # 3D viewport background
  stage-raised: "#EDEEEA"   # toolbar docked on stage
  sunken: "#E9EAE6"         # inputs, selected row ground, hover
  rule: "#D3D5D0"           # hairline (dense data UI only)
  ink: "#15191D"            # primary text
  ink-2: "#3E454D"          # secondary text
  ink-3: "#646B73"          # tertiary text, hidden rows (4.8:1 on paper)
  accent: "#C2410C"         # action + selection + focus (5.0:1 on panel)
  accent-hover: "#9A3412"
  accent-subtle: "#F6E3D9"  # selected tree row ground
  on-accent: "#FFFFFF"
  selection-3d: "#FF6A1A"   # emissive outline in WebGL only (never text)
  xray-ink: "#2A3540"       # x-ray translucent tint
  danger: "#B42318"
  warning: "#A15C07"
  success: "#2F7D4F"
  # Proyektor theme (dark, for classroom projection)
  dark-paper: "#101316"
  dark-panel: "#171B1F"
  dark-stage: "#1C2126"
  dark-stage-raised: "#242A30"
  dark-sunken: "#20252A"
  dark-rule: "#2E353C"
  dark-ink: "#ECEEEF"
  dark-ink-2: "#B7BDC3"
  dark-ink-3: "#8B939B"
  dark-accent: "#FF7A3D"    # 6.3:1 on dark-panel
  dark-accent-subtle: "#3A2318"
  dark-xray-ink: "#C9D3DC"
  # Atlas system colours (anatomy only: mesh tint, legend dot, tree dot)
  sys-skeletal: "#E3DAC4"
  sys-muscular: "#A8453D"
  sys-cardiovascular: "#C1272D"   # arteries
  sys-cardiovascular-venous: "#2E5AA6"
  sys-nervous: "#DDAE2E"
  sys-respiratory: "#E09A97"
  sys-digestive: "#C4844C"
  sys-urinary: "#8A6BB0"
  sys-reproductive: "#C25685"
  sys-endocrine: "#2F9A8A"
  sys-lymphatic: "#6A9F45"
  sys-sensory: "#3A9CC0"

typography:
  serif: '"Source Serif 4 Variable", "Source Serif 4", Georgia, "Times New Roman", serif'
  sans: '"IBM Plex Sans Variable", "IBM Plex Sans", system-ui, "Segoe UI", Roboto, sans-serif'
  display:       { fontFamily: "{typography.serif}", fontSize: 44px, fontWeight: 560, lineHeight: 1.04, letterSpacing: -0.025em, opsz: 60 }
  title-latin:   { fontFamily: "{typography.serif}", fontSize: 24px, fontWeight: 520, fontStyle: italic, lineHeight: 1.15, letterSpacing: -0.01em, opsz: 32 }
  heading:       { fontFamily: "{typography.sans}",  fontSize: 16px, fontWeight: 600, lineHeight: 1.35 }
  body:          { fontFamily: "{typography.sans}",  fontSize: 16px, fontWeight: 400, lineHeight: 1.55 }
  ui:            { fontFamily: "{typography.sans}",  fontSize: 14px, fontWeight: 450, lineHeight: 1.4 }
  ui-latin:      { fontFamily: "{typography.serif}", fontSize: 15px, fontWeight: 450, fontStyle: italic, lineHeight: 1.35, opsz: 16 }
  meta:          { fontFamily: "{typography.sans}",  fontSize: 12px, fontWeight: 500, lineHeight: 1.35, fontVariantNumeric: tabular-nums }

rounded:
  none: 0px
  sm: 4px      # buttons, inputs, tree rows, chips — the single control radius
  md: 8px      # panels' outer corners on tablet drawers, bottom sheet top corners (12px on mobile)
  full: 9999px # system colour dots, slider thumb only

spacing:
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 20px
  "6": 24px
  "8": 32px
  "10": 40px
  "12": 48px
  "16": 64px
  "24": 96px
  "32": 128px

size:
  header: 56px
  header-mobile: 48px
  panel-left: 304px
  panel-right: 360px
  tree-row: 32px
  tree-row-touch: 48px
  control: 32px
  control-touch: 44px
  sheet-peek: 88px

motion:
  fast: 120ms
  base: 200ms
  camera: 400ms
  ease-out: "cubic-bezier(0.2, 0.8, 0.2, 1)"
  ease-in-out: "cubic-bezier(0.65, 0, 0.35, 1)"

components:
  button-primary:   { backgroundColor: "{colors.accent}", textColor: "{colors.on-accent}", typography: "{typography.ui}", rounded: "{rounded.sm}", height: "{size.control}", padding: "0 {spacing.3}" }
  button-secondary: { backgroundColor: "{colors.sunken}", textColor: "{colors.ink}", typography: "{typography.ui}", rounded: "{rounded.sm}", height: "{size.control}", padding: "0 {spacing.3}" }
  button-icon:      { backgroundColor: transparent, textColor: "{colors.ink-2}", rounded: "{rounded.sm}", size: "{size.control}" }
  input-search:     { backgroundColor: "{colors.sunken}", textColor: "{colors.ink}", typography: "{typography.ui}", rounded: "{rounded.sm}", height: 36px }
  tree-row:         { height: "{size.tree-row}", typography: "{typography.ui-latin}", indent: 16px }
  tree-row-selected:{ backgroundColor: "{colors.accent-subtle}", textColor: "{colors.ink}", leftBar: "2px {colors.accent}" }
  panel:            { backgroundColor: "{colors.panel}", edge: "1px {colors.rule}" }
  toolbar-stage:    { backgroundColor: "{colors.stage-raised}", rounded: "{rounded.sm}", height: 40px }
  focus-ring:       { outline: "2px solid {colors.accent}", outlineOffset: 2px }
---

# DESIGN.md: Laboratorium Anatomi Digital (Digital Anatomy Laboratory)

## 1. Visual Theme & Atmosphere

**Medical Atlas × Premium Scientific Editorial × Interactive 3D Visualization.**

The site should feel like a modern edition of a printed anatomy atlas (Sobotta, Gray's or Netter on good paper) that has become a precise instrument. The model is the only picture. Everything around it is quiet, typographic and exact.

- **Ground:** cool, neutral paper grey. It is not cream: we avoid the warm "assistant" palette, and a neutral grey also keeps mesh colours honest.
- **The 3D stage** sits one tone darker than the panels, like a light-box under a specimen. It is flat, with **no gradient vignette**.
- **Colour comes from anatomy:** bone ivory, muscle red, arterial red, venous blue, nerve yellow, lymph green. The UI chrome is ink-on-paper, and a single vermilion accent marks *what you are acting on*.
- **Editorial voice:** Latin nomenclature is set in italic Source Serif, as in an atlas caption. Interface text is IBM Plex Sans, technical but humane. Identifiers (FMA IDs, counts) use tabular figures.
- **Honest:** every number on screen is computed from the dataset. Sources and licences are one click away. There are no fake stats, testimonials, hero slogans or decorative 3D blobs.
- **Two themes:** **Atlas** (light, default, for reading and self-study) and **Proyektor** (dark stage, for lecture halls where light UIs wash out).

## 2. Color Palette & Roles

### Surfaces (Atlas theme)
- **Paper** (`{colors.paper}` — `#F3F3F0`): the app ground and the about page background.
- **Panel** (`{colors.panel}` — `#FAFAF8`): left tree panel, right info panel, mobile sheet. It is separated from the stage by a tone step plus one 1 px `rule` edge.
- **Stage** (`{colors.stage}` — `#E4E5E1`): the WebGL clear colour. It is mid-light, so ivory bone still reads against it and dark vessels still read too.
- **Stage raised** (`{colors.stage-raised}` — `#EDEEEA`): the docked toolbar, layer slider track and isolation banner.
- **Sunken** (`{colors.sunken}` — `#E9EAE6`): inputs, hover ground and secondary buttons.
- **Rule** (`{colors.rule}` — `#D3D5D0`): hairlines, used **only** in dense data UI (tree group separators, property table rows, panel edges).

### Ink
- **Ink** (`#15191D`): all body text and Latin names.
- **Ink 2** (`#3E454D`): secondary names (English), metadata and icons at rest.
- **Ink 3** (`#646B73`): hidden-structure rows, placeholder text, disabled states. It measures 4.8:1 on paper, which stays readable.

### Accent: one colour, one meaning ("this is what you're acting on")
- **Accent** (`#C2410C`, vermilion): primary button, focus ring, selected tree-row bar, selected text, and the active state of a toggled tool. It measures 5.0:1 on panel.
- **Accent hover** (`#9A3412`), **accent subtle** (`#F6E3D9`, selected-row ground), **on accent** (`#FFFFFF`).
- **Selection 3D** (`#FF6A1A`): the WebGL outline and emissive tint for selected meshes. It is brighter than UI accent to survive lighting. It is never used for text.
- **X-ray ink** (`#2A3540`, dark `#C9D3DC`): the single neutral tint for translucent non-selected meshes in x-ray mode.

### Semantic
- **Danger** `#B42318` (load failure), **Warning** `#A15C07` (slow network), **Success** `#2F7D4F` (link copied). These appear only in toasts and inline messages, never as large fields.

### Proyektor theme (dark)
| Role | Hex | Notes |
|---|---|---|
| paper | `#101316` | app ground |
| panel | `#171B1F` | panels and sheet |
| stage | `#1C2126` | WebGL clear colour; slightly lifted so dark muscles still separate |
| stage-raised | `#242A30` | toolbar |
| sunken | `#20252A` | inputs |
| rule | `#2E353C` | hairlines |
| ink / ink-2 / ink-3 | `#ECEEEF` / `#B7BDC3` / `#8B939B` | ink-3 measures 5.6:1 on panel |
| accent | `#FF7A3D` | 6.3:1 on panel; text on accent buttons uses `#101316` |
| accent-subtle | `#3A2318` | selected row ground |

### Atlas system colours (anatomy data only)
These follow printed-atlas convention. They tint meshes (as base colour under neutral lighting), appear as 10 px **dots** in the tree and legend, and as the 3 px system mark in the info panel. **They are never used for buttons, backgrounds or text.**

| System (ID / Latin) | Token | Hex | Rationale |
|---|---|---|---|
| Rangka / Systema skeletale | `sys-skeletal` | `#E3DAC4` | bone ivory |
| Otot / Systema musculare | `sys-muscular` | `#A8453D` | muscle red-brown |
| Kardiovaskular (arteri) / Systema cardiovasculare | `sys-cardiovascular` | `#C1272D` | arterial red |
| Kardiovaskular (vena) | `sys-cardiovascular-venous` | `#2E5AA6` | venous blue; veins keep atlas blue |
| Saraf / Systema nervosum | `sys-nervous` | `#DDAE2E` | nerve yellow |
| Pernapasan / Systema respiratorium | `sys-respiratory` | `#E09A97` | lung pink |
| Pencernaan / Systema digestorium | `sys-digestive` | `#C4844C` | gut ochre |
| Perkemihan / Systema urinarium | `sys-urinary` | `#8A6BB0` | plum (anatomy data only; not a UI colour) |
| Reproduksi / Systemata genitalia | `sys-reproductive` | `#C25685` | rose |
| Endokrin / Glandulae endocrinae | `sys-endocrine` | `#2F9A8A` | teal |
| Limfatik / Systema lymphoideum | `sys-lymphatic` | `#6A9F45` | lymph green (atlas convention) |
| Indra / Organa sensuum | `sys-sensory` | `#3A9CC0` | cerulean, clearly lighter than venous blue |

Mesh rendering notes: use `MeshStandardMaterial` with roughness 0.55–0.7 and metalness 0. Set colours in sRGB and let the renderer convert. The same hexes work in both themes. In the Proyektor theme raise ambient light by about 15 % instead of changing the colours.

## 3. Typography Rules

**Two families, both free and self-hosted via Fontsource (SIL OFL 1.1):**

| Role | Family | npm package | Import |
|---|---|---|---|
| Serif: Latin names, display, about page | **Source Serif 4** (variable: wght, opsz, italic) | `@fontsource-variable/source-serif-4` (v5.3.x) | `import '@fontsource-variable/source-serif-4/opsz.css'` and `import '@fontsource-variable/source-serif-4/opsz-italic.css'` |
| Sans: UI, Indonesian text, data | **IBM Plex Sans** (variable: wght) | `@fontsource-variable/ibm-plex-sans` (v5.3.x) | `import '@fontsource-variable/ibm-plex-sans'` |
| Fallback if the variable build is unwanted | IBM Plex Sans static | `@fontsource/ibm-plex-sans` | `400.css`, `500.css`, `600.css` |

CSS family names: `"Source Serif 4 Variable"` and `"IBM Plex Sans Variable"`. Both cover Latin Extended (Indonesian and Latin need no extra subsets). Preload the Latin-subset woff2 of Plex Sans and Source Serif italic. Use `font-display: swap`. **No third family, no monospace.** FMA IDs use Plex Sans with `font-variant-numeric: tabular-nums`.

| Token | Family | Size | Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|---|
| `display` | Serif, opsz 60 | 44 px (mobile 32) | 560 | 1.04 | −0.025em | About page title only |
| `title-latin` | Serif *italic*, opsz 32 | 24 px (mobile 20) | 520 | 1.15 | −0.01em | Selected structure's Latin name in the info panel |
| `heading` | Sans | 16 px | 600 | 1.35 | 0 | Panel section headings ("Hierarki", "Bagian dari") in sentence case, **not** uppercase |
| `body` | Sans | 16 px | 400 | 1.55 | 0 | Descriptions, about page text (max 68ch) |
| `ui` | Sans | 14 px | 450 | 1.4 | 0 | Buttons, tabs, Indonesian names in rows, toasts |
| `ui-latin` | Serif *italic*, opsz 16 | 15 px | 450 | 1.35 | 0 | Latin names in tree rows and search results |
| `meta` | Sans, tabular | 12 px | 500 | 1.35 | +0.01em | FMA IDs, counts, orientation label, shortcuts |

Rules:
- At most **5 sizes per view** (the app view uses 24 / 16 / 15 / 14 / 12).
- **Latin is always italic serif with `lang="la"`.** Indonesian is roman sans. English is roman sans in ink-2 with `lang="en"`. This three-way distinction is the typographic signature of the site.
- Sentence case everywhere. Never use letter-spaced uppercase eyebrow labels.
- Use `text-wrap: balance` on titles and `text-wrap: pretty` on body. Use proper `…` and curly quotes.
- Body text is full ink. Grey (ink-2/3) is only for secondary information.
- Proyektor theme: `ui` becomes 15 px and `meta` 13 px.

## 4. Component Stylings

**Buttons** (radius `sm` 4 px everywhere, flat, single fill, no shadow):
- *Primary:* accent fill, white text, 32 px tall (44 on touch). Used for one action per context, e.g. "Isolasi" in the info panel or "Salin tautan" in the header.
- *Secondary:* sunken fill, ink text. Hover goes one tone darker (`#DFE0DB`); press goes darker again with `scale(0.98)`.
- *Icon button:* transparent at rest, sunken on hover, with an accent icon and accent-subtle ground when **toggled on** (x-ray, labels). Always has an `aria-label` plus a tooltip with the shortcut ("Mode Sinar-X · X").
- *Text link:* ink with a 1 px underline at 0.3 opacity, which becomes a full-opacity underline on hover.

**Search field:** sunken ground, 36 px tall, no border at rest. A leading magnifier icon, a trailing `/` key hint in `meta` on a panel-tone chip. Focus shows the focus ring. The results list is panel-tone and flush under the field. Its group headers use the `heading` token at 13 px in ink-2 with the count.

**Tree:**
- Rows are 32 px (48 on touch) with a 16 px indent per level and a chevron 16 px.
- Each row has a system dot (10 px circle), the name (`ui-latin` or `ui`) and a trailing eye toggle that appears on hover/focus and always when hidden.
- *Selected:* accent-subtle ground plus a 2 px accent bar on the left edge.
- *Hidden:* ink-3 text plus an eye-off icon.
- *Faded:* ink-2 text plus a half-eye icon.
- Group separators are 1 px `rule` lines between systems only.

**Info panel:**
- Top to bottom: a 3 px system colour mark with the system name in `ui` ink-2, the Latin `title-latin`, the Indonesian name in `body`, the English name in `ui` ink-2, then the FMA ID in `meta` with a copy icon.
- Then the action row: primary **Isolasi**, secondary **Sembunyikan** and **Pudarkan**, and a ⋯ menu (Sembunyikan lainnya, Pudarkan lainnya, Salin nama).
- Sections follow, separated by 24 px space (not boxes): **Hierarki** (breadcrumb with › separators, each crumb a link), **Bagian dari / Terdiri dari** (lists of links), **Deskripsi**, **Sumber**.

**Stage toolbar:** docked at the stage's bottom-centre, 40 px tall, on stage-raised with radius 4. It is **not floating with a shadow and not glass**. Groups (Reset | view presets 1–6 | Sinar-X | Label | zoom −/+) are divided by 8 px gaps, not lines.

**Layer slider ("Kedalaman"):** vertical at the stage's right edge. The track is 4 px stage-raised, with 5 tick stops and the step labels in `meta` to the left of each tick. The thumb is a 16 px ink circle with a 2 px paper ring; when focused it gets an accent ring. The current label is shown in ink and the others in ink-3.

**Isolation banner:** a top-centre strip on the stage in stage-raised, reading "Isolasi aktif: *Arcus aortae*" with a "Keluar (Esc)" text button.

**Toast:** bottom-left of the stage on desktop and above the sheet on mobile. Ink background with paper text (inverted). Radius 4, max 360 px wide, with an optional action ("Urungkan") in dark-accent colour.

**Bottom sheet (mobile):** panel tone, top corners 12 px, and a 4×36 px ink-3 handle. There is **no shadow**: it is separated from the stage by the tone step plus a 1 px rule on its top edge. Snap points are 88 px, 50 dvh and 92 dvh.

**Hover label (3D):** a small flat chip in panel tone with the 1 px rule, `ui-latin` text and the system dot. It is offset 12 px from the cursor.

**Focus ring:** `outline: 2px solid accent; outline-offset: 2px` on `:focus-visible` for every control, including tree items and the canvas.

## 5. Layout Principles

- **The app view is a fixed-viewport tool,** not a scrolling page: `100dvh` grid with header / [left | stage | right].
- **Desktop ≥ 1200:** a 56 px header, the left panel at 304 px (resizable 256–400), the stage fluid (min 560) and the right panel at 360 px (collapsible to a rail).
- **The model is centred and framed to about 80 % of the stage height;** the default camera is anterior with a slight 10° yaw so depth reads.
- Internal panel padding is 16 px horizontal. Section rhythm inside panels is 24 px between sections and 8 px within.
- **Text blocks share 2–3 left edges:** the panel content edge (16 px) and the tree indent steps.
- **About page (`/tentang/`):** a single column of max 68ch for body text, with the display title at the top. The sources and licences table spans to 960 px. Section gaps are 96–128 px. It ends with a designed footer: attribution line, version and dataset date. It is not a sitemap.
- The spacing scale is 4-based: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96, 128.

## 6. Depth & Elevation

The interface is flat: **no resting shadows anywhere.** Depth comes only from tone steps, and from the 3D model itself.

| Level | Treatment | Use |
|---|---|---|
| 0: Ground | `paper` | app background |
| 1: Panel | `panel` + 1 px `rule` edge toward the stage | side panels, sheet |
| 1: Stage | `stage` (one step darker) | the 3D viewport |
| 2: On-stage controls | `stage-raised` | toolbar, slider track, isolation banner |
| 3: Transient overlay | `panel` + 1 px `rule` + **one** soft shadow `0 8px 24px rgba(21,25,29,0.12)` **only while open** | search results popover, context menu, shortcut dialog, tablet drawer |

Modals use a flat scrim at `rgba(16,19,22,0.4)`. There is no backdrop blur.

## 7. Do's and Don'ts

**Do**
- Let the model be the hero: the stage has the largest area and the highest contrast subject.
- Use system colours only for anatomy. Use the accent only for "acting on" (selection, focus, primary action).
- Show **Latin + Indonesian + English + FMA ID** for every structure. Set Latin in italic serif.
- Make every 3D action reachable from the tree, search, info panel and keyboard.
- Put view state into the URL; make "Salin tautan tampilan" prominent for the lecturer.
- Credit BodyParts3D (© DBCLS, CC BY-SA 2.1 JP) on the about page, in the info panel footer and on every exported image.
- Show computed counts with `Intl.NumberFormat('id-ID')` ("2.031 struktur").
- Design loading, empty and error states with a next step in each.

**Don't**
- No gradients, glows, neon, glassmorphism or backdrop blur, and no resting drop shadows.
- No hero landing page, slogans, fake stats, "trusted by" logos, testimonials or feature-card grids with icons on top.
- No violet/indigo UI, and no cream + terracotta palette.
- No uppercase letter-spaced eyebrow labels, no "01 / 02 / 03" numbering, no pill badges as decoration, no emoji.
- No third typeface and no monospace.
- No auto-rotating model by default, and no decorative motion.
- No colour-only meaning: system dots always carry a name; hidden/faded states carry icons.
- No disabling pinch-zoom on the page (`user-scalable=no`), and no `transition: all`.
- No Latin names in roman type, no Indonesian names in italic.

## 8. Responsive Behavior

| Name | Width | Layout |
|---|---|---|
| Desktop L | ≥ 1440 | Left 320, right 380; toolbar labels visible next to icons |
| Desktop | 1200–1439 | Left 304, stage fluid, right 360; toolbar icons + tooltips |
| Laptop / tablet landscape | 1024–1199 | Left 272; right panel becomes an overlay drawer (360) opened on selection |
| Tablet portrait | 768–1023 | Stage full; left side sheet (400) toggled from the top bar; info shows in a bottom sheet |
| Mobile | < 768 | Top bar 48; stage full-bleed with safe areas; **bottom sheet** (peek 88 / half 50 dvh / full 92 dvh) with tabs **Info · Sistem · Lapisan**; search opens the sheet at full height; 2 floating stage buttons max (Reset, Sinar-X) on `stage-raised`, 44 px |

Touch: 44 px targets, 48 px tree rows. `touch-action: none` on the canvas only. Sheets use `overscroll-behavior: contain`. Camera re-frames the selection into the visible area above the sheet.

Motion (all of it functional):

| What | Duration / easing | Reduced motion |
|---|---|---|
| Hover/press feedback | `fast` 120 ms, ease-out, opacity/transform only | unchanged (no travel) |
| Panel/drawer/sheet open | `base` 200 ms, ease-out, translate + opacity | opacity only |
| Camera fly-to (select/frame/preset) | `camera` 400 ms, ease-in-out; any input interrupts it | instant cut |
| Selection highlight | outline appears instantly; emissive eases in over 120 ms | instant |
| Layer change | meshes fade 160 ms | instant |
| Tree expand | 120 ms height via `grid-template-rows` 0fr→1fr | instant |

Never use `transition: all`.

## 9. Agent Prompt Guide

When generating UI for this project:
1. Read the YAML tokens above. Generate CSS custom properties from them (`--color-paper`, `--sys-nervous`, …) with `[data-theme="proyektor"]` overrides, and use **only** those variables.
2. Use the app-view skeleton: CSS grid `header / left stage right`. The stage hosts a Three.js canvas with clear colour `var(--color-stage)`.
3. Latin names: `<i lang="la" class="latin">Arcus aortae</i>` styled with the serif italic token. English: `<span lang="en">`.
4. Buttons: 4 px radius, flat, one fill. The primary uses accent. One primary per context.
5. Separate surfaces by tone; use a 1 px `rule` only in dense lists and panel edges; shadows only on open popovers.
6. Copy is in Bahasa Indonesia, active voice, second person, with specific labels ("Isolasi struktur", "Salin tautan tampilan"), "…" in loading states and a next step in every error.
7. Before handing off, check: no gradients, glass, neon or eyebrow labels; ≤ 2 font families; ≤ 5 sizes; contrast ≥ 4.5:1; visible focus; reduced-motion path; state in URL; attribution present.

Example prompt: "Build the right info panel for a selected structure using DESIGN.md tokens. Show a system mark, the Latin name in `title-latin`, the Indonesian and English names, the FMA ID in `meta` with a copy button, an action row (primary Isolasi, secondary Sembunyikan and Pudarkan, and a ⋯ menu), and a Hierarki breadcrumb. No cards, no shadows, 24 px between sections."
