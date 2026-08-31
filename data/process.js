/* ---------------------------------------------------------------------------
   process.js — core taxonomy: roles, phases, routes, conditions, gates,
   artefacts. The 20 work packages live in steps.js; the gap register lives
   in gaps.js. Everything in the pitch, guide and spec builder derives from
   these three files.
--------------------------------------------------------------------------- */

export const meta = {
  name: 'Website delivery process',
  org: 'Chillibyte',
  version: '1.1',
  basedOn: 'Website process operating model + Website project process overview',
  note: 'Items marked isNew were added to close a gap identified in the review. See gaps.js.'
};

/* --- Roles ---------------------------------------------------------------- */

export const roles = {
  'head-of-web': {
    id: 'head-of-web',
    name: 'Head of Web',
    short: 'HoW',
    owns: 'Strategy, architecture, technical direction, wireframing, component design, technical governance, QA and launch. Defines and specifies work packages, then reviews and accepts what comes back.',
    note: 'Head of Web specifies and assures. Head of Web does not have to build. That separation is what lets a project take on a second pair of hands without the whole thing routing through one person.',
    colour: 'red'
  },
  'web-developer': {
    id: 'web-developer',
    name: 'Web Developer',
    short: 'Dev',
    owns: 'Delivers work packages against an approved build specification: templates, reusable blocks, field groups, styling and content entry. Hands each package back to Head of Web for QA.',
    note: 'Can be one person or several, in-house or contract. The work-package structure is what makes that interchangeable — a developer needs the specification, not the project history.',
    colour: 'blue'
  },
  'account-management': {
    id: 'account-management',
    name: 'Account Management',
    short: 'AM',
    owns: 'Client contact, scheduling, feedback collection, Basecamp ticket control, approval capture and stakeholder coordination.',
    colour: 'blue'
  },
  designer: {
    id: 'designer',
    name: 'Designer',
    short: 'Design',
    owns: 'Visual direction, identity toolkit, design system development, page design and component styling, based on approved discovery, structure, wireframes and style direction.',
    colour: 'green'
  },
  copywriter: {
    id: 'copywriter',
    name: 'Copywriter',
    short: 'Copy',
    owns: 'Page copy against approved outlines, tone of voice, headings and CTA wording. May be client-side, in-house or freelance.',
    colour: 'grey',
    optional: true,
    isNew: true,
    newBecause: 'The trackers repeatedly assign content to a "Copywriter" who did not exist in the roles table (G10).'
  },
  'seo-analytics': {
    id: 'seo-analytics',
    name: 'SEO / Analytics',
    short: 'SEO',
    owns: 'Search baseline, redirect mapping, migration risk, metadata standards, analytics and tracking verification.',
    colour: 'grey',
    optional: true,
    isNew: true,
    newBecause: 'Redirect and migration work was assumed but unowned (G10, G12).'
  },
  sales: {
    id: 'sales',
    name: 'Sales / New Business',
    short: 'Sales',
    owns: 'What was sold, at what price, with which inclusions and exclusions. Hands over to delivery at Gate 0.',
    colour: 'grey',
    isNew: true,
    newBecause: 'The process began after sales, so what sales promised never entered the record (G4).'
  },
  client: {
    id: 'client',
    name: 'Client stakeholder representative',
    short: 'Client',
    owns: 'Business requirements, content ownership, stakeholder approvals, factual accuracy and final sign-off.',
    colour: 'blue'
  }
};

/* --- Macro phases (guide navigation) -------------------------------------- */

