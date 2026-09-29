// Post-Audit Plan — surveillance audit findings (16–17 Jun 2026, CertCo)
// plus 2026–27 ISMS roadmap, interactive timeline, and ISO/IEC 42001 prep.
// All data below is fictional demo content for Acme.

const AUDIT_2026 = {
  auditor:   'CertCo',
  dates:     '16–17 June 2026',
  scope:     'ISO/IEC 27001:2022 · re-certification (surveillance) · HQ office',
  verdict:   'Recommended for re-certification (pending closure of audit-notes items)',
  closingSummary: 'No Nonconformities raised. All items below are audit notes / OFI candidates to be worked into the 2026–27 cycle.',
};

// ─── Auditor notes, grouped by theme ────────────────────────────────────────
const AUDIT_2026_THEMES = [
  { key:'docs', title:'Documentation & registers', ctrls:['A.8.20','A.5.30','A.8.10','A.5.21'], items:[
    { t:'Refresh Network Diagram', note:'Diagram out of date; reflect Hetzner + office + endpoint boundaries.' },
    { t:'Backup restore test', note:'Restore test not documented; run + record before next surveillance.' },
    { t:'Data-deletion documentation', note:'Formalize per Policy 16 / Policy 26; ties to A.8.10 gap and OFI-015.' },
    { t:'Exit strategies per Material Outsourcing', note:'Policy 27 §6.7 exists but per-vendor exit strategies not documented for SaaS (Hetzner, GitLab, office suite, task tracker).' },
    { t:'Complete cloud services + supplier list', note:'Move Cloud Policy Appendix 12/II into the document system; align to Vendors Register.' },
    { t:'Add Consulting / Trainings / Workshops to supplier register', note:'Service-types often overlooked.' },
    { t:'Retire out-of-date procedures', note:'Legacy SW Dev, DoD, and AI model-dev procedures — remove or bring to v1.0 style.' },
    { t:'Rename "Interested Parties" → Applicable Law Register', note:'Add per-entry owner + last-checked. Missing: AI regs, Whistleblower, NIS2 justification (<50 FTE + sector).' },
    { t:'Move NDA/customer docs into document management', note:'Periodic reviews, validity, versions.' },
  ]},
  { key:'risk', title:'Risk register — concreteness', ctrls:['Clause 6.1','A.5.4','A.5.7'], items:[
    { t:'Add agentic AI risk', note:'Model-driven autonomous action risk (data exfil, unauthorized side-effects).' },
    { t:'Sabotage — broaden beyond ex-employees', note:'Anyone with access could sabotage.' },
    { t:'Every High/VH risk needs concrete mitigation in progress', note:'"Is any High risk actually being mitigated" — currently unclear.' },
    { t:'Purge former employees from "Supported by" column', note:'Register still references them.' },
    { t:'Concretize abstract risks', note:'For High and above, phrasing must be actionable.' },
    { t:'Physical security risk analysis (office)', note:'Not high-security area; door propping + tailgating + other tenants nearby.' },
    { t:'Consolidate risk analyses into ONE document', note:'Multiple analyses scattered — merge for action + visibility.' },
    { t:'Workshops with team members for risk analyses', note:'Not top-down only; involve owners.' },
  ]},
  { key:'crypto', title:'Policy 18 — Cryptography (table 23)', ctrls:['A.8.24'], items:[
    { t:'Max Expiration for Desktop/Mobile encryption not enforceable', note:'180d / 90d values are not manageable — rework wording.' },
    { t:'Reference BSI TR-02102', note:'https://www.bsi.bund.de/dok/TR-02102 — source for key-length choices.' },
    { t:'Add backup encryption row', note:'Not covered in current table.' },
  ]},
  { key:'people', title:'People, training & roles', ctrls:['A.6.3','A.6.4','A.5.2'], items:[
    { t:'InfoSec training missing for most', note:'Assign + track; add all remaining employees to the LMS.' },
    { t:'External training providers', note:'Do not do everything in-house.' },
    { t:'IP-rights training', note:'No formal training done; move IP doc into the document system.' },
    { t:'Leadership trainings (A.5.36)', note:'Leaders must role-model policy adherence.' },
    { t:'CISO job description for Alex', note:'Formal JD required.' },
    { t:'Publish 2026–27 training calendar', note:'Awareness, leadership, phishing, BCM, DP.' },
  ]},
  { key:'suppliers', title:'Suppliers & third-party', ctrls:['A.5.19','A.5.20','A.5.21','A.5.22'], items:[
    { t:'Supplier list incomplete', note:'Reconcile with accounting + operational owners.' },
    { t:'Address Sam\'s comments on the supplier list', note:'' },
    { t:'Redefine third-party risk criteria', note:'10%/50% "confidential data" thresholds unrealistic — Keeper <2% data still critical.' },
    { t:'Annual supplier assessment by system owner', note:'Prioritized by criticality.' },
    { t:'A.5.21 — sub-processors in DPAs', note:'' },
    { t:'Exit strategy for each SaaS', note:'Extend Policy 27 §6.7 beyond cloud infra.' },
    { t:'Move Cloud Policy Appendix 12/II to the document system', note:'Keep approved-services list live.' },
  ]},
  { key:'cisodash', title:"CISO dashboard — secure SDLC", ctrls:['A.8.25','A.8.28','A.8.5'], items:[
    { t:'Ownership + succession plan', note:'Only Alex has access — single point of failure.' },
    { t:'Secure-SDLC requirements applied', note:'Same rules as production code.' },
    { t:'Connection matrix documented', note:'Task tracker, LLM tooling, filesystem.' },
    { t:'Credentials in Keeper only', note:'No plaintext in repo; document rotation.' },
  ]},
  { key:'bcm', title:'Business Continuity & ER', ctrls:['A.5.29','A.5.30','A.8.14'], items:[
    { t:'Business Impact Analysis (BIA) per team', note:'Teams declare tolerable downtime; CISO consolidates RTO/RPO.' },
    { t:'SLA sheet for all services', note:'Currently no consolidated view.' },
    { t:'Realistic whole-chain BCM simulation', note:'Server restore + client comms + call tree.' },
    { t:'RTO per system + alternate systems documented', note:'Top-down.' },
    { t:'Emergency communication line', note:'Independent of primary email/Slack.' },
    { t:'Employee drills — top of the Handbook', note:'Practical + rehearsed.' },
  ]},
  { key:'network', title:'Network, physical & operations', ctrls:['A.7.1','A.8.20','A.8.23','A.7.11'], items:[
    { t:'Web-filtering / VPN on laptops', note:'Confirm & document mechanism.' },
    { t:'Wi-Fi bandwidth + LAN monitoring', note:'' },
    { t:'Server redundancy documented', note:'Hetzner posture.' },
    { t:'Correct office in evacuation plan', note:'Wrong office currently marked.' },
  ]},
  { key:'incidents', title:'Incident management & KPI follow-through', ctrls:['A.5.24','A.5.25','A.5.26','A.5.27'], items:[
    { t:'Incidents for KPIs not met', note:'File incidents when KPI misses target.' },
    { t:'Follow-up: domain access lost + email alerting broken', note:'Set alternative notification route; find other follow-ups needed.' },
    { t:'Escalation matrix: incident / data breach / AI', note:'Publish whom-to-report.' },
  ]},
  { key:'legal', title:'Legal, compliance & data protection', ctrls:['A.5.31','A.5.32','A.5.34','A.5.35','A.5.36'], items:[
    { t:'RoPA residency at Acme (A.5.34)', note:'Dana retains ownership; source lives in Acme\'s document store; CISO/CTO always accessible. Includes TOMs.' },
    { t:'A.5.36 compliance check mechanism', note:'Elastic agent + trainings; who owns "rules followed" (leadership).' },
    { t:'Contract change control', note:'Who checks correctness; where changes managed.' },
    { t:'Supplier contracts storage', note:'Central location required.' },
    { t:'Applicable Law Register — owner + last-checked', note:'Add AI regs, Whistleblower, NIS2 justification.' },
    { t:'Whistleblower directive analysis', note:'Applicability, decision, record in Excel.' },
  ]},
  { key:'prep', title:'Pre-audit hygiene', ctrls:[], items:[
    { t:'Before every audit — check recurring ISMS tasks', note:'Nothing pending on the recurring list.' },
    { t:'Confirm 2027 audit dates — no duplication', note:'Check for calendar clashes.' },
    { t:'Remove former certifier mention from audit programme', note:'Auditor is CertCo.' },
  ]},
];

