/* ---------------------------------------------------------------------------
   deck.js — management pitch deck.
   Navigation, speaker notes, overview grid, and the live commercial model.
   All figures come from data/assumptions.js; all process facts from data/.
--------------------------------------------------------------------------- */

import { assumptions, model, money } from '../../data/assumptions.js';
import { steps } from '../../data/steps.js';
import { gates, routes, routeOrder } from '../../data/process.js';
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

/* Slide 3 — the four leaks */
{
  const m = model();
  const max = Math.max(...m.leakRows.map(r => r.hours));
  document.getElementById('leak-bars').innerHTML = m.leakRows.map(r => `
    <div class="leak">
      <span class="leak-name">${esc(r.label)}</span>
      <span class="leak-track"><span class="leak-fill" style="width:${(r.hours / max * 100).toFixed(1)}%"></span></span>
      <span class="leak-val">${r.hours} hrs</span>
    </div>`).join('');

  document.getElementById('leak-total').textContent =
    `${m.lostHoursPerProject} hours, about ${money(m.lostValuePerProject)}`;

  const pct = m.lostValuePerProject / assumptions.avgProjectValue;
  document.getElementById('leak-pct').textContent = `${Math.round(pct * 100)}%`;

  /* Coherence check. The leak hours and the average project value are set
     independently, so it is easy to end up claiming to lose a third of every
     project — a figure nobody in the room will believe, which takes the rest
     of the pitch down with it. Warn on the slide rather than quietly
     presenting an indefensible number. */
  const impliedHours = assumptions.avgProjectValue / m.hourRate;
  const sanity = document.getElementById('leak-sanity');
  if (sanity) {
    if (pct > 0.25) {
      sanity.innerHTML = `<br><br><strong>⚠ These numbers do not hang together.</strong>
        An average project of ${money(assumptions.avgProjectValue)} at
        ${money(m.hourRate)}/hr is about ${Math.round(impliedHours)} hours of work, so losing
        ${m.lostHoursPerProject} hours to the four leaks is
        <strong>${Math.round(pct * 100)}% of the whole job</strong>. That will not be believed.
        Either the leak hours are too high for your typical project size, or the average project
        value is understated. Adjust them in <code>data/assumptions.js</code> before presenting.`;
    } else {
      sanity.innerHTML = '';
    }
  }

  // Keep the title slide's claim tied to the same number, so the deck can
  // never contradict itself after someone edits the assumptions.
  const fractions = [
    [1 / 3, 'a third'], [1 / 4, 'a quarter'], [1 / 5, 'a fifth'],
    [1 / 6, 'a sixth'], [1 / 8, 'an eighth'], [1 / 10, 'a tenth']
  ];
  const nearest = fractions.reduce((best, f) =>
    Math.abs(f[0] - pct) < Math.abs(best[0] - pct) ? f : best);
  document.getElementById('title-pct').textContent = nearest[1];
}

/* Slide 7 — where the overhead figure comes from */
{
  const a = assumptions;
  const el = document.getElementById('overhead-hrs');
  if (el) el.textContent = `${a.processOverheadHours} hours`;

  const info = document.getElementById('overhead-info');
  if (info && a.overheadBreakdown) {
    const sum = a.overheadBreakdown.reduce((t, [, h]) => t + h, 0);
    const rows = a.overheadBreakdown
      .map(([label, h, note]) =>
        `<p><strong>${esc(label)} — ${h} hr${h === 1 ? '' : 's'}</strong><br>${esc(note)}</p>`)
      .join('');
    info.dataset.note =
      `<p><strong>Where the ${a.processOverheadHours} hours comes from</strong></p>${rows}` +
      `<p><strong>Total ${sum} hrs</strong> on an average project of about ` +
      `${Math.round(a.avgProjectValue / (a.hourlyRate ?? 75))} hours — roughly ` +
      `${(sum / (a.avgProjectValue / (a.hourlyRate ?? 75)) * 100).toFixed(1)}% of the job.</p>` +
      (Math.abs(sum - a.processOverheadHours) > 0.01
        ? `<p><strong>⚠ This does not match processOverheadHours (${a.processOverheadHours}) — reconcile them in data/assumptions.js.</strong></p>`
        : '<p>Estimated, like everything else. Editable in <code>data/assumptions.js</code>.</p>');
  }
}

