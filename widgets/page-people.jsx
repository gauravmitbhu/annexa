// People & Training page: roles, responsibilities and mandate per the
// roles and responsibilities register, plus the awareness programme.

function PPTile({ icon, label, value, sub, color }) {
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

function PersonCard({ p }) {
  const load = (p.caActions || 0) + p.ncActions;
  return (
    <Card padding={16}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:11 }}>
        <Avatar name={p.name} size={38}/>
        <div style={{ minWidth:0, flex:1 }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:8, flexWrap:'wrap' }}>
            <span style={{ fontSize:14, fontWeight:600, color:'var(--brand-ink)' }}>{p.name}</span>
            <span style={{ fontSize:11.5, color:'var(--brand-accent)', fontWeight:500 }}>{p.role}</span>
            <span style={{ marginLeft:'auto', display:'flex', gap:6 }}>
              {(p.caActions || 0) > 0 && <Pill color="#B45309" bg="#FFFBEB" size="xs">{p.caActions} corrective actions</Pill>}
              {p.ncActions > 0 && <Pill color="#B91C1C" bg="#FEF2F2" size="xs">{p.ncActions} NC actions</Pill>}
            </span>
          </div>
          <div style={{ fontSize:11, color:'#9A968C', marginTop:2 }}>
            <Icon name="map-pin" size={10} style={{ verticalAlign:'middle', marginRight:4 }}/>{p.scope}
          </div>
          <div style={{ fontSize:12, color:'#343128', marginTop:8, lineHeight:1.55 }}>{p.responsibilities}</div>
          <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:6, lineHeight:1.5, paddingTop:6, borderTop:'1px solid var(--brand-surface)' }}>
            <strong style={{ fontWeight:600, color:'#4A473F' }}>Mandate.</strong> {p.mandate}
          </div>
          {load > 12 && (
            <div style={{ fontSize:11, color:'#B91C1C', marginTop:7 }}>
              <Icon name="alert-triangle" size={11} style={{ verticalAlign:'middle', marginRight:4 }}/>
              Carrying {load} open items — concentration risk for the management system.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function PeoplePage() {
  const totalCa = PEOPLE.reduce((n, p) => n + (p.caActions || 0), 0);
  const mandatory = TRAINING.filter(t => (t.note || '').indexOf('Mandatory') === 0).length;
  const toEstablish = TRAINING.filter(t => t.cadence.indexOf('To ') === 0).length;

  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:18, maxWidth:1320 }}>
      <div style={{ padding:'12px 16px', borderRadius:10, background:'color-mix(in srgb, var(--brand-accent) 6%, transparent)', border:'1px solid color-mix(in srgb, var(--brand-accent) 18%, transparent)', fontSize:12.5, color:'#B8410F', lineHeight:1.55, display:'flex', alignItems:'flex-start', gap:10 }}>
        <Icon name="users" size={16} color="var(--brand-accent)" style={{ marginTop:2 }}/>
        <span>{PEOPLE_NOTE}</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <PPTile icon="users"        label="Named owners"     value={PEOPLE.length}          sub="holding management-system items" color="var(--brand-ink)"/>
        <PPTile icon="link"         label="External parties" value={PEOPLE_EXTERNAL.length}  sub="certification bodies, consultants, service providers" color="var(--brand-ink)"/>
        <PPTile icon="graduation-cap" label="Courses"        value={TRAINING.length}         sub={`${mandatory} mandatory`} color="var(--brand-ink)"/>
        <PPTile icon="hourglass"    label="To establish"     value={toEstablish}             sub="required by open NCs" color="#B45309"/>
      </div>

      <Card padding={18}>
        <SectionTitle right={<span style={{ fontSize:11, color:'#9A968C' }}>{totalCa} open corrective actions in total</span>}>
          Where the workload sits
        </SectionTitle>
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          {OWNER_LOAD.map(o => {
            const pct = Math.round(o.count / OWNER_LOAD[0].count * 100);
            return (
              <div key={o.name} style={{ display:'grid', gridTemplateColumns:'210px 1fr 34px', gap:12, alignItems:'center' }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:7, minWidth:0 }}>
                  <Avatar name={o.name} size={22}/>
                  <span style={{ minWidth:0 }}>
                    <span style={{ fontSize:12, color:'var(--brand-ink)', display:'block' }}>{o.name}</span>
                    <span style={{ fontSize:10, color:'#9A968C' }}>{o.role}</span>
                  </span>
                </span>
                <span style={{ height:8, borderRadius:9999, background:'var(--brand-surface)', overflow:'hidden' }}>
                  <span style={{ display:'block', height:'100%', width:pct + '%', background: pct > 60 ? '#EF4444' : 'linear-gradient(90deg,var(--brand-accent),var(--brand-accent))' }}/>
                </span>
                <span style={{ fontSize:12, fontWeight:600, color:'var(--brand-ink)', textAlign:'right' }}>{o.count}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop:12, paddingTop:10, borderTop:'1px solid var(--brand-surface)', fontSize:11.5, color:'#B45309', lineHeight:1.5 }}>
          <Icon name="alert-triangle" size={12} style={{ verticalAlign:'middle', marginRight:5 }}/>
          {OWNER_LOAD[0].name} holds {Math.round(OWNER_LOAD[0].count / totalCa * 100)}% of the register. Concentration on one owner is a key-person risk worth a succession plan.
        </div>
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {PEOPLE.map(p => <PersonCard key={p.name} p={p}/>)}
      </div>

      <Card padding={0}>
        <div style={{ padding:'16px 20px 10px' }}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'var(--brand-ink)' }}>Awareness &amp; training programme</h2>
          <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:2 }}>
            Training and awareness plan. Records are kept in the LMS; trainings held outside the LMS are tracked under the plan's monitoring section.
          </div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5, minWidth:760 }}>
            <thead>
              <tr style={{ background:'#F7F6F3' }}>
                {['Course','Audience','Cadence','System','Notes'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'9px 16px', fontSize:10.5, fontWeight:600, color:'var(--brand-muted)', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid var(--brand-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRAINING.map((t, i) => {
                const pending = t.cadence.indexOf('To ') === 0;
                return (
                  <tr key={t.course} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--brand-surface)', background: pending ? 'rgba(245,158,11,0.04)' : 'transparent' }}>
                    <td style={{ padding:'10px 16px', color:'var(--brand-ink)', fontWeight:500, verticalAlign:'top' }}>{t.course}</td>
                    <td style={{ padding:'10px 16px', color:'#4A473F', fontSize:12, verticalAlign:'top' }}>{t.audience}</td>
                    <td style={{ padding:'10px 16px', verticalAlign:'top' }}>
                      <Pill color={pending ? '#B45309' : '#047857'} bg={pending ? '#FFFBEB' : '#ECFDF5'} size="xs">{t.cadence}</Pill>
                    </td>
                    <td style={{ padding:'10px 16px', color:'var(--brand-muted)', fontSize:12, verticalAlign:'top' }}>{t.system}</td>
                    <td style={{ padding:'10px 16px', color:'var(--brand-muted)', fontSize:11.5, lineHeight:1.5, verticalAlign:'top', maxWidth:360 }}>{t.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card padding={18}>
        <SectionTitle>External parties in the management system</SectionTitle>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {PEOPLE_EXTERNAL.map(e => (
            <div key={e.name} style={{ padding:'11px 13px', borderRadius:8, background:'#F7F6F3', border:'1px solid var(--brand-border)' }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                <span style={{ fontSize:13, fontWeight:600, color:'var(--brand-ink)' }}>{e.name}</span>
                <span style={{ fontSize:11, color:'var(--brand-accent)' }}>{e.role}</span>
              </div>
              <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:5, lineHeight:1.5 }}>{e.note}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { PeoplePage });

registerWidget('page-people', PeoplePage);
