<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.8.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `1`

Action **aryanbrite--openrabbit/v0.8.0** was hardened automatically. 3 finding(s) were identified and resolved across 2 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Multiple `uses:` references are pinned to mutable tags or branch names instead of full 40-character commit SHAs, making the action vulnerable to supply-chain attacks if the referenced tag/branch is moved or overwritten. Failing references: action.yml: `actions/setup-node@v5`; acknowledge-contributors.yml: `actions/checkout@v3`; auto-version.yml: `actions/checkout@v5`, `softprops/action-gh-release@v3`; pr-review.yml: `aryan6673/openrabbit@main`.

Locations:

- `action.yml:37`
- `.github/workflows/acknowledge-contributors.yml:14`
- `.github/workflows/auto-version.yml:14`
- `.github/workflows/auto-version.yml:55`
- `.github/workflows/pr-review.yml:14`

### script-injection (severity: high)

Rule (a): GitHub Actions expressions are interpolated directly inside `run:` shell command strings, allowing an attacker to inject arbitrary shell commands. (1) acknowledge-contributors.yml: `USERNAMES="${{ steps.extract.outputs.usernames }}"` — the step output (derived from untrusted issue body) is interpolated directly into the shell. (2) auto-version.yml: `TAG=${{ env.CURRENT_VERSION }}` — env context expression interpolated directly into shell without quoting. (3) auto-version.yml: `BADGE_URL="https://img.shields.io/badge/version-${{ env.NEW_VERSION }}-orange"`, `grep -q "version-${{ env.NEW_VERSION }}"`, `git commit -m "Update version badge to ${{ env.NEW_VERSION }}"`, and `git push origin HEAD:${{ github.ref_name }}` — multiple env/github context expressions interpolated directly into shell commands.

Locations:

- `.github/workflows/acknowledge-contributors.yml:35`
- `.github/workflows/auto-version.yml:42`
- `.github/workflows/auto-version.yml:62`
- `.github/workflows/auto-version.yml:63`
- `.github/workflows/auto-version.yml:70`
- `.github/workflows/auto-version.yml:72`

### github-env-injection (severity: high)

In acknowledge-contributors.yml, the `Extract usernames from issue body` step writes `$USERNAMES` (derived from the untrusted `github.event.issue.body` via `jq -r '.issue.body'`) to `$GITHUB_OUTPUT` using a heredoc without the required sanitization step (`printf '%s' ... | tr -d '\n\r'`). An attacker can craft an issue body containing newlines to inject arbitrary key=value pairs into GITHUB_OUTPUT, potentially overwriting outputs consumed by downstream steps.

Locations:

- `.github/workflows/acknowledge-contributors.yml:29`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, script-injection, github-env-injection

**Notes:**

Fixed all findings across 4 files: (1) Pinned all 5 unpinned action references to full 40-char commit SHAs with tag comments preserved. (2) Fixed script-injection in acknowledge-contributors.yml by moving steps.extract.outputs.usernames into an env block (EXTRACTED_USERNAMES), and in auto-version.yml by moving env.CURRENT_VERSION, env.NEW_VERSION, and github.ref_name into env blocks (CURRENT_VERSION, NEW_VERSION, REF_NAME) and referencing them as plain shell variables. (3) Fixed github-env-injection in acknowledge-contributors.yml by replacing the heredoc GITHUB_OUTPUT write with a sanitized single-line write using printf and tr -d '\n\r' to strip attacker-controlled newlines.

### Iteration 2

**Fixes applied:** script-injection, unpinned-uses

**Notes:**

1. script-injection (acknowledge-contributors.yml line 35/37): Replaced `for USERNAME in $USERNAMES` (unquoted, subject to word-splitting and glob expansion) with `while IFS= read -r USERNAME; done <<< "$USERNAMES"` to safely iterate over newline-separated usernames. Added strict input validation (regex `^[a-zA-Z0-9_-]+$`) to reject any username containing shell metacharacters before it is used in curl URL or git commands. Quoted `$USERNAME` in the curl URL. 2. unpinned-uses (reviewer.yml line 14): Pinned `aryan6673/openrabbit@main` to the full commit SHA `d5f8e12f8f60a9bf125f69d81c4f59cf0bfdbc51 # main`.

