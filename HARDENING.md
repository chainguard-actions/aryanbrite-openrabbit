<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.7.6

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `1`

Action **aryanbrite--openrabbit/v0.7.6** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

The composite action uses `actions/setup-node@v5`, which is pinned to a mutable tag (`v5`) rather than an immutable 40-character commit SHA. If the tag is moved (e.g., by a supply-chain compromise), the action will silently execute different code. It should be pinned to a full SHA, e.g. `actions/setup-node@1d0ff469b4a3d2f4b32b5f7a3e2b7e3b2b7e3b2b # v5`.

Locations:

- `action.yml:40`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Pinned `actions/setup-node@v5` to its full commit SHA `a0853c24544627f65ddf259abe73b1d18a591444` in action.yml line 40, preserving the `# v5` comment for readability.

