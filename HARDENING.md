<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.6.9

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.6.9** was hardened automatically. 2 finding(s) were identified and resolved across 2 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Multiple `uses:` references are pinned to mutable tags or branch names instead of full 40-character commit SHAs, making the action vulnerable to supply-chain attacks if the referenced tag or branch is moved or overwritten.

Failing references:
- action.yml: `uses: actions/setup-node@v5`
- .github/workflows/auto-version.yml: `uses: actions/checkout@v5`
- .github/workflows/auto-version.yml: `uses: softprops/action-gh-release@v3`
- .github/workflows/pr-review.yml: `uses: aryan6673/openrabbit@main`
- reviewer.yml: `uses: aryan6673/openrabbit@main`

Locations:

- `action.yml:38`
- `.github/workflows/auto-version.yml:18`
- `.github/workflows/auto-version.yml:57`
- `.github/workflows/pr-review.yml:13`
- `reviewer.yml:13`

### script-injection (severity: high)

Multiple `run:` blocks in `.github/workflows/auto-version.yml` directly interpolate GitHub Actions expressions (`${{ ... }}`) inside shell command strings, violating sub-rule (a). Before the shell ever sees the string, YAML template substitution injects the value verbatim, allowing an attacker who can influence the value to inject arbitrary shell commands.

1. "Bump version (patch)" step (line ~47): `TAG=${{ env.CURRENT_VERSION }}` — the env context value is interpolated directly into the shell assignment without quoting or sanitization.

2. "Update version badge in README" step (line ~63): `BADGE_URL="https://img.shields.io/badge/version-${{ env.NEW_VERSION }}-orange"`, `if grep -q "version-${{ env.NEW_VERSION }}"`, `git commit -m "Update version badge to ${{ env.NEW_VERSION }}"`, and `git push origin HEAD:${{ github.ref_name }}` — all interpolate expressions directly inside shell commands.

Locations:

- `.github/workflows/auto-version.yml:47`
- `.github/workflows/auto-version.yml:63`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, script-injection

**Notes:**

Fixed all 5 unpinned `uses:` references by resolving full 40-character commit SHAs via lookup_action_sha: actions/setup-node@v5 (a0853c2), actions/checkout@v5 (93cb6ef), softprops/action-gh-release@v3 (3d0d988), and aryan6673/openrabbit@main (d5f8e12) in pr-review.yml and reviewer.yml. Fixed 2 script injection locations in auto-version.yml: (1) 'Bump version (patch)' step moved ${{ env.CURRENT_VERSION }} into an env: block; (2) 'Update version badge in README' step moved ${{ env.NEW_VERSION }} and ${{ github.ref_name }} into an env: block, referencing them as plain shell variables throughout the run script.

### Iteration 2

**Fixes applied:** script-injection

**Notes:**

Fixed the script injection vulnerability in `.github/workflows/auto-version.yml` (lines 58-60) by quoting `$TAG` in all three command substitutions: changed `echo $TAG` to `echo "$TAG"` in the MAJOR, MINOR, and PATCH assignments within the 'Bump version (patch)' step. This prevents shell metacharacters in the `CURRENT_VERSION` env value from being interpreted by the shell.

