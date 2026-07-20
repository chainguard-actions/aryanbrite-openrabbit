<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.7.6

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.7.6** was hardened automatically. 2 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Multiple `uses:` references pin to mutable tags or branch names instead of immutable 40-character commit SHAs, making the action vulnerable to supply-chain attacks if the referenced tag or branch is moved or overwritten.

Failing references:
- action.yml: `actions/setup-node@v5`
- .github/workflows/auto-version.yml: `actions/checkout@v5`, `softprops/action-gh-release@v3`
- .github/workflows/pr-review.yml: `aryan6673/openrabbit@main`
- reviewer.yml: `aryan6673/openrabbit@main`

Locations:

- `action.yml:36`
- `.github/workflows/auto-version.yml:19`
- `.github/workflows/auto-version.yml:62`
- `.github/workflows/pr-review.yml:13`
- `reviewer.yml:13`

### script-injection (severity: high)

Direct `${{ ... }}` expression interpolation inside `run:` shell command strings (rule a). GitHub Actions performs YAML template substitution before the shell ever sees the string, so any special characters in the value are interpreted by the shell.

1. "Bump version (patch)" step (line 47): `TAG=${{ env.CURRENT_VERSION }}` — the `env.CURRENT_VERSION` value (derived from git tag output) is interpolated directly into the shell command. If a tag name contains shell metacharacters, it will be executed.

2. "Update version badge in README" step (lines 70, 71, 79, 80): `${{ env.NEW_VERSION }}` is interpolated directly into shell strings used in `BADGE_URL=`, `grep -q`, `git commit -m`, and `git push origin HEAD:${{ github.ref_name }}`. The `github.ref_name` context is attacker-influenced (branch/tag name) and is interpolated directly into a shell command.

Locations:

- `.github/workflows/auto-version.yml:47`
- `.github/workflows/auto-version.yml:70`
- `.github/workflows/auto-version.yml:71`
- `.github/workflows/auto-version.yml:79`
- `.github/workflows/auto-version.yml:80`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, script-injection

**Notes:**

Fixed all 5 unpinned action references by pinning to full 40-character commit SHAs (actions/setup-node@v5→a0853c24..., actions/checkout@v5→fbc6f399..., softprops/action-gh-release@v3→3d0d9888..., aryan6673/openrabbit@main→d5f8e12f... in both pr-review.yml and reviewer.yml). Fixed script injection in auto-version.yml by moving ${{ env.CURRENT_VERSION }} into an env: block in the 'Bump version' step, and moving ${{ env.NEW_VERSION }} and ${{ github.ref_name }} into env: blocks in the 'Update version badge in README' step, replacing all inline ${{ }} expressions in run: shell strings with plain environment variable references.

