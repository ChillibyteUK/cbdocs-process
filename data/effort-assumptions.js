/* ---------------------------------------------------------------------------
   effort-assumptions.js  —  EDITABLE PLACEHOLDERS
   ---------------------------------------------------------------------------
   Every hour figure the Spec Builder adds ON TOP of a step's own effortBand
   (see data/steps.js) lives in this one file. None of it is measured
   Chillibyte data — it's a reasonable starting guess, exactly like the
   figures in data/assumptions.js are for the pitch deck. That is the whole
   point of presenting it this way: we do not currently know how long any
   of this takes. The Spec Builder exists partly to start finding out —
   record actuals against these numbers on real projects and correct them
   here. Whoever does that later should not need to go hunting through
   spec.js to find the number that needs changing — it should all be here.

   Each section below answers one question: "if a project needs X, how many
   extra hours does that add, and why that number?"
--------------------------------------------------------------------------- */

// --- ROM (rough order of magnitude) display band -----------------------
// Every hour figure the Spec Builder shows is presented as a range, not a
// single decimal-precision number — a single number would overstate how
// confident we are. ±20% is itself a guess at a sensible band; narrow it
// once real project actuals exist to compare estimates against.
export const romVariance = 0.2; // ±20%

// --- Route recommendation → continuous effort ---------------------------
// A step's effortBand holds three calibration points (light/standard/full).
// The Spec Builder interpolates between them using the SAME complexity
// score that recommends a route, rather than snapping to whichever route
// the score lands in — that snapping used to cause a single-tier answer
// change (e.g. one more CPT) to multiply the whole estimate just because it
// happened to cross a route threshold.
//
// These anchors are NOT the same numbers as the route thresholds in
// recommendRoute() (score >= 3 → standard, >= 9 → full). Those thresholds
// mark where governance formality switches on; these anchors mark what a
// TYPICAL project on that route actually scores, which is higher than its
// own lower threshold — e.g. a typical standard-route project scores
// around 6, not 3.
export const ROUTE_SCORE_ANCHORS = { light: 0, standard: 6, full: 14 };

// --- Features: "does the site need any of these?" -----------------------
// Additive on top of core step effort, not baked into any step's flat
// effortBand — a booking plugin and a customer portal are wildly different
// amounts of work despite both answering "yes" to the same question.
// Reflects BUILD effort, not licence cost: an integration with an external
// platform (Mailchimp, HubSpot, Calendly) is mostly configuration; a portal
// or document library is bespoke development.
export const featureEffort = {
  forms: { hours: 0, note: "Covered by the standard build spec — no extra." },
  gated: { hours: 2, note: "Gate logic and delivery for one content type." },
  ecommerce: { hours: 30, note: "Catalogue, cart, checkout, order management — a build in its own right." },
  booking: { hours: 3, note: "Usually a configured plugin or embed (e.g. Calendly) — install and style, not build." },
  portal: { hours: 18, note: "Customer authentication, account area and gated data — bespoke development." },
  membership: { hours: 3, note: "Usually an external platform (Mailchimp, HubSpot) — configuration, not build." },
  documentLibrary: { hours: 6, note: "Secure storage, indexing/search and access control for a document set." },
};

// --- Integrations: "which third-party systems?" --------------------------
// Additive, keyed to the specific thing being connected — not "how many".
// An analytics tag already baked into the theme and a bespoke API
// integration are not the same size of task despite both being "an
// integration", and a shared complexity score was too blunt to tell them
// apart (it used to inflate every step's hours a little for something that
// might be a half-hour tag setup).
export const integrationEffort = {
  analytics: { hours: 0.5, note: "GA4/GTM tag already baked into the theme — configure and verify the properties." },
  webhookCrm: { hours: 2, note: "Zapier or a simple webhook into a CRM/spreadsheet." },
  hubspot: { hours: 4, note: "Native HubSpot connector/forms." },
  salesforce: { hours: 8, note: "Salesforce form or API integration — typically more setup and testing." },
  customApi: { hours: 12, note: "Bespoke API integration — no two are alike, adjust per project." },
};

// --- SEO: flat, every project --------------------------------------------
// Not scaled by route or project size. Chillibyte runs SEO as a separate
// division; this is the small amount of build-side SEO involvement every
// project gets regardless (sitemap review, metadata), NOT a substitute for
// a proper SEO engagement. Larger/ongoing SEO work is scoped and quoted
// separately, post-launch (see the exclusions list in the generated spec).
export const seoBaselineHours = 2;

// --- Multilingual: flat, per additional language --------------------------
// Build-side cost only — URL structure, language switcher, duplicated
// templates, per-language QA. Does NOT include translating the copy itself
// — that stays excluded, same as all other content writing.
export const additionalLanguageHours = 6;

// --- Client relationship: coordination/PM overhead ------------------------
// Not build effort — just the extra time spent managing a difficult or
// unfamiliar relationship (more revision cycles, slower sign-off, more
// hand-holding).
export const clientMaturityOverheadHours = {
  known: 0,
  "known-hard": 4,
  new: 2,
};

// --- Accessibility: extra build-side QA -----------------------------------
// On top of Internal QA's own effortBand. Formal/audited targets need more
// than a heavier AA pass, hence the larger figure. Does NOT cover the extra
// design-side attention an accessibility target needs — that's flagged as
// a note for the designer's separate quote (see quotedSeparately on the
// Visual design step in data/steps.js), not computed here.
export const accessibilityQAHours = {
  basic: 0,
  aa: 2,
  formal: 5,
};
