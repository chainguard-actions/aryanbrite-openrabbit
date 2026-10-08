<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.8.7

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.8.7** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

The composite action step uses `actions/setup-node@v5`, which is a mutable tag reference rather than a pinned 40-character commit SHA. If the tag is moved (e.g., by a compromised upstream repository), the action will silently execute different code on the next run, enabling a supply-chain attack. It should be pinned to a full SHA, e.g. `actions/setup-node@1d0ff469b12294b4f4e3d4f8cc60a5a2d3b56909 # v5`.

Locations:

- `action.yml:38`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Pinned actions/setup-node@v5 to its full commit SHA (a0853c24544627f65ddf259abe73b1d18a591444) in hardened/action/action.yml line 38. The mutable tag is preserved as a comment for readability.

