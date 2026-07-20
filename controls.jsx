// Controls (Annex A) page — tabs, filters, table, slide-over drawer
const { useState: useCtrlState, useMemo: useCtrlMemo } = React;

// Demo audit history per control — illustrative review notes for the sample dataset
const CTRL_HISTORY = {
  '5.1': [
    { date:'Jun 9, 2026',  label:'All 23 ISMS policies released at v1.0. Approval streamlined under EX-001 (ISMS-1180) — CISO-drafted, approved by a single board member or CTO. All policies now live and communicated to the team.', type:'review' },
  ],
  '5.2': [
    { date:'Jun 12, 2026', label:'IS roles and responsibilities updated in ISO mandatory documents in Q1 2026. Role matrix current and reflects the current team structure.', type:'review' },
  ],
  '5.3':  [{ date:'Jan 8, 2026',  label:'Critical roles separated; role matrix documented across key business processes', type:'review' }],
  '5.5':  [{ date:'Jan 8, 2026',  label:'Subscribed to national data-protection and sector-regulator mailing lists for regulatory updates and advisories', type:'review' }],
  '5.6':  [{ date:'Jan 8, 2026',  label:'Joined security forums on LinkedIn (Cybersecurity Community, ISO 27001 group)', type:'review' }],
  '5.7':  [{ date:'Jan 12, 2026', label:'Threat intelligence sourced from Elastic logs and built-in detection', type:'review' }],
  '5.9':  [{ date:'Jan 14, 2026', label:'Sam maintaining asset inventory; verified through device return tracking on offboarding', type:'review' }],
  '5.10': [{ date:'Jan 9, 2026',  label:'Approved software list and acceptable use guidelines communicated via employee handbook', type:'review' }],
  '5.11': [{ date:'Jan 9, 2026',  label:'HR/CTO managing device return process; last return recorded Dec 18, 2025 (leaver offboarding)', type:'review' }],
  '5.12': [
    { date:'Jun 9, 2026',  label:'3-level classification scheme in place: Public, Internal (Use Only), Confidential. Documented in Policy 16 — Data Classification and Handling Policy v1.0 (released 09.06.2026). Simplified from earlier 4-level approach (changed in v0.2, Jan 2025). Scheme referenced in the Employee Handbook.', type:'review' },
  ],
  '5.14': [{ date:'Jan 12, 2026', label:'Acme handbook covers information transfer security requirements per policy', type:'review' }],
  '5.18': [
    { date:'Jan 19, 2026', label:'Access rights maintained by Sam; last review at leaver offboarding Dec 18, 2025; process confirmed in place', type:'review' },
  ],
  '5.19': [{ date:'Jan 13, 2026', label:'Supplier due diligence in place; latest performed with VendorOne', type:'review' }],
  '5.21': [{ date:'Jan 16, 2026', label:'Supplier due diligences ongoing; IT outsourcing under evaluation — control under active review', type:'review' }],
  '5.23': [{ date:'Jan 9, 2026',  label:'No cloud used for client services; internal cloud tools (document portal, AI coding) governed by internal policies', type:'review' }],
  '5.25': [
    { date:'Jan 27, 2026', label:'Formal CERT-led severity evaluation: Urgent/High/Normal/Low tagging based on business impact and data loss', type:'review' },
    { date:'Jan 19, 2026', label:'Incident assessment and decision process running correctly', type:'review' },
    { date:'Oct 14, 2024', label:'Sam-managed incident list in place; staff trained to differentiate events from incidents', type:'review' },
  ],
  '5.27': [
    { date:'Jan 27, 2026', label:'Lessons-learned structured as Step 7 of incident management; action items tracked as linked tracker tasks', type:'review' },
    { date:'Jan 16, 2026', label:'Incidents managed with Sam\'s system; learnings applied to preventive measures', type:'review' },
  ],
  '5.28': [{ date:'Jan 12, 2026', label:'Evidence collection supported by Elastic logging on laptops; control in progress', type:'review' }],
  '5.31': [{ date:'Jan 13, 2026', label:'Legal requirements monitored as a team; latest: Directive (EU) 2023/970 tracked Jan 2026', type:'review' }],
  '5.32': [{ date:'Jan 19, 2026', label:'IP registration renewal in progress; trademark renewal discussed with leadership; brand protection owner to be assigned', type:'review' }],
  '5.35': [
    { date:'Jan 16, 2026', label:'ISO audit being planned with CertCo', type:'review' },
    { date:'Oct 14, 2024', label:'Two external audit rounds planned: Dec 2024 and Mar 2025', type:'review' },
  ],
  '5.36': [{ date:'Jan 16, 2026', label:'Compliance review pending; control marked partially in place', type:'review' }],
  '6.1': [
    { date:'Jan 19, 2026', label:'Riley confirmed as responsible; IT outsourcing onboarding to follow screening process', type:'review' },
    { date:'Oct 14, 2024', label:'Reference checks, CV accuracy, and criminal record checks for critical roles confirmed in place', type:'review' },
  ],
  '6.2': [
    { date:'Jan 19, 2026', label:'T&Cs communicated to departing staff; ISO-compliant contract template used for all new joiners', type:'review' },
    { date:'Oct 14, 2024', label:'ISO-compliant contract template approved by leadership; existing staff covered via ISMS policy training', type:'review' },
  ],
  '6.3': [{ date:'Jun 3, 2026',  label:'Two trainings completed in 2026; training process running as planned', type:'review' }],
  '6.4': [
    { date:'Jan 19, 2026', label:'Process strengthened with additional officials; all staff aware of the document', type:'review' },
    { date:'Dec 6, 2024',  label:'Final version approved by leadership; all team signed acknowledgement Dec 5, 2024', type:'review' },
    { date:'Oct 14, 2024', label:'Disciplinary process presented to leadership on Oct 7, 2024 and approved by Jordan', type:'review' },
  ],
  '6.5': [
    { date:'Jan 19, 2026', label:'Exit formalities handled by Riley, Sam and Morgan; T&Cs communicated to departing staff', type:'review' },
    { date:'Oct 14, 2024', label:'Control in place', type:'review' },
  ],
  '6.6': [
    { date:'Jan 19, 2026', label:'NDAs managed by Alex; templates in place; no gaps to date', type:'review' },
    { date:'Oct 14, 2024', label:'Control in place', type:'review' },
  ],
  '6.7': [
    { date:'Jun 3, 2026',  label:'Contractor onboarded fully remote; company laptop with Elastic/monitoring agents provided', type:'review' },
    { date:'Oct 14, 2024', label:'Control in place', type:'review' },
  ],
  '6.8': [{ date:'Oct 14, 2024', label:'Sam\'s reporting form in place; CERT team handles coordination and action', type:'review' }],
  '8.9':  [{ date:'Jun 3, 2026',  label:'Laptops enrolled into Apple Device Management in early 2026; replaces previous manual approach', type:'review' }],
  '8.13': [{ date:'Jun 3, 2026',  label:'Rotating backups in place; data restoration request handled successfully; laptop backup tool shortlisted', type:'review' }],
  '8.14': [{ date:'Jun 3, 2026',  label:'Servers on Hetzner with standard redundancy; rotating backups in place; no availability incidents', type:'review' }],
  '8.15': [{ date:'Jun 3, 2026',  label:'Elastic agent on all laptops incl. contractor; Data Monitoring and Logging Policy communicated to all staff', type:'review' }],
  '8.16': [{ date:'Jun 3, 2026',  label:'Elastic agents on all devices; staff aware of monitoring via policy; contractor given company laptop', type:'review' }],
  '8.18': [{ date:'Jun 3, 2026',  label:'All privileged access managed via the Privileged Access Request Form ticketing process', type:'review' }],
  '8.19': [{ date:'Jun 3, 2026',  label:'Approved software list and approved AI software list in place; active monitoring being incrementally evaluated', type:'review' }],
  '8.20': [{ date:'Jun 3, 2026',  label:'Servers on Hetzner; office network in a managed building; no additional measures required', type:'review' }],
  '8.21': [{ date:'Jun 3, 2026',  label:'Services on Hetzner; office network in a managed building; no changes required', type:'review' }],
  '8.22': [{ date:'Jun 3, 2026',  label:'Server network (Hetzner) separated from office network (managed building); no additional measures', type:'review' }],
  '8.23': [{ date:'Jun 3, 2026',  label:'Microsoft Defender on all laptops; additional Microsoft-side checks enabled; no malicious site incidents', type:'review' }],
  '8.24': [{ date:'Jun 3, 2026',  label:'Cryptography policy in place and followed; no issues or changes', type:'review' }],
  '8.25': [{ date:'Jun 3, 2026',  label:'Merge requests with mandatory approvals before merging; process working well', type:'review' }],
  '8.26': [{ date:'Jun 3, 2026',  label:'Covered through MR approvals, AI code checks, vulnerability assessment, and penetration testing', type:'review' }],
  '8.27': [{ date:'Jun 3, 2026',  label:'Architecture unchanged; separated environments, controlled access, servers on Hetzner', type:'review' }],
  '8.28': [{ date:'Jun 3, 2026',  label:'AI tools integrated into code review flow alongside GitLab AI checks and vulnerability assessment', type:'review' }],
  '8.29': [{ date:'Jun 3, 2026',  label:'Penetration testing completed; AI-assisted security testing adopted — finding more bugs than before', type:'review' }],
  '8.30': [{ date:'Jun 3, 2026',  label:'Contractor onboarded per outsourcing policy; company laptop provided; all onboarding checks completed', type:'review' }],
  '8.31': [{ date:'Jun 3, 2026',  label:'Dev, test and production remain separated; no issues or incidents in the past year', type:'review' }],
  '8.32': [{ date:'Jun 3, 2026',  label:'Change management in the tracker; CR-001 to CR-005 logged (policy upgrades, AI tools, supplier onboarding)', type:'review' }],
  '8.33': [{ date:'Jun 3, 2026',  label:'Test data kept separate from production; no incidents', type:'review' }],
  '8.34': [{ date:'Jun 3, 2026',  label:'No system changes made during audit testing or penetration testing; consistently followed', type:'review' }],
};

