<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.7.6

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.7.6** was hardened automatically. 2 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

action.yml references 'actions/setup-node@v5' using a mutable version tag instead of a full 40-character commit SHA. This means the action could be silently updated to a different (potentially malicious) version without any change to this file.

Locations:

- `action.yml:38`

### unpinned-uses (severity: high)

reviewer.yml references 'aryan6673/openrabbit@main' using a mutable branch name instead of a full 40-character commit SHA. Using a branch ref means any future commit to that branch is automatically picked up, making the workflow vulnerable to supply-chain attacks.

Locations:

- `reviewer.yml:14`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Pinned two mutable action references to full commit SHAs: (1) actions/setup-node@v5 → @a0853c24544627f65ddf259abe73b1d18a591444 # v5 in action.yml line 38; (2) aryan6673/openrabbit@main → @a05dc7e11748a93a3518553c3de82a98eba9df0f # main in reviewer.yml line 14. Original tags preserved as comments for readability.

