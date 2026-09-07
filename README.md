# Chillibyte website delivery process

Four tools built on one shared model of the process:

| | | |
|---|---|---|
| **`/pitch/`** | Management pitch | 23-slide keyboard-driven deck with a live commercial calculator |
| **`/overview/`** | Process overview | 18-slide onboarding walkthrough for the delivery team — the shape of the process, no commercial figures |
| **`/guide/`** | Process guide | The working reference: 20 steps in depth, worked example, templates |
| **`/spec/`** | Spec builder | Intake questionnaire → bespoke project plan and exclusions list |
| `/gaps.html` | Gap analysis | 22 findings from reviewing the operating model against its goals |

Static HTML, CSS and ES modules. **No build step, no framework, no dependencies.**
Serve the directory with anything.

```bash
python3 -m http.server 8000    # or just point a vhost at it
```

---

## The one rule

**Everything derives from `data/`.** The four tools are views over the same model,
so they cannot drift apart. Change the process in `data/` and all four update.

```
data/
├── process.js         Roles · phases · routes · conditions · gates · artefacts · rules
├── steps.js           The 20 work packages  ← the spine
├── worked-example.js  Halcyon Thermal, threaded through every step
├── gaps.js            The 22 review findings
└── assumptions.js     ★ Financial placeholders — EDIT THESE BEFORE PRESENTING
```

Do not hard-code a step count, an hours figure or a gate name into a page.
If a number appears in the UI, it should be computed from `data/`.

---

## Before you present this

**What is real** — the commercial basis in `data/assumptions.js`: £75/hr,
£8,000 average project (total, including account management), 25 projects a
year. That implies about **107 hours per average project**, which is the anchor
every other figure has to look sensible against.

**What is still estimated** — everything else:

1. **The four leak hours** (rework 6, unbilled changes 5, waiting 3, launch
   scramble 2 = 16 hrs, about 15% of a project). Slide 4 says outright that
   these are guesses; the deck warns on screen if they ever exceed 25% of
   project value, because a figure that sounds implausible takes the rest of
   the pitch down with it.

2. **The process overhead** (4.5 hrs, itemised in `overheadBreakdown` and shown
   behind the (i) on slide 9). It is subtracted before any return is claimed.

3. **`effortBand` in `data/steps.js`** — a starting calibration, not data.
   Record actuals against the baseline on three projects, then correct it. The
   variance is worth more than the estimate.

4. **Halcyon Thermal is invented.** A realistic B2B industrial firm, chosen
   because a mid-size redesign of a ranking site forces the migration
   conditionals on a *standard* route — the clearest demonstration of why
   inclusion follows risk rather than page count. Swap it for a real sanitised
   project if you'd prefer.

The deck is built so this is a feature rather than an embarrassment: slide 2 is
six questions the business cannot currently answer, and the ask on the final
slide is **start measuring**, not "approve this process".

### The two commercial arguments

Slide 18 (calculator) and slide 19 (fixed price) present the *same* recovered
hours two different ways, deliberately never summed:

- **As margin** — projects sell for a price, not for hours, so an hour not
  spent on rework is margin. ~4.2% per job.
- **As capacity** — those hours could instead take on ~1.1 more projects a
  year, worth roughly another £8,400.

You can have one or the other, not both. `model()` in `assumptions.js` exposes
`marginAfterPct` and `extraProjectsPerYear` separately for exactly this reason.

Caveats live behind **(i) popovers** rather than as always-visible small print —
invisible when presenting, one click away when challenged.

## Roles

Head of Web **specifies** work packages and **assures** what comes back.
Web Developer **delivers** them. Those are separate jobs, and separating them is
what stops a project being limited by one person's capacity — and means nobody
signs off their own work.

Eight roles in total: six core (Head of Web, Web Developer, Account Management,
Designer, Sales, Client) and two optional (Copywriter, SEO/Analytics).

## Routes