// Demo linked items per control — placeholder links for the sample dataset
const CTRL_LINKED = {
  '8.30': [
    { icon:'file-text',    label:'Outsourcing Policy',     sub:'Tracker Doc · Acme policy library', href:'#' },
    { icon:'alert-triangle', label:'Risk — New Contractor', sub:'Tracker · Risk register',              href:'#' },
  ],
  '5.19': [
    { icon:'file-text',      label:'Outsourcing Register',        sub:'Tracker Doc · suppliers, DPAs, risk class.',     href:'#' },
    { icon:'alert-triangle', label:'Risk Analyses register',       sub:'Tracker · supplier & project risk assessments',  href:'#' },
    { icon:'alert-triangle', label:'Risk — New Contractor (no managed laptop)', sub:'Tracker Doc · third-party risk analysis', href:'#' },
  ],
  '5.20': [{ icon:'file-text', label:'Outsourcing Register', sub:'Tracker Doc · supplier agreements',          href:'#' }],
  '5.21': [
    { icon:'file-text',      label:'Outsourcing Register',           sub:'Tracker Doc · ICT supply chain',          href:'#' },
    { icon:'alert-triangle', label:'CR-005 — VendorOne onboarding', sub:'Tracker · supply-chain risk + DPA gap',   href:'#' },
  ],
  '5.22': [{ icon:'file-text', label:'Outsourcing Register', sub:'Tracker Doc · supplier monitoring',          href:'#' }],
  '5.23': [
    { icon:'file-text',      label:'Outsourcing Register',    sub:'Tracker Doc · cloud service providers',  href:'#' },
    { icon:'file-text',      label:'AI Usage Policy v1.0',    sub:'Tracker Doc · Policy 28',                href:'#' },
    { icon:'alert-triangle', label:'CR-004 — Claude AI (Sales & Marketing)', sub:'Tracker · cloud/AI service risk assessment', href:'#' },
  ],
  '5.29': [{ icon:'file-text', label:'Business Continuity Plan v2.0', sub:'Tracker · ISO Mandatory Documents', href:'#' }],
  '5.30': [{ icon:'file-text', label:'Business Continuity Plan v2.0', sub:'Tracker · ICT readiness for BC',    href:'#' }],
  '8.14': [{ icon:'file-text', label:'Business Continuity Plan v2.0', sub:'Tracker · redundancy of facilities', href:'#' }],
  '5.31': [
    { icon:'file-text', label:'Customer onboarding material', sub:'Document portal · ISMS site',         href:'#' },
    { icon:'folder',    label:'HR document-control space',  sub:'Tracker · HR Documents folder',     href:'#' },
  ],
  '5.32': [
    { icon:'alert-triangle', label:'Trademark renewal — IP rights', sub:'Tracker · ISMS-901', href:'#' },
    { icon:'file-text',      label:'IP agent renewal reminder', sub:'Local file · opens in browser', href:'#' },
  ],
  '5.34': [{ icon:'shield', label:'Data-subject request — INCIDENT-214', sub:'Tracker · GDPR Art.15 access request (DPO-handled)', href:'#' }],
  '5.35': [
    { icon:'file-text', label:'Internal Audit Report',     sub:'Document portal · ISMS site',  href:'#' },
    { icon:'shield',    label:'Penetration Testing Report', sub:'Document portal · ISMS site',  href:'#' },
  ],
  '5.36': [{ icon:'shield-check', label:'All controls — Annex A register', sub:'Tracker · Controls folder (93 controls)', href:'#' }],
};

