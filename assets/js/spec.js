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
  artefacts, conditions as CONDITIONS, roleName
} from '../../data/process.js';
import { steps, stepById } from '../../data/steps.js';
import { project as example } from '../../data/worked-example.js';
import { esc, routeBadges, newBadge, copyText, hrs } from './ui.js';

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
    id: 'templates', type: 'single',
    legend: 'How many distinct page templates?',
    hint: 'This drives design and build effort far more reliably than page count does.',
    options: [
      { v: 'few', label: '1–2', note: 'Essentially one layout with variations' },
      { v: 'some', label: '3–5', note: 'Typical B2B service site' },
      { v: 'many', label: '6 or more', note: 'Each one is a design and a build' }
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
      { v: 'booking', label: 'Booking or scheduling' },
      { v: 'portal', label: 'Customer portal or login area' },
      { v: 'membership', label: 'Membership or subscriptions' }
    ]
  },
  {
    id: 'integrations', type: 'single',
    legend: 'How many third-party systems does it connect to?',
    hint: 'Every integration is a credential you need before build, not during it.',
    options: [
      { v: 'none', label: 'None' },
      { v: 'one', label: 'One or two', note: 'CRM, mail platform, analytics' },
      { v: 'several', label: 'Three or more', note: 'Technical architecture needs approving separately' }
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
  pageCount: 's', templates: 'some', brand: 'established',
  contentSource: 'client', features: ['forms'], integrations: 'one',
  multilingual: 'no', stakeholders: 'few', accessibility: 'aa',
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
  if (a.integrations !== 'none') c.add('integrations');
  if (f.includes('forms') || f.includes('gated')) c.add('forms');
  if (['ecommerce', 'booking', 'portal', 'membership'].some(x => f.includes(x))) c.add('transactional');
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
  add({ few: 0, some: 1, many: 3 }[a.templates] || 0,
      { few: '', some: '3–5 templates', many: '6+ templates' }[a.templates]);

  if (cond.includes('multilingual'))     add(4, 'multilingual');
  if (cond.includes('transactional'))    add(4, 'transactional features');
  if (cond.includes('content-migration'))add(3, 'content migration');
  if (a.integrations === 'several')      add(3, 'three or more integrations');
  else if (a.integrations === 'one')     add(1, 'an integration');
  if (cond.includes('high-seo-risk'))    add(2, 'meaningful organic traffic at risk');
  if (cond.includes('many-stakeholders'))add(2, 'four or more approvers');
  if (a.brand === 'new')                 add(2, 'a new brand identity');
  if (a.accessibility === 'formal')      add(2, 'a formal accessibility requirement');

  const route = score >= 9 ? 'full' : score >= 3 ? 'standard' : 'light';
  return { route, score, reasons: reasons.filter(Boolean) };
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
  const core = included.reduce((t, i) => t + (i.step.effortBand[route] || 0), 0);
  const total = core * (1 + contingency);

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
    included, omitted, core, contingency, total,
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
         'Content deadline and escalation agreed in writing at Gate 4. Named owner per page.',
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
         'Single named approver captured at Gate 1. Contradictions go back to the client to resolve.',
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
         'Tighten the approval SLA and state the revision allowance explicitly at Gate 0.',
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
  if (a.integrations === 'none')
    out.push('Integration with any third-party system.');

  out.push('Ongoing SEO, content marketing, paid media and analytics reporting.');
  out.push('Hosting, maintenance and support beyond the defect warranty window.');
  out.push('Support for browsers or devices outside the agreed support matrix.');
  out.push('Any page, template, component or feature not listed in the approved sitemap and block inventory.');

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
    approver: 'One named individual, captured at Gate 1. Others may comment; only the named approver approves.'
  };
}

/* ========================== State ======================================== */

const STORE = 'cb-spec-state';
let answers = load();

