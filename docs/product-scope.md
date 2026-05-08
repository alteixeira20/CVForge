# Product Scope: CVForge

## 1. Vision
To provide the world's most transparent and privacy-preserving CV optimization tool.

## 2. Core Features (MVP)
- **Local PDF Parsing**: Extract resume data from PDF files using `pdf.js` entirely in the browser.
- **ATS Scoring Engine**: Heuristic analysis of resume structure, content, and formatting.
- **CV Builder**: Interactive editor with real-time PDF generation via `@react-pdf/renderer`.
- **Format Support**: Toggle between US Letter and EU A4 with appropriate margin and typography adjustments.
- **Session Persistence**: Use `localStorage` to save work-in-progress without requiring an account.

## 3. Out of Scope
- Server-side storage of resumes.
- User accounts and social login.
- Third-party data analytics that compromise privacy.
