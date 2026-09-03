/* ---------------------------------------------------------------------------
   steps.js — the 20 work packages.

   Each step is a work package with entry criteria (inputs), exit criteria
   (deliverables + doneWhen) and downstream consequences (blocks). That
   structure is what allows more than one person to work a project at once:
   a package can be handed to someone with no project history and still be
   startable and finishable. (Closes G7.)

   effortBand is in HOURS and feeds the estimate baseline (G1). Treat the
   numbers as starting calibration, not gospel — adjust after three projects.
--------------------------------------------------------------------------- */

export const steps = [
  /* ========================= PHASE 1 — UNDERSTAND ========================== */

  {
    id: "sales-handover",
    n: 1,
    phase: "understand",
    docPhase: "Understand",
    title: "Sales handover",
    isNew: true,
    newBecause:
      'The process previously began at "discovery scheduled", treating everything before it as sales. But what sales promised — the inclusions, the exclusions, the price, the verbal reassurances — is the single commonest origin of scope creep, and it was entering delivery unrecorded. (G4)',
    summary:
      "Delivery formally accepts what sales sold, in writing, before anything else happens.",
    detail: `A website project does not begin with a blank sheet. It begins with a proposal, a price, a conversation and a set of expectations already sitting in the client's head. Most scope arguments later in a project are not really about the change being requested — they are about a difference between what the client believes was included and what delivery believes was included. Neither party is lying. The expectation was simply never written down at the point it was created.

This step closes that. Sales hands over a short note covering what was sold, at what price, against what timescale, with what explicitly included and — more importantly — what explicitly excluded. Delivery reads it, and either accepts it or raises the gap before the project starts rather than in week six.

It takes twenty minutes. It is the cheapest step in the entire process and it protects every step after it.`,
    why: "Because you cannot defend a scope boundary that was never drawn. Everything downstream — the change log, variation orders, the exclusions list — depends on there being an agreed starting position to measure change against.",
    owner: "sales",
    contributors: ["account-management", "head-of-web"],
    approver: "head-of-web",
    inputs: [
      "Signed proposal, quote or scope of work",
      "Any written commitments made during the sale",
      "Commercial constraints — budget, deadline, payment terms",
    ],
    deliverables: ["sales-handover"],
    doneWhen: [
      "Price, timescale and payment structure are on the record",
      "Inclusions are listed explicitly",
      "Exclusions are listed explicitly — this is the important half",
      "Any verbal promises made during the sale are captured or formally retracted",
      "Number of design concepts and feedback rounds included is stated",
      "Delivery has accepted the handover, or logged the gap between sold and deliverable",
    ],
    blocks: ["discovery"],
    gate: 0,
    routes: ["light", "standard", "full"],
    conditions: [],
    effortBand: { light: 0.5, standard: 1, full: 2 },
    templates: ["sales-handover"],
    example: "sales-handover",
    parallelWith: [],
    instructions: [
      "Sales completes the handover note from the proposal — do not write it from memory.",
      'List exclusions explicitly. "Not included: copywriting, photography, translation, ongoing SEO" is worth more than any other line in the document.',
      "State the included design concepts and revision rounds as a number.",
      "Head of Web reads it and either accepts, or writes down where what was sold and what is deliverable diverge.",
      "If they diverge, resolve commercially now. Do not absorb it silently and do not let it become discovery's problem.",
      "In Basecamp: file the handover note in Docs & Files → 0-Sales & Scoping, tick Step 1 on the Phase 1 — Understand to-do list, and paste the Gate 0 ticket body into the Approval Gates list before ticking it.",
    ],
    pitfalls: [
      {
        risk: "Handover is a verbal conversation.",
        control:
          "It is not a handover unless it is a document with a date on it.",
      },
      {
        risk: 'Exclusions left blank because "it is obvious".',
        control:
          "It is never obvious to the client. Blank exclusions are the single biggest predictor of a scope argument later.",
      },
      {
        risk: "Delivery accepts a project it knows is underpriced to avoid the conversation.",
        control:
          "The conversation gets harder every week it is delayed. Have it before discovery.",
      },
    ],
    risks: [
      "Sold scope and deliverable scope differ and nobody says so until build",
    ],
  },

  {
    id: "discovery",
    n: 2,
    phase: "understand",
    docPhase: "Understand",
    title: "Discovery and requirements capture",
    summary:
      "Gather enough business, audience, content, brand and technical context to define the project properly.",
    detail: `Discovery is where the project is actually decided. Everything after it is elaboration. The purpose is not to collect opinions about websites — it is to understand what the business needs the website to do, who it needs to do it for, and what constraints exist around making that happen.

The temptation is to run discovery as a friendly conversation and write up the highlights. Resist it. Discovery has a checklist because the questions people forget to ask are always the same ones: who actually signs off, who is writing the content, what happens to form submissions, does anything need to integrate, which URLs currently bring in traffic, and what does the client consider a failure.

This step also now sets the project's commercial and operational guardrails: the estimate baseline, the approval SLA, the named approver, the support matrix and the accessibility target. These take minutes to agree at the start and are close to impossible to impose later.`,
    why: "Every downstream artefact traces back to a discovery answer. A gap here does not stay a gap — it becomes a wrong sitemap, then a wrong outline, then a wrong design, and the cost of correcting it multiplies at every stage.",
    owner: "head-of-web",
    contributors: ["account-management", "client", "seo-analytics"],
    approver: "head-of-web",
    inputs: [
      "Accepted sales handover (Gate 0)",
      "Access to the client stakeholder representative",
      "Existing site, if there is one",
    ],
    deliverables: [
      "discovery-summary",
      "requirements",
      "risk-log",
      "estimate-baseline",
    ],
    doneWhen: [
      "Business goals, audiences and conversion routes are written down",
      'Content ownership is assigned per page or per section — not "the client will do it"',
      "Technical context is captured: hosting, domains, forms, integrations, analytics, plugins",
      "Risks and assumptions are logged with owners",
      "Project route (light / standard / full) is selected and the reason recorded",
      "Estimate baseline is produced and recorded — the number all later change is measured against",
      "Named client approver and approval response window are agreed",
      "Browser and device support matrix is agreed",
      "Accessibility target is stated",
    ],
    blocks: ["internal-brief", "sitemap", "current-state-audit"],
    gate: 1,
    routes: ["light", "standard", "full"],
    conditions: [],
    effortBand: { light: 3, standard: 7, full: 14 },
    templates: ["discovery-summary", "risk-log", "estimate-baseline"],
    example: "discovery",
    parallelWith: ["current-state-audit"],
    instructions: [
      "Book a proper session. Discovery squeezed into the end of a kick-off call produces a project that gets discovered during build instead.",
      "Work through the discovery summary template as an agenda rather than free-form conversation.",
      'Ask directly who signs off, and get a name. "The team" is not an approver.',
      "Ask what happens to form submissions and where that data goes. This is a compliance question disguised as a technical one.",
      "If there is an existing site, capture its traffic and top URLs now — you cannot baseline it retrospectively after launch.",
      "Agree the approval response window (five working days is a reasonable default) and what happens if it passes.",
      "Produce the estimate baseline from the step effort bands for the chosen route, add contingency, and record it.",
      "Select the route. Record the reason in the decision log as DEC-001.",
      "In Basecamp: file the discovery summary, requirements list, risk log and estimate baseline in Docs & Files → 1-Understand, tick Step 2 on the Phase 1 — Understand to-do list, and paste the Gate 1 ticket body into the Approval Gates list before ticking it.",
    ],
    pitfalls: [
      {
        risk: "Discovery captures preferences instead of requirements.",
        control:
          '"They want it to feel modern" is not a requirement. Ask what the site must achieve and how they will know it worked.',
      },
      {
        risk: "Content ownership left vague.",
        control:
          "Assign an owner per page. Vague content ownership is the most reliable predictor of a late project.",
      },
      {
        risk: "No estimate produced, so scope creep is unprovable later.",
        control:
          "The baseline is not a quote to the client — it is your internal yardstick. Produce it even on light projects.",
      },
      {
        risk: "Approver never named, so approval never quite happens.",
        control:
          "Get a name at Gate 1. Approval by committee is approval by nobody.",
      },
    ],
    risks: [
      "Missing technical context surfaces during build",
      "Content owner unassigned",
      "No traffic baseline captured before a redesign",
    ],
  },

  {
    id: "internal-brief",
    n: 3,
    phase: "understand",
    docPhase: "Understand",
    title: "Internal brief and principles",
    summary:
      "Turn raw discovery into a usable working brief the whole team can act from.",
    detail: `Discovery notes are evidence. A brief is a position. The difference matters, because nobody on the team can design or build from evidence — they need a decision about what the project is trying to do and what constraints apply.

The internal brief converts discovery into goals, requirements, assumptions, risks, exclusions and a set of design and technical principles. Principles are the part people skip and the part that does most of the work later: "the site must be legible to a technical buyer skimming on a phone" resolves a dozen future arguments that would otherwise be settled by whoever is most insistent in the room.

This is also where exclusions get written properly — not as a commercial defence, but as a shared understanding of what the project is deliberately not doing.`,
    why: "It gives the designer, developer and account manager one document to align on, so decisions are made against agreed principles rather than individual taste.",
    owner: "head-of-web",
    contributors: ["account-management", "designer"],
    approver: "head-of-web",
    inputs: ["Approved discovery (Gate 1)"],
    deliverables: ["internal-brief"],
    doneWhen: [
      "Goals are stated in a form that can be judged as met or not met",
      "Design principles are written — three to five, specific to this project",
      "Technical principles are written",
      "Exclusions are explicit",
      "Assumptions carry an owner and a validation route",
      "The team has read it and agrees",
    ],
    blocks: ["style-direction", "designer-brief"],
    gate: 2,
    routes: ["standard", "full"],
    conditions: [],
    effortBand: { light: 0, standard: 3, full: 5 },
    omitReason: {
      light:
        "On a light project the discovery summary is short enough to act as the brief. Do not write the same content twice.",
    },
    templates: ["discovery-summary"],
    example: "internal-brief",
    parallelWith: ["current-state-audit"],
    instructions: [
      "Write it in one sitting from the discovery summary. If it takes longer than half a day, discovery was incomplete.",
      'Write three to five design principles that are specific to this client. Generic principles ("clean and modern") do no work.',
      "State the technical principles: block reuse expectations, plugin policy, performance posture.",
      "List exclusions explicitly, carrying forward those from the sales handover.",
      "Circulate to the designer and account manager before Gate 2 rather than after.",
      "In Basecamp: file the internal brief in Docs & Files → 1-Understand, tick Step 3 on the Phase 1 — Understand to-do list, and paste the Gate 2 ticket body into the Approval Gates list before ticking it.",
    ],
    pitfalls: [
      {
        risk: "Brief is a copy-paste of discovery notes.",
        control: "If it contains no decisions, it is not a brief.",
      },
      {
        risk: "Principles are generic.",
        control:
          "A principle you could paste into any other project is not a principle.",
      },
    ],
    risks: ["Team works from different mental models of the project"],
  },

  {
    id: "current-state-audit",
    n: 4,
    phase: "understand",
    docPhase: "Understand",
    title: "Current-state and SEO baseline audit",
    summary:
      "Record what the existing site contains, ranks for and earns, before replacing it.",
    detail: `This step exists only when there is an existing site — but when there is, it is not optional regardless of how small the project is. That is a deliberate departure from the original model, which put audit and migration work on the full route only.

The reasoning is simple: a five-page brochure site that has ranked for a decade can lose more commercial value in a bad migration than a fifty-page site with no organic traffic at all. Risk here follows traffic and links, not page count. A light-route project on a well-established domain still needs its URLs mapped.

The audit captures the content inventory, the URL list, current organic performance, top landing pages, inbound links worth protecting, and anything on the current site that is quietly load-bearing — a form that feeds a CRM, a PDF that sales sends out weekly, a page that a printed brochure links to.`,
    why: "You cannot write a redirect map from a sitemap you have not recorded, and you cannot prove a launch did not harm traffic without a before figure.",
    owner: "seo-analytics",
    contributors: ["head-of-web", "client"],
    approver: "head-of-web",
    inputs: ["Access to existing site, analytics and search console"],
    deliverables: ["redirect-map"],
    doneWhen: [
      "Full URL inventory exported",
      "Organic traffic and top landing pages recorded with a date",
      "Inbound links worth protecting identified",
      "Content marked keep / rewrite / retire",
      "Load-bearing assets identified (forms, PDFs, campaign landing pages)",
    ],
    blocks: ["sitemap"],
    gate: null,
    conditionalGate: "gate-c-audit",
    routes: ["light", "standard", "full"],
    conditions: ["existing-site"],
    conditionNote:
      "Runs whenever an existing site is being replaced — on any route. Risk follows traffic, not page count. (G12)",
    effortBand: { light: 2, standard: 5, full: 12 },
    templates: ["sitemap"],
    example: "current-state-audit",
    parallelWith: ["discovery", "internal-brief"],
    instructions: [
      "Export the full URL list from the CMS, a crawl and the XML sitemap — all three, because they never agree.",
      "Pull twelve months of organic landing-page data and save it with the date. This is the baseline you will be judged against.",
      "Identify the top 20 URLs by traffic and by inbound links. These are the ones that must be redirected correctly.",
      "Walk the site for load-bearing items: forms, gated PDFs, campaign URLs printed on physical material.",
      "Mark every page keep / rewrite / retire and agree it with the client.",
      "In Basecamp: file the redirect map and audit findings in Docs & Files → 1-Understand, tick Step 4 on the Phase 1 — Understand to-do list, and — because this step only runs when replacing an existing site — paste the conditional audit gate ticket body into the Approval Gates list before ticking it.",
    ],
    pitfalls: [
      {
        risk: "Audit skipped because the project is small.",
        control:
          "Size of project is irrelevant. Age and authority of domain is what matters.",
      },
      {
        risk: "Baseline captured after launch.",
        control:
          "Then it is not a baseline. Capture it before anything changes.",
      },
    ],
    risks: [
      "Ranking URLs dropped without redirects",
      "Traffic loss attributed to the agency with no data to argue otherwise",
    ],
  },

  /* ========================= PHASE 2 — STRUCTURE =========================== */

  {
    id: "sitemap",
    n: 5,
    phase: "structure",
    docPhase: "Structure",
    title: "Sitemap and page inventory",
    summary:
      "Define what pages exist, how they relate, and how users move between them.",
    detail: `The sitemap is the first artefact the client can genuinely argue with, and that is its value. It converts a vague sense of "a website for our business" into a finite list of things that have to be designed, written and built.

It comes before page outlines because outlining depends on knowing which pages exist and what job each one does relative to the others. A services page written before you know whether there are three service detail pages beneath it or none is written blind.

The page inventory is the sitemap's operational twin: same pages, but with template type, content owner, and build status. It is what turns the sitemap from a diagram into a work plan.`,
    why: "It is the first hard scope boundary in the project. Once approved, adding a page is a visible, loggable, priceable event rather than an assumption.",
    owner: "head-of-web",
    contributors: ["account-management", "client", "seo-analytics"],
    approver: "client",
    inputs: [
      "Approved discovery",
      "Internal brief where applicable",
      "Current-state audit where there is an existing site",
    ],
    deliverables: ["sitemap", "page-inventory"],
    doneWhen: [
      "Every page has a proposed URL and a parent",
      "Every page has a stated purpose and primary audience",
      "Template type is assigned: unique / repeatable / standard content page",
      "Navigation model is defined, including what is deliberately not in the nav",
      "Content owner is assigned per page",
      "Where there is an existing site, every old URL maps to a new one or to a documented retirement",
    ],
    blocks: ["page-outlines", "wireframes"],
    gate: 3,
    routes: ["light", "standard", "full"],
    conditions: [],
    effortBand: { light: 2, standard: 5, full: 12 },
    templates: ["sitemap", "page-inventory"],
    example: "sitemap",
    parallelWith: ["brand-asset-collection"],
    instructions: [
      "Start from the business goals and audiences, not from the existing site's menu.",
      "Assign each page a single primary job. Pages with three jobs become pages with none.",
      "Distinguish unique pages from repeatable templates — this is the number that drives design and build effort, not the raw page count.",
      "Mark what is deliberately excluded from the navigation and why.",
      "If replacing a site, map old URLs to new ones now while the structure is still malleable.",
      "Present to the client as a decision, not a menu of options. Take it to Gate 3.",
      "In Basecamp: file the sitemap and page inventory in Docs & Files → 2-Structure, tick Step 5 on the Phase 2 — Structure to-do list, and paste the Gate 3 ticket body into the Approval Gates list before ticking it.",
    ],
    pitfalls: [
      {
        risk: "Sitemap mirrors the client's org chart.",
        control:
          "Users do not care how the business is structured. Structure around what they came to do.",
      },
      {
        risk: "Page count agreed but template count ignored.",
        control:
          "Twelve pages on two templates is a different project to twelve pages on nine templates. Price and plan on templates.",
      },
      {
        risk: "Approved informally in a call.",
        control:
          "Sitemap approval is a Gate 3 ticket naming the artefact version. Otherwise you cannot show later what was agreed.",
      },
    ],
    risks: [
      "Pages added after approval without a change log entry",
      "Template count grows silently",
    ],
  },

  {
    id: "page-outlines",
    n: 6,
    phase: "structure",
    docPhase: "Plan the content",
    title: "Key page outlines",
    summary:
      "Define what each key page needs to say and do, before any layout decision is made.",
    detail: `A wireframe without a content outline is a layout guess. This step is what stops the project designing boxes and then hunting for words to fill them.

For each key page, the outline sets out the heading structure, what each section is for, roughly how much content it needs, what media it requires, who owns that content, and which block is likely to render it. It is deliberately written in the language of intent rather than final copy: "section establishing credibility through named clients and a metric" rather than finished prose.

This is also where content deadlines get set. The original model tracked content owners but never content dates, and late client content is the most common cause of website overrun by a wide margin. Every content item now gets an owner and a date, and there is a stated consequence when the date passes.`,
    why: "Structure depends on content intent. Deciding what a page must say before deciding how it looks removes the single largest source of design rework.",
    owner: "head-of-web",
    contributors: ["copywriter", "client", "account-management"],
    approver: "client",
    inputs: ["Approved sitemap (Gate 3)"],
    deliverables: ["page-outlines", "content-matrix"],
    doneWhen: [
      "Every key page has a semantic heading structure",
      "Every section states its purpose and approximate content length",
      "Media requirements are identified with an owner",
      "Likely block is noted per section — this feeds block identification",
      "Primary and secondary CTAs are defined per page",
      "Every content item has an owner AND a deadline",
      "Late-content escalation is agreed and written down",
    ],
    blocks: ["block-identification", "wireframes", "copywriting"],
    gate: 4,
    routes: ["light", "standard", "full"],
    conditions: [],
    effortBand: { light: 3, standard: 9, full: 20 },
    templates: ["page-outlines", "content-matrix"],
    example: "page-outlines",
    parallelWith: ["style-research"],
    instructions: [
      "Outline the key pages, not every page. Home, the primary template, and any page carrying unusual structure.",
      'Write section purposes as jobs: "answer the objection about lead times", not "text block".',
      'Give approximate word counts. "80–120 words" prevents both a one-line section and an essay.',
      "Note the likely block per section. This is the raw material for block identification and costs nothing to capture now.",
      "Set a date against every content item. Put the dates in the content matrix, not in an email.",
      "Agree what happens if content is late: the project pauses at a named point and the timeline moves. Say it once, at Gate 4, in writing.",
      "Take outlines and the content matrix to Gate 4 together.",
      "In Basecamp: file the page outlines and content matrix in Docs & Files → 2-Structure, tick Step 6 on the Phase 2 — Structure to-do list, and paste the Gate 4 ticket body into the Approval Gates list before ticking it.",
    ],
    pitfalls: [
      {
        risk: "Outlines written as final copy.",
        control:
          "Outline intent and length. Copy comes after approval, against the outline.",
      },
      {
        risk: "Content deadlines omitted because they feel pushy.",
        control:
          "They are far less awkward at Gate 4 than in week seven when the build is stalled and the launch date is public.",
      },
      {
        risk: "Every page outlined in full.",
        control:
          "Outline the templates and the unique pages. Repeatable pages need one outline, not twenty.",
      },
    ],
    risks: [
      "Client content arrives late or not at all",
      "Copy written before structure is approved and then discarded",
    ],
  },

  {
    id: "block-identification",
    n: 7,
    phase: "structure",
    docPhase: "Architect the blocks",
    title: "Block identification",
    summary:
      "Translate approved page sections into a controlled inventory of reusable building blocks.",
    detail: `This is the step that protects development scope, and it is the one most often skipped because its value is invisible until it is missing.

Every section identified in the page outlines is assessed against the existing block library and given one of three decisions: reuse as-is, adapt an existing block, or build new. The result is a block inventory with a known build cost, rather than a set of designs that turn out — during build — to require nine components nobody planned for.

It sits before detailed design deliberately. If design runs first, the designer produces beautiful sections and the block library is reverse-engineered from them at whatever cost that implies. If block identification runs first, the designer knows the structural vocabulary they are styling and can spend their effort on hierarchy, rhythm and expression instead of inventing components.

Crucially, this is also where the separation between block structure and project styling is decided: which parts are shared PHP and field patterns, and which parts vary through theme SCSS.`,
    why: "The approved section model determines the reusable block library. Deciding it here means development scope is known before design, not discovered after it.",
    owner: "head-of-web",
    contributors: ["designer", "web-developer"],
    approver: "head-of-web",
    inputs: ["Approved page outlines (Gate 4)", "Existing block library"],
    deliverables: ["block-inventory", "block-spec"],
    doneWhen: [
      "Every section from every outline maps to a block",
      "Each block carries a reuse / adapt / build-new decision with a reason",
      "field notes exist for anything being adapted or built",
      "Build impact is estimated per block",
      "Blocks needing design attention are flagged for the designer brief",
      "PHP structure and project SCSS responsibilities are separated",
    ],
    blocks: ["wireframes", "visual-design", "build-spec"],
    gate: 5,
    routes: ["light", "standard", "full"],
    conditions: [],
    effortBand: { light: 1.5, standard: 4, full: 9 },
    templates: ["block-inventory", "block-spec"],
    example: "block-identification",
    parallelWith: ["style-research"],
    instructions: [
      "List every distinct section across all page outlines. Expect duplicates — that is the point.",
      "Collapse duplicates. Two sections that differ only in content are one block.",
      "Assess each against the library: reuse, adapt or build new. Record the reason in the decision log.",
      "For adapt and build-new blocks, write a block specification.",
      "Estimate build impact per block as low / medium / high and total it — this feeds the estimate re-baseline.",
      "Flag which blocks need real design attention and which just need styling within an existing pattern.",
      "Take the inventory to Gate 5 before any block-level design begins.",
      "In Basecamp: file the block inventory and block spec in Docs & Files → 2-Structure, tick Step 7 on the Phase 2 — Structure to-do list, and paste the Gate 5 ticket body into the Approval Gates list before ticking it.",
    ],
    pitfalls: [
      {
        risk: "Every section treated as a new block.",
        control:
          "If the inventory is as long as the section list, no consolidation has happened. Push back and collapse.",
      },
      {
        risk: "Blocks identified but never specified.",
        control:
          "A block name is not a spec. Adapt and build-new blocks need fields, display rules and responsive behaviour written down.",
      },
      {
        risk: "Designer adds components after this gate.",
        control:
          "That is a change log entry and a build-impact assessment, not a quiet addition.",
      },
    ],
    risks: [
      "Component scope grows during design",
      "Block library diverges into project-specific one-offs",
    ],
  },

  {
    id: "wireframes",
    n: 8,
    phase: "structure",
    docPhase: "Wireframe the structure",
    title: "Page and block wireframes",
    summary:
      "Agree hierarchy, section order, content density and component behaviour without visual distraction.",
    detail: `Wireframes are where structural arguments are supposed to happen, because they are cheap here and expensive everywhere else. Moving a section in a wireframe takes a minute. Moving it after design takes a design revision, and after build takes a development ticket.

The absence of visual treatment is the feature, not a limitation. Stakeholders reviewing a greyscale wireframe discuss whether the section order makes sense. The same stakeholders reviewing a designed page discuss the colour of the button. Both conversations need to happen — but in that order, and not simultaneously.

Wireframes cover key pages and the blocks themselves, including responsive behaviour: what stacks, what truncates, what disappears on mobile. Getting responsive intent agreed at wireframe stage removes an entire category of late-stage surprise.`,
    why: "Hierarchy, section order, content density and component behaviour should all be settled before anyone applies visual treatment to them.",
    owner: "head-of-web",
    contributors: ["designer", "web-developer"],
    approver: "client",
    inputs: [
      "Approved page outlines (Gate 4)",
      "Approved block inventory (Gate 5)",
    ],
    deliverables: ["wireframes"],
    doneWhen: [
      "Key pages wireframed at desktop and mobile",
      "Each block wireframed with its variants",
      "Responsive behaviour noted per block",
      "Content density reflects the approximate lengths from the outlines",
      "Open structural decisions listed rather than silently resolved",
    ],
    blocks: ["designer-brief", "visual-design"],
    gate: 6,
    routes: ["light", "standard", "full"],
    conditions: [],
    effortBand: { light: 3, standard: 8, full: 18 },
    templates: [],
    example: "wireframes",
    parallelWith: ["style-direction"],
    instructions: [
      "Keep them greyscale and keep them plain. Any styling invites styling feedback.",
      "Use realistic content lengths from the outlines, not lorem ipsum — density is one of the things being agreed.",
      "Wireframe mobile for anything whose behaviour is not obvious.",
      "Wireframe the blocks separately from the pages, including their variants.",
      "List open decisions on the wireframe itself rather than resolving them by drawing one option.",
      "Count review rounds against the revision allowance from Gate 0.",
      "In Basecamp: file the wireframes in Docs & Files → 2-Structure, tick Step 8 on the Phase 2 — Structure to-do list, and paste the Gate 6 ticket body into the Approval Gates list before ticking it.",
    ],
    pitfalls: [
      {
        risk: "Wireframes get styled to look presentable.",
        control:
          "The moment they look designed, feedback becomes design feedback and the structural conversation is lost.",
      },
      {
        risk: "Mobile ignored until build.",
        control:
          "Responsive behaviour is a structural decision. Agree it here.",
      },
      {
        risk: "Client asked to approve wireframes without explanation.",
        control:
          "Frame what is being approved — structure and order, not appearance. Otherwise you get the wrong feedback.",
      },
    ],
    risks: ["Structural change requested after design has started"],
  },

  /* ========================= PHASE 3 — DIRECTION =========================== */

  {
    id: "style-direction",
    n: 9,
    phase: "direction",
    docPhase: "Define visual direction",
    title: "Style direction",
    summary:
      "Establish the visual foundation — principles, colour, type, media and tone — before design exploration begins.",
    detail: `Style direction is the difference between a designer exploring and a designer guessing. It sets out the visual principles, colour roles, typographic roles, image treatment, UI tone, accessibility expectations, and — usefully — references to learn from and references to avoid.

The "avoid" list does more work than the "inspiration" list. Knowing that the client dislikes a competitor's aesthetic, or that a previous agency's work is a sore subject, prevents an entire wasted round.

Colour is defined by role rather than by hex: what carries primary action, what carries emphasis, what recedes. That framing survives the inevitable "can we try it in blue" conversation, because roles persist even when values change.

Where a project involves creating or refreshing a brand, this step expands considerably and should be treated as its own piece of work with its own approval.`,
    why: "The designer needs principles, constraints and strategic context. Handing over raw discovery notes and hoping produces subjective work that is hard to critique objectively.",
    owner: "head-of-web",
    contributors: ["designer", "client"],
    approver: "client",
    inputs: [
      "Internal brief",
      "Approved wireframes (Gate 6)",
      "Existing brand assets",
    ],
    deliverables: ["style-direction"],
    doneWhen: [
      "Visual principles are written and specific to this project",
      "Colour is defined by role, with contrast expectations",
      "Typographic roles are defined: display, body, UI",
      "Image and media treatment is described",
      "Accessibility target is restated in visual terms",
      "References to learn from and references to avoid are both listed",
    ],
    blocks: ["designer-brief", "visual-design"],
    gate: 7,
    routes: ["standard", "full"],
    conditions: [],
    omitReason: {
      light:
        "On a light project with an established brand, a short style note inside the designer brief is sufficient. Do not run a separate direction exercise for a five-page brochure site.",
    },
    effortBand: { light: 1, standard: 4, full: 10 },
    templates: ["designer-brief"],
    example: "style-direction",
    parallelWith: ["wireframes"],
    instructions: [
      'Define colour by role, not by value. "Primary action", "emphasis", "recessive surface".',
      "State contrast expectations explicitly against the accessibility target.",
      "Collect references in both directions. Ask the client directly what they do not want to look like.",
      "If the brand needs creating or refreshing, split that out as its own work with its own approval — it is not a subsection of style direction.",
      "Take to Gate 7 with the designer brief.",
      "In Basecamp: file the style direction in Docs & Files → 3-Direction, tick Step 9 on the Phase 3 — Direction to-do list, and open the Gate 7 ticket in the Approval Gates list — designer briefing adds the second artefact before it's pasted in full and ticked.",
    ],
    pitfalls: [
      {
        risk: "Direction expressed as a moodboard alone.",
        control:
          "A moodboard is evidence, not direction. Write the principles the moodboard is illustrating.",
      },
      {
        risk: "Accessibility mentioned but not quantified.",
        control:
          'Name the standard and the contrast ratios. "Accessible" is not a testable statement.',
      },
    ],
    risks: [
      "Design direction rejected late because it was never explicitly agreed",
    ],
  },

  {
    id: "designer-brief",
    n: 10,
    phase: "direction",
    docPhase: "Brief the designer",
    title: "Designer briefing",
    summary:
      "Hand the designer approved structure and principles, with what is fixed and what is open stated explicitly.",
    detail: `The single most important thing this brief does is separate what is fixed from what is open. Fixed: the sitemap, the page structure, the block model, the content hierarchy, the technical constraints. Open: visual language, colour refinement, typography refinement, image treatment, spacing, rhythm, component polish, interaction detail.

Stated that way, the brief is not a constraint on the designer — it is a licence. It tells them exactly where their judgement is wanted and removes the risk of investing effort in an area that has already been decided and approved.

It also sets the review criteria in advance, which makes design critique objective. "Does this respect the block model?" is a question with an answer. "Do we like it?" is not.

The control this step enforces: the designer should improve visual hierarchy, rhythm, expression and polish, but should not casually alter sitemap, content strategy, block scope or technical structure. When they have a good reason to — and sometimes they will — it goes in the decision log and gets a build-impact assessment. Good ideas are welcome. Silent ideas are not.`,
    why: "Design starting from approved structure and principles produces work that can be objectively reviewed and efficiently built. Design starting from loose notes produces work that can only be reviewed on taste.",
    owner: "head-of-web",
    contributors: ["designer"],
    approver: "head-of-web",
    inputs: [
      "Approved wireframes (Gate 6)",
      "Approved style direction (Gate 7)",
      "Block inventory",
    ],
    deliverables: ["designer-brief"],
    doneWhen: [
      "Approved artefacts are listed by name and version",
      "What is fixed is stated explicitly",
      "What is open is stated explicitly",
      "Per-block design tasks and constraints are set out",
      "Review criteria are agreed before work starts",
      "Designer has read it and raised any disagreement before starting",
    ],
    blocks: ["visual-design"],
    gate: 7,
    routes: ["standard", "full"],
    conditions: [],
    omitReason: {
      light:
        "On a light project the brief collapses into a short written handover attached to the wireframes. It still happens — it is just shorter.",
    },
    effortBand: { light: 0.5, standard: 2, full: 4 },
    templates: ["designer-brief"],
    example: "designer-brief",
    parallelWith: [],
    instructions: [
      "List the approved artefacts by name and version. The designer is working from those specific versions.",
      "Write the fixed list and the open list as two explicit columns. Ambiguity here is expensive.",
      "Give per-block design tasks: which blocks need real thought, which need styling within an existing pattern, which need variants.",
      "Agree review criteria up front so the internal review is a check against criteria, not a taste conversation.",
      "Talk it through rather than emailing it. Disagreement is much cheaper before work starts.",
      "In Basecamp: file the designer brief in Docs & Files → 3-Direction, tick Step 10 on the Phase 3 — Direction to-do list, and add it to the Gate 7 ticket opened at style direction before pasting the finished ticket body and ticking it.",
    ],
    pitfalls: [
      {
        risk: "Brief lists what is fixed but not what is open.",
        control:
          "A designer given only constraints produces cautious work. Say clearly where their judgement is wanted.",
      },
      {
        risk: "Designer disagrees with the structure but starts anyway.",
        control:
          "Surface it now. A structural objection raised at briefing costs a conversation; raised at design review it costs a round.",
      },
    ],
    risks: [
      "Designer introduces unapproved scope",
      "Design reviewed on taste rather than criteria",
    ],
  },

  {
    id: "visual-design",
    n: 11,
    phase: "direction",
    docPhase: "Design",
    title: "Visual design",
    summary:
      "Apply the visual system to approved structures, and review it internally before it reaches the client.",
    detail: `With structure fixed and direction agreed, design becomes what it should be: applying a coherent visual system to known content in known components.

The output is key page designs plus component styling — not every page. Repeatable templates get designed once. Pages that are the same template with different content do not need individual designs, and producing them creates an expectation of page-by-page approval that is expensive to satisfy.

Internal review comes before the client sees anything. Its job is to catch structural drift, inconsistency across components, accessibility failures and anything that has quietly created new development scope. Sending unreviewed design to a client outsources quality control to the person least equipped to do it and most expensive to disappoint.`,
    why: "Design applied to approved structure is efficient and reviewable. Internal review before client presentation prevents avoidable revision rounds.",
    owner: "designer",
    contributors: ["head-of-web"],
    approver: "head-of-web",
    inputs: [
      "Designer brief",
      "Approved wireframes",
      "Approved style direction",
      "Block inventory",
    ],
    deliverables: ["design-review-notes"],
    doneWhen: [
      "Key pages designed at desktop and mobile",
      "Component styling defined for every block in the inventory",
      "Design respects the approved structure, or every departure is logged",
      "Contrast and focus states checked against the accessibility target",
      "Internal review complete with written notes",
      "Any new scope introduced by the design is logged and assessed",
    ],
    blocks: ["client-design-review"],
    gate: 8,
    routes: ["light", "standard", "full"],
    conditions: [],
    effortBand: { light: 8, standard: 22, full: 50 },
    templates: ["design-review-notes"],
    example: "visual-design",
    parallelWith: ["local-setup"],
    instructions: [
      "Design key pages and templates. Do not design every page.",
      "Style every block in the inventory, including its variants and states.",
      "Check contrast and focus states as you go, not at QA.",
      "Run internal review against the criteria agreed in the brief.",
      "Log any departure from approved structure with its build impact before Gate 8.",
      "Only then prepare the client presentation.",
      "In Basecamp: file the internal design review notes in Docs & Files → 3-Direction, tick Step 11 on the Phase 3 — Direction to-do list, and paste the Gate 8 ticket body into the Approval Gates list before ticking it.",
    ],
    pitfalls: [
      {
        risk: "Every page designed individually.",
        control:
          "Design templates. Designing all twenty pages creates an expectation of approving all twenty.",
      },
      {
        risk: "New components appear without comment.",
        control:
          "That is scope. Log it, assess build impact, and decide deliberately whether to absorb or price it.",
      },
      {
        risk: "Design goes straight to the client.",
        control:
          "Gate 8 exists to prevent exactly this. An internal review costs an hour and routinely saves a full revision round.",
      },
    ],
    risks: [
      "Unapproved scope introduced through design",
      "Inconsistent treatment across reused components",
    ],
  },

  {
    id: "client-design-review",
    n: 12,
    phase: "direction",
    docPhase: "Design",
    title: "Client design review",
    summary:
      "Present design for stakeholder approval, and classify every piece of feedback before acting on it.",
    detail: `The design presentation is a moment of real commercial risk, and the way feedback is handled determines whether the project stays profitable.

Feedback arrives as an undifferentiated list. The discipline is to classify each item into one of three categories before responding to any of them: a correction (something departs from what was approved — fix it, no charge), a preference (a legitimate opinion within the open areas — absorb it within the revision allowance), or new scope (something that was not in the approved artefacts — log it, price it, and let the client decide).

Without that classification, all three get treated as corrections and the third category becomes free work. With it, scope creep becomes a normal commercial conversation instead of an argument or a silent absorption.

Present design in the context of the approved structure. A design shown cold invites structural feedback that was already settled three gates ago.`,
    why: "Approval before build is essential, but so is distinguishing between fixing what is wrong and being asked for something new.",
    owner: "account-management",
    contributors: ["head-of-web", "designer"],
    approver: "client",
    inputs: ["Internally approved design (Gate 8)"],
    deliverables: [],
    doneWhen: [
      "Design presented in the context of the approved outlines and wireframes",
      "All feedback collected in one consolidated list",
      "Every item classified: correction / preference / new scope",
      "New-scope items logged in the change log and priced",
      "Revision rounds counted against the allowance",
      "Written approval captured naming the artefacts and versions",
    ],
    blocks: ["build-spec"],
    gate: 9,
    routes: ["light", "standard", "full"],
    conditions: [],
    effortBand: { light: 2, standard: 5, full: 12 },
    templates: ["approval-note", "change-log"],
    example: "client-design-review",
    parallelWith: [],
    instructions: [
      "Present, do not send. Design sent without narration gets reviewed without context.",
      "Recap what was already approved before showing anything new.",
      "Collect all feedback into one list before responding to any of it — piecemeal responses invite piecemeal additions.",
      "Classify every item as correction, preference or new scope. Do this visibly with the client, not privately afterwards.",
      "Price new scope through the change log and the variation flow. It is a normal conversation.",
      "Capture approval in writing, naming artefacts and versions, via the client approval note.",
      "In Basecamp: file the approval note and any change log entries in Docs & Files → 3-Direction, tick Step 12 on the Phase 3 — Direction to-do list, and paste the Gate 9 ticket body into the Approval Gates list before ticking it.",
    ],
    pitfalls: [
      {
        risk: "Feedback arrives from several people separately over two weeks.",
        control:
          "Set a single consolidated feedback deadline in line with the approval SLA. Contradictory feedback goes back to the client to resolve, not to the designer to reconcile.",
      },
      {
        risk: "New scope absorbed to keep the client happy.",
        control:
          "It buys a week of goodwill and sets a precedent for the rest of the project. Log it and price it — you can still choose to discount it.",
      },
      {
        risk: 'Approval is "looks good, crack on".',
        control:
          "Approval names the artefacts and versions. Otherwise there is nothing to point at later.",
      },
    ],
    risks: [
      "Unlimited revision rounds",
      "Scope absorbed silently",
      "Approval never formally captured",
    ],
  },

  /* =========================== PHASE 4 — BUILD ============================= */

  {
    id: "build-spec",
    n: 13,
    phase: "build",
    docPhase: "Specify the build",
    title: "Build specification",
    summary:
      "Convert approved architecture and design into build-ready instructions, and re-baseline the estimate.",
    detail: `The build specification is the translation layer between design and code. It sets out the page and template list, the block build list with reuse decisions, the field groups, the styling responsibilities, the content entry plan, the environments and the technical risks.

Its real function is to force every remaining unknown into the open while it is still cheap. A question answered in the spec costs minutes. The same question discovered mid-build costs a context switch, a client email, and a wait.

This is also the natural point to re-baseline the estimate. At Gate 1 the estimate was based on assumptions; by Gate 10 the block list is known, the template count is known and the content plan is known. The variance between the two baselines is one of the most useful numbers the process produces — it tells you, project after project, where your estimating is systematically wrong.

The specification also now records the environment and Git workflow. That matters specifically because the goal is to have more than one person able to work a project: shared conventions are what make a second developer an asset rather than a merge conflict.`,
    why: "Approved design needs translating into templates, fields, blocks, styling responsibilities and content-entry requirements before anyone starts building.",
    owner: "head-of-web",
    contributors: ["designer", "web-developer"],
    approver: "head-of-web",
    inputs: [
      "Approved design (Gate 9)",
      "Approved block inventory",
      "Approved sitemap",
    ],
    deliverables: ["build-spec"],
    doneWhen: [
      "Page and template list is complete with blocks used per page",
      "Block build list carries a reuse / adapt / build-new action per block",
      "field groups and location rules are defined",
      "Base SCSS and theme SCSS responsibilities are separated per block",
      "Content entry plan names an owner and status per page",
      "Environments, repository and branching approach are recorded",
      "Estimate is re-baselined and variance against Gate 1 recorded",
      "Technical risks are listed with mitigations",
    ],
    blocks: ["development"],
    gate: 10,
    routes: ["standard", "full"],
    conditions: [],
    omitReason: {
      light:
        "On a light project reusing existing blocks, the block inventory plus the design is a sufficient build instruction. Write a short build checklist instead of a full specification.",
    },
    effortBand: { light: 1, standard: 5, full: 12 },
    templates: ["build-spec", "estimate-baseline"],
    example: "build-spec",
    parallelWith: ["local-setup"],
    instructions: [
      "Work block by block from the inventory. Every block gets an action, files and fields.",
      "Define field groups and their location rules explicitly rather than deciding during build.",
      "Separate base structural SCSS from project theme SCSS per block — this is what makes the library reusable next time.",
      "Write the content entry plan with owners. Content entry is real effort and is routinely forgotten in estimates.",
      "Record environments, repository and branching so a second developer can join without a briefing.",
      "Re-baseline the estimate and record the variance against Gate 1. Keep the variance — it is how estimating improves.",
      "Take to Gate 10 before writing code.",
      "In Basecamp: file the build specification and the re-baselined estimate in Docs & Files → 4-Build, tick Step 13 on the Phase 4 — Build to-do list, and paste the Gate 10 ticket body into the Approval Gates list before ticking it.",
    ],
    pitfalls: [
      {
        risk: 'Spec skipped because "the design is clear".',
        control:
          "The design is clear to whoever attended the design review. It is not clear to a developer joining in week three.",
      },
      {
        risk: "Content entry effort omitted from the estimate.",
        control:
          "Populating thirty pages is a real cost. Estimate it explicitly.",
      },
      {
        risk: "Estimate never re-baselined.",
        control:
          "Then the Gate 1 guess remains the yardstick all the way to launch, and every estimating lesson is lost.",
      },
    ],
    risks: [
      "Build decisions made ad hoc",
      "Content entry effort underestimated",
    ],
  },

  {
    id: "access-credentials",
    n: 14,
    phase: "build",
    docPhase: "Specify the build",
    title: "Access and credentials",
    isNew: true,
    newBecause:
      'Integrations and hosting were noted at discovery, but nobody owned the job of actually obtaining access before build depended on it. Missing credentials stall builds silently, and the delay never appears in the record as anything other than "the build took longer". (G17)',
    summary:
      "Obtain and verify every credential the build will depend on, before it depends on them.",
    detail: `This is a short administrative step that prevents a disproportionate amount of lost time. Hosting, DNS registrar, existing CMS, analytics, search console, CRM, email service, payment provider, any API — each one has an owner somewhere in the client's organisation, and that person is frequently not the person you have been talking to.

The pattern it prevents is familiar: build proceeds, hits an integration, requests access, waits four days, works around it, then reworks the workaround when access arrives. That time is invisible in the project record — it looks like slow development rather than a dependency nobody chased.

Requesting access early costs one email. Requesting it at the point of need costs the critical path.`,
    why: "A credential you do not have is a dependency you cannot schedule around. Getting them before build starts converts a hidden delay into a managed one.",
    owner: "account-management",
    contributors: ["head-of-web", "web-developer"],
    approver: "head-of-web",
    inputs: ["Build specification", "Technical context from discovery"],
    deliverables: [],
    doneWhen: [
      "Every external system the build touches is listed with an owner",
      "Credentials are obtained and verified working — not just promised",
      "DNS and hosting access confirmed ahead of launch, not on launch day",
      "Anything unavailable is logged as a risk with a date and a fallback",
    ],
    blocks: ["development"],
    gate: null,
    conditionalGate: "gate-c-access",
    routes: ["light", "standard", "full"],
    conditions: ["integrations", "existing-site", "transactional"],
    conditionNote:
      "Runs when there are integrations, an existing site to take over, or transactional features. Not needed for a greenfield brochure site on your own hosting.",
    effortBand: { light: 0.5, standard: 1.5, full: 4 },
    templates: [],
    example: "access-credentials",
    parallelWith: ["development"],
    instructions: [
      "List every external system from the discovery technical context and the build spec.",
      "Name the person at the client who controls each one. Often it is not your usual contact.",
      "Request access in one consolidated message rather than as each need arises.",
      'Verify each credential actually works. "They sent a password" is not access.',
      "Confirm DNS and hosting access well before launch week.",
      "Log anything unobtainable as a risk with a fallback plan and a date.",
      "In Basecamp: record the credential list and any outstanding access risks as a comment on Step 14 (Phase 4 — Build to-do list), and — where this step is triggered — paste the conditional access gate ticket body into the Approval Gates list before ticking it.",
    ],
    pitfalls: [
      {
        risk: "Access requested at the moment of need.",
        control:
          "That puts a client's IT response time directly on your critical path.",
      },
      {
        risk: "Credentials received but never tested.",
        control:
          "Test on receipt. A dead credential discovered in launch week is a launch delay.",
      },
      {
        risk: "DNS access assumed.",
        control:
          "DNS is controlled by someone nobody remembers hiring, at a registrar nobody has the login for. Confirm it early — always.",
      },
    ],
    risks: [
      "Build blocked waiting on third-party access",
      "DNS unavailable at launch",
    ],
  },

  {
    id: "development",
    n: 15,
    phase: "build",
    docPhase: "Build",
    title: "Development",
    summary:
      "Implement the approved site using the agreed WordPress stack and reusable block system.",
    detail: `With an approved specification, development is execution rather than interpretation. Templates, blocks, fields and styling are built to the spec, content is entered to the plan, and the design library is updated as reusable work emerges.

The governing principle is separation: block PHP structure and field patterns are shared and reusable; the visual system varies through theme SCSS and documented design rules. Every project built this way makes the next one faster. Every project that forks its blocks makes the next one slower.

Content entry is part of development, not an afterthought. It has an owner and a plan from the build spec, and it is where a surprising share of late-project time disappears when it has not been estimated.

Because the work packages have explicit inputs and deliverables, development is also the step where parallel working pays off: a developer can pick up a block from the build list without needing the project's history in their head.

This is the step that changes hands. Head of Web has specified the work; the Web Developer delivers it. That separation is deliberate and it is what makes the process scale — the person who defined the package is not the only person who can complete it, and the person who built something is not the person who signs it off. Each completed package goes back to Head of Web for QA at Gate 11.`,
    why: "Building against approved blocks, fields and templates produces a predictable result and a codebase that is worth reusing. Specifying the work and delivering it are separate jobs, so the project is not limited by one person's capacity.",
    owner: "web-developer",
    contributors: ["head-of-web", "designer", "copywriter"],
    approver: "head-of-web",
    inputs: [
      "Approved build specification (Gate 10)",
      "Approved design",
      "Credentials where required",
      "Content per the content matrix",
    ],
    deliverables: [],
    doneWhen: [
      "All templates and blocks from the build list are implemented",
      "field groups match the specification",
      "Base structure and project styling are separated as specified",
      "Reusable blocks are documented in the design library",
      "Content is entered per the content entry plan",
      "Site is deployed to a development environment and self-checked",
      "Each package handed back to Head of Web with its build-list row updated — implemented, self-checked, actual hours recorded",
    ],
    blocks: ["internal-qa"],
    gate: null,
    routes: ["light", "standard", "full"],
    conditions: [],
    effortBand: { light: 16, standard: 55, full: 140 },
    templates: ["build-spec", "work-package"],
    example: "development",
    parallelWith: ["copywriting"],
    instructions: [
      "Build to the spec. Where the spec is wrong, change the spec rather than diverging from it silently.",
      "Keep block PHP and field patterns reusable; vary the look through theme SCSS.",
      "Update the design library as reusable blocks are completed — not at the end, when it will not happen.",
      "Enter content against the content matrix and chase anything past its deadline immediately.",
      "Where more than one developer is contributing, hand over whole blocks from the build list rather than fragments. A block is a package; half a block is a conversation.",
      "Self-check as you build. QA should find edge cases, not missing sections.",
      "Record actual hours against the build-list estimate as you close each package. This is what makes the next estimate better.",
      "Hand each package back to Head of Web when its done-when conditions are met. Do not mark it complete and keep tinkering.",
      "In Basecamp: tick Step 15 on the Phase 4 — Build to-do list as work closes out — and bring the Card Table in here for individual block, page and fix tasks rather than tracking them on one flat to-do.",
    ],
    pitfalls: [
      {
        risk: "Blocks forked per project.",
        control:
          "Every fork is a permanent maintenance cost and a lost reuse opportunity. Adapt through styling wherever possible.",
      },
      {
        risk: 'Design library updated "later".',
        control:
          "Later does not arrive. Document each block as it is finished.",
      },
      {
        risk: "Building on top of missing content.",
        control:
          "Placeholder content becomes shipped content more often than anyone admits. Chase the content matrix.",
      },
    ],
    risks: [
      "Block library fragmentation",
      "Placeholder content reaching launch",
      "Undocumented reusable work",
    ],
  },

  /* ====================== PHASE 5 — ASSURE & LAUNCH ======================== */

  {
    id: "compliance",
    n: 16,
    phase: "assure",
    docPhase: "Review",
    title: "Compliance and data protection",
    isNew: true,
    newBecause:
      "Forms were QA-tested for whether they submit. Nothing in the process addressed privacy policy, cookie consent, where form data goes, how long it is kept, or the data-processing position between agency and client. For a UK agency handling personal data on clients' behalf that is a genuine exposure, not a nicety. (G16)",
    summary:
      "Confirm the site meets privacy, consent and data-handling obligations before it goes live.",
    detail: `Any site with a contact form collects personal data. That triggers a small set of obligations that are cheap to meet and awkward to retrofit: a privacy policy that describes what is actually happening, a lawful basis for the processing, a cookie consent mechanism that genuinely gates non-essential cookies, a known destination and retention period for form submissions, and clarity about the data-processing relationship between the agency and the client.

None of this is difficult. It is simply unowned in most website projects, and unowned obligations become the agency's problem at exactly the wrong moment.

The step is deliberately a checklist rather than legal advice. Where something is genuinely a legal question — a DPA, an international transfer, special-category data — the answer is to say so and get the client's advisers involved, not to guess.`,
    why: 'Because "the form submits correctly" is a technical test, not a compliance position, and the gap between the two is where the risk sits.',
    owner: "head-of-web",
    contributors: ["account-management", "client"],
    approver: "client",
    inputs: [
      "Built site on staging",
      "Discovery answers on forms, data and integrations",
    ],
    deliverables: [],
    doneWhen: [
      "Privacy policy exists and describes what the site actually does",
      "Cookie consent mechanism gates non-essential cookies before they are set",
      "Form submission destination and retention period are documented and agreed",
      "Analytics and tracking configuration matches what the consent banner claims",
      "Data-processing position between agency and client is clear",
      "Anything requiring legal input is flagged to the client rather than guessed",
    ],
    blocks: ["launch-prep"],
    gate: null,
    conditionalGate: "gate-c-compliance",
    routes: ["light", "standard", "full"],
    conditions: ["forms", "transactional"],
    conditionNote:
      "Runs on any site that collects personal data. A pure brochure site with no forms and no tracking can omit it — which is rare.",
    effortBand: { light: 1, standard: 2.5, full: 6 },
    templates: ["qa-checklist"],
    example: "compliance",
    parallelWith: ["internal-qa"],
    instructions: [
      "Check the privacy policy describes the site as built, not as a generic template.",
      "Test that non-essential cookies genuinely do not fire before consent. Many banners are decorative.",
      "Confirm where form submissions go, who can read them, and how long they are kept. Write it down.",
      "Check analytics configuration matches the consent banner's claims.",
      "Where a DPA or legal question arises, raise it with the client — do not answer it yourself.",
      "In Basecamp: file the compliance findings in the QA checklist in Docs & Files → 5-Assure & Launch, tick Step 16 on the Phase 5 — Assure & Launch to-do list, and — where this step is triggered — paste the conditional compliance gate ticket body into the Approval Gates list before ticking it.",
    ],
    pitfalls: [
      {
        risk: "Cookie banner installed but cookies fire regardless.",
        control:
          "Test it. A non-functional banner is worse than none — it is a documented claim that is false.",
      },
      {
        risk: "Form data destination never discussed.",
        control:
          'Ask at discovery, confirm here. "It goes to an inbox" is an answer that needs a retention period attached.',
      },
      {
        risk: "Agency gives legal advice.",
        control:
          "Flag and escalate. The checklist identifies questions; the client's advisers answer them.",
      },
    ],
    risks: [
      "Consent mechanism non-functional",
      "Personal data handled without a documented basis",
    ],
  },

  {
    id: "internal-qa",
    n: 17,
    phase: "assure",
    docPhase: "Review",
    title: "Internal QA",
    summary:
      "Verify the site against the agreed support matrix and accessibility target before the client sees it.",
    detail: `QA has a defined target, and that is what makes it finishable. The support matrix agreed at discovery says which browsers, devices and breakpoints are in scope. The accessibility target says which standard applies. Without both, "test it thoroughly" is an instruction with no end condition, and QA expands to fill whatever time remains.

The checklist covers structure against the approved sitemap, navigation, content completeness, forms, responsive behaviour against the matrix, accessibility against the target, performance basics, SEO basics and redirects.

The order matters: internal QA finishes before the client sees staging. Every defect the client finds costs an approval round and a small amount of confidence. Every defect found internally costs ten minutes.`,
    why: "A client reviewing a defective site reviews the defects instead of the work, and each round of that is expensive in both time and credibility.",
    owner: "head-of-web",
    contributors: ["web-developer", "account-management"],
    approver: "head-of-web",
    inputs: [
      "Completed development",
      "Support matrix and accessibility target from Gate 1",
    ],
    deliverables: ["qa-checklist"],
    doneWhen: [
      "Structure matches the approved sitemap",
      "Navigation works across the support matrix",
      "No placeholder or dummy content remains",
      "All forms submit and deliver to the correct destination",
      "Responsive behaviour verified on every device class in the matrix",
      "Accessibility checked against the stated target: heading order, contrast, focus states, alt text, keyboard navigation",
      "Performance basics addressed — image optimisation and obvious issues",
      "SEO basics verified: titles, descriptions, indexability, redirects",
      "Known remaining issues listed with severity",
    ],
    blocks: ["staging-review"],
    gate: 11,
    routes: ["light", "standard", "full"],
    conditions: [],
    effortBand: { light: 3, standard: 8, full: 20 },
    templates: ["qa-checklist"],
    example: "internal-qa",
    parallelWith: ["compliance"],
    instructions: [
      "Work the QA checklist tab. Do not test from memory.",
      "Test against the agreed support matrix and nothing beyond it — that is what the matrix is for.",
      "Check heading order and keyboard navigation, not just contrast. They are the checks most often skipped and most often failed.",
      "Verify redirects against the redirect map where there is one.",
      "Confirm every form delivers to its intended destination, not just that it shows a success message.",
      "List known issues with severity before opening staging, so the client sees a considered position rather than a defect hunt.",
      "In Basecamp: file the QA checklist in Docs & Files → 5-Assure & Launch, tick Step 17 on the Phase 5 — Assure & Launch to-do list, and paste the Gate 11 ticket body into the Approval Gates list before ticking it.",
    ],
    pitfalls: [
      {
        risk: "QA has no defined end point.",
        control:
          "The support matrix and accessibility target are the end point. Without them QA is unbounded.",
      },
      {
        risk: "Forms tested visually.",
        control:
          "A success message proves the JavaScript ran. Check the destination inbox or CRM record.",
      },
      {
        risk: "Client opens staging first.",
        control: "Gate 11 exists precisely to stop this.",
      },
    ],
    risks: ["Defects found by the client", "Redirects untested before launch"],
  },

  {
    id: "staging-review",
    n: 18,
    phase: "assure",
    docPhase: "Review",
    title: "Client staging review",
    summary:
      "Run a controlled client review, classify every item, and close out launch blockers.",
    detail: `Staging review is the last point at which change is cheap, and the last point at which the project's commercial boundary is tested seriously.

The same classification discipline as design review applies: each item is a correction, a preference or new scope. Corrections are fixed. Preferences are handled within the remaining allowance. New scope is logged, priced and scheduled — before launch or after it, but never absorbed by default.

Content freeze happens here, on every route. The original model reserved content freeze for full projects, but a small site being edited during final QA produces exactly the same class of problem as a large one: verified pages quietly becoming unverified.

Review is bounded by the approval SLA. An open-ended review period is how a two-week launch window becomes a two-month one.`,
    why: "Controlled feedback with classified items keeps the project closable. Uncontrolled feedback turns launch into an open-ended negotiation.",
    owner: "account-management",
    contributors: ["head-of-web", "web-developer", "client"],
    approver: "client",
    inputs: [
      "Internal QA complete (Gate 11)",
      "Staging environment available to the client",
    ],
    deliverables: [],
    doneWhen: [
      "Client feedback collected in one consolidated list within the SLA window",
      "Every item classified: correction / preference / new scope",
      "Corrections fixed and re-verified",
      "New scope logged, priced, and scheduled or deferred",
      "Launch blockers closed",
      "Content freeze agreed and in force",
      "Written approval to proceed to launch captured",
    ],
    blocks: ["launch-prep"],
    gate: 12,
    routes: ["light", "standard", "full"],
    conditions: [],
    effortBand: { light: 3, standard: 9, full: 24 },
    templates: ["approval-note", "change-log", "variation-order"],
    example: "staging-review",
    parallelWith: [],
    instructions: [
      "Give the client a defined review window in line with the approval SLA, and a single route for feedback.",
      "Ask for one consolidated list from a named person. Multiple channels produce contradictory instructions.",
      "Classify every item openly: correction, preference, new scope.",
      "Fix corrections and re-verify them. Do not mark fixed without re-testing.",
      "Price new scope through the change log and variation order. Offer it before or after launch — both are legitimate.",
      "Declare content freeze and confirm what it means: no further content edits before launch.",
      "Capture written approval at Gate 12.",
      "In Basecamp: file the approval note, change log and any variation orders in Docs & Files → 5-Assure & Launch, tick Step 18 on the Phase 5 — Assure & Launch to-do list, and paste the Gate 12 ticket body into the Approval Gates list before ticking it.",
    ],
    pitfalls: [
      {
        risk: "Review drifts because no window was set.",
        control:
          "The SLA agreed at Gate 1 applies here more than anywhere. Use it.",
      },
      {
        risk: "Feedback arrives from five stakeholders with conflicting views.",
        control:
          "Contradictions go back to the client to resolve. It is not the agency's job to adjudicate between a client's own stakeholders.",
      },
      {
        risk: "Late content edits during QA.",
        control: "Content freeze. On every route, not just large ones.",
      },
    ],
    risks: [
      "Open-ended review period",
      "Late scope absorbed to hit a launch date",
    ],
  },

  {
    id: "launch-prep",
    n: 19,
    phase: "assure",
    docPhase: "Launch",
    title: "Launch preparation",
    summary:
      "Prepare deployment, backups, redirects, DNS and rollback — and agree the warranty boundary.",
    detail: `Launch preparation is mostly a matter of having done the boring things in advance. Backup taken, redirects in place and tested, DNS access confirmed and TTL lowered, hosting ready, content frozen, rollback plan written and understood.

The addition here is agreeing the defect warranty window before launch rather than discovering its absence afterwards. Once a site is live, requests arrive continuously and there is no natural boundary between fixing a defect and making a change. Stating the boundary in advance — defects fixed free within the window, changes quoted whether inside it or outside — converts an awkward conversation into a policy that was agreed when everyone was still pleased with each other.

Launch is scheduled, not improvised. A launch nobody planned is a launch somebody is doing at 6pm on a Friday.`,
    why: "Every launch problem is either something not prepared or something not tested. Preparation is the entire job.",
    owner: "head-of-web",
    contributors: ["web-developer", "account-management", "seo-analytics"],
    approver: "client",
    inputs: [
      "Staging approved (Gate 12)",
      "Compliance cleared where applicable",
      "DNS and hosting access",
    ],
    deliverables: ["launch-checklist"],
    doneWhen: [
      "Full backup taken and restore verified",
      "Redirect map implemented and tested where there is an existing site",
      "DNS access confirmed and TTL reduced ahead of the change",
      "Hosting environment ready and tested",
      "Final content freeze confirmed",
      "Rollback plan written and understood by whoever is launching",
      "Launch window scheduled — deliberately not late on a Friday",
      "Warranty window agreed and communicated to the client in writing",
    ],
    blocks: ["launch-closure"],
    gate: 13,
    routes: ["light", "standard", "full"],
    conditions: [],
    effortBand: { light: 2, standard: 5, full: 14 },
    templates: ["launch-checklist"],
    example: "launch-prep",
    parallelWith: [],
    instructions: [
      "Take a backup and verify it restores. An unverified backup is a hope.",
      "Implement and test redirects before the switch, not after.",
      "Reduce DNS TTL a day or two ahead so a rollback is fast.",
      "Write the rollback plan down and make sure the person launching has read it.",
      "Schedule the launch inside working hours with people available.",
      "Confirm the warranty window in writing at Gate 13: what is covered, for how long, and what is quoted.",
      "In Basecamp: file the launch checklist in Docs & Files → 5-Assure & Launch, tick Step 19 on the Phase 5 — Assure & Launch to-do list, and paste the Gate 13 ticket body into the Approval Gates list before ticking it.",
    ],
    pitfalls: [
      {
        risk: "Redirects written but never tested.",
        control: "Test them against the real old URL list from the audit.",
      },
      {
        risk: "DNS access discovered missing on launch day.",
        control: "Confirmed at the access step, re-confirmed here.",
      },
      {
        risk: "Warranty never defined.",
        control:
          "Then every post-launch request is arguably free. Define it before launch, not after the first request.",
      },
    ],
    risks: [
      "Traffic loss from missing redirects",
      "No rollback route",
      "Open-ended free post-launch work",
    ],
  },

  {
    id: "launch-closure",
    n: 20,
    phase: "assure",
    docPhase: "Launch",
    title: "Launch and closure",
    summary:
      "Publish, verify in production, hand over, close the project formally, and feed the learning back.",
    detail: `Deployment, then verification in production — forms, analytics, search console, redirects, performance and a walk of the key journeys. A launch is not complete when DNS propagates; it is complete when the site has been checked live.

Closure is the part most often left undone, and it carries three things worth having. First, the commercial boundary: the warranty window starts, and anything beyond defect fixing is quoted. Second, the handover: notes, credentials returned, design library updated, reusable blocks committed. Third, the learning: the retrospective, the estimate variance, and the block library improvements.

That last part is what makes the process compound. A project that closes properly makes the next project cheaper. A project that trails off into indefinite small favours makes the next one harder to price, because the real cost of the last one was never known.

Closure is also the natural moment to talk about ongoing care. The client is pleased, the site is live, and the value of maintenance is obvious. Six weeks later it is a cold conversation.`,
    why: "Formal closure sets the commercial boundary, captures reusable value, and turns one project's lessons into the next project's estimate.",
    owner: "head-of-web",
    contributors: ["web-developer", "account-management", "seo-analytics"],
    approver: "client",
    inputs: ["Launch approved (Gate 13)"],
    deliverables: ["handover-notes"],
    doneWhen: [
      "Site deployed and verified live: forms, analytics, search console, redirects, key journeys",
      "Post-launch QA complete",
      "Client notified and handover notes delivered",
      "Decision log and change log finalised",
      "Reusable blocks committed and design library updated",
      "Warranty start date recorded and communicated",
      "Estimate variance recorded: baseline vs re-baseline vs actual",
      "Retrospective held and improvements routed into the templates and block library",
      "Care plan conversation held",
    ],
    blocks: [],
    gate: 14,
    routes: ["light", "standard", "full"],
    conditions: [],
    effortBand: { light: 2, standard: 6, full: 16 },
    templates: ["handover-notes", "gate-ticket"],
    example: "launch-closure",
    parallelWith: [],
    instructions: [
      "Deploy inside a scheduled window with the rollback plan to hand.",
      "Verify in production: submit a real form, confirm analytics fires, spot-check redirects, walk the key journeys.",
      "Submit the new sitemap to search console and monitor for crawl errors over the following days.",
      "Deliver handover notes and confirm the warranty start date in writing.",
      "Record the estimate variance. Baseline, re-baseline, actual. This number is worth more than the project.",
      "Hold a short retrospective and route the outcomes into the templates and block library — with an owner and a date.",
      "Have the care plan conversation now, while the work is fresh.",
      "In Basecamp: file the handover notes in Docs & Files → 5-Assure & Launch, tick Step 20 to close the Phase 5 — Assure & Launch to-do list, then paste the Gate 14 ticket body into the Approval Gates list and tick it — this is the last gate, so ticking it closes the project.",
    ],
    pitfalls: [
      {
        risk: "Project never formally closes.",
        control:
          "Usually a symptom of exclusions never written down. Close it formally and quote the remainder.",
      },
      {
        risk: "Retrospective held but nothing changes.",
        control:
          "Each outcome gets an owner and a date, or it was a conversation rather than a retrospective.",
      },
      {
        risk: "Reusable blocks left in the project repo.",
        control:
          "The reuse benefit only exists if the library is actually updated. Do it at closure.",
      },
      {
        risk: "Care plan raised weeks later.",
        control: "Goodwill decays fast. Have the conversation at handover.",
      },
    ],
    risks: [
      "Indefinite unpaid post-launch work",
      "Reusable value left behind in one project",
      "Estimating never improves",
    ],
  },
];

export const stepById = Object.fromEntries(steps.map((s) => [s.id, s]));

export function stepsForPhase(phaseId) {
  return steps.filter((s) => s.phase === phaseId);
}

export function stepsForRoute(routeId) {
  return steps.filter((s) => s.routes.includes(routeId));
}

export function totalEffort(routeId, includedIds = null) {
  return steps
    .filter((s) =>
      includedIds ? includedIds.includes(s.id) : s.routes.includes(routeId),
    )
    .reduce((sum, s) => sum + (s.effortBand[routeId] || 0), 0);
}
