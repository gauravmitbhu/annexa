// Nonconformities page: findings from the latest external certification audit (NC_META.body).
// 17 findings (11 minor, 6 observations, no majors) and 55 corrective actions.

const { useState: useNcState, useMemo: useNcMemo } = React;

const NC_LEVEL_PILL = {
  'Major':       { bg: '#DC2626', fg: '#fff' },
  'Minor':       { bg: '#FEF2F2', fg: '#B91C1C' },
  'Observation': { bg: '#FFFBEB', fg: '#B45309' },
};

const NC_STD_PILL = {
  'ISO 27001': { bg: 'color-mix(in srgb, var(--brand-accent) 8%, transparent)', fg: 'var(--brand-accent)' },
  'ISO 14001': { bg: '#ECFDF5',               fg: '#047857' },
  'ISO 9001':  { bg: '#EFF6FF',               fg: '#1D4ED8' },
};

function NCTile({ icon, label, value, sub, color }) {
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

function NCActionRow({ a }) {
  const done = a.status === 'Completed';
  const sc = OFI_STATUS_COLOR[a.status] || OFI_STATUS_COLOR['Open'];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'54px 1fr 190px 96px', gap:12, padding:'10px 0', borderTop:'1px solid var(--brand-surface)', alignItems:'start' }}>
      <span style={{
        fontFamily:'ui-monospace, monospace', fontSize:10.5, fontWeight:600, textAlign:'center',
        padding:'2px 0', borderRadius:4,
        color: a.type === 'Correction' ? '#B45309' : 'var(--brand-accent)',
        background: a.type === 'Correction' ? '#FFFBEB' : 'color-mix(in srgb, var(--brand-accent) 8%, transparent)',
      }} title={a.type}>{a.ref}</span>

      <div style={{ minWidth:0 }}>
        <div style={{ fontSize:12.5, color: done ? 'var(--brand-muted)' : 'var(--brand-ink)', lineHeight:1.5, textDecoration: done ? 'line-through' : 'none' }}>
          {a.action}
        </div>
        {a.notes && (
          <div style={{ fontSize:11, color:'#047857', marginTop:5, background:'#ECFDF5', borderRadius:5, padding:'5px 8px', lineHeight:1.45 }}>
            <Icon name="message-square" size={10} style={{ verticalAlign:'middle', marginRight:5 }}/>{a.notes}
          </div>
        )}
      </div>

      <div style={{ fontSize:11.5, color:'#4A473F', minWidth:0 }}>
        {a.ownerName
          ? <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Avatar name={a.ownerName} size={19}/><span>{a.ownerName}</span></span>
          : <span style={{ color:'#9A968C', fontStyle:'italic' }}>{a.owner || 'unassigned'}</span>}
        {a.ownerName && a.owner !== a.ownerName && (
          <div style={{ fontSize:10, color:'#9A968C', marginTop:2 }}>{a.owner}</div>
        )}
      </div>

      <div style={{ justifySelf:'end', textAlign:'right' }}>
        <Pill color={sc.fg} bg={sc.bg} size="xs"><strong style={{ fontWeight:600 }}>{a.status}</strong></Pill>
        <div style={{ fontSize:10.5, color:'#9A968C', marginTop:4 }}>{a.due || 'no date'}</div>
      </div>
    </div>
  );
}

