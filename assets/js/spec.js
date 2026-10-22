/* ---------------------------------------------------------------------------
   spec.js — Project Spec Builder

   Intake answers → conditions → route → included/omitted steps → spec document.

   The important design decision: inclusion is driven by CONDITIONS as well as
   route size. A light project that replaces a ranking site still gets the
   full migration governance, because risk follows traffic and links rather
   than page count. Route sizing alone cannot express that.
--------------------------------------------------------------------------- */

import {
  phases, roles, routes, routeOrder, gates, conditionalGates,
  artefacts, conditions as CONDITIONS, roleName, approvalName, approvalTicket
} from '../../data/process.js';
import { steps, stepById } from '../../data/steps.js';
import {
  featureEffort, integrationEffort, seoBaselineHours, romVariance,
  additionalLanguageHours, clientMaturityOverheadHours, accessibilityQAHours,
  ROUTE_SCORE_ANCHORS
} from '../../data/effort-assumptions.js';
import { project as example } from '../../data/worked-example.js';
import { esc, routeBadges, newBadge, copyText, hrs, hrsRange } from './ui.js';

/* ========================== Questionnaire ================================ */

const QUESTIONS = [
  {
    id: 'projectType', type: 'single',
    legend: 'What kind of project is this?',
    hint: 'Replacing a live site changes what the process forces on, regardless of size.',
    options: [
      { v: 'new', label: 'New build', note: 'No existing site, or the existing one is being abandoned entirely' },
      { v: 'redesign', label: 'Redesign of a live site', note: 'Same business, new site, existing URLs' },
      { v: 'rebuild', label: 'Rebuild on existing content', note: 'Platform or template change, content largely retained' }
    ]
  },
  {
    id: 'organicValue', type: 'single',
    showIf: a => a.projectType === 'redesign' || a.projectType === 'rebuild',
    legend: 'How much does the current site earn from search?',
    hint: 'This, not page count, determines how much migration governance the project needs.',
    options: [
      { v: 'none', label: 'Little or nothing', note: 'New or dormant domain, negligible organic traffic' },
      { v: 'some', label: 'Some organic traffic', note: 'Ranks for brand and a few terms' },
      { v: 'significant', label: 'Organic is a real channel', note: 'Meaningful share of enquiries arrive through search' }
    ]
  },
  {
    id: 'urlCount', type: 'single',
    showIf: a => a.projectType === 'redesign' || a.projectType === 'rebuild',
    legend: 'Roughly how many URLs does the current site have?',
    options: [
      { v: 'small', label: 'Under 25' },
      { v: 'mid', label: '25–150' },
      { v: 'large', label: '150–1,000' },
      { v: 'huge', label: 'Over 1,000', note: 'Content migration becomes a workstream of its own' }
    ]
  },
  {
    id: 'pageCount', type: 'single',
    legend: 'How many pages will the new site have?',
    options: [
      { v: 'xs', label: 'Under 8' },
      { v: 's', label: '8–25' },
      { v: 'm', label: '25–60' },
      { v: 'l', label: 'Over 60' }
    ]
  },
  {
    id: 'blocks', type: 'single',
    legend: 'How many distinct blocks and custom post types will this need?',
    hint: 'This drives design and build effort far more reliably than page count does. There is no separate "page template" to count — the build is block-based and CPT-driven, so this is what design and development actually scale with.',
    options: [
      { v: 'few', label: '0 CPTs, 8–12 blocks', note: 'Just pages and posts' },
      { v: 'some', label: '1–2 CPTs, 13–20 blocks', note: 'e.g. people, case studies' },
      { v: 'many', label: '3+ CPTs, 21+ blocks', note: 'Complex site — each one is a design and a build' }
    ]
  },
  {
    id: 'brand', type: 'single',
    legend: 'What is the brand situation?',
    options: [
      { v: 'established', label: 'Established and usable', note: 'Guidelines and assets exist' },
      { v: 'refresh', label: 'Needs a refresh', note: 'Exists but is dated or incomplete' },
      { v: 'new', label: 'Needs creating', note: 'Identity work runs before style direction, as its own piece of work' }
    ]
  },
  {
    id: 'contentSource', type: 'single',
    legend: 'Who is writing the content?',
    hint: 'Late client content is the most common cause of website overrun.',
    options: [
      { v: 'client', label: 'The client', note: 'Content deadlines and escalation become critical' },
      { v: 'agency', label: 'A copywriter we arrange', note: 'Adds the Copywriter role and cost' },
      { v: 'reuse', label: 'Mostly reusing existing copy', note: 'Still needs an audit and an editing pass' }
    ]
  },
  {
    id: 'features', type: 'multi',
    legend: 'Does the site need any of these?',
    hint: 'Each one moves the project from publishing towards application territory.',
    options: [
      { v: 'forms', label: 'Forms collecting personal data', note: 'Almost always yes — triggers the compliance step' },
      { v: 'gated', label: 'Gated downloads or content' },
      { v: 'ecommerce', label: 'Ecommerce' },
      { v: 'booking', label: 'Booking or scheduling', note: 'Usually a configured plugin — small effort impact' },
      { v: 'portal', label: 'Customer portal or login area', note: 'Bespoke authentication and account area — large effort impact' },
      { v: 'membership', label: 'Membership or subscriptions', note: 'Usually external (Mailchimp, HubSpot) — small effort impact' },
      { v: 'documentLibrary', label: 'Document library', note: 'Secure storage, search and access control' }
    ]
  },
  {
    id: 'integrations', type: 'multi',
    legend: 'Which third-party systems does it connect to?',
    hint: 'Every integration is a credential you need before build, not during it. Ticked here because these are not equally expensive — an analytics tag and a bespoke API are wildly different amounts of work despite both being "an integration".',
    options: [
      { v: 'analytics', label: 'Analytics (GA4/GTM)', note: 'Already in the theme — configure and verify only' },
      { v: 'webhookCrm', label: 'Simple CRM webhook (Zapier etc.)' },
      { v: 'hubspot', label: 'HubSpot connector' },
      { v: 'salesforce', label: 'Salesforce form/API' },
      { v: 'customApi', label: 'Other/bespoke API', note: 'No two are alike — treat the hours as a placeholder' }
    ]
  },
  {
    id: 'multilingual', type: 'single',
    legend: 'More than one language?',
    options: [
      { v: 'no', label: 'No' },
      { v: 'yes', label: 'Yes', note: 'Multiplies content, QA, URL structure and translation governance' }
    ]
  },
  {
    id: 'languageCount', type: 'single',
    showIf: a => a.multilingual === 'yes',
    legend: 'How many additional languages, beyond the first?',
    hint: 'Build-side cost only — URL structure, language switcher, duplicated templates, per-language QA. Translating the copy itself stays excluded, same as all other content writing.',
    options: [
      { v: '1', label: '1' },
      { v: '2', label: '2' },
      { v: '3', label: '3 or more' }
    ]
  },
  {
    id: 'stakeholders', type: 'single',
    legend: 'How many people need to approve things?',
    hint: 'Approval latency, not build complexity, is what usually makes a project late.',
    options: [
      { v: 'one', label: 'One decision-maker' },
      { v: 'few', label: 'Two or three' },
      { v: 'many', label: 'Four or more', note: 'Contradictory feedback becomes the dominant schedule risk' }
    ]
  },
  {
    id: 'accessibility', type: 'single',
    legend: 'Is there an accessibility requirement?',
    options: [
      { v: 'basic', label: 'No formal standard', note: 'We still work to AA by default — but it is not contractual' },
      { v: 'aa', label: 'WCAG 2.2 AA', note: 'Recommended default. Testable, and increasingly expected.' },
      { v: 'formal', label: 'Formally required / audited', note: 'Public sector, EAA exposure, or a client accessibility policy' }
    ]
  },
  {
    id: 'deadline', type: 'single',
    legend: 'How fixed is the deadline?',
    options: [
      { v: 'flexible', label: 'Flexible' },
      { v: 'target', label: 'A target date we would like to hit' },
      { v: 'fixed', label: 'Fixed and external', note: 'Trade show, campaign, contract date — removes the slack that absorbs change' }
    ]
  },
  {
    id: 'clientMaturity', type: 'single',
    legend: 'Have we worked with this client before?',
    options: [
      { v: 'known', label: 'Yes, and it went well' },
      { v: 'known-hard', label: 'Yes, and it was difficult', note: 'Tighten the approval SLA and revision allowance' },
      { v: 'new', label: 'New client' }
    ]
  },
  {
    id: 'routeOverride', type: 'single',
    legend: 'Route',
    hint: 'The recommendation is calculated from your answers. Override it if you have a reason — the reason gets recorded.',
    options: [
      { v: 'auto', label: 'Use the recommendation' },
      { v: 'light', label: 'Force light' },
      { v: 'standard', label: 'Force standard' },
      { v: 'full', label: 'Force full' }
    ]
  }
];

