// Demo ISMS data for Acme (fictional B2B SaaS analytics company), ISO 27001:2022 scope.

const ANNEX_GROUPS = [
  { id: 'org',  label: 'Organisational', range: '5.1–5.37', start: 1,  end: 38,  prefix: '5.' },
  { id: 'ppl',  label: 'People',         range: '6.1–6.8',  start: 1,  end: 9,   prefix: '6.' },
  { id: 'phy',  label: 'Physical',       range: '7.1–7.14', start: 1,  end: 15,  prefix: '7.' },
  { id: 'tech', label: 'Technological',  range: '8.1–8.34', start: 1,  end: 35,  prefix: '8.' },
];

// Builds the 93 controls. Status defaults to 'ok'; overrides for the named ones.
function buildControls() {
  // Status / name overrides for controls that aren't plain 'Compliant'.
  const overrides = {
    '5.3':  { status: 'amber', name: 'Segregation of duties', owner: 'Alex', last: '2026-02-12' },
    '5.7':  { status: 'amber', name: 'Threat intelligence', owner: 'Sam', last: '2026-01-28' },
    '5.15': { status: 'amber', name: 'Access control', owner: 'Alex', last: '2026-03-04' },
    '5.20': { status: 'amber', name: 'Addressing information security in supplier agreements', owner: 'Alex', last: '2026-01-13' },
    '5.26': { status: 'amber', name: 'Response to information security incidents', owner: 'Alex', last: '2026-05-19' },
    '5.30': { status: 'amber', name: 'ICT readiness for business continuity', owner: 'Casey', last: '2026-02-22' },
    '5.32': { status: 'amber', name: 'Intellectual property rights', owner: 'Jordan', last: '2026-01-19' },
    '5.37': { status: 'ok',    name: 'Documented operating procedures', owner: 'Alex', last: '2026-06-09' },
    '8.2':  { status: 'amber', name: 'Privileged access rights', owner: 'Sam', last: '2026-05-19' },
    '8.10': { status: 'red',   name: 'Information deletion', owner: 'Sam', last: '2026-02-14' },
    '8.16': { status: 'amber', name: 'Monitoring activities', owner: 'Sam', last: '2026-06-13' },
    '8.17': { status: 'na',    name: 'Clock synchronization', owner: '—', last: '2025-11-02' },
  };
  // Demo control owners (as assigned in the task tracker) + last-review dates
  // where a review is recorded. Controls absent here show '—' rather than a guess.
  const meta = {
    // People controls — task-tracker assignees
    '6.1':{owner:'Riley'}, '6.2':{owner:'Jordan'}, '6.3':{owner:'Alex', last:'2026-06-03'},
    '6.4':{owner:'Jordan'}, '6.5':{owner:'Riley'}, '6.6':{owner:'Alex', last:'2026-01-19'},
    '6.7':{owner:'Alex', last:'2026-06-03'}, '6.8':{owner:'Alex'},
    // Physical controls — facilities (Morgan), entry (Riley)
    '7.1':{owner:'Morgan'}, '7.2':{owner:'Riley'}, '7.3':{owner:'Morgan'},
    '7.4':{owner:'Morgan'}, '7.5':{owner:'Morgan'}, '7.6':{owner:'Morgan'},
    '7.7':{owner:'Morgan'}, '7.8':{owner:'Morgan'}, '7.9':{owner:'Morgan'},
    '7.10':{owner:'Morgan'}, '7.11':{owner:'Morgan', last:'2026-02-03'},
    '7.12':{owner:'Morgan', last:'2026-02-03'}, '7.13':{owner:'Morgan'}, '7.14':{owner:'Morgan'},
    // Technological — task-tracker assignees + 3 Jun 2026 review sweep
    '8.3':{owner:'Sam'}, '8.4':{owner:'Sam'}, '8.5':{owner:'Sam'}, '8.6':{owner:'Sam'},
    '8.8':{owner:'Sam', last:'2026-06-03'}, '8.9':{owner:'Sam', last:'2026-06-03'},
    '8.11':{owner:'Morgan'}, '8.13':{owner:'Sam', last:'2026-06-03'}, '8.14':{owner:'Sam', last:'2026-06-03'},
    '8.15':{owner:'Sam', last:'2026-06-03'}, '8.18':{owner:'Sam', last:'2026-06-03'},
    '8.19':{owner:'Sam', last:'2026-06-03'}, '8.20':{owner:'Sam', last:'2026-06-03'},
    '8.21':{owner:'Sam', last:'2026-06-03'}, '8.22':{owner:'Sam', last:'2026-06-03'},
    '8.23':{owner:'Sam', last:'2026-06-03'}, '8.24':{owner:'Sam', last:'2026-06-03'},
    '8.25':{owner:'Sam', last:'2026-06-03'}, '8.26':{owner:'Sam', last:'2026-06-03'},
    '8.27':{owner:'Sam', last:'2026-06-03'}, '8.28':{owner:'Sam', last:'2026-06-03'},
    '8.29':{owner:'Sam', last:'2026-06-03'}, '8.30':{owner:'Sam', last:'2026-06-03'},
    '8.31':{owner:'Sam', last:'2026-06-03'}, '8.32':{owner:'Sam', last:'2026-06-03'},
    '8.33':{owner:'Sam', last:'2026-06-03'}, '8.34':{owner:'Sam', last:'2026-06-03'},
    // Tech / incident controls with unambiguous domain ownership (CTO / CISO)
    '8.1':{owner:'Sam'}, '8.7':{owner:'Sam'}, '8.12':{owner:'Sam'},
    '5.16':{owner:'Sam'}, '5.17':{owner:'Sam'},
    '5.4':{owner:'Alex'}, '5.8':{owner:'Alex'}, '5.13':{owner:'Alex'},
    '5.24':{owner:'Alex'}, '5.25':{owner:'Alex'}, '5.27':{owner:'Alex'},
    // Organisational — agenda-focus + controls with a Jan 2026 review note
    '5.1':{owner:'Alex', last:'2026-06-09'}, '5.2':{owner:'Alex', last:'2026-06-12'},
    '5.5':{owner:'Alex', last:'2026-01-08'}, '5.6':{owner:'Alex', last:'2026-01-08'},
    '5.9':{owner:'Sam', last:'2026-01-14'}, '5.10':{owner:'Alex', last:'2026-01-09'},
    '5.11':{owner:'Riley', last:'2026-01-09'}, '5.12':{owner:'Alex', last:'2026-06-09'},
    '5.14':{owner:'Alex', last:'2026-01-12'}, '5.18':{owner:'Sam', last:'2026-01-20'},
    '5.19':{owner:'Alex', last:'2026-01-13'},
    '5.21':{owner:'Alex', last:'2026-01-16'}, '5.22':{owner:'Alex', last:'2026-01-16'},
    '5.23':{owner:'Alex', last:'2026-01-09'}, '5.28':{owner:'Alex', last:'2026-01-12'},
    '5.29':{owner:'Casey'}, '5.31':{owner:'Alex', last:'2026-01-13'},
    '5.33':{owner:'Alex'}, '5.34':{owner:'Alex'}, '5.35':{owner:'Alex', last:'2026-01-16'},
    '5.36':{owner:'Alex', last:'2026-01-16'},
  };
  const friendly = {
    '5.1':'Policies for information security','5.2':'Information security roles and responsibilities',
    '5.4':'Management responsibilities','5.5':'Contact with authorities','5.6':'Contact with special interest groups',
    '5.8':'Information security in project management','5.9':'Inventory of information and other associated assets',
    '5.10':'Acceptable use of information and other associated assets','5.11':'Return of assets',
    '5.12':'Classification of information','5.13':'Labelling of information','5.14':'Information transfer',
    '5.16':'Identity management','5.17':'Authentication information','5.18':'Access rights',
    '5.19':'Information security in supplier relationships','5.20':'Addressing information security in supplier agreements',
    '5.21':'Managing information security in the ICT supply chain','5.22':'Monitoring, review and change management of supplier services',
    '5.23':'Information security for cloud services','5.24':'Information security incident management planning and preparation',
    '5.25':'Assessment and decision on information security events','5.26':'Response to information security incidents',
    '5.27':'Learning from information security incidents','5.28':'Collection of evidence',
    '5.29':'Information security during disruption','5.31':'Legal, statutory, regulatory and contractual requirements',
    '5.33':'Protection of records','5.34':'Privacy and protection of PII','5.35':'Independent review of information security',
    '5.36':'Compliance with policies, rules and standards',
    '6.1':'Screening','6.2':'Terms and conditions of employment','6.3':'Information security awareness, education and training',
    '6.4':'Disciplinary process','6.5':'Responsibilities after termination or change of employment',
    '6.6':'Confidentiality or non-disclosure agreements','6.7':'Remote working','6.8':'Information security event reporting',
    '7.1':'Physical security perimeters','7.2':'Physical entry','7.3':'Securing offices, rooms and facilities',
    '7.4':'Physical security monitoring','7.5':'Protecting against physical and environmental threats','7.6':'Working in secure areas',
    '7.7':'Clear desk and clear screen','7.8':'Equipment siting and protection','7.9':'Security of assets off-premises',
    '7.10':'Storage media','7.11':'Supporting utilities','7.12':'Cabling security','7.13':'Equipment maintenance','7.14':'Secure disposal or re-use of equipment',
    '8.1':'User endpoint devices','8.2':'Privileged access rights','8.3':'Information access restriction',
    '8.18':'Use of privileged utility programs','8.20':'Networks security',
    '8.4':'Access to source code','8.5':'Secure authentication','8.6':'Capacity management','8.7':'Protection against malware',
    '8.8':'Management of technical vulnerabilities','8.9':'Configuration management','8.11':'Data masking',
    '8.12':'Data leakage prevention','8.13':'Information backup','8.14':'Redundancy of information processing facilities',
    '8.15':'Logging','8.16':'Monitoring activities','8.19':'Installation of software on operational systems',
    '8.21':'Security of network services','8.22':'Segregation of networks','8.23':'Web filtering',
    '8.24':'Use of cryptography','8.25':'Secure development life cycle','8.26':'Application security requirements',
    '8.27':'Secure system architecture and engineering principles','8.28':'Secure coding','8.29':'Security testing in development and acceptance',
    '8.30':'Outsourced development','8.31':'Separation of development, test and production environments',
    '8.32':'Change management','8.33':'Test information','8.34':'Protection of information systems during audit testing',
  };
  const all = [];
  ANNEX_GROUPS.forEach((g) => {
    for (let i = g.start; i < g.end; i++) {
      const id = g.prefix + i;
      const o = overrides[id] || {};
      const m = meta[id] || {};
      all.push({
        id,
        group: g.id,
        name: o.name || friendly[id] || `Control ${id}`,
        owner: o.owner || m.owner || '—',
        last: o.last || m.last || '—',
        status: o.status || 'ok',
      });
    }
  });
  return all;
}