function NCCard({ nc, actions, expanded, onToggle }) {
  const lp = NC_LEVEL_PILL[nc.level] || NC_LEVEL_PILL['Minor'];
  const sp = NC_STD_PILL[nc.standard] || {};
  const pct = nc.actions ? Math.round((nc.done / nc.actions) * 100) : 0;
  return (
    <Card padding={0}>
      <div onClick={onToggle} style={{ padding:'14px 18px', cursor:'pointer', background: expanded ? '#F7F6F3' : '#fff' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <Icon name="chevron-down" size={15} color="var(--brand-accent)"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition:'transform 150ms' }}/>
          <span style={{ fontFamily:'ui-monospace, monospace', fontSize:12, fontWeight:700, color:'var(--brand-ink)' }}>NC {nc.id}</span>
          <Pill color={sp.fg} bg={sp.bg} size="xs"><strong style={{ fontWeight:600 }}>{nc.standard}</strong></Pill>
          <Pill color={lp.fg} bg={lp.bg} size="xs"><strong style={{ fontWeight:600 }}>{nc.level}</strong></Pill>
          <span style={{ fontSize:11, color:'var(--brand-muted)' }}>{nc.clause}</span>
          <span style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:11, color:'#9A968C' }}>{nc.done}/{nc.actions} actions</span>
            <span style={{ width:60, height:5, borderRadius:9999, background:'var(--brand-surface)', overflow:'hidden', display:'inline-block' }}>
              <span style={{ display:'block', width:pct + '%', height:'100%', background: pct === 100 ? '#10B981' : '#F59E0B' }}/>
            </span>
            <Pill color={(OFI_STATUS_COLOR[nc.status] || OFI_STATUS_COLOR['Open']).fg}
                  bg={(OFI_STATUS_COLOR[nc.status] || OFI_STATUS_COLOR['Open']).bg} size="xs">
              <strong style={{ fontWeight:600 }}>{nc.status}</strong>
            </Pill>
          </span>
        </div>
        <div style={{ fontSize:13, color:'var(--brand-ink)', fontWeight:500, marginTop:8, paddingLeft:25 }}>{nc.summary}</div>
        <div style={{ display:'flex', gap:14, marginTop:6, paddingLeft:25, fontSize:11, color:'#9A968C', flexWrap:'wrap' }}>
          <span><Icon name="user" size={10} style={{ verticalAlign:'middle', marginRight:4 }}/>{nc.owner}</span>
          <span><Icon name="calendar" size={10} style={{ verticalAlign:'middle', marginRight:4 }}/>next due {nc.nextDue}</span>
          <span><Icon name="map-pin" size={10} style={{ verticalAlign:'middle', marginRight:4 }}/>{(nc.sites || []).join(', ')}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ padding:'0 18px 16px', borderTop:'1px solid var(--brand-surface)' }}>
          <div style={{ padding:'14px 0 6px' }}>
            <SectionTitle>Audit finding</SectionTitle>
            <div style={{ fontSize:12.5, color:'#343128', lineHeight:1.6 }}>{nc.finding}</div>
          </div>

          {nc.rootCause && (
            <div style={{ padding:'10px 0 6px' }}>
              <SectionTitle>Root cause</SectionTitle>
              <div style={{ fontSize:12.5, color:'#343128', lineHeight:1.6, background:'color-mix(in srgb, var(--brand-accent) 5%, transparent)', border:'1px solid color-mix(in srgb, var(--brand-accent) 15%, transparent)', borderRadius:8, padding:'10px 12px' }}>
                {nc.rootCause}
              </div>
            </div>
          )}

          <div style={{ padding:'14px 0 0' }}>
            <SectionTitle right={<span style={{ fontSize:11, color:'#9A968C' }}>C = correction · CA = corrective action</span>}>
              Action tracker
            </SectionTitle>
            <div style={{ display:'grid', gridTemplateColumns:'54px 1fr 190px 96px', gap:12, paddingBottom:6, fontSize:10, fontWeight:600, color:'#9A968C', letterSpacing:'0.06em', textTransform:'uppercase' }}>
              <span>Ref</span><span>Action</span><span>Owner</span><span style={{ justifySelf:'end' }}>Status</span>
            </div>
            {actions.map(a => <NCActionRow key={nc.id + a.ref} a={a}/>)}
          </div>
        </div>
      )}
    </Card>
  );
}

