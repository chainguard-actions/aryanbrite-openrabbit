<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.7.3

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.7.3** was hardened automatically. 2 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Multiple `uses:` references pin to mutable tags or branch names instead of immutable 40-character commit SHAs, making the action vulnerable to supply-chain attacks if the referenced tag or branch is moved or compromised.

Failing references:
- action.yml: `actions/setup-node@v5`
- .github/workflows/auto-version.yml: `actions/checkout@v5`, `softprops/action-gh-release@v3`
- .github/workflows/pr-review.yml: `aryan6673/openrabbit@main`
- reviewer.yml: `aryan6673/openrabbit@main`

Locations:

- `action.yml:37`
- `.github/workflows/auto-version.yml:18`
- `.github/workflows/auto-version.yml:65`
- `.github/workflows/pr-review.yml:13`
- `reviewer.yml:13`

### script-injection (severity: high)

Sub-rule (a): GitHub Actions expressions (`${{ ... }}`) are interpolated directly inside `run:` shell command strings, bypassing shell quoting and allowing injection of arbitrary shell metacharacters.

1. In the 'Bump version (patch)' step, `${{ env.CURRENT_VERSION }}` is interpolated directly into the shell script: `TAG=${{ env.CURRENT_VERSION }}`. Although `env.CURRENT_VERSION` is set from git tag output in a prior step, any `${{ ... }}` inside a `run:` block is a script-injection finding per the check rules.

2. In the 'Update version badge in README' step, `${{ env.NEW_VERSION }}` is interpolated directly into multiple shell commands:
   - `BADGE_URL="https://img.shields.io/badge/version-${{ env.NEW_VERSION }}-orange"`
   - `if grep -q "version-${{ env.NEW_VERSION }}" "$README_FILE"`
   - `git commit -m "Update version badge to ${{ env.NEW_VERSION }}"`

3. In the same step, `${{ github.ref_name }}` is interpolated directly into: `git push origin HEAD:${{ github.ref_name }}`. `github.ref_name` is attacker-controllable (e.g. via a branch name containing shell metacharacters).

Locations:

- `.github/workflows/auto-version.yml:51`
- `.github/workflows/auto-version.yml:71`
- `.github/workflows/auto-version.yml:72`
- `.github/workflows/auto-version.yml:79`
- `.github/workflows/auto-version.yml:80`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, script-injection

**Notes:**

Fixed all unpinned action references by resolving them to full 40-character commit SHAs using lookup_action_sha: actions/setup-node@v5, actions/checkout@v5, softprops/action-gh-release@v3, and aryan6673/openrabbit@main (used in both pr-review.yml and reviewer.yml). Fixed script injection in auto-version.yml by moving all ${{ env.CURRENT_VERSION }}, ${{ env.NEW_VERSION }}, and ${{ github.ref_name }} expressions out of run: shell strings and into step-level env: blocks, referencing them as plain shell variables ($CURRENT_VERSION, $NEW_VERSION, $REF_NAME) in the scripts.

