// Evidence Library — consolidated evidence register (clause 7.5 documented information).
// Aggregates every evidence link across the ISMS at runtime from the existing globals
// (ISMS_CLAUSES, RISK_EVIDENCE, KEY_RISKS, VENDOR_EVIDENCE, POLICY_EVIDENCE,
// POLICY_REGISTER, OFIS, AUDIT_REPORTS) — nothing is copy-pasted; identical URLs
// referenced from multiple areas are deduped into a single row listing all areas.
const { useState: useEvlState, useMemo: useEvlMemo } = React;

// People & Training evidence — mirrors the inline Evidence card on people.jsx
// (that list is hardcoded in the page, so it is mirrored here rather than derived).
const EVL_PEOPLE_EVIDENCE = [
  { label:'Moodle — AI Policy training (LMS)', url:'#', type:'ext' },
  { label:'Policy 20 · InfoSec Awareness and Training v1.0', url:'#doc-policy-20', type:'doc' },
  { label:'Policy 28 · AI Usage v1.1 (training requirements)', url:'#doc-policy-28', type:'doc' },
  { label:'OFI-012 · awareness/training tracking (closed)', url:'#ticket-ofi-012', type:'ticket' },
  { label:'Employee Handbook', url:'#doc-handbook', type:'doc' },
];

const EVL_AREAS = ['All', 'ISMS Core', 'Risks', 'Vendors', 'Policies', 'People & Training', 'Audits'];

const EVL_AREA_META = {
  'ISMS Core':         { icon:'list-checks',     fg:'#6B2FA0', bg:'rgba(107,47,160,0.08)' },
  'Risks':             { icon:'alert-triangle',  fg:'#B91C1C', bg:'#FEF2F2' },
  'Vendors':           { icon:'building-2',      fg:'#1D4ED8', bg:'#EFF6FF' },
  'Policies':          { icon:'file-text',       fg:'#047857', bg:'#ECFDF5' },
  'People & Training': { icon:'users',           fg:'#B45309', bg:'#FFFBEB' },
  'Audits':            { icon:'clipboard-check', fg:'#BE185D', bg:'rgba(233,30,99,0.08)' },
};

const EVL_TYPE_META = {
  doc:    { label:'Internal doc', fg:'#6B2FA0', bg:'rgba(107,47,160,0.08)' },
  ticket: { label:'Tracker task', fg:'#1D4ED8', bg:'#EFF6FF' },
  sheet:  { label:'File share',   fg:'#047857', bg:'#ECFDF5' },
  ext:    { label:'External',     fg:'#B45309', bg:'#FFFBEB' },
};

// Flatten every evidence source into { area, ref, label, url, type } rows,
// then dedupe by URL (first label/type wins; areas + refs accumulate).
function evlBuildRows() {
  const raw = [];
  const push = (area, ref, l) => {
    if (l && l.url) raw.push({ area, ref, label: l.label, url: l.url, type: l.type || 'doc' });
  };

  (window.ISMS_CLAUSES || []).forEach(g =>
    (g.items || []).forEach(it =>
      (it.links || []).forEach(l => push('ISMS Core', 'Cl. ' + it.id, l))));

  (window.RISK_EVIDENCE || []).forEach(l => push('Risks', 'Register', l));
  (window.KEY_RISKS || []).forEach(r =>
    (r.links || []).forEach(l => push('Risks', r.id, l)));

  (window.VENDOR_EVIDENCE || []).forEach(l => push('Vendors', 'A.5.19–5.23', l));

  (window.POLICY_EVIDENCE || []).forEach(l => push('Policies', 'Policy Log', l));
  (window.POLICY_REGISTER || []).forEach(p =>
    push('Policies', 'Policy ' + p.num, { label:`Policy ${p.num} · ${p.name} (${p.ver})`, url: p.url, type:'doc' }));

  EVL_PEOPLE_EVIDENCE.forEach(l => push('People & Training', '7.3 / A.6.3', l));

  (window.OFIS || []).forEach(o =>
    push('Audits', o.id, { label:`${o.id} · ${o.title}`, url: o.link, type:'ticket' }));
  (window.AUDIT_REPORTS || []).forEach(a =>
    push('Audits', a.id, { label:`${a.auditor} — ${a.scope} (${a.date})`, url: a.link, type:'doc' }));

  const byUrl = new Map();
  raw.forEach(r => {
    const e = byUrl.get(r.url);
    if (!e) {
      byUrl.set(r.url, { label: r.label, url: r.url, type: r.type, areas: [r.area], refs: [r.ref] });
    } else {
      if (!e.areas.includes(r.area)) e.areas.push(r.area);
      if (!e.refs.includes(r.ref)) e.refs.push(r.ref);
    }
  });
  return Array.from(byUrl.values());
}

