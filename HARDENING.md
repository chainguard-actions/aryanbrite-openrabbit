<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.8.5

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.8.5** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

action.yml references `actions/setup-node@v5` using a mutable version tag instead of a pinned 40-character commit SHA. This means the action could be silently updated to a different (potentially malicious) version without any change to the workflow definition, creating a supply-chain risk.

Locations:

- `action.yml:43`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Pinned `actions/setup-node@v5` to its full commit SHA `a0853c24544627f65ddf259abe73b1d18a591444` in hardened/action/action.yml (line 43). The tag is preserved as an inline comment `# v5` for readability.

