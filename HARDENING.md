<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.7.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.7.0** was hardened automatically. 3 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Multiple uses: references are pinned to mutable tags or branches instead of immutable full SHA digests, making the action vulnerable to supply-chain attacks. action.yml uses actions/setup-node@v5 (tag); auto-version.yml uses actions/checkout@v5 (tag) and softprops/action-gh-release@v3 (tag); pr-review.yml uses aryan6673/openrabbit@main (branch, especially dangerous as it tracks a mutable branch).

Locations:

- `action.yml:43`
- `.github/workflows/auto-version.yml:18`
- `.github/workflows/auto-version.yml:67`
- `.github/workflows/pr-review.yml:14`

### script-injection (severity: high)

Direct ${{ }} expression interpolation inside run: shell command strings (rule a). GitHub Actions substitutes these expressions as raw text before the shell executes the script. (1) Bump version step: TAG=${{ env.CURRENT_VERSION }} interpolates env.CURRENT_VERSION (derived from git tags) directly into the shell script. (2) Update version badge step: ${{ env.NEW_VERSION }} is interpolated directly into a BADGE_URL assignment, a grep argument, and a git commit message. ${{ github.ref_name }} is interpolated directly into git push origin HEAD:${{ github.ref_name }}, which is attacker-controllable via branch name.

Locations:

- `.github/workflows/auto-version.yml:50`
- `.github/workflows/auto-version.yml:72`
- `.github/workflows/auto-version.yml:73`
- `.github/workflows/auto-version.yml:84`
- `.github/workflows/auto-version.yml:86`

### github-env-injection (severity: high)

Unsanitized values are written to $GITHUB_ENV without the required printf sanitization step, enabling environment variable injection. (1) Get latest version from tags step: CURRENT_VERSION is populated from git tag output (which can be influenced by repository contributors) and written to $GITHUB_ENV via echo without newline sanitization. A crafted tag name containing a newline could inject additional environment variables. (2) Bump version step: NEW_VERSION is computed from CURRENT_VERSION (itself from git tag output) and written to $GITHUB_ENV without sanitization.

Locations:

- `.github/workflows/auto-version.yml:44`
- `.github/workflows/auto-version.yml:63`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, script-injection, github-env-injection

**Notes:**

Fixed all three findings across three files:

1. unpinned-uses: Pinned all four action references to full commit SHAs with tag comments preserved:
   - action.yml: actions/setup-node@v5 → @a0853c24544627f65ddf259abe73b1d18a591444 # v5
   - auto-version.yml: actions/checkout@v5 → @93cb6efe18208431cddfb8368fd83d5badbf9bfd # v5
   - auto-version.yml: softprops/action-gh-release@v3 → @3d0d9888cb7fd7b750713d6e236d1fcb99157228 # v3
   - pr-review.yml: aryan6673/openrabbit@main → @d5f8e12f8f60a9bf125f69d81c4f59cf0bfdbc51 # main

2. script-injection: Moved all ${{ }} expressions out of run: shell strings into step env: blocks:
   - 'Bump version' step: ${{ env.CURRENT_VERSION }} moved to env block as CURRENT_VERSION, referenced as "$CURRENT_VERSION" in shell
   - 'Update version badge' step: ${{ env.NEW_VERSION }} and ${{ github.ref_name }} moved to env block as NEW_VERSION and REF_NAME, referenced as ${NEW_VERSION} and ${REF_NAME} in shell

3. github-env-injection: Added printf sanitization before writing to $GITHUB_ENV:
   - 'Get latest version from tags': safe_version=$(printf '%s' "$CURRENT_VERSION" | tr -d '\n\r') before echo to GITHUB_ENV
   - 'Bump version': safe_new_version=$(printf '%s' "$NEW_VERSION" | tr -d '\n\r') before echo to GITHUB_ENV

