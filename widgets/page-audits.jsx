// Audits & Findings page — audit reports at the top, OFI register below.
// Click any row → slide-over drawer. Reuses DetailSection from incidents.jsx.
const { useState: useAudState } = React;

// CertCo re-certification audit agenda — 16–17 Jun 2026 (demo data).
// Chips list the clauses/controls in focus.
const AUDIT_AGENDA = [
  {
    day: 'Tuesday · 16 Jun 2026',
    site: 'Acme S.A. HQ',
    blocks: [
      { time:'09:00–09:30', title:'Opening meeting', detail:'Introductions; changes to scope/processes/products; confirm scope validity & fine-tune the audit plan.', tags:[] },
      { time:'09:30–10:30', title:'Context & Leadership', detail:'Clause 4 Context (incl. climate change) and Clause 5 Leadership, Policy & Roles.', tags:['4.1','4.2','4.3','4.4','5.1','5.2','5.3'] },
      { time:'10:30–11:30', title:'Support · Performance · Improvement', detail:'Clause 6.2–6.3 planning, Clause 7 support, Clause 9 evaluation, Clause 10 improvement.', tags:['6.2','6.3','7','9','10'] },
      { time:'11:30–12:30', title:'Prior-audit OFIs + Risk planning', detail:'Review status of OFIs from the last audit; Clause 6.1 risk assessment & treatment.', tags:['OFIs','6.1'] },
      { time:'12:30–13:00', title:'Operations', detail:'Clause 8.1–8.3 operational planning, control & risk.', tags:['8.1','8.2','8.3'] },
      { time:'12:30–13:00', title:'Lunch break', detail:'', tags:[] },
      { time:'13:00–13:30', title:'Cryptography & key management', detail:'Use of cryptography and key management.', tags:['A.8.24'] },
      { time:'13:30–14:30', title:'Physical & environmental security — site walkthrough', detail:'Begehung of the office and perimeter.', tags:['A.7.1–A.7.14'],
        commonPolicyNums: ['07','08'],
        common: [
          'Policy 07 — Physical Security Monitoring (v1.0) and Policy 08 — Environmental Security Monitoring (v1.0) govern the entire A.7.x area.',
          'HQ: managed multi-tenant office building. Building management provides perimeter, badge access, reception, CCTV, fire/flood/power protections, utilities and structured cabling. Secondary branch office is covered by the office provider ISO 27001 certificate (obtained 2026).',
          'Server hosting is fully off-site at an ISO 27001-certified cloud provider — no on-prem server room or datacentre to walk through; cabling and equipment placement on premises are vendor-managed.',
          'All staff laptops MDM-managed via Apple Device Management — FileVault disk encryption, screen auto-lock, remote wipe, Elastic monitoring agent (~92% endpoint coverage).',
          'Asset inventory and offboarding flow tracked in the asset register per Policy 17 (Asset Management); clean-desk and acceptable use in Policy 19 + Employee Handbook.',
          { label:'Physical perimeter diagram — HQ, 1st floor (zones overlaid white/green/yellow/red)', url:'#' },
          { label:'Employee Handbook → Office Security section (covers entry, visitors, clean-desk, off-site assets, removable media, secure deletion)', url:'#' },
          { label:'Operating Procedures Register → Physical Security category (5.37 v1.1)', url:'#' },
        ],
      },
      { time:'14:30–15:30', title:'Communication & network security', detail:'Information transfer, NDAs, network security & segregation, web filtering.', tags:['A.5.14','A.6.6','A.8.20','A.8.21','A.8.22','A.8.23'],
        commonPolicyNums: ['11'],
        common: [
          'Policy 11 — Network Security governs the whole network area; production (cloud) is fully isolated from the office/corporate network (managed building network) — no flat network.',
          'Web filtering / malware blocking via Microsoft Defender on all endpoints.',
        ],
      },
      { time:'15:30–16:30', title:'Supplier management', detail:'Supplier relationships, agreements, ICT supply chain, monitoring, cloud services.', tags:['A.5.19','A.5.20','A.5.21','A.5.22','A.5.23'],
        commonPolicyNums: ['22','27'],
        common: [
          'Policy 22 — Third Party Supplier Security + Policy 27 — Outsourcing Policy govern the whole supplier area.',
          'Authoritative registers: Vendors & Suppliers Register, Outsourcing Register. Cloud services approved list in Policy 21 — Cloud Policy v2.0 Appendix II.',
          { label:'Vendors & Suppliers Register (34 entries · criticality · assurance)', url:'#' },
          { label:'Outsourcing Register', url:'#' },
          { label:'Policy 21 — Cloud Policy v2.0 (Appendix II approved services)', url:'#' },
        ],
      },
      { time:'16:30–17:00', title:'End-of-day briefing', detail:'Wrap-up and planning for day 2.', tags:[] },
    ],
  },
  {
    day: 'Wednesday · 17 Jun 2026',
    site: 'Acme S.A. HQ',
    blocks: [
      { time:'09:00–09:30', title:'Opening meeting', detail:'Introductions and finalising the audit plan.', tags:[] },
      { time:'09:00–11:00', title:'Acquisition, development & maintenance', detail:'Secure dev lifecycle, app security, architecture, secure coding, testing, outsourced dev, environment separation, test data.', tags:['A.8.25','A.8.26','A.8.27','A.8.28','A.8.29','A.8.30','A.8.31','A.8.33'],
        commonPolicyNums: ['12'],
        common: [
          'Policy 12 — Secure Software Development governs the entire SDLC area (architecture, coding, testing, environment separation, test data).',
          'Source code + CI/CD on GitLab (ISO 27001 / SOC 2 certified); production deploys gated by Change Management (Policy 02) — see Change Register.',
          'Outsourced development (A.8.30) governed by Policy 27 — Outsourcing Policy with supplier security clauses per Policy 22.',
        ],
      },
      { time:'11:00–12:30', title:'Business Continuity Management', detail:'Information security during disruption, ICT readiness for BC, redundancy.', tags:['A.5.29','A.5.30','A.8.14'],
        commonPolicyNums: ['04'],
        common: [
          'Policy 04 — Business Continuity Policy & DRP (v1.1) governs the entire BCM area. The register holds the current BCP + Emergency Plan.',
          'Backups governed by Policy 09 — Backup Policy; ICT readiness for BC validated annually.',
          { label:'Business Continuity and Emergency Plan v2.0', url:'#' },
        ],
      },
      { time:'12:30–13:00', title:'Lunch break', detail:'', tags:[] },
      { time:'13:00–14:00', title:'Compliance', detail:'Legal/contractual requirements, IP rights, records protection, data protection, independent review, vulnerability handling.', tags:['A.5.31','A.5.32','A.5.33','A.5.34','A.5.35','A.5.36','A.8.8'] },
      { time:'14:30–15:30', title:'Admin · logo / Basic Data Sheet', detail:'Print order/logo, additional services, CertCo logo usage.', tags:[] },
      { time:'15:30–16:30', title:'Documentation of audit results', detail:'Processing of the audit results to date.', tags:[] },
      { time:'16:30–17:00', title:'Closing meeting', detail:'Summary of findings; planning and focus of the follow-up audit.', tags:[] },
    ],
  },
];

