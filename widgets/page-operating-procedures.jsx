// Operating Procedures Register page — Annex A 5.37
// Reads OPSPROC_* (data/opsproc.json). Optional OPSPROC_REVIEW:
//   { owner, lastReviewed, nextReview } for the "Review & maintenance" card.

const { useState: useOpsState, useMemo: useOpsMemo } = React;

const OPS_RISK_PILL = {
  'High':   { bg:'#FEF2F2', fg:'#B91C1C' },
  'Medium': { bg:'#FFFBEB', fg:'#B45309' },
  'Low':    { bg:'#ECFDF5', fg:'#047857' },
};

function OPTile({ icon, label, value, color }) {
  return (
    <Card padding={16}>
      <div style={{ display:'flex', alignItems:'center', gap: 7, fontSize: 11.5, color:'var(--brand-muted)', fontWeight: 500, textTransform:'uppercase', letterSpacing:'0.04em' }}>
        <Icon name={icon} size={13} color="var(--brand-accent)"/> {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, color, marginTop: 8, lineHeight: 1 }}>{value}</div>
    </Card>
  );
}

function OPCategorySection({ cat, procedures }) {
  const [open, setOpen] = useOpsState(true);
  const rows = procedures.filter(p => p.cat === cat.id);
  if (rows.length === 0) return null;
  return (
    <Card padding={0}>
      <div onClick={()=>setOpen(o=>!o)}
        style={{ padding:'12px 18px', display:'flex', alignItems:'center', gap: 10, cursor:'pointer',
          background: open ? '#F7F6F3' : '#fff', borderBottom: open ? '1px solid var(--brand-surface)' : 'none' }}>
        <Icon name="chevron-down" size={15} color="var(--brand-accent)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition:'transform 150ms' }}/>
        <span style={{ fontFamily:'ui-monospace, SFMono-Regular, monospace', fontSize: 11.5, fontWeight: 700, color:'var(--brand-accent)', background:'color-mix(in srgb, var(--brand-accent) 8%, transparent)', padding:'1px 7px', borderRadius: 4 }}>{cat.id}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color:'var(--brand-ink)' }}>{cat.name}</span>
        <span style={{ fontSize: 11, color:'#9A968C', marginLeft:'auto' }}>{rows.length} procedure{rows.length===1?'':'s'}</span>
      </div>
      {open && (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background:'#F7F6F3' }}>
                {['#','Procedure','Owner','Ver','Last reviewed','Notes',''].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'8px 14px', fontSize: 10.5, fontWeight: 600, color:'var(--brand-muted)', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid var(--brand-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={p.id} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--brand-surface)' }}>
                  <td style={{ padding:'10px 14px', verticalAlign:'top' }}>
                    <span style={{ fontFamily:'ui-monospace, monospace', fontSize: 11, fontWeight: 600, color:'var(--brand-accent)', background:'color-mix(in srgb, var(--brand-accent) 8%, transparent)', padding:'1px 6px', borderRadius: 4 }}>{p.id}</span>
                  </td>
                  <td style={{ padding:'10px 14px', verticalAlign:'top', color:'var(--brand-ink)', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding:'10px 14px', verticalAlign:'top', whiteSpace:'nowrap' }}>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Avatar name={p.owner} size={20}/><span style={{ color:'#343128', fontSize: 12 }}>{p.owner}</span></span>
                  </td>
                  <td style={{ padding:'10px 14px', verticalAlign:'top', fontFamily:'ui-monospace, monospace', fontSize: 11, color:'#4A473F' }}>{p.ver}</td>
                  <td style={{ padding:'10px 14px', verticalAlign:'top', fontSize: 11.5, color:'var(--brand-muted)', whiteSpace:'nowrap' }}>{p.last}</td>
                  <td style={{ padding:'10px 14px', verticalAlign:'top', fontSize: 11.5, color:'#4A473F', maxWidth: 420 }}>{p.notes}</td>
                  <td style={{ padding:'10px 14px', verticalAlign:'top', textAlign:'right' }}>
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" title="Open source"
                        style={{ display:'inline-flex', color:'#9A968C', padding:4, borderRadius:4 }}
                        onMouseEnter={e=>e.currentTarget.style.color='var(--brand-accent)'}
                        onMouseLeave={e=>e.currentTarget.style.color='#9A968C'}>
                        <Icon name="external-link" size={13}/>
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function OperatingProceduresPage() {
  const [filterOwner, setFilterOwner] = useOpsState('all');
  const owners = ['all', ...Array.from(new Set(OPSPROC_PROCEDURES.map(p => p.owner)))];
  const procedures = useOpsMemo(() =>
    filterOwner === 'all' ? OPSPROC_PROCEDURES : OPSPROC_PROCEDURES.filter(p => p.owner === filterOwner),
    [filterOwner]);

  const total = OPSPROC_PROCEDURES.length;
  const cats = OPSPROC_CATEGORIES.length;
  const reviewedThisYear = OPSPROC_PROCEDURES.filter(p => String(p.last || '').includes(String(new Date().getFullYear())) || /Ongoing/.test(p.last || '')).length;

  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap: 18, maxWidth: 1280 }}>
      {/* Header banner */}
      <div style={{ padding:'12px 16px', borderRadius: 10, background:'color-mix(in srgb, var(--brand-accent) 6%, transparent)', border:'1px solid color-mix(in srgb, var(--brand-accent) 18%, transparent)', fontSize: 12.5, color:'#B8410F', lineHeight: 1.5, display:'flex', alignItems:'center', gap: 10, flexWrap:'wrap' }}>
        <Icon name="list-ordered" size={16} color="var(--brand-accent)"/>
        <span><strong style={{ fontWeight: 600 }}>Annex A 5.37 and ISO 9001 clause 4.4.</strong> {OPSPROC_NOTE}</span>
        <div style={{ marginLeft:'auto', display:'flex', gap: 6 }}>
          <a href={OPSPROC_REGISTER_URL} target="_blank" rel="noopener noreferrer" style={btnLink}>
            <Icon name="external-link" size={12}/> Processes folder
          </a>
        </div>
      </div>

      {/* KPI tiles */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 14 }}>
        <OPTile icon="list-checks" label="Processes"           value={total} color="var(--brand-ink)"/>
        <OPTile icon="folder"      label="Categories"          value={cats}  color="var(--brand-accent)"/>
        <OPTile icon="check-circle-2" label="Approved"         value={OPSPROC_PROCEDURES.filter(p => p.state === 'Approved').length} color="#047857"/>
        <OPTile icon="alert-triangle" label="Tracked gaps"     value={OPSPROC_GAPS.length} color="#B45309"/>
      </div>

      {/* Owner filter */}
      <div style={{ display:'flex', alignItems:'center', gap: 8, flexWrap:'wrap' }}>
        <span style={{ fontSize: 11.5, color:'var(--brand-muted)', fontWeight: 500, textTransform:'uppercase', letterSpacing:'0.04em' }}>Owner</span>
        {owners.map(o => (
          <button key={o} onClick={()=>setFilterOwner(o)} style={{
            padding:'4px 11px', borderRadius: 6,
            border:'1px solid ' + (filterOwner === o ? 'color-mix(in srgb, var(--brand-accent) 35%, transparent)' : 'var(--brand-border)'),
            background: filterOwner === o ? 'color-mix(in srgb, var(--brand-accent) 8%, transparent)' : '#fff',
            color: filterOwner === o ? '#B8410F' : 'var(--brand-muted)',
            fontSize: 11.5, fontWeight: 500, cursor:'pointer',
            fontFamily:'Poppins, sans-serif',
          }}>{o === 'all' ? 'All' : o}</button>
        ))}
        <span style={{ marginLeft:'auto', fontSize: 11.5, color:'#9A968C' }}>{procedures.length} of {total} shown</span>
      </div>

      {/* Category sections */}
      <div style={{ display:'flex', flexDirection:'column', gap: 14 }}>
        {OPSPROC_CATEGORIES.map(c => <OPCategorySection key={c.id} cat={c} procedures={procedures}/>)}
      </div>

      {/* Gaps */}
      <Card padding={0}>
        <div style={{ padding:'14px 18px 8px' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color:'var(--brand-ink)' }}>Identified gaps & improvement actions</h2>
          <div style={{ fontSize: 11.5, color:'var(--brand-muted)', marginTop: 2 }}>Tracked in the OFI / Corrective Actions registers</div>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ background:'#F7F6F3' }}>
              {['#','Gap','Risk','Responsible','Target'].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'8px 16px', fontSize: 10.5, fontWeight: 600, color:'var(--brand-muted)', letterSpacing:'0.06em', textTransform:'uppercase', borderTop:'1px solid var(--brand-surface)', borderBottom:'1px solid var(--brand-border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {OPSPROC_GAPS.map((g, i) => {
              const pc = OPS_RISK_PILL[g.risk];
              return (
                <tr key={g.id} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--brand-surface)' }}>
                  <td style={{ padding:'10px 16px', verticalAlign:'top', fontFamily:'ui-monospace, monospace', fontSize: 11, fontWeight: 600, color:'#343128' }}>{g.id}</td>
                  <td style={{ padding:'10px 16px', color:'var(--brand-ink)', maxWidth: 640 }}>{g.text}</td>
                  <td style={{ padding:'10px 16px' }}>
                    <span style={{ padding:'2px 9px', borderRadius: 9999, background: pc.bg, color: pc.fg, fontSize: 11, fontWeight: 600 }}>{g.risk}</span>
                  </td>
                  <td style={{ padding:'10px 16px', color:'#4A473F', whiteSpace:'nowrap' }}>{g.resp}</td>
                  <td style={{ padding:'10px 16px', color:'#4A473F', whiteSpace:'nowrap' }}>{g.target}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Review & maintenance */}
      <Card padding={18}>
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color:'var(--brand-ink)' }}>Review & maintenance</h2>
        <ul style={{ margin:'8px 0 0', paddingLeft: 18, fontSize: 12.5, color:'#343128', lineHeight: 1.6 }}>
          {(() => { const rv = (typeof OPSPROC_REVIEW !== 'undefined' && OPSPROC_REVIEW) || {}; return <>
            {rv.owner && <li><strong>Owner:</strong> {rv.owner}</li>}
            {rv.lastReviewed && <li><strong>Last reviewed:</strong> {rv.lastReviewed}</li>}
            {rv.nextReview && <li><strong>Next review due:</strong> {rv.nextReview}</li>}
          </>; })()}
          <li><strong>Update triggers:</strong> a procedure is added, changed, retired; an owner changes; an audit or management-review finding requires it.</li>
        </ul>
      </Card>
    </div>
  );
}

const btnLink = {
  display:'inline-flex', alignItems:'center', gap: 5,
  fontSize: 11.5, fontWeight: 500, color:'var(--brand-accent)', textDecoration:'none',
  border:'1px solid color-mix(in srgb, var(--brand-accent) 25%, transparent)', borderRadius: 7, padding:'4px 10px',
  background:'#fff',
};

Object.assign(window, { OperatingProceduresPage });

registerWidget('page-opsproc', OperatingProceduresPage);
