# CVForge Agent Workflow

## 1. Gemini Responsibilities
- Conducting deep repository audits.
- Updating documentation (`CLAUDE.md`, `agent-handoff.md`, etc.).
- Repository summarization and architectural mapping.
- Formulating QA plans and checking diffs.

## 2. Claude Code Responsibilities (Token-Saving Rules)
- Execute focused implementation slices quickly.
- Do NOT restate the entire project or context.
- Do NOT produce long plans unless explicitly asked.
- Do NOT audit unrelated areas.
- Do NOT read old forks or `tmp/` directories.
- Return ONLY: the changed files, a concise summary of the change, and the exact validation commands for the user.
- Inspect specific, relevant files before making edits.
- Adhere strictly to coding and product rules outlined in `CLAUDE.md`.

## 3. User Responsibilities
- Formulating the initial task prompt.
- Manually running validation commands (`pnpm typecheck`, `make check`, etc.).
- Performing manual browser QA.
- Committing changes via git once validation passes.

## 4. Commit & Execution Policy
- Agents must **never** execute `git commit` unless explicitly instructed.
- Agents must not run build, install, or validation scripts (e.g., `pnpm`, `make`, `docker`).
- Agents must provide the exact commands for the user to copy/paste.

## 5. Execution Rule
- When a coding agent is running, **wait for its response** before sending the next prompt. Do not queue overlapping directives.
