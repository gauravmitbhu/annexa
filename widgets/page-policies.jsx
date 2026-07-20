// Policies page — mirrors the ISMS Policy Log (Day 2 · 13:00–14:00 compliance slot, A.5.31–5.36).
// All 29 policies released v1.0+ and approved (09–10.06.2026).

function PLTile({ icon, label, value, color }) {
  return (
    <Card padding={16}>
      <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:11.5, color:'#6B7280', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.04em' }}>
        <Icon name={icon} size={13} color="#6B2FA0"/> {label}
      </div>
      <div style={{ fontSize:28, fontWeight:600, color, marginTop:8, lineHeight:1 }}>{value}</div>
    </Card>
  );
}

function PoliciesPage() {
  const above10 = POLICY_REGISTER.filter(p => p.ver !== 'v1.0').length;
  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:18, maxWidth:1280 }}>
      <div style={{ padding:'12px 16px', borderRadius:10, background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.25)', fontSize:12.5, color:'#065F46', lineHeight:1.5, display:'flex', alignItems:'center', gap:10 }}>
        <Icon name="check-circle-2" size={16} color="#047857"/>
        <span><strong style={{ fontWeight:600 }}>All 29 policies released and approved.</strong> Bulk v1.0 release completed 09–10.06.2026 (approver Jordan); the Policies folder in the document system is canonical, the ISMS Policy Log is the single source of truth for versions. Branded PDFs + markdown sources retained for the audit binder.</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <PLTile icon="file-text"      label="Policies"            value={POLICY_REGISTER.length} color="#111827"/>
        <PLTile icon="check-circle-2" label="Released v1.0+"      value={POLICY_REGISTER.length} color="#047857"/>
        <PLTile icon="git-branch"     label="Above v1.0"          value={above10} color="#1D4ED8"/>
        <PLTile icon="clock"          label="Approvals pending"   value={0} color="#047857"/>
      </div>

      <Card padding={0}>
        <div style={{ padding:'16px 20px 10px' }}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'#111827' }}>Policy Register</h2>
          <div style={{ fontSize:11.5, color:'#6B7280', marginTop:2 }}>Owner: Alex (CISO) · Approver: Jordan · next review Jun 2027 (Mar/May 2027 for the earlier releases).</div>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
          <thead>
            <tr style={{ background:'#FAFAFC' }}>
              {['#','Policy','Version','Last updated','Links'].map((h,i) => (
                <th key={i} style={{ textAlign:'left', padding:'9px 16px', fontSize:10.5, fontWeight:600, color:'#6B7280', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {POLICY_REGISTER.map((p,i) => (
              <tr key={p.num} style={{ borderTop: i===0?'none':'1px solid #F3F4F6' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#FAFAFC'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <td style={{ padding:'9px 16px', fontFamily:'ui-monospace, monospace', fontSize:11.5, fontWeight:600, color:'#6B2FA0' }}>{p.num}</td>
                <td style={{ padding:'9px 16px', color:'#111827', fontWeight:500 }}>{p.name}</td>
                <td style={{ padding:'9px 16px' }}>
                  <Pill color={p.ver==='v1.0' ? '#047857' : '#1D4ED8'} bg={p.ver==='v1.0' ? '#ECFDF5' : '#EFF6FF'} size="xs">
                    <strong style={{ fontWeight:600 }}>{p.ver}</strong>
                  </Pill>
                </td>
                <td style={{ padding:'9px 16px', color:'#6B7280', fontSize:12 }}>{p.updated}</td>
                <td style={{ padding:'9px 16px', textAlign:'right', whiteSpace:'nowrap' }}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" title="Open source document"
                     style={{ fontSize:11.5, color:'#6B2FA0', display:'inline-flex', alignItems:'center', gap:4, marginRight:12 }}>
                    Doc <Icon name="external-link" size={11}/>
                  </a>
                  {p.pdf && (
                    <a href={p.pdf} target="_blank" rel="noopener noreferrer" title="Open branded PDF"
                       style={{ fontSize:11.5, color:'#B91C1C', display:'inline-flex', alignItems:'center', gap:4 }}>
                      PDF <Icon name="file-text" size={11}/>
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card padding={20}>
        <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'#111827', marginBottom:10 }}>Evidence</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:6, maxWidth:600 }}>
          {POLICY_EVIDENCE.map((l,i) => <CoreLinkRow key={i} link={l}/>)}
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { PoliciesPage });

registerWidget('page-policies', PoliciesPage);
