# LMDC Planner — Live

Live entry point for the LMDC (plan conversion) planner apps. Open `index.html` for a hub page linking to everything below.

## What's here

| File / folder | Role |
| --- | --- |
| `lmdc-planner-3.html` | **Current planner** — ground-up rebuild with left-nav workspace, Due Date Engine 2.0, Gantt timeline, and automatic migration of legacy saves. |
| `Transamerica - LMDC Planner.html` | Legacy main app (kept for reference and for plans still saved in its format). |
| `Transamerica - LMDC Planner - Left Nav Shell.html` | Legacy app wrapped in the left-nav command panel experiment. |
| `Transamerica - LMDC Planner v2.html` | v2 iteration of the legacy app. |
| `New Planner/` | Modular SPA rebuild (`index.html`, `app.js`, `styles.css`). |
| `LMDC Universal One-Page Checklist.html` | One-page implementation checklist reference. |
| `procedures/` | Standalone procedure pages for conversion workflow steps. |
| `avatar-pack/` | Team avatar SVGs used by the legacy apps. |

## Related repos

- **`lmdc-planner-workspace`** — the dev/working repo: docs, mocks, validation tools, simulations. The `index.html` tiles for Docs / Mocks / Tools link there.
- **`lmdc-planner-left-nav-shell`** — standalone publish of the left-nav shell app.

## Keeping copies in sync

Several files in this repo are byte-identical copies shared with the sibling repos (`Transamerica - LMDC Planner.html`, `... - Left Nav Shell.html`, `... v2.html`, `New Planner/`, `LMDC Universal One-Page Checklist.html`, `avatar-pack/`). The left-nav shell is also published as `index.html` in `lmdc-planner-left-nav-shell`. **Any edit to one copy must be applied to all copies** (or the copies consolidated to a single source) to avoid drift.

All apps are self-contained single-file HTML — no build step; open directly in a browser. Plan data is stored in the browser's `localStorage`; use each app's export feature for backups.