export const phases = [
  {
    id: 'understand',
    n: 1,
    name: 'Understand',
    tagline: 'Establish what the business needs before anything is drawn.',
    docPhases: ['Understand'],
    colour: 'red'
  },
  {
    id: 'structure',
    n: 2,
    name: 'Structure',
    tagline: 'Decide what exists and what it must say, before layout.',
    docPhases: ['Structure', 'Plan the content', 'Architect the blocks', 'Wireframe the structure'],
    colour: 'red'
  },
  {
    id: 'direction',
    n: 3,
    name: 'Direction',
    tagline: 'Apply a visual system to approved structure.',
    docPhases: ['Define visual direction', 'Brief the designer', 'Design'],
    colour: 'green'
  },
  {
    id: 'build',
    n: 4,
    name: 'Build',
    tagline: 'Turn approved design into templates, blocks and fields.',
    docPhases: ['Specify the build', 'Build'],
    colour: 'blue'
  },
  {
    id: 'assure',
    n: 5,
    name: 'Assure & launch',
    tagline: 'Verify, review, publish and close cleanly.',
    docPhases: ['Review', 'Launch'],
    colour: 'blue'
  }
];

/* --- Routes --------------------------------------------------------------- */

/* Routes differ in THREE ways, and it is worth being precise about which,
   because "standard vs full" is otherwise an unanswerable question:

     1. Which steps run          — light drops four; standard and full run all
     2. How deep each artefact goes — a note, a document, or a formal record
     3. How much governance is formalised — sampling vs every item

   Standard and full run the SAME steps. The difference is depth and
   formality, not a longer list. Anyone who tells you full has "more stages"
   has not looked. What full actually buys is: every page outlined rather than
   every template, a spec for every block rather than the new ones, formal
   change control on every item, and an accessibility audit rather than a
   check. That is a real and defensible difference — it is just not a
   difference in the shape of the process. */

export const routes = {
  light: {
    id: 'light',
    name: 'Light',
    use: 'Small brochure sites and simple redesigns with limited custom structure.',
    signals: ['Under ~8 pages', 'Existing brand', 'No integrations', 'One decision-maker'],
    contingency: 0.15,
    depth: 'Notes',
    depthDetail: 'Artefacts are short and internal. A sitemap in a document, outlines for the home page and one inner template, a style note inside the designer handover. Enough to be pointed at in a disagreement, not enough to be a deliverable in its own right.',
    governance: 'Decision and change logs kept, but briefly. Approval by email against a named artefact.',
    depthPoints: [
      'Sitemap as a simple list',
      'Home plus one inner template outlined',
      'Block inventory, no individual block specs',
      'Style note rather than a style direction document',
      'Build checklist rather than a build specification'
    ]
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    use: 'Default for B2B service sites and modular block-based builds.',
    signals: ['8–25 pages', 'Multiple templates', 'Some content creation', 'A small stakeholder group'],
    contingency: 0.20,
    depth: 'Documents',
    depthDetail: 'Artefacts are client-presentable documents. Every template outlined, specifications for blocks being adapted or built new, a full build specification. This is the default and should be the default — most projects belong here.',
    governance: 'Full decision, change and variation logs. Gate tickets in Basecamp naming artefact versions.',
    depthPoints: [
      'Sitemap plus page inventory',
      'Every template outlined; content matrix with owners and deadlines',
      'Block specs for adapted and new blocks',
      'Style direction and designer brief as separate documents',
      'Full build specification with field groups and estimate re-baseline'
    ]
  },
  full: {
    id: 'full',
    name: 'Full',
    use: 'Multilingual, stakeholder-heavy, content migration, booking, portal, integration, membership or high SEO-risk projects.',
    signals: ['25+ pages or migration', 'Multilingual', 'Integrations or transactional features', 'Many stakeholders'],
    contingency: 0.25,
    depth: 'Documents, plus formal governance',
    depthDetail: 'Same steps as standard, run deeper. Every page outlined rather than every template. A specification for every block, including reused ones. Formal change control on every item rather than material ones. An accessibility audit rather than an accessibility check. Plus the artefacts below, which standard projects do not produce.',
    governance: 'Every change formally assessed and logged regardless of size. Stakeholder map maintained. Post-launch backlog owned and quoted.',
    depthPoints: [
      'Every page outlined individually, not just templates',
      'A specification for every block, including reused ones',
      'Stakeholder map and formal approval routing',
      'Data and content model documented',
      'Accessibility audited against the target, not spot-checked',
      'Every change assessed formally, however small'
    ],
    /* Artefacts full produces that standard does not. These are the concrete
       answer to "what do I actually get for the extra?" */
    extraArtefacts: ['stakeholder-map', 'content-model', 'accessibility-audit']
  }
};

