# UX & Information Architecture — Digital Anatomy Laboratory

Agent 6 · 2026-10-14 · Companion files: `research/WEB_DESIGN_RESEARCH.md`, `/DESIGN.md`
Audience: medical Master's students (S2) and their lecturer, in Indonesia. UI language is **Bahasa Indonesia**. Every structure shows the **Latin (Terminologia Anatomica) name**, the **English name** and the **FMA ID**.
Product shape: **one app view** (the atlas), plus **one about/sources page**. No marketing landing page.

---

## 1. Routes

Static hosting (Vite build). To stay safe on hosts without SPA rewrites, the app view lives at `/` and its state is held in **query params**. The about page is a separate static entry.

| Route | Title (ID) | Content |
|---|---|---|
| `/` | Laboratorium Anatomi Digital | The atlas: 3D viewer, navigation tree, search, info panel |
| `/tentang/` | Tentang & Sumber | Purpose, how to use (shortcut table), data sources & licences (BodyParts3D CC BY-SA 2.1 JP © DBCLS, FMA), font licences (OFL), credits, citation format, version/date of the dataset, limitations and disclaimer ("bukan untuk diagnosis klinis") |
| `/?…` (deep link) | — | Restores a view; see params below |
| 404 | Halaman tidak ditemukan | Plain message, link back to the atlas |

**Query params (the URL reflects state):**

| Param | Example | Meaning |
|---|---|---|
| `s` | `s=FMA9611` | Selected structure(s), comma-separated |
| `sys` | `sys=skeletal,cardiovascular` | Visible systems (omitted = default set) |
| `reg` | `reg=thorax` | Region filter |
| `hide` | `hide=FMA7088,FMA…` | Explicitly hidden structures (compressed if long) |
| `iso` | `iso=1` | Isolation active (isolate the current `s`) |
| `mode` | `mode=xray` | `normal` / `xray` |
| `layer` | `layer=3` | Depth step 0–4 |
| `cam` | `cam=anterior` or a compact quaternion+distance | Camera preset or exact pose |
| `lbl` | `lbl=1` | Labels on |
| `lang` | `lang=en` | Secondary name language (default `la`, Latin) |

A "Salin tautan tampilan" (copy view link) button writes this URL to the clipboard. This is the lecturer's main tool for putting views into slides.

Header nav, kept minimal: wordmark "Laboratorium Anatomi Digital", the links **Atlas** and **Tentang & Sumber**, and one action, **Salin tautan**. Nothing else.

---

## 2. Content hierarchy

```
Seluruh Tubuh (Whole Body)
└── Sistem (System)            e.g. Sistem Kardiovaskular — Systema cardiovasculare
    └── Regio (Region)         e.g. Toraks — Thorax
        └── Kelompok (Group)   e.g. Arteri besar toraks — Great arteries of thorax
            └── Struktur       e.g. Arcus aortae (FMA3768)
```

- **11 systems:** Rangka (skeletal), Otot (muscular), Kardiovaskular, Saraf (nervous), Pernapasan (respiratory), Pencernaan (digestive), Perkemihan (urinary), Reproduksi (reproductive), Endokrin (endocrine), Limfatik (lymphatic), Indra (sensory).
- **7 regions (a fixed teaching set):** Kepala & Leher, Toraks, Abdomen, Pelvis & Perineum, Punggung, Ekstremitas Atas, Ekstremitas Bawah. A structure that crosses regions (e.g. aorta, n. vagus, long muscles) is listed in **each** region it passes through, with a "lintas regio" marker. In the 3D scene it is still one mesh.
- **Groups** are curated by the data/anatomy agent from the FMA `part_of` / `is_a` relations. A group holds at most ~40 children; larger sets are split further. Left/right pairs collapse into a single node with **Kiri / Kanan / Keduanya** toggles.
- **Two tree lenses** (segmented control at the top of the left panel): **Sistem → Regio → Kelompok** (default) or **Regio → Sistem → Kelompok**. Both lenses reach the same leaf structures (the Visible Body Systems Tray + Region pattern).
- **Every leaf shows:** a system colour dot, the Indonesian name or Latin name (the primary label is configurable; default is Latin, since anatomy courses examine in Latin), and an eye toggle. FMA ID and English name are in the info panel.
- **Tree row states:** visible / hidden (eye-off, text at ink-3) / faded (half-filled eye) / selected (accent bar on the left, accent text) / partially visible parent (indeterminate eye).

