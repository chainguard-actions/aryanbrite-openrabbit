<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.6.9

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `1`

Action **aryanbrite--openrabbit/v0.6.9** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Both action.yml and reviewer.yml reference actions/steps by mutable tags or branch names rather than pinned full-length commit SHAs, making the action vulnerable to supply-chain attacks.

- action.yml: `uses: actions/setup-node@v5` — mutable version tag `v5`
- reviewer.yml: `uses: aryan6673/openrabbit@main` — mutable branch name `main`

Each should be pinned to a full 40-character commit SHA (e.g. `uses: actions/setup-node@11bd71901bbe5b1630ceea73d27597364c9af683 # v5`).

Locations:

- `action.yml:38`
- `reviewer.yml:14`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Pinned two mutable action references to full commit SHAs: (1) action.yml line 38: actions/setup-node@v5 → actions/setup-node@a0853c24544627f65ddf259abe73b1d18a591444 # v5; (2) reviewer.yml line 14: aryan6673/openrabbit@main → aryan6673/openrabbit@ba7a7681fc847f232753fd9204b7317173b76bb2 # main. Both SHAs were resolved via lookup_action_sha.

