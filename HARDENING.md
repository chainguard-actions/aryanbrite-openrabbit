<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.7.8

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.7.8** was hardened automatically. 2 finding(s) were identified and resolved across 2 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Multiple `uses:` references are pinned to mutable tags or branch names instead of immutable 40-character commit SHAs, making the action vulnerable to supply-chain attacks if the referenced tag or branch is moved or compromised.

- action.yml: `uses: actions/setup-node@v5` (tag `v5`)
- .github/workflows/auto-version.yml: `uses: actions/checkout@v5` (tag `v5`) and `uses: softprops/action-gh-release@v3` (tag `v3`)
- .github/workflows/pr-review.yml: `uses: aryan6673/openrabbit@main` (branch `main`)

Locations:

- `action.yml:43`
- `.github/workflows/auto-version.yml:18`
- `.github/workflows/auto-version.yml:63`
- `.github/workflows/pr-review.yml:14`

### script-injection (severity: high)

Multiple `run:` blocks in `.github/workflows/auto-version.yml` directly interpolate `${{ ... }}` expressions into shell commands (sub-rule a). GitHub Actions performs YAML template substitution before the shell ever sees the string, so any newlines, shell metacharacters, or command-substitution sequences in the value are executed by the shell.

Offending lines:
- Line 47: `TAG=${{ env.CURRENT_VERSION }}` — env context interpolated directly into shell assignment
- Line 69: `BADGE_URL="https://img.shields.io/badge/version-${{ env.NEW_VERSION }}-orange"` — env context in shell string
- Line 70: `if grep -q "version-${{ env.NEW_VERSION }}"` — env context in shell command argument
- Line 78: `git commit -m "Update version badge to ${{ env.NEW_VERSION }}"` — env context in shell command argument
- Line 79: `git push origin HEAD:${{ github.ref_name }}` — github context (branch name, attacker-controllable via PR) interpolated directly into shell command

Locations:

- `.github/workflows/auto-version.yml:47`
- `.github/workflows/auto-version.yml:69`
- `.github/workflows/auto-version.yml:70`
- `.github/workflows/auto-version.yml:78`
- `.github/workflows/auto-version.yml:79`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, script-injection

**Notes:**

Fixed all 4 unpinned action references by resolving them to full 40-character commit SHAs (actions/setup-node@v5, actions/checkout@v5, softprops/action-gh-release@v3, aryan6673/openrabbit@main). Fixed all 5 script injection instances in auto-version.yml by moving ${{ env.CURRENT_VERSION }}, ${{ env.NEW_VERSION }}, and ${{ github.ref_name }} expressions out of run: shell strings and into step-level env: blocks, then referencing them as plain shell variables ($CURRENT_VERSION, ${NEW_VERSION}, ${REF_NAME}).

### Iteration 2

**Fixes applied:** script-injection

**Notes:**

Fixed unquoted variable expansion in the 'Bump version (patch)' step of .github/workflows/auto-version.yml. Changed all three instances of `echo $TAG` to `echo "$TAG"` (lines 58-60): MAJOR=$(echo "$TAG" | cut -d. -f1 | tr -d 'v'), MINOR=$(echo "$TAG" | cut -d. -f2), and PATCH=$(echo "$TAG" | cut -d. -f3). This prevents shell metacharacters in the TAG value (derived from env.CURRENT_VERSION) from being interpreted by the shell.

