<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.7.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `1`

Action **aryanbrite--openrabbit/v0.7.0** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

The composite action uses `actions/setup-node@v5` (a mutable version tag) instead of a pinned 40-character commit SHA. A tag can be moved to point to a different, potentially malicious commit, enabling a supply-chain attack. It should be pinned to a full SHA, e.g. `actions/setup-node@1d0ff469b12f2e6c5a1e1e9e3b7e6f8a9b0c1d2e # v5`.

Locations:

- `action.yml:36`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Replaced `actions/setup-node@v5` with the pinned SHA `actions/setup-node@a0853c24544627f65ddf259abe73b1d18a591444 # v5` in action.yml line 36. This prevents supply-chain attacks where a mutable tag could be moved to point to a malicious commit.

