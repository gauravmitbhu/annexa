// Overview · Row 2 — Annex A control heatmap

function ControlSquare({ ctrl }) {
  const c = STATUS_COLOR[ctrl.status];
  return (
    <div className="tt" style={{
      width: 22, height: 22, borderRadius: 4,
      background: c.bg, opacity: ctrl.status === 'ok' ? 0.85 : 1,
      cursor:'pointer',
      boxShadow: ctrl.status === 'red' ? '0 0 0 2px rgba(239,68,68,0.25)' : 'none',
    }}>
      <div className="tt-body">
        <div style={{ fontWeight: 600 }}>A.{ctrl.id} · {ctrl.name}</div>
        <div style={{ color:'#9CA3AF', marginTop: 2 }}>Owner: {ctrl.owner} · reviewed {ctrl.last}</div>
        <div style={{ color: c.bg, marginTop: 2, fontWeight: 600 }}>{c.label}</div>
      </div>
    </div>
  );
}

function HeatmapRow({ group }) {
  const ctrls = CONTROLS.filter(c => c.group === group.id);
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
      <div style={{ width: 130, flexShrink: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color:'#111827' }}>{group.label}</div>
        <div style={{ fontSize: 10.5, color:'#6B7280', marginTop: 1 }}>A.{group.range} · {ctrls.length}</div>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap: 4 }}>
        {ctrls.map(c => <ControlSquare key={c.id} ctrl={c}/>)}
      </div>
    </div>
  );
}

function Heatmap() {
  return (
    <Card padding={20}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color:'#111827' }}>Annex A Control Heatmap</h2>
          <div style={{ fontSize: 11.5, color:'#6B7280', marginTop: 2 }}>93 controls · ISO/IEC 27001:2022</div>
        </div>
        <div style={{ display:'flex', gap: 12, fontSize: 11, color:'#6B7280' }}>
          {Object.entries(STATUS_COLOR).map(([k,v]) => (
            <div key={k} style={{ display:'flex', alignItems:'center', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: v.bg, display:'inline-block' }}/>
              {v.label}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap: 14 }}>
        {ANNEX_GROUPS.map(g => <HeatmapRow key={g.id} group={g} />)}
      </div>
    </Card>
  );
}

function OverviewHeatmap() {
  return (
    <div style={{ maxWidth: 1280, padding:'18px 24px 0' }}>
      <Heatmap/>
    </div>
  );
}

registerWidget('overview-heatmap', OverviewHeatmap);