const DEFAULTS = {
  projectType: 'redesign', organicValue: 'some', urlCount: 'mid',
  pageCount: 's', blocks: 'some', brand: 'established',
  contentSource: 'client', features: ['forms'], integrations: ['analytics'],
  multilingual: 'no', languageCount: '1', stakeholders: 'few', accessibility: 'aa',
  deadline: 'target', clientMaturity: 'new', routeOverride: 'auto'
};

/* ========================== Rules engine ================================= */

function deriveConditions(a) {
  const c = new Set();
  const f = a.features || [];

  if (a.projectType === 'redesign' || a.projectType === 'rebuild') c.add('existing-site');
  if (a.projectType === 'rebuild' || ['large', 'huge'].includes(a.urlCount)) c.add('content-migration');
  if (a.organicValue === 'significant') c.add('high-seo-risk');
  if (a.multilingual === 'yes') c.add('multilingual');
  if ((a.integrations || []).length) c.add('integrations');
  if (f.includes('forms') || f.includes('gated')) c.add('forms');
  if (['ecommerce', 'booking', 'portal', 'membership'].some(x => f.includes(x))) c.add('transactional');
  if (f.includes('documentLibrary')) c.add('document-library');
  if (a.brand === 'new' || a.brand === 'refresh') c.add('new-identity');
  if (a.stakeholders === 'many') c.add('many-stakeholders');
  if (a.contentSource === 'client') c.add('client-writes');
  if (a.accessibility === 'aa' || a.accessibility === 'formal') c.add('accessibility-target');
  if (a.deadline === 'fixed') c.add('tight-deadline');

  return [...c];
}

function recommendRoute(a, cond) {
  let score = 0;
  const reasons = [];
  const add = (n, why) => { score += n; if (n > 0) reasons.push(why); };

  add({ xs: 0, s: 1, m: 3, l: 5 }[a.pageCount] || 0,
      { xs: '', s: '8–25 pages', m: '25–60 pages', l: 'over 60 pages' }[a.pageCount]);
  add({ few: 0, some: 1, many: 3 }[a.blocks] || 0,
      { few: '', some: '1–2 CPTs, 13–20 blocks', many: '3+ CPTs, 21+ blocks' }[a.blocks]);

  if (cond.includes('multilingual'))     add(4, 'multilingual');
  // Weighted by actual build effort, not a flat bump for ticking any box —
  // a booking plugin and a customer portal are not the same size of thing.
  for (const f of (a.features || [])) {
    const fe = featureEffort[f];
    if (fe && fe.hours > 0) add(Math.round(fe.hours / 8), `${QUESTIONS.find(q => q.id === 'features').options.find(o => o.v === f)?.label.toLowerCase()}`);
  }
  if (cond.includes('content-migration'))add(3, 'content migration');
  // Same principle as features: weighted by actual integration effort, not
  // a flat bump for ticking any box.
  for (const x of (a.integrations || [])) {
    const ie = integrationEffort[x];
    if (ie && ie.hours > 0) add(Math.round(ie.hours / 8), `${QUESTIONS.find(q => q.id === 'integrations').options.find(o => o.v === x)?.label.toLowerCase()}`);
  }
  if (cond.includes('high-seo-risk'))    add(2, 'meaningful organic traffic at risk');
  if (cond.includes('many-stakeholders'))add(2, 'four or more approvers');
  if (a.brand === 'new')                 add(2, 'a new brand identity');
  if (a.accessibility === 'formal')      add(2, 'a formal accessibility requirement');

  const route = score >= 9 ? 'full' : score >= 3 ? 'standard' : 'light';
  return { route, score, reasons: reasons.filter(Boolean) };
}

// ROUTE_SCORE_ANCHORS is imported from data/effort-assumptions.js, along
// with every other conjecture figure the Spec Builder uses.
function interpolateHours(effortBand, score) {
  const points = [
    [ROUTE_SCORE_ANCHORS.light, effortBand.light || 0],
    [ROUTE_SCORE_ANCHORS.standard, effortBand.standard || 0],
    [ROUTE_SCORE_ANCHORS.full, effortBand.full || 0],
  ];
  if (score <= points[0][0]) return points[0][1];
  for (let i = 0; i < points.length - 1; i++) {
    const [s0, h0] = points[i], [s1, h1] = points[i + 1];
    if (score <= s1) return h0 + (h1 - h0) * ((score - s0) / (s1 - s0));
  }
  // Beyond the full anchor: extrapolate the standard→full slope rather than
  // capping, so a genuinely huge project isn't silently underestimated.
  const [s0, h0] = points[1], [s1, h1] = points[2];
  return h1 + ((h1 - h0) / (s1 - s0)) * (score - s1);
}

