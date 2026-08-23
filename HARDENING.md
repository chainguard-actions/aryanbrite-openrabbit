<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.8.5

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.8.5** was hardened automatically. 3 finding(s) were identified and resolved across 4 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Multiple `uses:` references are pinned to mutable tags or branch names instead of immutable 40-character commit SHAs, making the action vulnerable to supply-chain attacks if the referenced tag or branch is moved or overwritten.

- action.yml: `actions/setup-node@v5` (tag)
- acknowledge-contributors.yml: `actions/checkout@v3` (tag)
- auto-version.yml: `actions/checkout@v5` (tag), `softprops/action-gh-release@v3` (tag)
- pr-review.yml: `aryan6673/openrabbit@main` (branch — especially dangerous as it tracks a mutable branch head)

Locations:

- `action.yml:38`
- `.github/workflows/acknowledge-contributors.yml:16`
- `.github/workflows/auto-version.yml:14`
- `.github/workflows/auto-version.yml:55`
- `.github/workflows/pr-review.yml:14`

### script-injection (severity: high)

Multiple `run:` blocks directly interpolate `${{ ... }}` expressions into shell command strings (sub-rule a), allowing an attacker to inject arbitrary shell commands:

1. acknowledge-contributors.yml line 35: `USERNAMES="${{ steps.extract.outputs.usernames }}"` — a step output (derived from untrusted issue body content) is interpolated directly into the shell script. An attacker can craft an issue body to inject shell metacharacters.

2. auto-version.yml line 43: `TAG=${{ env.CURRENT_VERSION }}` — an `env.*` context expression is interpolated directly into a `run:` block. Any `${{ ... }}` in a run: block is a script-injection risk regardless of context.

3. auto-version.yml line 64: `BADGE_URL="https://img.shields.io/badge/version-${{ env.NEW_VERSION }}-orange"` — `${{ env.NEW_VERSION }}` interpolated directly into a shell variable assignment inside a `run:` block.

4. auto-version.yml line 77: `git push origin HEAD:${{ github.ref_name }}` — `${{ github.ref_name }}` (attacker-controllable via branch name) interpolated directly into a shell command.

Locations:

- `.github/workflows/acknowledge-contributors.yml:35`
- `.github/workflows/auto-version.yml:43`
- `.github/workflows/auto-version.yml:64`
- `.github/workflows/auto-version.yml:77`

### github-env-injection (severity: high)

In acknowledge-contributors.yml, the `Extract usernames from issue body` step writes `$USERNAMES` — a value derived from the untrusted GitHub issue body (`jq -r '.issue.body' "$GITHUB_EVENT_PATH"`) — directly to `$GITHUB_OUTPUT` using a heredoc without sanitizing newlines first (no `printf '%s' ... | tr -d '\n\r'` step). A malicious actor can craft an issue body containing newline characters to inject arbitrary key=value pairs into the GitHub Actions output context, potentially poisoning subsequent steps.

Locations:

- `.github/workflows/acknowledge-contributors.yml:33`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, script-injection, github-env-injection

**Notes:**

Fixed all three finding categories across four files:

1. unpinned-uses: Pinned all 5 mutable action references to full 40-char commit SHAs: actions/setup-node@v5, actions/checkout@v3, actions/checkout@v5, softprops/action-gh-release@v3, and aryan6673/openrabbit@main.

2. script-injection: Moved all 4 ${{ }} expressions out of run: blocks into step env: blocks — steps.extract.outputs.usernames in acknowledge-contributors.yml, and env.CURRENT_VERSION, env.NEW_VERSION, github.ref_name in auto-version.yml.

3. github-env-injection: In acknowledge-contributors.yml, sanitized the USERNAMES value (derived from untrusted issue body) before writing to $GITHUB_OUTPUT by stripping carriage returns and converting newlines to spaces, preventing newline injection attacks.

### Iteration 2

**Fixes applied:** script-injection

**Notes:**

Fixed the 'Commit acknowledgment for each contributor' step in acknowledge-contributors.yml: replaced the unquoted `for USERNAME in $USERNAMES` loop (which allowed word-splitting and glob expansion on attacker-controlled input) with a safe `while IFS= read -r USERNAME; do ... done <<< "$EXTRACTED_USERNAMES"` loop. Also quoted `$USERNAME` in the curl URL (`"https://api.github.com/users/$USERNAME"`) and the `NAME="$USERNAME"` fallback assignment to prevent shell metacharacter injection.

### Iteration 3

**Fixes applied:** script-injection, github-env-injection

**Notes:**

Fixed in hardened/action/.github/workflows/auto-version.yml: (1) Quoted all three `echo $TAG` expansions to `echo "$TAG"` in the 'Bump version (patch)' step to prevent shell metacharacter injection from the env.* context value. (2) Added sanitization before writing NEW_VERSION to GITHUB_ENV: `safe=$(printf '%s' "$NEW_VERSION" | tr -d '\n\r')` and then writing `$safe` instead of `$NEW_VERSION`, preventing newline injection. Also quoted the `$GITHUB_ENV` reference.

### Iteration 1

**Fixes applied:** github-env-injection

**Notes:**

Fixed the github-env-injection vulnerability in `.github/workflows/acknowledge-contributors.yml` at the 'Extract usernames from issue body' step. Replaced the heredoc (<<EOF) approach and the insufficient `tr -d '\r' | tr '\n' ' '` sanitization with the required `printf '%s' "$USERNAMES" | tr -d '\n\r'` pattern that strips all newlines and carriage returns. Also switched from the heredoc multi-line format to the simple `key=value` format for writing to $GITHUB_OUTPUT, which eliminates the injection vector entirely.

