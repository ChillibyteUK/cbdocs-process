# Changelog

Changes to the website delivery process: the gates, steps, artefacts, rules and
the way the guide presents them. Newest first. Version numbers are in
`meta.version` in `data/process.js` and show in the guide header.

Earlier changes (1.1 and before) were not recorded here. See the git history.

## 1.2 (2026-10-20)

Found while running the first full project through the process (the
Peoplesafe and OKAlone consolidation).

### Changed

- **Conditional gates renumbered into the order they happen.** The labels were
  C1, C3, C2 in sequence: the technical architecture gate (after Gate 2) was
  labelled C3 and the migration and redirect plan gate (after Gate 3) was
  labelled C2. They now read in order:

  | Gate | Sits after | Was |
  |---|---|---|
  | C1 Current-state audit accepted | Gate 1 | C1 |
  | C2 Technical architecture approved | Gate 2 | C3 |
  | C3 Migration and redirect plan approved | Gate 3 | C2 |
  | C4 Access and credentials obtained | Gate 10 | C4 |
  | C5 Compliance and data protection cleared | Gate 11 | C5 |
  | C6 Post-launch backlog agreed | Gate 14 | C6 |

  Ticket names changed to match: `Gate C2: technical architecture approved` and
  `Gate C3: migration plan approved`. Projects already using the old labels need
  C2 and C3 swapped.
- `conditionalGates` in `data/process.js` is now listed in that same order, so
  the guide's reference page lists them chronologically.
- `data/gaps.js`: gap G12 now points to conditional gates C1 and C3 (the audit
  and the migration plan).

### Added

- **Gates reference now shows each conditional gate's ticket name, artefacts and
  position.** The standard gates already showed their ticket name; the
  conditional gates showed only a title, so the ticket labels could only be found
  in the data. A project could not name its tickets from the guide alone.

### Not changed

- Gate ids (`gate-c-audit`, `gate-c-architecture`, `gate-c-migration`, and so
  on) are unchanged, so steps and the spec builder keep working.
- The `.docx` and `.xlsx` templates are unchanged. They refer only to Gate C5.
