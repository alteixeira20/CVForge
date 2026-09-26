# CVForge History Cleanup: Co-author Trailers and Em Dashes

Date: 2026-09-26
Repository: `alteixeira20/CVForge`
Local checkout: `/home/alteixeira20/Projects/Anvilary-Tools/CVForge`
Inventory revision: `main` = `origin/main` = `d858f37c1e817c8fae319f7709124ec652eb955f`

This document covers historical Git metadata only. Current-file em dash cleanup and
recurrence prevention are tracked in the findings register
(`cvforge-release-readiness-2026-09-26.md`) and remediation plan.

## 1. Conclusion

No history rewrite is required.

Across every reachable local ref, every remote branch, and the stash, there are zero
commits containing a `Co-authored-by` trailer (any letter case) and zero commit messages
containing U+2014 (em dash) or U+2013 (en dash). A `git-filter-repo` rewrite would be a
no-op that changes no SHA, so none was executed and no backup or force-push procedure
needs to be applied. The prepared procedure in section 5 remains available if the
inventory changes before release.

## 2. Ref inventory

Remote (`git ls-remote origin`, 2026-09-26):

| Ref | SHA |
| --- | --- |
| `HEAD` | `d858f37c1e817c8fae319f7709124ec652eb955f` |
| `refs/heads/main` | `d858f37c1e817c8fae319f7709124ec652eb955f` |
| `refs/heads/agent/cvforge-final-deployment-hardening` | `d858f37c1e817c8fae319f7709124ec652eb955f` |
| `refs/heads/agent/cvforge-analyzer-seo-polish` | `61955fb4ad8db9a3ec9d7957df10d586ac7d21f7` |
| `refs/heads/agent/cvforge-ship-readiness` | `5f78e9fc777935695ebd7cfc150b1a3ca497ab7e` |

- No tags exist locally or remotely.
- No `refs/pull/*` refs are advertised. `gh pr list --state all` returns an empty list:
  the repository has never had a pull request, open or closed.
- Both `agent/*` branches other than `final-deployment-hardening` are fully merged into
  `main` (`git log main..<branch>` is empty).
- Local-only refs: `refs/stash` (`70fc5d5`, "wip: previous pdf preview smoothing
  attempt", 2026-05-14) and the audit branch `audit/release-readiness-2026-09-26`
  (created at `d858f37`). The stash was inspected and left untouched; it targets an
  earlier `useDebouncedPdfPreview` implementation that the current canvas pipeline
  replaced.

## 3. Commit inventory

| Check | Command basis | Result |
| --- | --- | --- |
| Total commits on all refs | `git rev-list --all` | 157 |
| `Co-authored-by` trailers | `git log --all -i --grep='^co-authored-by:'` and a full-body grep | 0 |
| Claude/Anthropic/"Generated with" mentions in messages | full-body case-insensitive grep | 0 |
| Em dash (U+2014) in messages | `--grep` and full-body grep | 0 |
| En dash (U+2013) in messages | `--grep` | 0 |
| Signed commits | `%G?` not `N` | 1: `2bbfe01 Initial commit` (GitHub web-flow signature, status `E` locally because GitHub's key is not in the local keyring) |
| Merge commits | `git rev-list --all --merges` | 1 |

Author and committer identities:

- 156 commits: author and committer `Alexandre Teixeira <alexandremagteixeira@gmail.com>`.
- 1 commit (`Initial commit`): author `Alexandre Teixeira <111787685+alteixeira20@users.noreply.github.com>`, committer `GitHub <noreply@github.com>`.

## 4. Mechanisms that could introduce trailers

| Location | Finding |
| --- | --- |
| `git config` (`commit.template`, `trailer.*`, `core.hooksPath`) | None set at any level. |
| `.git/hooks` | Only `*.sample` files. |
| Tracked files | No tracked file contains `Co-authored-by`. |
| `CLAUDE.md`, `AGENTS.md`, `docs/agent-workflow.md` | Forbid agent commits without explicit instruction; say nothing about trailers. |
| `.claude/settings.local.json` | Untracked (ignored by the user's global Git ignore); permissions only. |
| `~/.claude/settings.json` (user-level Claude Code settings) | No `attribution` or `includeCoAuthoredBy` override. Claude Code's default commit attribution therefore appends a `Co-Authored-By: Claude ...` trailer to commits it creates. This is the live mechanism. It has not affected this repository's history because no agent-created commit carried it. |

Recurrence prevention (tracked as a finding in the register):

1. A tracked project `.claude/settings.json` that disables Claude Code commit and PR
   attribution for this repository.
2. A versioned `commit-msg` hook that rejects `Co-authored-by` trailers and em dashes,
   installed through `git config core.hooksPath` by an explicit opt-in command.
3. A CI job that checks every commit in the pushed range (or pull request range) for the
   same patterns, so a bypassed local hook is still caught.

The user-level `~/.claude/settings.json` is outside this repository. Setting
`"attribution": { "commit": "", "pr": "" }` there is recommended so other repositories
are also covered; it is left as an owner action.

## 5. Prepared rewrite procedure (not executed; not needed today)

Use only if a later inventory finds affected commits. Never run against the working
checkout.

```bash
# 0. Tooling (not installed on this machine as of 2026-09-26)
pipx install git-filter-repo

# 1. Record and back up
git -C /home/alteixeira20/Projects/Anvilary-Tools/CVForge ls-remote origin > refs-before.txt
git clone --mirror git@github.com:alteixeira20/CVForge.git cvforge-backup.git
git -C cvforge-backup.git bundle create ../cvforge-backup.bundle --all
git bundle verify cvforge-backup.bundle

# 2. Rewrite a disposable mirror
git clone --mirror cvforge-backup.git cvforge-rewrite.git
cd cvforge-rewrite.git
git filter-repo --force --message-callback '
import re
message = re.sub(rb"(?im)^co-authored-by:.*\n?", b"", message)
message = message.replace("\u2014".encode(), b" - ")
return message.rstrip(b"\n") + b"\n"
'

# 3. Verify trees are unchanged commit-for-commit
git -C ../cvforge-backup.git log --all --format='%T %s' | sort > ../trees-before.txt
git log --all --format='%T %s' | sort > ../trees-after.txt
# Expect identical tree sets; subjects differ only where an em dash was replaced.

# 4. Publish (requires explicit owner approval)
git push --force --mirror origin

# 5. Recovery
git -C cvforge-backup.git push --force --mirror origin
```

Consequences if ever executed: every descendant of the first affected commit receives a
new SHA; the GitHub-signed `Initial commit` keeps its SHA only if it is unaffected;
branch protection on `main` must permit force-push temporarily; existing clones and
forks keep old objects until they re-clone or hard-reset; GitHub may retain unreachable
objects and cached views until garbage collected, which only GitHub Support can
expedite.

## 6. Remnants outside our control

None identified. There are no pull requests, no forks were checked (not visible without
additional API scope), and no tags or releases. If forks exist, they are unaffected
because there is nothing to rewrite.
