<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.8.6

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.8.6** was hardened automatically. 3 finding(s) were identified and resolved across 2 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Multiple `uses:` references are pinned to mutable tags or branch names instead of immutable 40-character commit SHAs, making the action vulnerable to supply-chain attacks if the referenced tag or branch is moved or compromised.

- action.yml: `uses: actions/setup-node@v5` (tag)
- .github/workflows/acknowledge-contributors.yml: `uses: actions/checkout@v3` (tag)
- .github/workflows/auto-version.yml: `uses: actions/checkout@v5` (tag), `uses: softprops/action-gh-release@v3` (tag)
- .github/workflows/pr-review.yml: `uses: aryan6673/openrabbit@main` (branch — especially dangerous as it tracks a mutable branch head)

Locations:

- `action.yml:38`
- `.github/workflows/acknowledge-contributors.yml:14`
- `.github/workflows/auto-version.yml:13`
- `.github/workflows/auto-version.yml:55`
- `.github/workflows/pr-review.yml:14`

### script-injection (severity: high)

Direct `${{ ... }}` expression interpolation inside `run:` shell command strings (rule a). Before the shell ever sees the command, GitHub Actions substitutes the expression value as raw text, allowing an attacker to inject arbitrary shell metacharacters.

1. `.github/workflows/acknowledge-contributors.yml` — `USERNAMES="${{ steps.extract.outputs.usernames }}"` interpolates a step output (derived from untrusted issue body) directly into a shell variable assignment inside a `run:` block.

2. `.github/workflows/auto-version.yml` — Multiple direct interpolations inside `run:` blocks:
   - `TAG=${{ env.CURRENT_VERSION }}` (unquoted, from env context)
   - `BADGE_URL="https://img.shields.io/badge/version-${{ env.NEW_VERSION }}-orange"` (env context in URL)
   - `if grep -q "version-${{ env.NEW_VERSION }}"` (env context in grep argument)
   - `git commit -m "Update version badge to ${{ env.NEW_VERSION }}"` (env context in commit message)
   - `git push origin HEAD:${{ github.ref_name }}` (github context — attacker-controllable branch name)

Locations:

- `.github/workflows/acknowledge-contributors.yml:34`
- `.github/workflows/auto-version.yml:47`
- `.github/workflows/auto-version.yml:63`
- `.github/workflows/auto-version.yml:64`
- `.github/workflows/auto-version.yml:72`
- `.github/workflows/auto-version.yml:73`

### github-env-injection (severity: high)

Untrusted values are written to special GitHub environment files (`$GITHUB_OUTPUT`, `$GITHUB_ENV`) without the required sanitization step (`printf '%s' ... | tr -d '\n\r'`), enabling newline injection that can overwrite subsequent environment variables or outputs.

1. `.github/workflows/acknowledge-contributors.yml` — The `Extract usernames` step writes `$USERNAMES` (derived from the untrusted issue body via `jq -r '.issue.body'`) to `$GITHUB_OUTPUT` using a heredoc delimiter (`usernames<<EOF`). An attacker who controls the issue body can inject arbitrary lines into `$GITHUB_OUTPUT`, potentially overwriting other outputs. No sanitization is applied.

2. `.github/workflows/auto-version.yml` — The `Get latest version from tags` step writes `CURRENT_VERSION=$CURRENT_VERSION` to `$GITHUB_ENV` where `CURRENT_VERSION` comes from `git tag` output. A maliciously crafted tag name containing a newline could inject additional `KEY=VALUE` pairs into `$GITHUB_ENV`. Similarly, the `Bump version` step writes `NEW_VERSION=$NEW_VERSION` to `$GITHUB_ENV` without sanitization.

Locations:

- `.github/workflows/acknowledge-contributors.yml:31`
- `.github/workflows/auto-version.yml:40`
- `.github/workflows/auto-version.yml:57`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, script-injection, github-env-injection

**Notes:**

Fixed all findings across 4 files:

1. **unpinned-uses** (5 locations):
   - `action.yml`: `actions/setup-node@v5` → pinned to SHA `a0853c24...`
   - `acknowledge-contributors.yml`: `actions/checkout@v3` → pinned to SHA `a37ce912...`
   - `auto-version.yml`: `actions/checkout@v5` → pinned to SHA `fbc6f399...`
   - `auto-version.yml`: `softprops/action-gh-release@v3` → pinned to SHA `3d0d9888...`
   - `pr-review.yml`: `aryan6673/openrabbit@main` → pinned to SHA `a05dc7e1...`

2. **script-injection** (6 locations): Moved all `${{ }}` expressions from `run:` shell strings into `env:` blocks and referenced them as plain environment variables (`$USERNAMES`, `$CURRENT_VERSION`, `$NEW_VERSION`, `$REF_NAME`).

3. **github-env-injection** (3 locations): Added `printf '%s' "$VAR" | tr -d '\n\r'` sanitization before writing `CURRENT_VERSION` and `NEW_VERSION` to `$GITHUB_ENV`, and `USERNAMES` to `$GITHUB_OUTPUT`. Also switched the heredoc output format to a simple `key=value` assignment to eliminate the heredoc injection vector.

### Iteration 2

**Fixes applied:** script-injection

**Notes:**

Fixed two script injection issues in `.github/workflows/acknowledge-contributors.yml`:
1. Replaced unquoted `for USERNAME in $USERNAMES; do` with safe xargs-based tokenization into a bash array (`usernames_array`), guarded with `if [ -n "$USERNAMES" ]`, then iterated with `for USERNAME in "${usernames_array[@]}"`. This prevents shell metacharacter injection from the attacker-controlled USERNAMES env var.
2. Quoted `$USERNAME` in the curl URL: `curl -s "https://api.github.com/users/$USERNAME"` to prevent word splitting and glob expansion.
The `${{ steps.extract.outputs.usernames }}` expression was already correctly placed in the `env:` block.

