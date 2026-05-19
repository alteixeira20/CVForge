# Current Focus: Manual QA and Post-Refactor Validation

## 1. Current State

CVForge has recently completed a multi-slice Builder, Settings, PDF, and accessibility sprint:

- **Builder Settings - Advanced PDF Controls**: Fine-grained PDF layout settings now ship in the Builder: theme color, font family, font size, page size, section heading font weight, top accent bar toggle and height, per-section vertical gaps (section gap, item gap, bullet gap), and compact mode. All controls wire directly to `createResumePdfStyles()` and affect the live preview.
- **Builder Section Ordering and Visibility**: Sections can be reordered up/down via arrow controls and toggled visible/hidden per section. Inline editable section titles are keyboard-accessible (Enter/Space to activate, Enter to save, Escape to cancel). The `settings.sectionOrder` and `settings.visibleSections` fields drive both Builder order and PDF output order.
- **Builder Workbench Modularity**: `BuilderSectionList.tsx` was decomposed from a 232-line monolith into a clean module set: `builderSectionConfig.tsx` (static data), `useBuilderSectionState.ts`, `useBuilderSectionActions.ts`, `BuilderSectionCard.tsx`, `SectionReorderControls.tsx`, and `AddCustomSectionCard.tsx`.
- **RepeatableSectionEditor Cleanup**: Dead props (`title`, `icon`, `onAdd`, `addLabel`, `hideTitle`) removed. API simplified to `emptyLabel`, `items`, `renderItem`, `focusLatestVersion`.
- **Editor Consistency**: Education location field added. `useDescriptionModeToggle` hook extracted from Work/Edu/Projects/Custom item files. `FeaturedSkillItem` key fixed.
- **Accessibility Polish**: Enter-to-blur on all single-line `TextInput` and `NumberInput` fields (with `isComposing` guard). `focus-visible:outline-none` on all form fields. `EditableSectionTitle` made keyboard-navigable with `tabIndex=0`, `role="button"`, and `onKeyDown`. `aria-label` added to action buttons throughout (section reorder, item move, hold-to-delete, featured skill actions). `aria-pressed` added to content rendering mode buttons.
- **Dead Code Removal**: `SectionCard.tsx`, `useExpandedItem.ts`, `FONT_FAMILY_OPTIONS`, and `styles.entryGroup` removed. `entrySpacing` removed from Settings UI (kept in schema for backward compatibility).
- **PDF Parity**: All 5 parity items confirmed in the current codebase - accent stripe positioning, always-mono dates, `<View>` bullet markers, nested language proficiency `<Text>`, and all 9 advanced settings wired to `resumePdfStyles.ts`.

## 2. What to Do Next

**Immediate - Validation:**
- Run `make check` (typecheck + lint + build) to surface any type or lint errors from the recent slices.
- Manual QA against `pdf-mockup/CVForge PDF Template.html` - visual spot-check of the live preview and a downloaded PDF.

**PDF Phase 2 Refinements (deferred):**
- `sectionTitleText.letterSpacing`: 1.2 -> 1.3
- `skillLabel`: add `paddingTop: 1.5`, `letterSpacing: 0.2`
- `entrySubtitle.marginBottom`: 2 -> 3
- `dateSize` offset: -1.5 -> -2 (gives 9pt at default font size 11pt)
- Delete `pdf-mockup/` after visual approval

## 3. Genuinely Deferred (Do Not Implement Unless Instructed)

- **Font embedding**: Geist Sans / Geist Mono as real PDF font assets (Phase 3 of PDF work).
- **Photo support**: User photo upload and photo-layout PDF template.
- **Drag-and-drop section reordering**: Arrow-based reorder is shipped; drag-and-drop is a UX enhancement for later.
- **Richer parser extraction and scoring**: Heuristic checks remain minimal by design.
- **Website/marketing polish**: Landing page copy and visual improvements.
- **Root architecture cleanup**: Monorepo tooling, Docker CI, deployment polish.

## 4. Constraints (Do Not Touch List)

- Do NOT implement product or UI code when asked to audit or document.
- Do NOT redesign the core product layout or Workbench shell.
- Do NOT add database, backend, or account-related language to documentation.
- Maintain the local-first, browser-only product identity.