const CONTROLS = buildControls();

const STATUS_COLOR = {
  ok:    { bg: '#10B981', soft: '#ECFDF5', fg: '#047857', label: 'Compliant' },
  amber: { bg: '#F59E0B', soft: '#FFFBEB', fg: '#B45309', label: 'At risk' },
  red:   { bg: '#EF4444', soft: '#FEF2F2', fg: '#B91C1C', label: 'Gap' },
  na:    { bg: '#9CA3AF', soft: '#F3F4F6', fg: '#4B5563', label: 'N/A' },
};

const FINDINGS = [
  { ctrl:'8.10', issue:'Data deletion not automated',           owner:'Sam',    sev:'HIGH', target:'Q3 2026',     source:'Task tracker', ref:'OFI-015', link:'#' },
  { ctrl:'5.32', issue:'Trademark registration renewal pending', owner:'Jordan', sev:'LOW',  target:'In progress', source:'Task tracker', ref:'ISMS-877', link:'#' },
];

const OWNER_LOAD = [
  { name:'Alex',            role:'CISO', count: 18 },
  { name:'Sam',             role:'CTO',  count: 11 },
  { name:'Jordan',          role:'COO',  count: 6  },
  { name:'Riley',           role:'PM',   count: 4  },
  { name:'Morgan',          role:'Eng',  count: 3  },
  { name:'Casey',           role:'Eng',  count: 2  },
  { name:'Dana (Ext. DPO)', role:'DPO',  count: 2  },
];

// Risk register summary — 5x5 likelihood (rows, low→high) x impact (cols, low→high).
// Counts come from the 50 risks. ISMS-554 sits in (likelihood=Medium, impact=Very High).
const RISK_GRID = [
  // rows top→bottom = Very High → Very Low likelihood
  [0, 1, 2, 1, 1], // Very High likelihood
  [0, 2, 4, 3, 2], // High
  [1, 3, 6, 4, 1], // Medium       <— ISMS-554 in last cell of this row
  [2, 5, 8, 2, 0], // Low
  [1, 0, 1, 0, 0], // Very Low
];

// Demo exception register — mirrors an "Exception Request Form" list in the
// task tracker. approval: 'approved' (Board sign-off recorded) | 'pending'.
const EXCEPTIONS = [
  { id:'EX-001', title:'Streamlined policy approval (CISO drafts, single Board/CTO approver)', ctrls:['Cl. 5.2','A.5.1'], approval:'approved', validity:'05.05.2026 – 05.05.2027', link:'#' },
  { id:'EX-002', title:'Four-eyes relaxation for code changes (AI/automation as second reviewer)', ctrls:['A.8.25','A.8.32'], approval:'pending', validity:'05.05.2026 – 05.05.2027', link:'#' },
];

// Only the task tracker and Moodle are live integrations today; the rest are
// sources we reference but haven't wired up as live connectors yet.
const SYSTEMS = [
  { id:'taskhub',    name:'TaskHub',    sync:'4 min ago',  color:'#7B68EE', glyph:'TH', connected:true },
  { id:'moodle',     name:'Moodle',     sync:'1 hr ago',   color:'#F98012', glyph:'MD', connected:true },
  { id:'dochub',     name:'DocHub',     sync:null,         color:'#0078D4', glyph:'DH', connected:false },
  { id:'gitlab',     name:'GitLab',     sync:null,         color:'#FC6D26', glyph:'GL', connected:false },
  { id:'elastic',    name:'Elastic',    sync:null,         color:'#005571', glyph:'EL', connected:false },
  { id:'jamf',       name:'Jamf MDM',   sync:null,         color:'#37474F', glyph:'JF', connected:false },
];

const NAV = [
  { id:'overview',  label:'Overview',           icon:'layout-dashboard' },
  { id:'core',      label:'ISMS Core (Cl. 4–10)', icon:'list-checks' },
  { id:'controls',  label:'Controls (Annex A)', icon:'shield-check' },
  { id:'incidents', label:'Incidents',          icon:'siren' },
  { id:'risks',     label:'Risks',              icon:'alert-triangle' },
  { id:'policies',  label:'Policies',           icon:'file-text' },
  { id:'vendors',   label:'Vendors / Suppliers',icon:'building-2' },
  { id:'people',    label:'People & Training',  icon:'users' },
  { id:'evidence',  label:'Evidence Library',   icon:'folder-archive' },
  { id:'opsproc',   label:'Operating Procedures', icon:'list-ordered' },
  { id:'audits',    label:'Audits & Findings',  icon:'clipboard-check' },
  { id:'roadmap',   label:'Post-Audit Plan',    icon:'route' },
  { id:'exceptions',label:'Exceptions',         icon:'file-warning' },
  { id:'settings',  label:'Settings',           icon:'settings' },
];

