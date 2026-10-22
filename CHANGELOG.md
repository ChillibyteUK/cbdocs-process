# Changelog

Changes to the website delivery process: the gates, steps, artefacts, rules and
the way the guide presents them. Newest first. Version numbers are in
`meta.version` in `data/process.js` and show in the guide header.

Earlier changes (1.1 and before) were not recorded here. See the git history.

## 1.4 (2026-10-20)

### Changed

- **"Sales handover" is now "Studio brief".** The old wording prompted clients
  to ask how sales communicates with the studio. The step, approval, document
  and template are renamed. Nothing about what is checked has changed.

  | Before | After |
  | --- | --- |
  | Step 1: Sales handover | Step 1: Studio brief |
  | Approval: sales handover | Approval: studio brief |
  | Sales handover accepted | Studio brief accepted |
  | Sales handover note (template) | Studio brief (template, `studio-brief.docx`) |
  | "Handover date" field | "Brief date" field |

  Closure still uses "handover notes", which is a different thing and is
  unchanged. The Basecamp folder name `0-Sales & Scoping` is unchanged.

## 1.3 (2026-10-20)

Follows on from 1.2, after the same project showed that renumbering was not
enough: three numbering schemes on one screen was the real problem. This
replaces the C1 to C6 labels from 1.2.

### Changed

- **Approvals are named for what they approve, not numbered.** The guide used
  three numbering schemes on one screen: steps 1 to 20, standard gates 0 to 14
  (Step 12 was "Gate 9"), and conditional gates C1 to C6, which were also out of
  order (fixed in 1.2, but still a code to decode). Tickets, badges, headings, instructions, templates and the spec builder now
  use one form: `Approval: <name>`.

  | Was | Now |
  |---|---|
  | Gate 0: sales handover accepted | Approval: sales handover |
  | Gate 1: discovery complete | Approval: discovery |
  | Gate 2: internal brief agreed | Approval: internal brief |
  | Gate 3: sitemap approved | Approval: sitemap |
  | Gate 4: page outlines approved | Approval: page outlines |
  | Gate 5: block inventory approved | Approval: block inventory |
  | Gate 6: wireframes approved | Approval: wireframes |
  | Gate 7: style direction approved | Approval: style direction |
  | Gate 8: design internally approved | Approval: internal design review |
  | Gate 9: design approved | Approval: client design |
  | Gate 10: build spec approved | Approval: build specification |
  | Gate 11: internal QA complete | Approval: internal QA |
  | Gate 12: staging approved | Approval: staging |
  | Gate 13: launch approved | Approval: launch |
  | Gate 14: project closed | Approval: project closure |
  | Gate C1: current-state audit accepted | Approval: current-state audit |
  | Gate C2: technical architecture approved | Approval: technical architecture |
  | Gate C3: migration plan approved | Approval: migration and redirect plan |
  | Gate C4: access and credentials obtained | Approval: access and credentials |
  | Gate C5: compliance cleared | Approval: compliance and data protection |
  | Gate C6: post-launch backlog agreed | Approval: post-launch backlog |

  Steps stay numbered, because they are a real sequence. The `(Gate N)` tag on a
  step is gone; the step page shows the approval name instead.
- Every gate has a short `name` in `data/process.js`, and its `ticket` is
  `Approval: <name>`. `n` and the conditional gates' `after` stay as internal
  keys that steps point at, and are never shown. `approvalName()`,
  `approvalTicket()` and `gateByN()` are exported for the UI.
- Prose references to "Gate N" in steps, the worked example, the gap register,
  the guide, the spec builder and both decks now name the approval instead.
- The estimate columns are renamed: "Gate 1 baseline" is now "Discovery baseline"
  and "Gate 10 re-baseline" is now "Build spec re-baseline".
- `conditionalGates` is listed in the order the gates occur, so the reference page
  lists them chronologically.
- The artefact "Basecamp gate ticket" is now "Basecamp approval ticket".

### Added

- **The gates reference shows each conditional gate's position, artefacts and
  ticket name**, as it already did for the standard gates. Before, a project
  could not name those tickets from the guide alone.

### Templates

- All `.docx` and `.xlsx` templates were updated to the new names. The workbook
  and eight Word templates were regenerated. `gate-ticket.docx` and
  `work-package.docx` are hand-maintained (see the README) and were patched in
  place. The generator source was updated to match.
- The Gate tracker tab's first column is now "Approval".

### Not changed

- Gate ids (`gate-0`, `gate-c-audit` and so on) are unchanged, so steps and the
  spec builder keep working.
- Projects already using the numbered names need their tickets renamed. The
  mapping is in the table above. It uses the 1.2 labels for the conditional
  gates; for the 1.1 labels, swap C2 and C3.

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
