<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.8.4

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.8.4** was hardened automatically. 3 finding(s) were identified and resolved across 2 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Multiple files reference Actions and Docker images using mutable tags or branch names instead of pinned 40-character commit SHAs, making the workflow vulnerable to supply-chain attacks if the tag is moved.

Failing references:
- action.yml: `uses: actions/setup-node@v5`
- .github/workflows/acknowledge-contributors.yml: `uses: actions/checkout@v3`
- .github/workflows/auto-version.yml: `uses: actions/checkout@v5`, `uses: softprops/action-gh-release@v3`
- .github/workflows/pr-review.yml: `uses: aryan6673/openrabbit@main`

Locations:

- `action.yml:38`
- `.github/workflows/acknowledge-contributors.yml:15`
- `.github/workflows/auto-version.yml:18`
- `.github/workflows/auto-version.yml:63`
- `.github/workflows/pr-review.yml:14`

### script-injection (severity: high)

Sub-rule (a): GitHub Actions expressions are interpolated directly inside `run:` shell command strings, allowing an attacker to inject arbitrary shell commands.

1. `.github/workflows/acknowledge-contributors.yml` (line 34): `USERNAMES="${{ steps.extract.outputs.usernames }}"` — the step output (derived from the untrusted issue body) is interpolated directly into the shell script. An attacker can craft an issue body to inject shell metacharacters.

2. `.github/workflows/auto-version.yml` (line 49): `TAG=${{ env.CURRENT_VERSION }}` — env context expression interpolated directly in a run block.

3. `.github/workflows/auto-version.yml` (line 70): `BADGE_URL="https://img.shields.io/badge/version-${{ env.NEW_VERSION }}-orange"` — env context expression interpolated directly in a run block.

4. `.github/workflows/auto-version.yml` (line 71): `if grep -q "version-${{ env.NEW_VERSION }}"` — env context expression interpolated directly in a run block.

5. `.github/workflows/auto-version.yml` (line 80): `git commit -m "Update version badge to ${{ env.NEW_VERSION }}"` — env context expression interpolated directly in a run block.

6. `.github/workflows/auto-version.yml` (line 81): `git push origin HEAD:${{ github.ref_name }}` — github context expression interpolated directly in a run block.

Locations:

- `.github/workflows/acknowledge-contributors.yml:34`
- `.github/workflows/auto-version.yml:49`
- `.github/workflows/auto-version.yml:70`
- `.github/workflows/auto-version.yml:71`
- `.github/workflows/auto-version.yml:80`
- `.github/workflows/auto-version.yml:81`

### github-env-injection (severity: high)

`.github/workflows/acknowledge-contributors.yml`: The `Extract usernames from issue body` step writes `USERNAMES` — derived from the untrusted issue body via `jq -r '.issue.body'` — to `$GITHUB_OUTPUT` using a heredoc without applying the required sanitization step (`printf '%s' ... | tr -d '\n\r'`). An attacker who opens an issue with a crafted body containing newlines can inject arbitrary key=value pairs into the output context, potentially poisoning subsequent steps that consume `steps.extract.outputs.usernames`.

Locations:

- `.github/workflows/acknowledge-contributors.yml:29`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, script-injection, github-env-injection

**Notes:**

Fixed all three findings across 4 files:

1. unpinned-uses: Pinned all 5 mutable action references to full 40-char SHAs: actions/setup-node@v5→a0853c24..., actions/checkout@v3→a37ce912..., actions/checkout@v5→fbc6f399..., softprops/action-gh-release@v3→3d0d9888..., aryan6673/openrabbit@main→d5f8e12f...

2. script-injection: Moved all 6 ${{ }} expressions out of run: blocks into step env: blocks — CURRENT_VERSION and NEW_VERSION in auto-version.yml, github.ref_name in auto-version.yml, and steps.extract.outputs.usernames in acknowledge-contributors.yml.

3. github-env-injection: Replaced the heredoc GITHUB_OUTPUT write (which allowed newline injection from untrusted issue body) with a sanitized single-line write using printf '%s' "$USERNAMES" | tr -d '\n\r' to strip newlines before writing to $GITHUB_OUTPUT.

### Iteration 2

**Fixes applied:** script-injection

**Notes:**

Fixed two script-injection findings:

1. `.github/workflows/acknowledge-contributors.yml` (lines 43, 45): Replaced the unquoted `for USERNAME in $USERNAMES` loop with `read -ra USERNAME_ARRAY <<< "$USERNAMES"` and `for USERNAME in "${USERNAME_ARRAY[@]}"` to safely split the space-separated list into an array without word-splitting/glob expansion. Also quoted the curl URL to `"https://api.github.com/users/${USERNAME}"` to prevent injection via the loop variable.

2. `.github/workflows/auto-version.yml` (lines 58–60): Quoted the TAG assignment (`TAG="$CURRENT_VERSION"`) and all three `echo $TAG` invocations (`echo "$TAG"`) so that shell metacharacters in the workflow-controllable CURRENT_VERSION value cannot be interpreted by the shell.