export const routeOrder = ['light', 'standard', 'full'];

/* --- Conditions -----------------------------------------------------------
   Conditions are the reason a step can be forced into a small project or
   dropped from a large one. Route size alone is a blunt instrument (G12).
   The spec builder sets these from the intake answers.
-------------------------------------------------------------------------- */

export const conditions = {
  'existing-site':    { label: 'Replaces an existing live site', why: 'URLs already rank and are already linked to. Losing them is the most expensive thing a redesign can do.' },
  'content-migration':{ label: 'Existing content is being migrated', why: 'Volume and structure of legacy content drives audit and mapping effort.' },
  'multilingual':     { label: 'More than one language', why: 'Multiplies content, QA, URL structure and translation governance.' },
  'integrations':     { label: 'Third-party systems involved', why: 'Access, credentials and API behaviour are the classic silent build blocker.' },
  'forms':            { label: 'Collects personal data via forms', why: 'Triggers privacy, consent, retention and data-destination obligations.' },
  'transactional':    { label: 'Ecommerce, booking, portal or membership', why: 'Moves the project from publishing to application territory.' },
  'new-identity':     { label: 'Brand needs creating or refreshing', why: 'Design cannot start from an existing toolkit; identity work precedes style direction.' },
  'many-stakeholders':{ label: 'More than three approving stakeholders', why: 'Approval latency and contradictory feedback become the dominant schedule risk.' },
  'client-writes':    { label: 'Client is writing the content', why: 'Late client content is the single most common cause of website overrun.' },
  'accessibility-target': { label: 'Formal accessibility standard required', why: 'Turns accessibility from "basics" into a testable contractual commitment.' },
  'high-seo-risk':    { label: 'Meaningful organic traffic at risk', why: 'Traffic loss after launch is measurable, attributable and reputationally expensive.' },
  'tight-deadline':   { label: 'Fixed external deadline', why: 'Removes the slack the process normally uses to absorb change.' }
};

/* --- Gates ---------------------------------------------------------------- */

