// Vendors / Suppliers page — A.5.19–5.23 (Day 1 · 15:30–16:30 audit slot).
// Supplier register per Policy 22 (Third Party Supplier Security) + Policy 27 (Outsourcing).

const VD_CRIT_PILL = {
  'Critical':{bg:'#FEF2F2',fg:'#B91C1C'}, 'High':{bg:'#FFFBEB',fg:'#B45309'},
  'Moderate':{bg:'#EFF6FF',fg:'#1D4ED8'}, 'Low':{bg:'#ECFDF5',fg:'#047857'},
};

function VDTile({ icon, label, value, color }) {
  return (
    <Card padding={16}>
      <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:11.5, color:'#6B7280', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.04em' }}>
        <Icon name={icon} size={13} color="#6B2FA0"/> {label}
      </div>
      <div style={{ fontSize:28, fontWeight:600, color, marginTop:8, lineHeight:1 }}>{value}</div>
    </Card>
  );
}

function VendorsPage() {
  const critHigh = VENDORS.filter(v => v.crit==='Critical' || v.crit==='High').length;
  const isoCertified = VENDORS.filter(v => /ISO 27001/.test(v.assurance||'')).length;
  const pending = VENDORS.filter(v => !v.lastReview || v.lastReview === '—').length;
  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:18, maxWidth:1280 }}>
      <div style={{ padding:'12px 16px', borderRadius:10, background:'rgba(107,47,160,0.06)', border:'1px solid rgba(107,47,160,0.18)', fontSize:12.5, color:'#4A1F70', lineHeight:1.5, display:'flex', alignItems:'center', gap:10 }}>
        <Icon name="calendar-clock" size={16} color="#6B2FA0"/>
        <span><strong style={{ fontWeight:600 }}>Day 1 · 15:30–16:30 audit slot.</strong> A.5.19–5.23 supplier management. Review cadence per Policy 22 Appendix: Critical/High — annual + certifications; Moderate — every two years; Low — ad-hoc / available trust certifications.</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <VDTile icon="building-2"     label="Suppliers in register"   value={VENDORS.length} color="#111827"/>
        <VDTile icon="flame"          label="Critical / High"         value={critHigh}       color="#B45309"/>
        <VDTile icon="shield-check"   label="ISO-certified providers" value={isoCertified}   color="#047857"/>
        <VDTile icon="clock"          label="Access review pending"   value={pending}        color="#B45309"/>
      </div>

      <Card padding={0}>
        <div style={{ padding:'16px 20px 10px' }}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'#111827' }}>Supplier Register</h2>
          <div style={{ fontSize:11.5, color:'#6B7280', marginTop:2 }}>Reconciled against the accounting Service &amp; Supplier Comparison; owners and service types per that register.</div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
            <thead>
              <tr style={{ background:'#FAFAFC' }}>
                {['Supplier / Service','Type','Owner','Criticality','Assurance','Last access review'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'9px 16px', fontSize:10.5, fontWeight:600, color:'#6B7280', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VENDORS.map((v,i) => {
                const pc = VD_CRIT_PILL[v.crit] || VD_CRIT_PILL['Low'];
                const reviewPending = !v.lastReview || v.lastReview === '—';
                return (
                  <tr key={v.name} style={{ borderTop: i===0?'none':'1px solid #F3F4F6' }}>
                    <td style={{ padding:'10px 16px', fontWeight:600, color:'#111827', whiteSpace:'nowrap' }}>{v.name}</td>
                    <td style={{ padding:'10px 16px', color: v.type ? '#374151' : '#9CA3AF' }}>{v.type || '—'}</td>
                    <td style={{ padding:'10px 16px', whiteSpace:'nowrap' }}>
                      {v.owner ? <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Avatar name={v.owner} size={20}/><span style={{ color:'#374151' }}>{v.owner}</span></span> : <span style={{ color:'#9CA3AF' }}>—</span>}
                    </td>
                    <td style={{ padding:'10px 16px' }}><Pill color={pc.fg} bg={pc.bg} size="xs"><strong style={{ fontWeight:600 }}>{v.crit}</strong></Pill></td>
                    <td style={{ padding:'10px 16px', color:'#374151', fontSize:12 }}>{v.assurance}</td>
                    <td style={{ padding:'10px 16px', color: reviewPending ? '#9CA3AF' : '#374151', fontSize:12, fontStyle: reviewPending ? 'italic' : 'normal' }}>{reviewPending ? 'Pending' : v.lastReview}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card padding={20}>
        <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'#111827', marginBottom:10 }}>Evidence</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:6, maxWidth:600 }}>
          {VENDOR_EVIDENCE.map((l,i) => <CoreLinkRow key={i} link={l}/>)}
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { VendorsPage });