// Static section-labelled links to the Employee Handbook and the Operating
// Procedures Register, merged into CTRL_LINKED so they render in the drawer and
// the audit drill-down. (Demo data — the links point at placeholder anchors and
// name the relevant section in the label.)
const HANDBOOK_URL = '#';
const OPSPROC_URL  = '#';
const CTRL_HANDBOOK = {
  '5.2':'Managing Project Risks', '5.3':'Access Rights', '5.5':'Emergency Call Tree', '5.8':'Managing Project Risks',
  '5.9':'Asset Management', '5.10':'Device Usage Rules', '5.11':'Asset Management',
  '5.12':'Document Classification', '5.13':'Document Classification', '5.14':'Everyday Security',
  '5.15':'Access Rights', '5.16':'Access Rights', '5.17':'Passwords', '5.18':'Access Rights',
  '5.19':'Working with Vendors', '5.20':'Working with Vendors', '5.21':'Approved Software & Suppliers', '5.22':'Onboarding / Offboarding Services', '5.23':'Cloud Policy',
  '5.24':'Logging, Monitoring & Incident Response', '5.25':'Logging, Monitoring & Incident Response',
  '5.26':'Logging, Monitoring & Incident Response', '5.27':'Emergency Plan', '5.28':'Black Swan Events',
  '5.29':'Emergency Plan', '5.30':'Backups', '5.33':'Backups', '5.34':'Document Classification',
  '6.5':'Onboarding / Offboarding Services', '6.7':'Remote Working Guidelines', '6.8':'Logging, Monitoring & Incident Response',
  // A.7.x Employee Handbook references moved to the common block on the audit agenda (audits.jsx).
  '8.1':'Device Security', '8.2':'Access Rights', '8.3':'Access Rights', '8.4':'Secure Coding', '8.5':'Passwords',
  '8.7':'Device Security', '8.8':'Vulnerability / Patch Management', '8.10':'Data Protection — Secure Deletion',
  '8.12':'Document Classification', '8.13':'Backups',
  '8.15':'Logging, Monitoring & Incident Response', '8.16':'Logging, Monitoring & Incident Response', '8.18':'Access Rights',
  '8.19':'Approved Software & Suppliers', '8.20':'Remote Working Guidelines (home network)', '8.21':'Cloud Policy',
  '8.24':'Cryptography', '8.25':'Secure Coding', '8.26':'Secure Coding', '8.28':'Secure Coding', '8.29':'Secure Coding', '8.32':'Change Management',
};
const CTRL_OPSPROC = {
  '5.1':'Security & Compliance', '5.2':'Security & Compliance', '5.3':'Security & Compliance', '5.4':'People & HR',
  '5.5':'Incident & Risk Management', '5.7':'Incident & Risk Management', '5.8':'Change Management', '5.9':'IT & Infrastructure',
  '5.10':'Security & Compliance', '5.11':'People & HR', '5.12':'Data Protection', '5.13':'Data Protection', '5.14':'Data Protection',
  '5.15':'IT & Infrastructure', '5.16':'IT & Infrastructure', '5.17':'Security & Compliance', '5.18':'IT & Infrastructure',
  '5.19':'Supplier & Vendor', '5.20':'Supplier & Vendor', '5.21':'Supplier & Vendor', '5.22':'Supplier & Vendor', '5.23':'IT & Infrastructure',
  '5.24':'Incident & Risk Management', '5.25':'Incident & Risk Management', '5.26':'Incident & Risk Management', '5.27':'Incident & Risk Management', '5.28':'Incident & Risk Management',
  '5.29':'Business Continuity', '5.30':'Business Continuity', '5.31':'Security & Compliance', '5.33':'Data Protection', '5.34':'Data Protection',
  '5.35':'Security & Compliance', '5.36':'Security & Compliance', '5.37':'Change Management',
  '6.1':'People & HR', '6.2':'People & HR', '6.3':'Security & Compliance', '6.4':'People & HR', '6.5':'People & HR', '6.6':'People & HR',
  '6.7':'IT & Infrastructure', '6.8':'Incident & Risk Management',
  // A.7.x Operating Procedures references moved to the common block on the audit agenda (audits.jsx).
  '8.1':'IT & Infrastructure', '8.2':'Security & Compliance', '8.3':'Security & Compliance', '8.4':'Change Management', '8.5':'Security & Compliance',
  '8.6':'IT & Infrastructure', '8.7':'IT & Infrastructure', '8.8':'IT & Infrastructure', '8.9':'Change Management', '8.10':'Data Protection',
  '8.12':'Data Protection', '8.13':'Business Continuity', '8.14':'Business Continuity', '8.15':'Incident & Risk Management', '8.16':'Incident & Risk Management',
  '8.18':'IT & Infrastructure', '8.19':'Change Management', '8.20':'IT & Infrastructure', '8.21':'IT & Infrastructure',
  '8.24':'Data Protection', '8.25':'Change Management', '8.26':'Change Management', '8.28':'Change Management', '8.29':'Change Management', '8.30':'Supplier & Vendor', '8.32':'Change Management',
};
Object.keys(CTRL_HANDBOOK).forEach(id => {
  (CTRL_LINKED[id] = CTRL_LINKED[id] || []).push({ icon:'book-open', label:'Employee Handbook → ' + CTRL_HANDBOOK[id], sub:'Tracker · Employee Handbook', href: HANDBOOK_URL });
});
Object.keys(CTRL_OPSPROC).forEach(id => {
  (CTRL_LINKED[id] = CTRL_LINKED[id] || []).push({ icon:'list-checks', label:'Operating Procedures → ' + CTRL_OPSPROC[id], sub:'Tracker · 5.37 Procedures Register', href: OPSPROC_URL });
});