// ─── Operating Procedures Register (Annex A 5.37) ───────────────────────────
// 45 procedures across 9 categories. Demo data mirroring a register v1.1
// (15.06.2026 pre-audit refresh).
const OPSPROC_REGISTER_URL = '#';
const OPSPROC_REGISTER_PDF = '#';
const OPSPROC_CATEGORIES = [
  { id:'4.1', name:'Security & Compliance' },
  { id:'4.2', name:'IT & Infrastructure' },
  { id:'4.3', name:'Data Protection' },
  { id:'4.4', name:'Incident & Risk Management' },
  { id:'4.5', name:'Change Management' },
  { id:'4.6', name:'Supplier & Vendor' },
  { id:'4.7', name:'People & HR' },
  { id:'4.8', name:'Physical Security' },
  { id:'4.9', name:'Business Continuity' },
];
const HB = '#';
const OPSPROC_PROCEDURES = [
  { id:'P-01', cat:'4.1', name:'ISMS Security Policy & Guidelines',         owner:'Alex',           ver:'1.3',    last:'15.05.2025', link:'#', notes:'Top-level ISMS policy' },
  { id:'P-02', cat:'4.1', name:'ISMS Scope',                                owner:'Alex',           ver:'1.3',    last:'09.06.2026', link:'#', notes:'Org chart updated 09.06.2026' },
  { id:'P-03', cat:'4.1', name:'ISMS Objectives & KPIs',                    owner:'Alex',           ver:'1.1',    last:'14.06.2026', link:'#', notes:'Reviewed pre-audit; KPI measurements tracked separately' },
  { id:'P-04', cat:'4.1', name:'Information Security Risk Management',      owner:'Alex',           ver:'Active', last:'Ongoing',    link:'#', notes:'Living document; method in Policy 23 v1.0' },
  { id:'P-05', cat:'4.1', name:'Corrective Measures Procedure',             owner:'Alex',           ver:'Active', last:'2025',       link:'#', notes:'Non-conformities and corrective actions' },
  { id:'P-06', cat:'4.1', name:'Audit Programme',                           owner:'Alex',           ver:'Active', last:'10.06.2026', link:'#', notes:'Internal + external audit schedule; branch office Q4 2026' },
  { id:'P-07', cat:'4.1', name:'Document Classification Procedure',         owner:'Alex',           ver:'Active', last:'2025',       link:HB, notes:'Document store = internal default; task tracker = internal; no Confidential in the task tracker' },
  { id:'P-07b',cat:'4.1', name:'Privileged Access Request',                 owner:'Sam',            ver:'Active', last:'2026',       link:'#', notes:'Requests/approvals for admin or privileged-utility use' },
  { id:'P-08', cat:'4.2', name:'Device Security & Compliance',              owner:'Sam',            ver:'Active', last:'2025',       link:HB, notes:'MDM (Apple Device Mgmt), antivirus (XProtect), encryption, removable media' },
  { id:'P-09', cat:'4.2', name:'Password & MFA Management',                 owner:'Sam',            ver:'Active', last:'2025',       link:HB, notes:'Min 12 chars; password manager; MFA mandatory' },
  { id:'P-10', cat:'4.2', name:'Access Rights Management',                  owner:'Sam',            ver:'Active', last:'2025',       link:HB, notes:'Least privilege; revoked on offboarding; no shared accounts' },
  { id:'P-11', cat:'4.2', name:'Patch & Vulnerability Management',          owner:'Sam',            ver:'Active', last:'2025',       link:HB, notes:'macOS updates ≤ 3 days; server patches by IT' },
  { id:'P-12', cat:'4.2', name:'Backup Procedure',                          owner:'Sam',            ver:'Active', last:'2025',       link:HB, notes:'Cloud drive auto-backup; server backups by IT; local files not backed up' },
  { id:'P-13', cat:'4.2', name:'Cloud Usage Policy',                        owner:'Sam',            ver:'Active', last:'2025',       link:HB, notes:'Approved: M365, task tracker, password manager; no personal cloud for work data' },
  { id:'P-14', cat:'4.2', name:'Logging & Security Monitoring',             owner:'Sam',            ver:'Active', last:'2025',       link:'#', notes:'Elastic Agent + XProtect; ~92% coverage (11/12) — OFI-019' },
  { id:'P-15', cat:'4.2', name:'Secure Coding Guidelines',                  owner:'Sam / Morgan',   ver:'Active', last:'2025',       link:HB, notes:'No hardcoded secrets; input validation; PRs required' },
  { id:'P-16', cat:'4.2', name:'Asset Management & Device Lifecycle',       owner:'Sam',            ver:'Active', last:'2025',       link:HB, notes:'Serial tracking; IT manages wipe on return' },
  { id:'P-17', cat:'4.2', name:'Cryptography Key Management',               owner:'Sam',            ver:'Active', last:'2025',       link:HB, notes:'Requests via IT; keys managed per secure standards' },
  { id:'P-18', cat:'4.3', name:'Secure Data Deletion',                      owner:'Alex',           ver:'Active', last:'2025',       link:HB, notes:'Factory reset or `rm -P` for Macs; IT handles servers' },
  { id:'P-19', cat:'4.3', name:'Data Deletion & AI Training Procedure',     owner:'Morgan',         ver:'Active', last:'2025',       link:'#', notes:'Client data lifecycle for AI/ML workflows' },
  { id:'P-20', cat:'4.3', name:'Anonymization Process',                     owner:'Morgan',         ver:'Active', last:'2025',       link:'#', notes:'PII anonymisation prior to AI training' },
  { id:'P-21', cat:'4.3', name:'Information Transfer & Data Sharing',       owner:'Alex',           ver:'Active', last:'2025',       link:HB, notes:'Approved document store only; no consumer file-transfer tools; no email for sensitive data' },
  { id:'P-22', cat:'4.4', name:'Security Incident Reporting & Response',    owner:'Alex',           ver:'Active', last:'2025',       link:HB, notes:'Report via the Security Incident Form' },
  { id:'P-23', cat:'4.4', name:'CERT Severity Classification',              owner:'Alex',           ver:'Active', last:'Feb 2026',   link:'#', notes:'Urgent/High/Normal/Low; Steps 1–7 of incident mgmt' },
  { id:'P-24', cat:'4.4', name:'Lessons Learned (Post-Incident)',           owner:'Alex',           ver:'Active', last:'Feb 2026',   link:'#', notes:'Step 7 of incident workflow; action items in the task tracker' },
  { id:'P-25', cat:'4.4', name:'Project Risk Management',                   owner:'Alex',           ver:'Active', last:'2025',       link:HB, notes:'Context → assessment → treatment → monitoring' },
  { id:'P-26', cat:'4.4', name:'Business Impact Analysis',                  owner:'Alex',           ver:'Active', last:'2025',       link:'#', notes:'RTOs/RPOs for critical processes' },
  { id:'P-27', cat:'4.5', name:'Change Management Procedure',               owner:'Casey',          ver:'Active', last:'2025',       link:HB, notes:'Steps 1–6; Change Management Form list' },
  { id:'P-28', cat:'4.6', name:'Vendor Due Diligence',                      owner:'Alex',           ver:'Active', last:'Jan 2026',   link:HB, notes:'Excel DD form; latest: VendorOne (Jan 2026)' },
  { id:'P-29', cat:'4.6', name:'Approved Software & Supplier Policy',       owner:'Alex',           ver:'Active', last:'2025',       link:HB, notes:'SaaS decision flow; DPO notification required' },
  { id:'P-30', cat:'4.6', name:'Outsourcing Policy',                        owner:'Alex',           ver:'Active', last:'2026',       link:'#', notes:'Outsourced IT roles, contractor access' },
  { id:'P-31', cat:'4.6', name:'Vendor Onboarding & Offboarding',           owner:'Alex',           ver:'Active', last:'2025',       link:HB, notes:'Data export, access revocation, service continuity checklist' },
  { id:'P-32', cat:'4.7', name:'Screening & Background Check',              owner:'Riley',          ver:'Active', last:'Jan 2026',   link:'#', notes:'References, CV confirmation, criminal record for critical roles' },
  { id:'P-33', cat:'4.7', name:'Employee Onboarding (IS clauses)',          owner:'Riley / Jordan', ver:'Active', last:'Jan 2026',   link:'#', notes:'ISO-compliant employment contracts' },
  { id:'P-34', cat:'4.7', name:'Offboarding & Post-Termination',            owner:'Riley',          ver:'Active', last:'Jan 2026',   link:'#', notes:'Access revocation, device return, NDA reminder' },
  { id:'P-35', cat:'4.7', name:'Disciplinary Process',                      owner:'Riley',          ver:'Active', last:'Jan 2026',   link:'#', notes:'Strengthened; all staff acknowledged' },
  { id:'P-36', cat:'4.7', name:'NDA & Confidentiality Agreement Management',owner:'Alex',           ver:'Active', last:'Jan 2026',   link:'#', notes:'Templates maintained by the CISO' },
  { id:'P-37', cat:'4.7', name:'Security Awareness & Training',             owner:'Riley',          ver:'Active', last:'2025',       link:'#', notes:'Moodle AI Policy training live' },
  { id:'P-38', cat:'4.7', name:'Remote Working',                            owner:'Riley',          ver:'Active', last:'2025',       link:HB, notes:'Home network, workspace security, no printing of sensitive docs' },
  { id:'P-39', cat:'4.7', name:'GenAI Usage Guidelines',                    owner:'Morgan / Alex',  ver:'Active', last:'2025',       link:'#', notes:'Approved use cases; no client data without DPA' },
  { id:'P-40', cat:'4.8', name:'Physical Access & Badge Management',        owner:'Riley',          ver:'Active', last:'Jan 2026',   link:'#', notes:'Landlord badge process updated Jan 2026' },
  { id:'P-41', cat:'4.8', name:'Clear Desk & Clear Screen Policy',          owner:'Alex',           ver:'Active', last:'2025',       link:HB, notes:'End-of-day lock-up; meeting rooms secured' },
  { id:'P-42', cat:'4.9', name:'Business Continuity Plan',                  owner:'Casey',          ver:'2.0',    last:'27.01.2026', link:'#', notes:'Full BCP; BC Planner: Casey (Policy 04 v1.1 App. 1)' },
  { id:'P-43', cat:'4.9', name:'Emergency Response & Call Tree',            owner:'Alex',           ver:'1.1',    last:'Feb 2026',   link:HB, notes:'Fire, flood, cyber, medical; call tree with all numbers' },
  { id:'P-44', cat:'4.9', name:'Black Swan Event Response',                 owner:'Alex',           ver:'1.1',    last:'Feb 2026',   link:HB, notes:'Phone-only escalation; no social media; forensic preservation' },
  { id:'P-45', cat:'4.9', name:'Emergency Handbook (detailed)',             owner:'Alex',           ver:'Active', last:'2025',       link:'#', notes:'Stored in the document store' },
];
const OPSPROC_GAPS = [
  { id:'G-01', risk:'Medium', resp:'Alex',          target:'Closed',   text:'Procedures scattered across the handbook, task tracker and document store — no single index existed. Closed: this register addresses it.' },
  { id:'G-02', risk:'Medium', resp:'Alex',          target:'Q2 2026',  text:'Incident management Steps 1–7 procedure not formally documented as a standalone doc.' },
  { id:'G-03', risk:'Medium', resp:'Sam',           target:'Q2 2026',  text:'No formal standalone "Privileged Access Management" procedure document (handbook + ticketing only).' },
  { id:'G-04', risk:'High',   resp:'Sam / Morgan',  target:'Roadmap',  text:'Data deletion automation not in place — client data deletion relies on manual process (OFI-015).' },
  { id:'G-05', risk:'Low',    resp:'Alex',          target:'Q3 2026',  text:'Procedure versioning inconsistent — some docs have formal revision tables, others do not.' },
  { id:'G-06', risk:'Low',    resp:'Alex',          target:'Q3 2026',  text:'No formal review schedule enforced for individual procedure documents.' },
  { id:'G-07', risk:'Low',    resp:'Alex',          target:'Post-audit', text:'Standing compliance-review ticket for this register itself not yet filed.' },
  { id:'G-08', risk:'Medium', resp:'Sam',           target:'Pending',  text:'Endpoint agent rollout still has 1 laptop pending — OFI-019 ~92% coverage.' },
];