---

## 3. Search

- **Entry:** the search field sits at the top of the left panel (desktop) and in the top bar (mobile, opening the sheet at full height). Shortcut `/` or `Ctrl K`.
- **Matching:** searches Latin, Indonesian and English names, synonyms, and the FMA ID (`FMA9611` or `9611`). It is **diacritic- and case-insensitive**, prefix matches rank higher, and it tolerates typos (Damerau ≤ 1 for queries of 5+ characters). Latin abbreviations are normalised: `a.` = arteria, `v.` = vena, `n.` = nervus, `m.` = musculus, `lig.` = ligamentum, plural `aa./vv./nn./mm.`
- **Results:** a combobox listbox (ARIA `combobox` + `listbox`), virtualised. Results are grouped by system, with a count per group ("Kardiovaskular · 14"). Each row shows the colour dot, the name with the matched fragment in medium weight (not colour), and a secondary line with the other-language name and the region.
- **Ranking:** exact > prefix > word-prefix > fuzzy. Ties go to structures that are currently visible, then to larger structures (by volume).
- **Keyboard:** ↑/↓ move, Enter selects and flies the camera to the structure, `Shift Enter` adds to the selection, Esc clears the query and then closes the list.
- **Choosing a result:** if its system is hidden, the system turns on automatically and an undoable toast appears ("Sistem Saraf ditampilkan · Urungkan"). The tree expands to reveal the node and scrolls it into view.
- **No results:** "Tidak ada struktur untuk "xyz"." followed by suggestions: check the spelling, try the Latin name, or try the FMA ID. Then show up to 3 closest fuzzy matches. Never show an empty box.
- **Recent:** before typing, the list shows the last 8 selections (localStorage) and a "Hapus riwayat" link.

---

## 4. Selection, visibility and view modes

### 4.1 Selection
- **Click/tap a mesh** to select it. The info panel opens and the mesh gets an accent outline (screen-space, 2 px) plus a subtle accent emissive tint. The tree row is highlighted.
- **`Ctrl`/`Shift`-click** adds to or removes from the selection. Clicking empty space or pressing **Esc** clears it.
- **Hover** (fine pointer only) shows a small label near the cursor with the Latin name and system dot, after a 150 ms delay. There is no hover on touch.
- **Double-click** or **F** frames the selection: the camera flies to fit it (400 ms ease-out; instant under reduced motion).
- **Click-through:** `Alt`-click selects the next mesh behind the current one along the ray, so deep structures can be reached without hiding.

### 4.2 Visibility actions
These are available in the info panel action row, on the context menu (right-click / long-press), and as shortcuts:

| Action (ID label) | Effect | Shortcut |
|---|---|---|
| Sembunyikan (Hide) | Selected → invisible | `H` or `Delete`/`Backspace` |
| Pudarkan (Fade) | Selected → 20 % opacity, no depth write | `J` |
| Isolasi (Isolate) | Hide everything except the selection; the camera frames it. An "Isolasi aktif · Keluar" bar appears at the top of the stage. | `I` |
| Sembunyikan lainnya | Hide everything except the selection, without changing the camera | `Shift H` |
| Pudarkan lainnya | Fade everything except the selection | `Shift J` |
| Tampilkan semua (Show all) | Clears hide/fade/isolate; keeps system toggles | `Shift A` |
| Reset tampilan | Default systems, camera, mode and layer | `R` (with undo toast) |
| Urungkan / Ulangi | Visibility history (50 steps) | `Ctrl Z` / `Ctrl Shift Z` |

- System eye toggles in the tree show or hide a whole system. `Alt`-click a system eye to solo that system.
- Hidden items stay in the tree (dimmed), so a hidden structure can be found and restored from the tree.

