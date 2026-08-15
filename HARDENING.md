<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.7.1

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.7.1** was hardened automatically. 2 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Multiple action references use mutable tags or branch names instead of pinned 40-character commit SHAs, making the workflow vulnerable to supply-chain attacks if the referenced tag or branch is moved or compromised.

Failing references:
- action.yml: `uses: actions/setup-node@v5` (tag)
- .github/workflows/auto-version.yml: `uses: actions/checkout@v5` (tag)
- .github/workflows/auto-version.yml: `uses: softprops/action-gh-release@v3` (tag)
- .github/workflows/pr-review.yml: `uses: aryan6673/openrabbit@main` (branch)
- reviewer.yml: `uses: aryan6673/openrabbit@main` (branch)

Locations:

- `action.yml:44`
- `.github/workflows/auto-version.yml:18`
- `.github/workflows/auto-version.yml:69`
- `.github/workflows/pr-review.yml:14`
- `reviewer.yml:13`

### script-injection (severity: high)

Multiple `run:` blocks in .github/workflows/auto-version.yml directly interpolate GitHub Actions expressions (`${{ ... }}`) into shell commands (sub-rule a). These expressions are substituted by the Actions runner before the shell parses the command, allowing an attacker who can influence the value (e.g. via a crafted git tag or ref name) to inject arbitrary shell commands.

Offending lines:
- Line 55: `TAG=${{ env.CURRENT_VERSION }}` — env context interpolated directly into shell assignment
- Line 77: `BADGE_URL="https://img.shields.io/badge/version-${{ env.NEW_VERSION }}-orange"` — env context in shell string
- Line 78: `if grep -q "version-${{ env.NEW_VERSION }}" "$README_FILE"; then` — env context in shell command argument
- Line 88: `git commit -m "Update version badge to ${{ env.NEW_VERSION }}"` — env context in shell command argument
- Line 89: `git push origin HEAD:${{ github.ref_name }}` — github context (branch/ref name) interpolated directly into shell command

Fix: move the values into `env:` variables and reference them as `"$ENV_VAR"` in the shell script.

Locations:

- `.github/workflows/auto-version.yml:55`
- `.github/workflows/auto-version.yml:77`
- `.github/workflows/auto-version.yml:78`
- `.github/workflows/auto-version.yml:88`
- `.github/workflows/auto-version.yml:89`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, script-injection

**Notes:**

Fixed all 5 unpinned action references by resolving their full 40-character commit SHAs via lookup_action_sha: actions/setup-node@v5 (a0853c2), actions/checkout@v5 (fbc6f39), softprops/action-gh-release@v3 (3d0d988), and aryan6673/openrabbit@main (d5f8e12) in both pr-review.yml and reviewer.yml. Fixed all 5 script injection issues in auto-version.yml by moving ${{ env.CURRENT_VERSION }}, ${{ env.NEW_VERSION }}, and ${{ github.ref_name }} out of run: shell strings and into step-level env: blocks, then referencing them as plain shell variables ($CURRENT_VERSION, ${NEW_VERSION}, "$REF_NAME").

