<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.8.3

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.8.3** was hardened automatically. 3 finding(s) were identified and resolved across 2 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Multiple `uses:` references are pinned to mutable tags or branch names instead of immutable 40-character commit SHAs, making the action vulnerable to supply-chain attacks if the referenced tag or branch is moved or compromised.

Failing references:
- action.yml: `actions/setup-node@v5`
- reviewer.yml: `aryan6673/openrabbit@main`
- .github/workflows/acknowledge-contributors.yml: `actions/checkout@v3`
- .github/workflows/auto-version.yml: `actions/checkout@v5`, `softprops/action-gh-release@v3`
- .github/workflows/pr-review.yml: `aryan6673/openrabbit@main`

Locations:

- `action.yml:38`
- `reviewer.yml:16`
- `.github/workflows/acknowledge-contributors.yml:16`
- `.github/workflows/auto-version.yml:16`
- `.github/workflows/auto-version.yml:56`
- `.github/workflows/pr-review.yml:13`

### script-injection (severity: high)

Direct `${{ ... }}` expression interpolation inside `run:` shell command strings (rule a). GitHub Actions performs template substitution before the shell ever sees the string, so any expression containing special characters can break out of the intended command context.

1. `.github/workflows/acknowledge-contributors.yml` — `USERNAMES="${{ steps.extract.outputs.usernames }}"` interpolates a step output (derived from untrusted issue body content) directly into a shell assignment inside a `run:` block.

2. `.github/workflows/auto-version.yml` — `TAG=${{ env.CURRENT_VERSION }}` interpolates an env-context value directly into a shell command.

3. `.github/workflows/auto-version.yml` — `BADGE_URL="https://img.shields.io/badge/version-${{ env.NEW_VERSION }}-orange"` and `grep -q "version-${{ env.NEW_VERSION }}"` interpolate env-context values directly into shell commands.

4. `.github/workflows/auto-version.yml` — `git commit -m "Update version badge to ${{ env.NEW_VERSION }}"` and `git push origin HEAD:${{ github.ref_name }}` interpolate env/github context values directly into shell commands.

Locations:

- `.github/workflows/acknowledge-contributors.yml:33`
- `.github/workflows/auto-version.yml:46`
- `.github/workflows/auto-version.yml:62`
- `.github/workflows/auto-version.yml:63`
- `.github/workflows/auto-version.yml:71`
- `.github/workflows/auto-version.yml:72`

### github-env-injection (severity: high)

In `.github/workflows/acknowledge-contributors.yml`, the `Extract usernames from issue body` step reads usernames from the GitHub issue body (an untrusted external input) via `jq -r '.issue.body' "$GITHUB_EVENT_PATH" | grep -oP ...` and writes the result to `$GITHUB_OUTPUT` using a heredoc (`echo "usernames<<EOF" >> $GITHUB_OUTPUT; echo "$USERNAMES" >> $GITHUB_OUTPUT; echo "EOF" >> $GITHUB_OUTPUT`) without applying the required sanitization step (`printf '%s' ... | tr -d '\n\r'`). An attacker who opens an issue with a crafted body containing newlines could inject arbitrary key=value pairs into `$GITHUB_OUTPUT`, potentially hijacking subsequent step outputs.

Locations:

- `.github/workflows/acknowledge-contributors.yml:29`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, script-injection, github-env-injection

**Notes:**

Fixed all three finding types across 5 files:

1. unpinned-uses: Pinned all 6 action references to full 40-char SHAs with tag comments preserved:
   - action.yml: actions/setup-node@v5 → @a0853c24544627f65ddf259abe73b1d18a591444
   - reviewer.yml: aryan6673/openrabbit@main → @d5f8e12f8f60a9bf125f69d81c4f59cf0bfdbc51
   - acknowledge-contributors.yml: actions/checkout@v3 → @a37ce9120846195fa4ece8f58b268e6043cb2f26
   - auto-version.yml: actions/checkout@v5 → @fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09
   - auto-version.yml: softprops/action-gh-release@v3 → @3d0d9888cb7fd7b750713d6e236d1fcb99157228
   - pr-review.yml: aryan6673/openrabbit@main → @d5f8e12f8f60a9bf125f69d81c4f59cf0bfdbc51

2. script-injection: Moved all ${{ }} expressions out of run: blocks into env: blocks:
   - acknowledge-contributors.yml: steps.extract.outputs.usernames → env EXTRACTED_USERNAMES
   - auto-version.yml: env.CURRENT_VERSION → env CURRENT_VERSION in bump step
   - auto-version.yml: env.NEW_VERSION and github.ref_name → env NEW_VERSION and REF_NAME in badge update step

3. github-env-injection: Fixed the GITHUB_OUTPUT write in acknowledge-contributors.yml by replacing the heredoc pattern with sanitized single-line write using printf | tr -d '\n\r' to strip newlines before writing to $GITHUB_OUTPUT.

### Iteration 2

**Fixes applied:** script-injection

**Notes:**

Fixed two script injection vulnerabilities:

1. acknowledge-contributors.yml (line 43): Replaced unsafe `for USERNAME in $USERNAMES` (which word-splits untrusted issue body content) with `while IFS= read -r USERNAME; do ... done <<< "$EXTRACTED_USERNAMES"`. Added strict input validation (regex check for alphanumeric/hyphen/underscore only) before using USERNAME in any shell command. Quoted all uses of $USERNAME in curl URL, grep, echo, and git commit --author arguments. Changed `grep -q` to `grep -qF` for literal string matching.

2. auto-version.yml (line 52): Quoted all three `echo $TAG` usages to `echo "$TAG"` to prevent word-splitting and glob expansion on the env.CURRENT_VERSION value in the cut/tr pipeline.