// ─── ISMS Core — management-system clauses 4–10 ──────────────────────────────
// The Day-1-morning audit focus. Status grounded in demo OFIs / findings / MR-2026.
// status: ok | amber | red | na  (reuses STATUS_COLOR)
// links: clickable evidence — type drives the icon. doc = ISMS doc page,
//        ticket = task-tracker task, ext = external system.
const _DOC = '#';
const _dp  = () => '#';                       // ISMS doc page (demo)
const _tk  = () => '#';                       // task-tracker task (demo)
const _SOA_SP = '#'; // SoA in the document store (canonical)
const _SOA_CU = '#'; // SoA full v1.0 in the task tracker (Applicability + Implementation, 93 controls)

const ISMS_CLAUSES = [
  { clause:'4', title:'Context of the organisation', slot:'Day 1 · 09:30–10:30', items:[
    { id:'4.1',  title:'Understanding the organisation and its context',       status:'ok',    owner:'Alex', note:'Context analysis maintained; refreshed after the recent org restructuring.', links:[
      { label:'ISMS Context and Guidelines',              url:_dp(), type:'doc' },
      { label:'OFI-017 · ISMS docs for org restructuring', url:_tk(), type:'ticket' },
    ] },
    { id:'4.2',  title:'Needs and expectations of interested parties',          status:'ok',    owner:'Alex', note:'Interested-parties register current.', links:[
      { label:'Interested Parties Register', url:'#', type:'sheet' },
      { label:'Interested parties',     url:_dp(), type:'doc' },
      { label:'Special Interest Groups',url:_dp(), type:'doc' },
    ] },
    { id:'4.3',  title:'Determining the scope of the ISMS',                     status:'ok',    owner:'Alex', note:'Scope valid. SoA canonical version: Statement of Applicability — Full v1.0 in the task tracker (Applicability + Implementation columns for all 93 controls). Spreadsheet copy = released snapshot with per-control links.', links:[
      { label:'Statement of Applicability — Full v1.0', url:_SOA_CU, type:'doc' },
      { label:'Statement of Applicability (spreadsheet)', url:_SOA_SP, type:'sheet' },
      { label:'Scope of the ISMS',                        url:_dp(), type:'doc' },
      { label:'OFI-007 · add implementation location to SoA (closed)', url:_tk(), type:'ticket' },
    ] },
    { id:'4.4',  title:'Information security management system',                status:'ok',    owner:'Alex', note:'ISMS established and maintained.', links:[
      { label:'ISMS Context and Guidelines', url:_dp(), type:'doc' },
    ] },
    { id:'4.x',  title:'Climate change relevance (ISO Annex SL amendment)',     status:'ok',    owner:'Alex', note:'Assessed and documented: not materially relevant to the ISMS (digital/SaaS, minimal footprint). Monitoring for stakeholder changes.', links:[
      { label:'Climate change — context assessment (4.1/4.2)', url:_dp(), type:'doc' },
    ] },
  ]},
  { clause:'5', title:'Leadership', slot:'Day 1 · 09:30–10:30', items:[
    { id:'5.1',  title:'Leadership and commitment',                             status:'ok',    owner:'Jordan', note:'Top-management commitment evidenced in MR-2026.', links:[
      { label:'ISMS Objectives', url:_dp(), type:'doc' },
    ] },
    { id:'5.2',  title:'Policy',                                                status:'ok',    owner:'Alex', note:'All 29 policies released (v1.0+) in the task tracker and approved (Jordan, COO); Policy Log current as of 10.06.2026, 0 approvals pending.', links:[
      { label:'Policies folder — all 29 policies', url:'#', type:'doc' },
      { label:'ISMS Policy Log',                   url:'#', type:'doc' },
      { label:'KPI #1 — Policy & Documentation Compliance', url:_dp(), type:'doc' },
    ] },
    { id:'5.3',  title:'Roles, responsibilities and authorities',              status:'ok',    owner:'Alex', note:'Roles, responsibilities and authorities are documented in the roles table within the Scope of the ISMS document (Knowledge Hub), kept current (org chart updated 09.06.2026). Obsolete role references cleaned (OFI-017).', links:[
      { label:'Roles & responsibilities table (Scope of the ISMS)', url:_dp(), type:'doc' },
      { label:'OFI-017 · obsolete role refs cleanup', url:_tk(), type:'ticket' },
    ] },
  ]},
  { clause:'6', title:'Planning', slot:'Day 1 · 10:30 (6.2/6.3) + 11:30–12:30 (6.1 risk)', items:[
    { id:'6.1',  title:'Actions to address risks and opportunities (6.1.1–6.1.3)', status:'ok',    owner:'Alex', note:'Clause-6 audit finding remediated: Policy 23 v1.0 approved (COO, 10.06.2026) with Very High treatment rules and the 3×3 matrix aligned to the live Risk Register. Live ticketing + risk-analysis registers in the task tracker. Open follow-up: OFI-002 (High/VH acceptance list in Management Review); risk-to-control coverage ~91% tracked via KPI-4b.', links:[
      { label:'Risk Analyses (folder)',            url:'#', type:'doc' },
      { label:'Ticketing Systems (folder)',        url:'#', type:'ticket' },
      { label:'Policy 23 · ISRM v1.0 (3×3 matrix)', url:'#', type:'doc' },
      { label:'Policy 23 · ISRM v1.0 (PDF)',        url:'#', type:'doc' },
      { label:'Statement of Applicability (spreadsheet)', url:_SOA_SP, type:'sheet' },
      { label:'Statement of Applicability — Full v1.0',   url:_SOA_CU, type:'doc' },
      { label:'OFI-002 · document High/VH risk acceptance',url:_tk(), type:'ticket' },
    ] },
    { id:'6.2',  title:'Information security objectives and planning',          status:'amber', owner:'Alex', note:'KPI #3 endpoint coverage largely remediated (13.06): endpoint agent now on 11/12 laptops (~92%, incl. the new contractor device) — only one laptop pending; up from ~50% on 19 May (OFI-019). KPI #2 incident-mgmt SLA still ~33% (ISMS-2711); backlog reduced as the contractor-laptop incident (ISMS-2712) is now closed. The planned Board-approved SLA relaxation has NOT yet been filed in the Exception Register. Auditor story: breaches self-detected by the KPI framework, raised as ISMS incidents with documented corrective plans.', links:[
      { label:'ISMS Objectives', url:_dp(), type:'doc' },
      { label:'KPIs',            url:_dp(), type:'doc' },
      { label:'ISMS-2711 · SLA KPI incident (unstarted)', url:_tk(), type:'ticket' },
      { label:'ISMS-2710 · endpoint coverage incident',   url:_tk(), type:'ticket' },
      { label:'OFI-019 · endpoint agent rollout',         url:_tk(), type:'ticket' },
    ] },
    { id:'6.3',  title:'Planning of changes',                                   status:'ok',    owner:'Sam', note:'Change Management Form drives change planning; risk treatment now tracked through it.', links:[
      { label:'Corrective Measures',                          url:_dp(), type:'doc' },
      { label:'OFI-003 · risk treatment via Change Mgmt Form',url:_tk(), type:'ticket' },
    ] },
  ]},
  { clause:'7', title:'Support', slot:'Day 1 · 10:30–11:30', items:[
    { id:'7.1',  title:'Resources',                                             status:'ok',    owner:'Jordan', note:'ISMS resourcing confirmed in MR-2026.', links:[] },
    { id:'7.2',  title:'Competence',                                            status:'ok',    owner:'Riley',  note:'Competence and training records maintained. Security-awareness / competence training is delivered and tracked in Moodle (AI Policy training, completion gradebook). Roles, responsibilities and the current org chart are documented in the Scope of the ISMS.', links:[
      { label:'Moodle — training & competence records (AI Policy training)', url:'#', type:'ext' },
      { label:'Roles & responsibilities table (Scope of the ISMS)', url:_dp(), type:'doc' },
      { label:'Organisational chart (Scope of the ISMS §5.1)',     url:_dp(), type:'doc' },
    ] },
    { id:'7.3',  title:'Awareness',                                             status:'ok',    owner:'Riley',  note:'Awareness programme operational: AI Policy training (AI-POLICY-101) live on Moodle, assigned at onboarding and reinforced via Teams posts; participation tracking formalised (OFI-012 complete). CISO maintains the completion register.', links:[
      { label:'Moodle — AI Policy training', url:'#', type:'ext' },
      { label:'OFI-012 · formalize awareness/training tracking', url:_tk(), type:'ticket' },
    ] },
    { id:'7.4',  title:'Communication',                                         status:'ok',    owner:'Alex', note:'Internal and external communication needs are defined in the ISMS Communication Plan (what, when, with whom, and how to communicate).', links:[
      { label:'ISMS Communication Plan (PPTX)', url:'#', type:'doc' },
    ] },
    { id:'7.5',  title:'Documented information',                                status:'ok',    owner:'Alex', note:'Documented-info updates evidenced via version tables + doc history across all released policies (OFI-004 complete). HR documents under document control in the HR space Documents folder (OFI-011 — formal inventory with Riley in progress).', links:[
      { label:'ISMS Documented Information — Master Register', url:_dp(), type:'doc' },
      { label:'Employee Handbook', url:'#', type:'doc' },
      { label:'Knowledge Hub — ISO Mandatory Documents', url:'#', type:'doc' },
      { label:'HR Documents (document control)', url:'#', type:'doc' },
      { label:'OFI-004 · verifiable evidence for doc updates (closed)', url:_tk(), type:'ticket' },
      { label:'OFI-011 · HR templates under document control', url:_tk(), type:'ticket' },
    ] },
  ]},
  { clause:'8', title:'Operation', slot:'Day 1 · 11:30–12:30 (with 6.1)', items:[
    { id:'8.1',  title:'Operational planning and control',                      status:'amber', owner:'Alex', note:'Operating Procedures Register in place (45 procedures, 9 categories; last reviewed Mar 2026). Correction 12.06: the endpoint-logging deployment item is tracked as OFI-019 (now ~92% / 11 of 12 laptops) — no standing compliance-review ticket for the register exists; either file one before the audit or present the Mar 2026 review as current. Changes controlled via the change register (CR-NNN) per Policy 02 v1.0; outsourced processes governed by Policies 22/27.', links:[
      { label:'5.37 Operating Procedures Register v1.1', url:'#', type:'doc' },
      { label:'5.37 Operating Procedures Register v1.1 (PDF)', url:'#', type:'doc' },
      { label:'5.37 Register — v1.0 (history)',           url:'#', type:'doc' },
      { label:'Change Management Form register (CR-NNN)', url:'#', type:'ticket' },
      { label:'Policy 24 · Operating Procedures',         url:'#', type:'doc' },
      { label:'Policy 24 · Operating Procedures (PDF)',   url:'#', type:'doc' },
      { label:'OFI-019 · endpoint logging deployment',    url:_tk(), type:'ticket' },
    ] },
    { id:'8.2',  title:'Information security risk assessment',                  status:'ok',    owner:'Alex', note:'Risk assessments at planned intervals: bulk annual review of 50+ risks completed Jan–Mar 2026 using the canonical 3×3 method (Policy 23 v1.0); results in the live Risk Register.', links:[
      { label:'Risk Register — Risk Analysis Annex A (live)',  url:'#', type:'doc' },
      { label:'Risk Analyses (folder)',                        url:'#', type:'doc' },
      { label:'Policy 23 · ISRM v1.0 (3×3 method)',            url:'#', type:'doc' },
      { label:'Policy 23 · ISRM v1.0 (PDF)',                   url:'#', type:'doc' },
      { label:'Statement of Applicability — Full v1.0', url:_SOA_CU, type:'doc' },
    ] },
    { id:'8.3',  title:'Information security risk treatment',                   status:'ok',    owner:'Alex', note:'Treatment plans tracked per risk in the register; treatment routed through the Change Management Form (OFI-003 complete); acceptance per Policy 23 §7.4, Very High only via Board + Exception Register.', links:[
      { label:'Policy 23 · ISRM v1.0 (§7.3/§7.4)',             url:'#', type:'doc' },
      { label:'Policy 23 · ISRM v1.0 (PDF)',                   url:'#', type:'doc' },
      { label:'OFI-003 · risk treatment via Change Mgmt Form (closed)', url:_tk(), type:'ticket' },
      { label:'Exception Register (EX-001/EX-002)',            url:'#', type:'ticket' },
    ] },
  ]},
  { clause:'9', title:'Performance evaluation', slot:'Day 1 · 10:30–11:30', items:[
    { id:'9.1',  title:'Monitoring, measurement, analysis and evaluation',      status:'amber', owner:'Alex', note:'KPI framework live and demonstrably operating — KPI #2 (incident SLA ~33%) and KPI #3 (endpoint coverage) re-measured 19 May and raised as ISMS incidents per OFI-005. KPI #3 now ~92% (11/12 laptops, one pending) — largely remediated under OFI-019. KPI #2 still open: ISMS-2711 not yet actioned and the proposed SLA exception not yet filed. Position for auditor: monitoring is effective (it found the problems) and remediation is demonstrably progressing.', links:[
      { label:'KPIs',                            url:_dp(), type:'doc' },
      { label:'KPI #2 — Incident Management',    url:_dp(), type:'doc' },
      { label:'KPI #3 — Endpoint & Device Security', url:_dp(), type:'doc' },
      { label:'ISMS-2710 · KPI-3 incident', url:_tk(), type:'ticket' },
      { label:'ISMS-2711 · KPI-2 incident', url:_tk(), type:'ticket' },
    ] },
    { id:'9.2',  title:'Internal audit',                                        status:'ok',    owner:'Alex', note:'Internal audit completed (J. Miller, external auditor; 16 OFIs — all tracked) and Management Review 2026 held. The branch office is an explicit auditable unit in the Audit Programme 2026–2027 (branch audit scheduled Q4 2026, OFI-006 closed); the serviced-office provider (branch premises) obtained ISO 27001 certification in 2026, first time.', links:[
      { label:'Audit Programme & Calendar 2026–2027', url:_dp(), type:'doc' },
      { label:'Audit Reports',           url:_dp(), type:'doc' },
      { label:'Audit Programme 2025-2026',url:_dp(),type:'doc' },
      { label:'OFI-006 · branch office in audit programme (closed)', url:_tk(), type:'ticket' },
    ] },
    { id:'9.3',  title:'Management review',                                     status:'ok',    owner:'Jordan', note:'Management Review 2026 held 12.04.2026 (facilitated by J. Miller; period 05/2024–03/2026) and now published in the Knowledge Hub. Top management concluded the ISMS remains suitable/adequate/effective but needs targeted adaptation post-headcount-reduction; MR action items tracked.', links:[
      { label:'Management Review 2026 (Knowledge Hub)', url:_dp(), type:'doc' },
      { label:'Audit Reports & Management Reviews', url:_dp(), type:'doc' },
    ] },
  ]},
  { clause:'10', title:'Improvement', slot:'Day 1 · 10:30–11:30', items:[
    { id:'10.1', title:'Continual improvement',                                 status:'ok',    owner:'Alex', note:'Improvement cycle running via OFI/MR backlog.', links:[
      { label:'Corrective Measures', url:_dp(), type:'doc' },
    ] },
    { id:'10.2', title:'Nonconformity and corrective action',                   status:'ok',    owner:'Alex', note:'Incidents / Changes / Corrective Actions split into separate workflows.', links:[
      { label:'Corrective Measures',                                       url:_dp(), type:'doc' },
      { label:'Corrective Actions — ticketing system',                     url:'#', type:'ticket' },
      { label:'OFI-018 · separate Incidents/Changes/Corrective Actions',   url:_tk(), type:'ticket' },
    ] },
  ]},
];


