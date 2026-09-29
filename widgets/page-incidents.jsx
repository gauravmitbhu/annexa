// Incidents & Changes page — the combined register, the P1–P4 priority matrix
// and the NIS2 / GDPR reporting trail.

const { useState: useIncState } = React;

const INC_CAT_PILL = {
  'Cat 1 – Critical': { bg:'#FEF2F2', fg:'#B91C1C' },
  'Cat 2 – High':     { bg:'#FFFBEB', fg:'#B45309' },
  'Cat 3 – Medium':   { bg:'#EFF6FF', fg:'#1D4ED8' },
  'Cat 4 – Low':      { bg:'#ECFDF5', fg:'#047857' },
};

const INC_DOMAIN_ICON = {
  'Office':               'building-2',
  'Information Security': 'shield-alert',
  'Environmental':        'leaf',
  'Health & Safety':      'heart-pulse',
};

const CHG_RISK_PILL = {
  Green:       { bg:'#ECFDF5', fg:'#047857' },
  'Light Green':{ bg:'#ECFDF5', fg:'#047857' },
  Yellow:      { bg:'#FFFBEB', fg:'#B45309' },
  Orange:      { bg:'#FFF7ED', fg:'#C2410C' },
  Red:         { bg:'#FEF2F2', fg:'#B91C1C' },
};

