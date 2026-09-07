/* ---------------------------------------------------------------------------
   deck-core.js — the presentation engine, shared by every deck.

   Both decks (pitch and overview) previously carried their own near-identical
   copy of navigation, keyboard handling, touch, the overview grid, speaker
   notes and fullscreen. That meant every change had to be made twice, and the
   copies had already drifted: the pitch had (i) popovers and an entry-animation
   hook the overview silently lacked.

   A deck now supplies only its own CONTENT. Everything about how a deck
   BEHAVES lives here.

   Expected markup (see pitch/index.html for the canonical example):
     .slide[data-title][data-notes]   one per slide, inside #deck
     #progress #cur #total            chrome
     #btn-prev #btn-next #btn-ov #btn-notes #btn-full #btn-print #btn-presenter
     #notes #notes-body #notes-close  speaker notes panel
     #overview #ov-grid               overview grid

   Every element is optional — a deck that omits #btn-presenter simply has no
   presenter button, rather than throwing on load.
--------------------------------------------------------------------------- */

import { esc } from './ui.js';
import { createPresenterLink } from './presenter-link.js';

export function initDeck({ deck, title, onSlideEnter } = {}) {
  const $ = (id) => document.getElementById(id);

  const stage   = $('deck');
  const slides  = [...document.querySelectorAll('.slide')];
  if (!slides.length) return null;

  const progress  = $('progress');
  const curEl     = $('cur');
  const totalEl   = $('total');
  const notes     = $('notes');
  const notesBody = $('notes-body');
  const overview  = $('overview');

  let i = 0;

  if (totalEl) totalEl.textContent = slides.length;

  /* --- Navigation --------------------------------------------------------- */

  function go(n, push = true) {
    i = Math.max(0, Math.min(slides.length - 1, n));

    slides.forEach((s, k) => {
      s.classList.toggle('is-current', k === i);
      if (k !== i) s.classList.remove('is-animating');
    });

    // Restart entry animations. The reflow between remove and add is what
    // makes them replay when returning to a slide already seen.
    const cur = slides[i];
    cur.classList.remove('is-animating');
    void cur.offsetWidth;
    cur.classList.add('is-animating');

    onSlideEnter?.(cur, i);

    if (curEl) curEl.textContent = i + 1;
    if (progress) progress.style.width = `${((i + 1) / slides.length) * 100}%`;
    if (notesBody) notesBody.textContent = cur.dataset.notes || 'No notes for this slide.';

    document.querySelectorAll('.ov-item')
      .forEach((b, k) => b.classList.toggle('is-current', k === i));

    cur.scrollTop = 0;
    if (push) history.replaceState(null, '', `#${i + 1}`);

    presenter.publish();
  }

  const next = () => go(i + 1);
  const prev = () => go(i - 1);

  /* --- Presenter view ----------------------------------------------------- */

  const presenter = createPresenterLink({
    deck: deck || 'deck',
    title: title || document.title,
    total: () => slides.length,
    current: () => i,
    slideAt: (n) => slides[n] && {
      title: slides[n].dataset.title || `Slide ${n + 1}`,
      notes: slides[n].dataset.notes || ''
    },
    go: (n) => go(n)
  });

  /* --- Chrome ------------------------------------------------------------- */

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => { /* denied — fine */ });
  }
  const toggleOverview = () => overview?.classList.toggle('is-open');
  const toggleNotes    = () => notes?.classList.toggle('is-open');

  const on = (id, ev, fn) => $(id)?.addEventListener(ev, fn);

  on('btn-next',  'click', next);
  on('btn-prev',  'click', prev);
  on('btn-full',  'click', toggleFullscreen);
  on('btn-ov',    'click', toggleOverview);
  on('btn-notes', 'click', toggleNotes);
  on('btn-print', 'click', () => window.print());
  on('notes-close', 'click', () => notes?.classList.remove('is-open'));

  const presenterBtn = $('btn-presenter');
  presenterBtn?.addEventListener('click', () => {
    const ok = presenter.open();
    if (!ok) {
      presenterBtn.textContent = 'Popup blocked';
      setTimeout(() => { presenterBtn.textContent = 'Presenter'; }, 2600);
    }
  });

  /* --- Click to advance ---------------------------------------------------
     Left half goes back, right half forward — but never when the click landed
     on something interactive, or the sliders on the calculator slide would
     advance the deck out from under you.                                   */

  stage?.addEventListener('click', (e) => {
    if (e.target.closest('a, button, input, label, .calc, .info-note, .info-pop')) return;
    const rect = stage.getBoundingClientRect();
    (e.clientX - rect.left < rect.width / 2) ? prev() : next();
  });

  /* --- Keyboard ------------------------------------------------------------ */

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
      case 's': case 'S': toggleNotes(); break;
      case 'o': case 'O': toggleOverview(); break;
      case 'p': case 'P': window.print(); break;
      case 'v': case 'V': presenter.open(); break;
      case 'Escape':
        overview?.classList.remove('is-open');
        notes?.classList.remove('is-open');
        break;
    }
  });

  /* --- Touch --------------------------------------------------------------- */

  let touchX = null, touchY = null;
  stage?.addEventListener('touchstart', (e) => {
    touchX = e.changedTouches[0].clientX;
    touchY = e.changedTouches[0].clientY;
  }, { passive: true });
  stage?.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) dx < 0 ? next() : prev();
    touchX = touchY = null;
  }, { passive: true });

  /* --- Overview grid ------------------------------------------------------- */

  const ovGrid = $('ov-grid');
  if (ovGrid) {
    ovGrid.innerHTML = slides.map((s, k) => `
      <button class="ov-item" type="button" data-i="${k}">
        <span class="on">${k + 1}</span>
        <span class="ot">${esc(s.dataset.title || `Slide ${k + 1}`)}</span>
      </button>`).join('');

    overview?.addEventListener('click', (e) => {
      const b = e.target.closest('.ov-item');
      if (b) { go(Number(b.dataset.i)); overview.classList.remove('is-open'); }
      else if (e.target === overview) overview.classList.remove('is-open');
    });
  }

  /* --- (i) popovers --------------------------------------------------------
     Any [data-note] becomes a click-to-open panel. Generic: a deck with no
     popovers simply gets none.                                             */

  const pop = Object.assign(document.createElement('div'), { className: 'info-pop' });
  document.body.appendChild(pop);
  let openTrigger = null;

  function closePop() {
    pop.classList.remove('is-open');
    openTrigger?.setAttribute('aria-expanded', 'false');
    openTrigger = null;
  }

  function openPop(btn) {
    pop.innerHTML = btn.dataset.note || '';
    pop.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    openTrigger = btn;

    const r = btn.getBoundingClientRect();
    const pr = pop.getBoundingClientRect();
    let left = r.left + r.width / 2 - pr.width / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - pr.width - 12));
    let top = r.bottom + 10;
    if (top + pr.height > window.innerHeight - 12) top = Math.max(12, r.top - pr.height - 10);
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
  }

  document.querySelectorAll('.info-note').forEach((span) => {
    span.setAttribute('role', 'button');
    span.setAttribute('tabindex', '0');
    span.setAttribute('aria-expanded', 'false');
    span.setAttribute('aria-label', 'More detail on these figures');

    const toggle = (e) => {
      e.stopPropagation();
      // Some triggers (e.g. the calc slider's) sit inside a <label for="…">.
      // Left unblocked, the browser's native label behaviour also fires a
      // synthetic click on the associated input, which bubbles to the
      // document-level "click outside closes the popover" listener and
      // closes what this click just opened — every time, on every click.
      e.preventDefault();
      openTrigger === span ? closePop() : openPop(span);
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

  /* --- Boot ---------------------------------------------------------------- */

  const fromHash = parseInt(location.hash.slice(1), 10);
  go(Number.isFinite(fromHash) && fromHash > 0 ? fromHash - 1 : 0, false);

  window.addEventListener('hashchange', () => {
    const n = parseInt(location.hash.slice(1), 10);
    if (Number.isFinite(n) && n - 1 !== i) go(n - 1, false);
  });

  return { go, next, prev, current: () => i, total: () => slides.length, presenter };
}
