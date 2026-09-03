/* ---------------------------------------------------------------------------
   overview.js — "how the process works" onboarding deck.
   Navigation is the same engine as deck.js. Content is entirely derived from
   data/ — no commercial figures, no data/assumptions.js import.
--------------------------------------------------------------------------- */

import { steps } from '../../data/steps.js';
import { phases, roles, routes, routeOrder, gates, conditionalGates, conditions, roleName } from '../../data/process.js';
import { project } from '../../data/worked-example.js';
import { esc } from './ui.js';

const slides = [...document.querySelectorAll('.slide')];
const deck = document.getElementById('deck');
const progress = document.getElementById('progress');
const curEl = document.getElementById('cur');
const notes = document.getElementById('notes');
const notesBody = document.getElementById('notes-body');
const overview = document.getElementById('overview');

document.getElementById('total').textContent = slides.length;

/* ========================== Static content from data ===================== */

/* Slide 3 — the five phases */
document.getElementById('phase-strip').innerHTML = phases.map(p => `
  <div class="phase-card">
    <span class="pn">Phase ${p.n}</span>
    <h3>${esc(p.name)}</h3>
    <p>${esc(p.tagline)}</p>
  </div>`).join('');

/* Slide 4 — all 20 steps in order */
document.getElementById('flow').innerHTML = steps.map(s => `
  <div class="flow-item ${s.gate !== null && s.gate !== undefined ? 'has-gate' : ''}">
    <span class="fn">${s.n}</span>${esc(s.title)}
    ${s.gate !== null && s.gate !== undefined ? `<span class="fg">Gate ${s.gate}</span>` : ''}
  </div>`).join('');

/* Slides 5–9 — one step list per phase */
document.querySelectorAll('[data-phase-list]').forEach(container => {
  const phaseId = container.dataset.phaseList;
  const phaseSteps = steps.filter(s => s.phase === phaseId);
  const slide = container.closest('.slide');
  const tagline = slide.querySelector('.phase-tagline');
  const phase = phases.find(p => p.id === phaseId);
  if (tagline && phase) tagline.textContent = phase.tagline;

  container.innerHTML = phaseSteps.map(s => {
    const conditional = s.gate === null || s.gate === undefined ? Boolean(s.conditionalGate) : false;
    const gateLabel = s.gate !== null && s.gate !== undefined
      ? `Gate ${s.gate}`
      : (s.conditionalGate ? 'Conditional' : '');
    return `
    <div class="step-row ${conditional ? 'is-conditional' : ''}">
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
  document.getElementById('cgate-count').textContent = conditionalGates.length;

  const g = gates[3]; // Gate 3 — sitemap approved: concrete and easy to picture
  document.getElementById('gate-example').innerHTML = `
    <h3>Example — Gate ${g.n}: ${esc(g.title)}</h3>
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

/* ========================== Navigation =================================== */

let i = 0;

function go(n, push = true) {
  i = Math.max(0, Math.min(slides.length - 1, n));
  slides.forEach((s, k) => {
    s.classList.toggle('is-current', k === i);
    if (k !== i) s.classList.remove('is-animating');
  });
  const cur = slides[i];
  cur.classList.remove('is-animating');
  void cur.offsetWidth;
  cur.classList.add('is-animating');
  curEl.textContent = i + 1;
  progress.style.width = `${((i + 1) / slides.length) * 100}%`;
  notesBody.textContent = slides[i].dataset.notes || 'No notes for this slide.';
  document.querySelectorAll('.ov-item').forEach((b, k) => b.classList.toggle('is-current', k === i));
  slides[i].scrollTop = 0;
  if (push) history.replaceState(null, '', `#${i + 1}`);
}

const next = () => go(i + 1);
const prev = () => go(i - 1);

document.getElementById('btn-next').addEventListener('click', next);
document.getElementById('btn-prev').addEventListener('click', prev);

/* Click to advance — but never when the click was on something interactive. */
deck.addEventListener('click', (e) => {
  if (e.target.closest('a, button, input, label')) return;
  const rect = deck.getBoundingClientRect();
  (e.clientX - rect.left < rect.width / 2) ? prev() : next();
});

document.addEventListener('keydown', (e) => {
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) {
    if (e.key === 'Escape') e.target.blur();
    return;
  }
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  switch (e.key) {
    case 'ArrowRight': case 'PageDown': case ' ': e.preventDefault(); next(); break;
    case 'ArrowLeft':  case 'PageUp':            e.preventDefault(); prev(); break;
    case 'Home': e.preventDefault(); go(0); break;
    case 'End':  e.preventDefault(); go(slides.length - 1); break;
    case 'f': case 'F': toggleFullscreen(); break;
    case 's': case 'S': notes.classList.toggle('is-open'); break;
    case 'o': case 'O': toggleOverview(); break;
    case 'p': case 'P': window.print(); break;
    case 'Escape':
      overview.classList.remove('is-open');
      notes.classList.remove('is-open');
      break;
  }
});

/* --- Touch ---------------------------------------------------------------- */

let touchX = null, touchY = null;
deck.addEventListener('touchstart', (e) => {
  touchX = e.changedTouches[0].clientX;
  touchY = e.changedTouches[0].clientY;
}, { passive: true });
deck.addEventListener('touchend', (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  const dy = e.changedTouches[0].clientY - touchY;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) dx < 0 ? next() : prev();
  touchX = touchY = null;
}, { passive: true });

/* ========================== Chrome ======================================= */

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen?.();
  else document.documentElement.requestFullscreen?.().catch(() => { /* denied — fine */ });
}

function toggleOverview() { overview.classList.toggle('is-open'); }

document.getElementById('btn-full').addEventListener('click', toggleFullscreen);
document.getElementById('btn-notes').addEventListener('click', () => notes.classList.toggle('is-open'));
document.getElementById('btn-ov').addEventListener('click', toggleOverview);
document.getElementById('btn-print').addEventListener('click', () => window.print());

/* --- Overview grid -------------------------------------------------------- */

document.getElementById('ov-grid').innerHTML = slides.map((s, k) => `
  <button class="ov-item" type="button" data-i="${k}">
    <span class="on">${k + 1}</span>
    <span class="ot">${esc(s.dataset.title || `Slide ${k + 1}`)}</span>
  </button>`).join('');

overview.addEventListener('click', (e) => {
  const b = e.target.closest('.ov-item');
  if (b) { go(Number(b.dataset.i)); overview.classList.remove('is-open'); }
  else if (e.target === overview) overview.classList.remove('is-open');
});

/* ========================== Boot ========================================= */

const fromHash = parseInt(location.hash.slice(1), 10);
go(Number.isFinite(fromHash) && fromHash > 0 ? fromHash - 1 : 0, false);

window.addEventListener('hashchange', () => {
  const n = parseInt(location.hash.slice(1), 10);
  if (Number.isFinite(n) && n - 1 !== i) go(n - 1, false);
});
