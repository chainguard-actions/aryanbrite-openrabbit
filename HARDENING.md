<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.9.1

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.9.1** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

The composite action uses `actions/setup-node@v5` — a mutable version tag rather than a pinned 40-character SHA commit digest. This means the action could silently pull in a different (potentially malicious) version of the dependency if the tag is moved. It should be pinned to a full SHA, e.g. `actions/setup-node@1d0ff469b12f8a5c9a8237b3d9a9d8c8e8f8a8b8 # v5`.

Locations:

- `action.yml:36`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Pinned `actions/setup-node@v5` to its full commit SHA `a0853c24544627f65ddf259abe73b1d18a591444` in hardened/action/action.yml (line 36). The original tag is preserved as an inline comment for readability.

