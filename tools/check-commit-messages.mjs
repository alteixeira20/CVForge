import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import process from 'node:process'

// Commit message policy: no Co-authored-by trailers (any letter case) and no
// em dashes (U+2014). Used by the commit-msg hook (--file) and by CI, which
// checks every commit reachable from HEAD (or a given revision range).
// Usage:
//   node tools/check-commit-messages.mjs --file .git/COMMIT_EDITMSG
//   node tools/check-commit-messages.mjs [revision-range]
const EM_DASH = String.fromCharCode(0x2014)
const CO_AUTHOR = /^\s*co-authored-by\s*:/im

function problemsIn(message) {
  const body = message
    .split('\n')
    .filter((line) => !line.startsWith('#'))
    .join('\n')
  const problems = []
  if (CO_AUTHOR.test(body)) problems.push('contains a Co-authored-by trailer')
  if (body.includes(EM_DASH)) problems.push('contains an em dash (U+2014)')
  return problems
}

function checkFile(path) {
  const problems = problemsIn(readFileSync(path, 'utf8'))
  if (problems.length === 0) return 0
  console.error(`Commit message rejected: it ${problems.join(' and ')}.`)
  console.error('Remove the trailer and use " - ", a comma, or parentheses instead of em dashes.')
  return 1
}

function checkHistory(range) {
  const output = execFileSync('git', ['log', '--format=%H%x00%B%x1e', range], { encoding: 'utf8' })
  const commits = output.split('\x1e').map((entry) => entry.trim()).filter(Boolean)
  const failures = []
  for (const entry of commits) {
    const [sha, message = ''] = entry.split('\0')
    const problems = problemsIn(message)
    if (problems.length > 0) failures.push(`${sha.slice(0, 12)}: ${problems.join(', ')}`)
  }
  if (failures.length === 0) {
    console.log(`Commit message check passed for ${commits.length} commits in ${range}.`)
    return 0
  }
  console.error(`Commit message policy violations in ${range}:`)
  for (const failure of failures) console.error(`  ${failure}`)
  return 1
}

const args = process.argv.slice(2)
if (args[0] === '--file') {
  process.exit(checkFile(args[1]))
}
process.exit(checkHistory(args[0] ?? 'HEAD'))
