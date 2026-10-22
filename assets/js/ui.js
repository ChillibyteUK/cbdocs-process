/* ---------------------------------------------------------------------------
   ui.js — small shared rendering helpers used by the guide and spec builder.
--------------------------------------------------------------------------- */

import { approvalName } from '../../data/process.js';

export const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const el = (html) => {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
};

/* --- Badges --------------------------------------------------------------- */

export function routeBadges(routes = []) {
  return routes.map(r =>
    `<span class="badge badge-route" data-route="${esc(r)}">${esc(r)}</span>`
  ).join('');
}

/* The additions made during the gap review are now simply part of the process,
   so the guide no longer flags them. Provenance is retained in the data
   (`isNew` / `newBecause` on steps, gates, roles and artefacts) and is still
   surfaced in the gap analysis, which is where that reasoning belongs.
   Returning an empty string retires the marker everywhere at once rather than
   leaving the call sites to be picked off one by one. */
export const newBadge = () => '';

export const gateBadge = (n) =>
  `<span class="badge badge-gate">Approval: ${esc(approvalName(n))}</span>`;

/* --- Flow diagram (pitch slide 6, overview slide 4) ------------------------
   Both decks render the same "all steps, in order" flow, grouped into the
   five phase rows the speaker notes call "clusters". Shared here so the two
   decks cannot render it differently again.

   Exactly two markers, so each means one thing:
     .has-gate     — step ends in a formal approval
     .is-conditional — step only applies to some projects ("Conditional"),
                       i.e. gate === null but conditionalGate is set
   A step with neither (only step 15, Development) is mandatory and just
   doesn't end in a sign-off — it gets no marking, so nothing implies it's
   optional. */
export function renderFlow(steps, phases) {
  return phases.map(p => {
    const phaseSteps = steps.filter(s => s.phase === p.id);
    if (!phaseSteps.length) return '';
    return `
    <div class="flow-phase">
      <span class="flow-phase-label">${esc(p.name)}</span>
      <div class="flow-phase-row">
        ${phaseSteps.map(s => {
          const hasGate = s.gate !== null && s.gate !== undefined;
          const conditional = !hasGate && Boolean(s.conditionalGate);
          const cls = hasGate ? 'has-gate' : (conditional ? 'is-conditional' : '');
          const badge = hasGate ? `<span class="fg">Approval</span>`
            : conditional ? `<span class="fg">Conditional</span>` : '';
          return `
        <div class="flow-item ${cls}">
          <span class="fn">${s.n}</span>${esc(s.title)}
          ${badge}
        </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
}

/* --- Artefact block renderer ----------------------------------------------
   Renders the block shapes used by worked-example.js. Shared so the guide and
   any spec export display example artefacts identically.
-------------------------------------------------------------------------- */

export function renderBlocks(blocks = []) {
  return blocks.map(b => {
    switch (b.type) {
      case 'prose':
        return `<p class="af-label">${esc(b.text)}</p>`;

      case 'fields':
        return `<dl class="af-fields">${
          b.items.map(([k, v]) =>
            `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`
          ).join('')
        }</dl>`;

      case 'table':
        return `<div class="table-scroll"><table>
          <thead><tr>${b.columns.map(c => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
          <tbody>${b.rows.map(r =>
            `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`
          ).join('')}</tbody>
        </table></div>`;

      case 'list': {
        const cls = b.style === 'check' ? 'list-check'
                  : b.style === 'cross' ? 'list-cross'
                  : 'list-plain';
        return `<ul class="${cls}">${b.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
      }

      default:
        return '';
    }
  }).join('');
}

/* --- Plain-text serialisation, for copy-to-clipboard and markdown export -- */

export function blocksToText(blocks = []) {
  const lines = [];
  for (const b of blocks) {
    if (b.type === 'prose') { lines.push('', b.text, ''); }
    else if (b.type === 'fields') {
      for (const [k, v] of b.items) lines.push(`${k}: ${v}`);
      lines.push('');
    } else if (b.type === 'table') {
      lines.push('| ' + b.columns.join(' | ') + ' |');
      lines.push('|' + b.columns.map(() => '---').join('|') + '|');
      for (const r of b.rows) lines.push('| ' + r.join(' | ') + ' |');
      lines.push('');
    } else if (b.type === 'list') {
      for (const i of b.items) lines.push(`- ${i}`);
      lines.push('');
    }
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/* --- Clipboard ------------------------------------------------------------ */

export async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch { /* nothing more we can do */ }
    ta.remove();
  }
  if (button) {
    const original = button.textContent;
    button.textContent = 'Copied';
    setTimeout(() => { button.textContent = original; }, 1600);
  }
}

/* --- Misc ----------------------------------------------------------------- */

export const hrs = (n) =>
  (Math.round(n * 10) / 10).toLocaleString('en-GB') + (n === 1 ? ' hr' : ' hrs');

/* ROM (rough order of magnitude) display: these are calibration guesses,
   not measured data, so a single decimal-precision number overstates
   confidence. Shown as a range instead — variance is a placeholder,
   narrow it once real project actuals exist. See romVariance in
   data/effort-assumptions.js. */
export const hrsRange = (n, variance) => {
  if (!n) return hrs(0);
  const lo = Math.round(n * (1 - variance));
  const hi = Math.round(n * (1 + variance));
  return lo === hi ? hrs(lo) : `${lo}–${hi} hrs`;
};

export const titleCase = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);

export function debounce(fn, ms = 140) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
