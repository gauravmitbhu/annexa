// Incidents page — read-only list of recent ISMS incidents.
// Same table + slide-over drawer pattern as ControlsPage.
const { useState: useIncState } = React;

function IncidentsPage({ onOpenDrawer }) {
  const [filterSeverity, setFilterSeverity] = useIncState('all');
  const [filterStatus,   setFilterStatus]   = useIncState('all');
  const [filterList,     setFilterList]     = useIncState('all');

  const lists = ['all', ...Array.from(new Set(INCIDENTS.map(i => i.list)))];

  const rows = INCIDENTS.filter(i =>
    (filterSeverity === 'all' || i.severity === filterSeverity) &&
    (filterStatus   === 'all' || i.status   === filterStatus) &&
    (filterList     === 'all' || i.list     === filterList)
  );

  return (
    <div style={{ padding: '16px 24px 40px' }}>
      {/* Filter chips */}
      <div style={{ display:'flex', gap: 16, marginBottom: 14, flexWrap:'wrap' }}>
        <FilterGroup label="Severity" value={filterSeverity} onChange={setFilterSeverity}
          options={['all','Urgent','High','Medium','Low']}/>
        <FilterGroup label="Status" value={filterStatus} onChange={setFilterStatus}
          options={['all','New','Open','In progress','Resolved']}/>
        <FilterGroup label="List" value={filterList} onChange={setFilterList}
          options={lists}/>
      </div>

      <Card padding={0}>
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'14px 16px', borderBottom:'1px solid #F3F4F6',
        }}>
          <SectionTitle>Incidents</SectionTitle>
          <div style={{ fontSize: 11.5, color:'#6B7280' }}>
            {rows.length} of {INCIDENTS.length} · click a row for detail
          </div>
        </div>

        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background:'#FAFAFC' }}>
                <th style={incThStyle}>ID</th>
                <th style={incThStyle}>TITLE</th>
                <th style={incThStyle}>SEVERITY</th>
                <th style={incThStyle}>STATUS</th>
                <th style={incThStyle}>LIST</th>
                <th style={incThStyle}>FILED</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((i, idx) => {
                const sev = SEVERITY_COLOR[i.severity] || SEVERITY_COLOR.Medium;
                return (
                  <tr key={i.id}
                      onClick={()=>onOpenDrawer(i)}
                      style={{
                        cursor:'pointer',
                        borderTop: idx === 0 ? 'none' : '1px solid #F3F4F6',
                        transition:'background 120ms',
                      }}
                      onMouseEnter={e=>e.currentTarget.style.background='#FAFAFC'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={incTdStyle}>
                      <span style={{
                        display:'inline-block', padding:'2px 8px',
                        borderRadius: 4, background:'#F3F4F6',
                        fontSize: 11, fontWeight: 600, color:'#374151',
                        fontFamily:'ui-monospace, SFMono-Regular, monospace',
                      }}>{i.id}</span>
                    </td>
                    <td style={{ ...incTdStyle, maxWidth: 480, color:'#111827' }}>{i.title}</td>
                    <td style={incTdStyle}>
                      <span style={{
                        display:'inline-flex', alignItems:'center', gap: 5,
                        padding:'2px 9px', borderRadius: 9999,
                        background: sev.bg, color: sev.fg,
                        fontSize: 11, fontWeight: 600,
                      }}>
                        <span style={{ width:6, height:6, borderRadius:'50%', background: sev.dot }}/>
                        {i.severity}
                      </span>
                    </td>
                    <td style={{ ...incTdStyle, color:'#374151' }}>{i.status}</td>
                    <td style={{ ...incTdStyle, color:'#6B7280', fontSize: 12 }}>{i.list}</td>
                    <td style={{ ...incTdStyle, color:'#6B7280', fontSize: 12 }}>{i.filed}</td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 40, textAlign:'center', color:'#9CA3AF', fontSize: 13 }}>
                  No incidents match the current filters.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

const incThStyle = {
  textAlign:'left', padding:'10px 16px', fontSize: 10.5,
  fontWeight: 600, color:'#6B7280', letterSpacing:'0.06em',
  textTransform:'uppercase', borderBottom:'1px solid #E5E7EB',
};
const incTdStyle = { padding:'12px 16px', verticalAlign:'middle' };

function FilterGroup({ label, value, onChange, options }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
      <span style={{ fontSize: 11, color:'#9CA3AF', fontWeight: 500, textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}:</span>
      <div style={{ display:'flex', gap: 4 }}>
        {options.map(o => (
          <button key={o} onClick={()=>onChange(o)}
            style={{
              padding:'4px 10px', borderRadius: 6,
              border: '1px solid ' + (value === o ? 'rgba(107,47,160,0.35)' : '#E5E7EB'),
              background: value === o ? 'rgba(107,47,160,0.08)' : '#fff',
              color: value === o ? '#4A1F70' : '#6B7280',
              fontSize: 11.5, fontWeight: 500, cursor:'pointer',
              fontFamily:'Poppins, sans-serif',
            }}>
            {o === 'all' ? 'All' : o}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Drawer ────────────────────────────────────────────────────────────────
function IncidentDrawer({ incident: i, onClose }) {
  const sev = SEVERITY_COLOR[i.severity] || SEVERITY_COLOR.Medium;
  return (
    <div style={{
      position:'absolute', inset: 0,
      background:'rgba(17,24,39,0.35)',
      display:'flex', justifyContent:'flex-end',
      zIndex: 40,
    }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()}
        style={{
          width: 480, background:'#fff', height:'100%',
          boxShadow:'-12px 0 24px rgba(0,0,0,0.12)',
          display:'flex', flexDirection:'column',
          animation: 'slideIn 200ms ease-out',
        }}>
        {/* Header */}
        <div style={{ padding:'18px 22px 14px', borderBottom:'1px solid #E5E7EB' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 8 }}>
            <span style={{
              padding:'3px 10px', borderRadius: 6, background:'#F3F4F6',
              fontSize: 11.5, fontWeight: 600, color:'#374151',
              fontFamily:'ui-monospace, SFMono-Regular, monospace',
            }}>{i.id}</span>
            <button onClick={onClose} style={{
              border:'none', background:'transparent', cursor:'pointer',
              padding: 4, color:'#9CA3AF',
            }}><Icon name="x" size={18}/></button>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color:'#111827', lineHeight: 1.35, marginBottom: 10 }}>
            {i.title}
          </div>
          <div style={{ display:'flex', gap: 8, alignItems:'center' }}>
            <span style={{
              display:'inline-flex', alignItems:'center', gap: 5,
              padding:'3px 10px', borderRadius: 9999,
              background: sev.bg, color: sev.fg,
              fontSize: 11, fontWeight: 600,
            }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background: sev.dot }}/>
              {i.severity}
            </span>
            <span style={{ fontSize: 12, color:'#6B7280' }}>· {i.status}</span>
            <span style={{ fontSize: 12, color:'#6B7280' }}>· filed {i.filed}</span>
          </div>
        </div>

        {/* Body */}
        <div className="scroll-y" style={{ flex: 1, overflowY:'auto', padding:'18px 22px' }}>
          <DetailSection title="Source list">
            <div style={{ fontSize: 13, color:'#374151' }}>{i.list}</div>
          </DetailSection>

          {i.subtasks && (
            <DetailSection title="Sub-tasks">
              <div style={{ fontSize: 13, color:'#374151' }}>
                {i.subtasks} linked sub-tasks (offboarding remediation steps).
              </div>
            </DetailSection>
          )}

          <DetailSection title="Context">
            <div style={{ fontSize: 12.5, color:'#4B5563', lineHeight: 1.55 }}>
              {i.id === 'INCIDENT-335' && 'Surfaced during the management review: a former employee\'s admin account on a SaaS billing tool was still active. Triggered a review of all leaver access entries.'}
              {i.id === 'ISMS-2710' && 'KPI #3 measurement: endpoint agent rollout stalled at 1 of 11 endpoints. Root cause under investigation.'}
              {i.id === 'ISMS-2711' && 'KPI #2 SLA timeliness measured at ~33% (4 of 12 incidents within SLA). SLA relaxation proposal filed alongside.'}
              {i.id === 'ISMS-2712' && 'Contractor laptop missed provisioning deadline. Device shipping; closes once enrolled in MDM + endpoint protection.'}
              {i.id === 'ISMS-2708' && 'OFI-list sibling record of ISMS-2711 — same KPI #2 incident reflected in the OFI tracking system.'}
              {i.id === 'ISMS-2709' && 'KPI #4b measurement: risk-to-control coverage at ~91%. Several risks lack documented control mappings.'}
            </div>
          </DetailSection>

          <DetailSection title="Ticket">
            <a href={i.link} target="_blank" rel="noopener noreferrer"
              style={{
                display:'inline-flex', alignItems:'center', gap: 6,
                padding:'8px 14px', borderRadius: 8,
                background:'linear-gradient(135deg,#6B2FA0,#E91E63)', color:'#fff',
                fontSize: 12.5, fontWeight: 500, textDecoration:'none',
              }}>
              <Icon name="external-link" size={13}/> View ticket
            </a>
          </DetailSection>
        </div>
      </div>
    </div>
  );
}

function DetailSection({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        fontSize: 10.5, fontWeight: 600, color:'#9CA3AF',
        letterSpacing:'0.08em', textTransform:'uppercase',
        marginBottom: 6,
      }}>{title}</div>
      {children}
    </div>
  );
}

Object.assign(window, { IncidentsPage, IncidentDrawer });

registerWidget('page-incidents', IncidentsPage);
registerWidget('drawer-incident', IncidentDrawer);
