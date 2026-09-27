<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.7.8

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.7.8** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

action.yml uses `actions/setup-node@v5` (a mutable version tag) instead of a pinned full 40-character SHA commit hash. This is a supply-chain risk: if the referenced tag is moved or the upstream repository is compromised, the action will silently execute different code. Replace with a full SHA pin, e.g. `actions/setup-node@1d0ff469b12f2e6c5a47421d32a8ba5b8e37e6a0 # v5`.

Locations:

- `action.yml:38`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Replaced `actions/setup-node@v5` with `actions/setup-node@a0853c24544627f65ddf259abe73b1d18a591444 # v5` in hardened/action/action.yml at line 38. This pins the action to an immutable commit SHA, eliminating the supply-chain risk from a mutable version tag.

