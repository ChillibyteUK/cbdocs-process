/* ---------------------------------------------------------------------------
   ui.js — small shared rendering helpers used by the guide and spec builder.
--------------------------------------------------------------------------- */

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
  `<span class="badge badge-gate">Gate ${esc(n)}</span>`;

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

export const titleCase = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);

export function debounce(fn, ms = 140) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
