<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.7.8

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `1`

Action **aryanbrite--openrabbit/v0.7.8** was hardened automatically. 2 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### script-injection (severity: high)

Multiple ${{ }} expressions are interpolated directly inside run: shell command strings in auto-version.yml, violating sub-rule (a). Affected lines: (1) `TAG=${{ env.CURRENT_VERSION }}` (line 47) — env context injected directly into shell; (2) `BADGE_URL="https://img.shields.io/badge/version-${{ env.NEW_VERSION }}-orange"` (line 72); (3) `if grep -q "version-${{ env.NEW_VERSION }}"` (line 73); (4) `git commit -m "Update version badge to ${{ env.NEW_VERSION }}"` (line 82); (5) `git push origin HEAD:${{ github.ref_name }}` (line 83) — github context injected directly into shell.

Locations:

- `.github/workflows/auto-version.yml:47`
- `.github/workflows/auto-version.yml:72`
- `.github/workflows/auto-version.yml:73`
- `.github/workflows/auto-version.yml:82`
- `.github/workflows/auto-version.yml:83`

### unpinned-uses (severity: high)

Multiple uses: references are pinned to mutable tags or branch names instead of full 40-character commit SHAs. Failing references: action.yml: `actions/setup-node@v5`; .github/workflows/auto-version.yml: `actions/checkout@v5`, `softprops/action-gh-release@v3`; .github/workflows/pr-review.yml: `aryan6673/openrabbit@main`.

Locations:

- `action.yml:44`
- `.github/workflows/auto-version.yml:19`
- `.github/workflows/auto-version.yml:64`
- `.github/workflows/pr-review.yml:14`

## Iteration Notes

### Iteration 1

**Fixes applied:** script-injection, unpinned-uses

**Notes:**

Fixed script-injection in auto-version.yml by moving all ${{ env.CURRENT_VERSION }}, ${{ env.NEW_VERSION }}, and ${{ github.ref_name }} expressions out of run: shell strings into step-level env: blocks, then referencing them as plain shell variables ($CURRENT_VERSION, $NEW_VERSION, $REF_NAME). Fixed unpinned-uses by pinning: actions/setup-node@v5 → @a0853c24544627f65ddf259abe73b1d18a591444 in action.yml; actions/checkout@v5 → @93cb6efe18208431cddfb8368fd83d5badbf9bfd in auto-version.yml; softprops/action-gh-release@v3 → @718ea10b132b3b2eba29c1007bb80653f286566b in auto-version.yml; aryan6673/openrabbit@main → @8a049571dca3c278417865e12ec4331b90f44c67 in pr-review.yml. All pinned references include the original tag/branch as a comment for readability.