// Evidence pointers per control — where the auditor evidence lives (demo data).
// Built for the 16–17 Jun 2026 CertCo re-cert agenda controls, then extended with
// Employee Handbook v1.1 + topic-policy references so the canonical
// policy / register / operational source is one click away.
const CTRL_EVIDENCE = {
  // — Day 1 PM: Cryptography & key management —
  '8.24': [
    'Policy 18 — Cryptography, Key Control & Encryption (v1.0).',
    'TLS 1.2+ enforced on all services; FileVault full-disk encryption on all Macs, enforced via Apple Device Management.',
    'Key management roles and rotation defined in Policy 18; no plaintext secrets in GitLab (container registry + protected variables).',
  ],
  // — Day 1 PM: Physical & environmental security walkthrough (A.7.x) —
  // Shared baseline for the whole A.7.x area lives on the audit agenda block (audits.jsx, common[]).
  // Per-control entries below carry only the bit specific to that control (no Policy 07/building-mgmt repetition).
  '7.1':  ['Single secured perimeter on the Acme floor; access via building badge + manned reception. Zone overlay shown on the perimeter diagram (common block above).'],
  '7.2':  ['Visitor handling at building reception; Acme floor access restricted to staff badges only — no visitors past the floor entry without escort.'],
  '7.3':  ['Open-plan Acme floor — no separately-secured rooms needed (all servers off-site). Lockable storage available for sensitive paper records.'],
  '7.4':  ['Building-managed CCTV + intrusion monitoring on common areas, lifts and the floor entry (shared building service).'],
  '7.5':  ['Fire/flood/power and HVAC handled by building management; no on-prem datacentre or comms room to protect. Sprinklers + smoke detection covered by building.'],
  '7.6':  ['No dedicated secure work areas beyond the office. Remote work governed by Policy 06 — Teleworking.'],
  '7.7':  ['Screen auto-lock enforced on all Macs via MDM (5 min idle). Clean-desk and clear-screen expectations in Policy 19 — Acceptable Use and the Employee Handbook.'],
  '7.8':  ['Equipment placement on the open floor only — no server racks on premises. All laptops MDM-enrolled; no unattended desktops.'],
  '7.9':  ['Off-site asset protection extended to remote contractor — managed laptop with FileVault + Elastic agent; Policy 06 + Policy 19.'],
  '7.10': ['No removable-media workflow. Data lives on encrypted laptops (FileVault) and managed cloud (document portal/Hetzner). Secure handling per Policy 16 — Data Classification & Handling.'],
  '7.11': ['Power, network and HVAC provided and maintained by the building (managed office building). UPS / standby power is building-managed.'],
  '7.12': ['Structured cabling is within the managed building; no Acme-owned cabling or patch panels to secure.'],
  '7.13': ['Endpoint maintenance via AppleCare / MDM (firmware updates, hardware swap-out). Server hardware maintenance by Hetzner (off-site, ISO 27001 certified).'],
  '7.14': ['Device wipe on offboarding via MDM (Apple Device Management); last recorded device return Dec 18, 2025 (leaver offboarding). Tracked in the asset/offboarding flow. Secure-erasure standard per Policy 16 — Data Classification & Handling.'],
  // — Day 1 PM: Communication & network security —
  '5.14': ['Policy 25 — Information Transfer (v1.0). Transfer security requirements also summarised in the Employee Handbook.'],
  '6.6':  ['NDA / confidentiality templates managed by the CISO; signed for staff and external parties. Mutual NDAs in supplier onboarding (Outsourcing Register).'],
  '8.20': ['Policy 11 — Network Security. Server network (Hetzner) is separated from the office network (managed building network).'],
  '8.21': ['Policy 11 — Network Security. Services hosted on Hetzner; office connectivity provided by the managed building.'],
  '8.22': ['Policy 11 — Network Security. Segregation: production (Hetzner) is isolated from the office/corporate network — no flat network.'],
  '8.23': ['Web filtering via Microsoft Defender on all laptops; additional Microsoft-side protections enabled. No malicious-site incidents recorded.'],
  // — Day 1 PM: Supplier management —
  '5.19': [
    'Policy 22 — Third-Party Supplier Security + Policy 27 — Outsourcing. Outsourcing Register holds suppliers, DPAs and risk classification. Latest due diligence: VendorOne.',
    'Per-supplier / third-party risk assessments documented for higher-risk engagements: remote contractor without a managed laptop (risk analysis), Claude AI (Anthropic) for Sales & Marketing (CR-004), and VendorOne B2B outreach (CR-005). Held in the Risk Analyses register.',
  ],
  '5.20': ['Supplier agreements & security clauses tracked in the Outsourcing Register; DPAs recorded per supplier (VendorOne DPA tracked under CR-005).'],
  '5.21': [
    'ICT supply-chain risk handled via supplier due diligence in the Outsourcing Register; IT-outsourcing onboarding under evaluation.',
    'ICT/SaaS supply-chain risk assessments on record: Claude AI (Anthropic) usage in the dev/sales chain (CR-004) and VendorOne outreach SaaS (CR-005, DPA gap tracked).',
  ],
  '5.22': ['Supplier monitoring/review and change management captured in the Outsourcing Register and Change Management Register (CR-xxx).'],
  '5.23': [
    'Policy 21 — Cloud Policy (v2.0). No cloud used for client services; internal cloud tools (document portal, AI coding, Hetzner) governed by internal policies. Providers listed in the Outsourcing Register.',
    'Cloud/AI-service risk assessment: Claude AI (Anthropic) for Sales & Marketing assessed and time-boxed under CR-004 (GDPR/EU AI Act reviewed).',
  ],
  // — Day 2: Acquisition, development & maintenance —
  '8.25': ['Policy 12 — Secure Software Development. GitLab merge requests with mandatory approvals before merge.'],
  '8.26': ['Application security via MR approvals, AI-assisted code checks, vulnerability assessment and penetration testing. Policy 12.'],
  '8.27': ['Secure architecture: separated environments, controlled access, all servers on Hetzner. Architecture unchanged over the past year. Policy 12.'],
  '8.28': ['Secure coding: AI tools integrated into the code-review flow alongside GitLab AI checks. Governed by Policy 12 + Policy 28 — AI Usage.'],
  '8.29': ['Security testing in dev & acceptance: penetration testing completed; AI-assisted security testing adopted (finding more issues than before). Policy 12.', 'Penetration test report held in the audit evidence pack.'],
  '8.30': ['Outsourced development governed by Policy 27 — Outsourcing. Remote contractor onboarded per policy with company laptop + monitoring agents; risk analysis filed.'],
  '8.31': ['Dev, test and production environments remain separated (Hetzner); no issues/incidents in the past year. Policy 12.'],
  '8.33': ['Test data kept separate from production; no incidents. Policy 12 — Secure Software Development.'],
  // — Day 2: Business continuity —
  '5.29': [
    'Governed by Policy 04 — Business Continuity & DRP (v1.1, approved Jordan) and the Business Continuity Plan v2.0 (27.01.2026).',
    'The BCP defines how information security is kept up during a disruption: any emergency affecting information security is reported to CERT and the ISO (Step 3), and to the DPO if personal data is involved (Step 4); incidents during disruption feed the Management Review.',
    'Response framework preserves confidentiality/integrity while recovering: Phase 1 Inform & Protect (shut down harmful systems), Phase 2 Limit (isolate affected systems, activate replacement infrastructure), Phase 3 Remedy & Restore — with forensic evidence collected first (§3.1).',
    'Roles are defined for disruption: Crisis Team, Board/CEO, ISO, CERT, DPO, IT.',
  ],
  '5.30': [
    'PLANNED & IMPLEMENTED: production servers hosted off-site at Hetzner (continuous power, independent of the office), with standard redundancy + rotating backups and DDoS protection. BCP v2.0 documents emergency scenarios with restore times (e.g. office power outage ~30 min — servers unaffected) and recovery procedures.',
    'MAINTAINED: Policy 04 requires at-least-annual review; BCP v2.0 last updated 27.01.2026; ad-hoc data-restore requests have succeeded.',
    'GAP — why this is at risk: A.5.30 also requires ICT readiness to be TESTED. Policy 04 mandates an annual BC/DR test and a call-tree exercise (the BCP Planner is to coordinate and report results), but no BC/DR test or call-tree exercise is documented yet, and formal RTO/RPO per critical system (from a BIA) is not fully evidenced. Action: run and record a BC/DR test (backup-restore + call-tree) and document RTO/RPO. Owner: Casey (BC Planner).',
  ],
  '8.14': [
    'Redundancy sufficient for availability needs: production hosted on Hetzner with standard redundancy + rotating backups and DDoS protection; because servers are off-site, an office power outage does not stop them (BCP v2.0 power-outage scenario).',
    'Availability track record: software availability ~100% over the review period (only ~4h planned maintenance) with no availability incidents (Management Review 2026).',
    'Backup arrangements (Policy 09 — Backup + Policy 04): scheduled on-/off-site backups, periodically tested/refreshed; a data-restore request was handled successfully (Jun 2026 review).',
  ],
  // — Day 2: Compliance —
  '5.31': [
    'Legal/regulatory/contractual requirements monitored as a team; latest tracked item: Directive (EU) 2023/970 (Jan 2026). DPO (Dana) advises on data-protection obligations.',
    'Contractual AI-training requirement handled in customer onboarding: if a client declines AI-literacy training, the sales team records the opt-out via a tickbox in the onboarding material (document portal).',
    'HR-side legal/contractual documents (employment contracts, NDAs, disciplinary procedures) held under document control in the HR Documents space.',
  ],
  '5.32': [
    'IP rights: registered trademark for the core product (Benelux, holder Acme S.A.). IP agent second renewal reminder received; renewal was due 02.03.2026.',
    'Decision (Apr 2026): extend the registration and revisit protection scope after the June audit. OPEN: confirm with the IP agent the renewal went through, and assign a brand-protection owner — control remains at risk.',
  ],
  '5.33': [
    'Policy 26 — Records & Information Management. Retention and protection of records defined; records held in the document portal/tracker with access control.',
    'Storage of records: critical hard-copy records kept in a locked safe; customer documents stored in an access-controlled (secure) document portal; logs retained via Elastic backups; server/data backups held on Hetzner.',
  ],
  '5.34': [
    'Data protection/PII overseen by external DPO Dana; GDPR alignment, DPAs per supplier (Outsourcing Register). Policy 16 — Data Classification & Handling.',
    'Data-subject rights (GDPR access/erasure) handled via the incident ticketing system with the DPO. Recent example: INCIDENT-214 (12.06.2026) — Art. 15 access request from a former service provider after a marketing email; routed CSO → DPO → CISO, response in preparation.',
  ],
  '5.35': ['Independent review: CertCo re-certification audit (16–17 Jun 2026), internal audit by J. Miller (external internal-auditor), and an external penetration test. Internal Audit Report and Penetration Testing Report linked (document portal).'],
  '5.36': [
    'Compliance evidenced via the Policy Log and the full Annex A control register (all 93 controls tracked in the tracker).',
    'Security-awareness and compliance training delivered and tracked via Moodle (AI Policy training; completion gradebook).',
    'Incident management gives real-time evidence if a non-compliance leads to an actual issue — events are logged, assessed and tracked in the tracker.',
    'Internal audit independently verifies compliance with policies, rules and standards.',
    'Monthly compliance / data-protection meeting with external DPO Dana.',
  ],
  '8.8':  ['Policy 15 — Technical Vulnerability Management. Vulnerability assessment + penetration testing in the dev pipeline; patching per Policy 14. OFI-007 (attack-tree review) open.'],

  // — Evidenced by the Employee Handbook v1.1 (17 Feb 2026, Internal) + topic policy —
  '5.9':  ['Asset inventory maintained by IT (Policy 17 — Asset Management). Employee Handbook §Asset Management: laptop assigned per person, no lending, return on leave.'],
  '5.10': ['Policy 19 — Acceptable Use. Employee Handbook §Device Usage Rules + §Approved Software & Suppliers + §Company email guidelines (@acme.com, Keeper for credentials, no personal-cloud for work data).'],
  '5.11': ['Employee Handbook §Asset Management: devices returned on leave/replacement and securely wiped by IT. Last recorded return Dec 18, 2025 (leaver offboarding).'],
  '5.12': ['Policy 16 — Data Classification & Handling (v1.0): 3 levels — Public / Internal / Confidential. Employee Handbook §Document Classification + §Everyday Security reinforce the scheme.'],
  '5.13': ['Labelling per Employee Handbook §Document Classification: Word footer, Excel intro cell, "[Confidential]" in email subject; tracker Internal-by-default and Confidential forbidden.'],
  '5.15': ['Policy 10 — Access & Password Control. Employee Handbook §Access Rights: least privilege, IT-provisioned by role, no shared accounts.'],
  '5.16': ['Identity lifecycle managed by IT (Policy 10). Employee Handbook §Access Rights: no shared accounts; access via manager → IT.'],
  '5.17': ['Employee Handbook §Passwords: min 12 chars, no reuse/sharing, Keeper for generation/storage, MFA mandatory where supported. Policy 10 — Access & Password Control.'],
  '5.18': ['Policy 10 — Access & Password Control. Employee Handbook §Access Rights (least privilege, joiner/leaver via IT). Access re-certification workflow being set up (OFI-004); last review at leaver offboarding Dec 2025.'],
  '5.24': ['Policy 05 — Security Incident Response. Employee Handbook §Logging, Monitoring & Incident Response defines event-vs-incident and reporting. CERT roles defined; Security Incident Form in the tracker.'],
  '5.25': ['Formal severity assessment (Urgent/High/Normal/Low) per Policy 05. Employee Handbook §Incident Response: don\'t self-fix (preserve evidence), report via the Security Incident Form.'],
  '5.26': ['Policy 05 — Security Incident Response defines the response procedure; Employee Handbook §Incident Response + Emergency Call Tree. OPEN: response SLA timeliness ~33% (KPI-2), 7-incident backlog (ISMS-1204).'],
  '5.27': ['Lessons-learned is Step 7 of incident management; action items tracked as linked tracker tasks. Policy 05; Employee Handbook §Incident Response (no-blame culture).'],
  '6.7':  ['Policy 06 — Teleworking. Employee Handbook §Remote Working Guidelines: no home printing/shredding, router firmware every 3 months, secure home workspace, approved co-working space authorised, Mac security checklist.'],
  '6.8':  ['Employee Handbook §Logging, Monitoring & Incident Response: report via the Security Incident Form (tracker), urgent → CISO phone; no-blame reporting culture. Owner Alex + Sam.'],
  '8.1':  ['Employee Handbook §Device Security + §Device Usage Rules: no personal laptops for work, company Macs only, FileVault, anti-virus/Xprotect enabled, macOS updates within 3 days. Apple Device Management enrolled.'],
  '8.3':  ['Information access restriction per Policy 10 + Employee Handbook §Access Rights (least privilege, lock screen when away, no shared workstations). Owner Sam.'],
  '8.5':  ['Secure authentication per Employee Handbook §Passwords: MFA mandatory where supported (authenticator preferred), Keeper-managed credentials. Policy 10.'],
  '8.7':  ['Anti-malware on all devices: Microsoft Defender + macOS XProtect (must stay enabled), centrally managed. Employee Handbook §Device Security + §Vulnerability/Patch Management.'],
  '8.12': ['Data Leakage Prevention per Employee Handbook §Document Classification: no sensitive/Confidential data in the tracker; document portal with named-access only ("never anyone with the link"); explicitly maps to ISO 27002 A.8.12.'],
  '8.13': ['Policy 09 — Backup. Employee Handbook §Backups: M365/OneDrive/document portal auto-backed up (93-day recycle bin), server/infra by IT; save work to the document portal not local disk. OPEN: OFI-008 immutable/air-gap tier under evaluation.'],
  '8.15': ['Logging via Elastic agents on laptops + servers (Data Monitoring & Logging Policy). Employee Handbook §Vulnerability/Patch Management: endpoint agents centrally managed, do not disable. Coverage now ~92% (11/12).'],
  '8.16': ['Monitoring via Elastic agents; staff aware per policy. Employee Handbook §Logging & Monitoring. Endpoint coverage now ~92% (11/12 laptops) — only one device pending (KPI-3 / ISMS-1203), up from ~50% on 19 May.'],
  '8.19': ['Approved-software list + self-sanitary check before install (Employee Handbook §Approved Software & Suppliers). New SaaS → online doc check; service-via-people → due-diligence form; DPO + IT-Security notified. Policy 19.'],
  '8.32': ['Policy 02 — Change Management (v1.0). Employee Handbook §Change Management (minor vs major, test/communicate/review); Change Management Form in the tracker (CR-NNN register).'],
};