function NCsPage() {
  const [std, setStd]     = useNcState('all');
  const [level, setLevel] = useNcState('all');
  const [open, setOpen]   = useNcState(() => new Set());

  const toggle = (id) => setOpen(s => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });

  const rows = useNcMemo(() => NCS.filter(n =>
    (std === 'all' || n.standard === std) && (level === 'all' || n.level === level)
  ), [std, level]);

  const byStd = useNcMemo(() => {
    const m = {};
    NCS.forEach(n => { m[n.standard] = (m[n.standard] || 0) + 1; });
    return m;
  }, []);

  const overdue = useNcMemo(() => NC_ACTIONS.filter(a =>
    a.status !== 'Completed' && a.due && a.due < ((typeof AS_OF !== 'undefined' && AS_OF) || new Date().toISOString().slice(0, 10))
  ).length, []);

  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:18, maxWidth:1320 }}>
      <div style={{ padding:'12px 16px', borderRadius:10, background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.25)', fontSize:12.5, color:'#065F46', lineHeight:1.55, display:'flex', alignItems:'flex-start', gap:10 }}>
        <Icon name="check-circle-2" size={16} color="#047857" style={{ marginTop:2 }}/>
        <span>
          <strong style={{ fontWeight:600 }}>{NC_META.major ? `${NC_META.major} major nonconformit${NC_META.major === 1 ? 'y' : 'ies'} in the latest audit.` : 'No major nonconformities in the latest audit.'}</strong>{' '}
          {NC_META.total} findings from {NC_META.body}: {NC_META.minor} minor and {NC_META.observations} observations. {NC_META.note}
        </span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:14 }}>
        <NCTile icon="file-warning"  label="Findings"       value={NC_META.total}        sub={`${NC_META.minor} minor · ${NC_META.observations} obs`} color="var(--brand-ink)"/>
        <NCTile icon="shield-check"  label="Majors"         value={NC_META.major}        sub={NC_META.major ? 'raised' : 'none raised'} color={NC_META.major ? '#B91C1C' : '#047857'}/>
        <NCTile icon="list-checks"   label="Actions"        value={NC_META.actionsTotal} sub={`${NC_META.actionsDone} completed`} color="var(--brand-ink)"/>
        <NCTile icon="loader"        label="In progress"    value={NCS.filter(n => n.status === 'In Progress').length} sub={`${NCS.filter(n => n.status === 'Open').length} not started`} color="#B45309"/>
        <NCTile icon="alarm-clock"   label="Overdue actions" value={overdue}             sub={`past due ${((typeof AS_OF !== 'undefined' && AS_OF) || new Date().toISOString().slice(0, 10))}`} color={overdue ? '#B91C1C' : '#047857'}/>
      </div>

      <Card padding={18}>
        <SectionTitle>Findings by standard</SectionTitle>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
          {STANDARDS.map(s => {
            const n = byStd[s.label.replace('/IEC', '').replace(':2022','').replace(':2015','')] || byStd['ISO ' + s.id] || s.ncs;
            const pill = NC_STD_PILL['ISO ' + s.id] || {};
            return (
              <div key={s.id} style={{ padding:'12px 14px', borderRadius:8, background: pill.bg || '#F7F6F3', border:'1px solid var(--brand-border)' }}>
                <div style={{ fontSize:12, fontWeight:600, color: pill.fg || 'var(--brand-ink)' }}>{s.label}</div>
                <div style={{ fontSize:11, color:'var(--brand-muted)', marginTop:2 }}>{s.scope} · certified by {s.certBody}</div>
                <div style={{ fontSize:22, fontWeight:600, color: pill.fg || 'var(--brand-ink)', marginTop:8 }}>{n} <span style={{ fontSize:11, fontWeight:500, color:'var(--brand-muted)' }}>findings</span></div>
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
        <span style={{ fontSize:11, color:'var(--brand-muted)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em' }}>Filter</span>
        {['all', 'ISO 27001', 'ISO 14001', 'ISO 9001'].map(s => (
          <button key={s} onClick={()=>setStd(s)} style={{
            fontFamily:'Poppins, sans-serif', fontSize:12, padding:'5px 11px', borderRadius:9999, cursor:'pointer',
            border:'1px solid ' + (std === s ? 'var(--brand-accent)' : 'var(--brand-border)'),
            background: std === s ? 'color-mix(in srgb, var(--brand-accent) 8%, transparent)' : '#fff',
            color: std === s ? 'var(--brand-accent)' : '#4A473F', fontWeight: std === s ? 600 : 500,
          }}>{s === 'all' ? 'All standards' : s}</button>
        ))}
        <span style={{ width:1, height:20, background:'var(--brand-border)', margin:'0 4px' }}/>
        {['all', 'Minor', 'Observation'].map(l => (
          <button key={l} onClick={()=>setLevel(l)} style={{
            fontFamily:'Poppins, sans-serif', fontSize:12, padding:'5px 11px', borderRadius:9999, cursor:'pointer',
            border:'1px solid ' + (level === l ? 'var(--brand-accent)' : 'var(--brand-border)'),
            background: level === l ? 'color-mix(in srgb, var(--brand-accent) 8%, transparent)' : '#fff',
            color: level === l ? 'var(--brand-accent)' : '#4A473F', fontWeight: level === l ? 600 : 500,
          }}>{l === 'all' ? 'All levels' : l}</button>
        ))}
        <span style={{ marginLeft:'auto', fontSize:11.5, color:'var(--brand-muted)' }}>{rows.length} of {NCS.length} shown</span>
        <Button variant="ghost" size="sm" icon={open.size ? 'chevrons-down-up' : 'chevrons-up-down'}
          onClick={()=>setOpen(open.size ? new Set() : new Set(NCS.map(n => n.id)))}>
          {open.size ? 'Collapse all' : 'Expand all'}
        </Button>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {rows.map(nc => (
          <NCCard key={nc.id} nc={nc}
            actions={NC_ACTIONS.filter(a => a.nc === nc.id)}
            expanded={open.has(nc.id)}
            onToggle={()=>toggle(nc.id)}/>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { NCsPage });

registerWidget('page-ncs', NCsPage);
