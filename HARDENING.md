<!-- markdownlint-disable -->

# Hardening Report: aryanbrite--openrabbit/v0.9.1

> This file was generated automatically by the hardening agent.

**Policy SHA:** `374911c4be584df24e6da57af2d990570ef0f859`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **aryanbrite--openrabbit/v0.9.1** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

The composite action step references an action by a mutable tag instead of a full 40-character commit SHA: `uses: actions/setup-node@v5`. Pin it to a commit SHA, e.g. `actions/setup-node@<40-hex-sha> # v5`.

Locations:

- `action.yml:42`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Pinned actions/setup-node@v5 to a0853c24544627f65ddf259abe73b1d18a591444 # v5 in action.yml.