// Brief paraphrased ISO/IEC 27002:2022 control intent (Annex A). Used for the
// guidance toggle on the Controls and Audits pages.
const ISO_CONTROL_HELP = {
  '5.14':'Information-transfer rules, procedures or agreements should cover all transfer types — internal and with external parties.',
  '5.19':'Define and implement processes to manage the information security risks of using suppliers’ products or services.',
  '5.20':'Establish and agree the relevant information security requirements with each supplier, based on the relationship type.',
  '5.21':'Define and implement processes to manage information security risks across the ICT products/services supply chain.',
  '5.22':'Regularly monitor, review, evaluate and manage change in supplier security practices and service delivery.',
  '5.23':'Establish processes for acquisition, use, management and exit of cloud services per your security requirements.',
  '5.29':'Plan how to maintain information security at an appropriate level during disruption.',
  '5.30':'Plan, implement, maintain and test ICT readiness based on business-continuity objectives and ICT continuity requirements.',
  '5.31':'Identify, document and keep current the legal, statutory, regulatory and contractual requirements relevant to information security.',
  '5.32':'Implement procedures to protect intellectual property rights.',
  '5.33':'Protect records from loss, destruction, falsification, unauthorised access and unauthorised release.',
  '5.34':'Identify and meet requirements for privacy and protection of PII per applicable laws, regulations and contracts.',
  '5.35':'Independently review the organisation’s approach to managing information security at planned intervals or on significant change.',
  '5.36':'Regularly review that information processing complies with the security policies, rules and standards.',
  '6.6':'Identify, document and regularly review confidentiality / non-disclosure agreements reflecting the organisation’s needs.',
  '7.1':'Define and use security perimeters to protect areas that hold information and associated assets.',
  '7.2':'Protect secure areas with appropriate entry controls and access points.',
  '7.3':'Design and implement physical security for offices, rooms and facilities.',
  '7.4':'Continuously monitor premises for unauthorised physical access.',
  '7.5':'Design and implement protection against physical and environmental threats (e.g. natural disasters).',
  '7.6':'Design and implement security measures for working in secure areas.',
  '7.7':'Define and enforce clear-desk rules for papers/removable media and clear-screen rules for facilities.',
  '7.8':'Site equipment securely and protect it.',
  '7.9':'Protect assets used off-premises.',
  '7.10':'Manage storage media across their lifecycle (acquisition, use, transport, disposal) per the classification scheme.',
  '7.11':'Protect information processing facilities from power failures and other supporting-utility disruptions.',
  '7.12':'Protect power, data and supporting cabling from interception, interference or damage.',
  '7.13':'Maintain equipment correctly to ensure availability, integrity and confidentiality of information.',
  '7.14':'Verify equipment with storage media has sensitive data / licensed software removed or securely overwritten before disposal or re-use.',
  '8.8':'Obtain information on technical vulnerabilities, evaluate exposure, and take appropriate measures.',
  '8.14':'Implement information processing facilities with redundancy sufficient to meet availability requirements.',
  '8.20':'Secure, manage and control networks and network devices to protect information in systems and applications.',
  '8.21':'Identify, implement and monitor the security mechanisms, service levels and requirements of network services.',
  '8.22':'Segregate groups of information services, users and information systems within the networks.',
  '8.23':'Manage access to external websites to reduce exposure to malicious content.',
  '8.24':'Define and implement rules for the effective use of cryptography, including cryptographic key management.',
  '8.25':'Establish and apply rules for the secure development of software and systems.',
  '8.26':'Identify, specify and approve information security requirements when developing or acquiring applications.',
  '8.27':'Establish, document, maintain and apply secure system-engineering principles to development activities.',
  '8.28':'Apply secure coding principles to software development.',
  '8.29':'Define and implement security testing processes within the development lifecycle.',
  '8.30':'Direct, monitor and review the activities of outsourced system development.',
  '8.31':'Separate and secure development, test and production environments.',
  '8.33':'Appropriately select, protect and manage test information.',
};

