# Current Focus: Calm Builder PDF Preview Updates

## 1. Problem
The Builder PDF preview iframe visibly flashes and reloads the native browser PDF viewer when the blob URL updates. Even with a 500ms debounce, this causes a jarring visual refresh during active drafting.

## 2. Root Cause
Native PDF iframe `src` changes always reload the internal PDF viewer. Since we cannot stop the viewer from destroying its UI on a `src` change, the only safe strategy is to drastically reduce how often the `src` changes while drafting.

## 3. Desired Behavior
Implement a "Calm Update" model in `BuilderPreviewPanel.tsx`:
- Keep the current PDF visible while editing.
- Avoid iframe `src` changes during active typing by using an idle delay: `AUTO_UPDATE_DELAY_MS` around 1600ms (acceptable range: 1500ms to 1800ms).
- Extract PDF generation logic into a standalone function: `refreshPreview({ immediate?: boolean })`.
- If the preview is stale (`currentSignature !== lastRenderedSignatureRef.current`), show a subtle "Update Pending" indicator near the Syncing badge.
- Add a manual "Refresh" button (using `btn sm` or `iconbtn`) to the `WorkbenchActionGroup`. This button must call `refreshPreview({ immediate: true })` to skip the idle delay.
- The first render from an empty CV must happen quickly.
- Stale async results cannot replace newer previews (use `generationRef`).
- Old object URLs are revoked only after the new replacement is ready.
- Empty CV state revokes the URL entirely and shows the empty UI.

## 4. Expected State/Refs
Use these specific variables in the implementation:
- `previewUrl` (state)
- `isGenerating` or `isSyncing` (state)
- `error` (state)
- `isPreviewStale` or `hasPendingUpdate` (derived from signatures)
- `urlRef` (ref for cleanup)
- `generationRef` (ref for async race protection)
- `lastRenderedSignatureRef` (ref to track what is currently on screen)
- `pendingTimeoutRef` (ref to manage the debounce timer)

## 5. Constraints (Do Not Touch List)
- Do NOT change the PDF export behavior (`DownloadPdfButton.tsx`).
- Do NOT modify the PDF document template (`ResumePdfDocument.tsx`).
- Do NOT modify state shape, `CVContext.tsx`, or Parser logic.
- Do NOT add new dependencies or web workers.

## 6. Exact Files to Edit
- `apps/web/src/features/builder/workbench/BuilderPreviewPanel.tsx`

## 7. Files to Read (Context)
- `apps/web/src/lib/cvState.ts` (for `getCVRenderSignature`)
- `apps/web/src/components/shared/workbench/PreviewCanvas.tsx`
- `apps/web/src/components/shared/workbench/WorkbenchActionGroup.tsx`

## 8. Validation Commands for User
Provide these to the user; do NOT run them yourself:
```bash
pnpm typecheck
pnpm build
```

## 9. Output Format Expected from Claude
1. Concise summary of the implementation.
2. The surgical code changes applied.
3. The validation commands to run.
