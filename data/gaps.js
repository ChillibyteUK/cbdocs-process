/* ---------------------------------------------------------------------------
   gaps.js — the gap register.

   Findings from reviewing the operating model and process overview against
   the stated goals: less scope creep, less non-billable work, more people per
   project, greater perceived client value, more client confidence, more
   transparency.

   status:
     'authored'  — fixed, and the fix is built into the process and all tools
     'noted'     — recommended, not yet built in
--------------------------------------------------------------------------- */

export const gaps = [
  {
    id: 'G1', severity: 'critical', title: 'No effort baseline anywhere',
    area: 'Commercial',
    finding: 'The process defines 17 steps and 14 gates but never produces an estimate. The change log asks whether a change affects timing, with nothing to measure that against.',
    consequence: 'Scope creep cannot be demonstrated, only asserted. That undermines the central argument for the process — you cannot show management a reduction in something that was never measured.',
    fix: 'Estimate baseline produced at Gate 1 from the step effort bands plus route contingency, re-baselined at Gate 10, and variance against actuals recorded at Gate 14.',
    status: 'authored',
    touches: ['Gate 1', 'Gate 10', 'Gate 14', 'Estimate baseline tracker tab']
  },
  {
    id: 'G2', severity: 'critical', title: 'Change log has no commercial arm',
    area: 'Commercial',
    finding: 'Change log entries record what changed and an accept / reject / defer decision. There is no effort figure, no chargeability flag and no route to a variation order.',
    consequence: 'A change process that cannot raise a charge converts scope creep into unpaid work more politely. This is the single largest leak of non-billable time in the model as written.',
    fix: 'Change log gains Effort (hrs), Chargeable, Variation ref and Client approved columns. New variation order template and variation register tab. Rule: a change that adds effort gets an effort figure, and chargeable changes become a variation before the work happens.',
    status: 'authored',
    touches: ['Change log', 'Variation order template', 'Variation register tab', 'Gate 9', 'Gate 12']
  },
  {
    id: 'G3', severity: 'critical', title: 'No client approval SLA',
    area: 'Governance',
    finding: 'Approvals are the spine of the process — fourteen gates depend on them — but nothing states how long a client has to respond, who is entitled to approve, or what happens if nobody does.',
    consequence: 'Projects stall indefinitely between gates with no contractual position, and the delay is recorded as agency slowness.',
    fix: 'Named client approver and approval response window agreed at Gate 1. Silence past the window pauses the project and moves the timeline; it does not mean yes.',
    status: 'authored',
    touches: ['Gate 1', 'All client gates', 'Discovery summary template']
  },
  {
    id: 'G4', severity: 'critical', title: 'No sales to discovery handover',
    area: 'Commercial',
    finding: 'The process explicitly begins when discovery is scheduled, treating everything before that as sales and therefore out of scope.',
    consequence: 'What sales promised — inclusions, exclusions, price, verbal reassurance — enters delivery unrecorded. This is the commonest single origin of scope disagreement, and the process had no view of it at all.',
    fix: 'New Gate 0 and a sales handover step. Delivery formally accepts what was sold, with explicit exclusions and a stated number of design concepts and revision rounds.',
    status: 'authored',
    touches: ['Gate 0', 'Sales handover step', 'Sales handover note template', 'Sales role']
  },
  {
    id: 'G5', severity: 'critical', title: 'No post-launch warranty boundary',
    area: 'Commercial',
    finding: 'Gate 14 closes the project. Nothing distinguishes fixing a defect from making a change once the site is live.',
    consequence: 'Post-launch requests arrive continuously with no boundary, and are absorbed by default. A classic and entirely avoidable source of free work.',
    fix: 'Defect warranty window agreed at Gate 13 and communicated in writing: defects fixed free within the window, changes quoted whether inside it or outside. Warranty start date recorded at Gate 14.',
    status: 'authored',
    touches: ['Gate 13', 'Gate 14', 'Launch checklist']
  },
  {
    id: 'G6', severity: 'critical', title: 'No revision limits',
    area: 'Commercial',
    finding: 'The number of design concepts and rounds of feedback included is never stated anywhere in the model.',
    consequence: 'Design and review rounds are effectively unlimited, and each additional round is unbillable by default.',
    fix: 'Included concepts and revision rounds stated at Gate 0 and confirmed at Gate 1. Rounds counted at wireframe, design review and staging review. Rounds beyond the allowance route through the variation flow.',
    status: 'authored',
    touches: ['Gate 0', 'Gate 1', 'Gate 6', 'Gate 9', 'Gate 12']
  },

  {
    id: 'G7', severity: 'high', title: 'No work-package definition',
    area: 'Capacity',
    finding: 'The stated benefit is compartmentalising work into packages with requirements and deliverables. The documents define gates and artefacts, but not packages with entry criteria, exit criteria and acceptance criteria.',
    consequence: 'The benefit management is being asked to buy is not actually built yet. Without entry and exit criteria a task cannot be safely handed to someone without the project history in their head — which is precisely the constraint on putting more people on a project.',
    fix: 'Every step modelled as a work package: owner, contributors, inputs required, deliverables, done-when conditions, and what it blocks downstream. This is the core data structure behind all three tools.',
    status: 'authored',
    touches: ['Every step', 'Guide', 'Spec builder']
  },
  {
    id: 'G8', severity: 'high', title: 'Single point of failure at Head of Web',
    area: 'Capacity',
    finding: 'In the gate tracker, Head of Web owns twelve of fourteen gates and is also the internal approver on most of them — approving artefacts they produced.',
    consequence: 'The process whose selling point is parallel working funnels through one person, and self-approval weakens the internal quality gate. Both directly limit how large a project the agency can take on.',
    fix: 'Owner and approver split as separate fields throughout. Self-approval is visible in the gate tracker rather than implicit. Optional roles introduced so work can be distributed.',
    status: 'authored',
    touches: ['All gates', 'Roles', 'Gate tracker tab']
  },
  {
    id: 'G9', severity: 'high', title: 'Undefined loop-backs',
    area: 'Governance',
    finding: 'The process is drawn as a straight line. There is no defined behaviour for a gate that is not approved.',
    consequence: 'When Gate 9 fails, what happens is decided in the moment by whoever is most senior in the room — which is the improvisation the process exists to remove.',
    fix: 'Every gate carries an explicit fail path: where the work returns to, what needs re-approval, and whether it triggers a variation.',
    status: 'authored',
    touches: ['All gates']
  },
  {
    id: 'G10', severity: 'high', title: 'Copywriter and SEO roles do not exist',
    area: 'Capacity',
    finding: 'The trackers repeatedly assign content ownership to a "Copywriter" and assume redirect and migration work, but the roles table contains only four roles and neither appears.',
    consequence: 'The process assumes labour that is not in the RACI, so that labour is unplanned, unestimated and unowned.',
    fix: 'Copywriter and SEO/Analytics added as optional roles, switchable per project in the spec builder.',
    status: 'authored',
    touches: ['Roles', 'Content matrix', 'Spec builder']
  },
  {
    id: 'G11', severity: 'high', title: 'Content is under-governed',
    area: 'Delivery risk',
    finding: 'A content matrix exists with owners, but no content deadlines, no stated consequence for late content, and content freeze appears only on the full route.',
    consequence: 'Late client content is the most common cause of website project overrun by a clear margin, and the model had no mechanism to manage it.',
    fix: 'Every content item carries an owner and a deadline, set at Gate 4. Late-content escalation agreed in writing at the same gate. Content freeze applies on all routes at Gate 12.',
    status: 'authored',
    touches: ['Gate 4', 'Gate 12', 'Content matrix tab']
  },
  {
    id: 'G12', severity: 'high', title: 'SEO and redirect work gated on route size, not risk',
    area: 'Delivery risk',
    finding: 'Current-state audit, SEO migration plan and redirect map are listed as full-route artefacts only.',
    consequence: 'A five-page brochure site on a domain that has ranked for a decade can lose more commercial value in a bad migration than a fifty-page site with no organic traffic. Risk follows traffic and links, not page count.',
    fix: 'These become conditionally triggered by "replaces an existing live site", independent of route. This is the clearest illustration of why the spec builder uses conditions rather than t-shirt sizes.',
    status: 'authored',
    touches: ['Current-state audit step', 'Conditional gates C1 and C2', 'Spec builder rules engine']
  },
  {
    id: 'G13', severity: 'high', title: 'Undefined browser and device support matrix',
    area: 'Delivery risk',
    finding: 'The QA checklist tests "key pages checked on mobile/tablet/desktop" against no agreed definition of which devices or browsers are in scope.',
    consequence: 'QA has no end condition, and any defect on any device is arguably in scope. Unbounded QA is unbillable QA.',
    fix: 'Support matrix agreed at Gate 1 and tested against at Gate 11. Anything outside the matrix is explicitly out of scope.',
    status: 'authored',
    touches: ['Gate 1', 'Gate 11', 'QA tab', 'Discovery summary template']
  },
  {
    id: 'G14', severity: 'high', title: 'Light route drops the change log',
    area: 'Commercial',
    finding: 'The light route lists a "basic decision log" and no change log at all.',
    consequence: 'Small projects are where scope creep is proportionally most damaging, because there is less margin to absorb it. A change log costs almost nothing to maintain.',
    fix: 'Change log is mandatory on every route including light.',
    status: 'authored',
    touches: ['Routes', 'Change log tab', 'Rules of engagement']
  },

  {
    id: 'G15', severity: 'medium', title: 'Accessibility has no target standard',
    area: 'Compliance',
    finding: 'Accessibility appears as "accessibility basics" and a checklist line covering heading order, contrast and focus states.',
    consequence: 'Not a testable commitment. Weak for B2B and public-sector clients, and increasingly weak against the European Accessibility Act for anything trading into the EU.',
    fix: 'Explicit accessibility target stated at Gate 1, expressed in visual terms at style direction, and verified against at Gate 11.',
    status: 'authored',
    touches: ['Gate 1', 'Style direction', 'Gate 11']
  },
  {
    id: 'G16', severity: 'medium', title: 'No data protection step',
    area: 'Compliance',
    finding: 'Forms are QA-tested for whether they submit. Nothing addresses privacy policy, cookie consent, form data destination, retention, or the data-processing position between agency and client.',
    consequence: 'Genuine legal exposure for a UK agency handling personal data on clients\' behalf, sitting entirely outside the process.',
    fix: 'New compliance and data protection step, conditionally triggered by forms or transactional features, with conditional Gate C5 before launch.',
    status: 'authored',
    touches: ['Compliance step', 'Gate C5', 'QA tab']
  },
  {
    id: 'G17', severity: 'medium', title: 'No third-party access checkpoint',
    area: 'Delivery risk',
    finding: 'Integrations and hosting are captured at discovery, but nobody owns obtaining access before build depends on it.',
    consequence: 'Builds stall waiting on credentials, and the delay is invisible in the record — it looks like slow development rather than an unchased dependency.',
    fix: 'New access and credentials step with conditional Gate C4 before development.',
    status: 'authored',
    touches: ['Access and credentials step', 'Gate C4']
  },
  {
    id: 'G18', severity: 'medium', title: 'Artefact versioning undefined',
    area: 'Governance',
    finding: 'Gate tickets require "artefact name and version", but no versioning convention exists and Google Docs do not version naturally.',
    consequence: 'Sign-off is tied to a version that has no definition, so it is unclear afterwards exactly what was approved.',
    fix: 'Convention adopted: v0.1 draft, v1.0 at approval, v1.1 after a logged change. Version recorded on every gate ticket.',
    status: 'authored',
    touches: ['Gate ticket template', 'All gates']
  },
  {
    id: 'G19', severity: 'medium', title: 'No environment or branching standard',
    area: 'Capacity',
    finding: 'The build specification names a GitHub repository and environments but defines no branching, deployment or access convention.',
    consequence: 'A second developer joining a project is a liability rather than an asset, which is directly at odds with the goal of more people per project.',
    fix: 'Environments, repository and branching approach recorded in the build specification at Gate 10.',
    status: 'authored',
    touches: ['Build specification', 'Gate 10']
  },
  {
    id: 'G20', severity: 'medium', title: 'Process improvement is unowned',
    area: 'Governance',
    finding: 'Gate 14 captures retrospective notes and reusable block updates, but nothing routes them back into the templates, the block library or the process itself.',
    consequence: 'Lessons are recorded and then not acted on, so the process does not compound and estimating never improves.',
    fix: 'Gate 14 outcomes carry an owner and a date, and feed the templates and block library. Estimate variance recorded every project.',
    status: 'authored',
    touches: ['Gate 14', 'Launch and closure step']
  },
  {
    id: 'G21', severity: 'medium', title: 'No portfolio view for management',
    area: 'Governance',
    finding: 'The gate tracker is per project. Nothing aggregates gate status, variance or variation value across the portfolio.',
    consequence: 'Management — the audience being asked to approve this process — has no way to see whether it is working.',
    fix: 'Spec builder exports gate and estimate data in a form that aggregates across projects. A portfolio dashboard is recommended as a later phase.',
    status: 'noted',
    touches: ['Spec builder export', 'Gate tracker tab']
  },
  {
    id: 'G22', severity: 'medium', title: 'No care plan transition at closure',
    area: 'Commercial',
    finding: 'Closure produces handover notes but no transition into a maintenance or retainer arrangement.',
    consequence: 'The moment of maximum client goodwill — a freshly launched site the client is pleased with — passes unmonetised.',
    fix: 'Care plan conversation added to Gate 14, held at handover rather than weeks later.',
    status: 'authored',
    touches: ['Gate 14', 'Conditional Gate C6']
  }
];

export const severities = {
  critical: { label: 'Critical', note: 'Directly undermines the goals the process is being adopted for.', colour: 'red' },
  high:     { label: 'High',     note: 'Causes rework, or blocks the goal of more people per project.', colour: 'amber' },
  medium:   { label: 'Medium',   note: 'Risk, compliance and professionalism.', colour: 'grey' }
};

export const severityOrder = ['critical', 'high', 'medium'];

export function gapById(id) {
  return gaps.find(g => g.id === id) || null;
}

export const gapStats = {
  total: gaps.length,
  authored: gaps.filter(g => g.status === 'authored').length,
  noted: gaps.filter(g => g.status === 'noted').length,
  bySeverity: severityOrder.map(s => ({ severity: s, count: gaps.filter(g => g.severity === s).length }))
};