function load() {
  const fromUrl = new URLSearchParams(location.search).get('s');
  if (fromUrl) {
    try {
      const decoded = JSON.parse(decodeURIComponent(escape(atob(fromUrl.replace(/-/g, '+').replace(/_/g, '/')))));
      return { ...DEFAULTS, ...decoded };
    } catch { /* fall through to local storage */ }
  }
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (saved) return { ...DEFAULTS, ...saved };
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
      <div><span class="v">${Math.round(plan.total)}</span><span class="l">hrs baseline inc. ${Math.round(plan.contingency * 100)}%</span></div>
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
                s.gate !== null && s.gate !== undefined ? ` · Gate ${s.gate}` : ''}</span>
            </span>
            <span class="ph">${i.in && s.effortBand[plan.route] ? hrs(s.effortBand[plan.route]) : '—'}</span>
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
        <thead><tr><th>Gate</th><th>Approver</th><th>Ticket</th><th>Unlocks</th></tr></thead>
        <tbody>
          ${plan.activeGates.map(g => `<tr>
            <td><strong>${g.n}. ${esc(g.title)}</strong>${g.isNew ? ' ' + newBadge() : ''}</td>
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
          <td>${s.effortBand[plan.route] || '—'}</td>
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
            const h = items.reduce((t, i) => t + (i.step.effortBand[plan.route] || 0), 0);
            return `<tr><td>${ph.n}. ${esc(ph.name)}</td><td>${items.length}</td><td>${h}</td></tr>`;
          }).join('')}
          <tr><td><strong>Core total</strong></td><td>${plan.included.length}</td><td><strong>${plan.core}</strong></td></tr>
          <tr><td>Contingency (${Math.round(plan.contingency * 100)}%, ${esc(plan.route)} route)</td><td>—</td><td>${Math.round(plan.total - plan.core)}</td></tr>
          <tr><td><strong>Baseline</strong></td><td>—</td><td><strong>${Math.round(plan.total)} hrs</strong></td></tr>
        </tbody>
      </table></div>
      <div class="note note-warn">
        <p><strong>Calibrate these figures.</strong> The per-step hours are a starting position, not
        measured Chillibyte data. Record actuals against this baseline on the next three projects and
        adjust the effort bands in <code>data/steps.js</code>. The variance is worth more than the
        estimate.</p>
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
          <td>${a.gate !== null && a.gate !== undefined ? 'Gate ' + a.gate : 'Ongoing'}</td>
          <td>${a.file ? `<a href="../templates/${a.type === 'xlsx' ? 'xlsx' : 'docx'}/${a.file}" download>Download</a>` : '—'}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </section>

    <section>
      <h2><span class="num">7</span>Roles required</h2>
      <div class="table-scroll"><table>
        <thead><tr><th>Role</th><th>Responsibility</th></tr></thead>
        <tbody>${plan.rolesInPlay.map(r => `<tr>
          <td><strong>${esc(roles[r].name)}</strong>${roles[r].optional ? ' <span class="badge">Optional</span>' : ''}</td>
          <td>${esc(roles[r].owns)}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </section>

    <section>
      <h2><span class="num">8</span>Commercial terms to agree at Gate 0/1</h2>
      <p class="sec-note">Agreeing these takes minutes at the start and is close to impossible to
      impose later.</p>
      <div class="table-scroll"><table>
        <tbody>
          <tr><th>Named approver</th><td>${esc(t.approver)}</td></tr>
          <tr><th>Approval response window</th><td><strong>${t.slaDays} working days.</strong> ${esc(t.slaNote)} Silence past the window pauses the project and moves the timeline — it does not mean yes.</td></tr>
          <tr><th>Design concepts included</th><td>${t.concepts}</td></tr>
          <tr><th>Revision rounds included</th><td>${t.revisionRounds} on the chosen concept, plus ${t.stagingRounds} consolidated round at staging. Further rounds are a variation.</td></tr>
          <tr><th>Support matrix</th><td>To be agreed at Gate 1 and recorded. QA tests against it and nothing beyond it.</td></tr>
          <tr><th>Accessibility target</th><td>${
            answers.accessibility === 'formal' ? 'Formally required — confirm the exact standard and whether external audit is expected.'
            : answers.accessibility === 'aa' ? 'WCAG 2.2 AA, tested at Gate 11.'
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
        <p class="client-safe">Written to be pasted into a proposal or a Gate 0 handover.
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
  L.push(`**Baseline estimate:** ${Math.round(plan.total)} hrs (${plan.core} core + ${Math.round(plan.contingency * 100)}% contingency)`);
  L.push(`**Conditions:** ${plan.cond.map(c => CONDITIONS[c].label).join(', ') || 'none'}`, '');

  L.push('## Plan', '');
  for (const ph of phases) {
    const items = plan.included.filter(i => i.step.phase === ph.id);
    const out = plan.omitted.filter(o => o.step.phase === ph.id);
    if (!items.length && !out.length) continue;
    L.push(`### ${ph.n}. ${ph.name}`, '');
    for (const i of items) {
      L.push(`- [ ] **${i.step.n}. ${i.step.title}** — ${roleName(i.step.owner)}${
        i.step.gate != null ? `, Gate ${i.step.gate}` : ''}, ${i.step.effortBand[plan.route] || 0} hrs${
        i.reason === 'conditional' ? ` _(triggered by: ${i.triggeredBy.join(', ')})_` : ''}`);
    }
    for (const o of out) L.push(`- ~~${o.step.n}. ${o.step.title}~~ — omitted: ${o.why}`);
    L.push('');
  }

  L.push('## Gates', '');
  for (const g of plan.activeGates) L.push(`- **Gate ${g.n}: ${g.title}** — ${roleName(g.approver)} — \`${g.ticket}\``);
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
    ['Step', 'Title', 'Phase', 'Status', 'Reason', 'Owner', 'Approver', 'Gate', 'Estimate (hrs)', 'Actual (hrs)', 'Deliverables', 'Blocks']
  ];
  for (const i of plan.included) {
    const s = i.step;
    rows.push([s.n, s.title, phases.find(p => p.id === s.phase).name, 'Included',
      i.reason === 'conditional' ? 'Triggered by: ' + i.triggeredBy.join('; ') : `${plan.route} route`,
      roleName(s.owner), roleName(s.approver), s.gate ?? '',
      s.effortBand[plan.route] || 0, '',
      (s.deliverables || []).map(d => artefacts[d]?.name || d).join('; '),
      (s.blocks || []).map(b => stepById[b]?.title || b).join('; ')]);
  }
  for (const o of plan.omitted) {
    rows.push([o.step.n, o.step.title, phases.find(p => p.id === o.step.phase).name,
      'Omitted', o.why, '', '', o.step.gate ?? '', 0, '', '', '']);
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
    pageCount: 's', templates: 'some', brand: 'established',
    contentSource: 'client', features: ['forms', 'gated'], integrations: 'one',
    multilingual: 'no', stakeholders: 'few', accessibility: 'aa',
    deadline: 'fixed', clientMaturity: 'new', routeOverride: 'auto'
  };
  boot();
  say(`Loaded ${example.name} — the guide's worked example`);
});

/* ========================== Boot ========================================= */

function boot() {
  nameInput.value = answers._name || '';
  authorInput.value = answers._author || '';
  renderQuestions();
  persist();
  renderSpec();
}

boot();
