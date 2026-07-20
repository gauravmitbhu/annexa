// Operating Procedures Register page — Annex A 5.37
// Mirrors the internal register v1.1 (15.06.2026) — demo data.

const { useState: useOpsState, useMemo: useOpsMemo } = React;

const OPS_RISK_PILL = {
  'High':   { bg:'#FEF2F2', fg:'#B91C1C' },
  'Medium': { bg:'#FFFBEB', fg:'#B45309' },
  'Low':    { bg:'#ECFDF5', fg:'#047857' },
};

function OPTile({ icon, label, value, color }) {
  return (
    <Card padding={16}>
      <div style={{ display:'flex', alignItems:'center', gap: 7, fontSize: 11.5, color:'#6B7280', fontWeight: 500, textTransform:'uppercase', letterSpacing:'0.04em' }}>
        <Icon name={icon} size={13} color="#6B2FA0"/> {label}
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
          background: open ? '#FAFAFC' : '#fff', borderBottom: open ? '1px solid #F3F4F6' : 'none' }}>
        <Icon name="chevron-down" size={15} color="#6B2FA0" style={{ transform: open ? 'rotate(180deg)' : 'none', transition:'transform 150ms' }}/>
        <span style={{ fontFamily:'ui-monospace, SFMono-Regular, monospace', fontSize: 11.5, fontWeight: 700, color:'#6B2FA0', background:'rgba(107,47,160,0.08)', padding:'1px 7px', borderRadius: 4 }}>{cat.id}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color:'#111827' }}>{cat.name}</span>
        <span style={{ fontSize: 11, color:'#9CA3AF', marginLeft:'auto' }}>{rows.length} procedure{rows.length===1?'':'s'}</span>
      </div>
      {open && (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background:'#FAFAFC' }}>
                {['#','Procedure','Owner','Ver','Last reviewed','Notes',''].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'8px 14px', fontSize: 10.5, fontWeight: 600, color:'#6B7280', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={p.id} style={{ borderTop: i === 0 ? 'none' : '1px solid #F3F4F6' }}>
                  <td style={{ padding:'10px 14px', verticalAlign:'top' }}>
                    <span style={{ fontFamily:'ui-monospace, monospace', fontSize: 11, fontWeight: 600, color:'#6B2FA0', background:'rgba(107,47,160,0.08)', padding:'1px 6px', borderRadius: 4 }}>{p.id}</span>
                  </td>
                  <td style={{ padding:'10px 14px', verticalAlign:'top', color:'#111827', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding:'10px 14px', verticalAlign:'top', whiteSpace:'nowrap' }}>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Avatar name={p.owner} size={20}/><span style={{ color:'#374151', fontSize: 12 }}>{p.owner}</span></span>
                  </td>
                  <td style={{ padding:'10px 14px', verticalAlign:'top', fontFamily:'ui-monospace, monospace', fontSize: 11, color:'#4B5563' }}>{p.ver}</td>
                  <td style={{ padding:'10px 14px', verticalAlign:'top', fontSize: 11.5, color:'#6B7280', whiteSpace:'nowrap' }}>{p.last}</td>
                  <td style={{ padding:'10px 14px', verticalAlign:'top', fontSize: 11.5, color:'#4B5563', maxWidth: 420 }}>{p.notes}</td>
                  <td style={{ padding:'10px 14px', verticalAlign:'top', textAlign:'right' }}>
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" title="Open source"
                        style={{ display:'inline-flex', color:'#9CA3AF', padding:4, borderRadius:4 }}
                        onMouseEnter={e=>e.currentTarget.style.color='#6B2FA0'}
                        onMouseLeave={e=>e.currentTarget.style.color='#9CA3AF'}>
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
  const reviewedThisYear = OPSPROC_PROCEDURES.filter(p => /202[56]/.test(p.last) || /Feb 2026|Jan 2026|Ongoing/.test(p.last)).length;

  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap: 18, maxWidth: 1280 }}>
      {/* Header banner */}
      <div style={{ padding:'12px 16px', borderRadius: 10, background:'rgba(107,47,160,0.06)', border:'1px solid rgba(107,47,160,0.18)', fontSize: 12.5, color:'#4A1F70', lineHeight: 1.5, display:'flex', alignItems:'center', gap: 10, flexWrap:'wrap' }}>
        <Icon name="list-ordered" size={16} color="#6B2FA0"/>
        <span><strong style={{ fontWeight: 600 }}>Annex A 5.37 — Documented Operating Procedures Register.</strong> Centralised, version-controlled index of every documented operating procedure across the ISMS. Mirrors register v1.1 (15.06.2026 pre-audit refresh).</span>
        <div style={{ marginLeft:'auto', display:'flex', gap: 6 }}>
          <a href={OPSPROC_REGISTER_URL} target="_blank" rel="noopener noreferrer" style={btnLink}>
            <Icon name="external-link" size={12}/> Register v1.1
          </a>
          <a href={OPSPROC_REGISTER_PDF} target="_blank" rel="noopener noreferrer" style={btnLink}>
            <Icon name="file-text" size={12}/> PDF v1.1
          </a>
        </div>
      </div>

      {/* KPI tiles */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 14 }}>
        <OPTile icon="list-checks" label="Procedures"          value={total} color="#111827"/>
        <OPTile icon="folder"      label="Categories"          value={cats}  color="#6B2FA0"/>
        <OPTile icon="check-circle-2" label="Reviewed (current cycle)" value={reviewedThisYear} color="#047857"/>
        <OPTile icon="alert-triangle" label="Tracked gaps"     value={OPSPROC_GAPS.length} color="#B45309"/>
      </div>

      {/* Owner filter */}
      <div style={{ display:'flex', alignItems:'center', gap: 8, flexWrap:'wrap' }}>
        <span style={{ fontSize: 11.5, color:'#6B7280', fontWeight: 500, textTransform:'uppercase', letterSpacing:'0.04em' }}>Owner</span>
        {owners.map(o => (
          <button key={o} onClick={()=>setFilterOwner(o)} style={{
            padding:'4px 11px', borderRadius: 6,
            border:'1px solid ' + (filterOwner === o ? 'rgba(107,47,160,0.35)' : '#E5E7EB'),
            background: filterOwner === o ? 'rgba(107,47,160,0.08)' : '#fff',
            color: filterOwner === o ? '#4A1F70' : '#6B7280',
            fontSize: 11.5, fontWeight: 500, cursor:'pointer',
            fontFamily:'Poppins, sans-serif',
          }}>{o === 'all' ? 'All' : o}</button>
        ))}
        <span style={{ marginLeft:'auto', fontSize: 11.5, color:'#9CA3AF' }}>{procedures.length} of {total} shown</span>
      </div>

      {/* Category sections */}
      <div style={{ display:'flex', flexDirection:'column', gap: 14 }}>
        {OPSPROC_CATEGORIES.map(c => <OPCategorySection key={c.id} cat={c} procedures={procedures}/>)}
      </div>

      {/* Gaps */}
      <Card padding={0}>
        <div style={{ padding:'14px 18px 8px' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color:'#111827' }}>Identified gaps & improvement actions</h2>
          <div style={{ fontSize: 11.5, color:'#6B7280', marginTop: 2 }}>Tracked in the OFI / Corrective Actions registers</div>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ background:'#FAFAFC' }}>
              {['#','Gap','Risk','Responsible','Target'].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'8px 16px', fontSize: 10.5, fontWeight: 600, color:'#6B7280', letterSpacing:'0.06em', textTransform:'uppercase', borderTop:'1px solid #F3F4F6', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {OPSPROC_GAPS.map((g, i) => {
              const pc = OPS_RISK_PILL[g.risk];
              return (
                <tr key={g.id} style={{ borderTop: i === 0 ? 'none' : '1px solid #F3F4F6' }}>
                  <td style={{ padding:'10px 16px', verticalAlign:'top', fontFamily:'ui-monospace, monospace', fontSize: 11, fontWeight: 600, color:'#374151' }}>{g.id}</td>
                  <td style={{ padding:'10px 16px', color:'#111827', maxWidth: 640 }}>{g.text}</td>
                  <td style={{ padding:'10px 16px' }}>
                    <span style={{ padding:'2px 9px', borderRadius: 9999, background: pc.bg, color: pc.fg, fontSize: 11, fontWeight: 600 }}>{g.risk}</span>
                  </td>
                  <td style={{ padding:'10px 16px', color:'#4B5563', whiteSpace:'nowrap' }}>{g.resp}</td>
                  <td style={{ padding:'10px 16px', color:'#4B5563', whiteSpace:'nowrap' }}>{g.target}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Review & maintenance */}
      <Card padding={18}>
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color:'#111827' }}>Review & maintenance</h2>
        <ul style={{ margin:'8px 0 0', paddingLeft: 18, fontSize: 12.5, color:'#374151', lineHeight: 1.6 }}>
          <li><strong>Owner:</strong> Alex (CISO)</li>
          <li><strong>Last reviewed:</strong> 15.06.2026 (pre-audit refresh)</li>
          <li><strong>Next review due:</strong> March 2027</li>
          <li><strong>Update triggers:</strong> a procedure is added, changed, retired; an owner changes; an audit or management-review finding requires it.</li>
        </ul>
      </Card>
    </div>
  );
}

const btnLink = {
  display:'inline-flex', alignItems:'center', gap: 5,
  fontSize: 11.5, fontWeight: 500, color:'#6B2FA0', textDecoration:'none',
  border:'1px solid rgba(107,47,160,0.25)', borderRadius: 7, padding:'4px 10px',
  background:'#fff',
};

Object.assign(window, { OperatingProceduresPage });