// ─── UNIFIED TIMELINE (Jun 2026 → Jun 2027) — every planned activity ────────
// Week-precision (52 weeks total). Month bands of 4 weeks each.
// Week 0..3 = Jun 26, 4..7 = Jul, ..., 48..51 = Jun 27.
const TL_MONTHS = ['Jun 26','Jul','Aug','Sep','Oct','Nov','Dec','Jan 27','Feb','Mar','Apr','May','Jun 27'];
const TL_WEEKS_PER_MONTH = 4;
const TL_TOTAL_WEEKS = TL_MONTHS.length * TL_WEEKS_PER_MONTH;   // 52
const SWIMLANES = [
  { id:'audit',      label:'Audits & Reviews',           color:'#B91C1C', icon:'clipboard-check' },
  { id:'security',   label:'Security operations',        color:'#6B2FA0', icon:'shield-check' },
  { id:'risk',       label:'Risk & BCM',                 color:'#F59E0B', icon:'alert-triangle' },
  { id:'training',   label:'Training & awareness',       color:'#047857', icon:'graduation-cap' },
  { id:'suppliers',  label:'Suppliers & compliance',     color:'#1D4ED8', icon:'building-2' },
  { id:'trust',      label:'Trust Center & product',     color:'#EC4899', icon:'sparkles' },
  { id:'42001',      label:'ISO/IEC 42001 track',        color:'#0D9488', icon:'route' },
];

