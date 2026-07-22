<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.8.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.8.0** was hardened automatically. 3 finding(s) were identified and resolved across 2 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Multiple `uses:` references are pinned to mutable tags or branch names rather than immutable 40-character commit SHAs, making the action vulnerable to supply-chain attacks if the referenced tag or branch is moved or compromised.

Failing references:
- action.yml: `uses: actions/setup-node@v5`
- acknowledge-contributors.yml: `uses: actions/checkout@v3`
- auto-version.yml: `uses: actions/checkout@v5`
- auto-version.yml: `uses: softprops/action-gh-release@v3`
- pr-review.yml: `uses: aryan6673/openrabbit@main`

Locations:

- `action.yml:38`
- `.github/workflows/acknowledge-contributors.yml:14`
- `.github/workflows/auto-version.yml:16`
- `.github/workflows/auto-version.yml:57`
- `.github/workflows/pr-review.yml:14`

### script-injection (severity: high)

Direct `${{ ... }}` expression interpolation inside `run:` shell command strings — violates sub-rule (a). The expressions are expanded by the GitHub Actions template engine before the shell ever sees them, allowing an attacker to inject arbitrary shell commands.

(1) `.github/workflows/acknowledge-contributors.yml` — `${{ steps.extract.outputs.usernames }}` is interpolated directly into the shell variable assignment inside a `run:` block. The `steps.extract.outputs.usernames` value is derived from the untrusted issue body.

```yaml
run: |
  USERNAMES="${{ steps.extract.outputs.usernames }}"
```

(2) `.github/workflows/auto-version.yml` — `${{ env.CURRENT_VERSION }}` is interpolated directly into a `run:` block:

```yaml
run: |
  TAG=${{ env.CURRENT_VERSION }}
```

Additionally, `${{ env.NEW_VERSION }}` and `${{ github.ref_name }}` are interpolated directly in the 'Update version badge in README' run block:

```yaml
run: |
  BADGE_URL="https://img.shields.io/badge/version-${{ env.NEW_VERSION }}-orange"
  if grep -q "version-${{ env.NEW_VERSION }}" "$README_FILE"; then
  ...
  git push origin HEAD:${{ github.ref_name }}
```

Locations:

- `.github/workflows/acknowledge-contributors.yml:32`
- `.github/workflows/auto-version.yml:43`
- `.github/workflows/auto-version.yml:72`
- `.github/workflows/auto-version.yml:73`
- `.github/workflows/auto-version.yml:82`

### github-env-injection (severity: high)

In `.github/workflows/acknowledge-contributors.yml`, the `Extract usernames from issue body` step writes `$USERNAMES` — a value derived from the untrusted issue body via `jq -r '.issue.body'` — directly to `$GITHUB_OUTPUT` using a heredoc without applying the required sanitization step (`printf '%s' ... | tr -d '\n\r'`). A malicious issue body could inject arbitrary key=value pairs into the output context, potentially poisoning subsequent steps.

```yaml
run: |
  USERNAMES=$(jq -r '.issue.body' "$GITHUB_EVENT_PATH" | grep -oP ...)
  ...
  echo "usernames<<EOF" >> $GITHUB_OUTPUT
  echo "$USERNAMES" >> $GITHUB_OUTPUT   # FAIL: no sanitization
  echo "EOF" >> $GITHUB_OUTPUT
```

Locations:

- `.github/workflows/acknowledge-contributors.yml:28`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, script-injection, github-env-injection

**Notes:**

Fixed all 3 findings across 4 files:

1. **unpinned-uses** (5 locations): Pinned all action references to full 40-char SHAs with tag comments preserved:
   - action.yml: actions/setup-node@v5 → @a0853c24544627f65ddf259abe73b1d18a591444
   - acknowledge-contributors.yml: actions/checkout@v3 → @a37ce9120846195fa4ece8f58b268e6043cb2f26
   - auto-version.yml: actions/checkout@v5 → @fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09
   - auto-version.yml: softprops/action-gh-release@v3 → @3d0d9888cb7fd7b750713d6e236d1fcb99157228
   - pr-review.yml: aryan6673/openrabbit@main → @d5f8e12f8f60a9bf125f69d81c4f59cf0bfdbc51

2. **script-injection** (5 locations): Moved all ${{ }} expressions from run: blocks into step env: blocks and referenced them as plain shell variables ($CURRENT_VERSION, $NEW_VERSION, $REF_NAME, $USERNAMES).

3. **github-env-injection** (1 location): Replaced the heredoc-based multi-line GITHUB_OUTPUT write in acknowledge-contributors.yml with a sanitized single-line write using `printf '%s' "$USERNAMES" | tr -d '\n\r'` to strip newlines before writing to $GITHUB_OUTPUT.

### Iteration 2

**Fixes applied:** script-injection

**Notes:**

Fixed two script injection findings:

1. `.github/workflows/acknowledge-contributors.yml` (lines 40, 42): Replaced `for USERNAME in $USERNAMES; do` (unquoted expansion of workflow-controllable env var) with `while IFS= read -r USERNAME; do ... done <<< "$USERNAMES"`. This feeds the double-quoted variable line-by-line into `read -r`, eliminating word-splitting and glob injection. Also quoted `$USERNAME` in the curl URL as `"https://api.github.com/users/$USERNAME"`.

2. `.github/workflows/auto-version.yml` (line 48): Quoted `$TAG` in all three `echo` command substitutions — changed `echo $TAG` to `echo "$TAG"` in the MAJOR, MINOR, and PATCH assignments — preventing shell metacharacter injection from the workflow-controllable `CURRENT_VERSION` env var.