export const gates = [
  {
    n: 0, id: 'gate-0', title: 'Sales handover accepted', isNew: true,
    purpose: 'Put on the record what was sold, at what price, with which inclusions and exclusions, before delivery inherits it.',
    artefacts: ['Sales handover note', 'Signed proposal or scope', 'Commercial constraints'],
    owner: 'sales', approver: 'head-of-web', approverSide: 'internal',
    routes: ['light', 'standard', 'full'],
    ticket: 'Gate 0: sales handover accepted',
    unlocks: 'Discovery may be scheduled.',
    failPath: 'Delivery does not accept the project until the gap between what was sold and what is deliverable is written down and priced.',
    newBecause: 'What sales promised is the commonest origin of scope creep, and it was entering delivery unrecorded (G4).'
  },
  {
    n: 1, id: 'gate-1', title: 'Discovery complete',
    purpose: 'Confirm there is enough context to proceed.',
    artefacts: ['Discovery notes', 'Discovery summary', 'Requirements list', 'Risk and assumption log', 'Project classification', 'Estimate baseline', 'Approval SLA and named approver', 'Support matrix'],
    owner: 'head-of-web', approver: 'head-of-web', approverSide: 'internal',
    routes: ['light', 'standard', 'full'],
    ticket: 'Gate 1: discovery complete',
    unlocks: 'Internal brief, sitemap work and any parallel audits.',
    failPath: 'Return to discovery. Book a second session rather than proceeding on assumptions — a missing answer here costs a multiple of itself later.',
    additions: ['Estimate baseline (G1)', 'Approval SLA + named approver (G3)', 'Support matrix (G13)', 'Accessibility target (G15)', 'Revision allowance (G6)']
  },
  {
    n: 2, id: 'gate-2', title: 'Internal brief agreed',
    purpose: 'Turn discovery into a usable working brief.',
    artefacts: ['Goals', 'Stakeholders', 'Requirements', 'Assumptions', 'Risks', 'Exclusions', 'Design principles', 'Technical principles'],
    owner: 'head-of-web', approver: 'head-of-web', approverSide: 'internal',
    routes: ['standard', 'full'],
    ticket: 'Gate 2: internal brief agreed',
    unlocks: 'Structural work with a shared internal understanding.',
    failPath: 'Rewrite the brief. If the team cannot agree the brief internally, the client certainly will not resolve it.'
  },
  {
    n: 3, id: 'gate-3', title: 'Sitemap approved',
    purpose: 'Lock the site structure before page outlining and design.',
    artefacts: ['Sitemap', 'URL hierarchy', 'Navigation model', 'Page inventory', 'Page template notes'],
    owner: 'head-of-web', approver: 'client', approverSide: 'client',
    routes: ['light', 'standard', 'full'],
    ticket: 'Gate 3: sitemap approved',
    unlocks: 'Page outlining, content planning and redirect mapping.',
    failPath: 'Revise and re-approve. Pages added after this point go through the change log and are assessed for a variation.'
  },
  {
    n: 4, id: 'gate-4', title: 'Page outlines approved',
    purpose: 'Define content structure before wireframing.',
    artefacts: ['Key page outlines', 'Content matrix', 'Content deadlines'],
    owner: 'head-of-web', approver: 'client', approverSide: 'client',
    routes: ['light', 'standard', 'full'],
    ticket: 'Gate 4: page outlines approved',
    unlocks: 'Copywriting, wireframing and block identification.',
    failPath: 'Revise outlines. Do not proceed to wireframes on a contested outline — the wireframe will inherit the argument.',
    additions: ['Content deadlines and late-content escalation (G11)']
  },
  {
    n: 5, id: 'gate-5', title: 'Block inventory approved',
    purpose: 'Control reusable component scope.',
    artefacts: ['Block inventory', 'Reuse / adapt / build decisions', 'field notes', 'Design needs', 'Build impact'],
    owner: 'head-of-web', approver: 'head-of-web', approverSide: 'internal',
    routes: ['light', 'standard', 'full'],
    ticket: 'Gate 5: block inventory approved',
    unlocks: 'Block wireframing and block design.',
    failPath: 'Re-cut the inventory. A block count that keeps growing is a signal the page outlines were not specific enough.'
  },
  {
    n: 6, id: 'gate-6', title: 'Wireframes approved',
    purpose: 'Agree structure, hierarchy, content density and component behaviour before visual treatment.',
    artefacts: ['Key page wireframes', 'Block wireframes', 'Responsive notes', 'Open decisions'],
    owner: 'head-of-web', approver: 'client', approverSide: 'internal/client',
    routes: ['light', 'standard', 'full'],
    ticket: 'Gate 6: wireframes approved',
    unlocks: 'Style direction sign-off and designer briefing.',
    failPath: 'Iterate wireframes. Cheap here, expensive after design. Track rounds against the revision allowance.'
  },
  {
    n: 7, id: 'gate-7', title: 'Style direction approved',
    purpose: 'Give design work a clear foundation.',
    artefacts: ['Visual principles', 'Colour direction', 'Typography direction', 'Image treatment', 'UI tone', 'Accessibility notes', 'References to avoid'],
    owner: 'head-of-web', approver: 'client', approverSide: 'internal/client',
    routes: ['standard', 'full'],
    ticket: 'Gate 7: style direction approved',
    unlocks: 'Designer briefing and visual design.',
    failPath: 'Re-explore direction. Resolving taste here costs hours; resolving it on finished page designs costs days.'
  },
  {
    n: 8, id: 'gate-8', title: 'Design internally approved',
    purpose: 'Prevent inconsistent or structurally flawed design work reaching the client.',
    artefacts: ['Internal review notes', 'Accepted revisions', 'Unresolved decisions', 'Change log entries'],
    owner: 'head-of-web', approver: 'head-of-web', approverSide: 'internal',
    routes: ['standard', 'full'],
    ticket: 'Gate 8: design internally approved',
    unlocks: 'Client design presentation.',
    failPath: 'Back to the designer with written notes referencing the approved artefact that was departed from. Any new scope introduced by the design is logged before it goes further.'
  },
  {
    n: 9, id: 'gate-9', title: 'Client design approved',
    purpose: 'Get stakeholder approval before build.',
    artefacts: ['Approved page designs', 'Approved component direction', 'Logged changes'],
    owner: 'account-management', approver: 'client', approverSide: 'client',
    routes: ['light', 'standard', 'full'],
    ticket: 'Gate 9: design approved',
    unlocks: 'Build specification.',
    failPath: 'Consolidate feedback into one list, classify each item as correction / preference / new scope, then return to Gate 8. New-scope items go to the change log and are priced. Rounds count against the revision allowance.'
  },
  {
    n: 10, id: 'gate-10', title: 'Build spec approved',
    purpose: 'Convert approved structure and design into build-ready instructions, and re-baseline the estimate.',
    artefacts: ['Page/template list', 'Block build list', 'field list', 'Styling notes', 'Content entry plan', 'Launch requirements', 'Re-baselined estimate', 'Access and credentials confirmed'],
    owner: 'head-of-web', approver: 'head-of-web', approverSide: 'internal',
    routes: ['standard', 'full'],
    ticket: 'Gate 10: build spec approved',
    unlocks: 'Development.',
    failPath: 'Do not start building. An unclear spec produces a build that has to be argued about later.',
    additions: ['Re-baselined estimate (G1)', 'Access and credentials obtained (G17)', 'Environments and Git workflow (G19)']
  },
  {
    n: 11, id: 'gate-11', title: 'Internal QA complete',
    purpose: 'Verify the site against the agreed support matrix and accessibility target before the client sees it.',
    artefacts: ['QA checklist', 'Known issues', 'Content checks', 'Responsive checks against support matrix', 'Form checks', 'Performance basics', 'Accessibility test against target', 'Compliance check'],
    owner: 'head-of-web', approver: 'head-of-web', approverSide: 'internal',
    routes: ['light', 'standard', 'full'],
    ticket: 'Gate 11: internal QA complete',
    unlocks: 'Client staging review.',
    failPath: 'Fix and re-test. Never open staging to a client on a site with known structural defects — every defect they find costs an approval round.',
    additions: ['Tested against agreed support matrix (G13)', 'Accessibility target verified (G15)', 'Data protection and consent check (G16)']
  },
  {
    n: 12, id: 'gate-12', title: 'Staging approved',
    purpose: 'Confirm client review is complete and launch blockers are closed.',
    artefacts: ['Accepted feedback', 'Rejected/deferred requests', 'Final corrections', 'Launch blockers closed', 'Content freeze'],
    owner: 'account-management', approver: 'client', approverSide: 'client',
    routes: ['light', 'standard', 'full'],
    ticket: 'Gate 12: staging approved',
    unlocks: 'Launch preparation.',
    failPath: 'Re-review only the disputed items. Each feedback item is classified correction / preference / new scope; new scope is priced, not absorbed.',
    additions: ['Content freeze on all routes, not just full (G11)']
  },
  {
    n: 13, id: 'gate-13', title: 'Launch approved',
    purpose: 'Confirm production deployment can proceed.',
    artefacts: ['Launch checklist', 'Backup', 'Redirect map', 'DNS/hosting readiness', 'Final content freeze', 'Rollback plan', 'Warranty window agreed'],
    owner: 'head-of-web', approver: 'client', approverSide: 'client/internal',
    routes: ['light', 'standard', 'full'],
    ticket: 'Gate 13: launch approved',
    unlocks: 'Production deployment.',
    failPath: 'Hold the launch. A delayed launch is a scheduling problem; a bad launch is a reputation problem.',
    additions: ['Defect warranty window agreed and communicated (G5)']
  },
  {
    n: 14, id: 'gate-14', title: 'Project closed',
    purpose: 'Close the project, set the commercial boundary, and preserve learning.',
    artefacts: ['Post-launch QA', 'Final decision log', 'Final change log', 'Reusable block updates', 'Handover notes', 'Retrospective notes', 'Warranty start date', 'Care plan proposal'],
    owner: 'head-of-web', approver: 'client', approverSide: 'internal/client',
    routes: ['light', 'standard', 'full'],
    ticket: 'Gate 14: project closed',
    unlocks: 'Warranty period begins. Anything beyond defect fixing is quoted.',
    failPath: 'A project that will not close is usually a project whose exclusions were never written down. Close it formally and quote the remainder.',
    additions: ['Warranty start and boundary (G5)', 'Care plan / retainer conversation (G22)', 'Retrospective feeds the process itself (G20)']
  }
];

