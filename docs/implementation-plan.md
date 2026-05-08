# Implementation Plan

## Phase 1: Foundation (COMPLETED)
- [x] Scaffold root monorepo (pnpm).
- [x] Establish `.gitignore` and `tmp/` quarantine.
- [x] Port Forge-family design tokens and UI atoms.
- [x] Create placeholder routes for `/`, `/builder`, `/parser`, and `/resume-import`.

## Phase 2: Core State & Types (COMPLETED)
- [x] Define Zod schemas for the CV model.
- [x] Establish the `useCV` hook with typed default state.
- [ ] Implement full editor state management (Redux or advanced Context).

## Phase 3: Parser & ATS Engine
- [ ] Port/Refactor `pdf.js` integration.
- [ ] Implement the standalone ATS scoring module.
- [ ] Add unit tests for the scoring heuristics.

## Phase 4: Builder & PDF
- [ ] Implement `@react-pdf` templates for A4 and Letter.
- [ ] Create the builder form components (Profile, Experience, etc.).
- [ ] Integrate the live PDF previewer.

## Phase 5: Polish & Launch
- [ ] Finalize landing page copy.
- [ ] Perform cross-browser testing.
- [ ] Deploy the production build.