// Maps agenda tags → live status. 'A.x.y' (and ranges) → Annex A controls;
// bare 'x.y' / 'x' → management clauses (ISMS_CLAUSES). Used to mark each
// agenda block Complete vs Gap against ISO/IEC 27002:2022.
function agendaReadiness(tags) {
  const annexIds = [], clauseIds = [];
  (tags || []).forEach(raw => {
    let t = raw.trim();
    if (t.startsWith('A.')) {
      t = t.replace(/A\./g, '');
      const r = t.match(/^(\d+)\.(\d+)\s*[–-]\s*(\d+)\.(\d+)$/);
      if (r) { for (let n = +r[2]; n <= +r[4]; n++) annexIds.push(r[1] + '.' + n); }
      else if (/^\d+\.\d+$/.test(t)) annexIds.push(t);
    } else if (/^\d+\.\d+$/.test(t)) {
      clauseIds.push(t);
    } else if (/^\d+$/.test(t)) {
      ISMS_CLAUSES.filter(g => g.clause === t).forEach(g => g.items.forEach(it => clauseIds.push(it.id)));
    }
  });
  const aStat = {}; CONTROLS.forEach(c => aStat[c.id] = c.status);
  const cStat = {}; ISMS_CLAUSES.forEach(g => g.items.forEach(it => cStat[it.id] = it.status));
  const ok = [], gaps = [], na = [];
  annexIds.forEach(id => { const s = aStat[id]; if (s === 'ok') ok.push('A.' + id); else if (s === 'na') na.push('A.' + id); else if (s) gaps.push('A.' + id); });
  clauseIds.forEach(id => { const s = cStat[id]; if (s === 'ok') ok.push(id); else if (s === 'na') na.push(id); else if (s) gaps.push(id); });
  return { ok, gaps, na };
}

// Ordered control/clause items behind an agenda block's tags (for the evidence drill-down).
function agendaItems(tags) {
  const items = [];
  (tags || []).forEach(raw => {
    let t = raw.trim();
    if (t.startsWith('A.')) {
      t = t.replace(/A\./g, '');
      const r = t.match(/^(\d+)\.(\d+)\s*[–-]\s*(\d+)\.(\d+)$/);
      if (r) { for (let n = +r[2]; n <= +r[4]; n++) items.push({ id: r[1] + '.' + n, annex: true }); }
      else if (/^\d+\.\d+$/.test(t)) items.push({ id: t, annex: true });
    } else if (/^\d+\.\d+$/.test(t)) items.push({ id: t, annex: false });
    else if (/^\d+$/.test(t)) ISMS_CLAUSES.filter(g => g.clause === t).forEach(g => g.items.forEach(it => items.push({ id: it.id, annex: false })));
  });
  return items;
}

function clauseItemById(id) {
  for (const g of ISMS_CLAUSES) { const it = g.items.find(x => x.id === id); if (it) return it; }
  return null;
}

function AgEvidenceLink({ label, sub, href, icon }) {
  const [h, setH] = useAudState(false);
  const ok = href && href !== '#';
  return (
    <a href={href || '#'} target={ok ? '_blank' : undefined} rel={ok ? 'noopener noreferrer' : undefined}
      onClick={ok ? undefined : e => e.preventDefault()}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:'flex', alignItems:'center', gap: 9, padding:'7px 10px', borderRadius: 7,
        background: h ? 'rgba(107,47,160,0.06)' : '#fff',
        border:'1px solid ' + (h ? 'rgba(107,47,160,0.25)' : '#EEF0F3'),
        textDecoration:'none', transition:'all 120ms',
      }}>
      <span style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0, background:'rgba(107,47,160,0.08)',
        display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
        <Icon name={icon || 'file-text'} size={12} color="#6B2FA0"/>
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display:'block', fontSize: 12, color:'#111827', fontWeight: 500 }}>{label}</span>
        {sub && <span style={{ display:'block', fontSize: 10.5, color:'#6B7280' }}>{sub}</span>}
      </span>
      {ok && <Icon name="arrow-up-right" size={13} color={h ? '#6B2FA0' : '#9CA3AF'}/>}
    </a>
  );
}

function AgGuidance({ text }) {
  if (!text) return null;
  return (
    <div style={{ marginTop: 6, padding:'6px 9px', borderRadius: 6,
      background:'rgba(107,47,160,0.05)', border:'1px solid rgba(107,47,160,0.12)',
      fontSize: 11, color:'#4A1F70', lineHeight: 1.5 }}>
      <Icon name="book-open" size={10} color="#6B2FA0" style={{ marginRight: 5, verticalAlign:'middle' }}/>
      <strong style={{ fontWeight: 600 }}>ISO guidance:</strong> {text}
    </div>
  );
}