/* --- Conditional gates ----------------------------------------------------
   Triggered by conditions, not by route size.
-------------------------------------------------------------------------- */

export const conditionalGates = [
  {
    id: 'gate-c-audit', title: 'Current-state audit accepted', after: 1,
    triggeredBy: ['existing-site'],
    purpose: 'Establish what the existing site currently does, ranks for and contains, before it is replaced.',
    artefacts: ['Current-state audit', 'Content audit', 'SEO and traffic baseline'],
    owner: 'seo-analytics', approver: 'head-of-web', approverSide: 'internal',
    ticket: 'Gate C1: current-state audit accepted'
  },
  {
    id: 'gate-c-migration', title: 'Migration and redirect plan approved', after: 3,
    triggeredBy: ['existing-site', 'content-migration', 'high-seo-risk'],
    purpose: 'Protect existing rankings and inbound links across the URL change.',
    artefacts: ['SEO migration plan', 'Redirect map', 'Priority URL list'],
    owner: 'seo-analytics', approver: 'head-of-web', approverSide: 'internal',
    ticket: 'Gate C2: migration plan approved'
  },
  {
    id: 'gate-c-architecture', title: 'Technical architecture approved', after: 2,
    triggeredBy: ['integrations', 'transactional', 'multilingual'],
    purpose: 'Agree the technical shape before it is discovered during build.',
    artefacts: ['Technical architecture notes', 'Integration requirements', 'Data/content model'],
    owner: 'head-of-web', approver: 'head-of-web', approverSide: 'internal',
    ticket: 'Gate C3: technical architecture approved'
  },
  {
    id: 'gate-c-access', title: 'Access and credentials obtained', after: 10, isNew: true,
    triggeredBy: ['integrations', 'existing-site', 'transactional'],
    purpose: 'Confirm every third-party account, API key, DNS and hosting credential is in hand before build depends on it.',
    artefacts: ['Access register', 'Credential handover record'],
    owner: 'account-management', approver: 'head-of-web', approverSide: 'internal',
    ticket: 'Gate C4: access and credentials obtained',
    newBecause: 'Missing credentials stall builds silently and the delay is invisible in the record (G17).'
  },
  {
    id: 'gate-c-compliance', title: 'Compliance and data protection cleared', after: 11, isNew: true,
    triggeredBy: ['forms', 'transactional'],
    purpose: 'Confirm the site meets privacy, consent and data-handling obligations before it goes live.',
    artefacts: ['Privacy policy', 'Cookie consent configuration', 'Form data destination and retention', 'DPA position'],
    owner: 'head-of-web', approver: 'client', approverSide: 'client',
    ticket: 'Gate C5: compliance cleared',
    newBecause: 'Forms were QA-tested for submission only. Privacy, consent, retention and DPA were entirely absent (G16).'
  },
  {
    id: 'gate-c-backlog', title: 'Post-launch backlog agreed', after: 14,
    triggeredBy: ['transactional', 'multilingual', 'high-seo-risk'],
    purpose: 'Convert deferred items into an owned, quoted forward plan rather than an open-ended expectation.',
    artefacts: ['Post-launch improvement backlog', 'Care plan proposal'],
    owner: 'account-management', approver: 'client', approverSide: 'client',
    ticket: 'Gate C6: post-launch backlog agreed'
  }
];

