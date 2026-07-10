<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.8.4

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `1`

Action **aryanbrite--openrabbit/v0.8.4** was hardened automatically. 3 finding(s) were identified and resolved across 3 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Multiple `uses:` references are pinned to mutable tags or branch names instead of full 40-character commit SHAs, making the action vulnerable to supply-chain attacks if the referenced tag or branch is moved or overwritten.

Failing references:
- action.yml: `uses: actions/setup-node@v5`
- .github/workflows/acknowledge-contributors.yml: `uses: actions/checkout@v3`
- .github/workflows/auto-version.yml: `uses: actions/checkout@v5`
- .github/workflows/auto-version.yml: `uses: softprops/action-gh-release@v3`
- .github/workflows/pr-review.yml: `uses: aryan6673/openrabbit@main` (branch ref — especially dangerous)

Locations:

- `action.yml:38`
- `.github/workflows/acknowledge-contributors.yml:14`
- `.github/workflows/auto-version.yml:14`
- `.github/workflows/auto-version.yml:52`
- `.github/workflows/pr-review.yml:14`

### script-injection (severity: high)

Rule (a): GitHub Actions expressions (`${{ ... }}`) are interpolated directly inside `run:` shell command strings, allowing an attacker to inject arbitrary shell commands.

1. `.github/workflows/acknowledge-contributors.yml` — `USERNAMES="${{ steps.extract.outputs.usernames }}"` is interpolated directly in a `run:` block. The value originates from the issue body (user-controlled) and is passed through `steps.extract.outputs.usernames` without sanitization.

2. `.github/workflows/auto-version.yml` — `TAG=${{ env.CURRENT_VERSION }}` is interpolated directly in a `run:` block. The `env.*` context is workflow-controllable and must not be interpolated directly.

3. `.github/workflows/auto-version.yml` — `BADGE_URL="https://img.shields.io/badge/version-${{ env.NEW_VERSION }}-orange"` is interpolated directly in a `run:` block.

Locations:

- `.github/workflows/acknowledge-contributors.yml:31`
- `.github/workflows/auto-version.yml:43`
- `.github/workflows/auto-version.yml:60`

### github-env-injection (severity: high)

An untrusted value is written to `$GITHUB_OUTPUT` without the required sanitization step (`printf '%s' ... | tr -d '\n\r'`).

In `.github/workflows/acknowledge-contributors.yml`, the `Extract usernames from issue body` step writes `$USERNAMES` — derived from the user-controlled issue body via `jq -r '.issue.body'` — directly to `$GITHUB_OUTPUT` using `echo "$USERNAMES" >> $GITHUB_OUTPUT`. No newline stripping is applied before the write. A malicious actor can craft an issue body containing newlines to inject arbitrary key=value pairs into `$GITHUB_OUTPUT`, potentially hijacking subsequent step outputs.

Locations:

- `.github/workflows/acknowledge-contributors.yml:25`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, script-injection, github-env-injection

**Notes:**

Fixed all findings across 4 files:

1. unpinned-uses: Pinned all 5 mutable action references to full 40-char commit SHAs with tag comments preserved: actions/setup-node@v5, actions/checkout@v3, actions/checkout@v5, softprops/action-gh-release@v3, aryan6673/openrabbit@main.

2. script-injection: Moved all ${{ }} expressions out of run: shell strings into step env: blocks in acknowledge-contributors.yml (steps.extract.outputs.usernames) and auto-version.yml (env.CURRENT_VERSION and env.NEW_VERSION). Shell scripts now reference plain environment variables.

3. github-env-injection: In acknowledge-contributors.yml, sanitized the user-controlled USERNAMES value with `printf '%s' "$USERNAMES" | tr -d '\r'` before writing to $GITHUB_OUTPUT to prevent newline injection attacks.

### Iteration 2

**Fixes applied:** script-injection, github-env-injection

**Notes:**

Fixed all 4 findings across 2 workflow files:

1. auto-version.yml (script-injection, line 75): Moved `${{ github.ref_name }}` out of the run: shell string into the step's env block as REF_NAME, then used `"$REF_NAME"` in the git push command.

2. auto-version.yml (github-env-injection, line 56): Added sanitization of NEW_VERSION before writing to GITHUB_ENV: `safe_new_version=$(printf '%s' "$NEW_VERSION" | tr -d '\n\r')` and wrote the sanitized value.

3. acknowledge-contributors.yml (github-env-injection, line 36): Changed `tr -d '\r'` to `tr -d '\n\r'` to also strip newlines, preventing injection of additional key=value pairs into GITHUB_OUTPUT.

4. acknowledge-contributors.yml (script-injection, lines 48/50): Replaced unquoted `for USERNAME in $USERNAMES` with `while IFS= read -r USERNAME; do ... done <<< "$USERNAMES"` to safely iterate over usernames, and quoted the curl URL as `"https://api.github.com/users/$USERNAME"`.

### Iteration 3

**Fixes applied:** script-injection

**Notes:**

Fixed the script injection vulnerability in the 'Bump version (patch)' step of .github/workflows/auto-version.yml. The unquoted `$TAG` variable in three `echo $TAG | cut ...` commands was quoted to `"$TAG"` to prevent shell metacharacter interpretation and word splitting. The CURRENT_VERSION value (sourced from env context) was already moved to an env block in a previous iteration; this iteration completes the fix by ensuring the derived $TAG variable is properly double-quoted when used in shell commands.