function buildPlan(a) {
  const cond = deriveConditions(a);
  const rec = recommendRoute(a, cond);
  const route = a.routeOverride === 'auto' ? rec.route : a.routeOverride;
  const overridden = a.routeOverride !== 'auto' && a.routeOverride !== rec.route;

  const included = [], omitted = [];

  for (const s of steps) {
    const stepConds = s.conditions || [];
    const triggers = stepConds.filter(c => cond.includes(c));
    const inRoute = s.routes.includes(route);

    if (stepConds.length) {
      // Conditional step: included only if one of its conditions is met.
      if (triggers.length) {
        included.push({
          step: s,
          reason: 'conditional',
          triggeredBy: triggers.map(t => CONDITIONS[t].label),
          forced: !inRoute
        });
      } else {
        omitted.push({
          step: s,
          why: `None of its triggers apply: ${stepConds.map(t => CONDITIONS[t].label.toLowerCase()).join(', ')}.`
        });
      }
    } else if (inRoute) {
      included.push({ step: s, reason: 'route' });
    } else {
      omitted.push({
        step: s,
        why: (s.omitReason && s.omitReason[route]) || `Not part of the ${route} route.`
      });
    }
  }

  // Effort
  const contingency = routes[route].contingency;

  // A step's real hours: interpolated continuously from the complexity
  // score, not looked up from whichever route was (possibly forced) chosen
  // — see ROUTE_SCORE_ANCHORS above. Steps marked quotedSeparately (design)
  // are excluded — that effort doesn't follow the same drivers as the rest
  // of the build and is genuinely quoted per project, not formula-estimated.
  const stepHours = (s) => s.quotedSeparately ? 0 : interpolateHours(s.effortBand, rec.score);

  const stepsCore = included.reduce((t, i) => t + stepHours(i.step), 0);

  // Every additive cost line beyond the step catalogue lives in ONE of these
  // two arrays. This is the single source of truth for the estimate — the
  // HTML render, Markdown export and CSV export all iterate the same data
  // instead of each hand-writing their own copy of every line, which is how
  // the exports fell out of sync with the on-screen total last time.
  //
  // "estimate" lines are guesses that get contingency and are shown as a
  // ROM range. "firm" lines are numbers the user typed in themselves (a
  // designer's or content team's actual quote) — no contingency, no range,
  // because they aren't estimates.
  const languageCount = a.multilingual === 'yes' ? Number(a.languageCount) || 1 : 0;

  const estimateLines = [
    {
      id: 'seo', label: 'SEO involvement (sitemap review, metadata — flat, every project)',
      hours: seoBaselineHours, always: true
    },
    {
      id: 'multilingual', label: `Multilingual build cost (${languageCount} additional language${languageCount === 1 ? '' : 's'})`,
      hours: languageCount * additionalLanguageHours
    },
    {
      id: 'clientOverhead', label: `Client relationship overhead (${a.clientMaturity})`,
      hours: clientMaturityOverheadHours[a.clientMaturity] ?? 0
    },
    {
      id: 'accessibility', label: `Accessibility QA (${a.accessibility})`,
      hours: accessibilityQAHours[a.accessibility] ?? 0,
      note: a.accessibility !== 'basic'
        ? 'Also affects design — factor extra time into the designer\'s quote below, not just this QA line.'
        : null
    },
  ].filter(l => l.always || l.hours > 0);

  const firmLines = [
    {
      id: 'designer', label: 'Design (Visual design step, entered separately, firm quote)',
      hours: Number(a.designerQuoteHours) || 0,
      prompt: 'Design (Visual design step) is excluded from the estimate above — enter the designer\'s quote at the top of the form to add it.'
    },
    {
      id: 'content', label: 'Content (Chillibyte-written, entered separately, firm quote)',
      hours: a.contentSource === 'agency' ? (Number(a.contentQuoteHours) || 0) : 0,
      prompt: a.contentSource === 'agency'
        ? 'Content is excluded from the estimate above — enter the content team\'s quote at the top of the form to add it.'
        : null
    },
  ].filter(l => l.hours > 0 || l.prompt);

  const featureRows = (a.features || [])
    .map(f => ({ id: f, ...featureEffort[f] }))
    .filter(f => f.hours);
  const featureHours = featureRows.reduce((t, f) => t + f.hours, 0);

  const integrationRows = (a.integrations || [])
    .map(x => ({ id: x, ...integrationEffort[x] }))
    .filter(x => x.hours);
  const integrationHours = integrationRows.reduce((t, x) => t + x.hours, 0);

  const estimateLinesHours = estimateLines.reduce((t, l) => t + l.hours, 0);
  const firmHours = firmLines.reduce((t, l) => t + l.hours, 0);

  // Firm lines are deliberately excluded from core/contingency — they're
  // numbers the user entered, not estimates that need a buffer.
  const core = stepsCore + featureHours + integrationHours + estimateLinesHours;
  const contingencyAmount = core * contingency;
  const baseline = core + contingencyAmount; // the ROM estimate, design/content excluded
  const total = baseline + firmHours; // grand total

  // Gates
  const activeGates = gates.filter(g =>
    g.routes.includes(route) &&
    included.some(i => i.step.gate === g.n)
  );
  const activeConditionalGates = conditionalGates.filter(g =>
    g.triggeredBy.some(t => cond.includes(t))
  );

  // Artefacts actually needed
  const needed = new Set();
  for (const i of included) {
    for (const id of [...(i.step.deliverables || []), ...(i.step.templates || [])]) needed.add(id);
  }
  // Governance artefacts apply to every project on every route.
  ['decision-log', 'change-log', 'variation-order', 'variation-register',
   'gate-ticket', 'approval-note', 'gate-tracker'].forEach(x => needed.add(x));

  const artefactList = [...needed].map(id => ({ id, ...artefacts[id] })).filter(x => x.name);

  // Roles in play
  const roleSet = new Set();
  for (const i of included) {
    roleSet.add(i.step.owner);
    (i.step.contributors || []).forEach(r => roleSet.add(r));
    roleSet.add(i.step.approver);
  }
  roleSet.add('client');

  return {
    answers: a, cond, rec, route, overridden,
    included, omitted, core, contingency, contingencyAmount, baseline, total,
    stepsCore, stepHours, featureRows, featureHours, integrationRows, integrationHours,
    estimateLines, firmLines, firmHours,
    activeGates, activeConditionalGates, artefactList,
    rolesInPlay: [...roleSet].filter(r => roles[r])
  };
}

/* --- Risks seeded from the answers ---------------------------------------- */