function AgItemEvidence({ it, showGuidance, hidePolicyForNums }) {
  const [open, setOpen] = useAudState(false);
  let idLabel, idColor, idBg, name, meta, sc, body = null;

  if (it.annex) {
    const c = CONTROLS.find(x => x.id === it.id);
    sc = STATUS_COLOR[c ? c.status : 'ok'];
    const ev = (typeof CTRL_EVIDENCE !== 'undefined' && CTRL_EVIDENCE[it.id]) || [];
    const links = (typeof CTRL_LINKED !== 'undefined' && CTRL_LINKED[it.id]) || [];
    const guide = (typeof ISO_CONTROL_HELP !== 'undefined' && ISO_CONTROL_HELP[it.id]) || '';
    const polNum = (typeof CTRL_POLICY !== 'undefined' && CTRL_POLICY[it.id]) || null;
    const suppressPolicy = polNum && hidePolicyForNums && hidePolicyForNums.includes(polNum);
    idLabel = 'A.' + it.id; idColor = '#6B2FA0'; idBg = 'rgba(107,47,160,0.08)';
    name = c ? c.name : it.id; meta = c ? c.owner + ' · ' + c.last : '';
    body = (
      <>
        {showGuidance && <AgGuidance text={guide}/>}
        {!suppressPolicy && typeof PolicyCard !== 'undefined' && <div style={{ marginTop: 7 }}><PolicyCard ctrlId={it.id}/></div>}
        {ev.length > 0 && (
          <ul style={{ margin:'6px 0 0', paddingLeft: 18, fontSize: 12, color:'#374151', lineHeight: 1.5 }}>
            {ev.map((e, i) => (
              <li key={i}>
                {typeof e === 'string' ? e : (
                  <a href={e.url} target="_blank" rel="noopener noreferrer" style={{ color:'#6B2FA0' }}>
                    {e.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
        {links.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap: 5, marginTop: 7, maxWidth: 560 }}>
            {links.map((l, i) => <AgEvidenceLink key={i} label={l.label} sub={l.sub} href={l.href} icon={l.icon}/>)}
          </div>
        )}
        {ev.length === 0 && links.length === 0 && (typeof CTRL_POLICY === 'undefined' || !CTRL_POLICY[it.id]) && (
          <div style={{ fontSize: 11.5, color:'#9CA3AF', marginTop: 4 }}>No evidence pointers recorded yet.</div>
        )}
      </>
    );
  } else {
    const item = clauseItemById(it.id);
    if (!item) return null;
    sc = STATUS_COLOR[item.status];
    idLabel = 'Cl ' + it.id; idColor = '#3B1A6B'; idBg = 'rgba(59,26,107,0.08)';
    name = item.title; meta = '';
    body = (
      <>
        {showGuidance && typeof ISO_CLAUSE_HELP !== 'undefined' && <AgGuidance text={ISO_CLAUSE_HELP[it.id]}/>}
        {item.note && <div style={{ fontSize: 12, color:'#374151', lineHeight: 1.5, marginTop: 5 }}>{item.note}</div>}
        {item.links && item.links.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap: 5, marginTop: 7, maxWidth: 560 }}>
            {item.links.map((l, i) => <AgEvidenceLink key={i} label={l.label} href={l.url} icon={LINK_ICON[l.type]}/>)}
          </div>
        )}
      </>
    );
  }

  return (
    <div style={{ borderTop:'1px solid #F3F4F6' }}>
      <div onClick={()=>setOpen(o=>!o)}
        style={{ display:'flex', alignItems:'center', gap: 8, flexWrap:'wrap', padding:'9px 0', cursor:'pointer' }}>
        <Icon name="chevron-down" size={13} color="#9CA3AF" style={{ transform: open ? 'rotate(180deg)' : 'none', transition:'transform 150ms', flexShrink: 0 }}/>
        <span style={{ fontFamily:'ui-monospace, monospace', fontSize: 11.5, fontWeight: 700, color: idColor, background: idBg, padding:'1px 7px', borderRadius: 4 }}>{idLabel}</span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color:'#111827' }}>{name}</span>
        <span style={{ fontSize: 10, fontWeight: 600, color: sc.fg, background: sc.soft, padding:'1px 7px', borderRadius: 9999 }}>{sc.label}</span>
        {meta && <span style={{ fontSize: 10.5, color:'#9CA3AF' }}>{meta}</span>}
      </div>
      {open && <div style={{ padding:'0 0 10px 21px' }}>{body}</div>}
    </div>
  );
}

