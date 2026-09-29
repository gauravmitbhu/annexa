// Exceptions page — accepted deviations and recorded status downgrades.
// Where no Annex A control is excluded, this register holds risk acceptances
// rather than SoA exclusions.

const EXC_APPROVAL_PILL = {
  accepted: { bg:'#ECFDF5', fg:'#047857', label:'Accepted' },
  recorded: { bg:'#FFFBEB', fg:'#B45309', label:'Recorded' },
  pending:  { bg:'#FEF2F2', fg:'#B91C1C', label:'Pending' },
};

function EXTile({ icon, label, value, sub, color }) {
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

function ExceptionsPage() {
  const accepted = EXCEPTIONS.filter(e => e.approval === 'accepted').length;
  const recorded = EXCEPTIONS.filter(e => e.approval === 'recorded').length;

  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:18, maxWidth:1320 }}>
      <div style={{ padding:'12px 16px', borderRadius:10, background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.25)', fontSize:12.5, color:'#065F46', lineHeight:1.55, display:'flex', alignItems:'flex-start', gap:10 }}>
        <Icon name="check-circle-2" size={16} color="#047857" style={{ marginTop:2 }}/>
        <span>{EXCEPTION_NOTE}</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <EXTile icon="file-x"        label="Deviations"    value={EXCEPTIONS.length} sub="in the register" color="var(--brand-ink)"/>
        <EXTile icon="check-circle-2" label="Accepted"     value={accepted}          sub="risk formally accepted" color="#047857"/>
        <EXTile icon="pencil-line"   label="Recorded"      value={recorded}          sub="status downgrades and scoped carve-outs" color="#B45309"/>
        <EXTile icon="shield-check"  label="SoA exclusions" value={0}                sub={`all ${CONTROLS.length} controls applicable`} color="#047857"/>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {EXCEPTIONS.map(e => {
          const ap = EXC_APPROVAL_PILL[e.approval] || EXC_APPROVAL_PILL.recorded;
          return (
            <Card key={e.id} padding={18}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                <span style={{
                  fontFamily:'ui-monospace, monospace', fontSize:11, fontWeight:700,
                  color:'var(--brand-accent)', background:'color-mix(in srgb, var(--brand-accent) 8%, transparent)',
                  padding:'3px 8px', borderRadius:5, flexShrink:0, minWidth:72, textAlign:'center',
                }}>{e.id}</span>
                <div style={{ minWidth:0, flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:9, flexWrap:'wrap' }}>
                    <span style={{ fontSize:13.5, fontWeight:600, color:'var(--brand-ink)', lineHeight:1.4 }}>{e.title}</span>
                    <Pill color={ap.fg} bg={ap.bg} size="xs"><strong style={{ fontWeight:600 }}>{ap.label}</strong></Pill>
                  </div>
                  <div style={{ fontSize:12.5, color:'#343128', marginTop:8, lineHeight:1.6 }}>{e.rationale}</div>
                  <div style={{ display:'flex', gap:14, marginTop:10, paddingTop:9, borderTop:'1px solid var(--brand-surface)', fontSize:11, color:'#9A968C', flexWrap:'wrap', alignItems:'center' }}>
                    <span style={{ fontFamily:'ui-monospace, monospace', color:'var(--brand-muted)' }}>{e.ctrls.join(' · ')}</span>
                    <span><Icon name="user" size={10} style={{ verticalAlign:'middle', marginRight:4 }}/>{e.owner}</span>
                    <span><Icon name="calendar" size={10} style={{ verticalAlign:'middle', marginRight:4 }}/>{e.validity}</span>
                    <span><Icon name="link" size={10} style={{ verticalAlign:'middle', marginRight:4 }}/>{e.source}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card padding={20}>
        <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'var(--brand-ink)', marginBottom:10 }}>Governance</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:6, maxWidth:640 }}>
          {((typeof EXCEPTION_LINKS !== 'undefined' && EXCEPTION_LINKS) || [
            { label:'Risk management process: acceptance step and evidence requirements', url:'#', type:'doc' },
            { label:'Risk management policy', url:'#', type:'doc' },
            { label:'Risk register: residual acceptance columns', url:'#', type:'sheet' },
            { label:'Statement of Applicability: implementation status per control', url:'#', type:'sheet' },
            { label:'Management review: deviations reviewed at each cycle', url:'#', type:'doc' },
          ]).map((l,i) => <CoreLinkRow key={i} link={l}/>)}
        </div>
        <div style={{ marginTop:14, fontSize:11.5, color:'var(--brand-muted)', lineHeight:1.55, paddingTop:12, borderTop:'1px solid var(--brand-surface)' }}>
          Acceptance is recorded per risk in the risk register with the named risk owner, the residual level and the acceptance date. Where a control's implementation status is downgraded rather than the risk accepted, the SoA entry carries the change and a verification action gates its restoration.
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { ExceptionsPage });

registerWidget('page-exceptions', ExceptionsPage);
