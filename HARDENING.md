<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.7.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.7.0** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

The composite action in action.yml references `actions/setup-node@v5`, which is a mutable version tag rather than an immutable 40-character commit SHA. If the tag is moved (intentionally or via a supply-chain compromise), the action will silently execute different code. Pin to a full SHA, e.g. `actions/setup-node@1d0ff469b4a3d2f5b32d7d7b2a1f7a6b8c9d0e1f # v5`.

Locations:

- `action.yml:36`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Pinned `actions/setup-node@v5` to its full commit SHA `a0853c24544627f65ddf259abe73b1d18a591444` in hardened/action/action.yml (line 36). The original tag is preserved as a comment (`# v5`) for readability.

