/* ---------------------------------------------------------------------------
   presenter-link.js — second-screen presenter view.

   Shared by both decks (pitch and overview) so the behaviour cannot drift.

   How it works
   ------------
   The deck is the source of truth. It broadcasts its state on every slide
   change; the presenter window is a dumb renderer that displays whatever it
   is sent and can post commands back. That direction matters — it means the
   presenter window holds no slide content of its own, needs no data imports,
   and cannot fall out of sync by having its own idea of where we are.

   Transport is BroadcastChannel, which is same-origin and needs no server.
   A `storage` event fallback covers browsers without it (and, usefully, the
   case where BroadcastChannel exists but is disabled by policy).

   NOTE: both transports are same-origin. Opened from file:// the origin is
   opaque and the two windows will not see each other, so the deck must be
   served over http(s). The presenter window says so on screen rather than
   just silently failing.
--------------------------------------------------------------------------- */

const CHANNEL = 'cb-deck';
const LS_KEY = 'cb-deck-msg';

/* --- Transport ------------------------------------------------------------ */

function makeBus(onMessage) {
  let bc = null;
  try {
    bc = new BroadcastChannel(CHANNEL);
    bc.onmessage = (e) => onMessage(e.data);
  } catch {
    bc = null;
  }

  // Fallback: localStorage 'storage' events fire in *other* same-origin
  // windows, which is precisely what we need. The timestamp forces a change
  // even when the payload is identical, otherwise no event is emitted.
  const onStorage = (e) => {
    if (e.key !== LS_KEY || !e.newValue) return;
    try { onMessage(JSON.parse(e.newValue).payload); } catch { /* ignore */ }
  };
  window.addEventListener('storage', onStorage);

  return {
    post(payload) {
      if (bc) { try { bc.postMessage(payload); return; } catch { /* fall through */ } }
      try {
        localStorage.setItem(LS_KEY, JSON.stringify({ t: Date.now(), payload }));
      } catch { /* storage full or blocked — nothing sensible to do */ }
    },
    close() {
      window.removeEventListener('storage', onStorage);
      if (bc) try { bc.close(); } catch { /* already closed */ }
    }
  };
}

/* --- Deck side ------------------------------------------------------------
   api: {
     deck:    'pitch' | 'overview'   — so two decks never talk to each other
     title:   human name for the presenter header
     total:   () => number
     current: () => number            (0-based)
     slideAt: (i) => { title, notes }
     go:      (i) => void
   }
-------------------------------------------------------------------------- */

export function createPresenterLink(api) {
  let presenterWindow = null;

  const state = () => {
    const i = api.current();
    const total = api.total();
    const cur = api.slideAt(i) || {};
    const next = i + 1 < total ? api.slideAt(i + 1) : null;
    return {
      type: 'state',
      deck: api.deck,
      deckTitle: api.title,
      i, total,
      title: cur.title || `Slide ${i + 1}`,
      notes: cur.notes || '',
      nextTitle: next ? (next.title || `Slide ${i + 2}`) : null
    };
  };

  const bus = makeBus((msg) => {
    if (!msg || msg.deck !== api.deck) return;

    // The presenter window announces itself on load; answer with current state
    // so it renders immediately rather than waiting for the next slide change.
    if (msg.type === 'hello') { bus.post(state()); return; }

    if (msg.type === 'cmd') {
      const i = api.current();
      if (msg.action === 'next') api.go(i + 1);
      else if (msg.action === 'prev') api.go(i - 1);
      else if (msg.action === 'goto' && Number.isFinite(msg.n)) api.go(msg.n);
    }
  });

  // Tell the presenter window the deck has gone away, so it can grey out
  // rather than sit there showing a slide that is no longer on screen.
  window.addEventListener('pagehide', () => {
    bus.post({ type: 'bye', deck: api.deck });
  });

  return {
    /** Call after every slide change. */
    publish() { bus.post(state()); },

    /** Open (or re-focus) the presenter window. Must be called from a click. */
    open() {
      const url = new URL('../presenter.html', location.href);
      url.searchParams.set('deck', api.deck);
      url.searchParams.set('title', api.title);

      if (presenterWindow && !presenterWindow.closed) {
        presenterWindow.focus();
      } else {
        presenterWindow = window.open(
          url.toString(),
          `cb-presenter-${api.deck}`,
          'width=1100,height=760,menubar=no,toolbar=no,location=no,status=no'
        );
      }
      // If the popup was blocked, window.open returns null.
      if (!presenterWindow) return false;

      // It will say hello when it loads, but publish anyway in case it was
      // already open and merely re-focused.
      setTimeout(() => bus.post(state()), 120);
      return true;
    },

    isOpen() { return !!presenterWindow && !presenterWindow.closed; }
  };
}

/* --- Presenter side ------------------------------------------------------- */

export function createPresenterClient(deck, handlers) {
  const bus = makeBus((msg) => {
    if (!msg || msg.deck !== deck) return;
    if (msg.type === 'state') handlers.onState(msg);
    else if (msg.type === 'bye') handlers.onDisconnect?.();
  });

  bus.post({ type: 'hello', deck });

  return {
    send(action, n) { bus.post({ type: 'cmd', deck, action, n }); },
    hello() { bus.post({ type: 'hello', deck }); }
  };
}
