<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.8.3

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.8.3** was hardened automatically. 1 finding(s) were identified and resolved across 2 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

action.yml uses `actions/setup-node@v5` — a mutable version tag rather than a pinned 40-character commit SHA. This means the action could silently pull in a different (potentially malicious) version of setup-node on future runs without any change to the workflow. It should be pinned to a full SHA, e.g. `actions/setup-node@1d0ff469b4a3d2f4b32b5a8e4d5e6f7a8b9c0d1e # v5`.

Locations:

- `action.yml:38`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Pinned `actions/setup-node@v5` to its full commit SHA `a0853c24544627f65ddf259abe73b1d18a591444` in hardened/action/action.yml (line 38), preserving the version tag as a comment: `actions/setup-node@a0853c24544627f65ddf259abe73b1d18a591444 # v5`.

### Iteration 2

**Fixes applied:** unpinned-uses

**Notes:**

Pinned `aryan6673/openrabbit@main` to the full commit SHA `a05dc7e11748a93a3518553c3de82a98eba9df0f` in hardened/action/reviewer.yml (line 14), preserving `# main` as a readability comment.

