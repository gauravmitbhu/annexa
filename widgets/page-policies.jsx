// Policies & Standards page — the approved library plus what is in review or
// still to be authored. Reads POLICY_META / POLICY_REGISTER (data/policies.json).

const { useState: usePolState } = React;

const POL_STATE_META = {
  'Approved':     { bg:'#ECFDF5', fg:'#047857', icon:'check-circle-2' },
  'Under review': { bg:'#FFFBEB', fg:'#B45309', icon:'clock' },
  'To author':    { bg:'#FEF2F2', fg:'#B91C1C', icon:'file-plus' },
  'Archived':     { bg:'var(--brand-surface)', fg:'var(--brand-muted)', icon:'archive' },
};

const POL_STD_PILL = {
  '27001': { bg:'color-mix(in srgb, var(--brand-accent) 8%, transparent)', fg:'var(--brand-accent)', label:'27001' },
  '14001': { bg:'#ECFDF5',               fg:'#047857', label:'14001' },
  '9001':  { bg:'#EFF6FF',               fg:'#1D4ED8', label:'9001' },
  'all':   { bg:'var(--brand-surface)',               fg:'#4A473F', label:'all three' },
};

function PLTile({ icon, label, value, sub, color }) {
  return (
    <Card padding={16}>
      <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:11.5, color:'var(--brand-muted)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.04em' }}>
        <Icon name={icon} size={13} color="var(--brand-accent)"/> {label}
      </div>
      <div style={{ fontSize:28, fontWeight:600, color, marginTop:8, lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:'#9A968C', marginTop:4 }}>{sub}</div>}
    </Card>
  );
}

function PoliciesPage() {
  const [state, setState] = usePolState('Approved');
  const states = ['Approved', 'Under review', 'To author', 'Archived', 'all'];
  const rows = POLICY_REGISTER.filter(p => state === 'all' || p.state === state);
  const count = (s) => POLICY_REGISTER.filter(p => p.state === s).length;

  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:18, maxWidth:1320 }}>
      <div style={{ padding:'12px 16px', borderRadius:10, background:'color-mix(in srgb, var(--brand-accent) 6%, transparent)', border:'1px solid color-mix(in srgb, var(--brand-accent) 18%, transparent)', fontSize:12.5, color:'#B8410F', lineHeight:1.55, display:'flex', alignItems:'flex-start', gap:10 }}>
        <Icon name="file-text" size={16} color="var(--brand-accent)" style={{ marginTop:2 }}/>
        <span>{POLICY_META.note} Approver: {POLICY_META.approver}.</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <PLTile icon="check-circle-2" label="Approved"     value={count('Approved')}     sub="canonical library" color="#047857"/>
        <PLTile icon="clock"          label="Under review" value={count('Under review')} sub="drafts and revisions" color="#B45309"/>
        <PLTile icon="file-plus"      label="To author"    value={count('To author')}    sub="required by open NCs" color="#B91C1C"/>
        <PLTile icon="archive"        label="Archived"     value={count('Archived')}     sub="superseded versions retained" color="var(--brand-muted)"/>
      </div>

      <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
        {states.map(s => (
          <button key={s} onClick={()=>setState(s)} style={{
            fontFamily:'Poppins, sans-serif', fontSize:12, padding:'5px 12px', borderRadius:9999, cursor:'pointer',
            border:'1px solid ' + (state === s ? 'var(--brand-accent)' : 'var(--brand-border)'),
            background: state === s ? 'color-mix(in srgb, var(--brand-accent) 8%, transparent)' : '#fff',
            color: state === s ? 'var(--brand-accent)' : '#4A473F', fontWeight: state === s ? 600 : 500,
          }}>{s === 'all' ? 'All' : s}</button>
        ))}
        <span style={{ marginLeft:'auto', fontSize:11.5, color:'var(--brand-muted)' }}>{rows.length} shown</span>
      </div>

      <Card padding={0}>
        <div style={{ padding:'16px 20px 10px' }}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'var(--brand-ink)' }}>Document register</h2>
          <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:2 }}>{POLICY_META.library}</div>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
          <thead>
            <tr style={{ background:'#F7F6F3' }}>
              {['Ref','Document','Standard','Version','Last updated','State','Links'].map((h,i) => (
                <th key={i} style={{ textAlign:'left', padding:'9px 16px', fontSize:10.5, fontWeight:600, color:'var(--brand-muted)', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid var(--brand-border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p,i) => {
              const sm = POL_STATE_META[p.state] || {};
              const sp = POL_STD_PILL[p.std] || POL_STD_PILL['all'];
              return (
                <tr key={p.num} style={{ borderTop: i===0?'none':'1px solid var(--brand-surface)', opacity: p.state === 'Archived' ? 0.6 : 1 }}
                    onMouseEnter={e=>e.currentTarget.style.background='#F7F6F3'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'9px 16px', fontFamily:'ui-monospace, monospace', fontSize:11, fontWeight:600, color:'var(--brand-accent)', whiteSpace:'nowrap' }}>{p.num}</td>
                  <td style={{ padding:'9px 16px', color:'var(--brand-ink)', fontWeight:500 }}>{p.name}</td>
                  <td style={{ padding:'9px 16px' }}><Pill color={sp.fg} bg={sp.bg} size="xs">{sp.label}</Pill></td>
                  <td style={{ padding:'9px 16px', fontFamily:'ui-monospace, monospace', fontSize:11.5, color:'#4A473F' }}>{p.ver}</td>
                  <td style={{ padding:'9px 16px', color:'var(--brand-muted)', fontSize:12, whiteSpace:'nowrap' }}>{p.updated}</td>
                  <td style={{ padding:'9px 16px' }}>
                    <Pill color={sm.fg} bg={sm.bg} size="xs">
                      {sm.icon && <Icon name={sm.icon} size={10}/>} {p.state}
                    </Pill>
                  </td>
                  <td style={{ padding:'9px 16px', textAlign:'right', whiteSpace:'nowrap' }}>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" title="Open in the document library"
                       style={{ fontSize:11.5, color:'var(--brand-accent)', display:'inline-flex', alignItems:'center', gap:4, marginRight:12 }}>
                      Doc <Icon name="external-link" size={11}/>
                    </a>
                    {p.pdf && (
                      <a href={p.pdf} target="_blank" rel="noopener noreferrer" title="Open PDF"
                         style={{ fontSize:11.5, color:'#B91C1C', display:'inline-flex', alignItems:'center', gap:4 }}>
                        PDF <Icon name="file-text" size={11}/>
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Card padding={20}>
        <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'var(--brand-ink)', marginBottom:10 }}>Evidence</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:6, maxWidth:640 }}>
          {POLICY_EVIDENCE.map((l,i) => <CoreLinkRow key={i} link={l}/>)}
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { PoliciesPage });

registerWidget('page-policies', PoliciesPage);