// ─── Risk Register (3×3 canonical per Policy 23 v1.0) ───────────────────────
// Score = Likelihood (1–3) × Impact (1–3); 1=VL, 2=L, 3–4=M, 6=H, 9=VH.
const RISK_GRID3 = [
  // rows top→bottom = Likely(3) → Unlikely(1); cols left→right = Impact Low(1) → High(3)
  [3, 4, 0],  // Likelihood 3 (Likely):   scores 3, 6, 9
  [9, 8, 4],  // Likelihood 2 (Possible): scores 2, 4, 6
  [9, 9, 4],  // Likelihood 1 (Unlikely): scores 1, 2, 3
];
const RISK_SCORE_LEVEL = { 1:'Very Low', 2:'Low', 3:'Medium', 4:'Medium', 6:'High', 9:'Very High' };

const KEY_RISKS = [
  { id:'ISMS-554',  title:'Exclusion of sales processes — super-admin rights assigned in violation of least privilege', l:2, i:3, score:6, level:'High',   treatment:'Treatment in progress; access recertification + segregation controls. Tracked per Policy 23 §7.3.', owner:'Alex',
    links:[{label:'Risk Register (Risk Analysis Annex A)', url:'#', type:'doc'}] },
  { id:'A.8.10',    title:'Information deletion not automated (data stores: Postgres, S3, Elastic)', l:2, i:3, score:6, level:'High',   treatment:'Automation target Q3 2026 (GitLab CI deletion jobs, log evidence); manual deletion procedures being formalised under OFI-015.', owner:'Sam',
    links:[{label:'OFI-015 · formalize info-deletion procedures', url:'#', type:'ticket'}] },
  { id:'KPI-3',     title:'Endpoint logging coverage ~92% (11/12) — endpoint agent on all laptops except one', l:1, i:3, score:3, level:'Medium', treatment:'Rollout largely complete (13.06): endpoint agent on all company laptops incl. the new contractor device; only one laptop pending. Up from ~50% on 19 May. Tracked as ISMS-2710 / OFI-019.', owner:'Sam',
    links:[{label:'ISMS-2710 · endpoint coverage incident', url:'#', type:'ticket'}] },
  { id:'KPI-2',     title:'Incident-management SLA timeliness ~33% during reduced-headcount period', l:3, i:2, score:6, level:'High',   treatment:'Triage backlog (7 untouched incidents incl. INCIDENT-335 urgent); time-bounded SLA relaxation still to be FILED as Board-approved exception (ISMS-2711 unstarted since 19 May).', owner:'Alex',
    links:[{label:'ISMS-2711 · SLA incident + exception proposal', url:'#', type:'ticket'}] },
  { id:'CR-002',    title:'Contractor BYOD exception — RESOLVED (company laptop now issued)', l:1, i:2, score:2, level:'Low', treatment:'Closed 13.06.2026 — contractor received a company-managed laptop (MDM + endpoint agent enrolled); BYOD exception retired and incident ISMS-2712 closed.', owner:'Alex',
    links:[{label:'CR-002 · contractor BYOD change request', url:'#', type:'ticket'}] },
  { id:'ISMS-2678', title:'Hazardous & climate risks (consolidation of 7 deprecated physical/environmental risks)', l:1, i:2, score:2, level:'Low',    treatment:'Mitigated — offloaded to ISO 27001-certified providers (datacenter + serviced-office providers); the office provider obtained certification in 2026.', owner:'Alex',
    links:[{label:'Risk Analyses (folder)', url:'#', type:'doc'}] },
];