Light drops four steps. **Standard and full run the same steps** — the
difference is artefact *depth and formality*, not a longer list of stages. Full
outlines every page rather than every template, specifies every block rather
than just the new ones, formalises change control on every item, and audits
accessibility rather than checking it. See `routes[].depthPoints` in
`data/process.js`, surfaced in the guide's Routes reference.

---

## Regenerating the templates

The `.docx` and `.xlsx` files are **generated**, not hand-made. Edit the scripts
and re-run — don't edit the binaries, or the paperwork and the process drift apart.

```bash
python3 -m venv build/venv
build/venv/bin/pip install python-docx openpyxl
build/venv/bin/python build/make_docx.py     # 9 of the 10 document templates
build/venv/bin/python build/make_xlsx.py     # 1 workbook, 13 tabs
```

> **Known drift — two exceptions to the rule above.**
> `work-package.docx` has **no generator function**, and `gate-ticket.docx` was
> edited directly after the script last changed, so re-running `make_docx.py`
> silently reverts those edits. Until both are folded back into the script,
> treat those two files as hand-maintained and do not regenerate blindly.

---

## Design notes

**Brand** — harvested from the live theme at `chillibyte.local`. All tokens live
in `assets/css/tokens.css`; that is the only file you need to touch to re-brand.

Brand red `#ED1B24` is 4.39:1 on white and **never** passes AA for body text.
Brand green `#8DC53E` is 2.06:1 on white — graphic use only on light grounds.
So the brand colours carry logo, fills, rules and large display type, while
derived inks (`--cb-red-ink`, `--cb-green-ink`, `--cb-red-solid`) carry anything
that is actually words. Every derived value has its measured ratio in a comment.

Verified: 2,020 rendered text nodes across all pages, zero AA failures.

**Typeface** — `articulat-cf` is first in the font stack but **no kit is loaded**.
The live theme only exposes a `preconnect` to `use.typekit.net`, so the kit ID
is not discoverable from the public page. To enable the brand face, get the kit
ID from Adobe Fonts › Web Projects and uncomment the `@import` at the bottom of
`assets/css/tokens.css`. Until then the fallback stack applies and nothing is
broken — it is chosen to sit close to articulat-cf in width and x-height.

**Keyboard** — the guide has `/` search, `j`/`k` step navigation, `1`/`2`/`3` route
switching and `?` for help. Both decks have arrows/space, `f` fullscreen, `s`
speaker notes (also dismissable with the × or Esc), `o` overview grid, `p`
print-to-PDF and `v` presenter view.

---

## The decks

Both decks share one engine. `assets/js/deck-core.js` owns *behaviour* —
navigation, keyboard, touch, speaker notes, the overview grid, (i) popovers and
the presenter link. `deck.js` and `overview.js` supply *content only* and call
`initDeck()`.

That split exists because the two previously carried near-identical copies of
the engine, and had already drifted: the pitch had popovers and an entry-
animation hook the overview silently lacked. A deck-level feature is now one
edit, not two.

```js
initDeck({
  deck: 'pitch',                 // channel id — decks never cross-talk
  title: 'The case for the process',
  onSlideEnter: replayBars       // optional per-slide hook
});
```

Every element `initDeck` looks for is optional, so a deck that omits, say,
`#btn-presenter` simply has no presenter button rather than throwing on load.

### Presenter view (second screen)

Click **Presenter** (or press `v`) and a second window opens: current slide
notes set large, what's coming up next, position, a wall clock and an elapsed
timer that auto-starts on the first slide change. Put it on your laptop, the
deck on the projector.

Navigation is bidirectional — arrows in either window drive both. The deck is
the source of truth; the presenter window holds no slide content of its own and
renders only what it is sent, so the two cannot disagree about where you are.

Transport is `BroadcastChannel`, with a `localStorage` fallback. **Both are
same-origin**, so this needs the site served over `http(s)`. Opened from
`file://` the two windows have opaque origins and cannot see each other — the
presenter window detects that case and says so rather than sitting blank.

**State** — the spec builder encodes answers into the URL and autosaves to
`localStorage`. A share link reproduces a spec exactly, with no server involved.