/* --- Artefacts ------------------------------------------------------------ */

export const artefacts = {
  'sales-handover':      { name: 'Sales handover note',        type: 'docx', file: 'sales-handover-note.docx',       gate: 0,  routes: ['light','standard','full'], isNew: true },
  'discovery-summary':   { name: 'Discovery summary',          type: 'docx', file: 'discovery-summary.docx',         gate: 1,  routes: ['light','standard','full'] },
  'requirements':        { name: 'Requirements list',          type: 'docx', file: 'discovery-summary.docx',         gate: 1,  routes: ['standard','full'] },
  'risk-log':            { name: 'Risk & assumption log',      type: 'xlsx', file: 'chillibyte-project-trackers.xlsx', tab: 'Risks & assumptions', gate: 1, routes: ['light','standard','full'] },
  'estimate-baseline':   { name: 'Estimate baseline',          type: 'xlsx', file: 'chillibyte-project-trackers.xlsx', tab: 'Estimate baseline', gate: 1, routes: ['light','standard','full'], isNew: true },
  'internal-brief':      { name: 'Internal brief',             type: 'docx', file: 'discovery-summary.docx',         gate: 2,  routes: ['standard','full'] },
  'sitemap':             { name: 'Sitemap',                    type: 'xlsx', file: 'chillibyte-project-trackers.xlsx', tab: 'Sitemap', gate: 3, routes: ['light','standard','full'] },
  'page-inventory':      { name: 'Page inventory',             type: 'xlsx', file: 'chillibyte-project-trackers.xlsx', tab: 'Page inventory', gate: 3, routes: ['standard','full'] },
  'page-outlines':       { name: 'Page outlines',              type: 'docx', file: 'page-outline.docx',              gate: 4,  routes: ['light','standard','full'] },
  'content-matrix':      { name: 'Content matrix',             type: 'xlsx', file: 'chillibyte-project-trackers.xlsx', tab: 'Content matrix', gate: 4, routes: ['standard','full'] },
  'block-inventory':     { name: 'Block inventory',            type: 'xlsx', file: 'chillibyte-project-trackers.xlsx', tab: 'Block inventory', gate: 5, routes: ['light','standard','full'] },
  'block-spec':          { name: 'Block specification',        type: 'docx', file: 'block-specification.docx',       gate: 5,  routes: ['standard','full'] },
  'wireframes':          { name: 'Wireframes',                 type: 'other', file: null,                            gate: 6,  routes: ['light','standard','full'] },
  'style-direction':     { name: 'Style direction',            type: 'docx', file: 'designer-brief.docx',            gate: 7,  routes: ['standard','full'] },
  'designer-brief':      { name: 'Designer brief',             type: 'docx', file: 'designer-brief.docx',            gate: 7,  routes: ['standard','full'] },
  'design-review-notes': { name: 'Design review notes',        type: 'docx', file: 'designer-brief.docx',            gate: 8,  routes: ['standard','full'] },
  'build-spec':          { name: 'Build specification',        type: 'docx', file: 'build-specification.docx',       gate: 10, routes: ['standard','full'] },
  'qa-checklist':        { name: 'QA checklist',               type: 'xlsx', file: 'chillibyte-project-trackers.xlsx', tab: 'QA', gate: 11, routes: ['light','standard','full'] },
  'launch-checklist':    { name: 'Launch checklist',           type: 'xlsx', file: 'chillibyte-project-trackers.xlsx', tab: 'Launch', gate: 13, routes: ['light','standard','full'] },
  'decision-log':        { name: 'Decision log',               type: 'xlsx', file: 'chillibyte-project-trackers.xlsx', tab: 'Decision log', gate: null, routes: ['light','standard','full'] },
  'change-log':          { name: 'Change log',                 type: 'xlsx', file: 'chillibyte-project-trackers.xlsx', tab: 'Change log', gate: null, routes: ['light','standard','full'] },
  'variation-order':     { name: 'Variation order',            type: 'docx', file: 'variation-order.docx',           gate: null, routes: ['light','standard','full'], isNew: true },
  'variation-register':  { name: 'Variation register',         type: 'xlsx', file: 'chillibyte-project-trackers.xlsx', tab: 'Variation register', gate: null, routes: ['light','standard','full'], isNew: true },
  'gate-ticket':         { name: 'Basecamp gate ticket',       type: 'docx', file: 'gate-ticket.docx',               gate: null, routes: ['light','standard','full'] },
  'approval-note':       { name: 'Client approval note',       type: 'docx', file: 'client-approval-note.docx',      gate: null, routes: ['light','standard','full'] },
  'gate-tracker':        { name: 'Gate tracker',               type: 'xlsx', file: 'chillibyte-project-trackers.xlsx', tab: 'Gate tracker', gate: null, routes: ['light','standard','full'] },
  'redirect-map':        { name: 'Redirect map',               type: 'xlsx', file: 'chillibyte-project-trackers.xlsx', tab: 'Sitemap', gate: null, routes: [], conditions: ['existing-site'] },

  /* Full-route only. These are what the extra depth actually buys, and the
     concrete answer to "how is full different from standard?" */
  'stakeholder-map':     { name: 'Stakeholder map',            type: 'docx', file: 'discovery-summary.docx',           gate: 1,  routes: ['full'], fullOnly: true },
  'content-model':       { name: 'Data and content model',     type: 'docx', file: 'build-specification.docx',         gate: 10, routes: ['full'], fullOnly: true },
  'accessibility-audit': { name: 'Accessibility audit',        type: 'xlsx', file: 'chillibyte-project-trackers.xlsx', tab: 'QA', gate: 11, routes: ['full'], fullOnly: true },
  'handover-notes':      { name: 'Handover notes',             type: 'docx', file: 'build-specification.docx',       gate: 14, routes: ['light','standard','full'] }
};