function seedRisks(plan) {
  const a = plan.answers, c = plan.cond, out = [];
  const push = (risk, impact, mitigation, owner) => out.push({ risk, impact, mitigation, owner });

  if (c.includes('client-writes'))
    push('Client-written content arrives late or not at all',
         'Build stalls; pages launch empty or the date moves',
         'Content deadline and escalation agreed in writing at the page outlines approval. Named owner per page.',
         'Account Management');

  if (c.includes('high-seo-risk'))
    push('Organic traffic falls after migration',
         'Direct revenue impact, attributed to the agency',
         'Current-state audit before any change; redirect map tested against the real URL list at QA.',
         'SEO / Analytics');

  if (c.includes('integrations'))
    push('Third-party credentials arrive late',
         'Build blocked on a dependency that is invisible in the project record',
         'Access requested in one consolidated message at build spec, verified on receipt.',
         'Account Management');

  if (c.includes('existing-site'))
    push('DNS or hosting access cannot be obtained in time',
         'Launch delayed regardless of build readiness',
         'DNS ownership confirmed early — it is routinely held by someone nobody remembers.',
         'Account Management');

  if (c.includes('many-stakeholders'))
    push('Contradictory feedback from multiple approvers',
         'Revision rounds multiply; nobody can approve',
         'Single named approver captured at the discovery approval. Contradictions go back to the client to resolve.',
         'Account Management');

  if (c.includes('tight-deadline'))
    push('Fixed external deadline removes schedule slack',
         'Any change or delay compresses QA rather than moving the date',
         'Approval SLA enforced strictly. Scope reductions identified in advance as the release valve.',
         'Head of Web');

  if (a.brand === 'new')
    push('Identity work runs late and blocks style direction',
         'Design cannot start; the whole downstream sequence slips',
         'Treat identity as its own piece of work with its own approval, ahead of style direction.',
         'Designer');

  if (c.includes('forms') || c.includes('transactional'))
    push('Privacy, consent or data-handling gaps found late',
         'Launch blocked, or a compliance problem goes live',
         'Compliance step runs alongside QA, not after it. Legal questions escalated, not guessed.',
         'Head of Web');

  if (c.includes('multilingual'))
    push('Translation arrives late or is inconsistent',
         'One language launches complete and the others do not',
         'Translation treated as content with its own owner and deadline in the content matrix.',
         'Account Management');

  if (a.clientMaturity === 'known-hard')
    push('Previous engagement with this client was difficult',
         'Approval drift and revision creep recur',
         'Tighten the approval SLA and state the revision allowance explicitly at the studio brief approval.',
         'Account Management');

  push('Scope grows after approval',
       'Non-billable hours absorbed silently',
       'Change log mandatory. Anything adding effort gets an hours figure; chargeable items become a variation before the work happens.',
       'Head of Web');

  return out;
}

/* --- Exclusions, phrased for a client ------------------------------------- */

function buildExclusions(plan) {
  const a = plan.answers, c = plan.cond, out = [];

  for (const o of plan.omitted) {
    out.push(`${o.step.title} — ${o.why.replace(/\.$/, '')}.`);
  }

  if (a.contentSource === 'client')
    out.push('Copywriting — all page copy is written by the client. We edit and advise, but do not author.');
  if (a.contentSource !== 'agency')
    out.push('Content strategy and ongoing content production beyond the pages listed in the sitemap.');

  out.push('Photography, videography and illustration — client-supplied unless separately quoted.');

  if (!c.includes('multilingual'))
    out.push('Translation and any additional language version.');
  if (!c.includes('transactional')) {
    out.push('Ecommerce, booking, customer portal and membership functionality.');
  }
  if (!(a.integrations || []).length)
    out.push('Integration with any third-party system.');

  out.push('Ongoing or larger SEO engagement, content marketing, paid media and analytics reporting — this quote includes only the flat build-side SEO involvement above (sitemap review, metadata).');
  out.push('Hosting, maintenance and support beyond the defect warranty window.');
  out.push('Support for browsers or devices outside the agreed support matrix.');
  out.push('Any page, block, CPT or feature not listed in the approved sitemap and block inventory.');

  return out;
}

/* --- Approval and revision terms ------------------------------------------ */

function terms(plan) {
  const a = plan.answers, c = plan.cond;
  const tight = c.includes('tight-deadline') || a.clientMaturity === 'known-hard';
  return {
    slaDays: tight ? 3 : 5,
    slaNote: tight
      ? 'Shortened because the deadline is fixed externally or the previous engagement was difficult.'
      : 'Standard response window.',
    concepts: plan.route === 'light' ? 1 : 2,
    revisionRounds: plan.route === 'full' ? 3 : 2,
    stagingRounds: 1,
    warrantyDays: 30,
    approver: 'One named individual, captured at the discovery approval. Others may comment; only the named approver approves.'
  };
}

/* ========================== State ======================================== */

const STORE = 'cb-spec-state';
let answers = load();

// integrations used to be a single-select ('none'/'one'/'several'); it's now
// a multi-select of specific integration types. Old saved/shared state can
// still have the string form — treat anything that isn't already an array
// as "unknown, start fresh" rather than let it silently misbehave.
function migrate(a) {
  if (a && !Array.isArray(a.integrations)) a.integrations = a.integrations && a.integrations !== 'none' ? ['customApi'] : [];
  return a;
}

function load() {
  const fromUrl = new URLSearchParams(location.search).get('s');
  if (fromUrl) {
    try {
      const decoded = JSON.parse(decodeURIComponent(escape(atob(fromUrl.replace(/-/g, '+').replace(/_/g, '/')))));
      return migrate({ ...DEFAULTS, ...decoded });
    } catch { /* fall through to local storage */ }
  }
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (saved) return migrate({ ...DEFAULTS, ...saved });
  } catch { /* ignore */ }
  return { ...DEFAULTS, _name: '', _author: '' };
}

function persist() {
  localStorage.setItem(STORE, JSON.stringify(answers));
  const packed = btoa(unescape(encodeURIComponent(JSON.stringify(answers))))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  history.replaceState(null, '', `${location.pathname}?s=${packed}`);
}

/* ========================== Render: intake =============================== */

const form = document.getElementById('questions');
const nameInput = document.getElementById('f-name');
const authorInput = document.getElementById('f-author');
const designerHoursInput = document.getElementById('f-designer-hours');
const contentHoursInput = document.getElementById('f-content-hours');