// Each activity: swimlane, title, week range w:[startWeek, endWeek] (0..51), owner.
// Point/short items get 1-2 week ranges; multi-month items span multiple weeks.
const TIMELINE = [
  // — Audits & Reviews (all point-in-time events, 1 week) —
  { lane:'audit', t:'CertCo surveillance audit',             w:[2,3],   owner:'Jordan', detail:'16–17 Jun 2026 · re-certification (this cycle just closed).' },
  { lane:'audit', t:'Pentest — web app',                    w:[14,15], owner:'Sam',    detail:'Mid-Sep 2026 · external pentest provider.' },
  { lane:'audit', t:'Management Review (mid-year)',          w:[22,22], owner:'Alex',   detail:'Mid-Nov 2026 · progress on OFIs + KPIs.' },
  { lane:'audit', t:'Internal Audit (Clause 9.2)',           w:[38,41], owner:'J. Miller', detail:'Mar–Apr 2027 · full Annex A + clauses 4–10.' },
  { lane:'audit', t:'Pentest — pre-surveillance',           w:[42,43], owner:'Sam',    detail:'Apr 2027 · rescan + remediation window.' },
  { lane:'audit', t:'Management Review (pre-audit)',         w:[46,46], owner:'Alex',   detail:'Mid-May 2027 · Board sign-off before surveillance.' },
  { lane:'audit', t:'CertCo surveillance 2027',              w:[50,51], owner:'Jordan', detail:'Jun 2027 · confirm dates (avoid duplication).' },

  // — Security operations —
  { lane:'security', t:'Correct office in evacuation plan',      w:[4,4],   owner:'Morgan', detail:'Wrong office marked currently — 1 week fix.' },
  { lane:'security', t:'Retire outdated procedures',             w:[5,6],   owner:'Alex',       detail:'Retire legacy SW Dev, DoD, and AI model-dev procedures — 2 weeks.' },
  { lane:'security', t:'Refresh Network Diagram v2026-Q3',       w:[6,9],   owner:'Sam',        detail:'Reflect Hetzner + office + endpoint boundaries.' },
  { lane:'security', t:'Elastic endpoint coverage → 100%',       w:[5,10],  owner:'Sam',        detail:'Close remaining endpoint (one laptop outstanding).' },
  { lane:'security', t:'Backup restore test + evidence',         w:[8,11],  owner:'Sam',        detail:'Documented restore drill + retention log.' },
  { lane:'security', t:'Policy 18 v1.1 — BSI ref + backup encryption', w:[9,12], owner:'Sam',   detail:'Cite BSI TR-02102; add backup encryption row.' },
  { lane:'security', t:'Data-deletion procedure v1.0 (OFI-015)', w:[10,14], owner:'Alex',       detail:'Close OFI-015 gap on A.8.10.' },
  { lane:'security', t:'Dashboard secure-SDLC hardening',        w:[16,22], owner:'Alex',       detail:'Ownership+succession; credentials to Keeper; connection matrix.' },
  { lane:'security', t:'Web-filtering / VPN mechanism confirmed', w:[30,32], owner:'Sam',       detail:'Confirm A.8.23 mechanism.' },

  // — Recurring / calendar-driven security tasks —
  { lane:'security', t:'Vulnerability sweep (Q3)',               w:[11,11], owner:'Sam',        detail:'Quarterly patch/vuln sweep — production + endpoints.' },
  { lane:'security', t:'Board update on ISMS reviews (ISMS-1339)', w:[20,20], owner:'Alex',     detail:'Report to Board of reviews + expertise developed.' },
  { lane:'security', t:'Cryptographic key rotation cycle (ISMS-1295)', w:[24,24], owner:'Sam',  detail:'Documented key-rotation execution.' },
  { lane:'security', t:'Access rights review (ISMS-1369)',       w:[26,26], owner:'Sam',        detail:'Recurring — ties to A.5.15/5.18.' },
  { lane:'security', t:'Vulnerability sweep (Q4)',               w:[35,35], owner:'Sam',        detail:'Second-half sweep.' },
  { lane:'security', t:'Annual policy review — all 29 (ISMS-1381)', w:[40,43], owner:'Alex',    detail:'Review, approve, circulate all policies annually (Q2 2027).' },
  { lane:'security', t:'ISMS Objectives + KPIs review (ISMS-1544)', w:[45,45], owner:'Alex',    detail:'Feeds MR + Board brief.' },

  // — Risk & BCM —
  { lane:'risk', t:'Purge ex-employees from "Supported by"',     w:[4,4],   owner:'Alex',       detail:'Clean risk-register support column — 1 week.' },
  { lane:'risk', t:'Physical Security Risk Analysis (office)',   w:[16,19], owner:'Morgan',     detail:'Tailgating, door propping, other tenants.' },
  { lane:'risk', t:'Consolidate → ONE Risk Register',            w:[16,22], owner:'Alex',       detail:'Merge all scattered risk analyses.' },
  { lane:'risk', t:'Add agentic-AI risk; rework sabotage',       w:[18,20], owner:'Alex',       detail:'Concretize; broaden beyond ex-employees.' },
  { lane:'risk', t:'BIA per team → RTO/RPO consolidated',        w:[20,25], owner:'Alex',       detail:'Team declarations; CISO consolidates.' },
  { lane:'risk', t:'SLA sheet for all services',                 w:[22,25], owner:'Jordan',     detail:'Consolidated SLA view.' },
  { lane:'risk', t:'Emergency communication line',               w:[24,25], owner:'Alex',       detail:'Independent of email/Slack — 2 weeks.' },
  { lane:'risk', t:'BCM simulation — whole-chain scenario',      w:[26,29], owner:'Jordan',     detail:'Server restore + client comms + call tree.' },
  { lane:'risk', t:'Employee BCM drills',                        w:[30,33], owner:'Riley',      detail:'Practical + rehearsed.' },

  // — Training & awareness —
  { lane:'training', t:'CISO job description',                   w:[5,5],   owner:'Jordan',     detail:'Formal JD for Alex — 1 week.' },
  { lane:'training', t:'Publish 2026–27 training calendar',      w:[6,6],   owner:'Alex',       detail:'Awareness, leadership, phishing, BCM, DP — 1 week.' },
  { lane:'training', t:'InfoSec awareness — all employees on the LMS', w:[6,14], owner:'Alex',   detail:'Assign + track ≥ 8/10 pass.' },
  { lane:'training', t:'External training vendors sourced',      w:[20,23], owner:'Jordan',     detail:'Awareness, leadership, IP rights.' },
  { lane:'training', t:'Awareness training — participation evidence', w:[26,26], owner:'Alex',  detail:'OFI-012 recurring — evidence for all employees.' },
  { lane:'training', t:'Phishing simulation (annual)',           w:[28,28], owner:'Sam',        detail:'Baseline + follow-up — 1 week.' },
  { lane:'training', t:'IP-rights training for all',             w:[32,35], owner:'Alex',       detail:'Move IP doc into the document system; roll out.' },
  { lane:'training', t:'Leadership training (A.5.36)',           w:[32,40], owner:'Alex',       detail:'Role-model policy adherence.' },
  { lane:'training', t:'New training modules (Trust, AI, Incident)', w:[14,22], owner:'Riley',  detail:'Bespoke modules for Acme context.' },
  { lane:'training', t:'LMS platform refresh',                   w:[16,26], owner:'Riley',      detail:'Version bump + platform refresh + course updates.' },

  // — Suppliers & compliance —
  { lane:'suppliers', t:'Complete Vendors Register',              w:[5,8],   owner:'Jordan',    detail:'Add Consulting/Trainings/Workshops; close gaps.' },
  { lane:'suppliers', t:'Applicable Law Register (renamed + owner)', w:[9,13], owner:'Dana',    detail:'AI regs, Whistleblower, NIS2 justification.' },
  { lane:'suppliers', t:'Per-SaaS exit strategies documented',    w:[13,22], owner:'Alex',      detail:'All Material Outsourcing (Hetzner, GitLab, office suite, task tracker, Personio, Stripe).' },
  { lane:'suppliers', t:'RoPA residency shift to Acme (A.5.34)', w:[21,25], owner:'Dana',       detail:'Dana retains ownership; source at Acme.' },
  { lane:'suppliers', t:'Central supplier contracts store',       w:[28,31], owner:'Jordan',    detail:'One repository for all.' },
  { lane:'suppliers', t:'Redefine third-party risk criteria',     w:[30,32], owner:'Alex',      detail:'Replace 10%/50% heuristic.' },
  { lane:'suppliers', t:'Sub-processors verified in DPAs',        w:[30,31], owner:'Dana',      detail:'A.5.21 evidence — 2 weeks.' },
  { lane:'suppliers', t:'Annual supplier assessment cycle',       w:[32,40], owner:'Jordan',    detail:'By information-system owner; prioritized by criticality.' },
  { lane:'suppliers', t:'ISRA & SoA review annually',             w:[36,39], owner:'Alex',      detail:'Recurring per Policy 23 — full re-assessment before internal audit.' },

  // — Trust Center & product —
  { lane:'trust', t:'Trust Center — scope & requirements',        w:[6,10],  owner:'Alex+IT',   detail:'Q3 kickoff with IT: what to publish (certifications, sub-processors, security posture).' },
  { lane:'trust', t:'Trust Center — design + build',              w:[14,22], owner:'Alex+IT',   detail:'Q4 build: static site or platform (Vanta/Drata/OneTrust).' },
  { lane:'trust', t:'Trust Center — soft-launch',                 w:[24,29], owner:'Alex+IT',   detail:'Publish; internal + trusted-client review.' },
  { lane:'trust', t:'Public sub-processor page + notifications',  w:[28,31], owner:'Dana',      detail:'GDPR sub-processor discipline.' },
  { lane:'trust', t:'Trust Center — sales enablement',            w:[32,37], owner:'Riley',     detail:'Sales team trained; embed in RFP flow.' },

  // — ISO/IEC 42001 track —
  { lane:'42001', t:'42001 gap analysis vs Policy 28',            w:[6,13],  owner:'Alex',      detail:'Map Policy 28 v1.1 → 42001 Annex A (~38 controls).' },
  { lane:'42001', t:'AI system inventory + EU AI Act mapping',    w:[10,14], owner:'Sam',       detail:'Provider, purpose, data flows, risk category.' },
  { lane:'42001', t:'AI Impact Assessment (AIA) process live',    w:[14,22], owner:'Alex',      detail:'Every new AI use = AIA before launch.' },
  { lane:'42001', t:'Policy 28 → split into 28a/28b/28c',         w:[16,22], owner:'Alex',      detail:'AI dev / AI ops / AI risk & impact.' },
  { lane:'42001', t:'Model registry + training-data lineage',     w:[24,35], owner:'Sam',       detail:'Version, owner, evaluation, approved use.' },
  { lane:'42001', t:'AI incident-response playbook',              w:[28,33], owner:'Alex',      detail:'Extends Policy 05.' },
  { lane:'42001', t:'42001 internal audit',                       w:[40,45], owner:'External',  detail:'Independent auditor familiar with AIMS.' },
  { lane:'42001', t:'42001 Stage 1 + Stage 2',                    w:[48,51], owner:'CertCo',    detail:'H2 2027 · combined with 27001 if certifier supports.' },
];