function EVLTile({ icon, label, value, sub, color }) {
  return (
    <Card padding={16}>
      <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:11.5, color:'#6B7280', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.04em' }}>
        <Icon name={icon} size={13} color="#6B2FA0"/> {label}
      </div>
      <div style={{ fontSize:28, fontWeight:600, color, marginTop:8, lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:10.5, color:'#9CA3AF', marginTop:4 }}>{sub}</div>}
    </Card>
  );
}

function EVLRefCell({ refs }) {
  const shown = refs.slice(0, 3);
  const extra = refs.length - shown.length;
  return (
    <span style={{ fontFamily:'ui-monospace, SFMono-Regular, monospace', fontSize:11, color:'#6B7280' }}>
      {shown.join(' · ')}{extra > 0 && <span style={{ color:'#9CA3AF' }}> +{extra}</span>}
    </span>
  );
}

function EvidenceLibraryPage() {
  const [query, setQuery] = useEvlState('');
  const [area, setArea] = useEvlState('All');

  const rows = useEvlMemo(() => evlBuildRows(), []);

  const counts = useEvlMemo(() => {
    const areas = new Set();
    rows.forEach(r => r.areas.forEach(a => areas.add(a)));
    return {
      total: rows.length,
      areas: areas.size,
      docs: rows.filter(r => r.type === 'doc').length,
      external: rows.filter(r => r.type === 'ext' || r.type === 'sheet').length,
      tickets: rows.filter(r => r.type === 'ticket').length,
    };
  }, [rows]);

  const q = query.trim().toLowerCase();
  const visible = rows.filter(r =>
    (area === 'All' || r.areas.includes(area)) &&
    (q === '' || r.label.toLowerCase().includes(q)));

  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:18, maxWidth:1280 }}>
      <div style={{ padding:'12px 16px', borderRadius:10, background:'rgba(107,47,160,0.06)', border:'1px solid rgba(107,47,160,0.18)', fontSize:12.5, color:'#4A1F70', lineHeight:1.5, display:'flex', alignItems:'center', gap:10 }}>
        <Icon name="folder-archive" size={16} color="#6B2FA0"/>
        <span><strong style={{ fontWeight:600 }}>Clause 7.5 · Documented information.</strong> Consolidated evidence register for the re-certification audit (16–17 June 2026) — every evidence link across the ISMS (clauses 4–10, risks, suppliers, policies, training, audits & OFIs) aggregated live from the underlying registers. Links referenced from multiple areas appear once, tagged with each area.</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <EVLTile icon="folder-archive" label="Evidence items"      value={counts.total}    color="#111827" sub="unique links after dedupe"/>
        <EVLTile icon="layout-grid"    label="Areas covered"       value={counts.areas}    color="#111827" sub="ISMS Core · Risks · Vendors · Policies · People · Audits"/>
        <EVLTile icon="file-text"      label="Internal docs"       value={counts.docs}     color="#6B2FA0" sub={`+ ${counts.tickets} tracker tasks / registers`}/>
        <EVLTile icon="external-link"  label="External / file share" value={counts.external} color="#047857" sub="SoA snapshot, registers, Moodle"/>
      </div>

      <Card padding={0}>
        <div style={{ padding:'16px 20px 12px' }}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'#111827' }}>Evidence Register</h2>
          <div style={{ fontSize:11.5, color:'#6B7280', marginTop:2 }}>
            Derived at runtime from the clause, risk, supplier, policy, training and OFI registers — this page holds no separate copy of the data.
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:12, flexWrap:'wrap' }}>
            <div style={{ position:'relative', flex:'0 0 280px' }}>
              <span style={{ position:'absolute', left:9, top:'50%', transform:'translateY(-50%)', display:'inline-flex', pointerEvents:'none' }}>
                <Icon name="search" size={13} color="#9CA3AF"/>
              </span>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search evidence by label…"
                style={{
                  width:'100%', boxSizing:'border-box', padding:'6px 10px 6px 28px',
                  borderRadius:7, border:'1px solid #E5E7EB', outline:'none',
                  fontSize:12, fontFamily:'Poppins, sans-serif', color:'#111827',
                  background:'#fff',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(107,47,160,0.45)'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
            <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
              {EVL_AREAS.map(a => {
                const active = area === a;
                const n = a === 'All' ? rows.length : rows.filter(r => r.areas.includes(a)).length;
                return (
                  <button key={a} onClick={() => setArea(a)}
                    style={{
                      padding:'4px 12px', borderRadius:6,
                      border:'1px solid ' + (active ? 'rgba(107,47,160,0.35)' : '#E5E7EB'),
                      background: active ? 'rgba(107,47,160,0.08)' : '#fff',
                      color: active ? '#4A1F70' : '#6B7280',
                      fontSize:11.5, fontWeight:500, cursor:'pointer',
                      fontFamily:'Poppins, sans-serif',
                    }}>
                    {a} <span style={{ color: active ? '#6B2FA0' : '#9CA3AF', fontSize:10.5 }}>({n})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
            <thead>
              <tr style={{ background:'#FAFAFC' }}>
                {['Area','Reference','Evidence','Type'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'9px 16px', fontSize:10.5, fontWeight:600, color:'#6B7280', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((r, i) => {
                const tm = EVL_TYPE_META[r.type] || EVL_TYPE_META.doc;
                return (
                  <tr key={r.url} style={{ borderTop: i === 0 ? 'none' : '1px solid #F3F4F6' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAFAFC'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding:'9px 16px', whiteSpace:'nowrap' }}>
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                        {r.areas.map(a => {
                          const am = EVL_AREA_META[a] || EVL_AREA_META['ISMS Core'];
                          return (
                            <Pill key={a} color={am.fg} bg={am.bg} size="xs">
                              <Icon name={am.icon} size={10}/> {a}
                            </Pill>
                          );
                        })}
                      </div>
                    </td>
                    <td style={{ padding:'9px 16px', whiteSpace:'nowrap' }}><EVLRefCell refs={r.refs}/></td>
                    <td style={{ padding:'9px 16px', minWidth:260 }}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer"
                        style={{ color:'#111827', fontWeight:500, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#6B2FA0'}
                        onMouseLeave={e => e.currentTarget.style.color = '#111827'}>
                        {r.label} <Icon name="arrow-up-right" size={11} color="#9CA3AF"/>
                      </a>
                    </td>
                    <td style={{ padding:'9px 16px', whiteSpace:'nowrap' }}>
                      <Pill color={tm.fg} bg={tm.bg} size="xs">
                        <Icon name={LINK_ICON[r.type] || 'file-text'} size={10}/> {tm.label}
                      </Pill>
                    </td>
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding:'32px 16px', textAlign:'center', color:'#9CA3AF', fontSize:13 }}>
                    No evidence matches {q ? <span>“{query.trim()}”</span> : 'this filter'}{area !== 'All' && <span> in {area}</span>}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ padding:'10px 16px', fontSize:10.5, color:'#9CA3AF', borderTop:'1px solid #F3F4F6', lineHeight:1.5 }}>
          Showing {visible.length} of {rows.length} evidence items. Sources: ISMS clause register (4–10), Risk Register evidence + key-risk links, supplier evidence (Policy 22/27), Policy Log + all {(window.POLICY_REGISTER || []).length} released policies, awareness/training evidence (Moodle, Policy 20/28), and the OFI register. Identical URLs cited in several places are listed once with every referencing area and reference.
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { EvidenceLibraryPage });

registerWidget('page-evidence', EvidenceLibraryPage);
