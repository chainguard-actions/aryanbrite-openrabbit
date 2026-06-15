<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.7.3

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `1`

Action **aryanbrite--openrabbit/v0.7.3** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

action.yml uses `actions/setup-node@v5` which is pinned to a mutable version tag rather than an immutable 40-character commit SHA. This means the action could be silently updated to a different (potentially malicious) version without any change to the workflow file, creating a supply-chain risk.

Locations:

- `action.yml:36`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Replaced `actions/setup-node@v5` with `actions/setup-node@a0853c24544627f65ddf259abe73b1d18a591444 # v5` in action.yml line 36 to pin the action to an immutable commit SHA and eliminate the supply-chain risk.