/* Slide 16 — fixed price, fewer hours */
{
  const m = model();
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  set('fp-price', money(assumptions.avgProjectValue));
  set('fp-hours', `${Math.round(m.impliedHoursPerProject)} hours`);
  set('fp-margin', `+${m.marginAfterPct.toFixed(1)}%`);
  set('fp-capacity', `+${m.extraProjectsPerYear.toFixed(1)}`);
  set('fp-extra-rev', money(m.extraRevenueIfSold));
}

/* Slide 6 — the flow */
{
  document.getElementById('flow').innerHTML = steps.map(s => `
    <div class="flow-item ${s.gate !== null && s.gate !== undefined ? 'has-gate' : ''}">
      <span class="fn">${s.n}</span>${esc(s.title)}
      ${s.gate !== null && s.gate !== undefined ? `<span class="fg">Gate ${s.gate}</span>` : ''}
    </div>`).join('');
}

/* Slide 10 — routes */
{
  document.getElementById('routes-grid').innerHTML = routeOrder.map(r => {
    const inc = steps.filter(s => s.routes.includes(r) && !(s.conditions || []).length);
    const g = gates.filter(x => x.routes.includes(r)).length;
    return `<div class="tile">
      <h3 style="text-transform:capitalize">${esc(r)}</h3>
      <p><strong>${inc.length} steps · ${g} gates · artefacts as ${esc(routes[r].depth.toLowerCase())}</strong></p>
      <p style="margin-top:.4rem;opacity:.85">${esc(routes[r].use)}</p>
    </div>`;
  }).join('');
}

/* Slides 12, 16, 18 — figures */
{
  const a = assumptions;
  const hrsLabel = (n) => `${n} ${n === 1 ? 'hour' : 'hours'}`;
  document.getElementById('onboard-now').textContent = hrsLabel(a.capacity.onboardHoursNow);
  document.getElementById('onboard-target').textContent = hrsLabel(a.capacity.onboardHoursTarget);
  document.getElementById('ceiling-now').textContent = money(a.biggerProjects.currentCeiling);
  document.getElementById('ceiling-target').textContent = money(a.biggerProjects.targetCeiling);
  document.getElementById('ask-projects').textContent = a.ask.trialProjects;
  document.getElementById('ask-weeks').textContent = `${a.ask.reviewAfterWeeks} weeks`;
}

/* ========================== Slide 14 — calculator ======================== */

const CONTROLS = [
  { key: 'hourlyRate',       label: 'Blended hourly rate',         min: 40,   max: 150,   step: 5,   fmt: v => money(v) + '/hr' },
  { key: 'projectsPerYear',  label: 'Website projects per year',   min: 4,    max: 60,    step: 1,   fmt: v => v },
  { key: 'avgProjectValue',  label: 'Average project value',       min: 2000, max: 30000, step: 500, fmt: v => money(v) },
  { key: 'reworkHours',      label: 'Rework hours lost per project', min: 0,  max: 30,    step: 1,   fmt: v => `${v} hrs` },
  { key: 'unbilledHours',    label: 'Unbilled change hours per project', min: 0, max: 25, step: 1,   fmt: v => `${v} hrs` },
  { key: 'overheadHours',    label: 'Process overhead per project', min: 0,   max: 20,    step: 0.5, fmt: v => `${v} hrs` }
];

const live = {
  hourlyRate: assumptions.hourlyRate,
  projectsPerYear: assumptions.projectsPerYear,
  avgProjectValue: assumptions.avgProjectValue,
  reworkHours: assumptions.leaks.rework.hours,
  unbilledHours: assumptions.leaks.unbilledChanges.hours,
  overheadHours: assumptions.processOverheadHours
};

const inputsEl = document.getElementById('calc-inputs');
inputsEl.innerHTML = CONTROLS.map(c => `
  <div class="calc-field">
    <label for="c-${c.key}">${esc(c.label)} <b id="v-${c.key}"></b></label>
    <input type="range" id="c-${c.key}" min="${c.min}" max="${c.max}" step="${c.step}" value="${live[c.key]}">
  </div>`).join('');