function INTile({ icon, label, value, sub, color }) {
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

function IncidentCard({ inc, open, onToggle }) {
  const cp = INC_CAT_PILL[inc.category] || {};
  return (
    <Card padding={0}>
      <div onClick={onToggle} style={{ padding:'14px 18px', cursor:'pointer', background: open ? '#F7F6F3' : '#fff' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <Icon name="chevron-down" size={15} color="var(--brand-accent)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition:'transform 150ms' }}/>
          <span style={{ fontFamily:'ui-monospace, monospace', fontSize:11.5, fontWeight:700, color:'var(--brand-ink)' }}>{inc.id}</span>
          <Pill color={cp.fg} bg={cp.bg} size="xs"><strong style={{ fontWeight:600 }}>{inc.category}</strong></Pill>
          <span style={{ fontSize:11.5, color:'#4A473F' }}>
            <Icon name={INC_DOMAIN_ICON[inc.domain] || 'circle'} size={11} color="#9A968C" style={{ verticalAlign:'middle', marginRight:4 }}/>
            {inc.domain}
          </span>
          <span style={{ fontSize:11.5, color:'var(--brand-muted)' }}>
            <Icon name="map-pin" size={11} color="#9A968C" style={{ verticalAlign:'middle', marginRight:4 }}/>{inc.site}
          </span>
          <span style={{ marginLeft:'auto', display:'flex', gap:6, alignItems:'center' }}>
            {inc.nis2 && <Pill color="#B91C1C" bg="#FEF2F2" size="xs"><strong style={{ fontWeight:600 }}>NIS2</strong></Pill>}
            {inc.gdpr && <Pill color="#B45309" bg="#FFFBEB" size="xs"><strong style={{ fontWeight:600 }}>GDPR</strong></Pill>}
            <Pill color="#047857" bg="#ECFDF5" size="xs">{inc.status}</Pill>
          </span>
        </div>
        <div style={{ fontSize:13, color:'var(--brand-ink)', fontWeight:500, marginTop:8, paddingLeft:25, lineHeight:1.45 }}>{inc.title}</div>
        <div style={{ display:'flex', gap:14, marginTop:5, paddingLeft:25, fontSize:11, color:'#9A968C', flexWrap:'wrap' }}>
          <span>detected {inc.filed}</span>
          <span>closed {inc.closed}</span>
          <span>reported by {inc.reporter}</span>
        </div>
      </div>

      {open && (
        <div style={{ padding:'0 18px 16px', borderTop:'1px solid var(--brand-surface)' }}>
          <div style={{ paddingTop:14 }}>
            <SectionTitle>What happened</SectionTitle>
            <div style={{ fontSize:12.5, color:'#343128', lineHeight:1.6 }}>{inc.detail}</div>
          </div>
          <div style={{ paddingTop:14 }}>
            <SectionTitle>Root cause</SectionTitle>
            <div style={{ fontSize:12.5, color:'#343128', lineHeight:1.6, background:'color-mix(in srgb, var(--brand-accent) 5%, transparent)', border:'1px solid color-mix(in srgb, var(--brand-accent) 15%, transparent)', borderRadius:8, padding:'10px 12px' }}>
              {inc.rootCause}
            </div>
          </div>
          <div style={{ paddingTop:14 }}>
            <SectionTitle>Corrective action</SectionTitle>
            <div style={{ fontSize:12.5, color:'#343128', lineHeight:1.6 }}>{inc.corrective}</div>
          </div>
          {(inc.nis2 || inc.gdpr) && (
            <div style={{ paddingTop:14 }}>
              <SectionTitle right={<span style={{ fontSize:11, color:'#9A968C' }}>authority: {inc.authority}</span>}>
                Regulatory reporting trail
              </SectionTitle>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10 }}>
                {[
                  { label:'24 h early warning', v: inc.warn24 },
                  { label:'72 h notification',  v: inc.notify72 },
                  { label:'1 month final report', v: inc.final },
                ].map(s => (
                  <div key={s.label} style={{ padding:'9px 11px', borderRadius:8, background: s.v ? '#ECFDF5' : '#F7F6F3', border:'1px solid ' + (s.v ? '#A7F3D0' : 'var(--brand-border)') }}>
                    <div style={{ fontSize:10.5, color:'var(--brand-muted)', textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:600 }}>{s.label}</div>
                    <div style={{ fontSize:12.5, color: s.v ? '#047857' : '#9A968C', marginTop:3, fontWeight:500 }}>
                      {s.v ? <><Icon name="check" size={11} style={{ verticalAlign:'middle', marginRight:4 }}/>{s.v}</> : 'not required'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function IncidentsPage() {
  const [open, setOpen] = useIncState(() => new Set());
  const toggle = (id) => setOpen(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const nis2 = INCIDENTS.filter(i => i.nis2).length;

  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:18, maxWidth:1320 }}>
      <div style={{ padding:'12px 16px', borderRadius:10, background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.28)', fontSize:12.5, color:'#7C2D12', lineHeight:1.55, display:'flex', alignItems:'flex-start', gap:10 }}>
        <Icon name="alert-triangle" size={16} color="#B45309" style={{ marginTop:2 }}/>
        <span><strong style={{ fontWeight:600 }}>Two open gaps in incident management.</strong> {INCIDENT_META.openGap}</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <INTile icon="siren"        label="Incidents"  value={INCIDENTS.length}  sub={`${INCIDENTS.filter(i => !/clos/i.test(String(i.status || ''))).length} open`} color="var(--brand-ink)"/>
        <INTile icon="git-branch"   label="Changes"    value={CHANGES.length}    sub="in the change register" color="var(--brand-ink)"/>
        <INTile icon="landmark"     label="NIS2 reported" value={nis2}           sub="24 h / 72 h / 1 month trail" color="#B91C1C"/>
        <INTile icon="gauge"        label="Priorities" value={INC_PRIORITY.length} sub="P1 resolve target 1 h" color="var(--brand-ink)"/>
      </div>

      <div>
        <SectionTitle right={<span style={{ fontSize:11, color:'#9A968C' }}>{INCIDENT_META.dataNote}</span>}>
          Incident register
        </SectionTitle>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {INCIDENTS.map(i => <IncidentCard key={i.id} inc={i} open={open.has(i.id)} onToggle={()=>toggle(i.id)}/>)}
        </div>
      </div>

      <Card padding={0}>
        <div style={{ padding:'16px 20px 10px' }}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'var(--brand-ink)' }}>Priority matrix</h2>
          <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:2 }}>Urgency × impact. Response times apply in and out of office hours.{INCIDENT_META.priorityNote ? ' ' + INCIDENT_META.priorityNote : ''}</div>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
          <thead>
            <tr style={{ background:'#F7F6F3' }}>
              {['Priority','Level','Response (office)','Response (24/7)','Resolve','Alarm','Description'].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'9px 14px', fontSize:10.5, fontWeight:600, color:'var(--brand-muted)', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid var(--brand-border)', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INC_PRIORITY.map((p, i) => (
              <tr key={p.prio} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--brand-surface)' }}>
                <td style={{ padding:'10px 14px', verticalAlign:'top' }}>
                  <span style={{ fontFamily:'ui-monospace, monospace', fontSize:12, fontWeight:700, color:'var(--brand-accent)' }}>{p.prio}</span>
                </td>
                <td style={{ padding:'10px 14px', verticalAlign:'top' }}>
                  <Pill color={p.level === 'Critical' ? '#B91C1C' : p.level === 'High' ? '#B45309' : p.level === 'Medium' ? '#1D4ED8' : '#047857'}
                        bg={p.level === 'Critical' ? '#FEF2F2' : p.level === 'High' ? '#FFFBEB' : p.level === 'Medium' ? '#EFF6FF' : '#ECFDF5'} size="xs">{p.level}</Pill>
                </td>
                <td style={{ padding:'10px 14px', verticalAlign:'top', color:'#4A473F', whiteSpace:'nowrap' }}>{p.office}</td>
                <td style={{ padding:'10px 14px', verticalAlign:'top', color:'#4A473F', whiteSpace:'nowrap' }}>{p.always}</td>
                <td style={{ padding:'10px 14px', verticalAlign:'top', color:'var(--brand-ink)', fontWeight:600, whiteSpace:'nowrap' }}>{p.resolve}</td>
                <td style={{ padding:'10px 14px', verticalAlign:'top', color:'var(--brand-muted)', whiteSpace:'nowrap' }}>{p.alarm}</td>
                <td style={{ padding:'10px 14px', verticalAlign:'top', color:'var(--brand-muted)', fontSize:11.5, lineHeight:1.5 }}>{p.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card padding={18}>
        <SectionTitle>Impact perspectives</SectionTitle>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11.5, minWidth:760 }}>
            <thead>
              <tr>
                {['Perspective','Critical','High','Medium','Low'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'7px 10px', fontSize:10, fontWeight:600, color:'var(--brand-muted)', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid var(--brand-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INC_PERSPECTIVES.map((p, i) => (
                <tr key={p.view} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--brand-surface)' }}>
                  <td style={{ padding:'8px 10px', color:'var(--brand-ink)', fontWeight:500, verticalAlign:'top', whiteSpace:'nowrap' }}>{p.view}</td>
                  <td style={{ padding:'8px 10px', color:'#7F1D1D', verticalAlign:'top', lineHeight:1.45 }}>{p.critical}</td>
                  <td style={{ padding:'8px 10px', color:'#92400E', verticalAlign:'top', lineHeight:1.45 }}>{p.high}</td>
                  <td style={{ padding:'8px 10px', color:'#1E40AF', verticalAlign:'top', lineHeight:1.45 }}>{p.medium}</td>
                  <td style={{ padding:'8px 10px', color:'#065F46', verticalAlign:'top', lineHeight:1.45 }}>{p.low}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding:'16px 20px 10px' }}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'var(--brand-ink)' }}>Change register</h2>
          <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:2 }}>{INCIDENT_META.register}</div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5, minWidth:860 }}>
            <thead>
              <tr style={{ background:'#F7F6F3' }}>
                {['Change','Raised','Requester','Change','Why','Risk','Approver','Implemented'].map((h, i) => (
                  <th key={i} style={{ textAlign:'left', padding:'9px 12px', fontSize:10.5, fontWeight:600, color:'var(--brand-muted)', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid var(--brand-border)', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHANGES.map((c, i) => {
                const rp = CHG_RISK_PILL[c.risk] || { bg:'var(--brand-surface)', fg:'var(--brand-muted)' };
                return (
                  <tr key={c.id} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--brand-surface)' }}>
                    <td style={{ padding:'10px 12px', verticalAlign:'top', whiteSpace:'nowrap' }}>
                      <span style={{ fontFamily:'ui-monospace, monospace', fontSize:11, fontWeight:600, color:'var(--brand-accent)' }}>{c.id}</span>
                    </td>
                    <td style={{ padding:'10px 12px', verticalAlign:'top', fontSize:11.5, color:'var(--brand-muted)', whiteSpace:'nowrap' }}>{c.raised}</td>
                    <td style={{ padding:'10px 12px', verticalAlign:'top', fontSize:11.5, color:'#4A473F', whiteSpace:'nowrap' }}>{c.requester}</td>
                    <td style={{ padding:'10px 12px', verticalAlign:'top', color:'var(--brand-ink)', lineHeight:1.5, minWidth:260 }}>{c.what}</td>
                    <td style={{ padding:'10px 12px', verticalAlign:'top', fontSize:11.5, color:'var(--brand-muted)', lineHeight:1.45, maxWidth:200 }}>{c.why}</td>
                    <td style={{ padding:'10px 12px', verticalAlign:'top' }}><Pill color={rp.fg} bg={rp.bg} size="xs">{c.risk || '—'}</Pill></td>
                    <td style={{ padding:'10px 12px', verticalAlign:'top', fontSize:11.5, color:'#4A473F', whiteSpace:'nowrap' }}>{c.approver || '—'}</td>
                    <td style={{ padding:'10px 12px', verticalAlign:'top', fontSize:11.5, color: c.implemented ? '#047857' : '#9A968C', whiteSpace:'nowrap' }}>{c.implemented || 'pending'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ fontSize:11, color:'#9A968C', lineHeight:1.5 }}>
        {INCIDENT_META.reporting} Process: {INCIDENT_META.process}. Categories: {INCIDENT_META.categories}.
      </div>
    </div>
  );
}

Object.assign(window, { IncidentsPage });

registerWidget('page-incidents', IncidentsPage);
registerWidget('drawer-incident', function NoIncidentDrawer() { return null; });