const RISK_ACCEPTANCE = [
  { level:'Very Low / Low (1–2)', authority:'Risk Owner' },
  { level:'Medium (3–4)',         authority:'CISO' },
  { level:'High (6)',             authority:'CISO + CTO joint' },
  { level:'Very High (9)',        authority:'Board of Directors via Exception Register, time-bounded ≤ 6 months' },
];

const RISK_EVIDENCE = [
  { label:'Risk Register — Risk Analysis Annex A (live)', url:'#', type:'doc' },
  { label:'Risk Analyses (folder)',                       url:'#', type:'doc' },
  { label:'Policy 23 · ISRM v1.0 — 3×3 matrix, §7.3/§7.4', url:'#', type:'doc' },
  { label:'Statement of Applicability — Full v1.0', url:_SOA_CU, type:'doc' },
  { label:'Statement of Applicability (spreadsheet)', url:_SOA_SP, type:'sheet' },
  { label:'Ticketing Systems (OFI / Incidents / Changes)', url:'#', type:'ticket' },
];

// ─── Vendors / Suppliers (A.5.19–5.23, Policy 22 + 27) ──────────────────────
// Supplier/Service register reconciled against accounting Service & Supplier
// Comparison (Jun 2026). Last access review to be populated per Policy 22.
const VENDORS = [
  { name:'BankOne',         type:'Bank accounts', owner:'Casey',  crit:'Critical', assurance:'Regulated EU bank · ISO 27001',          lastReview:'—' },
  { name:'Edenred',         type:'',              owner:'Casey',  crit:'Low',      assurance:'Vendor terms',                            lastReview:'—' },
  { name:'Facebook',        type:'Social Media',  owner:'Casey',  crit:'Low',      assurance:'Vendor terms (public profile only)',     lastReview:'—' },
  { name:'Google',          type:'Cloud',         owner:'Casey',  crit:'High',     assurance:'ISO 27001 / SOC 2',                       lastReview:'—' },
  { name:'PayrollCo',       type:'Payroll',       owner:'Casey',  crit:'High',     assurance:'Contract + DPA',                          lastReview:'—' },
  { name:'BankTwo',         type:'Bank accounts', owner:'Casey',  crit:'Critical', assurance:'Regulated EU bank · ISO 27001',           lastReview:'—' },
  { name:'LinkedIn',        type:'Social Media',  owner:'Casey',  crit:'Low',      assurance:'Vendor terms (Microsoft · SOC 2)',        lastReview:'—' },
  { name:'GovPortal',       type:'',              owner:'Casey',  crit:'Moderate', assurance:'Government portal',                       lastReview:'—' },
  { name:'Office Safe',     type:'',              owner:'Casey',  crit:'Low',      assurance:'Vendor terms',                            lastReview:'—' },
  { name:'Personio',        type:'SaaS',          owner:'Casey',  crit:'High',     assurance:'ISO 27001',                               lastReview:'—' },
  { name:'Pleo',            type:'SaaS',          owner:'Casey',  crit:'Moderate', assurance:'ISO 27001',                               lastReview:'—' },
  { name:'YouTube',         type:'Social Media',  owner:'Casey',  crit:'Low',      assurance:'Vendor terms (Google · SOC 2)',           lastReview:'—' },
  { name:'AD',              type:'internal',      owner:'Riley',  crit:'High',     assurance:'Self-hosted directory',                    lastReview:'—' },
  { name:'Adobe',           type:'SaaS',          owner:'Riley',  crit:'Low',      assurance:'SOC 2',                                    lastReview:'—' },
  { name:'TaskHub',         type:'SaaS',          owner:'Riley',  crit:'High',     assurance:'SOC 2',                                    lastReview:'—' },
  { name:'Figma',           type:'SaaS',          owner:'Riley',  crit:'Low',      assurance:'SOC 2',                                    lastReview:'—' },
  { name:'Lucid',           type:'SaaS',          owner:'Riley',  crit:'Low',      assurance:'SOC 2',                                    lastReview:'—' },
  { name:'POEditor',        type:'SaaS',          owner:'Riley',  crit:'Low',      assurance:'Vendor terms',                             lastReview:'—' },
  { name:'Microsoft 365',   type:'SaaS',          owner:'Jordan', crit:'Critical', assurance:'ISO 27001 / SOC 2',                        lastReview:'—' },
  { name:'Stripe',          type:'',              owner:'Jordan', crit:'High',     assurance:'PCI DSS',                                  lastReview:'—' },
  { name:'ZOHO',            type:'',              owner:'Jordan', crit:'Moderate', assurance:'ISO 27001 / SOC 2',                        lastReview:'—' },
  { name:'HubSpot',         type:'SaaS',          owner:'Riley',  crit:'Moderate', assurance:'SOC 2',                                    lastReview:'—' },
  { name:'CookieBot',       type:'SaaS',          owner:'Sam',    crit:'Low',      assurance:'GDPR',                                     lastReview:'—' },
  { name:'DeepL',           type:'SaaS',          owner:'Sam',    crit:'Moderate', assurance:'ISO 27001 / GDPR',                         lastReview:'—' },
  { name:'Elastic',         type:'SaaS',          owner:'Sam',    crit:'High',     assurance:'ISO 27001 / SOC 2',                        lastReview:'—' },
  { name:'EuroDNS',         type:'',              owner:'Sam',    crit:'Moderate', assurance:'Vendor terms',                             lastReview:'—' },
  { name:'GitLab',          type:'SaaS',          owner:'Sam',    crit:'Critical', assurance:'ISO 27001 / SOC 2',                        lastReview:'—' },
  { name:'Hetzner',         type:'Datacenter',    owner:'Sam',    crit:'Critical', assurance:'ISO 27001',                                lastReview:'—' },
  { name:'JetBrains',       type:'License',       owner:'Sam',    crit:'Low',      assurance:'SOC 2',                                    lastReview:'—' },
  { name:'Keeper',          type:'SaaS',          owner:'Sam',    crit:'High',     assurance:'ISO 27001 / SOC 2',                        lastReview:'—' },
  { name:'KeyCloak',        type:'internal',      owner:'Sam',    crit:'High',     assurance:'Self-hosted on Hetzner',                    lastReview:'—' },
  { name:'Laptop',          type:'',              owner:'Sam',    crit:'Moderate', assurance:'Hardware fleet (vendor warranty)',          lastReview:'—' },
  { name:'LimeSurvey',      type:'internal',      owner:'Sam',    crit:'Low',      assurance:'Self-hosted',                              lastReview:'—' },
  { name:'Postman',         type:'SaaS',          owner:'Sam',    crit:'Low',      assurance:'SOC 2',                                    lastReview:'—' },
];

