<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.7.3

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.7.3** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

The composite action step in action.yml uses `actions/setup-node@v5`, which is pinned to a mutable version tag (`v5`) rather than a full 40-character commit SHA. This means the action could silently change if the tag is moved, enabling a supply-chain attack. It should be pinned to a specific commit SHA, e.g. `actions/setup-node@1d0ff469b4a3d9a8e4b8d4e4e4e4e4e4e4e4e4e4 # v5`.

Locations:

- `action.yml:37`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Pinned actions/setup-node@v5 to its full commit SHA (a0853c24544627f65ddf259abe73b1d18a591444) in hardened/action/action.yml, preserving the original tag as a comment for readability.

