// Suppliers page — A.5.19–5.23. Classification and evaluation per
// the supplier management process and the suppliers code of conduct.

const VD_CRIT_PILL = {
  'Critical':{bg:'#FEF2F2',fg:'#B91C1C'}, 'Important':{bg:'#FFFBEB',fg:'#B45309'},
  'Non-Critical':{bg:'#ECFDF5',fg:'#047857'},
  'High':{bg:'#FFFBEB',fg:'#B45309'}, 'Moderate':{bg:'#EFF6FF',fg:'#1D4ED8'}, 'Low':{bg:'#ECFDF5',fg:'#047857'},
};

function VDTile({ icon, label, value, color }) {
  return (
    <Card padding={16}>
      <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:11.5, color:'var(--brand-muted)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.04em' }}>
        <Icon name={icon} size={13} color="var(--brand-accent)"/> {label}
      </div>
      <div style={{ fontSize:28, fontWeight:600, color, marginTop:8, lineHeight:1 }}>{value}</div>
    </Card>
  );
}

function VendorsPage() {
  const critical = VENDORS.filter(v => v.crit==='Critical').length;
  const inScope = VENDORS.filter(v => v.inScope).length;
  const pending = VENDORS.filter(v => !v.lastReview || v.lastReview === '—').length;
  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:18, maxWidth:1320 }}>
      <div style={{ padding:'12px 16px', borderRadius:10, background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.28)', fontSize:12.5, color:'#7C2D12', lineHeight:1.55, display:'flex', alignItems:'flex-start', gap:10 }}>
        <Icon name="alert-triangle" size={16} color="#B45309" style={{ marginTop:2 }}/>
        <span><strong style={{ fontWeight:600 }}>Supplier management.</strong> {VENDOR_META.openItems}</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <VDTile icon="truck"          label="Critical & important"    value={VENDORS.length} color="var(--brand-ink)"/>
        <VDTile icon="flame"          label="Critical"                value={critical}       color="#B91C1C"/>
        <VDTile icon="shield-check"   label="In ISO 27001 scope"      value={inScope}        color="#047857"/>
        <VDTile icon="clock"          label="Evaluation pending"      value={pending}        color="#B45309"/>
      </div>

      <Card padding={0}>
        <div style={{ padding:'16px 20px 10px' }}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'var(--brand-ink)' }}>Supplier register</h2>
          <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:2 }}>{VENDOR_META.assessment}</div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
            <thead>
              <tr style={{ background:'#F7F6F3' }}>
                {['Supplier','Service','Site','Owner','Class','Assurance','Last evaluation'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'9px 16px', fontSize:10.5, fontWeight:600, color:'var(--brand-muted)', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid var(--brand-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VENDORS.map((v,i) => {
                const pc = VD_CRIT_PILL[v.crit] || VD_CRIT_PILL['Low'];
                const reviewPending = !v.lastReview || v.lastReview === '—';
                return (
                  <tr key={v.name} style={{ borderTop: i===0?'none':'1px solid var(--brand-surface)' }}>
                    <td style={{ padding:'10px 16px', fontWeight:600, color:'var(--brand-ink)' }}>
                      {v.name}
                      {v.inScope && <Icon name="shield-check" size={11} color="#047857" style={{ verticalAlign:'middle', marginLeft:5 }}/>}
                    </td>
                    <td style={{ padding:'10px 16px', color: v.type ? '#343128' : '#9A968C', fontSize:12, lineHeight:1.45 }}>{v.type || '—'}</td>
                    <td style={{ padding:'10px 16px', color:'var(--brand-muted)', fontSize:11.5, whiteSpace:'nowrap' }}>{v.site}</td>
                    <td style={{ padding:'10px 16px', whiteSpace:'nowrap' }}>
                      {v.owner ? <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Avatar name={v.owner} size={20}/><span style={{ color:'#343128' }}>{v.owner}</span></span> : <span style={{ color:'#9A968C' }}>—</span>}
                    </td>
                    <td style={{ padding:'10px 16px' }}><Pill color={pc.fg} bg={pc.bg} size="xs"><strong style={{ fontWeight:600 }}>{v.crit}</strong></Pill></td>
                    <td style={{ padding:'10px 16px', color:'#343128', fontSize:12 }}>{v.assurance}</td>
                    <td style={{ padding:'10px 16px', color: reviewPending ? '#9A968C' : '#343128', fontSize:12, fontStyle: reviewPending ? 'italic' : 'normal' }}>{reviewPending ? 'Pending' : v.lastReview}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card padding={20}>
        <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'var(--brand-ink)', marginBottom:10 }}>Evidence</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:6, maxWidth:600 }}>
          {VENDOR_EVIDENCE.map((l,i) => <CoreLinkRow key={i} link={l}/>)}
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { VendorsPage });

registerWidget('page-vendors', VendorsPage);
