<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.7.1

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `1`

Action **aryanbrite--openrabbit/v0.7.1** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

action.yml uses `actions/setup-node@v5`, which is a mutable version tag rather than a pinned 40-character commit SHA. This means the action could be silently updated to a different (potentially malicious) version without the caller's knowledge, creating a supply-chain risk. It should be pinned to a full SHA, e.g. `actions/setup-node@1d0ff469b12f2e6c5a1aa5f8b2f5a8b5c5b5c5b5 # v5`.

Locations:

- `action.yml:36`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Pinned actions/setup-node@v5 to its full commit SHA: actions/setup-node@a0853c24544627f65ddf259abe73b1d18a591444 # v5. The mutable tag was replaced in action.yml line 36, preserving the version tag as a comment for readability.

