<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.7.1

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.7.1** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Two `uses:` references are pinned to mutable tags or branches instead of immutable 40-character commit SHAs, making the action vulnerable to supply-chain attacks:
- `action.yml`: `uses: actions/setup-node@v5` — `v5` is a mutable tag
- `reviewer.yml`: `uses: aryan6673/openrabbit@main` — `main` is a mutable branch

These should be pinned to full SHA digests, e.g. `actions/setup-node@<40-char-sha> # v5`.

Locations:

- `action.yml:40`
- `reviewer.yml:15`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Pinned two mutable `uses:` references to immutable commit SHAs:
1. `action.yml` line 40: `actions/setup-node@v5` → `actions/setup-node@a0853c24544627f65ddf259abe73b1d18a591444 # v5`
2. `reviewer.yml` line 15: `aryan6673/openrabbit@main` → `aryan6673/openrabbit@a05dc7e11748a93a3518553c3de82a98eba9df0f # main`