// ─── QUARTERLY SUMMARY (for management overview) ────────────────────────────
const ROADMAP_2026_27 = [
  { q:'Q3 2026 (Jul–Sep)', highlight:'Close audit notes · rebuild registers · start Trust Center', items:[
    'Network diagram, backup restore test, data-deletion procedure',
    'Exit strategies per Material SaaS (Policy 27 §6.7)',
    'Complete Vendors Register (add Consulting/Trainings/Workshops)',
    'Applicable Law Register renamed + owner + last-checked',
    'Policy 18 v1.1 — BSI TR-02102 ref + backup encryption',
    'Retire outdated procedures; CISO JD; publish training calendar',
    'ISMS objectives sent to the Board',
    'Pentest (web app) · Sep 2026',
    'Trust Center Q3 kickoff with IT team — scope & requirements',
    '42001 gap analysis vs Policy 28; AI system inventory',
  ]},
  { q:'Q4 2026 (Oct–Dec)', highlight:'Risk maturity · BIA · BCM drill · Trust Center build', items:[
    'ONE consolidated Risk Register (merge all analyses)',
    'Add agentic-AI risk; rework sabotage; purge ex-employees',
    'Physical Security Risk Analysis for office',
    'BIA per team → RTO/RPO consolidated',
    'SLA sheet for all services',
    'BCM simulation (whole-chain scenario) + employee drills',
    'Emergency communication line',
    'Mid-year Management Review · Nov 2026',
    'Trust Center design + build (Q4 core deliverable)',
    'New training modules (Trust, AI, Incident) built; LMS refresh',
    'RoPA residency shift to Acme (A.5.34)',
  ]},
  { q:'Q1 2027 (Jan–Mar)', highlight:'External trainings · annual supplier review · leadership', items:[
    'InfoSec awareness on the LMS — all employees ≥ 8/10',
    'IP-rights training rolled out',
    'Leadership training programme (A.5.36)',
    'External training vendors engaged',
    'Annual supplier assessment (by system owner, criticality-prioritized)',
    'Redefined third-party risk criteria',
    'Sub-processors verified in DPAs (A.5.21)',
    'Web-filtering / VPN mechanism confirmed + documented',
    'Central supplier contracts store',
    'Trust Center soft-launch (Q1 close-in)',
    'AI Impact Assessment process live; Policy 28 split into 28a/28b/28c',
  ]},
  { q:'Q2 2027 (Apr–Jun)', highlight:'Internal audit · pentest · pre-surveillance', items:[
    'Internal audit (Clause 9.2) — full Annex A + clauses 4–10',
    'Pentest — pre-surveillance rescan · Apr 2027',
    'Management Review · May 2027 (pre-audit sign-off)',
    'Pre-audit hygiene sweep — every recurring task current',
    'Employee drills (BCM, incident, data-breach) rehearsed',
    'CertCo surveillance 2027 · Jun 2027 (dates confirmed, no duplication)',
    '42001 internal audit + Stage 1/Stage 2 (H2 2027)',
    'Trust Center sales enablement complete; embedded in RFP flow',
  ]},
];

