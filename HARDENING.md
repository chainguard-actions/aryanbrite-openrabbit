<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.8.4

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.8.4** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Two `uses:` references are pinned to mutable tags/branches rather than immutable 40-character commit SHAs, making the action vulnerable to supply-chain attacks if the referenced tag or branch is moved or overwritten.

1. `action.yml`: `uses: actions/setup-node@v5` — `@v5` is a mutable tag.
2. `reviewer.yml`: `uses: aryan6673/openrabbit@main` — `@main` is a mutable branch.

These should be pinned to full SHA digests, e.g.:
- `uses: actions/setup-node@1d0ff469b12f8a2e8a3c6e5f7d9b2c4a6e8f0d2c # v5`
- `uses: aryan6673/openrabbit@<full-40-char-sha> # main`

Locations:

- `action.yml:36`
- `reviewer.yml:14`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Pinned two mutable `uses:` references to full 40-character commit SHAs:
1. `action.yml` line 36: `actions/setup-node@v5` → `actions/setup-node@a0853c24544627f65ddf259abe73b1d18a591444 # v5`
2. `reviewer.yml` line 14: `aryan6673/openrabbit@main` → `aryan6673/openrabbit@a05dc7e11748a93a3518553c3de82a98eba9df0f # main`

Original tags/branches are preserved as inline comments for readability.