function recalc() {
  const a = {
    ...assumptions,
    hourlyRate: live.hourlyRate,
    projectsPerYear: live.projectsPerYear,
    avgProjectValue: live.avgProjectValue,
    processOverheadHours: live.overheadHours,
    leaks: {
      ...assumptions.leaks,
      rework: { ...assumptions.leaks.rework, hours: live.reworkHours },
      unbilledChanges: { ...assumptions.leaks.unbilledChanges, hours: live.unbilledHours }
    }
  };
  const m = model(a);

  for (const c of CONTROLS) document.getElementById(`v-${c.key}`).textContent = c.fmt(live[c.key]);

  document.getElementById('calc-value').textContent = money(Math.max(0, m.netValuePerYear));

  // The same recovery expressed as time, which is what a delivery team feels.
  // Value ÷ rate, so the two headline figures can never disagree.
  const hoursFreed = Math.max(0, m.netHoursPerYear);
  document.getElementById('calc-hours').textContent = Math.round(hoursFreed).toLocaleString('en-GB');
  document.getElementById('calc-days').textContent =
    `${Math.round(hoursFreed / assumptions.hoursPerDay)} `;

  /* Days released is in the headline now, so it is not repeated here. These
     three split the headline figure into where it actually comes from. */
  document.getElementById('calc-secondary').innerHTML = `
    <div><span class="v">${money(m.newRevenuePerYear)}</span>
      <span class="l">of that is <strong>new revenue</strong> — changes we currently absorb</span></div>
    <div><span class="v">${money(m.costSavedPerYear)}</span>
      <span class="l">is capacity released, to sell again</span></div>
    <div><span class="v">${m.marginPointsPerProject.toFixed(1)}%</span>
      <span class="l">margin improvement per project</span></div>`;
}

inputsEl.addEventListener('input', (e) => {
  const key = e.target.id.replace(/^c-/, '');
  if (!(key in live)) return;
  live[key] = Number(e.target.value);
  recalc();
});

recalc();

/* ========================== (i) popovers ================================= */
/* Turn every [data-note] into a real button with a positioned panel. Written
   generically so a note can be added to any slide by adding the span — no
   further wiring. */

const pop = Object.assign(document.createElement('div'), { className: 'info-pop' });
document.body.appendChild(pop);
let openTrigger = null;

function closePop() {
  pop.classList.remove('is-open');
  if (openTrigger) openTrigger.setAttribute('aria-expanded', 'false');
  openTrigger = null;
}

function openPop(btn) {
  pop.innerHTML = btn.dataset.note || '';
  pop.classList.add('is-open');
  btn.setAttribute('aria-expanded', 'true');
  openTrigger = btn;

  // Position under the trigger, nudged back inside the viewport if it would
  // overflow. Measured after the content is in, so the height is real.
  const r = btn.getBoundingClientRect();
  const pr = pop.getBoundingClientRect();
  let left = r.left + r.width / 2 - pr.width / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - pr.width - 12));
  let top = r.bottom + 10;
  if (top + pr.height > window.innerHeight - 12) top = Math.max(12, r.top - pr.height - 10);
  pop.style.left = `${left}px`;
  pop.style.top = `${top}px`;
}

document.querySelectorAll('.info-note').forEach(span => {
  span.setAttribute('role', 'button');
  span.setAttribute('tabindex', '0');
  span.setAttribute('aria-expanded', 'false');
  span.setAttribute('aria-label', 'More detail on these figures');

  const toggle = (e) => {
    e.stopPropagation();
    if (openTrigger === span) closePop();
    else openPop(span);
  };
  span.addEventListener('click', toggle);
  span.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e); }
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.info-note') && !e.target.closest('.info-pop')) closePop();
});
window.addEventListener('resize', closePop);

/* ========================== Navigation =================================== */

/* Replay the leak bars when their slide is reached.
   Uses the Web Animations API rather than toggling a class across a reflow:
   the class approach depends on requestAnimationFrame, which browsers suspend
   for tabs that are not actively rendering — leaving the bars collapsed and
   the chart blank. .animate() has no such dependency, needs no reflow hack,
   and cannot strand the element in a hidden state, because the resting style
   in CSS is already the fully-drawn bar. */
function replayBars(slide) {
  const bars = slide.querySelectorAll('.leak-fill');
  if (!bars.length) return;
  if (typeof bars[0].animate !== 'function') return;              // no WAAPI: stay drawn
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  bars.forEach((b, n) => {
    b.getAnimations?.().forEach(a => a.cancel());                 // restart cleanly on revisit
    b.animate(
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: 800, delay: n * 110, easing: 'cubic-bezier(0.22,0.7,0.32,1)', fill: 'backwards' }
    );
  });
}

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
  replayBars(cur);
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
  if (e.target.closest('a, button, input, label, .calc')) return;
  next();
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