const VENDOR_EVIDENCE = [
  { label:'Policy 22 · Third Party Supplier Security v1.0', url:'#', type:'doc' },
  { label:'Policy 27 · Outsourcing Policy v1.0',            url:'#', type:'doc' },
  { label:'Interested parties / interfaces & dependencies', url:'#', type:'doc' },
  { label:'OFI-009 · review external services inventory',   url:'#', type:'ticket' },
  { label:'CR-005 · vendor retroactive onboarding',         url:'#', type:'ticket' },
  { label:'Cloud Policy v2.0 · Appendix II approved services', url:'#', type:'doc' },
];

// ─── Policy register (mirrors the ISMS Policy Log, 10.06.2026) ──────────────
const _pd = () => '#';
const _pp = () => '#';
const POLICY_REGISTER = [
  { num:'00', name:'Common Definitions & Reference',                ver:'v1.0', updated:'19.03.2026', url:_pd(), pdf:_pp() },
  { num:'01', name:'Policy Creation & Policy Template',             ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'02', name:'Change Management Policy',                      ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'03', name:'Information Security Policy (incl. CI)',        ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'04', name:'Business Continuity Policy & DRP',              ver:'v1.1', updated:'10.06.2026', url:_pd(), pdf:_pp() },
  { num:'05', name:'Security Incident Response Policy',             ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'06', name:'Teleworking (Remote Working) Policy',           ver:'v1.0', updated:'19.03.2026', url:_pd(), pdf:_pp() },
  { num:'07', name:'Physical Security Monitoring Policy',           ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'08', name:'Environmental Security Monitoring Policy',      ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'09', name:'Backup Policy',                                 ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'10', name:'Access & Password Control Policy',              ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'11', name:'Network Security Policy',                       ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'12', name:'Secure Software Development Policy',            ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'13', name:'Logging and Monitoring Policy',                 ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'14', name:'Patch Management Policy',                       ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'15', name:'Technical Vulnerability Management Policy',     ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'16', name:'Data Classification and Handling Policy',       ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'17', name:'Asset Management Policy',                       ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'18', name:'Cryptography Key, Control & Encryption Mgmt',   ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'19', name:'Acceptable Use Policy',                         ver:'v1.0', updated:'19.03.2026', url:_pd(), pdf:_pp() },
  { num:'20', name:'InfoSec Awareness and Training Policy',         ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'21', name:'Cloud Policy',                                  ver:'v2.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'22', name:'Third Party Supplier Security Policy',          ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'23', name:'Information Security Risk Management Policy',   ver:'v1.0', updated:'10.06.2026', url:_pd(), pdf:_pp() },
  { num:'24', name:'Operating Procedures Policy',                   ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'25', name:'Information Transfer Policy',                   ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'26', name:'Records and Information Management Policy',     ver:'v1.0', updated:'09.06.2026', url:_pd(), pdf:_pp() },
  { num:'27', name:'Outsourcing Policy',                            ver:'v1.0', updated:'2026',       url:_pd(), pdf:_pp() },
  { num:'28', name:'Artificial Intelligence (AI) Usage Policy',     ver:'v1.1', updated:'19.05.2026', url:_pd(), pdf:_pp() },
];
const POLICY_EVIDENCE = [
  { label:'ISMS Policy Log (single source of truth)', url:'#', type:'doc' },
  { label:'Policies folder (canonical)',              url:'#', type:'doc' },
  { label:'Released policies — markdown + branded PDFs', url:'#', type:'doc' },
];

// ─── Incidents ───────────────────────────────────────────────────────────────
// Mix of canonical Incidents list, ISMS Incidents list, and OFI-list sub-tasks.
const INCIDENTS = [
  { id:'INCIDENT-335', list:'Canonical Incidents', title:'Payment-platform admin role still assigned to a former employee',          severity:'Urgent', status:'New',  filed:'2026-05-19', subtasks:8, link:'#' },
  { id:'ISMS-2710',    list:'ISMS Incidents',      title:'INCIDENT-KPI-3 — Endpoint coverage ~92% (11/12); one laptop pending', severity:'Medium', status:'In progress', filed:'2026-05-19', link:'#' },
  { id:'ISMS-2711',    list:'ISMS Incidents',      title:'INCIDENT-KPI-2 — Incident Management SLA at ~33% + SLA relaxation proposal', severity:'High', status:'Open', filed:'2026-05-19', link:'#' },
  { id:'ISMS-2712',    list:'ISMS Incidents',      title:'Contractor laptop provisioning — RESOLVED (laptop received, MDM + endpoint agent enrolled)', severity:'High',   status:'Resolved', filed:'2026-05-19', link:'#' },
  { id:'ISMS-2708',    list:'OFI-list sub-task',   title:'INCIDENT-KPI-2 (OFI-list sibling of ISMS-2711)',                          severity:'High',   status:'Open', filed:'2026-05-19', link:'#' },
  { id:'ISMS-2709',    list:'OFI-list sub-task',   title:'INCIDENT-KPI-4b — Risk-to-control coverage at ~91%',                       severity:'Medium', status:'Open', filed:'2026-05-19', link:'#' },
];

// ─── OFI Register ────────────────────────────────────────────────────────────
// 21 OFIs: 16 audit-driven (internal audit /01,/02), 5 from Management Review 2026.
// Demo data snapshot dated 2026-06-12.
const OFIS = [
  { id:'OFI-001', title:'Policy 23 Very High clarification + 3×3 alignment',           status:'In progress', source:'Audit /01 /02', due:'2026-06-02', link:'#' },
  { id:'OFI-002', title:'Document High/Very High risk acceptance in MR',               status:'In progress', source:'Audit /01 /02', due:'2026-06-02', link:'#' },
  { id:'OFI-003', title:'Track risk treatment via Change Management Form',             status:'Complete',    source:'Audit /01 /02', due:'2026-06-16', link:'#' },
  { id:'OFI-004', title:'Verifiable evidence for documented info updates',             status:'Complete',    source:'Audit /01 /02', due:'2026-06-16', link:'#' },
  { id:'OFI-005', title:'KPI breaches tracked as security incidents',                  status:'Complete',    source:'Audit /01 /02', due:'2026-06-16', link:'#' },
  { id:'OFI-006', title:'Branch offices in audit program',                             status:'Complete',    source:'Audit /01 /02', due:'2026-06-16', link:'#' },
  { id:'OFI-007', title:'Add implementation location to SoA',                          status:'Complete',    source:'Audit /01 /02', due:'2026-06-16', link:'#' },
  { id:'OFI-008', title:'Document Threat Intelligence activities + workshops',         status:'Open',        source:'Audit /01 /02', due:'2026-06-16', link:'#' },
  { id:'OFI-009', title:'Review external services inventory',                          status:'In progress', source:'Audit /01 /02', due:'2026-06-16', link:'#' },
  { id:'OFI-010', title:'Detail access-rights recertification; ticket system',         status:'In progress', source:'Audit /01 /02', due:'2026-06-02', link:'#' },
  { id:'OFI-011', title:'HR templates under document control',                         status:'In progress', source:'Audit /01 /02', due:'2026-06-16', link:'#' },
  { id:'OFI-012', title:'Formalize awareness/training tracking',                       status:'Complete',    source:'Audit /01 /02', due:'2026-06-16', link:'#' },
  { id:'OFI-013', title:'Treat AI models like source code',                            status:'Open',        source:'Audit /01 /02', due:'2026-06-02', link:'#' },
  { id:'OFI-014', title:'Malware top-down threat / attack-tree analysis',              status:'Open',        source:'Audit /01 /02', due:'2026-06-16', link:'#' },
  { id:'OFI-015', title:'Formalize info-deletion procedures',                          status:'In progress', source:'Audit /01 /02', due:'2026-06-02', link:'#' },
  { id:'OFI-016', title:'Review air-gap backups and retention',                        status:'Open',        source:'Audit /01 /02', due:'2026-06-02', link:'#' },
  { id:'OFI-017', title:'ISMS docs for org restructuring; obsolete role refs',         status:'Complete',    source:'MR-2026',       due:'2026-06-02', link:'#' },
  { id:'OFI-018', title:'Separate Incidents / Changes / Corrective Actions workflows', status:'Complete',    source:'MR-2026',       due:'2026-06-02', link:'#' },
  { id:'OFI-019', title:'Complete endpoint agent deployment (coverage / RBAC / review schedule)', status:'In progress', source:'MR-2026',   due:'2026-06-02', link:'#' },
  { id:'OFI-020', title:'ISMS operations automation roadmap',                          status:'In progress', source:'MR-2026',       due:'2026-08-11', link:'#' },
  { id:'OFI-021', title:'Policy 28 — GDPR section for client data via AI',             status:'Complete',    source:'MR-2026',       due:'2026-06-02', link:'#' },
];

// ─── Audit Reports ───────────────────────────────────────────────────────────
const AUDIT_REPORTS = [];

const SEVERITY_COLOR = {
  Urgent: { bg:'#FEF2F2', fg:'#B91C1C', dot:'#EF4444' },
  High:   { bg:'#FFFBEB', fg:'#B45309', dot:'#F59E0B' },
  Medium: { bg:'#EFF6FF', fg:'#1D4ED8', dot:'#3B82F6' },
  Low:    { bg:'#ECFDF5', fg:'#047857', dot:'#10B981' },
};

const OFI_STATUS_COLOR = {
  'Open':        { bg:'#FEF2F2', fg:'#B91C1C', dot:'#EF4444' },
  'In progress': { bg:'#FFFBEB', fg:'#B45309', dot:'#F59E0B' },
  'Complete':    { bg:'#ECFDF5', fg:'#047857', dot:'#10B981' },
};

Object.assign(window, {
  ANNEX_GROUPS, CONTROLS, STATUS_COLOR, FINDINGS, OWNER_LOAD,
  RISK_GRID, EXCEPTIONS, SYSTEMS, NAV, ISMS_CLAUSES,
  INCIDENTS, OFIS, AUDIT_REPORTS, SEVERITY_COLOR, OFI_STATUS_COLOR,
  RISK_GRID3, RISK_SCORE_LEVEL, KEY_RISKS, RISK_ACCEPTANCE, RISK_EVIDENCE,
  VENDORS, VENDOR_EVIDENCE, POLICY_REGISTER, POLICY_EVIDENCE,
});
