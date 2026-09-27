<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.8.5

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.8.5** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Unpinned `uses:` references found. Both references use mutable tags/branches instead of full 40-character commit SHAs, making the action vulnerable to supply-chain attacks if the referenced action is compromised or its tag is moved.

- `action.yml` line 36: `uses: actions/setup-node@v5` — `@v5` is a mutable tag, not a pinned SHA.
- `reviewer.yml` line 14: `uses: aryan6673/openrabbit@main` — `@main` is a mutable branch ref, not a pinned SHA.

These should be pinned to full commit SHAs, e.g. `uses: actions/setup-node@11bd71901bbe5b1630ceea73d27597364c9af683 # v5`.

Locations:

- `action.yml:36`
- `reviewer.yml:14`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Pinned two unpinned `uses:` references to full commit SHAs:
1. `action.yml` line 36: `actions/setup-node@v5` → `actions/setup-node@a0853c24544627f65ddf259abe73b1d18a591444 # v5`
2. `reviewer.yml` line 14: `aryan6673/openrabbit@main` → `aryan6673/openrabbit@a05dc7e11748a93a3518553c3de82a98eba9df0f # main`

Both SHAs were resolved using lookup_action_sha against the live repository.

