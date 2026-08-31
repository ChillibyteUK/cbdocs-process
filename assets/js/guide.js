/* ---------------------------------------------------------------------------
   guide.js — the interactive process guide.
   Everything rendered here derives from data/. Nothing is hard-coded.
--------------------------------------------------------------------------- */

import {
  phases, roles, routes, routeOrder, gates, conditionalGates,
  artefacts, conditions, rules, meta, roleName
} from '../../data/process.js';
import { steps, stepById } from '../../data/steps.js';
import { project, examples } from '../../data/worked-example.js';
import { gaps, gapStats } from '../../data/gaps.js';
import {
  esc, renderBlocks, blocksToText, routeBadges, newBadge, gateBadge,
  copyText, hrs, debounce
} from './ui.js';

/* ========================== State ======================================== */

const STORE_KEY = 'cb-guide-route';
let route = localStorage.getItem(STORE_KEY) || 'standard';
if (!routeOrder.includes(route)) route = 'standard';

const view = document.getElementById('view');
const railNav = document.getElementById('rail-nav');
const pager = document.getElementById('pager');
const routeNote = document.getElementById('route-note');
const rail = document.getElementById('rail');

/* --- Which steps apply on the current route? ------------------------------
   A step is included if the route lists it, OR if it is conditionally
   triggered. Conditional steps are shown as "forced" because that is the
   point being demonstrated: inclusion follows risk, not project size.
-------------------------------------------------------------------------- */

function stepState(step) {
  const inRoute = step.routes.includes(route);
  const isConditional = (step.conditions || []).length > 0;
  if (isConditional) {
    return { included: true, conditional: true, forced: !inRoute };
  }
  if (inRoute) return { included: true, conditional: false, forced: false };
  return {
    included: false,
    conditional: false,
    forced: false,
    why: (step.omitReason && step.omitReason[route]) ||
         `Not part of the ${route} route.`
  };
}

/* --- Totals, counted honestly ---------------------------------------------
   Conditional steps are not "always included on this route" — a greenfield
   brochure site with no forms triggers none of them. So they are counted
   separately rather than folded into the headline number.
-------------------------------------------------------------------------- */

function routeTotals() {
  const core = [], conditional = [], omitted = [];
  for (const s of steps) {
    const st = stepState(s);
    if (!st.included) omitted.push(s);
    else if (st.conditional) conditional.push(s);
    else core.push(s);
  }
  const eff = (list) => list.reduce((t, s) => t + (s.effortBand[route] || 0), 0);
  const coreEffort = eff(core);
  const condEffort = eff(conditional);
  return {
    core, conditional, omitted,
    coreEffort, condEffort,
    maxEffort: coreEffort + condEffort,
    contingency: routes[route].contingency
  };
}

/* ========================== Rail ========================================= */

function renderRail() {
  railNav.innerHTML = phases.map(ph => {
    const items = steps.filter(s => s.phase === ph.id).map(s => {
      const st = stepState(s);
      const cls = [
        !st.included ? 'is-omitted' : '',
        st.conditional ? 'is-conditional' : ''
      ].filter(Boolean).join(' ');
      const why = !st.included ? ` title="Omitted on ${route}: ${esc(st.why)}"` : '';
      return `<li><a href="#/step/${s.id}" class="${cls}"${why} data-step="${s.id}">
        <span class="step-n">${s.n}</span>
        <span class="step-label">${esc(s.title)}</span>
      </a></li>`;
    }).join('');

    return `<div class="rail-phase">
      <p class="rail-phase-title"><span class="n">${ph.n}</span> ${esc(ph.name)}</p>
      <ul>${items}</ul>
    </div>`;
  }).join('');

  const t = routeTotals();
  routeNote.innerHTML =
    `<strong>${t.core.length} steps always</strong>, ${t.conditional.length} only if triggered, ` +
    `${t.omitted.length} omitted. Core effort <strong>${hrs(t.coreEffort)}</strong>, ` +
    `up to <strong>${hrs(t.maxEffort)}</strong> with every conditional. ` +
    `<span title="Conditionally triggered">◆</span> = triggered by project risk, not route size.`;

  markCurrent();
}

