/* ---------------------------------------------------------------------------
   deck.js — management pitch deck.
   Navigation, speaker notes, overview grid, and the live commercial model.
   All figures come from data/assumptions.js; all process facts from data/.
--------------------------------------------------------------------------- */

import { assumptions, model, money } from '../../data/assumptions.js';
import { steps } from '../../data/steps.js';
import { gates, routes, routeOrder, phases } from '../../data/process.js';
import { esc, renderFlow } from './ui.js';
import { initDeck } from './deck-core.js';

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

/* Slide 6 — the flow, grouped into the five phase clusters */
{
  document.getElementById('flow').innerHTML = renderFlow(steps, phases);
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

/* Slide 13b — development stretch length, by route. Not a placeholder: these
   are the same effortBand hours steps.js already uses for the estimate
   baseline, just read here instead of invented for the slide. */
{
  const dev = steps.find(s => s.id === 'development');
  const grid = document.getElementById('dev-length-grid');
  if (dev && grid) {
    grid.innerHTML = routeOrder.map(r => {
      const hrs = dev.effortBand[r];
      const days = hrs / assumptions.hoursPerDay;
      return `<div class="tile">
        <h3 style="text-transform:capitalize">${esc(r)}</h3>
        <p><strong>${hrs} hrs</strong> &mdash; about ${days.toFixed(1)} working days</p>
        <p style="margin-top:.4rem;opacity:.85">of unbroken build, on this route alone</p>
      </div>`;
    }).join('');
  }
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
  { key: 'projectsPerYear',  label: 'Website projects per year',   min: 4,    max: 60,    step: 1,   fmt: v => v,
    note: `<p><strong>This is the lever &ldquo;running projects concurrently&rdquo; unlocks.</strong> Today it is capped by how many projects one person can specify <em>and</em> build at once — while a build is running, nothing else on their desk moves.</p><p>Raising this slider is not assuming more sales. It is what becomes possible once build runs against an approved spec in the background, so specify/assure time is free to progress other projects instead of waiting on this one.</p>` },
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
    <label for="c-${c.key}">${esc(c.label)}${c.note ? `<span class="info-note" data-note="${esc(c.note)}"></span>` : ''} <b id="v-${c.key}"></b></label>
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

/* ========================== Engine ======================================= */
/* Navigation, keyboard, touch, notes, overview grid, (i) popovers and the
   presenter link all live in deck-core.js, shared with the overview deck.
   Only the leak-bar replay below is specific to this deck. */

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

initDeck({
  deck: 'pitch',
  title: 'The case for the process',
  onSlideEnter: replayBars
});
