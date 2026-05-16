# Current Focus: Documentation and Next Slices

## 1. Current State
CVForge has recently completed major UI and architectural milestones:
- **PDF.js Canvas Preview**: Replaced the native iframe preview with a custom PDF.js canvas rendering pipeline. This eliminates iframe flashing during active typing, preserves old pages until new pages are ready, and supports zoom/fit controls for a sharp, calm editing experience.
- **Workbench Polish**: The Builder interface has been heavily polished. Key improvements include repeatable item cards, shared expand/collapse behavior, multi-section expansion, focus-on-add behavior, hold-to-delete, inline editable section titles, description format toggling (bullets vs. paragraph), compact Settings panels, and an expanded palette of 10 professional color presets.
- **Settings Adjustments**: The "Section Order & Visibility" drag-and-drop feature has been temporarily removed from the Builder Settings to simplify the current UI.

## 2. Pinned Future Slices
The following features are conceptually planned but deferred to future implementation slices. Do not attempt to build them during current tasks unless explicitly instructed.
- **Builder Settings Advanced PDF Controls**: Real, fine-grained PDF formatting controls (e.g., margins, line-height).
- **Builder Section Ordering / Drag-and-Drop**: Restoring and polishing the ability to drag and drop sections to reorder them in the CV.
- **PDF Template Polish**: Enhancements to the `@react-pdf/renderer` template designs.
- **Website/Marketing Polish**: Improvements to the landing page and marketing copy.
- **Parser Improvements**: Richer PDF extraction and scoring heuristic checks.

## 3. Constraints (Do Not Touch List)
- Do NOT implement product or UI code when asked to audit or document.
- Do NOT redesign the core product layout or Workbench shell.
- Do NOT add database, backend, or account-related language to documentation.
- Maintain the local-first, browser-only product identity.