### 4.3 X-ray mode (global)
- Toggle with `X` or the toolbar button "Mode Sinar-X". All non-selected meshes render as **fresnel-edged translucent ink** (single neutral colour at ~15 % opacity, depth-sorted). The selection stays opaque in its system colour.
- If nothing is selected, the whole skeleton stays opaque in x-ray mode and everything else becomes translucent, which gives the student a frame of reference.

### 4.4 Layer slider ("Kedalaman")
- **Discrete 5-step slider** (Complete Anatomy-style numbered layers), vertical on the right edge of the stage on desktop and horizontal in the mobile sheet:
  - **4 Permukaan:** superficial muscles and superficial veins/nerves
  - **3 Otot dalam:** deep muscles
  - **2 Organ & pembuluh:** viscera, major vessels, nerves
  - **1 Rangka & ligamen:** bones, joints, ligaments
  - **0 Rangka saja:** skeleton only
- Each structure gets a `depthTier` in the data pipeline. Moving the slider down hides tiers above the value (it hides, it doesn't fade; x-ray stays a separate control).
- Keys `[` and `]` step through layers. The slider shows a numeric step and its Indonesian label, with `aria-valuetext` such as "Lapisan 2 dari 4: Organ & pembuluh".
- The layer interacts with system toggles by intersection: a structure is visible only if its system is on **and** its tier ≤ layer **and** it isn't hidden.

### 4.5 Labels
- `L` toggles pins with leader lines for the selected structures (max 12). Labels are DOM elements positioned over the canvas, so they stay selectable and accessible. With nothing selected, labels go to the largest visible structures in the current view.

### 4.6 Camera
- Orbit, pan and zoom (OrbitControls with damping off under reduced motion).
- View presets (toolbar plus keys): **Anterior `1`, Posterior `2`, Lateral kiri `3`, Lateral kanan `4`, Superior `5`, Inferior `6`**. Each view has an orientation label ("Anterior") in the stage corner, and a small orientation figure/axis gizmo.
- When the canvas is focused: arrow keys orbit by 15°, `+`/`-` zoom, `Shift`+arrows pan.

---

## 5. Keyboard shortcuts (complete list)

Active when focus is not in a text field. `?` opens a shortcut dialog listing them all, and the about page repeats the table.

| Key | Action |
|---|---|
| `/` or `Ctrl K` | Focus search |
| `Esc` | Close the topmost layer (dialog → search list → isolation → selection) |
| `F` / double-click | Frame selection |
| `H`, `Delete`, `Backspace` | Hide selected |
| `Shift H` | Hide others |
| `J` / `Shift J` | Fade selected / fade others |
| `I` | Isolate toggle |
| `Shift A` | Show all |
| `X` | X-ray toggle |
| `L` | Labels toggle |
| `[` / `]` | Layer deeper / shallower |
| `1`–`6` | Camera presets |
| Arrows, `+`/`-` | Orbit / zoom (canvas focused) |
| `R` | Reset view (undoable) |
| `Ctrl Z` / `Ctrl Shift Z` | Undo / redo visibility |
| `Ctrl C` (with a selection, canvas focused) | Copy the selected structure's Latin name + FMA ID |
| `?` | Shortcut help |
| `T` | Theme toggle: Atlas (light) ↔ Proyektor (dark) |
| `P` | Presentation mode (panels hidden; Esc exits) |

Single-letter shortcuts can be turned off in the settings popover (WCAG 2.1.4 Character Key Shortcuts).

---

## 6. Desktop layout (≥ 1200 px)

```
┌───────────────────────────────────────────────────────────────────────────┐
│ Laboratorium Anatomi Digital      Atlas · Tentang & Sumber   [Salin tautan]│ 56px header
├──────────────┬───────────────────────────────────────────┬────────────────┤
│ [Cari…     ] │                                           │ SISTEM DOT     │
│ (Sistem|Regio│                                     ┌─┐   │ Arcus aortae   │ serif 24 italic
│ ▾ Rangka   ◉ │                                     │4│   │ Lengkung aorta │ sans 16
│ ▾ Otot     ◉ │              3D STAGE               │3│   │ Aortic arch    │
│ ▸ Kardio…  ◉ │      (model centred, stage tone)    │2│◂  │ FMA3768        │
│   ▸ Toraks   │                                     │1│   │ [Sembunyikan][Pudarkan]
│     ▸ Arteri │                                     │0│   │ [Isolasi] [⋯]  │
│ …virtualised │  Anterior                           └─┘   │ Hierarki ───── │
│              │ ┌────────────────────────────────────┐    │ Sistem › Regio │
│ Legend /     │ │⟲ Reset ▢1▢2▢3… ◐ Sinar-X ⌖ Label ±│    │ › Kelompok     │
│ counts       │ └────────────────────────────────────┘    │ Relasi, catatan│
├──────────────┴───────────────────────────────────────────┴────────────────┤
  left 304px          fluid (min 560)                        right 360px
```

- The **left panel** (304 px, resizable 256–400) holds search, the lens switch, the virtualised tree, and a footer with visible/total counts ("1.214 / 2.031 struktur terlihat"), computed live.
- The **stage** is centred with the model framed to about 80 % of the stage height. It contains a docked toolbar at the bottom: a flat bar on a stage-raised tone, no glass and no float shadow. The layer slider is on the right edge. The orientation label sits at bottom-left, and the isolation banner at top-centre when active.
- The **right panel** (360 px) is the info panel. When nothing is selected it shows an empty state (§8). It can collapse to a 0-width rail with a "Info" tab when the user wants a larger stage. Contents, top to bottom:
  1. System dot + system name (small, ink-2)
  2. **Latin name** (serif italic, 24 px, `lang="la"`)
  3. Indonesian name (sans 16), English name (sans 14, ink-2, `lang="en"`)
  4. FMA ID (tabular, copy button)
  5. Action row
  6. **Hierarki** breadcrumb (clickable: selects the parent group, which highlights all its members)
  7. **Bagian dari / Terdiri dari** (FMA part_of / has_part lists, clickable)
  8. Short description (if the content agent provides one), with its source cited
  9. Data note: "Model: BodyParts3D, © DBCLS, CC BY-SA 2.1 JP"
- 1024–1199 px: the left panel narrows to 272 px and the right panel becomes an overlay drawer (360 px) over the stage edge that opens on selection.

## 7. Mobile layout (< 768 px): viewer first, bottom sheet

- The **top bar (48 px)** holds the wordmark (short form "Lab Anatomi"), a search icon button and a menu (Tentang & Sumber, theme, shortcuts off).
- The **stage fills the viewport** (`100dvh` minus the top bar), with safe-area insets. Floating controls are limited to 2 small buttons at the right edge: Reset and X-ray. The layer control lives in the sheet.
- **The bottom sheet** (`role="dialog"` non-modal, `aria-label="Panel atlas"`) has 3 snap points:
  - **Peek (88 px + safe area):** a handle, the selected structure's Latin name (or "Ketuk struktur untuk memilih"), and a primary action chip row: Sembunyikan · Isolasi · Fokus.
  - **Half (50 dvh):** tabs **Info · Sistem · Lapisan**. The stage stays visible and interactive above.
  - **Full (92 dvh):** for search results and deep tree browsing.
- The sheet is dragged by its handle, and tapping the handle cycles snap points. Keyboard and screen-reader users get explicit "Perluas / Ciutkan" buttons. Use `overscroll-behavior: contain`. The sheet never covers the selected structure: when the sheet opens to half height, the camera re-frames the selection into the visible top half.
- Gestures on the canvas: 1-finger orbit, 2-finger pinch zoom + pan, tap to select, long-press for the action menu, double-tap to frame. Each gesture has a button equivalent in the sheet.
- Touch targets are ≥ 44 px. Tree rows on mobile are 48 px high.
- **Tablet portrait (768–1023):** same pattern as mobile, but the sheet is a 400 px **side sheet on the left** in landscape.

---

## 8. Empty, loading and error states

| State | Where | Treatment (copy in ID) |
|---|---|---|
| First load | Stage | A centred determinate progress line plus "Memuat model rangka… 34 %". The skeleton loads first and renders as soon as it is ready; other systems stream in and their tree rows show a small loading indicator. No spinner-only screens. |
| Slow network (>8 s) | Stage | Adds "Koneksi lambat. Sistem lain dimuat bertahap; Anda sudah bisa menjelajah rangka." |
| WebGL unavailable | Stage | "Peramban ini tidak mendukung WebGL, jadi penampil 3D tidak dapat berjalan. Coba Chrome, Edge, atau Firefox terbaru, atau aktifkan akselerasi perangkat keras." The tree, search and info panel **still work** as a text atlas. |
| WebGL context lost | Stage | "Tampilan 3D terhenti (memori grafis penuh)." [Muat ulang penampil]; state is restored from the URL. |
| Model file failed | Tree row + toast | "Sistem Limfatik gagal dimuat. [Coba lagi]". Other systems are unaffected. |
| Nothing selected | Right panel | A short how-to, not a blank: "Pilih struktur pada model atau daftar untuk melihat nama Latin, hierarki, dan relasinya." followed by 3 keyboard hints. |
| Everything hidden | Stage | "Semua struktur disembunyikan." [Tampilkan semua] |
| Isolation of a hidden item | Toast | "Struktur ini tersembunyi; ditampilkan untuk isolasi." |
| Search empty | Results | See §3 |
| Invalid deep link | Toast | "Sebagian tautan tidak dikenali (FMA99999). Tampilan lain dipulihkan." |
| Offline after load | Toast | "Anda sedang luring. Model yang sudah dimuat tetap dapat digunakan." |

Loading copy ends with `…`. Errors always name the next step. Toasts use `aria-live="polite"` and auto-dismiss after 6 s. Undo toasts stay for 10 s, and the timer pauses on hover or focus.

---

## 9. Accessibility requirements

- **Target: WCAG 2.2 AA.**
- **The DOM twin:** everything possible in 3D is possible without the canvas (tree selection, visibility, isolate, layers, info). The canvas is an enhancement.
- **Tree** uses the WAI-ARIA tree pattern (`role="tree"`, `treeitem`, `aria-expanded`, `aria-level`, `aria-setsize`/`posinset` kept correct under virtualisation). Arrow-key navigation: →/← expand/collapse, Home/End, type-ahead. Space toggles visibility; Enter selects.
- **Canvas:** `tabindex="0"`, `role="application"` only while it has focus, with an `aria-roledescription` of "penampil 3D" and an `aria-label` that updates ("Model 3D, tampak anterior, 1 struktur dipilih: Arcus aortae").
- **Live region:** announces selection, visibility changes and load progress milestones (25/50/75/100 %), throttled.
- **Colour is never the only cue.** System colour dots are always paired with the system name. The selection is shown by an outline + panel + tree highlight. Hidden/faded states use icons as well as tone.
- **Contrast:** text ≥ 4.5:1, focus ring and UI boundaries ≥ 3:1, in both the Atlas and Proyektor themes (values verified in DESIGN.md).
- **Focus:** 2 px accent ring with a 2 px offset. Panels trap focus only when modal (shortcut dialog). The bottom sheet is non-modal.
- **Reduced motion:** camera fly-to becomes an instant cut, the sheet snaps without spring, and the highlight pulse becomes static.
- **Zoom/reflow:** UI works at 200 % zoom and 320 px width. Never disable pinch-zoom on the page; the canvas captures gestures only inside its own bounds.
- **Language:** `<html lang="id">`; Latin terms are `lang="la"` and English terms `lang="en"`, so screen readers switch pronunciation.
- **Target size:** ≥ 24 px (WCAG 2.5.8) on desktop and ≥ 44 px on touch.

---

## 10. Lecturer-specific affordances (low cost, high value)

- **Proyektor theme** (dark stage, larger UI text +2 px) for classroom projection.
- **Salin tautan tampilan:** a deep link to the exact view, ready to paste into slides or an LMS.
- **Presentation mode** (`P`): hides both panels and keeps only the stage, orientation label and a small caption with the selected Latin name. Esc exits.
- **Screenshot** ("Simpan gambar"): exports a PNG of the stage with the caption and the attribution line "BodyParts3D © DBCLS, CC BY-SA 2.1 JP", so licence compliance is built into every exported image.