// ─── ISO/IEC 42001 phase card content ───────────────────────────────────────
const ISO_42001_PLAN = {
  goal:  'Achieve initial ISO/IEC 42001:2023 certification alongside the 27001 cycle',
  targetAudit: 'H2 2027 · Stage 1 + Stage 2 (ideally combined with 27001 surveillance if certifier supports)',
  scope: 'AI systems developed and operated by Acme (B2B SaaS analytics platform, client models, internal AI tooling and evaluations)',
  dependencies: [
    'ISO 27001 Risk Register consolidation must complete first',
    'EU AI Act compliance evidence (CR-003/CR-004) is a prerequisite',
    'RoPA residency at Acme (needed for AI training-data governance)',
    'Certification body selection (check CertCo 42001 offering; else an alternative accredited body)',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
//                            RENDER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function RM_Tile({ label, value, sub, color }) {
  return (
    <Card padding={16}>
      <div style={{ fontSize:11.5, color:'#6B7280', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.04em' }}>{label}</div>
      <div style={{ fontSize:26, fontWeight:600, color: color || '#111827', marginTop:6, lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:'#6B7280', marginTop:6 }}>{sub}</div>}
    </Card>
  );
}

// Interactive Gantt-ish timeline. Row per swimlane; bar per activity; hover to see detail.
function TimelineChart({ data, setData, months, lanes, activeLane, setActiveLane, activeItem, setActiveItem, onReset }) {
  // Zoom is per-month; each month = TL_WEEKS_PER_MONTH weeks; so weekW = monthW / weeksPerMonth.
  const [monthW, setMonthW] = React.useState(120);
  const MIN_MW = 80, MAX_MW = 280;
  const weekW = monthW / TL_WEEKS_PER_MONTH;
  const totalWeeks = TL_TOTAL_WEEKS;
  const chartW = totalWeeks * weekW;
  const LABEL_W = 180;
  const ROW_H = 24;         // row per item
  const LANE_PAD = 6;        // vertical padding per lane
  const [drag, setDrag] = React.useState(null); // { idx, mode, startX, origW }
  const zoom = (delta) => setMonthW(w => Math.max(MIN_MW, Math.min(MAX_MW, w + delta)));

  // Drag / resize (snap to week).
  const startDrag = (e, idx, mode) => {
    e.stopPropagation();
    e.preventDefault();
    setDrag({ idx, mode, startX: e.clientX, origW: [...data[idx].w] });
  };
  React.useEffect(() => {
    if (!drag) return;
    const onMove = (e) => {
      const deltaW = Math.round((e.clientX - drag.startX) / weekW);
      const { idx, mode, origW } = drag;
      const maxW = totalWeeks - 1;
      let w0 = origW[0], w1 = origW[1];
      if (mode === 'move') {
        const span = origW[1] - origW[0];
        w0 = Math.max(0, Math.min(maxW - span, origW[0] + deltaW));
        w1 = w0 + span;
      } else if (mode === 'resize-left') {
        w0 = Math.max(0, Math.min(origW[1], origW[0] + deltaW));
      } else if (mode === 'resize-right') {
        w1 = Math.max(origW[0], Math.min(maxW, origW[1] + deltaW));
      }
      setData(d => {
        const next = [...d];
        next[idx] = { ...next[idx], w: [w0, w1] };
        return next;
      });
    };
    const onUp = () => setDrag(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [drag, weekW, totalWeeks, setData]);
  return (
    <Card padding={0}>
      <div style={{ padding:'14px 18px 8px', display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'#111827' }}>ISMS Activity Timeline · Jun 2026 → Jun 2027</h2>
          <div style={{ fontSize:11.5, color:'#6B7280', marginTop:2 }}>Drag a bar to reschedule · drag edges to resize · click a swimlane to filter · hover for details.</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:10.5, color:'#6B7280', marginRight:4 }}>Width</span>
          <button onClick={()=>zoom(-30)} disabled={monthW<=MIN_MW}
            style={{ width:26, height:26, borderRadius:6, border:'1px solid #E5E7EB', background:'#fff', cursor: monthW<=MIN_MW?'not-allowed':'pointer', fontWeight:600, color:'#374151' }} title="Narrower">−</button>
          <input type="range" min={MIN_MW} max={MAX_MW} step={10} value={monthW}
            onChange={e=>setMonthW(+e.target.value)}
            style={{ width:110, accentColor:'#6B2FA0' }}/>
          <button onClick={()=>zoom(30)} disabled={monthW>=MAX_MW}
            style={{ width:26, height:26, borderRadius:6, border:'1px solid #E5E7EB', background:'#fff', cursor: monthW>=MAX_MW?'not-allowed':'pointer', fontWeight:600, color:'#374151' }} title="Wider">+</button>
          <button onClick={()=>setMonthW(120)}
            style={{ fontSize:11, padding:'4px 8px', borderRadius:6, border:'1px solid #E5E7EB', background:'#fff', cursor:'pointer', color:'#374151' }}>Reset zoom</button>
          <span style={{ width:1, height:20, background:'#E5E7EB', margin:'0 4px' }}/>
          <button onClick={()=>{ setActiveLane(null); setActiveItem(null); }}
            style={{ fontSize:11.5, padding:'4px 10px', borderRadius:6, border:'1px solid #E5E7EB', background:'#fff', cursor:'pointer', color:'#374151' }}>
            Clear filter
          </button>
          {onReset && (
            <button onClick={onReset}
              style={{ fontSize:11.5, padding:'4px 10px', borderRadius:6, border:'1px solid #E5E7EB', background:'#fff', cursor:'pointer', color:'#B91C1C' }}
              title="Restore original dates">
              Undo all drags
            </button>
          )}
        </div>
      </div>
      {/* Legend */}
      <div style={{ padding:'0 18px 8px', display:'flex', flexWrap:'wrap', gap:8 }}>
        {lanes.map(l => {
          const on = !activeLane || activeLane === l.id;
          return (
            <span key={l.id} onClick={()=> setActiveLane(activeLane===l.id ? null : l.id)}
              style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'3px 9px', borderRadius:9999,
                       fontSize:11, fontWeight:600, cursor:'pointer',
                       background: on ? l.color+'22' : '#F3F4F6', color: on ? l.color : '#9CA3AF',
                       border:`1px solid ${on ? l.color+'55' : '#E5E7EB'}` }}>
              <span style={{ width:8, height:8, borderRadius:9999, background:l.color, opacity: on?1:0.35 }}/>
              {l.label}
            </span>
          );
        })}
      </div>

      <div style={{ overflowX:'auto', padding:'0 18px 16px' }}>
        <div style={{ position:'relative', width: chartW + LABEL_W, minWidth: '100%' }}>
          {/* Month headers with quarter tint */}
          <div style={{ display:'flex', paddingLeft: LABEL_W, borderBottom:'1px solid #E5E7EB', position:'sticky', top:0, background:'#fff', zIndex:2 }}>
            {months.map((m,i) => {
              // quarter tint alternating for readability
              const qtint = ((Math.floor(i/3)) % 2 === 0) ? 'rgba(0,0,0,0.015)' : 'transparent';
              return (
                <div key={i} style={{ width: monthW, textAlign:'center',
                                      fontSize:11, color:'#374151', fontWeight:600, letterSpacing:'0.02em',
                                      padding:'6px 0 6px', background:qtint }}>{m}</div>
              );
            })}
          </div>

          {/* Swimlanes */}
          {lanes.map((lane, li) => {
            const on = !activeLane || activeLane === lane.id;
            const laneItems = data.map((d,idx) => ({ d, idx })).filter(x => x.d.lane === lane.id);
            const laneH = laneItems.length * ROW_H + LANE_PAD * 2;
            return (
              <div key={lane.id} style={{ position:'relative', display:'flex', alignItems:'stretch',
                                          borderBottom:'1px solid #F3F4F6',
                                          opacity: on ? 1 : 0.22, transition:'opacity 150ms',
                                          minHeight: laneH }}>
                {/* Lane label */}
                <div style={{ width:LABEL_W, flexShrink:0, display:'flex', alignItems:'center', gap:8,
                              padding:'8px 12px', cursor:'pointer',
                              borderRight:'1px solid #E5E7EB',
                              background: activeLane===lane.id ? lane.color+'0F' : '#FAFAFC' }}
                  onClick={()=> setActiveLane(activeLane===lane.id ? null : lane.id)}>
                  <span style={{ width:10, height:10, borderRadius:9999, background:lane.color, flexShrink:0 }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'#111827', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{lane.label}</div>
                    <div style={{ fontSize:10, color:'#9CA3AF', marginTop:1 }}>{laneItems.length} item{laneItems.length!==1?'s':''}</div>
                  </div>
                </div>

                {/* Track — month gridlines + row per item */}
                <div style={{ position:'relative', flex:1, minHeight: laneH }}>
                  {/* Month gridlines */}
                  {months.map((_,mi) => {
                    const qtint = ((Math.floor(mi/3)) % 2 === 0) ? 'rgba(0,0,0,0.015)' : 'transparent';
                    return (
                      <div key={mi} style={{ position:'absolute', left: mi*monthW, top:0, bottom:0, width:monthW,
                                              borderRight:'1px solid #F3F4F6', background:qtint }}/>
                    );
                  })}
                  {/* Bars — one row each */}
                  {laneItems.map(({ d: it, idx }, i) => {
                    const active = activeItem === it;
                    const isDragging = drag && drag.idx === idx;
                    const [w0,w1] = it.w;
                    const left = w0 * weekW;
                    const width = Math.max((w1 - w0 + 1) * weekW, 8);
                    const isShort = (w1 - w0) <= 1;
                    const top = LANE_PAD + i * ROW_H + 4;
                    const barH = 16;
                    return (
                      <div key={idx}
                        onMouseEnter={()=> !drag && setActiveItem(it)}
                        onMouseLeave={()=> !drag && setActiveItem(a => a === it ? null : a)}
                        onMouseDown={(e)=> startDrag(e, idx, 'move')}
                        onClick={(e)=> { if (!isDragging) setActiveItem(a => a === it ? null : it); }}
                        style={{ position:'absolute', top, height: barH,
                                 left, width,
                                 background: lane.color,
                                 borderRadius: 5,
                                 opacity: active || isDragging ? 1 : 0.9,
                                 boxShadow: (active || isDragging) ? `0 0 0 3px ${lane.color}33` : `0 1px 2px rgba(0,0,0,0.08)`,
                                 cursor: isDragging ? 'grabbing' : 'grab',
                                 userSelect:'none' }}
                        title={`${it.t} · drag to move · drag edges to resize`}>
                        {/* Left resize handle */}
                        <div onMouseDown={(e)=> startDrag(e, idx, 'resize-left')}
                          style={{ position:'absolute', left:0, top:0, bottom:0, width:5, cursor:'ew-resize',
                                   background:'rgba(0,0,0,0.2)', borderTopLeftRadius:5, borderBottomLeftRadius:5 }}/>
                        {/* Right resize handle */}
                        <div onMouseDown={(e)=> startDrag(e, idx, 'resize-right')}
                          style={{ position:'absolute', right:0, top:0, bottom:0, width:5, cursor:'ew-resize',
                                   background:'rgba(0,0,0,0.2)', borderTopRightRadius:5, borderBottomRightRadius:5 }}/>
                      </div>
                    );
                  })}
                  {/* Labels rendered separately so short bars can overflow their label to the right */}
                  {laneItems.map(({ d: it, idx }, i) => {
                    const [w0,w1] = it.w;
                    const left = w0 * weekW;
                    const width = (w1 - w0 + 1) * weekW;
                    const top = LANE_PAD + i * ROW_H + 4;
                    const barH = 16;
                    const isShort = width < 120;
                    return (
                      <div key={`lbl-${idx}`}
                        style={{ position:'absolute',
                                 top: top - 1, height: barH + 2,
                                 left: isShort ? (left + width + 6) : (left + 8),
                                 maxWidth: isShort ? (LABEL_W + chartW - (left + width + 6) - 6) : (width - 16),
                                 display:'flex', alignItems:'center',
                                 fontSize:11, fontWeight:500,
                                 color: isShort ? '#374151' : '#fff',
                                 whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                                 pointerEvents:'none',
                                 textShadow: isShort ? 'none' : '0 1px 1px rgba(0,0,0,0.15)' }}>
                        {it.t}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {activeItem && (() => {
        const [w0,w1] = activeItem.w;
        const monthOf = (w) => months[Math.min(months.length-1, Math.floor(w/TL_WEEKS_PER_MONTH))];
        const wkOfMonth = (w) => (w % TL_WEEKS_PER_MONTH) + 1;
        const span = w1 - w0 + 1;
        const durLabel = span === 1 ? '1 week' : span < TL_WEEKS_PER_MONTH ? `${span} weeks` :
                         span % TL_WEEKS_PER_MONTH === 0 ? `${span/TL_WEEKS_PER_MONTH} month${span/TL_WEEKS_PER_MONTH>1?'s':''}` :
                         `${span} weeks`;
        return (
          <div style={{ padding:'12px 18px', borderTop:'1px solid #E5E7EB', background:'#FAFAFC' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ width:10, height:10, borderRadius:9999, background: lanes.find(l=>l.id===activeItem.lane).color }}/>
              <span style={{ fontSize:13.5, fontWeight:600, color:'#111827' }}>{activeItem.t}</span>
              <span style={{ marginLeft:'auto', fontSize:11, color:'#6B7280', fontFamily:'ui-monospace, monospace' }}>
                {monthOf(w0)} wk{wkOfMonth(w0)}{w0!==w1 ? ` → ${monthOf(w1)} wk${wkOfMonth(w1)}` : ''} · {durLabel} · Owner: {activeItem.owner}
              </span>
            </div>
            <div style={{ fontSize:12, color:'#374151', marginTop:5, lineHeight:1.5 }}>{activeItem.detail}</div>
          </div>
        );
      })()}
    </Card>
  );
}

function RM_ThemeCard({ th }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Card padding={0}>
      <div onClick={()=>setOpen(o=>!o)}
        style={{ padding:'12px 16px', cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}
        onMouseEnter={e=>e.currentTarget.style.background='#FAFAFC'}
        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
        <Icon name="chevron-down" size={14} color="#9CA3AF" style={{ transform: open?'rotate(180deg)':'none', transition:'transform 150ms' }}/>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13.5, fontWeight:600, color:'#111827' }}>{th.title}</div>
          <div style={{ fontSize:11, color:'#6B7280', marginTop:2 }}>{th.items.length} items · {th.ctrls.length ? th.ctrls.join(' · ') : 'cross-cutting'}</div>
        </div>
        <span style={{ fontSize:11, fontWeight:600, color:'#B45309', background:'#FFFBEB', padding:'3px 8px', borderRadius:9999 }}>{th.items.length} to act</span>
      </div>
      {open && (
        <div style={{ padding:'2px 16px 14px 40px', borderTop:'1px solid #F3F4F6', background:'#FAFAFC' }}>
          <ul style={{ margin:'8px 0 0', paddingLeft:0, listStyle:'none', display:'flex', flexDirection:'column', gap:8 }}>
            {th.items.map((it,i) => (
              <li key={i} style={{ padding:'8px 10px', borderRadius:6, background:'#fff', border:'1px solid #EEF0F3' }}>
                <div style={{ fontSize:12.5, fontWeight:600, color:'#111827' }}>{it.t}</div>
                {it.note && <div style={{ fontSize:11.5, color:'#4B5563', marginTop:3, lineHeight:1.5 }}>{it.note}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

function RM_QuarterCard({ q }) {
  return (
    <Card padding={16}>
      <div style={{ fontSize:11, fontWeight:600, color:'#6B2FA0', textTransform:'uppercase', letterSpacing:'0.06em' }}>{q.q}</div>
      <div style={{ fontSize:13.5, fontWeight:600, color:'#111827', marginTop:5 }}>{q.highlight}</div>
      <ul style={{ margin:'10px 0 0', paddingLeft:18, fontSize:12, color:'#374151', lineHeight:1.55 }}>
        {q.items.map((it,i) => <li key={i} style={{ marginBottom:3 }}>{it}</li>)}
      </ul>
    </Card>
  );
}

function RoadmapPage() {
  const [activeLane, setActiveLane] = React.useState(null);
  const [activeItem, setActiveItem] = React.useState(null);
  const [tab, setTab] = React.useState('timeline'); // timeline | findings | quarterly | 42001

  // Timeline state (mutable — drag/drop rescheduling). Persist to sessionStorage.
  // Key bumped to v2 (week-precision schema — invalidates any old month-precision cache).
  const [timelineData, setTimelineData] = React.useState(() => {
    try {
      const saved = sessionStorage.getItem('roadmapTimeline_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === TIMELINE.length
            && parsed[0] && Array.isArray(parsed[0].w)) return parsed;
      }
    } catch(e){}
    return TIMELINE;
  });
  React.useEffect(() => {
    try { sessionStorage.setItem('roadmapTimeline_v2', JSON.stringify(timelineData)); } catch(e){}
  }, [timelineData]);
  const resetTimeline = () => { setTimelineData(TIMELINE); sessionStorage.removeItem('roadmapTimeline_v2'); };

  const totalNotes = AUDIT_2026_THEMES.reduce((n,t)=>n+t.items.length,0);
  const filteredData = timelineData;  // filter is visual via activeLane; keep indices stable

  const TabBtn = ({ id, label, count }) => (
    <button onClick={()=>setTab(id)}
      style={{ padding:'7px 14px', borderRadius:8, border:'1px solid ' + (tab===id ? '#6B2FA0' : '#E5E7EB'),
               background: tab===id ? 'rgba(107,47,160,0.08)' : '#fff',
               fontSize:12.5, fontWeight:600, color: tab===id ? '#6B2FA0' : '#374151',
               cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6 }}>
      {label}
      {count !== undefined && <span style={{ fontSize:10.5, background: tab===id ? '#6B2FA0' : '#E5E7EB', color: tab===id ? '#fff' : '#6B7280', padding:'1px 6px', borderRadius:9999 }}>{count}</span>}
    </button>
  );

  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:16, maxWidth:1360 }}>
      {/* Header banner */}
      <div style={{ padding:'14px 18px', borderRadius:10, background:'rgba(107,47,160,0.06)', border:'1px solid rgba(107,47,160,0.18)', color:'#4A1F70' }}>
        <div style={{ fontSize:14, fontWeight:600 }}>Post-audit plan · Jun 2026 → Jun 2027 · Management overview</div>
        <div style={{ fontSize:12, marginTop:4, lineHeight:1.5 }}>
          {AUDIT_2026.auditor} · {AUDIT_2026.scope} · Verdict: <strong>{AUDIT_2026.verdict}</strong>. {AUDIT_2026.closingSummary}
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:12 }}>
        <RM_Tile label="Timeline activities" value={TIMELINE.length}            sub={`across ${SWIMLANES.length} swimlanes`} color="#6B2FA0"/>
        <RM_Tile label="Audit-note items"    value={totalNotes}                  sub={`${AUDIT_2026_THEMES.length} themes`}   color="#B45309"/>
        <RM_Tile label="Audits & Reviews"    value={TIMELINE.filter(t=>t.lane==='audit').length}    sub="incl. surveillance"    color="#B91C1C"/>
        <RM_Tile label="Training items"      value={TIMELINE.filter(t=>t.lane==='training').length} sub="modules + calendar"    color="#047857"/>
        <RM_Tile label="42001 activities"    value={TIMELINE.filter(t=>t.lane==='42001').length}    sub="target: H2 2027"       color="#0D9488"/>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        <TabBtn id="timeline"  label="Timeline"           count={TIMELINE.length}/>
        <TabBtn id="findings"  label="Audit findings"     count={totalNotes}/>
        <TabBtn id="quarterly" label="Quarterly plan"     count={ROADMAP_2026_27.length}/>
        <TabBtn id="42001"     label="ISO 42001 track"    count={TIMELINE.filter(t=>t.lane==='42001').length}/>
      </div>

      {/* Content by tab */}
      {tab === 'timeline' && (
        <TimelineChart
          data={timelineData} setData={setTimelineData}
          months={TL_MONTHS}
          lanes={SWIMLANES}
          activeLane={activeLane} setActiveLane={setActiveLane}
          activeItem={activeItem} setActiveItem={setActiveItem}
          onReset={resetTimeline}
        />
      )}

      {tab === 'findings' && (
        <div>
          <div style={{ fontSize:11.5, color:'#6B7280', marginBottom:10 }}>Click any theme to expand. All items are auditor notes / OFI candidates — no Nonconformities were raised.</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {AUDIT_2026_THEMES.map(th => <RM_ThemeCard key={th.key} th={th}/>)}
          </div>
        </div>
      )}

      {tab === 'quarterly' && (
        <div>
          <div style={{ fontSize:11.5, color:'#6B7280', marginBottom:10 }}>Quarterly plan for management review. Cadence: mid-year MR in Nov 2026; pre-audit MR in May 2027.</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {ROADMAP_2026_27.map(q => <RM_QuarterCard key={q.q} q={q}/>)}
          </div>
        </div>
      )}

      {tab === '42001' && (
        <div>
          <div style={{ padding:'10px 14px', borderRadius:8, background:'rgba(13,148,136,0.08)', border:'1px solid rgba(13,148,136,0.2)', color:'#0F766E', fontSize:12, lineHeight:1.55, marginBottom:12 }}>
            <strong>Goal:</strong> {ISO_42001_PLAN.goal}<br/>
            <strong>Scope:</strong> {ISO_42001_PLAN.scope}<br/>
            <strong>Target audit:</strong> {ISO_42001_PLAN.targetAudit}
          </div>
          <TimelineChart
            data={timelineData} setData={setTimelineData}
            months={TL_MONTHS}
            lanes={SWIMLANES.filter(l=>l.id==='42001')}
            activeLane={null} setActiveLane={()=>{}}
            activeItem={activeItem} setActiveItem={setActiveItem}
          />
          <div style={{ marginTop:12, padding:'10px 14px', borderRadius:8, background:'#FAFAFC', border:'1px solid #EEF0F3', fontSize:11.5, color:'#374151', lineHeight:1.55 }}>
            <strong style={{ color:'#111827' }}>Dependencies</strong>
            <ul style={{ margin:'6px 0 0', paddingLeft:18 }}>
              {ISO_42001_PLAN.dependencies.map((d,i)=> <li key={i}>{d}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { RoadmapPage, AUDIT_2026, AUDIT_2026_THEMES, ROADMAP_2026_27, ISO_42001_PLAN, TIMELINE });

registerWidget('page-roadmap', RoadmapPage);
