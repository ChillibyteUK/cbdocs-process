/* ---------------------------------------------------------------------------
   worked-example.js — one project, threaded through every step.

   Halcyon Thermal is invented. It was chosen deliberately: a mid-size B2B
   firm replacing an established site. That combination triggers the
   conditional SEO and migration work on a *standard* route, which is the
   clearest demonstration that inclusion follows risk rather than project size.

   Every artefact below is the same project at a later stage. The sitemap
   produces the outlines; the outlines produce the blocks; the blocks produce
   the build list. Read end to end it is one project, not twenty samples.

   Block types the renderer understands:
     { type: 'prose',  text }
     { type: 'fields', items: [[label, value], ...] }
     { type: 'table',  columns: [], rows: [[]] }
     { type: 'list',   items: [], style: 'check' | 'cross' | 'plain' }
--------------------------------------------------------------------------- */

export const project = {
  name: 'Halcyon Thermal',
  sector: 'B2B industrial process heating',
  oneLine: 'Replacing a twelve-year-old site for a UK manufacturer of industrial process heating and heat-transfer equipment.',
  route: 'standard',
  conditions: ['existing-site', 'forms', 'high-seo-risk', 'client-writes'],
  facts: [
    ['Project type', 'Redesign replacing an existing live site'],
    ['Pages', '16 (7 unique, 9 across 3 repeatable templates)'],
    ['Service lines', 'Process heaters · Heat exchangers · Service and maintenance'],
    ['Existing site', '84 indexed URLs, ~2,400 organic sessions/month'],
    ['Integrations', 'HubSpot forms'],
    ['Languages', 'UK English only'],
    ['Content', 'Client writes technical copy; agency edits'],
    ['Selected route', 'Standard — with the existing-site conditionals forced on']
  ],
  whyThisExample: 'A sixteen-page standard-route project would, under a purely size-based model, skip the current-state audit and redirect map entirely — both were full-route artefacts. But Halcyon has twelve years of domain authority and 2,400 monthly organic sessions, most of it landing on deep technical pages. Losing those URLs would cost more than the project is worth. That is why the process triggers audit and migration work from the existence of a live site, not from the page count.'
};

