<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.6.9

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.6.9** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Two `uses:` references are pinned to mutable tags/branches instead of immutable 40-character commit SHAs, making the action vulnerable to supply-chain attacks:

1. `action.yml`: `uses: actions/setup-node@v5` — `@v5` is a mutable tag that can be silently redirected to a different commit.
2. `reviewer.yml`: `uses: aryan6673/openrabbit@main` — `@main` is a mutable branch ref that can be updated at any time by the repository owner.

Both should be pinned to full SHA digests, e.g. `uses: actions/setup-node@<40-hex-char-sha> # v5`.

Locations:

- `action.yml:43`
- `reviewer.yml:14`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Pinned two mutable action references to immutable commit SHAs:
1. `action.yml` line 43: `actions/setup-node@v5` → `actions/setup-node@a0853c24544627f65ddf259abe73b1d18a591444 # v5`
2. `reviewer.yml` line 14: `aryan6673/openrabbit@main` → `aryan6673/openrabbit@a05dc7e11748a93a3518553c3de82a98eba9df0f # main`

SHAs were resolved using lookup_action_sha against the live GitHub API.

