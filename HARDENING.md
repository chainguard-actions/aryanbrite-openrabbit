<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.8.7

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.8.7** was hardened automatically. 3 finding(s) were identified and resolved across 2 iteration(s).

## Findings Fixed

### script-injection (severity: high)

Rule (a): A GitHub Actions expression is directly interpolated inside a run: shell command string. In acknowledge-contributors.yml, `USERNAMES="${{ steps.extract.outputs.usernames }}"` injects a step output (derived from untrusted issue body content) directly into the shell. An attacker who controls the issue body can inject arbitrary shell commands. In auto-version.yml, `TAG=${{ env.CURRENT_VERSION }}` (unquoted), `BADGE_URL="https://img.shields.io/badge/version-${{ env.NEW_VERSION }}-orange"`, `grep -q "version-${{ env.NEW_VERSION }}"`, `git commit -m "Update version badge to ${{ env.NEW_VERSION }}"`, and `git push origin HEAD:${{ github.ref_name }}` all interpolate expressions directly into run: blocks.

Locations:

- `.github/workflows/acknowledge-contributors.yml:38`
- `.github/workflows/auto-version.yml:47`
- `.github/workflows/auto-version.yml:67`
- `.github/workflows/auto-version.yml:68`
- `.github/workflows/auto-version.yml:76`
- `.github/workflows/auto-version.yml:77`

### github-env-injection (severity: high)

In acknowledge-contributors.yml, the 'Extract usernames from issue body' step writes `$USERNAMES` — derived from untrusted issue body content via `jq -r '.issue.body'` — directly to `$GITHUB_OUTPUT` using a heredoc (`echo "usernames<<EOF" >> $GITHUB_OUTPUT; echo "$USERNAMES" >> $GITHUB_OUTPUT`) without first sanitizing newlines with `printf '%s' ... | tr -d '\n\r'`. An attacker who controls the issue body can inject arbitrary key=value pairs into the GitHub Actions output context by embedding newlines in the username data.

Locations:

- `.github/workflows/acknowledge-contributors.yml:33`

### unpinned-uses (severity: high)

Multiple uses: references are pinned to mutable tags or branch names instead of immutable 40-character SHA digests, making the action vulnerable to supply-chain attacks if the referenced tag or branch is moved or compromised. Failing references: action.yml: `actions/setup-node@v5`; acknowledge-contributors.yml: `actions/checkout@v3`; auto-version.yml: `actions/checkout@v5`, `softprops/action-gh-release@v3`; pr-review.yml: `aryan6673/openrabbit@main` (branch reference — especially dangerous).

Locations:

- `action.yml:38`
- `.github/workflows/acknowledge-contributors.yml:16`
- `.github/workflows/auto-version.yml:14`
- `.github/workflows/auto-version.yml:60`
- `.github/workflows/pr-review.yml:14`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, script-injection, github-env-injection

**Notes:**

Fixed all three findings across four files:

1. **unpinned-uses** (action.yml, acknowledge-contributors.yml, auto-version.yml, pr-review.yml): Pinned all 5 action references to full 40-character SHA digests with tag comments: actions/setup-node@v5→a0853c24..., actions/checkout@v3→a37ce912..., actions/checkout@v5→fbc6f399..., softprops/action-gh-release@v3→3d0d9888..., aryan6673/openrabbit@main→a05dc7e1...

2. **script-injection** (acknowledge-contributors.yml, auto-version.yml): Moved all ${{ }} expressions out of run: shell strings into step env: blocks. In acknowledge-contributors.yml, steps.extract.outputs.usernames is now accessed via EXTRACTED_USERNAMES env var. In auto-version.yml, env.CURRENT_VERSION is accessed via CURRENT_VERSION env var in the bump step, and env.NEW_VERSION + github.ref_name are accessed via NEW_VERSION and REF_NAME env vars in the badge update step.

3. **github-env-injection** (acknowledge-contributors.yml): The Extract usernames step now sanitizes USERNAMES with `printf '%s' "$USERNAMES" | tr -d '\n\r'` before writing to GITHUB_OUTPUT, and uses the simple `key=value` format instead of the heredoc form to prevent newline injection.

### Iteration 2

**Fixes applied:** script-injection

**Notes:**

Fixed three script-injection findings across two workflow files:

1. auto-version.yml 'Bump version (patch)' step: Quoted `$TAG` in all three `echo $TAG | cut ...` pipelines → `echo "$TAG" | cut ...` to prevent word splitting and glob expansion of the attacker-influenced CURRENT_VERSION env var.

2. auto-version.yml 'Update version badge in README' step: The ${NEW_VERSION} and ${REF_NAME} expansions were already inside double-quoted strings. Additionally hardened `git push origin "HEAD:${REF_NAME}"` to use `refs/heads/${REF_NAME}` to prevent git refspec injection via a crafted branch name.

3. acknowledge-contributors.yml 'Commit acknowledgment for each contributor' step: Replaced the unquoted `for USERNAME in $USERNAMES` (attacker-controlled issue body content) with a safe xargs-based tokenization into a bash array, followed by `for USERNAME in "${usernames_array[@]}"`. Added strict validation (`^[a-zA-Z0-9_-]+$`) to skip any username containing shell metacharacters. Quoted all ${USERNAME} expansions in curl URL, grep, echo, and git commit --author arguments.