// Policy master data — name, doc code, version, release date, placeholder links (demo data).
const _POL_FOLDER = '#';
const _polPdf = (f) => '#';
const POLICIES = {
  '00': { name:'ISMS Policy — Common Definitions & Reference', code:'A_Pol_0_CDR_1_v1.0',   ver:'v1.0', date:'19.03.2026', pdf:_polPdf('00-isms-policy-common-definitions-reference-v1.0.pdf'), cu:'#' },
  '01': { name:'Creating, Updating & Reviewing Policies',      code:'A_Pol_1_CURPP_1_v1.0',  ver:'v1.0', date:'09.06.2026', pdf:_polPdf('01-creating-updating-reviewing-policies-v1.0.pdf'), cu:'#' },
  '02': { name:'Change Management Policy',                     code:'A_Pol_2_CM_1_v1.0',     ver:'v1.0', date:'09.06.2026', pdf:_polPdf('02-change-management-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '03': { name:'Information Security Policy',                  code:'A_Pol_3_IS_1_v1.0',     ver:'v1.0', date:'09.06.2026', pdf:_polPdf('03-information-security-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '04': { name:'Business Continuity Policy & DRP',             code:'A_Pol_4_BCPDRP_1_v1.1', ver:'v1.1', date:'10.06.2026', pdf:_polPdf('04-business-continuity-policy-drp-v1.0.pdf'), cu:'#' },
  '05': { name:'Security Incident Response Policy',            code:'A_Pol_5_SIR_1_v1.0',    ver:'v1.0', date:'09.06.2026', pdf:_polPdf('05-security-incident-response-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '06': { name:'Teleworking (Remote Working) Policy',         code:'A_Pol_6_TRW_1_v1.0',    ver:'v1.0', date:'19.03.2026', pdf:_polPdf('06-teleworking-remote-working-policy-v1.0.pdf'), cu:'#' },
  '07': { name:'Physical Security Monitoring Policy',          code:'A_Pol_7_PSM_1_v1.0',    ver:'v1.0', date:'09.06.2026', pdf:_polPdf('07-physical-security-monitoring-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '08': { name:'Environmental Security Monitoring Policy',     code:'A_Pol_8_ESM_1_v1.0',    ver:'v1.0', date:'09.06.2026', pdf:_polPdf('08-environmental-security-monitoring-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '09': { name:'Backup Policy',                               code:'A_Pol_9_B_1_v1.0',      ver:'v1.0', date:'09.06.2026', pdf:_polPdf('09-backup-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '10': { name:'Access & Password Control Policy',            code:'A_Pol_10_APC_1_v1.0',   ver:'v1.0', date:'09.06.2026', pdf:_polPdf('10-access-password-control-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '11': { name:'Network Security Policy',                     code:'A_Pol_11_NS_1_v1.0',    ver:'v1.0', date:'09.06.2026', pdf:_polPdf('11-network-security-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '12': { name:'Secure Software Development Policy',          code:'A_Pol_12_SSD_1_v1.0',   ver:'v1.0', date:'09.06.2026', pdf:_polPdf('12-secure-software-development-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '13': { name:'Logging and Monitoring Policy',              code:'A_Pol_13_LM_1_v1.0',    ver:'v1.0', date:'09.06.2026', pdf:_polPdf('13-logging-monitoring-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '14': { name:'Patch Management Policy',                    code:'A_Pol_14_PM_1_v1.0',    ver:'v1.0', date:'09.06.2026', pdf:_polPdf('14-patch-management-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '15': { name:'Technical Vulnerability Management Policy',  code:'A_Pol_15_TVM_1_v1.0',   ver:'v1.0', date:'09.06.2026', pdf:_polPdf('15-technical-vulnerability-management-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '16': { name:'Data Classification & Handling Policy',     code:'A_Pol_16_DCH_1_v1.0',   ver:'v1.0', date:'09.06.2026', pdf:_polPdf('16-data-classification-handling-policy-v1.0.pdf'), cu:'#' },
  '17': { name:'Asset Management Policy',                    code:'A_Pol_17_AM_1_v1.0',    ver:'v1.0', date:'09.06.2026', pdf:_polPdf('17-asset-management-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '18': { name:'Cryptography, Key Control & Encryption Policy', code:'A_Pol_18_CKCEM_1_v1.0', ver:'v1.0', date:'09.06.2026', pdf:_polPdf('18-cryptography-key-control-encryption-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '19': { name:'Acceptable Use Policy',                     code:'A_Pol_19_AU_1_v1.0',    ver:'v1.0', date:'19.03.2026', pdf:_polPdf('19-acceptable-use-policy-v1.0.pdf'), cu:'#' },
  '20': { name:'Information Security Awareness & Training Policy', code:'A_Pol_20_ISAT_1_v1.0', ver:'v1.0', date:'09.06.2026', pdf:_polPdf('20-infosec-awareness-training-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '21': { name:'Cloud Policy',                              code:'A_Pol_21_C_1_v2.0',     ver:'v2.0', date:'09.06.2026', pdf:_polPdf('21-cloud-policy-v2.0.pdf'), cu:_POL_FOLDER },
  '22': { name:'Third-Party Supplier Security Policy',      code:'A_Pol_22_TPSS_1_v1.0',  ver:'v1.0', date:'09.06.2026', pdf:_polPdf('22-third-party-supplier-security-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '23': { name:'Information Security Risk Management Policy', code:'A_Pol_23_ISRM_1_v1.0', ver:'v1.0', date:'19.05.2026', pdf:_polPdf('23-information-security-risk-management-policy-v1.0.pdf'), cu:'#' },
  '24': { name:'Operating Procedures Policy',               code:'A_Pol_24_OP_1_v1.0',    ver:'v1.0', date:'09.06.2026', pdf:_polPdf('24-operating-procedures-policy-v1.0.pdf'), cu:'#' },
  '25': { name:'Information Transfer Policy',               code:'A_Pol_25_IT_1_v1.0',    ver:'v1.0', date:'09.06.2026', pdf:_polPdf('25-information-transfer-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '26': { name:'Records & Information Management Policy',   code:'A_Pol_26_RIM_1_v1.0',   ver:'v1.0', date:'09.06.2026', pdf:_polPdf('26-records-information-management-policy-v1.0.pdf'), cu:_POL_FOLDER },
  '27': { name:'Outsourcing Policy',                       code:'A_Pol_27_O_1_v1.0',     ver:'v1.0', date:'03.2026',    pdf:_polPdf('27-outsourcing-policy-v1.0.pdf'), cu:'#' },
  '28': { name:'Artificial Intelligence (AI) Usage Policy', code:'A_Pol_28_AI_1_v1.1',   ver:'v1.1', date:'19.05.2026', pdf:_polPdf('28-ai-usage-policy-v1.0.pdf'), cu:'#' },
};

// Primary topic policy per control (first evidence shown).
const CTRL_POLICY = {
  '5.1':'03','5.10':'19','5.12':'16','5.14':'25','5.15':'10','5.16':'10','5.17':'10','5.18':'10',
  '5.19':'22','5.20':'22','5.21':'22','5.22':'22','5.23':'21','5.24':'05','5.25':'05','5.26':'05','5.27':'05',
  '5.29':'04','5.30':'04','5.33':'26','5.34':'16','5.37':'24',
  '6.3':'20','6.7':'06',
  '7.1':'07','7.2':'07','7.3':'07','7.4':'07','7.5':'08','7.6':'07','7.7':'19','7.8':'17','7.9':'06','7.10':'16','7.11':'08','7.12':'08','7.13':'17','7.14':'17',
  '8.1':'19','8.2':'10','8.3':'10','8.5':'10','8.8':'15','8.13':'09','8.14':'09','8.15':'13','8.16':'13',
  '8.19':'19','8.20':'11','8.21':'11','8.22':'11','8.23':'11','8.24':'18','8.25':'12','8.26':'12','8.27':'12','8.28':'12','8.29':'12','8.30':'27','8.31':'12','8.32':'02','8.33':'12',
};

// Renders the policy as the first evidence: name + code/version/date + 2 links (tracker + local PDF).
function PolicyCardByNum({ num }) {
  const p = num && POLICIES[num];
  if (!p) return null;
  const btn = { display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:500, color:'#6B2FA0', textDecoration:'none', border:'1px solid rgba(107,47,160,0.25)', borderRadius:6, padding:'3px 8px' };
  return (
    <div style={{ border:'1px solid rgba(107,47,160,0.2)', background:'rgba(107,47,160,0.04)', borderRadius:8, padding:'9px 11px', marginBottom:10 }}>
      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
        <Icon name="file-text" size={13} color="#6B2FA0"/>
        <span style={{ fontSize:12.5, fontWeight:600, color:'#111827' }}>Policy {num} — {p.name}</span>
      </div>
      <div style={{ fontSize:10.5, color:'#6B7280', margin:'3px 0 8px', fontFamily:'ui-monospace, SFMono-Regular, monospace' }}>
        {p.code} · {p.ver} · updated {p.date}
      </div>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        <a href={p.cu} target="_blank" rel="noopener noreferrer" style={btn}><Icon name="external-link" size={11}/> Tracker</a>
        <a href={p.pdf} target="_blank" rel="noopener noreferrer" style={btn}><Icon name="file-text" size={11}/> Open PDF</a>
      </div>
    </div>
  );
}

function PolicyCard({ ctrlId }) {
  return <PolicyCardByNum num={CTRL_POLICY[ctrlId]}/>;
}

function ControlsPage({ onOpenDrawer }) {
  const [tab, setTab] = useCtrlState('all');
  const [filterStatus, setFilterStatus] = useCtrlState('all');
  const [filterOpen, setFilterOpen] = useCtrlState(false);

  const tabs = [
    { id:'all',  label:'All',          count: 93 },
    { id:'org',  label:'5.x Org',      count: 37 },
    { id:'ppl',  label:'6.x People',   count: 8 },
    { id:'phy',  label:'7.x Physical', count: 14 },
    { id:'tech', label:'8.x Tech',     count: 34 },
  ];

  const filtered = useCtrlMemo(() => {
    let list = CONTROLS;
    if (tab !== 'all') list = list.filter(c => c.group === tab);
    if (filterStatus !== 'all') list = list.filter(c => c.status === filterStatus);
    if (filterOpen) list = list.filter(c => c.status === 'red' || c.status === 'amber');
    return list;
  }, [tab, filterStatus, filterOpen]);

  return (
    <div style={{ padding: 24, maxWidth: 1280 }}>
      {/* Tabs */}
      <div style={{
        display:'flex', gap: 4, borderBottom:'1px solid #E5E7EB', marginBottom: 18,
      }}>
        {tabs.map(t => {
          const active = t.id === tab;
          return (
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{
                padding:'10px 14px', border:'none', background:'transparent',
                fontFamily:'Poppins, sans-serif', fontSize: 13, fontWeight: active?600:500,
                color: active ? '#6B2FA0' : '#6B7280',
                borderBottom: `2px solid ${active ? '#6B2FA0' : 'transparent'}`,
                marginBottom: -1, cursor:'pointer', transition:'all 120ms',
                display:'inline-flex', alignItems:'center', gap: 6,
              }}>
              {t.label}
              <span style={{
                fontSize: 10.5, color: active?'#fff':'#6B7280',
                background: active ? '#6B2FA0' : '#F3F4F6',
                padding:'1px 6px', borderRadius: 9999, fontWeight: 600,
              }}>{t.count}</span>
            </button>
          );
        })}
      </div>

      {/* Filter chips */}
      <div style={{ display:'flex', gap: 8, marginBottom: 14, flexWrap:'wrap', alignItems:'center' }}>
        <FilterChip
          icon="circle-dot" label="Status"
          value={filterStatus === 'all' ? null : STATUS_COLOR[filterStatus].label}
          onClick={() => {
            const order = ['all','ok','amber','red','na'];
            const i = order.indexOf(filterStatus);
            setFilterStatus(order[(i+1)%order.length]);
          }}
        />
        <FilterChip icon="user" label="Owner" value={null}/>
        <FilterChip icon="calendar" label="Last reviewed" value={null}/>
        <button
          onClick={()=>setFilterOpen(!filterOpen)}
          style={{
            padding:'5px 11px', border:`1px solid ${filterOpen?'#6B2FA0':'#E5E7EB'}`,
            borderRadius: 9999, fontSize: 12, fontWeight: 500,
            background: filterOpen ? 'rgba(107,47,160,0.08)' : '#fff',
            color: filterOpen ? '#6B2FA0' : '#374151',
            cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 6,
            fontFamily:'Poppins, sans-serif',
          }}>
          <Icon name="alert-triangle" size={12}/> Has open finding
        </button>
        <div style={{ marginLeft:'auto', fontSize: 12, color:'#6B7280' }}>
          Showing <strong style={{ color:'#111827' }}>{filtered.length}</strong> of {CONTROLS.length}
        </div>
      </div>

      {/* Table */}
      <Card padding={0}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'Poppins, sans-serif' }}>
          <thead>
            <tr style={{ background:'#FAFAFC', borderBottom:'1px solid #E5E7EB' }}>
              {['Control ID','Name','Owner','Status','Last reviewed','Evidence','Roadmap notes',''].map((h,i) => (
                <th key={i} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c,i) => {
              const sc = STATUS_COLOR[c.status];
              return (
                <tr key={c.id}
                  onClick={()=>onOpenDrawer(c)}
                  style={{ borderBottom:'1px solid #F3F4F6', cursor:'pointer', transition:'background 120ms' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#FAFAFC'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={tdStyle}>
                    <span style={{
                      fontFamily:'ui-monospace, monospace', fontSize: 12, fontWeight: 600,
                      color:'#6B2FA0', background:'rgba(107,47,160,0.08)',
                      padding:'2px 7px', borderRadius: 4,
                    }}>A.{c.id}</span>
                  </td>
                  <td style={{ ...tdStyle, color:'#111827', fontWeight: 500, maxWidth: 280 }}>{c.name}</td>
                  <td style={tdStyle}>
                    <div style={{ display:'flex', alignItems:'center', gap: 7 }}>
                      <Avatar name={c.owner} size={20}/>
                      <span style={{ fontSize: 12.5, color:'#374151' }}>{c.owner}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <Pill color={sc.fg} bg={sc.soft} size="xs">
                      <StatusDot status={c.status}/> {sc.label}
                    </Pill>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12.5, color:'#6B7280' }}>{c.last}</td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: 12, color:'#6B7280', display:'inline-flex', alignItems:'center', gap: 4 }}>
                      <Icon name="paperclip" size={11} color="#9CA3AF"/>
                      {c.status === 'red' ? 7 : c.status === 'amber' ? 3 : c.status === 'na' ? 0 : 4}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12, color:'#6B7280', maxWidth: 280 }}>
                    {c.status === 'red' ? 'Data deletion not automated, HIGH risk Feb 2026'
                     : c.status === 'amber' ? 'Roadmap item · review pending'
                     : c.status === 'na' ? 'Out of scope (cloud-managed)'
                     : '—'}
                  </td>
                  <td style={{ ...tdStyle, textAlign:'right' }}>
                    <Icon name="chevron-right" size={14} color="#9CA3AF"/>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

const thStyle = {
  textAlign:'left', padding:'10px 14px', fontSize: 10.5,
  fontWeight: 600, color:'#6B7280', letterSpacing:'0.05em', textTransform:'uppercase',
};

function FilterChip({ icon, label, value, onClick }) {
  const active = !!value;
  return (
    <button onClick={onClick}
      style={{
        padding:'5px 11px', border:`1px solid ${active?'#6B2FA0':'#E5E7EB'}`,
        borderRadius: 9999, fontSize: 12, fontWeight: 500,
        background: active ? 'rgba(107,47,160,0.08)' : '#fff',
        color: active ? '#6B2FA0' : '#374151',
        cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 6,
        fontFamily:'Poppins, sans-serif',
      }}>
      <Icon name={icon} size={12}/>
      {label}{value && <span>: <strong style={{ fontWeight: 600 }}>{value}</strong></span>}
      <Icon name="chevron-down" size={11}/>
    </button>
  );
}

// --- Slide-over drawer ---

function ControlDrawer({ ctrl, onClose }) {
  if (!ctrl) return null;
  const sc = STATUS_COLOR[ctrl.status];
  return (
    <>
      <div onClick={onClose} style={{
        position:'absolute', inset: 0, background:'rgba(0,0,0,0.25)',
        zIndex: 40, animation:'fade 200ms',
      }}/>
      <aside style={{
        position:'absolute', top: 0, bottom: 0, right: 0, width: 480,
        background:'#fff', borderLeft:'1px solid #E5E7EB',
        zIndex: 50, display:'flex', flexDirection:'column',
        boxShadow:'-12px 0 40px rgba(0,0,0,0.08)',
        animation:'slideIn 220ms cubic-bezier(0.4,0,0.2,1)',
      }}>
        <style>{`
          @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        `}</style>
        {/* Header */}
        <div style={{
          padding:'18px 22px 14px',
          borderBottom:'1px solid #E5E7EB',
          background:'linear-gradient(180deg, rgba(107,47,160,0.04), transparent)',
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 10 }}>
            <span style={{
              fontFamily:'ui-monospace, monospace', fontSize: 12, fontWeight: 600,
              color:'#6B2FA0', background:'rgba(107,47,160,0.1)',
              padding:'3px 9px', borderRadius: 6,
            }}>A.{ctrl.id}</span>
            <div style={{ display:'flex', gap: 4 }}>
              <button style={{ ...iconBtnLg }} title="Open in source"><Icon name="external-link" size={15} color="#6B7280"/></button>
              <button style={{ ...iconBtnLg }} onClick={onClose} title="Close"><Icon name="x" size={16} color="#6B7280"/></button>
            </div>
          </div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color:'#111827', lineHeight: 1.3 }}>
            {ctrl.name}
          </h2>
          <div style={{ display:'flex', alignItems:'center', gap: 10, marginTop: 10 }}>
            <Pill color={sc.fg} bg={sc.soft}><StatusDot status={ctrl.status}/> {sc.label}</Pill>
            <span style={{ fontSize: 12, color:'#6B7280' }}>·</span>
            <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
              <Avatar name={ctrl.owner} size={20}/>
              <span style={{ fontSize: 12, color:'#374151' }}>{ctrl.owner}</span>
            </div>
            <span style={{ fontSize: 12, color:'#6B7280' }}>·</span>
            <span style={{ fontSize: 12, color:'#6B7280' }}>reviewed {ctrl.last}</span>
          </div>
        </div>

        {/* Body */}
        <div className="scroll-y" style={{ flex: 1, overflowY:'auto', padding:'18px 22px 24px' }}>
          <DrawerSection title="Description">
            <p style={{ margin: 0, fontSize: 13, color:'#374151', lineHeight: 1.6 }}>
              {ctrl.id === '8.10'
                ? 'Information stored in information systems, devices or in any other storage media shall be deleted when no longer required.'
                : `ISO/IEC 27002:2022 control A.${ctrl.id} — ${ctrl.name}. Per-control applicability rationale and implementation detail are maintained in the Statement of Applicability — Full v1.0 (tracker).`}
            </p>
          </DrawerSection>

          <DrawerSection title="Applicability">
            <p style={{ margin: 0, fontSize: 13, color:'#374151', lineHeight: 1.6 }}>
              {ctrl.status === 'na'
                ? 'Not applicable to the Acme ISMS — excluded in the SoA with justification (A.8.17 clock synchronisation is handled by managed cloud/OS time sources).'
                : 'In scope for the Acme ISMS.'}
            </p>
          </DrawerSection>

          {(CTRL_POLICY[ctrl.id] || (CTRL_EVIDENCE[ctrl.id] && CTRL_EVIDENCE[ctrl.id].length > 0)) && (
            <DrawerSection title="Evidence pointers">
              <PolicyCard ctrlId={ctrl.id}/>
              {CTRL_EVIDENCE[ctrl.id] && CTRL_EVIDENCE[ctrl.id].length > 0 && (
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color:'#374151', lineHeight: 1.7 }}>
                  {CTRL_EVIDENCE[ctrl.id].map((e, i) => (
                    <li key={i}>
                      {typeof e === 'string' ? e : (
                        <a href={e.url} target="_blank" rel="noopener noreferrer" style={{ color:'#6B2FA0', display:'inline-flex', alignItems:'center', gap:4 }}>
                          {e.label} <Icon name="external-link" size={11}/>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </DrawerSection>
          )}

          {ctrl.id === '8.10' && (
            <DrawerSection title="Current implementation">
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color:'#374151', lineHeight: 1.7 }}>
                <li>Manual deletion process documented in <strong>Policy 26 — Data Retention</strong>.</li>
                <li>Backup retention enforced via S3 lifecycle (90-day expiry).</li>
                <li><span style={{ color:'#B91C1C', fontWeight: 500 }}>Gap:</span> no automated routine for production Postgres tables.</li>
              </ul>
            </DrawerSection>
          )}

          {CTRL_LINKED[ctrl.id] && CTRL_LINKED[ctrl.id].length > 0 && (
            <DrawerSection title="Linked items">
              <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
                {CTRL_LINKED[ctrl.id].map((lnk, i) => (
                  <LinkRow key={i} icon={lnk.icon} label={lnk.label} sub={lnk.sub} href={lnk.href}/>
                ))}
              </div>
            </DrawerSection>
          )}

          {CTRL_HISTORY[ctrl.id] && CTRL_HISTORY[ctrl.id].length > 0 && (
            <DrawerSection title="Audit history">
              <div style={{ display:'flex', flexDirection:'column', gap: 8, fontSize: 12 }}>
                {CTRL_HISTORY[ctrl.id].map((h, i) => (
                  <HistoryRow key={i} date={h.date} label={h.label} type={h.type}/>
                ))}
              </div>
            </DrawerSection>
          )}
        </div>
      </aside>
    </>
  );
}

function DrawerSection({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h3 style={{
        margin:'0 0 8px 0', fontSize: 11, fontWeight: 600, color:'#6B7280',
        letterSpacing:'0.06em', textTransform:'uppercase',
      }}>{title}</h3>
      {children}
    </div>
  );
}

function LinkRow({ icon, label, sub, href }) {
  const [h, setH] = useCtrlState(false);
  const isExternal = href && href !== '#';
  return (
    <a href={href || '#'}
      onClick={isExternal ? undefined : e=>e.preventDefault()}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:'flex', alignItems:'center', gap: 10,
        padding:'9px 11px', borderRadius: 7,
        background: h ? '#FAFAFC' : '#fff',
        border:'1px solid #E5E7EB',
        textDecoration:'none', color:'inherit',
      }}>
      <div style={{
        width: 28, height: 28, borderRadius: 6,
        background:'rgba(107,47,160,0.08)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}><Icon name={icon} size={14} color="#6B2FA0"/></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, color:'#111827', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color:'#6B7280', marginTop: 1 }}>{sub}</div>
      </div>
      <Icon name="external-link" size={12} color="#9CA3AF"/>
    </a>
  );
}

function HistoryRow({ date, label, type }) {
  const colors = {
    finding:'#EF4444', risk:'#F59E0B', review:'#10B981', owner:'#6B2FA0',
  };
  return (
    <div style={{ display:'flex', gap: 10 }}>
      <div style={{ width: 6, height: 6, borderRadius: 9999, background: colors[type], marginTop: 6, flexShrink: 0 }}/>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12.5, color:'#111827' }}>{label}</div>
        <div style={{ fontSize: 11, color:'#9CA3AF', marginTop: 1 }}>{date}</div>
      </div>
    </div>
  );
}

const iconBtnLg = {
  width: 30, height: 30, borderRadius: 7,
  border:'none', background:'transparent', cursor:'pointer',
  display:'inline-flex', alignItems:'center', justifyContent:'center',
};

Object.assign(window, { ControlsPage, ControlDrawer, PolicyCard, PolicyCardByNum });