function renderQuestions() {
  form.innerHTML = QUESTIONS.map(q => {
    const visible = !q.showIf || q.showIf(answers);
    const opts = q.options.map(o => {
      const checked = q.type === 'multi'
        ? (answers[q.id] || []).includes(o.v)
        : answers[q.id] === o.v;
      return `<label class="opt">
        <input type="${q.type === 'multi' ? 'checkbox' : 'radio'}"
               name="${esc(q.id)}" value="${esc(o.v)}" ${checked ? 'checked' : ''}>
        <span><span class="opt-label">${esc(o.label)}</span>
        ${o.note ? `<span class="opt-note">${esc(o.note)}</span>` : ''}</span>
      </label>`;
    }).join('');
    return `<fieldset class="q" data-q="${esc(q.id)}" ${visible ? '' : 'hidden'}>
      <legend>${esc(q.legend)}</legend>
      ${q.hint ? `<p class="q-hint">${esc(q.hint)}</p>` : ''}
      <div class="opts">${opts}</div>
    </fieldset>`;
  }).join('');
}

form.addEventListener('change', (e) => {
  const input = e.target;
  if (!input.name) return;
  const q = QUESTIONS.find(x => x.id === input.name);
  if (!q) return;

  if (q.type === 'multi') {
    const set = new Set(answers[q.id] || []);
    input.checked ? set.add(input.value) : set.delete(input.value);
    answers[q.id] = [...set];
  } else {
    answers[q.id] = input.value;
  }

  // Re-evaluate conditional visibility without losing focus position.
  QUESTIONS.forEach(x => {
    const fs = form.querySelector(`[data-q="${x.id}"]`);
    if (fs) fs.hidden = !!(x.showIf && !x.showIf(answers));
  });

  persist();
  renderSpec();
});

nameInput.addEventListener('input', () => { answers._name = nameInput.value; persist(); renderSpec(); });
authorInput.addEventListener('input', () => { answers._author = authorInput.value; persist(); renderSpec(); });
designerHoursInput.addEventListener('input', () => { answers.designerQuoteHours = designerHoursInput.value; persist(); renderSpec(); });
contentHoursInput.addEventListener('input', () => { answers.contentQuoteHours = contentHoursInput.value; persist(); renderSpec(); });

/* ========================== Render: spec ================================= */

const doc = document.getElementById('spec-doc');

