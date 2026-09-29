// Environment page — ISO 14001. The newest and least mature of the three
// management systems, and the largest cluster of open findings.

function ENTile({ icon, label, value, sub, color }) {
  return (
    <Card padding={16}>
      <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:11.5, color:'var(--brand-muted)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.04em' }}>
        <Icon name={icon} size={13} color="#047857"/> {label}
      </div>
      <div style={{ fontSize:28, fontWeight:600, color, marginTop:8, lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:'#9A968C', marginTop:4 }}>{sub}</div>}
    </Card>
  );
}

const ENV_STATE_PILL = {
  'Maintained':       { bg:'#ECFDF5', fg:'#047857' },
  'Under correction': { bg:'#FFFBEB', fg:'#B45309' },
  'To create':        { bg:'#FEF2F2', fg:'#B91C1C' },
};

function EnvironmentPage() {
  const minors = ENV_NCS.filter(n => n.level === 'Minor').length;
  const obs    = ENV_NCS.filter(n => n.level === 'Observation').length;

  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:18, maxWidth:1320 }}>
      <div style={{ padding:'12px 16px', borderRadius:10, background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.28)', fontSize:12.5, color:'#7C2D12', lineHeight:1.55, display:'flex', alignItems:'flex-start', gap:10 }}>
        <Icon name="leaf" size={16} color="#B45309" style={{ marginTop:2 }}/>
        <span><strong style={{ fontWeight:600 }}>{ENV_META.status}</strong> {ENV_META.history}</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <ENTile icon="file-warning" label="Open findings" value={ENV_NCS.length}       sub={`${minors} minor · ${obs} observations`} color="#B45309"/>
        <ENTile icon="target"       label="Objectives"    value={ENV_OBJECTIVES.length} sub="environmental objectives" color="var(--brand-ink)"/>
        <ENTile icon="folder"       label="Registers"     value={ENV_REGISTERS.length}  sub={`${ENV_REGISTERS.filter(r => r.state === 'Maintained').length} maintained`} color="var(--brand-ink)"/>
        <ENTile icon="map-pin"      label="Site issues"   value={ENV_SITE_ISSUES.length} sub="open at office level" color="#B45309"/>
      </div>

      <Card padding={0}>
        <div style={{ padding:'16px 20px 10px' }}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'var(--brand-ink)' }}>ISO 14001 nonconformities</h2>
          <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:2 }}>Owner: {ENV_META.owner} · policy: {ENV_META.policy}</div>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
          <thead>
            <tr style={{ background:'#F7F6F3' }}>
              {['NC','Clause','Level','Finding','Next due'].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'9px 16px', fontSize:10.5, fontWeight:600, color:'var(--brand-muted)', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid var(--brand-border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ENV_NCS.map((n, i) => (
              <tr key={n.id} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--brand-surface)' }}>
                <td style={{ padding:'10px 16px', fontFamily:'ui-monospace, monospace', fontSize:11.5, fontWeight:600, color:'var(--brand-accent)', verticalAlign:'top' }}>{n.id}</td>
                <td style={{ padding:'10px 16px', fontSize:11.5, color:'#4A473F', verticalAlign:'top' }}>{n.clause}</td>
                <td style={{ padding:'10px 16px', verticalAlign:'top' }}>
                  <Pill color={n.level === 'Minor' ? '#B91C1C' : '#B45309'} bg={n.level === 'Minor' ? '#FEF2F2' : '#FFFBEB'} size="xs">{n.level}</Pill>
                </td>
                <td style={{ padding:'10px 16px', color:'#343128', lineHeight:1.5, verticalAlign:'top' }}>{n.summary}</td>
                <td style={{ padding:'10px 16px', fontSize:11.5, color:'var(--brand-muted)', whiteSpace:'nowrap', verticalAlign:'top' }}>{n.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:14 }}>
        <Card padding={0}>
          <div style={{ padding:'16px 20px 10px' }}>
            <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'var(--brand-ink)' }}>Environmental objectives</h2>
            <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:2 }}>From the Objectives &amp; KPI register on the EMS site.</div>
          </div>
          {ENV_OBJECTIVES.map(o => (
            <div key={o.id} style={{ padding:'13px 20px', borderTop:'1px solid var(--brand-surface)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:9, flexWrap:'wrap' }}>
                <span style={{ fontFamily:'ui-monospace, monospace', fontSize:11, fontWeight:600, color:'#047857', background:'#ECFDF5', padding:'1px 7px', borderRadius:4 }}>{o.id}</span>
                <span style={{ fontSize:13, fontWeight:500, color:'var(--brand-ink)' }}>{o.title}</span>
                {o.due && <span style={{ marginLeft:'auto', fontSize:11, color:'#9A968C' }}>due {o.due}</span>}
              </div>
              <div style={{ fontSize:12, color:'#343128', marginTop:6, lineHeight:1.55 }}><strong style={{ fontWeight:600 }}>Target.</strong> {o.target}</div>
              <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:4, lineHeight:1.5 }}><strong style={{ fontWeight:600 }}>Measure.</strong> {o.measure}</div>
              <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:3, lineHeight:1.5 }}><strong style={{ fontWeight:600 }}>Evaluation.</strong> {o.evaluation}</div>
              <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:3, lineHeight:1.5 }}><strong style={{ fontWeight:600 }}>Actions.</strong> {o.actions}</div>
              <div style={{ fontSize:11, color:'#9A968C', marginTop:6 }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}><Avatar name={o.owner} size={18}/>{o.owner}</span>
              </div>
            </div>
          ))}
        </Card>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Card padding={18}>
            <SectionTitle>Registers</SectionTitle>
            {ENV_REGISTERS.map(r => {
              const p = ENV_STATE_PILL[r.state] || { bg:'var(--brand-surface)', fg:'var(--brand-muted)' };
              return (
                <div key={r.name} style={{ padding:'9px 0', borderTop:'1px solid var(--brand-surface)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:12, color:'var(--brand-ink)', flex:1 }}>{r.name}</span>
                    <Pill color={p.fg} bg={p.bg} size="xs">{r.state}</Pill>
                  </div>
                  {r.note && <div style={{ fontSize:11, color:'var(--brand-muted)', marginTop:3, lineHeight:1.45 }}>{r.note}</div>}
                </div>
              );
            })}
          </Card>

          <Card padding={18}>
            <SectionTitle>Site issues</SectionTitle>
            {ENV_SITE_ISSUES.map((s, i) => (
              <div key={i} style={{ padding:'9px 0', borderTop:'1px solid var(--brand-surface)' }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                  <span style={{ fontSize:11.5, fontWeight:600, color:'var(--brand-accent)', whiteSpace:'nowrap' }}>{s.site}</span>
                  {s.nc !== '—' && <span style={{ fontSize:10, color:'#9A968C', fontFamily:'ui-monospace, monospace' }}>NC {s.nc}</span>}
                </div>
                <div style={{ fontSize:12, color:'#343128', marginTop:3, lineHeight:1.5 }}>{s.issue}</div>
                <div style={{ fontSize:11, color:'#047857', marginTop:3, lineHeight:1.45 }}>
                  <Icon name="arrow-right" size={10} style={{ verticalAlign:'middle', marginRight:4 }}/>{s.state}
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { EnvironmentPage });

registerWidget('page-environment', EnvironmentPage);