function AgendaBlock({ b, first, showGuidance }) {
  const [open, setOpen] = useAudState(false);
  const r = agendaReadiness(b.tags);
  const items = agendaItems(b.tags);
  const hasItems = items.length > 0;
  const hasReadiness = r.ok.length || r.gaps.length || r.na.length;
  // Worst status across the block's items → single Compliant / At risk / Gap pill (like ISMS Core).
  const _stats = items.map(it => {
    if (it.annex) { const c = CONTROLS.find(x => x.id === it.id); return c ? c.status : 'ok'; }
    const ci = clauseItemById(it.id); return ci ? ci.status : 'ok';
  });
  const worst = _stats.includes('red') ? 'red' : _stats.includes('amber') ? 'amber' : (_stats.length && _stats.every(s => s === 'na')) ? 'na' : 'ok';
  const wsc = STATUS_COLOR[worst];
  return (
    <div style={{ borderTop: first ? 'none' : '1px solid #F3F4F6' }}>
      <div onClick={()=> hasItems && setOpen(o=>!o)}
        style={{ display:'flex', gap: 14, padding:'10px 16px', cursor: hasItems ? 'pointer' : 'default', background: open ? '#FAFAFC' : 'transparent' }}
        onMouseEnter={e=>{ if (hasItems && !open) e.currentTarget.style.background='#FAFAFC'; }}
        onMouseLeave={e=>{ if (!open) e.currentTarget.style.background='transparent'; }}>
        <div style={{ flexShrink: 0, width: 92, fontSize: 11.5, fontWeight: 600, color:'#6B2FA0', fontFamily:'ui-monospace, SFMono-Regular, monospace', paddingTop: 1 }}>{b.time}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color:'#111827', display:'flex', alignItems:'center', gap: 6 }}>
            {b.title}
            {hasItems && <Icon name="chevron-down" size={14} color="#9CA3AF" style={{ transform: open ? 'rotate(180deg)' : 'none', transition:'transform 150ms' }}/>}
            {hasItems && <span style={{ marginLeft:'auto', fontSize: 10.5, fontWeight: 600, color: wsc.fg, background: wsc.soft, padding:'2px 9px', borderRadius: 9999 }}>{wsc.label}</span>}
          </div>
          <div style={{ fontSize: 12, color:'#6B7280', lineHeight: 1.45, marginTop: 2 }}>{b.detail}</div>
          {b.tags && b.tags.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap: 5, marginTop: 7 }}>
              {b.tags.map((t, ti) => (
                <span key={ti} style={{ padding:'2px 8px', borderRadius: 5, fontSize: 10.5, fontWeight: 600, background:'rgba(107,47,160,0.07)', color:'#6B2FA0', fontFamily:'ui-monospace, SFMono-Regular, monospace' }}>{t}</span>
              ))}
            </div>
          )}
          {hasReadiness && (
            <div style={{ marginTop: 7, fontSize: 11, display:'flex', flexWrap:'wrap', gap: 10, alignItems:'center' }}>
              {r.gaps.length === 0 ? (
                <span style={{ color:'#047857', fontWeight: 600, display:'inline-flex', alignItems:'center', gap: 4 }}>
                  <Icon name="check-circle-2" size={12}/> Complete · {r.ok.length} item{r.ok.length===1?'':'s'} compliant{r.na.length ? ` (${r.na.length} N/A)` : ''}
                </span>
              ) : (
                <>
                  <span style={{ color:'#047857', display:'inline-flex', alignItems:'center', gap: 4 }}>
                    <Icon name="check-circle-2" size={12}/> {r.ok.length} complete
                  </span>
                  <span style={{ color:'#B45309', fontWeight: 600, display:'inline-flex', alignItems:'center', gap: 4 }}>
                    <Icon name="alert-triangle" size={12}/> {r.gaps.length} gap: {r.gaps.join(', ')}
                  </span>
                </>
              )}
              {hasItems && <span style={{ color:'#9CA3AF' }}>· click to {open ? 'hide' : 'show'} evidence</span>}
            </div>
          )}
        </div>
      </div>
      {open && hasItems && (
        <div style={{ padding:'2px 16px 12px 108px', background:'#FAFAFC' }}>
          {b.common && b.common.length > 0 && (() => {
            const strs = b.common.filter(e => typeof e === 'string');
            const lnks = b.common.filter(e => typeof e !== 'string');
            return (
              <div style={{ marginBottom: 10, padding:'10px 12px', borderRadius: 8, background:'#fff', border:'1px solid rgba(107,47,160,0.18)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color:'#6B2FA0', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom: 6 }}>
                  Common evidence — applies to all items in this slot
                </div>
                {b.commonPolicyNums && b.commonPolicyNums.length > 0 && typeof PolicyCardByNum !== 'undefined' && (
                  <div style={{ marginBottom: 8 }}>
                    {b.commonPolicyNums.map(n => <PolicyCardByNum key={n} num={n}/>)}
                  </div>
                )}
                {strs.length > 0 && (
                  <ul style={{ margin:'0 0 8px', paddingLeft: 18, fontSize: 12.5, color:'#374151', lineHeight: 1.55 }}>
                    {strs.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                )}
                {lnks.length > 0 && (
                  <div style={{ display:'flex', flexDirection:'column', gap: 5, maxWidth: 560 }}>
                    {lnks.map((e, i) => (
                      <AgEvidenceLink key={i}
                        label={e.label}
                        href={e.url}
                        icon={LINK_ICON.doc}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
          {items.map((it, i) => <AgItemEvidence key={i} it={it} showGuidance={showGuidance} hidePolicyForNums={b.commonPolicyNums}/>)}
        </div>
      )}
    </div>
  );
}

function AuditAgenda({ showGuidance }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 18, marginBottom: 28 }}>
      {AUDIT_AGENDA.map((d, di) => (
        <div key={di} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius: 10, overflow:'hidden' }}>
          <div style={{ padding:'11px 16px', background:'#FAF7FD', borderBottom:'1px solid #EEE' }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color:'#3B1A6B' }}>{d.day}</div>
            <div style={{ fontSize: 11, color:'#6B7280', marginTop: 2 }}>{d.site}</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column' }}>
            {d.blocks.map((b, bi) => <AgendaBlock key={bi} b={b} first={bi === 0} showGuidance={showGuidance}/>)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Report sub-views (Management Review / Internal Audit / Penetration Test) ──
function ReportShell({ title, badge, meta, links, children }) {
  return (
    <Card padding={0}>
      <div style={{ padding:'16px 20px', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap: 12, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <h2 style={{ margin:0, fontSize:16, fontWeight:600, color:'#111827' }}>{title}</h2>
            {badge && <span style={{ padding:'2px 9px', borderRadius:9999, background:'rgba(107,47,160,0.08)', color:'#6B2FA0', fontSize:11, fontWeight:600 }}>{badge}</span>}
          </div>
          <div style={{ display:'flex', gap: 6, flexWrap:'wrap' }}>
            {(links||[]).map((l,i) => (
              <a key={i} href={l.href} target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, fontWeight:500, color:'#6B2FA0', textDecoration:'none', border:'1px solid rgba(107,47,160,0.25)', borderRadius:7, padding:'5px 10px' }}>
                <Icon name={l.icon || 'external-link'} size={12}/> {l.label}
              </a>
            ))}
          </div>
        </div>
        {meta && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:'4px 18px', marginTop:10 }}>
            {meta.map((m,i) => <span key={i} style={{ fontSize:11.5, color:'#6B7280' }}><span style={{ color:'#9CA3AF' }}>{m.label}:</span> <strong style={{ fontWeight:600, color:'#374151' }}>{m.value}</strong></span>)}
          </div>
        )}
      </div>
      <div style={{ padding:'16px 20px' }}>{children}</div>
    </Card>
  );
}

function RVBlock({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize:10.5, color:'#9CA3AF', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 }}>{title}</div>
      {children}
    </div>
  );
}
function RVList({ items, color }) {
  return <ul style={{ margin:0, paddingLeft:18, fontSize:12.5, color: color||'#374151', lineHeight:1.55, display:'flex', flexDirection:'column', gap:3 }}>{items.map((t,i)=><li key={i}>{t}</li>)}</ul>;
}

function ManagementReviewView() {
  return (
    <ReportShell title="Management Review 2026" badge="ISO 27001 · Clause 9.3"
      meta={[{label:'Date',value:'12 Apr 2026'},{label:'Author',value:'J. Miller (AuditPartners)'},{label:'Period',value:'05/2024–03/2026'},{label:'Participants',value:'Jordan (COO); Alex (CISO)'}]}
      links={[{href:'#', label:'Open source file (xlsx)', icon:'table-2'},{href:'#', label:'Knowledge Hub'}]}>
      <RVBlock title="Key inputs reviewed">
        <RVList items={[
          'Previous actions: Elastic now in production; policy review/simplification still critical at the 19 Mar audit; no new external resources added.',
          'Changes: headcount cut (research/marketing/sales) — IT core intact; new front-end dev (Mar 2026); EU AI Act (Aug 2026 deadline) → dedicated AI Policy; standardised DPAs cut due-diligence to days.',
          'Performance: no recurring incidents; "Incident/Change/Corrective Action" workflows merged (needs separation); Elastic full production; four practical KPIs adopted.',
          'Audit results: auditor concluded Acme is ready for the June 2026 audit, with a warning to invest in automation to avoid headcount growth for routine ISMS ops.',
          'Risk: methodology stable; phishing top threat (Teams reporting); new risk — "insufficient roles & responsibilities" likelihood raised to almost-certain after the headcount cut (impact rated very low — IT core intact).',
          'Improvement: delayed-deletion process still open (concept exists, binding IT deadline pending).',
        ]}/>
      </RVBlock>
      <RVBlock title="Decisions / outputs">
        <RVList items={[
          'Continue improving the ISMS through simplification, automation, clearer process separation, and stronger monitoring/review.',
          'ISMS requires updates to governance, documented information, role allocation, and operational control design to stay effective under current conditions.',
        ]}/>
      </RVBlock>
      <RVBlock title="Overall statement">
        <div style={{ fontSize:12.5, color:'#374151', lineHeight:1.55, background:'#FAFAFC', border:'1px solid #EEE', borderRadius:8, padding:'10px 12px' }}>
          Top management concluded the ISMS remains <strong>suitable, adequate and effective in principle</strong>, but its current effectiveness is constrained by significant organisational change (reduced personnel). The design still contains elements built for a larger organisation and needs adaptation — so it is <strong>fit for purpose but requires targeted changes and continued improvement</strong>, especially around manual controls, legacy role concepts, documentation quality and process separation.
        </div>
      </RVBlock>
    </ReportShell>
  );
}

function InternalAuditView() {
  const areas = [
    { a:'Context of the organisation & scope', f:['Scope unchanged (B2B SaaS analytics); significant headcount reduction made some roles/groups obsolete; EU AI Act now key external factor; mandatory docs migrated to the central documentation platform.'], o:['Policies still reference groups that no longer exist (e.g. "Leadership Group"); reassign supplier responsibilities; risk register should reflect "insufficient roles" likelihood = almost-certain; AI policy should explicitly address GDPR for client data; sign high-risk assessments (Clause 5.4).'] },
    { a:'Corrective-action effectiveness', f:['New ticketing workflows for Change Mgmt, Privileged Access and Corrective Actions; no formal distinction between Incident / Change / Corrective Action; few 2025 improvements completed yet.'], o:['Define triggers and separate the three workflows; prioritise finishing high-priority 2025 items (e.g. logging).'] },
    { a:'Logging & monitoring', f:['Elastic now in production across endpoints; coverage being completed.'], o:['Complete endpoint coverage, RBAC and a formal review schedule (OFI-019).'] },
    { a:'Secure development lifecycle', f:['Automated release workflows + mandatory secret detection in build pipelines — strong technical control.'], o:['Continue automating to compensate for reduced manual four-eyes capacity.'] },
    { a:'Change management', f:['Change register in the tracker (CR-NNN); risk treatment routed through it.'], o:['Document what constitutes a Change vs Improvement vs Non-conformity.'] },
    { a:'Backup & recovery assurance', f:['Daily production backups to an external system; DR procedure documented and largely automated (Ansible); laptop cloud-backup still being finalised; no Elastic alert on backup failure/size yet.'], o:['Configure Elastic alerts for backup completion/anomalies; add real board approval dates/signatures to the backup policy.'] },
    { a:'Access & workforce controls', f:['Employee Handbook is the "bible"; personal laptops prohibited; Jamf MDM (non-premium — users can still remove AV, but logged); no mandatory VPN/home-network monitoring; privileged-access ticketing introduced; incident — a legacy CRM role granted super-admin to several staff (least-privilege violation).'], o:['Immediate review of CRM super-admin rights; finalise a mandatory-VPN evaluation.'] },
    { a:'Procurement / supplier management', f:['Outsourcing Policy still in review; approved rule-lists govern external access; external contractor onboarded with least-privilege access (tracker + repos only, no file share) pending managed laptop.'], o:['Finalise the Outsourcing Policy; move to a documented vendor security assessment; add secure-design/coding/test + right-to-audit clauses to supplier contracts.'] },
    { a:'KPI review', f:['Four practical KPIs in place (Policy Availability, Incident Mgmt, Device Protection, ISMS Operational Compliance); some still breaching (SLA, endpoint coverage).'], o:['Define review frequency/responsibility/format and act on breaches.'] },
  ];
  return (
    <ReportShell title="Internal Audit Report" badge="ISO 27001 · Clause 9.2 · 19 Mar 2026"
      meta={[{label:'Auditor',value:'J. Miller'},{label:'Auditees',value:'Alex (CISO); Sam (CTO)'},{label:'Scope',value:'B2B SaaS analytics'}]}
      links={[{href:'#', label:'Open report (PDF)', icon:'file-text'},{href:'#', label:'File share'}]}>
      <div style={{ fontSize:12.5, color:'#4A1F70', lineHeight:1.55, background:'rgba(107,47,160,0.06)', border:'1px solid rgba(107,47,160,0.18)', borderRadius:8, padding:'10px 12px', marginBottom:16 }}>
        <strong style={{ fontWeight:600 }}>Verdict:</strong> Strong technological base, but the organisational ISMS is under personnel pressure. Acme is <strong>only partially ready</strong> for the June 2026 surveillance audit — close segregation-of-duties gaps (A.5.3) via technical compensation and update critical policies (A.5.1) by May 2026; shift from manual control toward automated governance.
      </div>
      {areas.map((x,i) => (
        <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i===areas.length-1?'none':'1px solid #F3F4F6' }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#111827', marginBottom:6 }}>{i+1}. {x.a}</div>
          <div style={{ fontSize:10.5, color:'#9CA3AF', fontWeight:600, marginBottom:3 }}>FINDINGS</div>
          <RVList items={x.f}/>
          <div style={{ fontSize:10.5, color:'#B45309', fontWeight:600, margin:'6px 0 3px' }}>OPPORTUNITIES FOR IMPROVEMENT</div>
          <RVList items={x.o} color="#7c4a12"/>
        </div>
      ))}
    </ReportShell>
  );
}

function PentestView() {
  const findings = [
    { id:'5.1.1', name:'Email HTML Injection', risk:'Medium', cvss:'5.3', desc:'During registration via an invitation link, the First Name field is embedded into outbound emails without sanitisation — an attacker can inject HTML to craft a convincing phishing email that appears to come from Acme.' },
    { id:'5.2.1', name:'Missing HTTP Security Headers', risk:'Info', cvss:'N/A', desc:'Several recommended HTTP security headers are absent. No immediate threat, but they are part of a standard defensive baseline; adding them is low-effort with meaningful benefit.' },
  ];
  const rc = { Medium:{bg:'#FFFBEB',fg:'#B45309'}, Info:{bg:'#EFF6FF',fg:'#1D4ED8'} };
  return (
    <ReportShell title="Penetration Test — Web Application" badge="Low risk · Apr 2026"
      meta={[{label:'Provider',value:'External security testing firm'},{label:'Report',value:'v1.0 · 03 Apr 2026'},{label:'Scope',value:'*.staging.acme.example'},{label:'Testing',value:'23–27 Mar 2026 (5 days)'}]}
      links={[{href:'#', label:'Open report (PDF)', icon:'file-text'},{href:'#', label:'File share'}]}>
      <div style={{ fontSize:12.5, color:'#065F46', lineHeight:1.55, background:'#ECFDF5', border:'1px solid #A7F3D0', borderRadius:8, padding:'10px 12px', marginBottom:16 }}>
        <strong style={{ fontWeight:600 }}>Result:</strong> The application is exposed to a <strong>low risk of compromise</strong>. A small number of low-severity findings, none indicating a fundamental weakness. Tested against PTES, OSSTMM, MITRE ATT&CK and OWASP. Provider recommends an annual pentest.
      </div>
      <RVBlock title="Findings (1 Medium, 1 Info)">
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {findings.map((f,i) => (
            <div key={i} style={{ border:'1px solid #E5E7EB', borderRadius:8, padding:'10px 12px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                <span style={{ fontFamily:'ui-monospace, monospace', fontSize:11.5, fontWeight:700, color:'#6B2FA0' }}>{f.id}</span>
                <span style={{ fontSize:13, fontWeight:600, color:'#111827' }}>{f.name}</span>
                <span style={{ fontSize:10.5, fontWeight:600, color:rc[f.risk].fg, background:rc[f.risk].bg, padding:'1px 8px', borderRadius:9999 }}>{f.risk}</span>
                <span style={{ fontSize:10.5, color:'#9CA3AF' }}>CVSS {f.cvss}</span>
              </div>
              <div style={{ fontSize:12, color:'#374151', lineHeight:1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </RVBlock>
    </ReportShell>
  );
}

function AuditsPage({ onOpenDrawer }) {
  const [view, setView] = useAudState('overview');
  const [filterStatus, setFilterStatus] = useAudState('all');
  const [filterSource, setFilterSource] = useAudState('all');
  const [showGuidance, setShowGuidance] = useAudState(true);

  const sources = ['all', ...Array.from(new Set(OFIS.map(o => o.source)))];

  const ofiRows = OFIS.filter(o =>
    (filterStatus === 'all' || o.status === filterStatus) &&
    (filterSource === 'all' || o.source === filterSource)
  );

  // Status roll-up for the header chip.
  const tally = OFIS.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const TABS = [
    { k:'overview', label:'Overview' },
    { k:'mr',       label:'Management Review' },
    { k:'audit',    label:'Internal Audit' },
    { k:'pentest',  label:'Penetration Testing' },
  ];

  return (
    <div style={{ padding: '16px 24px 40px' }}>
      {/* Sub-section tabs */}
      <div style={{ display:'flex', gap: 4, borderBottom:'1px solid #E5E7EB', marginBottom: 18 }}>
        {TABS.map(t => {
          const active = t.k === view;
          return (
            <button key={t.k} onClick={()=>setView(t.k)} style={{
              padding:'9px 14px', border:'none', background:'transparent',
              fontFamily:'Poppins, sans-serif', fontSize: 13, fontWeight: active?600:500,
              color: active ? '#6B2FA0' : '#6B7280',
              borderBottom: `2px solid ${active ? '#6B2FA0' : 'transparent'}`,
              marginBottom: -1, cursor:'pointer', transition:'all 120ms',
            }}>{t.label}</button>
          );
        })}
      </div>

      {view === 'overview' && (<>
      {/* Audit reports — card row */}
      <SectionTitle>Audit Reports</SectionTitle>
      <div style={{ fontSize: 11.5, color:'#6B7280', marginTop: 2, marginBottom: 12 }}>
        {AUDIT_REPORTS.length} report(s) · click for detail
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap: 12, marginBottom: 28 }}>
        {AUDIT_REPORTS.map(a => (
          <button key={a.id} onClick={()=>onOpenDrawer({ type:'audit', data: a })}
            style={{
              textAlign:'left', padding: 16, borderRadius: 10,
              background:'#fff', border:'1px solid #E5E7EB',
              cursor:'pointer', fontFamily:'Poppins, sans-serif',
              transition:'all 150ms',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(107,47,160,0.35)'; e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.06)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='#E5E7EB'; e.currentTarget.style.boxShadow='none'; }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 8 }}>
              <span style={{
                padding:'3px 9px', borderRadius: 5, background:'#F3F4F6',
                fontSize: 11, fontWeight: 600, color:'#374151',
                fontFamily:'ui-monospace, SFMono-Regular, monospace',
              }}>{a.id}</span>
              <span style={{
                padding:'2px 9px', borderRadius: 9999,
                background:'#FFFBEB', color:'#B45309',
                fontSize: 11, fontWeight: 600,
              }}>{a.state}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color:'#111827', marginBottom: 4 }}>
              {a.auditor} · {a.date}
            </div>
            <div style={{ fontSize: 12.5, color:'#6B7280', lineHeight: 1.45, marginBottom: 10 }}>
              {a.scope}
            </div>
            <div style={{ display:'flex', gap: 14, fontSize: 11.5, color:'#4B5563' }}>
              <span><strong style={{ color:'#111827' }}>{a.ofisRaised}</strong> OFIs raised</span>
              <span><strong style={{ color:'#111827' }}>{a.crsRaised}</strong> CR raised</span>
            </div>
          </button>
        ))}
      </div>

      {/* Upcoming audit agenda */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap: 12 }}>
        <SectionTitle>Upcoming Audit · CertCo Re-certification</SectionTitle>
        <div onClick={()=>setShowGuidance(v=>!v)}
          style={{ display:'inline-flex', alignItems:'center', gap: 8, cursor:'pointer', userSelect:'none' }}>
          <span style={{ fontSize: 11.5, color:'#4B5563', fontWeight: 500, display:'inline-flex', alignItems:'center', gap: 5 }}>
            <Icon name="book-open" size={13} color="#6B2FA0"/> ISO guidance
          </span>
          <span style={{ width: 34, height: 18, borderRadius: 9999, position:'relative', transition:'background 150ms',
            background: showGuidance ? '#6B2FA0' : '#D1D5DB' }}>
            <span style={{ position:'absolute', top: 2, left: showGuidance ? 18 : 2, width: 14, height: 14,
              borderRadius:'50%', background:'#fff', transition:'left 150ms' }}/>
          </span>
        </div>
      </div>
      <div style={{ fontSize: 11.5, color:'#6B7280', marginTop: 2, marginBottom: 12 }}>
        16–17 Jun 2026 · HQ site · agenda by clause / Annex A control · expand a block for evidence
      </div>
      <AuditAgenda showGuidance={showGuidance}/>

      {/* OFI Register */}
      <SectionTitle>OFI Register</SectionTitle>
      <div style={{ fontSize: 11.5, color:'#6B7280', marginTop: 2, marginBottom: 12 }}>
        {OFIS.length} OFIs · {tally['Open']||0} open · {tally['In progress']||0} in progress · {tally['Complete']||0} complete
      </div>

      <div style={{ display:'flex', gap: 16, marginBottom: 14, flexWrap:'wrap' }}>
        <AudFilterGroup label="Status" value={filterStatus} onChange={setFilterStatus}
          options={['all','Open','In progress','Complete']}/>
        <AudFilterGroup label="Source" value={filterSource} onChange={setFilterSource}
          options={sources}/>
      </div>

      <Card padding={0}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background:'#FAFAFC' }}>
                <th style={audThStyle}>ID</th>
                <th style={audThStyle}>TITLE</th>
                <th style={audThStyle}>STATUS</th>
                <th style={audThStyle}>SOURCE</th>
                <th style={audThStyle}>DUE</th>
              </tr>
            </thead>
            <tbody>
              {ofiRows.map((o, idx) => {
                const sc = OFI_STATUS_COLOR[o.status] || OFI_STATUS_COLOR['Open'];
                return (
                  <tr key={o.id}
                      onClick={()=>onOpenDrawer({ type:'ofi', data: o })}
                      style={{
                        cursor:'pointer',
                        borderTop: idx === 0 ? 'none' : '1px solid #F3F4F6',
                        transition:'background 120ms',
                      }}
                      onMouseEnter={e=>e.currentTarget.style.background='#FAFAFC'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={audTdStyle}>
                      <span style={{
                        display:'inline-block', padding:'2px 8px',
                        borderRadius: 4, background:'#F3F4F6',
                        fontSize: 11, fontWeight: 600, color:'#374151',
                        fontFamily:'ui-monospace, SFMono-Regular, monospace',
                      }}>{o.id}</span>
                    </td>
                    <td style={{ ...audTdStyle, color:'#111827', maxWidth: 520 }}>{o.title}</td>
                    <td style={audTdStyle}>
                      <span style={{
                        display:'inline-flex', alignItems:'center', gap: 5,
                        padding:'2px 9px', borderRadius: 9999,
                        background: sc.bg, color: sc.fg,
                        fontSize: 11, fontWeight: 600,
                      }}>
                        <span style={{ width:6, height:6, borderRadius:'50%', background: sc.dot }}/>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ ...audTdStyle, color:'#6B7280', fontSize: 12 }}>{o.source}</td>
                    <td style={{ ...audTdStyle, color:'#6B7280', fontSize: 12 }}>{o.due || '—'}</td>
                  </tr>
                );
              })}
              {ofiRows.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 40, textAlign:'center', color:'#9CA3AF', fontSize: 13 }}>
                  No OFIs match the current filters.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      </>)}

      {view === 'mr' && <ManagementReviewView/>}
      {view === 'audit' && <InternalAuditView/>}
      {view === 'pentest' && <PentestView/>}
    </div>
  );
}

const audThStyle = {
  textAlign:'left', padding:'10px 16px', fontSize: 10.5,
  fontWeight: 600, color:'#6B7280', letterSpacing:'0.06em',
  textTransform:'uppercase', borderBottom:'1px solid #E5E7EB',
};
const audTdStyle = { padding:'12px 16px', verticalAlign:'middle' };

function AudFilterGroup({ label, value, onChange, options }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
      <span style={{ fontSize: 11, color:'#9CA3AF', fontWeight: 500, textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}:</span>
      <div style={{ display:'flex', gap: 4 }}>
        {options.map(o => (
          <button key={o} onClick={()=>onChange(o)}
            style={{
              padding:'4px 10px', borderRadius: 6,
              border: '1px solid ' + (value === o ? 'rgba(107,47,160,0.35)' : '#E5E7EB'),
              background: value === o ? 'rgba(107,47,160,0.08)' : '#fff',
              color: value === o ? '#4A1F70' : '#6B7280',
              fontSize: 11.5, fontWeight: 500, cursor:'pointer',
              fontFamily:'Poppins, sans-serif',
            }}>
            {o === 'all' ? 'All' : o}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Drawers ───────────────────────────────────────────────────────────────

function OFIDrawer({ ofi: o, onClose }) {
  const sc = OFI_STATUS_COLOR[o.status] || OFI_STATUS_COLOR['Open'];
  return (
    <div style={{
      position:'absolute', inset: 0, background:'rgba(17,24,39,0.35)',
      display:'flex', justifyContent:'flex-end', zIndex: 40,
    }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()}
        style={{
          width: 480, background:'#fff', height:'100%',
          boxShadow:'-12px 0 24px rgba(0,0,0,0.12)',
          display:'flex', flexDirection:'column',
          animation: 'slideIn 200ms ease-out',
        }}>
        <div style={{ padding:'18px 22px 14px', borderBottom:'1px solid #E5E7EB' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 8 }}>
            <span style={{
              padding:'3px 10px', borderRadius: 6, background:'#F3F4F6',
              fontSize: 11.5, fontWeight: 600, color:'#374151',
              fontFamily:'ui-monospace, SFMono-Regular, monospace',
            }}>{o.id}</span>
            <button onClick={onClose} style={{
              border:'none', background:'transparent', cursor:'pointer',
              padding: 4, color:'#9CA3AF',
            }}><Icon name="x" size={18}/></button>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color:'#111827', lineHeight: 1.35, marginBottom: 10 }}>
            {o.title}
          </div>
          <div style={{ display:'flex', gap: 8, alignItems:'center', flexWrap:'wrap' }}>
            <span style={{
              display:'inline-flex', alignItems:'center', gap: 5,
              padding:'3px 10px', borderRadius: 9999,
              background: sc.bg, color: sc.fg,
              fontSize: 11, fontWeight: 600,
            }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background: sc.dot }}/>
              {o.status}
            </span>
            <span style={{ fontSize: 12, color:'#6B7280' }}>· {o.source}</span>
            {o.due && <span style={{ fontSize: 12, color:'#6B7280' }}>· due {o.due}</span>}
          </div>
        </div>
        <div className="scroll-y" style={{ flex: 1, overflowY:'auto', padding:'18px 22px' }}>
          <DetailSection title="Source">
            <div style={{ fontSize: 13, color:'#374151' }}>{o.source}</div>
          </DetailSection>
          <DetailSection title="Status">
            <div style={{ fontSize: 13, color:'#374151' }}>{o.status}</div>
          </DetailSection>
          {o.due && (
            <DetailSection title="Due">
              <div style={{ fontSize: 13, color:'#374151' }}>{o.due}</div>
            </DetailSection>
          )}
          <DetailSection title="Tracker">
            <a href={o.link} target="_blank" rel="noopener noreferrer"
              style={{
                display:'inline-flex', alignItems:'center', gap: 6,
                padding:'8px 14px', borderRadius: 8,
                background:'linear-gradient(135deg,#6B2FA0,#E91E63)', color:'#fff',
                fontSize: 12.5, fontWeight: 500, textDecoration:'none',
              }}>
              <Icon name="external-link" size={13}/> View in tracker
            </a>
          </DetailSection>
        </div>
      </div>
    </div>
  );
}

function AuditDrawer({ audit: a, onClose }) {
  return (
    <div style={{
      position:'absolute', inset: 0, background:'rgba(17,24,39,0.35)',
      display:'flex', justifyContent:'flex-end', zIndex: 40,
    }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()}
        style={{
          width: 480, background:'#fff', height:'100%',
          boxShadow:'-12px 0 24px rgba(0,0,0,0.12)',
          display:'flex', flexDirection:'column',
          animation: 'slideIn 200ms ease-out',
        }}>
        <div style={{ padding:'18px 22px 14px', borderBottom:'1px solid #E5E7EB' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 8 }}>
            <span style={{
              padding:'3px 10px', borderRadius: 6, background:'#F3F4F6',
              fontSize: 11.5, fontWeight: 600, color:'#374151',
              fontFamily:'ui-monospace, SFMono-Regular, monospace',
            }}>{a.id}</span>
            <button onClick={onClose} style={{
              border:'none', background:'transparent', cursor:'pointer',
              padding: 4, color:'#9CA3AF',
            }}><Icon name="x" size={18}/></button>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color:'#111827', lineHeight: 1.35, marginBottom: 4 }}>
            {a.auditor} · {a.date}
          </div>
          <div style={{ fontSize: 12.5, color:'#6B7280', lineHeight: 1.45 }}>
            {a.scope}
          </div>
        </div>
        <div className="scroll-y" style={{ flex: 1, overflowY:'auto', padding:'18px 22px' }}>
          <DetailSection title="State">
            <div style={{ fontSize: 13, color:'#374151' }}>{a.state}</div>
          </DetailSection>
          <DetailSection title="Outputs">
            <div style={{ display:'flex', gap: 16, fontSize: 13, color:'#374151' }}>
              <span><strong style={{ color:'#111827' }}>{a.ofisRaised}</strong> OFIs raised</span>
              <span><strong style={{ color:'#111827' }}>{a.crsRaised}</strong> CR raised</span>
            </div>
          </DetailSection>
          <DetailSection title="Related OFIs">
            <div style={{ display:'flex', flexWrap:'wrap', gap: 5 }}>
              {a.relatedOFIs.map(id => (
                <span key={id} style={{
                  padding:'2px 8px', borderRadius: 4,
                  background:'#F3F4F6', color:'#374151',
                  fontSize: 11, fontWeight: 600,
                  fontFamily:'ui-monospace, SFMono-Regular, monospace',
                }}>{id}</span>
              ))}
            </div>
          </DetailSection>
          {a.link && (
            <DetailSection title="Report">
              <a href={a.link} target="_blank" rel="noopener noreferrer"
                style={{
                  display:'inline-flex', alignItems:'center', gap: 6,
                  padding:'8px 14px', borderRadius: 8,
                  background:'linear-gradient(135deg,#6B2FA0,#E91E63)', color:'#fff',
                  fontSize: 12.5, fontWeight: 500, textDecoration:'none',
                }}>
                <Icon name="external-link" size={13}/> View audit report
              </a>
            </DetailSection>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AuditsPage, OFIDrawer, AuditDrawer });

registerWidget('page-audits', AuditsPage);
registerWidget('drawer-ofi', OFIDrawer);
registerWidget('drawer-audit', AuditDrawer);