function renderSpec() {
  const plan = buildPlan(answers);
  const t = terms(plan);
  const risks = seedRisks(plan);
  const exclusions = buildExclusions(plan);
  const name = answers._name?.trim() || 'Untitled project';

  const byPhase = phases.map(ph => ({
    ph,
    items: [...plan.included.filter(i => i.step.phase === ph.id).map(i => ({ ...i, in: true })),
            ...plan.omitted.filter(o => o.step.phase === ph.id).map(o => ({ ...o, in: false }))]
           .sort((x, y) => x.step.n - y.step.n)
  })).filter(g => g.items.length);

  doc.innerHTML = `
    <div class="spec-title">
      <h1>${esc(name)}</h1>
      <p class="sub">Project specification &nbsp;·&nbsp; generated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      ${answers._author?.trim() ? ` &nbsp;·&nbsp; prepared by ${esc(answers._author.trim())}` : ''}</p>
    </div>

    <div class="route-call">
      <div>
        <span class="eyebrow" style="color:#A9AABB">Recommended route</span>
        <span class="rc-route">${esc(plan.route)}</span>
      </div>
      <p class="rc-why">${
        plan.rec.reasons.length
          ? `Driven by ${esc(plan.rec.reasons.join(', '))}.`
          : 'No complexity signals beyond a small page count.'
      } ${esc(routes[plan.route].use)}</p>
      ${plan.overridden ? `<span class="rc-override">Manually overridden from ${esc(plan.rec.route)}</span>` : ''}
    </div>

    ${plan.overridden ? `<div class="note note-warn">
      <p><strong>Route manually overridden.</strong> The answers point to
      <strong>${esc(plan.rec.route)}</strong>; this spec is built as
      <strong>${esc(plan.route)}</strong>. Record the reason in the decision log — an overridden
      route is a decision, and it will be questioned later if it is not written down.</p>
    </div>` : ''}

    <div class="spec-stats">
      <div><span class="v">${plan.included.length}</span><span class="l">steps included</span></div>
      <div><span class="v">${plan.omitted.length}</span><span class="l">omitted, with reasons</span></div>
      <div><span class="v">${plan.activeGates.length + plan.activeConditionalGates.length}</span><span class="l">approval gates</span></div>
      <div>${plan.firmHours
        ? `<span class="v">${hrs(plan.total)}</span><span class="l">hrs total — ${hrsRange(plan.baseline, romVariance)} ROM + ${hrs(plan.firmHours)} quotes</span>`
        : `<span class="v">${hrsRange(plan.baseline, romVariance)}</span><span class="l">ROM baseline inc. ${Math.round(plan.contingency * 100)}%</span>`
      }</div>
    </div>

    <section>
      <h2><span class="num">1</span>Project characteristics</h2>
      <p class="sec-note">These are what drive everything below. Conditions force work in or out
      independently of route size.</p>
      ${plan.cond.length ? `<div class="cluster">${plan.cond.map(c =>
        `<span class="badge" title="${esc(CONDITIONS[c].why)}">${esc(CONDITIONS[c].label)}</span>`).join('')}</div>`
        : '<p class="muted">No special conditions — a straightforward brochure build.</p>'}
    </section>

    <section>
      <h2><span class="num">2</span>The plan</h2>
      <p class="sec-note">Omitted steps stay visible with the reason. That is the point: on a
      smaller project steps are skipped deliberately, not forgotten.</p>
      ${byPhase.map(g => `<div class="plan-phase">
        <h3>${g.ph.n}. ${esc(g.ph.name)}</h3>
        ${g.items.map(i => {
          const s = i.step;
          return `<div class="plan-step ${i.in ? '' : 'is-out'}">
            <span class="pn">${s.n}</span>
            <span class="pt">
              <a href="../guide/index.html#/step/${s.id}">${esc(s.title)}</a>
              ${s.isNew ? ' ' + newBadge() : ''}
              <span class="pmeta">${esc(roleName(s.owner))}${
                s.gate !== null && s.gate !== undefined ? ` · Approval: ${approvalName(s.gate)}` : ''}</span>
            </span>
            <span class="ph">${s.quotedSeparately ? 'By designer quote' : (i.in && plan.stepHours(s) ? hrsRange(plan.stepHours(s), romVariance) : '—')}</span>
            ${!i.in ? `<span class="why">Omitted: ${esc(i.why)}</span>` : ''}
            ${i.reason === 'conditional' ? `<span class="why why-trig">Included because: ${
              esc(i.triggeredBy.join(', '))}${i.forced ? ' — forced on despite the ' + plan.route + ' route' : ''}</span>` : ''}
          </div>`;
        }).join('')}
      </div>`).join('')}
    </section>

    <section>
      <h2><span class="num">3</span>Approval gates</h2>
      <p class="sec-note">Each gate names the artefacts being approved and states what work it
      unlocks. Raise one Basecamp ticket per gate.</p>
      <div class="table-scroll"><table>
        <thead><tr><th>Approval</th><th>Approver</th><th>Ticket</th><th>Unlocks</th></tr></thead>
        <tbody>
          ${plan.activeGates.map(g => `<tr>
            <td><strong>${esc(g.title)}</strong>${g.isNew ? ' ' + newBadge() : ''}</td>
            <td>${esc(roleName(g.approver))}</td>
            <td><code>${esc(g.ticket)}</code></td>
            <td>${esc(g.unlocks)}</td>
          </tr>`).join('')}
          ${plan.activeConditionalGates.map(g => `<tr>
            <td><strong>${esc(g.title)}</strong>${g.isNew ? ' ' + newBadge() : ''}
              <span class="badge" style="background:var(--route-standard-bg);color:var(--route-standard-ink)">Conditional</span></td>
            <td>${esc(roleName(g.approver))}</td>
            <td><code>${esc(g.ticket)}</code></td>
            <td>${esc(g.purpose)}</td>
          </tr>`).join('')}
        </tbody>
      </table></div>
    </section>

    <section>
      <h2><span class="num">4</span>Work packages</h2>
      <p class="sec-note">Entry criteria, exit criteria and downstream consequences for every
      included step. This is what allows more than one person to work the project: a package can be
      handed over without the project history.</p>
      <div class="table-scroll"><table>
        <thead><tr><th>Step</th><th>Owner</th><th>Needs first</th><th>Produces</th><th>Blocks</th><th>Hrs</th></tr></thead>
        <tbody>${plan.included.map(({ step: s }) => `<tr>
          <td><strong>${s.n}. ${esc(s.title)}</strong></td>
          <td>${esc(roleName(s.owner))}</td>
          <td>${(s.inputs || []).map(esc).join('<br>') || '—'}</td>
          <td>${(s.deliverables || []).map(d => esc(artefacts[d]?.name || d)).join('<br>') || '—'}</td>
          <td>${(s.blocks || []).map(b => esc(stepById[b]?.title || b)).join('<br>') || '—'}</td>
          <td>${s.quotedSeparately ? 'By designer quote' : (plan.stepHours(s) ? hrsRange(plan.stepHours(s), romVariance) : '—')}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </section>

    <section>
      <h2><span class="num">5</span>Estimate baseline</h2>
      <p class="sec-note">This is an internal yardstick, not a quote. Its value is that every later
      change can be measured against it — without a baseline, scope creep cannot be demonstrated.</p>
      <div class="table-scroll"><table>
        <thead><tr><th>Phase</th><th>Steps</th><th>Hours</th></tr></thead>
        <tbody>
          ${phases.map(ph => {
            const items = plan.included.filter(i => i.step.phase === ph.id);
            if (!items.length) return '';
            const h = items.reduce((t, i) => t + plan.stepHours(i.step), 0);
            return `<tr><td>${ph.n}. ${esc(ph.name)}</td><td>${items.length}</td><td>${hrsRange(h, romVariance)}</td></tr>`;
          }).join('')}
          <tr><td><strong>Steps subtotal</strong></td><td>${plan.included.length}</td><td><strong>${hrsRange(plan.stepsCore, romVariance)}</strong></td></tr>
        </tbody>
      </table></div>

      ${plan.featureRows.length ? `
      <h3 style="margin-top:1.2rem">Feature complexity</h3>
      <p class="sec-note">Additive, not baked into any step above — these are not equally expensive
      despite answering the same question. Configuration-only items are called out explicitly, so this
      is not read as a flat "transactional" tax.</p>
      <div class="table-scroll"><table>
        <thead><tr><th>Feature</th><th>Nature</th><th>Hours</th></tr></thead>
        <tbody>${plan.featureRows.map(f => `<tr>
          <td>${esc(QUESTIONS.find(q => q.id === 'features').options.find(o => o.v === f.id)?.label || f.id)}</td>
          <td>${esc(f.note)}</td>
          <td>${hrsRange(f.hours, romVariance)}</td>
        </tr>`).join('')}
        <tr><td colspan="2"><strong>Feature subtotal</strong></td><td><strong>${hrsRange(plan.featureHours, romVariance)}</strong></td></tr>
        </tbody>
      </table></div>` : ''}

      ${plan.integrationRows.length ? `
      <h3 style="margin-top:1.2rem">Integration complexity</h3>
      <p class="sec-note">Additive, not baked into any step above — an analytics tag and a bespoke API
      are wildly different amounts of work despite both being "an integration".</p>
      <div class="table-scroll"><table>
        <thead><tr><th>Integration</th><th>Nature</th><th>Hours</th></tr></thead>
        <tbody>${plan.integrationRows.map(x => `<tr>
          <td>${esc(QUESTIONS.find(q => q.id === 'integrations').options.find(o => o.v === x.id)?.label || x.id)}</td>
          <td>${esc(x.note)}</td>
          <td>${hrsRange(x.hours, romVariance)}</td>
        </tr>`).join('')}
        <tr><td colspan="2"><strong>Integration subtotal</strong></td><td><strong>${hrsRange(plan.integrationHours, romVariance)}</strong></td></tr>
        </tbody>
      </table></div>` : ''}

      <div class="table-scroll" style="margin-top:1rem"><table>
        <tbody>
          ${plan.estimateLines.map(l => `<tr><td>${esc(l.label)}</td><td>${hrsRange(l.hours, romVariance)}</td></tr>${
            l.note ? `<tr><td colspan="2" class="muted">${esc(l.note)}</td></tr>` : ''}`).join('')}
          <tr><td><strong>Core total</strong> (steps + features + all lines above)</td><td><strong>${hrsRange(plan.core, romVariance)}</strong></td></tr>
          <tr><td>Contingency (${Math.round(plan.contingency * 100)}%, ${esc(plan.route)} route)</td><td>${hrs(plan.contingencyAmount)}</td></tr>
          <tr><td><strong>Baseline (ROM estimate)</strong></td><td><strong>${hrsRange(plan.baseline, romVariance)}</strong></td></tr>
          ${plan.firmLines.map(l => l.hours
            ? `<tr><td>+ ${esc(l.label)}</td><td>${hrs(l.hours)}</td></tr>`
            : `<tr><td colspan="2" class="muted">${esc(l.prompt)}</td></tr>`).join('')}
          ${plan.firmHours ? `<tr><td><strong>Grand total</strong></td><td><strong>${hrs(plan.total)}</strong></td></tr>` : ''}
        </tbody>
      </table></div>
      <div class="note note-warn">
        <p><strong>Calibrate these figures.</strong> Every hour figure on this page is conjecture, not
        measured Chillibyte data — that's the point of presenting it this way. We don't currently know
        how long any of this takes, and this estimate is expected to change as real projects correct it.
        Every editable number lives in one place: <code>data/effort-assumptions.js</code>, clearly laid
        out and commented so it's easy to find and adjust. The per-step hours interpolate continuously
        between three calibration points (light/standard/full) rather than a lookup for whichever route
        applies. Record actuals against this baseline on the next three projects and correct the figures
        in that file. Larger or ongoing SEO work beyond the flat line above is scoped and quoted
        separately post-launch — see exclusions.</p>
      </div>
    </section>

    <section>
      <h2><span class="num">6</span>Artefacts and templates</h2>
      <p class="sec-note">Exactly what this project needs. Nothing else.</p>
      <div class="table-scroll"><table>
        <thead><tr><th>Artefact</th><th>Format</th><th>Gate</th><th>Download</th></tr></thead>
        <tbody>${plan.artefactList.sort((a, b) => (a.gate ?? 99) - (b.gate ?? 99)).map(a => `<tr>
          <td><strong>${esc(a.name)}</strong>${a.isNew ? ' ' + newBadge() : ''}</td>
          <td>${a.type === 'other' ? 'Design tool' : '.' + a.type}${a.tab ? ` → ${esc(a.tab)}` : ''}</td>
          <td>${a.gate !== null && a.gate !== undefined ? 'Approval: ' + approvalName(a.gate) : 'Ongoing'}</td>
          <td>${a.file ? `<a href="../templates/${a.type === 'xlsx' ? 'xlsx' : 'docx'}/${a.file}" download>Download</a>` : '—'}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </section>

    <section>
      <h2><span class="num">7</span>Roles required</h2>
      <p class="sec-note">Every role listed here is needed for this project specifically — "optional" in the
      general catalogue (Copywriter, SEO / Analytics aren't staffed on every project) doesn't mean optional
      once one of their steps is actually in the plan below.</p>
      <div class="table-scroll"><table>
        <thead><tr><th>Role</th><th>Responsibility</th></tr></thead>
        <tbody>${plan.rolesInPlay.map(r => `<tr>
          <td><strong>${esc(roles[r].name)}</strong></td>
          <td>${esc(roles[r].owns)}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </section>

    <section>
      <h2><span class="num">8</span>Commercial terms to agree at the studio brief and discovery approvals</h2>
      <p class="sec-note">Agreeing these takes minutes at the start and is close to impossible to
      impose later.</p>
      <div class="table-scroll"><table>
        <tbody>
          <tr><th>Named approver</th><td>${esc(t.approver)}</td></tr>
          <tr><th>Approval response window</th><td><strong>${t.slaDays} working days.</strong> ${esc(t.slaNote)} Silence past the window pauses the project and moves the timeline — it does not mean yes.</td></tr>
          <tr><th>Design concepts included</th><td>${t.concepts}</td></tr>
          <tr><th>Revision rounds included</th><td>${t.revisionRounds} on the chosen concept, plus ${t.stagingRounds} consolidated round at staging. Further rounds are a variation.</td></tr>
          <tr><th>Support matrix</th><td>To be agreed at the discovery approval and recorded. QA tests against it and nothing beyond it.</td></tr>
          <tr><th>Accessibility target</th><td>${
            answers.accessibility === 'formal' ? 'Formally required — confirm the exact standard and whether external audit is expected.'
            : answers.accessibility === 'aa' ? 'WCAG 2.2 AA, tested at the internal QA approval.'
            : 'No contractual standard. We work to AA by default, but it is not a commitment — consider making it one.'}</td></tr>
          <tr><th>Defect warranty</th><td>${t.warrantyDays} days from launch. Defects fixed free; changes quoted, inside the window or outside it.</td></tr>
          <tr><th>Change control</th><td>Any change adding effort gets an hours figure. Chargeable changes become a variation order <em>before</em> the work happens.</td></tr>
        </tbody>
      </table></div>
    </section>

    <section>
      <h2><span class="num">9</span>Risks and assumptions</h2>
      <p class="sec-note">Seeded from your answers. Copy into the risk log and add project-specific
      items — this is a starting position, not a complete register.</p>
      <div class="table-scroll"><table>
        <thead><tr><th>Risk</th><th>Impact if realised</th><th>Mitigation</th><th>Owner</th></tr></thead>
        <tbody>${risks.map(r => `<tr>
          <td><strong>${esc(r.risk)}</strong></td><td>${esc(r.impact)}</td>
          <td>${esc(r.mitigation)}</td><td>${esc(r.owner)}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </section>

    <section>
      <h2><span class="num">10</span>Exclusions</h2>
      <div class="exclusions">
        <h3>Not included in this project</h3>
        <p class="client-safe">Written to be pasted into a proposal or a studio brief.
        This list is the project's scope defence — every line is something that would otherwise
        be assumed to be included.</p>
        <ul class="list-cross">${exclusions.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      </div>
    </section>
  `;
}

/* ========================== Exports ====================================== */

function toMarkdown() {
  const plan = buildPlan(answers);
  const t = terms(plan);
  const name = answers._name?.trim() || 'Untitled project';
  const L = [];

  L.push(`# ${name} — project specification`, '');
  L.push(`**Route:** ${plan.route}${plan.overridden ? ` (overridden from ${plan.rec.route})` : ''}`);
  L.push(`**Baseline estimate (ROM, ±${Math.round(romVariance * 100)}%):** ${hrsRange(plan.baseline, romVariance)}${plan.firmHours ? ` + ${hrs(plan.firmHours)} firm quotes = **${hrs(plan.total)} grand total**` : ''}`);
  L.push(`**Conditions:** ${plan.cond.map(c => CONDITIONS[c].label).join(', ') || 'none'}`, '');

  L.push('## Plan', '');
  for (const ph of phases) {
    const items = plan.included.filter(i => i.step.phase === ph.id);
    const out = plan.omitted.filter(o => o.step.phase === ph.id);
    if (!items.length && !out.length) continue;
    L.push(`### ${ph.n}. ${ph.name}`, '');
    for (const i of items) {
      L.push(`- [ ] **${i.step.n}. ${i.step.title}** — ${roleName(i.step.owner)}${
        i.step.gate != null ? `, ${approvalTicket(i.step.gate)}` : ''}, ${plan.stepHours(i.step)} hrs${
        i.reason === 'conditional' ? ` _(triggered by: ${i.triggeredBy.join(', ')})_` : ''}`);
    }
    for (const o of out) L.push(`- ~~${o.step.n}. ${o.step.title}~~ — omitted: ${o.why}`);
    L.push('');
  }

  if (plan.featureRows.length) {
    L.push('## Feature complexity', '');
    for (const f of plan.featureRows) {
      const label = QUESTIONS.find(q => q.id === 'features').options.find(o => o.v === f.id)?.label || f.id;
      L.push(`- **${label}** — ${f.hours} hrs (${f.note})`);
    }
    L.push('');
  }

  if (plan.integrationRows.length) {
    L.push('## Integration complexity', '');
    for (const x of plan.integrationRows) {
      const label = QUESTIONS.find(q => q.id === 'integrations').options.find(o => o.v === x.id)?.label || x.id;
      L.push(`- **${label}** — ${x.hours} hrs (${x.note})`);
    }
    L.push('');
  }

  L.push('## Estimate lines', '');
  for (const l of plan.estimateLines) L.push(`- **${l.label}** — ${l.hours} hrs`);
  for (const l of plan.firmLines) L.push(l.hours ? `- **${l.label}** — ${l.hours} hrs` : `- _${l.prompt}_`);
  L.push('');

  L.push('## Gates', '');
  for (const g of plan.activeGates) L.push(`- **${g.ticket}** — ${roleName(g.approver)}`);
  for (const g of plan.activeConditionalGates) L.push(`- **${g.title}** (conditional) — \`${g.ticket}\``);
  L.push('');

  L.push('## Commercial terms', '');
  L.push(`- Approval window: ${t.slaDays} working days. Silence pauses the project.`);
  L.push(`- Design concepts: ${t.concepts}. Revision rounds: ${t.revisionRounds} + ${t.stagingRounds} at staging.`);
  L.push(`- Defect warranty: ${t.warrantyDays} days. Changes quoted.`);
  L.push('- Chargeable changes become a variation order before the work happens.', '');

  L.push('## Risks', '');
  for (const r of seedRisks(plan)) L.push(`- **${r.risk}** → ${r.impact}. _Mitigation:_ ${r.mitigation} (${r.owner})`);
  L.push('');

  L.push('## Exclusions', '');
  for (const x of buildExclusions(plan)) L.push(`- ${x}`);
  L.push('');

  return L.join('\n');
}

function toCSV() {
  const plan = buildPlan(answers);
  const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = [
    ['Step', 'Title', 'Phase', 'Status', 'Reason', 'Owner', 'Approver', 'Approval', 'Estimate (hrs)', 'Actual (hrs)', 'Deliverables', 'Blocks']
  ];
  for (const i of plan.included) {
    const s = i.step;
    rows.push([s.n, s.title, phases.find(p => p.id === s.phase).name, 'Included',
      i.reason === 'conditional' ? 'Triggered by: ' + i.triggeredBy.join('; ') : `${plan.route} route`,
      roleName(s.owner), roleName(s.approver), s.gate != null ? approvalTicket(s.gate) : '',
      plan.stepHours(s), '',
      (s.deliverables || []).map(d => artefacts[d]?.name || d).join('; '),
      (s.blocks || []).map(b => stepById[b]?.title || b).join('; ')]);
  }
  for (const o of plan.omitted) {
    rows.push([o.step.n, o.step.title, phases.find(p => p.id === o.step.phase).name,
      'Omitted', o.why, '', '', o.step.gate != null ? approvalTicket(o.step.gate) : '', 0, '', '', '']);
  }
  for (const f of plan.featureRows) {
    const label = QUESTIONS.find(x => x.id === 'features').options.find(o => o.v === f.id)?.label || f.id;
    rows.push(['', `Feature: ${label}`, 'Feature complexity', 'Included', f.note, '', '', '', f.hours, '', '', '']);
  }
  for (const x of plan.integrationRows) {
    const label = QUESTIONS.find(q => q.id === 'integrations').options.find(o => o.v === x.id)?.label || x.id;
    rows.push(['', `Integration: ${label}`, 'Integration complexity', 'Included', x.note, '', '', '', x.hours, '', '', '']);
  }
  for (const l of plan.estimateLines) {
    rows.push(['', l.label, 'Estimate line', 'Included', l.note || '', '', '', '', l.hours, '', '', '']);
  }
  for (const l of plan.firmLines) {
    rows.push(['', l.label, 'Firm quote', l.hours ? 'Included' : 'Not entered',
      l.hours ? '' : l.prompt, '', '', '', l.hours, '', '', '']);
  }
  return rows.map(r => r.map(q).join(',')).join('\r\n');
}

function download(filename, text, mime = 'text/plain') {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

const slug = () => (answers._name || 'project').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'project';

/* ========================== Toast ======================================== */

const toast = Object.assign(document.createElement('div'), { className: 'toast' });
document.body.appendChild(toast);
let toastTimer;
function say(msg) {
  toast.textContent = msg;
  toast.classList.add('is-up');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-up'), 2400);
}

/* ========================== Wiring ======================================= */

document.getElementById('btn-print').addEventListener('click', () => window.print());

document.getElementById('btn-md').addEventListener('click', (e) => {
  copyText(toMarkdown(), e.currentTarget);
  say('Markdown copied — paste into Basecamp');
});

document.getElementById('btn-csv').addEventListener('click', () => {
  download(`${slug()}-plan.csv`, toCSV(), 'text/csv');
  say('CSV downloaded — import into the gate tracker');
});

document.getElementById('btn-share').addEventListener('click', (e) => {
  persist();
  copyText(location.href, e.currentTarget);
  say('Share link copied — it reproduces this exact spec');
});

document.getElementById('btn-reset').addEventListener('click', () => {
  answers = { ...DEFAULTS, _name: '', _author: '' };
  localStorage.removeItem(STORE);
  history.replaceState(null, '', location.pathname);
  boot();
  say('Reset');
});

document.getElementById('btn-example').addEventListener('click', () => {
  answers = {
    ...DEFAULTS,
    _name: example.name,
    _author: '',
    projectType: 'redesign', organicValue: 'significant', urlCount: 'mid',
    pageCount: 's', blocks: 'some', brand: 'established',
    contentSource: 'client', features: ['forms', 'gated'], integrations: ['hubspot'],
    multilingual: 'no', languageCount: '1', stakeholders: 'few', accessibility: 'aa',
    deadline: 'fixed', clientMaturity: 'new', routeOverride: 'auto'
  };
  boot();
  say(`Loaded ${example.name} — the guide's worked example`);
});

/* ========================== Boot ========================================= */

function boot() {
  nameInput.value = answers._name || '';
  authorInput.value = answers._author || '';
  designerHoursInput.value = answers.designerQuoteHours || '';
  contentHoursInput.value = answers.contentQuoteHours || '';
  renderQuestions();
  persist();
  renderSpec();
}

boot();
