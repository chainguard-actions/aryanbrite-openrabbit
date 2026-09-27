<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.8.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.8.0** was hardened automatically. 1 finding(s) were identified and resolved across 2 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

action.yml uses `actions/setup-node@v5` — a mutable tag reference rather than a pinned 40-character commit SHA. If the upstream action is compromised or the tag is moved, the action will silently execute different code. Pin to a full SHA, e.g. `actions/setup-node@1d0ff469b12f8a3f1e7a3e1e3e3e3e3e3e3e3e3e # v5`.

Locations:

- `action.yml:38`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Pinned `actions/setup-node@v5` to its full commit SHA `a0853c24544627f65ddf259abe73b1d18a591444` in hardened/action/action.yml (line 38). The tag is preserved as a comment (`# v5`) for readability.

### Iteration 2

**Fixes applied:** unpinned-uses

**Notes:**

Pinned aryan6673/openrabbit@main to the full commit SHA a05dc7e11748a93a3518553c3de82a98eba9df0f in reviewer.yml line 14. The branch name 'main' is preserved as a comment for readability. The workflow already had a proper permissions block (contents: read, pull-requests: write), so no permissions changes were needed.