function markCurrent() {
  const id = currentStepId();
  railNav.querySelectorAll('a').forEach(a => {
    if (a.dataset.step === id) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.querySelectorAll('.rail-nav-ref a').forEach(a => {
    if (a.getAttribute('href') === location.hash) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

function currentStepId() {
  const m = location.hash.match(/^#\/step\/([\w-]+)/);
  return m ? m[1] : null;
}

/* ========================== Views ======================================== */

function renderOverview() {
  const t = routeTotals();
  const cont = t.contingency;
  const gateCount = gates.filter(g => g.routes.includes(route)).length;

  const pipeline = phases.map(ph => {
    const items = steps.filter(s => s.phase === ph.id).map(s => {
      const st = stepState(s);
      const cls = [
        'pipe-step',
        !st.included ? 'is-omitted' : '',
        st.conditional ? 'is-forced' : ''
      ].filter(Boolean).join(' ');
      const badges = [
        s.gate !== null && s.gate !== undefined ? gateBadge(s.gate) : '',
        s.isNew ? newBadge(s.newBecause) : '',
        st.conditional ? `<span class="badge" style="background:var(--route-standard-bg);color:var(--route-standard-ink)">Conditional</span>` : ''
      ].join('');
      return `<a class="${cls}" href="#/step/${s.id}">
        <span class="n">Step ${s.n}</span>
        <span class="t">${esc(s.title)}</span>
        <span class="s">${esc(s.summary)}</span>
        ${!st.included ? `<span class="omit-why">Omitted: ${esc(st.why)}</span>` : ''}
        ${st.conditional ? `<span class="omit-why" style="color:var(--route-standard-ink)">Only if: ${
          esc(s.conditions.map(c => conditions[c].label).join(' / '))}</span>` : ''}
        <span class="badges">${badges}</span>
      </a>`;
    }).join('');

    return `<section class="pipe-phase">
      <div class="pipe-phase-head">
        <h2>${ph.n}. ${esc(ph.name)}</h2>
        <span class="tag">${esc(ph.tagline)}</span>
      </div>
      <div class="pipe-steps">${items}</div>
    </section>`;
  }).join('');

  view.innerHTML = `
    <div class="view-head">
      <span class="eyebrow eyebrow-accent">Website delivery process · v${esc(meta.version)}</span>
      <h1>The order of play</h1>
      <hr class="rule-brand">
      <p class="lede">Twenty work packages across five phases. Each one narrows uncertainty before
      the next begins. Use the route toggle in the sidebar to see what a light, standard or full
      project actually involves — omitted steps stay visible, with the reason.</p>
    </div>

    <div class="statrow">
      <div class="stat"><span class="v">${t.core.length}</span><span class="l">steps always run on ${route}</span></div>
      <div class="stat"><span class="v">${t.conditional.length}</span><span class="l">more, only if triggered by risk</span></div>
      <div class="stat"><span class="v">${gateCount}</span><span class="l">approval gates</span></div>
      <div class="stat"><span class="v">${Math.round(t.coreEffort * (1 + cont))}–${Math.round(t.maxEffort * (1 + cont))}</span><span class="l">hours inc. ${Math.round(cont * 100)}% contingency</span></div>
    </div>

    <div class="note note-new">
      <p><strong>Reading this for the first time?</strong> Start at
      <a href="#/step/${steps[0].id}">Step 1</a> and use <kbd>j</kbd> to move forward. Every step
      carries the same worked example — <strong>${esc(project.name)}</strong> — so read end to end
      it is one project rather than twenty samples.</p>
    </div>

    <div class="pipeline">${pipeline}</div>

    <section class="sec">
      <h2><span class="sec-hint">Sequencing</span>What can run alongside what</h2>
      <div class="lanes">
        <div class="card card-accent-2">
          <h3>Can run in parallel</h3>
          <ul class="list-check">
            <li>Existing site audit with discovery</li>
            <li>Competitor review with discovery</li>
            <li>Brand asset collection with sitemap work</li>
            <li>Content inventory with sitemap work</li>
            <li>Style research with page outlining</li>
            <li>Block library review with page outlining</li>
            <li>Local technical setup with design development</li>
            <li>Access and credentials chasing with development</li>
          </ul>
        </div>
        <div class="card card-accent">
          <h3>Should not start early</h3>
          <ul class="list-cross">
            <li>Full visual design before wireframes and style direction</li>
            <li>New block design before block inventory</li>
            <li>Final copy before page outlines</li>
            <li>Development before build specification</li>
            <li>Client design presentation before internal design approval</li>
            <li>Launch preparation before compliance is cleared</li>
          </ul>
        </div>
      </div>
    </section>
  `;
  pager.innerHTML = '';
}

/* --- Step view ------------------------------------------------------------ */

function renderStep(id) {
  const s = stepById[id];
  if (!s) return renderOverview();

  const st = stepState(s);
  const gate = s.gate !== null && s.gate !== undefined
    ? gates.find(g => g.n === s.gate) : null;
  const cGate = s.conditionalGate
    ? conditionalGates.find(g => g.id === s.conditionalGate) : null;
  const ex = examples[s.id];
  const ph = phases.find(p => p.id === s.phase);

  const artefactList = (ids) => ids
    .map(a => artefacts[a])
    .filter(Boolean);

  const templateLinks = artefactList(s.templates || []).map(a => {
    if (!a.file) {
      return `<li>${esc(a.name)} <span class="muted">— produced in your design tool, not a document template</span></li>`;
    }
    const href = `../templates/${a.type === 'xlsx' ? 'xlsx' : 'docx'}/${a.file}`;
    const tab = a.tab ? ` <span class="muted">→ ${esc(a.tab)} tab</span>` : '';
    return `<li><a href="${href}" download>${esc(a.name)}</a>
      <span class="badge">.${a.type}</span>${tab}
      ${a.isNew ? newBadge() : ''}</li>`;
  }).join('');

  const linkStep = (sid) => {
    const t = stepById[sid];
    return t ? `<a href="#/step/${t.id}">${esc(t.title)}</a>` : esc(sid.replace(/-/g, ' '));
  };

  view.innerHTML = `
    <div class="view-head">
      <span class="step-num">${s.n}</span>
      <span class="eyebrow">${ph.n}. ${esc(ph.name)} &nbsp;·&nbsp; ${esc(s.docPhase)}</span>
      <h1>${esc(s.title)}</h1>
      <hr class="rule-brand">
      <p class="lede">${esc(s.summary)}</p>
      <div class="step-meta">
        ${routeBadges(s.routes)}
        ${gate ? gateBadge(gate.n) : ''}
        ${s.isNew ? newBadge(s.newBecause) : ''}
        ${st.conditional ? `<span class="badge" style="background:var(--route-standard-bg);color:var(--route-standard-ink)">Conditional</span>` : ''}
      </div>
    </div>


    ${!st.included ? `<div class="note note-warn">
      <p><strong>Omitted on the ${route} route.</strong> ${esc(st.why)}
      It is still documented here — omission is a decision to record, not a step to forget.</p>
    </div>` : ''}

    ${st.conditional ? `<div class="note">
      <p><strong>Conditionally triggered.</strong> ${esc(s.conditionNote || '')}</p>
      <p style="margin-top:.5rem">Triggers: ${
        s.conditions.map(c => `<strong>${esc(conditions[c].label)}</strong>`).join(' · ')
      }</p>
    </div>` : ''}

    <section class="sec">
      <h2><span class="sec-hint">At a glance</span>Who, when and how long</h2>
      <dl class="glance">
        <div><dt>Owner</dt><dd>${esc(roleName(s.owner))}</dd></div>
        <div><dt>Contributors</dt><dd>${(s.contributors || []).map(r => esc(roleName(r))).join(', ') || '—'}</dd></div>
        <div><dt>Approver</dt><dd>${esc(roleName(s.approver))}</dd></div>
        <div><dt>Gate</dt><dd>${gate ? `Gate ${gate.n} — ${esc(gate.title)}` : (cGate ? esc(cGate.title) : 'No gate')}</dd></div>
        <div><dt>Effort (${route})</dt><dd>${s.effortBand[route] ? hrs(s.effortBand[route]) : 'n/a'}</dd></div>
        <div><dt>Routes</dt><dd>${s.routes.map(r => esc(r)).join(' · ')}</dd></div>
      </dl>
      <p><strong>Why it exists.</strong> ${esc(s.why)}</p>
    </section>

    <section class="sec prose">
      <h2><span class="sec-hint">In depth</span>What this step actually is</h2>
      ${s.detail.split('\n\n').map(p => `<p>${esc(p.trim())}</p>`).join('')}
    </section>

    <section class="sec">
      <h2><span class="sec-hint">Work package</span>Entry criteria, exit criteria, consequences</h2>
      <p>This is what lets the step be handed to someone without the project history in their head.
      Nothing starts until its inputs exist; nothing finishes until its done-when conditions are met.</p>
      <div class="wp">
        <div class="wp-col wp-in">
          <h3>Inputs required</h3>
          <ul>${(s.inputs || []).map(i => `<li>${esc(i)}</li>`).join('') || '<li>—</li>'}</ul>
        </div>
        <div class="wp-col wp-out">
          <h3>Deliverables</h3>
          <ul>${artefactList(s.deliverables || []).map(a =>
            `<li>${esc(a.name)}${a.isNew ? ' ' + newBadge() : ''}</li>`).join('') || '<li>No document artefact</li>'}</ul>
        </div>
        <div class="wp-col wp-done">
          <h3>Done when</h3>
          <ul>${(s.doneWhen || []).map(i => `<li>${esc(i)}</li>`).join('')}</ul>
        </div>
        <div class="wp-col wp-blk">
          <h3>Blocks until complete</h3>
          <ul>${(s.blocks || []).map(b => `<li>${linkStep(b)}</li>`).join('') || '<li>Nothing — this is the end of the line</li>'}</ul>
        </div>
      </div>
    </section>

    <section class="sec">
      <h2><span class="sec-hint">How to run it</span>Practical instructions</h2>
      <ol class="steps-ol">${(s.instructions || []).map(i => `<li>${esc(i)}</li>`).join('')}</ol>
    </section>

    ${ex ? `<section class="sec">
      <h2><span class="sec-hint">Example artefact</span>${esc(project.name)}</h2>
      <div class="artefact">
        <div class="artefact-head">
          <h3>${esc(ex.title)}</h3>
          <span class="badge">Worked example</span>
          <button class="btn btn-sm" type="button" id="copy-example">Copy as text</button>
        </div>
        <div class="artefact-body">
          ${ex.intro ? `<p class="artefact-intro">${esc(ex.intro)}</p>` : ''}
          ${renderBlocks(ex.blocks)}
          ${ex.commentary ? `<div class="artefact-note"><p><strong>What to notice.</strong> ${esc(ex.commentary)}</p></div>` : ''}
        </div>
      </div>
    </section>` : ''}

    ${templateLinks ? `<section class="sec">
      <h2><span class="sec-hint">Templates</span>Download and use</h2>
      <ul class="list-plain">${templateLinks}</ul>
    </section>` : ''}

    ${gate ? `<section class="sec">
      <h2><span class="sec-hint">Approval</span>Gate ${gate.n} — ${esc(gate.title)}</h2>
      <div class="gate-panel">
        <div class="gate-panel-head">
          <h3>Gate ${gate.n}: ${esc(gate.title)}</h3>
          ${gate.isNew ? newBadge(gate.newBecause) : ''}
        </div>
        <div class="gate-panel-body">
          <p><strong>Purpose.</strong> ${esc(gate.purpose)}</p>
          <p><strong>Artefacts approved:</strong> ${gate.artefacts.map(a => esc(a)).join(' · ')}</p>
          <p><strong>Owner:</strong> ${esc(roleName(gate.owner))} &nbsp;·&nbsp;
             <strong>Approver:</strong> ${esc(roleName(gate.approver))} (${esc(gate.approverSide)})</p>
          ${gate.owner === gate.approver ? `<div class="note note-warn" style="margin:1rem 0">
            <p><strong>Self-approval.</strong> The owner and approver are the same role here.
            Where a second reviewer is available, use one — an internal gate reviewed only by
            the person who produced the artefact is a weak gate.</p></div>` : ''}
          <p><strong>Basecamp ticket:</strong> <span class="gate-ticket">${esc(gate.ticket)}</span></p>
          <p><strong>Approval unlocks:</strong> ${esc(gate.unlocks)}</p>
          <div class="note note-warn">
            <p><strong>If it is not approved.</strong> ${esc(gate.failPath)}</p>
          </div>
          ${gate.additions ? `<div class="note note-new" style="margin-top:1rem">
            <p><strong>Added to this gate:</strong> ${gate.additions.map(a => esc(a)).join(' · ')}</p>
          </div>` : ''}
        </div>
      </div>
    </section>` : ''}

    ${cGate ? `<section class="sec">
      <h2><span class="sec-hint">Conditional gate</span>${esc(cGate.title)}</h2>
      <div class="note note-gate">
        <p><strong>${esc(cGate.title)}</strong> ${cGate.isNew ? newBadge() : ''}</p>
        <p>${esc(cGate.purpose)}</p>
        <p><strong>Triggered by:</strong> ${cGate.triggeredBy.map(c => esc(conditions[c].label)).join(' · ')}</p>
        <p><strong>Ticket:</strong> <span class="gate-ticket">${esc(cGate.ticket)}</span></p>
      </div>
    </section>` : ''}

    <section class="sec">
      <h2><span class="sec-hint">Pitfalls</span>What goes wrong, and the control</h2>
      ${(s.pitfalls || []).map(p => `<div class="pitfall">
        <p class="risk">${esc(p.risk)}</p>
        <p class="control">${esc(p.control)}</p>
      </div>`).join('')}
    </section>

    ${(s.parallelWith || []).length ? `<section class="sec">
      <h2><span class="sec-hint">Sequencing</span>Can run alongside</h2>
      <p>${s.parallelWith.map(linkStep).join(' · ')}</p>
    </section>` : ''}
  `;

  const copyBtn = document.getElementById('copy-example');
  if (copyBtn && ex) {
    copyBtn.addEventListener('click', () => {
      copyText(`${ex.title} — ${project.name}\n\n${blocksToText(ex.blocks)}`, copyBtn);
    });
  }

  renderPager(s);
  markCurrent();
}

function renderPager(s) {
  const i = steps.findIndex(x => x.id === s.id);
  const prev = steps[i - 1], next = steps[i + 1];
  pager.innerHTML = `
    ${prev ? `<a href="#/step/${prev.id}"><span class="dir">← Previous</span><span class="ttl">${esc(prev.title)}</span></a>` : '<span></span>'}
    ${next ? `<a class="next" href="#/step/${next.id}"><span class="dir">Next →</span><span class="ttl">${esc(next.title)}</span></a>` : '<span></span>'}
  `;
}

/* ========================== Reference views ============================== */

const referenceViews = {

  roles: () => `
    <div class="view-head">
      <span class="eyebrow eyebrow-accent">Reference</span>
      <h1>Roles &amp; RACI</h1><hr class="rule-brand">
      <p class="lede">${Object.values(roles).filter(r => !r.optional).length} core roles,
      ${Object.values(roles).filter(r => r.optional).length} optional. The optional ones may be
      in-house, freelance or client-side — what matters is that the work is owned by a name
      rather than assumed.</p>
    </div>
    ${Object.values(roles).map(r => `
      <div class="card" style="margin-bottom:var(--sp-4)">
        <h3>${esc(r.name)} ${r.optional ? '<span class="badge">Optional</span>' : ''}</h3>
        <p>${esc(r.owns)}</p>
        ${r.note ? `<p class="muted" style="font-size:var(--fs-sm)">${esc(r.note)}</p>` : ''}
      </div>`).join('')}

    <div class="note">
      <p><strong>The split that matters.</strong> Head of Web <em>specifies</em> work packages and
      <em>assures</em> what comes back. The Web Developer <em>delivers</em> them. Those are two
      different jobs, and separating them is what stops a project being limited by one person's
      capacity — or stalling entirely when that person is on holiday.</p>
      <p style="margin-top:.6rem">It also means nobody signs off their own work: the person who
      built something is not the person who approves it at Gate 11.</p>
    </div>
    <section class="sec">
      <h2>Who owns what</h2>
      <div class="table-scroll"><table>
        <thead><tr><th>Step</th><th>Owner</th><th>Contributors</th><th>Approver</th></tr></thead>
        <tbody>${steps.map(s => `<tr>
          <td><a href="#/step/${s.id}">${s.n}. ${esc(s.title)}</a></td>
          <td>${esc(roleName(s.owner))}</td>
          <td>${(s.contributors || []).map(c => esc(roleName(c))).join(', ') || '—'}</td>
          <td>${esc(roleName(s.approver))}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </section>`,

  gates: () => `
    <div class="view-head">
      <span class="eyebrow eyebrow-accent">Reference</span>
      <h1>Gates index</h1><hr class="rule-brand">
      <p class="lede">Approval names artefacts and unlocks specific work. Every gate now carries a
      fail path, because a process drawn as a straight line has nothing to say when a gate fails.</p>
    </div>
    <div class="table-scroll"><table>
      <thead><tr><th>Gate</th><th>Routes</th><th>Owner</th><th>Approver</th><th>Unlocks</th></tr></thead>
      <tbody>${gates.map(g => `<tr>
        <td><strong>${g.n}. ${esc(g.title)}</strong> ${g.isNew ? newBadge() : ''}</td>
        <td>${routeBadges(g.routes)}</td>
        <td>${esc(roleName(g.owner))}</td>
        <td>${esc(roleName(g.approver))}</td>
        <td>${esc(g.unlocks)}</td>
      </tr>`).join('')}</tbody>
    </table></div>
    ${gates.map(g => `<section class="sec">
      <h2>Gate ${g.n} — ${esc(g.title)} ${g.isNew ? newBadge() : ''}</h2>
      <p>${esc(g.purpose)}</p>
      <p><strong>Artefacts:</strong> ${g.artefacts.map(esc).join(' · ')}</p>
      <p><strong>Ticket:</strong> <span class="gate-ticket">${esc(g.ticket)}</span></p>
      <div class="note note-warn"><p><strong>Fail path.</strong> ${esc(g.failPath)}</p></div>
    </section>`).join('')}
    <section class="sec">
      <h2>Conditional gates</h2>
      <p>Triggered by project characteristics rather than by route size.</p>
      ${conditionalGates.map(g => `<div class="card" style="margin-bottom:var(--sp-4)">
        <h3>${esc(g.title)} ${g.isNew ? newBadge() : ''}</h3>
        <p>${esc(g.purpose)}</p>
        <p class="muted" style="font-size:var(--fs-sm)"><strong>Triggered by:</strong>
        ${g.triggeredBy.map(c => esc(conditions[c].label)).join(' · ')}</p>
      </div>`).join('')}
    </section>`,

  artefacts: () => `
    <div class="view-head">
      <span class="eyebrow eyebrow-accent">Reference</span>
      <h1>Artefacts &amp; templates</h1><hr class="rule-brand">
      <p class="lede">Every template, what it is for, and which gate it supports.
      Document templates are Word files; all the trackers live in one workbook.</p>
    </div>
    <div class="table-scroll"><table>
      <thead><tr><th>Artefact</th><th>Format</th><th>Gate</th><th>Routes</th><th>Download</th></tr></thead>
      <tbody>${Object.entries(artefacts).map(([k, a]) => `<tr>
        <td><strong>${esc(a.name)}</strong> ${a.isNew ? newBadge() : ''}</td>
        <td>${a.type === 'other' ? 'Design tool' : '.' + a.type}${a.tab ? ` <span class="muted">→ ${esc(a.tab)}</span>` : ''}</td>
        <td>${a.gate !== null && a.gate !== undefined ? 'Gate ' + a.gate : 'Ongoing'}</td>
        <td>${a.routes.length ? routeBadges(a.routes) : '<span class="badge">Conditional</span>'}</td>
        <td>${a.file
          ? `<a href="../templates/${a.type === 'xlsx' ? 'xlsx' : 'docx'}/${a.file}" download>Download</a>`
          : '<span class="muted">—</span>'}</td>
      </tr>`).join('')}</tbody>
    </table></div>`,

  logs: () => `
    <div class="view-head">
      <span class="eyebrow eyebrow-accent">Reference</span>
      <h1>Decision, change and variation</h1><hr class="rule-brand">
      <p class="lede">Three related records that are routinely confused. Keeping them distinct is
      what turns scope creep from an argument into a commercial conversation.</p>
    </div>
    <div class="grid grid-3" style="margin-bottom:var(--sp-6)">
      <div class="card card-accent"><h3>Decision log</h3>
        <p>Records <strong>why something was chosen</strong>. Options considered, selection,
        rationale, impact, reversal cost, owner, approver.</p>
        <p class="muted" style="font-size:var(--fs-sm)">Protects reasoning. Stops the same argument
        being had three times.</p></div>
      <div class="card card-accent"><h3>Change log</h3>
        <p>Records <strong>movement after approval</strong>. What changed, why, which approved item
        it affects, impact, and the accept / reject / defer decision.</p>
        <p class="muted" style="font-size:var(--fs-sm)">Protects scope. Every entry is evidence.</p></div>
      <div class="card card-accent-2"><h3>Variation order ${newBadge()}</h3>
        <p>Records <strong>the commercial consequence</strong>. Effort, price, client approval,
        and the schedule impact.</p>
        <p class="muted" style="font-size:var(--fs-sm)">Protects revenue. Without it a change log
        just documents unpaid work politely.</p></div>
    </div>
    <section class="sec">
      <h2>The flow, end to end</h2>
      <ol class="steps-ol">
        <li>Someone requests something that is not in the approved artefacts.</li>
        <li>It is classified: <strong>correction</strong> (departs from what was approved — fix it,
        no charge), <strong>preference</strong> (legitimate opinion within the open areas — absorb
        within the revision allowance), or <strong>new scope</strong>.</li>
        <li>New scope gets a change log entry with an effort figure. Not "some impact" — hours.</li>
        <li>If chargeable, it becomes a variation order <em>before</em> the work happens.</li>
        <li>Client accepts, declines, or defers to the post-launch backlog. All three are fine.
        Silently absorbing it is not.</li>
        <li>Accepted variations update the estimate baseline, so the final variance is honest.</li>
      </ol>
      <div class="note note-new">
        <p><strong>You can still choose to absorb something.</strong> The process does not require
        charging for everything. It requires the decision to be visible. Absorbing twenty minutes
        as goodwill is a choice; absorbing twenty hours because nobody was counting is not.</p>
      </div>
    </section>`,

  routes: () => `
    <div class="view-head">
      <span class="eyebrow eyebrow-accent">Reference</span>
      <h1>Routes compared</h1><hr class="rule-brand">
      <p class="lede">Three routes, plus conditional triggers that override route size where
      project risk demands it.</p>
    </div>

    <div class="note note-warn">
      <p><strong>Standard and full run the same steps.</strong> That is not an oversight — it is
      the honest answer. The difference between them is <em>depth and formality</em>, not a longer
      list of stages. Full outlines every page rather than every template, specifies every block
      rather than the new ones, formalises change control on every item however small, and audits
      accessibility rather than checking it.</p>
      <p style="margin-top:.6rem">Light is the only route that genuinely drops steps — four of
      them, listed in the table below with the reason.</p>
    </div>

    <div class="grid grid-3" style="margin-bottom:var(--sp-6)">
      ${routeOrder.map(r => {
        const core = steps.filter(s => s.routes.includes(r) && !(s.conditions || []).length);
        const eff = steps.filter(s => s.routes.includes(r))
                         .reduce((t, s) => t + (s.effortBand[r] || 0), 0);
        return `<div class="card">
          <h3><span class="badge badge-route" data-route="${r}">${esc(r)}</span></h3>
          <p>${esc(routes[r].use)}</p>
          <p style="font-size:var(--fs-sm)"><strong>Artefact depth: ${esc(routes[r].depth)}.</strong>
          ${esc(routes[r].depthDetail)}</p>
          <p class="muted" style="font-size:var(--fs-sm)"><strong>${core.length} core steps</strong> ·
          ${gates.filter(g => g.routes.includes(r)).length} gates ·
          ~${Math.round(eff * (1 + routes[r].contingency))} hrs inc.
          ${Math.round(routes[r].contingency * 100)}% contingency</p>
        </div>`;
      }).join('')}
    </div>

    <section class="sec">
      <h2><span class="sec-hint">The real difference</span>What each route actually produces</h2>
      <div class="table-scroll"><table>
        <thead><tr><th>Route</th><th>Artefacts look like</th><th>Governance</th></tr></thead>
        <tbody>${routeOrder.map(r => `<tr>
          <td><span class="badge badge-route" data-route="${r}">${esc(r)}</span></td>
          <td><ul class="list-plain" style="margin:0">${
            routes[r].depthPoints.map(x => `<li>${esc(x)}</li>`).join('')}</ul></td>
          <td>${esc(routes[r].governance)}</td>
        </tr>`).join('')}</tbody>
      </table></div>
      <h3 style="margin-top:var(--sp-5)">Artefacts only a full-route project produces</h3>
      <p>If you want a single concrete answer to “what do I get for full?”, it is these three —
      plus the depth described above.</p>
      <ul class="list-check">${(routes.full.extraArtefacts || []).map(id =>
        `<li><strong>${esc(artefacts[id]?.name || id)}</strong></li>`).join('')}</ul>
    </section>
    <section class="sec">
      <h2>Step inclusion by route</h2>
      <div class="table-scroll"><table>
        <thead><tr><th>Step</th>${routeOrder.map(r => `<th>${esc(r)}</th>`).join('')}<th>Conditional</th></tr></thead>
        <tbody>${steps.map(s => `<tr>
          <td><a href="#/step/${s.id}">${s.n}. ${esc(s.title)}</a></td>
          ${routeOrder.map(r => `<td>${s.routes.includes(r) ? '●' : '<span class="muted">—</span>'}</td>`).join('')}
          <td>${(s.conditions || []).length
            ? s.conditions.map(c => esc(conditions[c].label)).join('; ')
            : '<span class="muted">—</span>'}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </section>
    <section class="sec">
      <h2>Why conditions beat t-shirt sizes</h2>
      <div class="note note-new">
        <p>The original model made the current-state audit, SEO migration plan and redirect map
        <em>full-route only</em>. But a five-page brochure site on a domain that has ranked for a
        decade can lose more commercial value in a bad migration than a fifty-page site with no
        organic traffic at all.</p>
        <p style="margin-top:.75rem">Risk follows traffic and links, not page count. So these are
        now triggered by <strong>“replaces an existing live site”</strong>, on any route. The
        worked example demonstrates exactly this: a standard-route project with full migration
        governance forced on.</p>
      </div>
      <h3 style="margin-top:var(--sp-6)">All conditions</h3>
      <div class="table-scroll"><table>
        <thead><tr><th>Condition</th><th>Why it matters</th><th>Forces</th></tr></thead>
        <tbody>${Object.entries(conditions).map(([k, c]) => {
          const forced = steps.filter(s => (s.conditions || []).includes(k)).map(s => s.title);
          return `<tr><td><strong>${esc(c.label)}</strong></td><td>${esc(c.why)}</td>
            <td>${forced.length ? forced.map(esc).join(', ') : '<span class="muted">Route sizing only</span>'}</td></tr>`;
        }).join('')}</tbody>
      </table></div>
    </section>`,

  rules: () => `
    <div class="view-head">
      <span class="eyebrow eyebrow-accent">Reference</span>
      <h1>Rules of engagement</h1><hr class="rule-brand">
      <p class="lede">The short version of the whole process. If you remember nothing else,
      remember these.</p>
    </div>
    <h2>Sequencing and structure</h2>
    <ul class="list-check">${rules.filter(r => r.source === 'original').map(r => `<li>${esc(r.text)}</li>`).join('')}</ul>
    <h2 style="margin-top:var(--sp-6)">Commercial and governance</h2>
    <ul class="list-check">${rules.filter(r => r.source === 'new').map(r =>
      `<li>${esc(r.text)}</li>`).join('')}</ul>
    <div class="note" style="margin-top:var(--sp-6)">
      <p>Every rule in the second list traces to a specific finding in the
      <a href="../gaps.html">gap analysis</a>. Nothing here was invented for its own sake.</p>
    </div>`,

  togaf: () => `
    <div class="view-head">
      <span class="eyebrow eyebrow-accent">Reference</span>
      <h1>TOGAF alignment</h1><hr class="rule-brand">
      <p class="lede">The process was designed to map onto TOGAF's architecture domains. That
      mapping is what makes it legible to procurement at larger organisations.</p>
    </div>
    <div class="table-scroll"><table>
      <thead><tr><th>TOGAF domain</th><th>In this process</th></tr></thead>
      <tbody>
        <tr><td><strong>Architecture vision</strong></td><td>Sales handover, discovery summary and success criteria</td></tr>
        <tr><td><strong>Stakeholder concerns</strong></td><td>Discovery goals, stakeholder map, pain points, named approvers</td></tr>
        <tr><td><strong>Business architecture</strong></td><td>Business goals, audiences, services and conversion paths</td></tr>
        <tr><td><strong>Information architecture</strong></td><td>Sitemap, content model, page outlines, content matrix</td></tr>
        <tr><td><strong>Application architecture</strong></td><td>WordPress templates, reusable blocks, plugins and integrations</td></tr>
        <tr><td><strong>Technology architecture</strong></td><td>Hosting, theme stack, repository, environments and branching</td></tr>
        <tr><td><strong>Implementation governance</strong></td><td>Gates, decision logs, change logs and the estimate baseline</td></tr>
        <tr><td><strong>Architecture change management</strong></td><td>Post-approval change control and variation orders</td></tr>
      </tbody>
    </table></div>
    <div class="note" style="margin-top:var(--sp-5)">
      <p>This matters commercially. Above a certain client size, procurement asks how you govern
      delivery. "We have a process" is a weaker answer than a documented gate model that maps to a
      recognised framework.</p>
    </div>`,

  example: () => `
    <div class="view-head">
      <span class="eyebrow eyebrow-accent">Reference</span>
      <h1>The worked example</h1><hr class="rule-brand">
      <p class="lede">${esc(project.oneLine)}</p>
    </div>
    <dl class="glance">${project.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <div class="note note-new">
      <p><strong>Why this example.</strong> ${esc(project.whyThisExample)}</p>
    </div>
    <section class="sec">
      <h2>Every artefact, in order</h2>
      <p>Each one is the same project at a later stage. The sitemap produces the outlines, the
      outlines produce the blocks, the blocks produce the build list.</p>
      <ol class="steps-ol">${steps.filter(s => examples[s.id]).map(s =>
        `<li><a href="#/step/${s.id}">${esc(examples[s.id].title)}</a>
         <span class="muted">— step ${s.n}, ${esc(s.title)}</span></li>`).join('')}</ol>
    </section>
    <div class="note note-warn">
      <p><strong>Halcyon Thermal is invented.</strong> The figures are realistic but illustrative.
      Swap in a real sanitised project if you would prefer the guide to reference actual work.</p>
    </div>`,

  glossary: () => {
    const terms = [
      ['Artefact', 'A named, versioned document or record that a gate approves. Approval is always of artefacts, never of a general impression.'],
      ['Baseline', 'The estimate recorded at Gate 1 and re-recorded at Gate 10. Everything that moves afterwards is measured against it.'],
      ['Block', 'A reusable block. Structure and fields are shared across projects; appearance varies through theme SCSS.'],
      ['Block inventory', 'The controlled list of every block a project needs, each with a reuse / adapt / build-new decision.'],
      ['Change log', 'The record of movement after approval. Protects scope.'],
      ['Condition', 'A project characteristic that forces a step in or out regardless of route — for example, replacing an existing live site.'],
      ['Contingency', 'A percentage added to the baseline estimate by route: 15% light, 20% standard, 25% full.'],
      ['Correction', 'Feedback identifying a departure from an approved artefact. Fixed at no charge.'],
      ['Decision log', 'The record of why something was chosen. Protects reasoning.'],
      ['Gate', 'A named approval point. Lists the artefacts approved and states what work is now allowed to proceed.'],
      ['New scope', 'A request for something not in the approved artefacts. Logged, priced, and accepted, declined or deferred — never silently absorbed.'],
      ['Preference', 'Legitimate opinion within the areas the brief left open. Absorbed within the revision allowance.'],
      ['Route', 'Light, standard or full — the depth of process applied, chosen at discovery and overridable.'],
      ['Support matrix', 'The agreed list of browsers, devices and breakpoints QA tests against. Defines when testing is finished.'],
      ['Variation order', 'The commercial instrument that turns an accepted change into billable work, agreed before the work happens.'],
      ['Warranty window', 'The period after launch during which defects are fixed free. Changes are quoted, inside it or outside it.'],
      ['Work package', 'A step expressed as inputs, deliverables, done-when conditions and downstream blocks — so it can be handed to anyone.']
    ];
    return `
      <div class="view-head">
        <span class="eyebrow eyebrow-accent">Reference</span>
        <h1>Glossary</h1><hr class="rule-brand">
        <p class="lede">Terms that carry a specific meaning in this process.</p>
      </div>
      <dl class="af-fields" style="background:var(--line-soft)">
        ${terms.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join('')}
      </dl>`;
  }
};

/* ========================== Router ======================================= */

function render() {
  const hash = location.hash || '#/';
  const stepMatch = hash.match(/^#\/step\/([\w-]+)/);
  const refMatch = hash.match(/^#\/reference\/([\w-]+)/);

  if (stepMatch) renderStep(stepMatch[1]);
  else if (refMatch && referenceViews[refMatch[1]]) {
    view.innerHTML = referenceViews[refMatch[1]]();
    pager.innerHTML = '';
  } else renderOverview();

  markCurrent();
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  document.getElementById('main').focus({ preventScroll: true });
  rail.classList.remove('is-open');
  document.getElementById('rail-toggle').setAttribute('aria-expanded', 'false');
}

window.addEventListener('hashchange', render);

/* ========================== Route toggle ================================= */

const routeToggle = document.getElementById('route-toggle');
routeToggle.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-route]');
  if (!btn) return;
  setRoute(btn.dataset.route);
});

function setRoute(r) {
  if (!routeOrder.includes(r)) return;
  route = r;
  localStorage.setItem(STORE_KEY, r);
  routeToggle.querySelectorAll('button').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.route === r)));
  renderRail();
  render();
}

/* ========================== Search ======================================= */

const searchInput = document.getElementById('guide-search');
const results = document.getElementById('guide-results');

const index = [
  ...steps.map(s => ({
    title: s.title,
    meta: `Step ${s.n} · ${phases.find(p => p.id === s.phase).name}`,
    href: `#/step/${s.id}`,
    text: [s.title, s.summary, s.why, s.detail, (s.doneWhen || []).join(' '),
           (s.instructions || []).join(' '),
           (s.pitfalls || []).map(p => p.risk + ' ' + p.control).join(' ')].join(' ').toLowerCase()
  })),
  ...gates.map(g => ({
    title: `Gate ${g.n}: ${g.title}`,
    meta: 'Approval gate',
    href: '#/reference/gates',
    text: [g.title, g.purpose, g.unlocks, g.failPath, g.artefacts.join(' ')].join(' ').toLowerCase()
  })),
  ...Object.values(artefacts).map(a => ({
    title: a.name,
    meta: `Artefact · .${a.type}`,
    href: '#/reference/artefacts',
    text: a.name.toLowerCase()
  })),
  ...gaps.map(g => ({
    title: `${g.id}: ${g.title}`,
    meta: `Gap · ${g.severity}`,
    href: '../gaps.html',
    text: [g.title, g.finding, g.consequence, g.fix].join(' ').toLowerCase()
  })),
  ...Object.entries(referenceViews).map(([k]) => ({
    title: k.charAt(0).toUpperCase() + k.slice(1).replace(/^example$/, 'Worked example'),
    meta: 'Reference',
    href: `#/reference/${k}`,
    text: k
  }))
];

const runSearch = debounce(() => {
  const q = searchInput.value.trim().toLowerCase();
  if (q.length < 2) { results.hidden = true; return; }
  const terms = q.split(/\s+/);
  const hits = index
    .map(i => ({ i, score: terms.reduce((s, t) => s + (i.text.includes(t) ? (i.title.toLowerCase().includes(t) ? 3 : 1) : 0), 0) }))
    .filter(h => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  results.innerHTML = hits.length
    ? hits.map(h => `<a href="${h.i.href}">
        <span class="res-title">${esc(h.i.title)}</span>
        <span class="res-meta">${esc(h.i.meta)}</span></a>`).join('')
    : `<p class="res-empty">Nothing found for “${esc(searchInput.value)}”.</p>`;
  results.hidden = false;
}, 120);

searchInput.addEventListener('input', runSearch);
searchInput.addEventListener('focus', runSearch);
document.addEventListener('click', (e) => {
  if (!e.target.closest('.guide-search-wrap')) results.hidden = true;
});
results.addEventListener('click', () => {
  results.hidden = true;
  searchInput.value = '';
});
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { results.hidden = true; searchInput.blur(); }
  if (e.key === 'Enter') {
    const first = results.querySelector('a');
    if (first) { location.hash = first.getAttribute('href'); results.hidden = true; searchInput.value = ''; searchInput.blur(); }
  }
});

/* ========================== Keyboard ===================================== */

const dialog = document.getElementById('shortcuts');
document.getElementById('shortcut-btn').addEventListener('click', () => dialog.showModal());

document.addEventListener('keydown', (e) => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  if (e.key === '/' && !typing) { e.preventDefault(); searchInput.focus(); searchInput.select(); return; }
  if (typing) return;

  if (e.key === '?') { e.preventDefault(); dialog.showModal(); return; }
  if (e.key === 'g') { location.hash = '#/'; return; }
  if (e.key === '1') { setRoute('light'); return; }
  if (e.key === '2') { setRoute('standard'); return; }
  if (e.key === '3') { setRoute('full'); return; }

  if (e.key === 'j' || e.key === 'k') {
    const id = currentStepId();
    let i = id ? steps.findIndex(s => s.id === id) : -1;
    i = e.key === 'j' ? i + 1 : i - 1;
    if (i >= 0 && i < steps.length) location.hash = `#/step/${steps[i].id}`;
    else if (i < 0) location.hash = '#/';
  }
});

/* ========================== Mobile rail ================================== */

const railToggle = document.getElementById('rail-toggle');
railToggle.addEventListener('click', () => {
  const open = rail.classList.toggle('is-open');
  railToggle.setAttribute('aria-expanded', String(open));
});

/* ========================== Boot ========================================= */

routeToggle.querySelectorAll('button').forEach(b =>
  b.setAttribute('aria-pressed', String(b.dataset.route === route)));
renderRail();
render();
