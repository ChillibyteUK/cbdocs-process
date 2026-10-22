/* ---------------------------------------------------------------------------
   overview.js — "how the process works" onboarding deck.
   Navigation is the same engine as deck.js. Content is entirely derived from
   data/ — no commercial figures, no data/assumptions.js import.
--------------------------------------------------------------------------- */

import { steps } from '../../data/steps.js';
import { phases, roles, routes, routeOrder, gates, conditionalGates, conditions, roleName } from '../../data/process.js';
import { project } from '../../data/worked-example.js';
import { esc, renderFlow } from './ui.js';
import { initDeck } from './deck-core.js';

/* ========================== Static content from data ===================== */

/* Slide 3 — the five phases */
document.getElementById('phase-strip').innerHTML = phases.map(p => `
  <div class="phase-card">
    <span class="pn">Phase ${p.n}</span>
    <h3>${esc(p.name)}</h3>
    <p>${esc(p.tagline)}</p>
  </div>`).join('');

/* Slide 4 — all 20 steps in order, grouped into the five phase clusters */
document.getElementById('flow').innerHTML = renderFlow(steps, phases);

/* Slides 5–9 — one step list per phase */
document.querySelectorAll('[data-phase-list]').forEach(container => {
  const phaseId = container.dataset.phaseList;
  const phaseSteps = steps.filter(s => s.phase === phaseId);
  const slide = container.closest('.slide');
  const tagline = slide.querySelector('.phase-tagline');
  const phase = phases.find(p => p.id === phaseId);
  if (tagline && phase) tagline.textContent = phase.tagline;

  container.innerHTML = phaseSteps.map(s => {
    const hasGate = s.gate !== null && s.gate !== undefined;
    const conditional = !hasGate && Boolean(s.conditionalGate);
    const noGate = !hasGate && !conditional;
    const gateLabel = hasGate ? 'Approval' : (s.conditionalGate ? 'Conditional' : '');
    return `
    <div class="step-row ${conditional ? 'is-conditional' : ''} ${noGate ? 'is-nogate' : ''}">
      <span class="sn">${s.n}</span>
      <div class="st">
        <h4>${esc(s.title)}</h4>
        <p>${esc(s.summary)}</p>
      </div>
      <div class="sb">
        ${gateLabel ? `<span class="badge-gate">${esc(gateLabel)}</span>` : ''}
        <span class="badge-owner">${esc(roleName(s.owner))}</span>
        ${conditional ? `<span class="badge-condition">${esc((s.conditions || []).join(', '))}</span>` : ''}
      </div>
    </div>`;
  }).join('');
});

/* Slide 10 — gates */
{
  document.getElementById('gate-count').textContent = gates.length;
  document.getElementById('gate-light-count').textContent = gates.filter(g => g.routes.includes('light')).length;
  document.getElementById('cgate-count').textContent = conditionalGates.length;

  const g = gates[3]; // the sitemap approval: concrete and easy to picture
  document.getElementById('gate-example').innerHTML = `
    <h3>Example — ${esc(g.ticket)}</h3>
    <p>${esc(g.purpose)}</p>
    <p style="margin-top:.5rem"><strong>Names:</strong> ${esc(g.artefacts.join(', '))}</p>
    <p><strong>Approver:</strong> ${esc(roleName(g.approver))}</p>
    <p><strong>Unlocks:</strong> ${esc(g.unlocks)}</p>`;
}

/* Slide 11 — roles */
{
  const order = ['head-of-web', 'web-developer', 'account-management', 'designer', 'sales', 'client', 'copywriter', 'seo-analytics'];
  document.getElementById('roles-grid').innerHTML = order
    .map(id => roles[id])
    .filter(Boolean)
    .map(r => `
      <div class="tile ${r.optional ? '' : 'tile-accent'}">
        <h3>${esc(r.name)}${r.optional ? ' <span style="opacity:.6;font-weight:400">(optional)</span>' : ''}</h3>
        <p>${esc(r.owns)}</p>
      </div>`).join('');
}

/* Slide 12 — routes */
{
  document.getElementById('routes-grid').innerHTML = routeOrder.map(r => {
    const inc = steps.filter(s => s.routes.includes(r) && !(s.conditions || []).length);
    const gCount = gates.filter(x => x.routes.includes(r)).length;
    return `<div class="tile">
      <h3 style="text-transform:capitalize">${esc(r)}</h3>
      <p><strong>${inc.length} steps · ${gCount} gates · artefacts as ${esc(routes[r].depth.toLowerCase())}</strong></p>
      <p style="margin-top:.4rem;opacity:.85">${esc(routes[r].use)}</p>
    </div>`;
  }).join('');

  document.getElementById('cond-step-count').textContent = steps.filter(s => (s.conditions || []).length).length;
  document.getElementById('cond-gate-count').textContent = conditionalGates.length;
}

/* Slide 13 — conditions */
{
  document.getElementById('conditions-grid').innerHTML = Object.values(conditions).map(c => `
    <div class="condition-tile">
      <h4>${esc(c.label)}</h4>
      <p>${esc(c.why)}</p>
    </div>`).join('');
}

/* Slide 15 — worked example */
{
  document.getElementById('we-name').textContent = project.name;
  document.getElementById('we-oneline').textContent = project.oneLine;
  document.getElementById('we-facts').innerHTML = project.facts.map(([k, v]) => `
    <div class="tile tile-accent-2"><h3>${esc(k)}</h3><p>${esc(v)}</p></div>`).join('');
  document.getElementById('we-why').textContent = project.whyThisExample;
}

/* ========================== Engine ======================================= */
/* Everything about how the deck behaves — navigation, keyboard, touch, notes,
   overview grid, presenter view — is shared with the pitch deck in
   deck-core.js. This file supplies content only. */

initDeck({
  deck: 'overview',
  title: 'How the process works'
});