/* --- Rules of engagement -------------------------------------------------- */

export const rules = [
  { text: 'Designers do not start from raw discovery notes.', source: 'original' },
  { text: 'Visual design does not begin before structure is agreed.', source: 'original' },
  { text: 'Page outlines come before wireframes.', source: 'original' },
  { text: 'Block inventory comes before detailed design.', source: 'original' },
  { text: 'Designs must not silently create new development scope.', source: 'original' },
  { text: 'Any new component, behaviour, page type or content model introduced during design must be logged.', source: 'original' },
  { text: 'Client approvals must name the artefacts being approved, with their version.', source: 'original' },
  { text: 'Changes to approved artefacts go through the change log.', source: 'original' },
  { text: 'Reusable block structure stays separate from project-specific styling.', source: 'original' },
  { text: 'Build follows approved blocks, fields and templates.', source: 'original' },
  { text: 'Every project has an estimate baseline before work starts, and a re-baseline at build spec.', source: 'new', gap: 'G1' },
  { text: 'A change that adds effort gets an effort figure. If it is chargeable, it becomes a variation order before the work happens.', source: 'new', gap: 'G2' },
  { text: 'Every gate has a named client approver and an agreed response window. Silence past the window pauses the project; it does not mean yes.', source: 'new', gap: 'G3' },
  { text: 'Nothing enters delivery without a sales handover on the record.', source: 'new', gap: 'G4' },
  { text: 'Defects are fixed free inside the warranty window. Changes are quoted, inside it or outside it.', source: 'new', gap: 'G5' },
  { text: 'Design and feedback rounds are counted. Rounds beyond the allowance are a variation, not a favour.', source: 'new', gap: 'G6' },
  { text: 'No work package starts until its inputs exist. No work package finishes until its done-when conditions are met.', source: 'new', gap: 'G7' },
  { text: 'The person who produced an artefact is not its only approver.', source: 'new', gap: 'G8' },
  { text: 'QA tests against the agreed support matrix and accessibility target. Anything outside it is out of scope.', source: 'new', gap: 'G13' },
  { text: 'The change log is mandatory on every route, including light.', source: 'new', gap: 'G14' }
];

/* --- Helpers -------------------------------------------------------------- */

export function gateByNumber(n) {
  return gates.find(g => g.n === n) || null;
}

export function roleName(id) {
  return roles[id] ? roles[id].name : id;
}

export function phaseById(id) {
  return phases.find(p => p.id === id) || null;
}