export const examples = {

  'sales-handover': {
    title: 'Sales handover note',
    intro: 'Twenty minutes of writing at the point of sale. Note that the exclusions list is longer than the inclusions list — that is normal, and it is where the value is.',
    blocks: [
      { type: 'fields', items: [
        ['Client', 'Halcyon Thermal Ltd'],
        ['Sold by', 'New business'],
        ['Handover date', '14 April'],
        ['Contract value', '£18,400 + VAT'],
        ['Payment structure', '40% on order, 30% at design approval, 30% on launch'],
        ['Target launch', 'End of August (soft — tied to a trade show, not contractual)'],
        ['Route sold as', 'Standard']
      ]},
      { type: 'prose', text: 'What was sold' },
      { type: 'list', style: 'check', items: [
        'Full redesign and rebuild of halcyonthermal.co.uk, 16 pages',
        'Three service-line sections with a repeatable service detail template',
        'Case study template and six initial case studies',
        'Technical downloads area with gated PDF datasheets',
        'HubSpot form integration on enquiry and download forms',
        'Redirect mapping from the existing site',
        'Two design concepts, two rounds of revision on the chosen concept',
        'One round of consolidated feedback at staging'
      ]},
      { type: 'prose', text: 'Explicitly excluded' },
      { type: 'list', style: 'cross', items: [
        'Copywriting — client writes all technical copy, agency edits only',
        'Photography and videography — client supplies all imagery',
        'Ongoing SEO retainer or content marketing',
        'Translation or any additional language',
        'Product configurator or specification tool (discussed, deferred to phase 2)',
        'Customer login area or order tracking',
        'Migration of the legacy PDF library beyond the 40 named datasheets',
        'Hosting and maintenance beyond the 30-day warranty window'
      ]},
      { type: 'fields', items: [
        ['Verbal commitments made during sale', '"We can probably look at the configurator later" — captured here as an explicit exclusion and phase-2 candidate, not a commitment.'],
        ['Known commercial risk', 'Client mentioned a possible fourth service line launching in the autumn. Not in scope. Flagged to discovery.'],
        ['Delivery accepted by', 'Head of Web, 15 April'],
        ['Gap raised on acceptance', 'Six case studies assumes case study content exists. It does not. Raised as a risk at discovery rather than absorbed.']
      ]}
    ],
    commentary: 'The configurator line is the one that earns its keep. It was a throwaway remark in a sales meeting. Written down as an exclusion, it costs nothing. Left unwritten, it reappears in week nine as "we always assumed that was included".'
  },

  discovery: {
    title: 'Discovery summary (extract)',
    intro: 'The full template runs to several pages. This extract shows the sections that most often get answered vaguely — and what a usable answer looks like.',
    blocks: [
      { type: 'fields', items: [
        ['Discovery date', '28 April'],
        ['Discovery lead', 'Head of Web'],
        ['Client stakeholder representative', 'Technical Director'],
        ['Project route', 'Standard, with existing-site conditionals'],
        ['Route rationale', '16 pages across 3 repeatable templates, modular block-based build, one integration. Complexity is normal; risk is in the migration.']
      ]},
      { type: 'prose', text: 'Business context and goals' },
      { type: 'list', style: 'plain', items: [
        'Goal 1 — Generate qualified enquiries from specifying engineers, not general enquiries from procurement. Measured by enquiry quality, not volume.',
        'Goal 2 — Establish credibility against two larger German competitors who currently look more substantial online.',
        'Goal 3 — Reduce sales-team time spent emailing datasheets by making the technical library self-serve.'
      ]},
      { type: 'prose', text: 'Audiences' },
      { type: 'table', columns: ['Audience', 'Needs', 'Concern', 'Conversion route'], rows: [
        ['Specifying engineer', 'Technical specifications, dimensions, compliance data', 'Will it meet the spec and standards?', 'Download datasheet → enquiry'],
        ['Plant / operations manager', 'Reliability, lead time, service coverage', 'What happens when it fails at 3am?', 'Service page → enquiry'],
        ['Procurement', 'Credibility, references, commercial terms', 'Is this firm substantial enough to rely on?', 'Case studies → enquiry']
      ]},
      { type: 'prose', text: 'Content ownership — assigned per section, not "the client"' },
      { type: 'table', columns: ['Content', 'Owner', 'Status'], rows: [
        ['Service line copy (3 pages)', 'Client — Technical Director', 'To be written'],
        ['Case studies (6)', 'Client — Sales Manager', 'Not started, risk flagged'],
        ['Datasheets (40 PDFs)', 'Client — Engineering', 'Exists, needs re-export'],
        ['Home and About copy', 'Client, agency edits', 'To be written'],
        ['Photography', 'Client', 'Partial — factory shots exist, no product photography']
      ]},
      { type: 'prose', text: 'Guardrails agreed at Gate 1' },
      { type: 'fields', items: [
        ['Named client approver', 'Technical Director. Sole approver. Others may comment; only he approves.'],
        ['Approval response window', '5 working days. Silence past the window pauses the project and moves the launch date.'],
        ['Support matrix', 'Latest 2 versions of Chrome, Safari, Edge, Firefox. iOS Safari and Android Chrome. Breakpoints 375 / 768 / 1280. No IE, no legacy Android.'],
        ['Accessibility target', 'WCAG 2.2 AA'],
        ['Revision allowance', '2 concepts, 2 revision rounds on the chosen concept, 1 consolidated staging round'],
        ['Estimate baseline', '167 hrs core (including the audit, redirect and compliance work forced on by the existing site) + 20% standard-route contingency = 200 hrs. Produced by the spec builder — load this project in it to reproduce the figure.']
      ]},
      { type: 'prose', text: 'Risks and assumptions raised' },
      { type: 'table', columns: ['ID', 'Type', 'Item', 'Impact if realised', 'Owner', 'Mitigation'], rows: [
        ['RA-001', 'Risk', 'Case study content does not exist and Sales has no time to write it', 'Six template pages with no content; launch delayed or pages dropped', 'Account Management', 'Content deadline at Gate 4. Reduce to 3 case studies if not met.'],
        ['RA-002', 'Risk', 'Existing site has 12 years of authority; migration could lose organic traffic', 'Direct revenue impact, attributed to the agency', 'SEO / Analytics', 'Current-state audit and redirect map forced on despite standard route'],
        ['RA-003', 'Assumption', 'Client supplies usable product photography', 'Design quality compromised; stock imagery undermines credibility goal', 'Client', 'Confirm at Gate 4. Budget for a photography day if not.'],
        ['RA-004', 'Risk', 'Fourth service line launches during the project', 'New page, new template variant, new copy — out of scope', 'Head of Web', 'Explicitly excluded at Gate 0. Handle as a variation if raised.']
      ]}
    ],
    commentary: 'Compare RA-001 with how it would normally be recorded: "client to provide case studies". Naming the owner, the impact and the fallback converts it from an aspiration into something that can actually be managed at Gate 4.'
  },

  'internal-brief': {
    title: 'Internal brief — principles extract',
    intro: 'The brief converts discovery into a position. Principles are the part that does the most work later, so they are written to be specific enough to settle an argument.',
    blocks: [
      { type: 'prose', text: 'Design principles' },
      { type: 'list', style: 'plain', items: [
        '1. Legible to an engineer skimming on a phone in a plant room. Technical content must survive small screens and poor light — high contrast, generous type, no thin greys on white.',
        '2. Specification over sentiment. Where a competitor shows a lifestyle photograph, we show a dimension table. Credibility here comes from data density, not atmosphere.',
        '3. Substantial, not corporate. The client\'s fear is looking smaller than their German competitors. That is solved with depth of content and confident structure, not with stock imagery of handshakes.',
        '4. Every technical page ends with a way to get the datasheet. The download is the conversion, not the contact form.'
      ]},
      { type: 'prose', text: 'Technical principles' },
      { type: 'list', style: 'plain', items: [
        'Reuse existing library blocks wherever the structure matches; vary appearance through theme SCSS rather than forking block PHP.',
        'No new plugins without a logged decision. HubSpot is the only third-party dependency approved.',
        'Gated downloads use a single reusable pattern, not per-page implementations.',
        'Performance posture: technical pages carry tables and PDFs, so image weight is the budget to protect.'
      ]},
      { type: 'prose', text: 'Exclusions carried forward from Gate 0' },
      { type: 'list', style: 'cross', items: [
        'Copywriting, photography, translation',
        'Product configurator — phase 2 candidate',
        'Customer login / order tracking',
        'Fourth service line, if it launches during the project'
      ]}
    ],
    commentary: 'Principle 2 settled three separate arguments later in the project without anyone needing to escalate: the hero treatment, whether to use stock imagery on service pages, and how dense the specification tables should be.'
  },

  'current-state-audit': {
    title: 'Current-state and SEO baseline',
    intro: 'This is the artefact that a size-based model would have skipped. Halcyon is a 16-page standard-route project — but with twelve years of domain history behind it.',
    blocks: [
      { type: 'fields', items: [
        ['Baseline captured', '2 May — before any structural change'],
        ['Indexed URLs', '84'],
        ['Organic sessions', '~2,400/month, 12-month average'],
        ['Organic share of enquiries', '61%'],
        ['Referring domains', '190, including 4 trade bodies and 2 university engineering departments']
      ]},
      { type: 'prose', text: 'Top landing pages by organic traffic — the URLs that must not break' },
      { type: 'table', columns: ['URL', 'Sessions/mo', 'Note', 'Destination'], rows: [
        ['/products/thermal-fluid-heaters/', '410', 'Ranks p1 for a high-intent term', '/process-heaters/thermal-fluid/'],
        ['/products/shell-tube-heat-exchangers/', '295', 'Ranks p1', '/heat-exchangers/shell-and-tube/'],
        ['/downloads/', '260', 'Datasheet library entry point', '/technical-library/'],
        ['/about/accreditations/', '180', 'Linked from 2 trade bodies', '/about/accreditations/ (unchanged)'],
        ['/products/electric-process-heaters/', '155', 'Ranks p2', '/process-heaters/electric/'],
        ['/blog/thermal-fluid-degradation/', '140', 'Linked from a university page', '/insights/thermal-fluid-degradation/']
      ]},
      { type: 'prose', text: 'Content decisions' },
      { type: 'table', columns: ['Decision', 'Count', 'Note'], rows: [
        ['Keep and migrate', '18', 'Core product and about pages'],
        ['Rewrite', '11', 'Thin service pages, outdated technical claims'],
        ['Consolidate', '32', 'Near-duplicate product variant pages collapsing into 3 templated pages'],
        ['Retire with redirect', '19', 'Old news posts, dead campaign pages'],
        ['Retire with 410', '4', 'Genuinely gone — discontinued product lines']
      ]},
      { type: 'prose', text: 'Load-bearing items found by walking the site' },
      { type: 'list', style: 'plain', items: [
        '40 datasheet PDFs at /downloads/*.pdf — several linked directly from customer intranets. PDF URLs must be preserved or redirected, not just the pages that link to them.',
        'A /quote-request/ form feeding an unmonitored inbox nobody knew was still live. 30 submissions in the last year, unanswered.',
        'A printed brochure from 2023 carries halcyonthermal.co.uk/hx — a vanity URL that must keep working.'
      ]}
    ],
    commentary: 'The third item is the sort of thing only a manual walk finds. A vanity URL on printed material has no traffic in analytics and no inbound links, so every automated audit misses it — and breaking it makes physical marketing material wrong.'
  },

  sitemap: {
    title: 'Sitemap and page inventory',
    intro: 'Sixteen pages, but only three of them are unique templates plus four one-offs. That distinction — not the page count — is what drives design and build effort.',
    blocks: [
      { type: 'table', columns: ['Page', 'URL', 'Parent', 'Purpose', 'Template', 'Nav', 'Owner'], rows: [
        ['Home', '/', '—', 'Establish substance and route three audiences', 'Unique', 'Main', 'Client + agency edit'],
        ['Process heaters', '/process-heaters/', '—', 'Service line overview', 'Service landing', 'Main', 'Client'],
        ['— Thermal fluid', '/process-heaters/thermal-fluid/', 'Process heaters', 'Convert specifying engineers', 'Service detail', 'Subnav', 'Client'],
        ['— Electric', '/process-heaters/electric/', 'Process heaters', 'Convert specifying engineers', 'Service detail', 'Subnav', 'Client'],
        ['Heat exchangers', '/heat-exchangers/', '—', 'Service line overview', 'Service landing', 'Main', 'Client'],
        ['— Shell and tube', '/heat-exchangers/shell-and-tube/', 'Heat exchangers', 'Convert specifying engineers', 'Service detail', 'Subnav', 'Client'],
        ['— Plate', '/heat-exchangers/plate/', 'Heat exchangers', 'Convert specifying engineers', 'Service detail', 'Subnav', 'Client'],
        ['Service & maintenance', '/service/', '—', 'Reassure operations managers', 'Service landing', 'Main', 'Client'],
        ['Technical library', '/technical-library/', '—', 'Self-serve datasheets — primary conversion', 'Unique', 'Main', 'Client'],
        ['Case studies', '/case-studies/', '—', 'Credibility for procurement', 'Index', 'Main', 'Client'],
        ['— Case study detail ×6', '/case-studies/{slug}/', 'Case studies', 'Evidence of comparable work', 'Repeatable', 'Body links', 'Client — at risk'],
        ['About', '/about/', '—', 'Substance and history', 'Standard', 'Main', 'Client'],
        ['— Accreditations', '/about/accreditations/', 'About', 'Compliance credibility; protects inbound links', 'Standard', 'Subnav', 'Client'],
        ['Insights', '/insights/', '—', 'Technical articles; protects existing links', 'Index', 'Footer', 'Client'],
        ['Contact', '/contact/', '—', 'Enquiry', 'Unique', 'Main', 'Agency'],
        ['Privacy / cookies', '/privacy/', '—', 'Compliance', 'Standard', 'Footer', 'Client legal']
      ]},
      { type: 'prose', text: 'Deliberately not in the navigation' },
      { type: 'list', style: 'cross', items: [
        'Insights — footer only. It exists to preserve link equity from the old blog, not to be a content marketing programme.',
        'Individual case studies — reached from the index and from contextual links on service detail pages.',
        'No "Products" top-level item. The old site used it; the new structure routes by problem type instead, which matches how specifying engineers search.'
      ]}
    ],
    commentary: 'Sixteen rows, but the build is 7 unique layouts and 3 repeatable templates. Estimating from "16 pages" and estimating from "10 layouts" produce very different numbers, and only one of them is right.'
  },

  'page-outlines': {
    title: 'Page outline — Service detail template',
    intro: 'One outline covers all four service detail pages because they share a template. This is the outline that produced the block inventory in the next step.',
    blocks: [
      { type: 'fields', items: [
        ['Page', 'Service detail (template — covers 4 pages)'],
        ['Example URL', '/process-heaters/thermal-fluid/'],
        ['Primary audience', 'Specifying engineer'],
        ['Business purpose', 'Convert technical evaluation into a datasheet download, then an enquiry'],
        ['User purpose', 'Determine whether this product meets my specification'],
        ['Primary CTA', 'Download datasheet'],
        ['Secondary CTA', 'Discuss your application'],
        ['Template type', 'Repeatable'],
        ['Content owner', 'Client — Technical Director'],
        ['Content deadline', '6 June']
      ]},
      { type: 'table', columns: ['Section', 'Purpose', 'Length', 'Media', 'Likely block'], rows: [
        ['H1 + intro', 'Name the product and the application it solves in one screen', '40–60 words', 'Product image', 'Hero — technical variant'],
        ['Key specifications', 'Let an engineer disqualify or shortlist within 20 seconds', 'Table, 6–10 rows', '—', 'Spec table (NEW)'],
        ['How it works', 'Establish technical competence', '150–200 words', 'Diagram', 'Text + image split'],
        ['Applications', 'Help the reader recognise their own situation', '4–6 items, 25 words each', 'Icons', 'Card grid'],
        ['Compliance and standards', 'Answer the procurement objection', '80–120 words', 'Accreditation logos', 'Text + logo strip'],
        ['Datasheet download', 'The primary conversion', '30 words', '—', 'Gated download (NEW)'],
        ['Related case study', 'Evidence', 'Auto-pulled', 'Case study image', 'Case study teaser'],
        ['FAQs', 'Absorb the objections that reach the sales team by phone', '5 questions', '—', 'Accordion'],
        ['Enquiry CTA', 'Secondary conversion for those not ready to download', '25 words', '—', 'CTA band']
      ]},
      { type: 'prose', text: 'FAQs — sourced from what the sales team is actually asked' },
      { type: 'list', style: 'plain', items: [
        'What are typical lead times? — Sales Manager to supply current figures.',
        'Can it be specified to ATEX? — Technical Director.',
        'What maintenance does it need? — links to /service/.',
        'Can you retrofit to an existing system? — Technical Director.',
        'What is the temperature range? — points back to the spec table.'
      ]},
      { type: 'prose', text: 'Open decisions logged rather than assumed' },
      { type: 'fields', items: [
        ['DEC-004', 'Should the datasheet be gated behind a form, or open? Gating produces leads; open produces goodwill and possibly more links. Options weighed; gated selected, with the spec table left ungated so engineers can still qualify without submitting.']
      ]}
    ],
    commentary: 'Note the section-level word counts. "150–200 words" prevents both a one-line section that looks unfinished and a 600-word essay that breaks the design. It also tells the client exactly how much writing they have committed to.'
  },

  'block-identification': {
    title: 'Block inventory',
    intro: 'Every section from every outline, collapsed. Thirty-one distinct sections across the sitemap reduced to fourteen blocks — eight reused as-is, four adapted, two genuinely new.',
    blocks: [
      { type: 'table', columns: ['Block', 'Used on', 'Decision', 'Design needed', 'Build impact'], rows: [
        ['Hero — technical variant', 'All service pages', 'Adapt existing', 'Yes — needs to carry a product image and a spec summary', 'Medium'],
        ['Spec table', 'Service detail ×4', 'Build new', 'Yes', 'Medium'],
        ['Gated download', 'Service detail ×4, Technical library', 'Build new', 'Yes', 'High — HubSpot integration'],
        ['Text + image split', 'Most pages', 'Reuse', 'No', 'Low'],
        ['Card grid', 'Home, service landings, applications', 'Adapt existing', 'Minor — needs an icon variant', 'Low'],
        ['Logo strip', 'Compliance sections, home', 'Reuse', 'No', 'Low'],
        ['Case study teaser', 'Service detail, home', 'Adapt existing', 'Minor', 'Low'],
        ['Accordion', 'FAQs on service pages', 'Reuse', 'No', 'Low'],
        ['CTA band', 'Every page', 'Reuse', 'No', 'Low'],
        ['Stat row', 'Home, about', 'Reuse', 'No', 'Low'],
        ['Index listing', 'Case studies, insights', 'Reuse', 'No', 'Low'],
        ['Rich text', 'About, privacy, insights detail', 'Reuse', 'No', 'Low'],
        ['Contact block', 'Contact', 'Adapt existing', 'Minor — HubSpot embed', 'Medium'],
        ['Subnav', 'Service sections', 'Reuse', 'No', 'Low']
      ]},
      { type: 'prose', text: 'Decision log entries generated here' },
      { type: 'fields', items: [
        ['DEC-006', 'Spec table built as a reusable block with an repeater field rather than as freeform table content. Reason: four pages need it now and any future product page will. Reversal cost: medium.'],
        ['DEC-007', 'Gated download built as one reusable pattern rather than per-page implementations. Reason: five placements now, more later; a single HubSpot integration point is easier to maintain and to make compliant.']
      ]},
      { type: 'prose', text: 'What this told us before design started' },
      { type: 'list', style: 'plain', items: [
        'Only two genuinely new blocks — so the build is largely assembly, and the estimate can be held.',
        'The gated download is the highest-risk item and the only integration. It gets built first, not last.',
        'The designer needs to think hard about three blocks. The other eleven need styling within existing patterns — which is a much smaller design brief than "design a website".'
      ]}
    ],
    commentary: 'Thirty-one sections into fourteen blocks is the whole value of this step. Without it, the designer would have produced thirty-one bespoke sections, and the build estimate would have roughly tripled between design approval and launch.'
  },

  wireframes: {
    title: 'Wireframe notes — Service detail template',
    intro: 'Wireframes themselves are visual artefacts. What travels well in a written guide is the accompanying notes, which is where the structural decisions are actually recorded.',
    blocks: [
      { type: 'prose', text: 'Desktop structure, top to bottom' },
      { type: 'list', style: 'plain', items: [
        'Hero — product image right, H1 and 40-word intro left, spec summary (4 key figures) beneath the intro. Datasheet CTA visible without scrolling.',
        'Spec table — full width, sticky first column so row labels stay visible while scrolling wide tables horizontally.',
        'How it works — text left, diagram right.',
        'Applications — 3-column card grid with icons.',
        'Compliance — short text with a logo strip beneath.',
        'Gated download — visually distinct band, the strongest CTA on the page.',
        'Related case study — single teaser, image left.',
        'FAQs — accordion, first item open.',
        'CTA band.'
      ]},
      { type: 'prose', text: 'Responsive decisions agreed at wireframe stage' },
      { type: 'table', columns: ['Block', 'Tablet', 'Mobile'], rows: [
        ['Hero', 'Image drops below text', 'Image below text; spec summary becomes a 2×2 grid'],
        ['Spec table', 'Horizontal scroll within the block', 'Horizontal scroll, sticky first column retained — deliberately not stacked into cards, because engineers compare across columns'],
        ['Text + image split', 'Stacks, image below', 'Stacks, image below'],
        ['Card grid', '2 columns', '1 column'],
        ['Logo strip', '3 per row', '2 per row'],
        ['Accordion', 'Unchanged', 'Unchanged, all closed by default']
      ]},
      { type: 'prose', text: 'Open decisions carried on the wireframe rather than silently resolved' },
      { type: 'list', style: 'plain', items: [
        'Does the spec summary in the hero duplicate the spec table, or pull its top four rows? Resolved at design: pulls the top four, marked in the block framework.',
        'Should FAQs sit above or below the download CTA? Resolved: below, so the download is reached first.'
      ]}
    ],
    commentary: 'The spec table mobile decision is the important one. The obvious responsive pattern is to stack a table into cards — but engineers use these tables to compare values across columns, and stacking destroys that. Agreeing it at wireframe stage cost a five-minute conversation. Discovering it at QA would have cost a rebuild.'
  },

  'style-direction': {
    title: 'Style direction',
    intro: 'Colour is defined by role rather than by value, so the direction survives "can we try it in blue" without being renegotiated.',
    blocks: [
      { type: 'prose', text: 'Visual principles' },
      { type: 'list', style: 'plain', items: [
        'Density reads as competence. Where a consumer site would use whitespace, we use structured information. The design must make a spec table look like the point of the page, not an inconvenience.',
        'Restrained palette, confident structure. The credibility problem is solved by looking organised, not by looking colourful.',
        'Photography is industrial and real. Client factory and installation photography only. No stock — it actively undermines the substance goal.'
      ]},
      { type: 'table', columns: ['Colour role', 'Direction', 'Contrast expectation'], rows: [
        ['Primary action', 'Existing brand orange, darkened for text use', '≥4.5:1 on white for any text; brand value retained for fills'],
        ['Emphasis', 'Deep industrial blue', 'Used for headings and structural bands'],
        ['Recessive surface', 'Warm off-white and a light grey', 'Distinguishes spec tables from body content'],
        ['Semantic', 'Green for compliance/accreditation marks only', 'Never used decoratively']
      ]},
      { type: 'table', columns: ['Type role', 'Direction', 'Requirement'], rows: [
        ['Display', 'Existing brand sans, tight tracking', 'Must hold at 375px without breaking product names'],
        ['Body', 'Same family, generous line height', '17px minimum on mobile — engineers read this on site'],
        ['UI / table', 'Tabular figures required', 'Non-negotiable: spec tables must align numerically']
      ]},
      { type: 'fields', items: [
        ['Accessibility target restated visually', 'WCAG 2.2 AA. All text ≥4.5:1. Focus states visible on every interactive element including accordion headers and table scroll regions.'],
        ['References to learn from', 'Two named competitors\' technical library structure; one industrial brand\'s specification presentation.'],
        ['References to avoid', 'The client\'s own 2019 brochure aesthetic, which the Technical Director described as "trying too hard". Also: any layout that hides specifications behind tabs.']
      ]}
    ],
    commentary: 'The "avoid" list saved a full concept. The designer\'s instinct was to tab the specification sections to reduce page length — a reasonable idea that the client had explicitly rejected in a previous project. Ten words in the brief prevented a wasted round.'
  },

  'designer-brief': {
    title: 'Designer brief — fixed and open',
    intro: 'The two-column split is the whole point of this document. It tells the designer where their judgement is wanted and where the decision has already been made and approved.',
    blocks: [
      { type: 'fields', items: [
        ['Approved artefacts the design must work from', 'Discovery summary v1.0 · Sitemap v1.0 · Page outlines v1.0 · Block inventory v1.0 · Wireframes v1.1 · Style direction v1.0'],
        ['Design route', 'Standard — 2 concepts, 2 revision rounds on the chosen concept']
      ]},
      { type: 'table', columns: ['Fixed — approved, do not change', 'Open — your judgement is wanted'], rows: [
        ['Sitemap and URL structure', 'Visual language and overall expression'],
        ['Page section order per the outlines', 'Colour refinement within the agreed roles'],
        ['The 14-block model', 'Typographic scale and hierarchy'],
        ['Content hierarchy and heading levels', 'Image treatment and cropping'],
        ['Spec table stays a table on mobile', 'Spacing, rhythm and density'],
        ['Datasheet download is the primary CTA', 'Component polish and states'],
        ['WCAG 2.2 AA and the support matrix', 'Interaction and motion detail']
      ]},
      { type: 'prose', text: 'Per-block design tasks' },
      { type: 'table', columns: ['Block', 'Task', 'Constraint'], rows: [
        ['Spec table', 'Real design thought needed', 'Must read at 375px with a sticky first column; tabular figures'],
        ['Gated download', 'Real design thought needed', 'Must feel like a benefit, not a toll gate'],
        ['Hero — technical variant', 'Real design thought needed', 'Carries image, intro and 4 spec figures without feeling crowded'],
        ['Card grid, case teaser, contact', 'Styling within existing patterns', 'Icon variant needed for card grid'],
        ['Remaining 8 blocks', 'Apply the system', 'No structural change']
      ]},
      { type: 'prose', text: 'Review criteria, agreed before work started' },
      { type: 'list', style: 'check', items: [
        'Does it follow the approved structure?',
        'Does it respect the 14-block model, or is new scope being created?',
        'Does it improve hierarchy without adding unapproved components?',
        'Is the system coherent across all four service detail pages?',
        'Do reused blocks look consistent wherever they appear?',
        'Does every text/background pair meet 4.5:1?',
        'Can it be built efficiently in the agreed stack?'
      ]}
    ],
    commentary: 'Setting review criteria before design starts is what makes the internal review objective. "Does it respect the block model" has an answer. "Do we like it" has a mood.'
  },

  'visual-design': {
    title: 'Internal design review notes',
    intro: 'Gate 8, before anything reached the client. This review took about an hour and prevented a revision round.',
    blocks: [
      { type: 'table', columns: ['Criterion', 'Verdict', 'Note'], rows: [
        ['Follows approved structure', 'Pass', 'Section order matches outlines on all templates'],
        ['Respects the block model', 'Fail → resolved', 'Two issues found, see below'],
        ['Improves hierarchy', 'Pass', 'Spec table treatment is genuinely better than the wireframe'],
        ['Coherent across service pages', 'Pass', 'Checked all four side by side'],
        ['Reused blocks consistent', 'Fail → resolved', 'Card grid styled differently on home vs applications'],
        ['Contrast ≥4.5:1', 'Fail → resolved', 'Brand orange used for body text on white — 3.1:1'],
        ['Buildable in the stack', 'Pass', '—']
      ]},
      { type: 'prose', text: 'Scope issues found and logged' },
      { type: 'table', columns: ['ID', 'Issue', 'Assessment', 'Outcome'], rows: [
        ['CHG-003', 'Designer introduced a "comparison table" component on the service landing pages — not in the block inventory', 'Genuinely good idea. Build impact: medium, ~6 hrs. Not in the approved inventory or the estimate.', 'Logged. Presented to the client as an optional addition with a price. Client accepted as a variation — VAR-002, £780.'],
        ['CHG-004', 'Hero spec summary shows 6 figures; the outline and wireframe specify 4', 'Six crowds the hero at 375px and breaks the mobile 2×2 grid decision.', 'Reverted to 4. No client involvement needed — this is a correction against an approved artefact.']
      ]},
      { type: 'prose', text: 'Corrections issued to the designer' },
      { type: 'list', style: 'plain', items: [
        'Body text using brand orange on white fails AA at 3.1:1. Use the darkened variant for text; retain the brand value for fills and rules.',
        'Card grid must be visually identical on home and on applications — it is one block, and inconsistency here becomes two blocks at build time.',
        'Focus states missing on accordion headers and on the spec table scroll region.'
      ]}
    ],
    commentary: 'CHG-003 is the process working exactly as intended. The designer had a good idea that was genuinely out of scope. It was not suppressed and it was not absorbed — it was priced, offered, and paid for. That is what the change log is for.'
  },

  'client-design-review': {
    title: 'Client design feedback — classified',
    intro: 'Eleven feedback items arrived in one consolidated list. Classifying them before responding is what kept this project profitable.',
    blocks: [
      { type: 'table', columns: ['#', 'Feedback', 'Class', 'Action'], rows: [
        ['1', 'Hero image is too dark', 'Correction', 'Fixed — no charge'],
        ['2', 'Product name is truncating on mobile', 'Correction', 'Fixed — no charge'],
        ['3', 'Prefer the blue heading treatment from concept A', 'Preference', 'Applied — within revision allowance'],
        ['4', 'More space between spec table rows', 'Preference', 'Applied — within allowance'],
        ['5', 'Accreditation logos should be larger', 'Preference', 'Applied — within allowance'],
        ['6', 'Can we add a product configurator?', 'New scope', 'Excluded at Gate 0. Logged CHG-006, quoted separately as phase 2.'],
        ['7', 'Add a fourth service line — Controls & Instrumentation', 'New scope', 'The risk flagged as RA-004. Logged CHG-007. Variation VAR-003 — new landing page, 2 detail pages, template variant. £2,150. Accepted.'],
        ['8', 'Can the case studies have video?', 'New scope', 'Logged CHG-008. No video exists and none is in scope. Deferred to post-launch backlog.'],
        ['9', 'Move the datasheet CTA higher', 'Preference', 'Applied — within allowance'],
        ['10', 'Different icons on the applications grid', 'Preference', 'Applied — within allowance'],
        ['11', 'Footer should include the ISO numbers', 'Correction', 'Fixed — it was in the outline and had been missed']
      ]},
      { type: 'fields', items: [
        ['Items classified as corrections', '3 — fixed at no charge, as they should be'],
        ['Items classified as preference', '5 — absorbed within revision round 1 of 2'],
        ['Items classified as new scope', '3 — one deferred, two priced'],
        ['Additional revenue captured', '£2,150 (VAR-003). Under the previous process this would have been absorbed.'],
        ['Revision rounds used', '1 of 2'],
        ['Approval', 'Technical Director, in writing, naming: Page designs v1.2, Component styling v1.2. 3 working days — inside the 5-day SLA.']
      ]},
      { type: 'prose', text: 'The counterfactual' },
      { type: 'list', style: 'plain', items: [
        'Item 7 is the fourth service line flagged as a risk at discovery and explicitly excluded at Gate 0. Because it was excluded in writing, adding it was a straightforward priced variation rather than an argument.',
        'Without Gate 0, item 7 arrives as "we always assumed all our service lines would be covered" — and is absorbed, at a cost of roughly 14 hours.'
      ]}
    ],
    commentary: 'Three new-scope items in one feedback round is completely normal. The process did not stop the client asking. It made asking a commercial conversation instead of an expectation.'
  }

,

  'build-spec': {
    title: 'Build specification (extract)',
    intro: 'The block build list and the estimate re-baseline. This is where the Gate 1 guess meets the known scope.',
    blocks: [
      { type: 'fields', items: [
        ['Stack', 'WordPress · custom theme · block framework'],
        ['Repository', 'chillibyte/halcyon-thermal'],
        ['Branching', 'main → staging → feature branches. No direct commits to main.'],
        ['Environments', 'Local (per developer) · dev.halcyonthermal.chillibyte.dev · staging · production'],
        ['Plugins approved', 'Block framework, HubSpot, Yoast, WP Rocket. No others without a logged decision.']
      ]},
      { type: 'prose', text: 'Block build list' },
      { type: 'table', columns: ['Block', 'Action', 'fields', 'PHP', 'Base SCSS', 'Theme SCSS', 'Est'], rows: [
        ['Gated download', 'Build new', 'Heading, text, file, HubSpot form ID, gate on/off', 'blocks/gated-download/', 'core/_download.scss', 'theme/_download.scss', '11 hrs'],
        ['Spec table', 'Build new', 'Heading, repeater (label, value, unit, note)', 'blocks/spec-table/', 'core/_spec-table.scss', 'theme/_spec-table.scss', '8 hrs'],
        ['Comparison table', 'Build new (VAR-002)', 'Repeater (product, 6 attributes)', 'blocks/comparison/', 'core/_comparison.scss', 'theme/_comparison.scss', '6 hrs'],
        ['Hero — technical', 'Adapt', '+ image, + spec summary relationship', 'existing, extended', 'existing', 'theme/_hero.scss', '5 hrs'],
        ['Card grid', 'Adapt', '+ icon field', 'existing, extended', 'existing', 'theme/_cards.scss', '2 hrs'],
        ['Case teaser', 'Adapt', '+ auto-pull by service taxonomy', 'existing, extended', 'existing', 'theme/_teaser.scss', '3 hrs'],
        ['Contact block', 'Adapt', '+ HubSpot embed', 'existing, extended', 'existing', 'theme/_contact.scss', '3 hrs'],
        ['8 remaining blocks', 'Reuse', 'No change', 'existing', 'existing', 'theme styling only', '6 hrs total']
      ]},
      { type: 'prose', text: 'Content entry plan — real effort, explicitly estimated' },
      { type: 'table', columns: ['Group', 'Pages', 'Owner', 'Est'], rows: [
        ['Service landings + detail', '7', 'Agency, from client copy', '7 hrs'],
        ['Case studies', '6', 'Agency, from client copy', '4 hrs'],
        ['Technical library — 40 datasheets', '1 + 40 files', 'Agency', '6 hrs'],
        ['Home, About, Accreditations, Contact, Privacy', '5', 'Agency', '4 hrs'],
        ['Insights migration', '11', 'Agency', '3 hrs']
      ]},
      { type: 'prose', text: 'Estimate re-baseline at Gate 10' },
      { type: 'table', columns: ['', 'Gate 1 baseline', 'Gate 10 re-baseline', 'Variance'], rows: [
        ['Core process steps', '145 hrs', '149 hrs', '+4'],
        ['Conditional work (audit, redirects, compliance)', '22 hrs', '26 hrs', '+4'],
        ['Approved variations (VAR-002, VAR-003)', '—', '20 hrs', '+20 (billed)'],
        ['Contingency @ 20%', '33 hrs', '39 hrs', '+6'],
        ['Total', '200 hrs', '234 hrs', '+34 hrs, of which 20 billed']
      ]},
      { type: 'prose', text: 'Technical risks' },
      { type: 'table', columns: ['Risk', 'Impact', 'Mitigation'], rows: [
        ['HubSpot gated-download flow is the only integration and the highest-risk block', 'Blocks 5 placements', 'Build first, not last. Prove the flow end to end in week one of build.'],
        ['40 PDF URLs must be preserved for customer intranet links', 'Broken links on third-party systems we cannot fix', 'PDF paths preserved exactly; redirects only where unavoidable'],
        ['Case study content at risk (RA-001)', '6 empty template pages', 'Content deadline 6 June. Fall back to 3 case studies if missed.']
      ]}
    ],
    commentary: 'The variance line is the most valuable output here. +14 hours of genuine estimating error on a 200-hour baseline is about 7% — acceptable. The other +20 hours is not error at all: it is scope the client asked for and paid for. Without a baseline, all 34 hours would have looked like the same thing — and the whole 34 would have been absorbed.'
  },

  'access-credentials': {
    title: 'Access register',
    intro: 'One consolidated request, sent the day the build spec was approved. Two of these took over two weeks to arrive.',
    blocks: [
      { type: 'table', columns: ['System', 'Needed for', 'Client owner', 'Requested', 'Received', 'Verified'], rows: [
        ['Existing WordPress admin', 'Content and PDF export', 'Marketing Coordinator', '10 Jun', '11 Jun', 'Yes'],
        ['Existing hosting (cPanel)', 'Backup, PDF file access', 'External IT contractor', '10 Jun', '19 Jun', 'Yes'],
        ['DNS registrar', 'Launch', 'Finance Director — original account holder', '10 Jun', '26 Jun', 'Yes — after a registrar account recovery'],
        ['Google Analytics', 'Baseline and post-launch verification', 'Marketing Coordinator', '10 Jun', '11 Jun', 'Yes'],
        ['Google Search Console', 'Migration monitoring', 'Nobody — never set up', '10 Jun', '13 Jun', 'Yes — created and verified by agency'],
        ['HubSpot', 'Form integration', 'Sales Manager', '10 Jun', '12 Jun', 'Yes — sandbox first, production before launch']
      ]},
      { type: 'prose', text: 'What this step caught' },
      { type: 'list', style: 'plain', items: [
        'The DNS registrar account was in the Finance Director\'s name, using an email address that no longer existed. Recovery took 16 days. Requested at build start, this was an administrative footnote. Requested in launch week, it would have been a two-week launch delay with a trade show deadline attached.',
        'Search Console had never been set up, so there was no historic search data at all. Created immediately — it still gave six weeks of pre-launch data to compare against.',
        'The hosting was controlled by an IT contractor nobody had mentioned at discovery.'
      ]}
    ],
    commentary: 'This is the cheapest step in the process — perhaps ninety minutes of chasing — and on this project it prevented a two-week delay against a fixed external deadline. The DNS problem is not unusual. It is close to universal.'
  },

  development: {
    title: 'Build progress against the block list',
    intro: 'The build list doubles as the work-tracking artefact. Because each block has fields, files and an estimate, blocks can be handed to a second developer without a briefing.',
    blocks: [
      { type: 'table', columns: ['Block', 'Assigned', 'Est', 'Actual', 'Status', 'Library updated'], rows: [
        ['Gated download', 'Developer A', '11', '13', 'Complete', 'Yes'],
        ['Spec table', 'Developer A', '8', '7', 'Complete', 'Yes'],
        ['Comparison table', 'Developer B', '6', '6', 'Complete', 'Yes'],
        ['Hero — technical', 'Developer B', '5', '4', 'Complete', 'Yes'],
        ['Card grid variant', 'Developer B', '2', '2', 'Complete', 'Yes'],
        ['Case teaser', 'Developer B', '3', '4', 'Complete', 'Yes'],
        ['Contact block', 'Developer A', '3', '3', 'Complete', 'Yes'],
        ['Templates and reused blocks', 'Developer A', '6', '7', 'Complete', 'n/a'],
        ['Content entry', 'Both', '24', '27', 'Complete', 'n/a']
      ]},
      { type: 'prose', text: 'Parallel working — what made it possible' },
      { type: 'list', style: 'plain', items: [
        'Developer B joined in week two with no project history. They were handed three blocks from the build list, each with fields, files, responsive notes and an approved design.',
        'No handover meeting was required. The block specifications were the handover.',
        'Total onboarding time: about 40 minutes, spent on repository setup rather than on explaining the project.',
        'Under the previous approach this would have required a half-day walkthrough from the Head of Web, and would probably not have been attempted at all on a project this size.'
      ]},
      { type: 'prose', text: 'Content deadline escalation, invoked once' },
      { type: 'fields', items: [
        ['6 June', 'Case study content deadline passes. Two of six supplied.'],
        ['9 June', 'Escalation as agreed at Gate 4: client informed that the case study section will launch with three studies and the remaining three added post-launch as a content task.'],
        ['20 June', 'Four supplied. Launched with four. No delay to the launch date.'],
        ['Outcome', 'The deadline and its consequence were agreed at Gate 4, so invoking it was a routine email rather than a difficult conversation.']
      ]}
    ],
    commentary: 'The gated download ran 2 hours over — the integration always does. Everything else landed within an hour of estimate. That is what estimating from a known block list rather than a page count gets you.'
  },

  compliance: {
    title: 'Compliance and data protection check',
    intro: 'Halcyon collects personal data through six forms and a gated download flow. This check took about two hours and found three genuine problems.',
    blocks: [
      { type: 'table', columns: ['Check', 'Result', 'Action'], rows: [
        ['Privacy policy describes the site as built', 'Fail', 'Client\'s existing policy predates HubSpot and does not mention gated downloads or marketing consent. Redrafted by the client with our list of what the site actually does.'],
        ['Cookie consent gates non-essential cookies', 'Fail', 'Banner was configured but HubSpot tracking fired before consent. Fixed — tracking now blocked until consent.'],
        ['Form destination documented', 'Pass', 'All forms → HubSpot. Owner: Sales Manager.'],
        ['Retention period agreed', 'Fail', 'Never discussed. Agreed at 24 months for enquiries, then anonymised. Documented.'],
        ['Analytics matches consent claims', 'Pass', 'GA4 consent mode configured correctly.'],
        ['Gated download consent wording', 'Pass', 'Separate opt-in for marketing, distinct from the download itself — the download is not conditional on marketing consent.'],
        ['Data-processing position clear', 'Escalated', 'Agency has access to HubSpot containing personal data. Flagged to client for a DPA. Not answered by us.'],
        ['Old /quote-request/ inbox', 'Fail', 'The unmonitored form found in the audit has been collecting personal data for a year with nobody reading it. Retired, and the client advised.']
      ]},
      { type: 'prose', text: 'Note on scope' },
      { type: 'list', style: 'plain', items: [
        'The DPA question was flagged, not answered. Identifying a legal question is inside the agency\'s competence; answering it is not.',
        'The unmonitored form is a good illustration of why this step is not optional. It was a genuine data-protection problem that pre-dated the project entirely, and it would have been silently carried into the new site.'
      ]}
    ],
    commentary: 'Three failures out of eight checks, on a project run by competent people, on a site that "just has a contact form". That ratio is why this became a step rather than a line on the QA checklist.'
  },

  'internal-qa': {
    title: 'Internal QA — against the agreed matrix',
    intro: 'QA is finishable here because Gate 1 defined what "tested" means. Everything below is tested against the support matrix and WCAG 2.2 AA, and nothing beyond it.',
    blocks: [
      { type: 'table', columns: ['Category', 'Check', 'Result', 'Issue'], rows: [
        ['Structure', 'Matches approved sitemap v1.1', 'Pass', '—'],
        ['Navigation', 'Main + subnav across matrix', 'Pass', '—'],
        ['Content', 'No placeholder content remains', 'Fail → fixed', 'Two case study pages still had lorem text in the summary field'],
        ['Forms', 'All 6 forms deliver to HubSpot', 'Fail → fixed', 'Datasheet form on /heat-exchangers/plate/ pointed at the wrong HubSpot form ID'],
        ['Responsive', '375 / 768 / 1280 on all matrix browsers', 'Fail → fixed', 'Spec table sticky column broke in Safari 17 — required a transform fix'],
        ['Accessibility', 'Heading order', 'Fail → fixed', 'Three service pages skipped from H2 to H4'],
        ['Accessibility', 'Contrast ≥4.5:1', 'Pass', 'Verified across all block variants'],
        ['Accessibility', 'Keyboard navigation', 'Fail → fixed', 'Spec table horizontal scroll region was not keyboard reachable'],
        ['Accessibility', 'Focus states', 'Pass', '—'],
        ['Performance', 'Image optimisation', 'Fail → fixed', '4 factory photographs at 4MB+ served unresized'],
        ['SEO', 'Titles, descriptions, indexability', 'Pass', '—'],
        ['SEO', 'Redirects — all 84 old URLs', 'Fail → fixed', '3 PDF paths returned 404; the /hx vanity URL was missed entirely'],
        ['Analytics', 'GA4 and Search Console firing', 'Pass', '—']
      ]},
      { type: 'fields', items: [
        ['Issues found internally', '7'],
        ['Issues found by the client at staging', '2 — both cosmetic'],
        ['Known issues carried to staging with severity', '1 — minor spacing inconsistency on the insights index, cosmetic, scheduled for post-launch']
      ]},
      { type: 'prose', text: 'The redirect failure is the one that mattered' },
      { type: 'list', style: 'plain', items: [
        'Three PDF paths and the /hx vanity URL were missing from the implemented redirects. All four were in the current-state audit.',
        'Caught at QA because the audit produced a testable list. Without the audit there would have been no list to test against, and the failure would have been discovered by a customer.'
      ]}
    ],
    commentary: 'Seven issues found internally, two found by the client — and both of those cosmetic. That ratio is the entire argument for Gate 11. Every one of those seven, found by the client instead, would have cost an approval round and a small amount of confidence.'
  },

  'staging-review': {
    title: 'Staging review — feedback classified',
    intro: 'One consolidated list, from the named approver, inside the 5-day window. Nine items.',
    blocks: [
      { type: 'table', columns: ['#', 'Item', 'Class', 'Action'], rows: [
        ['1', 'Spacing inconsistent on insights index', 'Correction', 'Fixed — it was our known issue'],
        ['2', 'Typo in the thermal fluid spec table', 'Correction', 'Fixed'],
        ['3', 'Two datasheets are the old revision', 'Correction', 'Client supplied current versions; replaced'],
        ['4', 'Case study images are portrait, look wrong', 'Correction', 'Cropping rule applied'],
        ['5', 'Can the enquiry form have a "how did you hear about us" field?', 'New scope — small', 'Absorbed. 20 minutes, and a reasonable request. Logged as absorbed so the decision is visible.'],
        ['6', 'Add a news section for the trade show', 'New scope', 'Logged CHG-011. Insights template already exists — offered as 2 hrs post-launch. Accepted.'],
        ['7', 'Change the home hero photograph', 'Preference', 'Client supplied a new image; applied'],
        ['8', 'Make the phone number bigger in the header', 'Preference', 'Applied'],
        ['9', 'Can we see how it looks on my old iPad?', 'Out of matrix', 'iPad 2 running iOS 9 is outside the agreed support matrix. Explained with reference to Gate 1. Not pursued.']
      ]},
      { type: 'fields', items: [
        ['Review window', '5 working days as agreed. Feedback returned on day 4.'],
        ['Rounds used', '1 of 1 consolidated round'],
        ['Content freeze', 'Declared on approval. No content edits between Gate 12 and launch.'],
        ['Approval', 'Technical Director, in writing, naming: Staging build, 22 August.']
      ]},
      { type: 'prose', text: 'Item 9 is worth noting' },
      { type: 'list', style: 'plain', items: [
        'A request to support a fourteen-year-old device is entirely reasonable from a client who does not think about support matrices.',
        'Because the matrix was agreed at Gate 1 and written down, declining it was a two-sentence explanation rather than a negotiation.',
        'Without the matrix, this becomes an open question that someone eventually spends half a day on.'
      ]}
    ],
    commentary: 'Item 5 was absorbed deliberately and logged as absorbed. The process does not require charging for everything — it requires the decision to be visible. Absorbing 20 minutes as goodwill is a choice; absorbing 20 hours because nobody was counting is not.'
  },

  'launch-prep': {
    title: 'Launch checklist',
    intro: 'Everything below was done before launch day. Launch itself took 40 minutes.',
    blocks: [
      { type: 'table', columns: ['Task', 'Owner', 'Done', 'Note'], rows: [
        ['Final client approval captured (Gate 12)', 'Account Management', '22 Aug', 'In writing, naming the staging build'],
        ['Full backup of existing site taken', 'Head of Web', '22 Aug', 'Restore tested on a scratch environment — not just taken'],
        ['84 redirects implemented and tested', 'Head of Web', '23 Aug', 'Tested against the audit URL list, including the 40 PDF paths and /hx'],
        ['DNS TTL reduced to 300s', 'Head of Web', '24 Aug', '48 hrs ahead of the switch'],
        ['Hosting environment provisioned and tested', 'Head of Web', '21 Aug', '—'],
        ['HubSpot moved from sandbox to production', 'Head of Web', '25 Aug', 'All 6 forms re-tested against production'],
        ['Content freeze confirmed', 'Account Management', '22 Aug', 'Client notified in writing'],
        ['Rollback plan written and read', 'Head of Web', '23 Aug', 'DNS revert + backup restore. Both developers briefed.'],
        ['Launch window scheduled', 'Account Management', '—', 'Tuesday 26 Aug, 10:00. Deliberately not a Friday, and not the day before the trade show.'],
        ['Warranty window agreed in writing', 'Account Management', '22 Aug', '30 days from launch. Defects fixed free; changes quoted. Sent to the client and acknowledged.']
      ]},
      { type: 'prose', text: 'Warranty wording sent to the client' },
      { type: 'fields', items: [
        ['Covered free for 30 days', 'Anything that does not work as specified in the approved artefacts — broken functionality, display faults on supported browsers and devices, incorrect redirects, form failures.'],
        ['Quoted, inside or outside the window', 'New pages, new content, new functionality, design changes, changes arising from a change in your requirements, or support for devices outside the agreed matrix.'],
        ['After 30 days', 'All work quoted. A care plan is available and we would recommend one — see the separate proposal.']
      ]}
    ],
    commentary: 'The warranty paragraph is nine lines long and was sent before launch, while everyone was pleased with each other. Sent after the first post-launch request, the identical wording reads as a refusal.'
  },

  'launch-closure': {
    title: 'Closure — verification, variance and retrospective',
    intro: 'Launch verification, then the three things closure exists to capture: the commercial boundary, the reusable value, and the learning.',
    blocks: [
      { type: 'prose', text: 'Production verification, launch day' },
      { type: 'list', style: 'check', items: [
        'All 6 forms submitted with real data and confirmed arriving in production HubSpot',
        'GA4 firing; Search Console property switched and new sitemap submitted',
        'Spot-checked 20 redirects including all 40 PDF paths and /hx',
        'Walked all three primary journeys: engineer → datasheet, operations → service enquiry, procurement → case studies',
        'Core Web Vitals checked on the four heaviest pages',
        'Crawl errors monitored daily for the first week — 0 by day 4'
      ]},
      { type: 'prose', text: 'Estimate variance — the number worth keeping' },
      { type: 'table', columns: ['', 'Hours'], rows: [
        ['Gate 1 baseline', '200'],
        ['Gate 10 re-baseline', '234'],
        ['Actual', '249'],
        ['Variance vs re-baseline', '+15 (6.4%)'],
        ['Of which billed as variations', '20 hrs (VAR-002 £780, VAR-003 £2,150)'],
        ['Genuine estimating error', '+29 hrs against the Gate 1 baseline — concentrated in content entry (+3) and QA fixes (+6)']
      ]},
      { type: 'prose', text: 'Commercial outcome' },
      { type: 'table', columns: ['', 'This project', 'Previous approach (estimated)'], rows: [
        ['Contract value', '£18,400', '£18,400'],
        ['Variations captured', '£2,930', '£0 — absorbed'],
        ['Total revenue', '£21,330', '£18,400'],
        ['Rework hours', '~9', '~25 estimated'],
        ['Delay from missing DNS access', '0 days', '~10 days likely'],
        ['Post-launch free work', 'Bounded at 30 days, defects only', 'Open-ended']
      ]},
      { type: 'prose', text: 'Reusable value returned to the library' },
      { type: 'list', style: 'plain', items: [
        'Spec table — new reusable block, documented. Already specified for two subsequent projects.',
        'Gated download — new reusable block with a proven HubSpot pattern. This was the highest-risk item on this project and is now a solved problem.',
        'Comparison table — new reusable block, paid for by the client as VAR-002 and retained for reuse.',
        'Card grid icon variant — folded back into the core block rather than left project-specific.'
      ]},
      { type: 'prose', text: 'Retrospective — each item with an owner and a date' },
      { type: 'table', columns: ['Finding', 'Action', 'Owner', 'Due'], rows: [
        ['Content entry consistently under-estimated', 'Raise the content-entry effort band by 15% in the estimate model', 'Head of Web', 'Before next estimate'],
        ['DNS access nearly derailed a fixed deadline', 'Move DNS confirmation earlier — request at Gate 1 rather than Gate 10', 'Account Management', 'Next project'],
        ['Cookie consent was configured but non-functional', 'Add "test that consent actually gates tracking" as an explicit QA line', 'Head of Web', 'Template update, 2 weeks'],
        ['Case study content risk was correctly predicted and correctly managed', 'No action — the mechanism worked. Note as evidence for the content deadline rule.', '—', '—']
      ]},
      { type: 'fields', items: [
        ['Warranty start', '26 August. Expires 25 September. Client acknowledged in writing.'],
        ['Care plan', 'Proposed at handover on 26 August, while the site was fresh. Accepted 2 September — £340/month.'],
        ['Post-launch backlog', '3 remaining case studies, news section (CHG-011), video (CHG-008 deferred). All quoted.']
      ]}
    ],
    commentary: 'The care plan was accepted seven days after handover. Raised six weeks later, it is a cold sales conversation with a client who has stopped thinking about their website. The timing is the reason it converted, and the timing came from the process.'
  }
};

export function exampleFor(stepId) {
  return examples[stepId] || null;
}
