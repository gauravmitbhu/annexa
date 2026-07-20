// Overview · Row 3 — open gaps & findings table + owner workload
const { useState: useOvFindState } = React;

function SeverityPill({ sev }) {
  const map = {
    HIGH: { bg:'#FEF2F2', fg:'#B91C1C' },
    MED:  { bg:'#FFFBEB', fg:'#B45309' },
    LOW:  { bg:'#F0FDFA', fg:'#0F766E' },
  };
  const c = map[sev];
  return <Pill color={c.fg} bg={c.bg} size="xs"><strong style={{ fontWeight: 600 }}>{sev}</strong></Pill>;
}

const tdStyle = { padding:'10px 14px', fontSize: 13, color:'#1F2937', verticalAlign:'middle' };

function FindingsTable() {
  const [sortBy, setSortBy] = useOvFindState('sev');
  return (
    <Card padding={0}>
      <div style={{ padding:'16px 20px 12px', display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color:'#111827' }}>Open Gaps & Findings</h2>
          <div style={{ fontSize: 11.5, color:'#6B7280', marginTop: 2 }}>{FINDINGS.length} active · sortable</div>
        </div>
        <Button variant="ghost" size="sm" iconRight="arrow-right"
          onClick={()=> window.dispatchEvent(new CustomEvent('claude:setroute', { detail:{ route:'audits' } }))}>View all</Button>
      </div>
      <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'Poppins, sans-serif' }}>
        <thead>
          <tr style={{ background:'#FAFAFC', borderTop:'1px solid #F3F4F6', borderBottom:'1px solid #E5E7EB' }}>
            {['Control','Issue','Owner','Severity','Target','Source',''].map((h,i) => (
              <th key={i} style={{
                textAlign:'left', padding:'8px 14px', fontSize: 10.5,
                fontWeight: 600, color:'#6B7280', letterSpacing:'0.05em', textTransform:'uppercase',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FINDINGS.map((f,i) => (
            <tr key={f.ctrl} style={{ borderBottom: i === FINDINGS.length-1 ? 'none' : '1px solid #F3F4F6', cursor:'pointer' }}
              onClick={()=> window.dispatchEvent(new CustomEvent('askclaude:item', { detail: {
                label: `A.${f.ctrl} — ${f.issue}`,
                link: f.link,
                prompt: `Tell me about the open finding on A.${f.ctrl}: "${f.issue}" (owner ${f.owner}, ${f.sev}, target ${f.target}). What's the current state and what should we do before the audit?`,
                actions: [
                  { label:'Summarise state',   prompt:`Summarise the current state of control A.${f.ctrl} (${f.issue}) and whether it is audit-ready.` },
                  { label:'Draft remediation', prompt:`Draft a remediation plan for A.${f.ctrl} — ${f.issue} (owner ${f.owner}, target ${f.target}).` },
                  { label:'Find evidence',     prompt:`What evidence do we have for A.${f.ctrl} (${f.issue}), and what would the auditor ask to see?` },
                ],
              }})) }
              onMouseEnter={(e)=>e.currentTarget.style.background='#FAFAFC'}
              onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
              <td style={tdStyle}>
                <span style={{
                  fontFamily:'ui-monospace, SFMono-Regular, monospace',
                  fontSize: 12, fontWeight: 600, color:'#6B2FA0',
                  background:'rgba(107,47,160,0.08)', padding:'2px 7px', borderRadius: 4,
                }}>A.{f.ctrl}</span>
              </td>
              <td style={{ ...tdStyle, color:'#111827', fontWeight: 500 }}>{f.issue}</td>
              <td style={tdStyle}>
                <div style={{ display:'flex', alignItems:'center', gap: 7 }}>
                  <Avatar name={f.owner} size={22}/>
                  <span style={{ fontSize: 12.5, color:'#374151' }}>{f.owner}</span>
                </div>
              </td>
              <td style={tdStyle}><SeverityPill sev={f.sev}/></td>
              <td style={{ ...tdStyle, fontSize: 12.5, color:'#4B5563' }}>{f.target}</td>
              <td style={tdStyle}>
                <span style={{ fontSize: 11.5, color:'#6B7280' }}>{f.source} · <span style={{ fontFamily:'ui-monospace, monospace', color:'#9CA3AF' }}>{f.ref}</span></span>
              </td>
              <td style={{ ...tdStyle, textAlign:'right' }}>
                <a href={f.link || '#'} target="_blank" rel="noopener noreferrer" title="Open ticket"
                  onClick={(e)=>{ e.stopPropagation(); if (!f.link) e.preventDefault(); }}
                  style={{
                    display:'inline-flex', border:'none', background:'transparent', cursor:'pointer',
                    padding: 4, borderRadius: 4, color:'#9CA3AF',
                  }} onMouseEnter={(e)=>e.currentTarget.style.color='#6B2FA0'}
                  onMouseLeave={(e)=>e.currentTarget.style.color='#9CA3AF'}>
                  <Icon name="external-link" size={13}/>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function OwnerWorkload() {
  const max = Math.max(...OWNER_LOAD.map(o => o.count));
  return (
    <Card padding={20}>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color:'#111827' }}>Owner Workload</h2>
        <div style={{ fontSize: 11.5, color:'#6B7280', marginTop: 2 }}>open items · across all sources</div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap: 11 }}>
        {OWNER_LOAD.map(o => (
          <div key={o.name}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 4 }}>
              <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                <Avatar name={o.name} size={22}/>
                <span style={{ fontSize: 12.5, color:'#111827', fontWeight: 500 }}>{o.name}</span>
                <span style={{ fontSize: 10.5, color:'#9CA3AF' }}>{o.role}</span>
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 600, color:'#111827' }}>{o.count}</span>
            </div>
            <div style={{ height: 6, background:'#F3F4F6', borderRadius: 9999 }}>
              <div style={{
                height:'100%', borderRadius: 9999,
                width: `${(o.count/max)*100}%`,
                background: o.count >= 12 ? 'linear-gradient(90deg,#6B2FA0,#E91E63)' : '#8B5FBF',
              }}/>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function OverviewFindings() {
  return (
    <div style={{ maxWidth: 1280, padding:'18px 24px 0' }}>
      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap: 14 }}>
        <FindingsTable/>
        <OwnerWorkload/>
      </div>
    </div>
  );
}

registerWidget('overview-findings', OverviewFindings);
