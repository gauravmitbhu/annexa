// Overview · Row 6 — connected systems (+ dashboard footer)
const { useState: useOvSysState } = React;

function SystemTile({ s, loading }) {
  return (
    <div style={{
      background:'#fff', border:'1px solid var(--brand-border)', borderRadius: 10,
      padding: 12, display:'flex', alignItems:'center', gap: 10,
    }}>
      {loading ? (
        <>
          <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8 }}/>
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: '60%', height: 11, marginBottom: 5 }}/>
            <div className="skeleton" style={{ width: '40%', height: 9 }}/>
          </div>
        </>
      ) : (
        <>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: s.connected ? s.color : 'var(--brand-surface)',
            color: s.connected ? '#fff' : '#9A968C',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize: 12, fontWeight: 700, letterSpacing:'-0.02em',
            filter: s.connected ? 'none' : 'grayscale(1)',
          }}>{s.glyph}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 5 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: s.connected ? 'var(--brand-ink)' : 'var(--brand-muted)' }}>{s.name}</span>
              {s.connected && <Icon name="check-circle-2" size={11} color="#10B981"/>}
            </div>
            {s.connected ? (
              <div style={{ fontSize: 10.5, color:'var(--brand-muted)', display:'flex', alignItems:'center', gap: 4, marginTop: 1 }}>
                <span>synced {s.sync}</span>
                <span style={{ color:'#C6C4BB' }}>·</span>
                <span style={{
                  fontSize: 9.5, color:'var(--brand-accent)', background:'color-mix(in srgb, var(--brand-accent) 8%, transparent)',
                  padding:'1px 5px', borderRadius: 4, fontWeight: 500,
                }}>read-only</span>
              </div>
            ) : (
              <div style={{ fontSize: 10.5, color:'#9A968C', marginTop: 1 }}>Not connected</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ConnectedSystems({ skeletonId }) {
  return (
    <Card padding={20}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color:'var(--brand-ink)' }}>Connected Systems</h2>
        <div style={{ fontSize: 11, color:'var(--brand-muted)' }}>{SYSTEMS.filter(s=>s.connected).length} connected · {SYSTEMS.filter(s=>!s.connected).length} not yet wired</div>
      </div>
      {/* Same min-width:auto trap as the KPI row — six fixed tracks pushed this
          card 160px past the column. auto-fill reflows instead of overflowing. */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(138px, 1fr))', gap: 10 }}>
        {SYSTEMS.map(s => <SystemTile key={s.id} s={s} loading={s.id === skeletonId}/>)}
      </div>
      <div style={{ marginTop: 12, paddingTop: 10, borderTop:'1px solid var(--brand-surface)', fontSize: 11, color:'var(--brand-muted)', lineHeight: 1.5 }}>
        {typeof SYSTEMS_NOTE !== 'undefined' ? SYSTEMS_NOTE : ''}
      </div>
    </Card>
  );
}

function OverviewSystems() {
  // Demonstrate a skeleton on one tile briefly, then resolve.
  const [skel, setSkel] = useOvSysState(() => (SYSTEMS.find(s => !s.connected) || {}).id || null);
  React.useEffect(() => {
    const t = setTimeout(() => setSkel(null), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ maxWidth: 1280, padding:'18px 24px 24px' }}>
      <div style={{ display:'flex', flexDirection:'column', gap: 18 }}>
        <ConnectedSystems skeletonId={skel}/>

        {/* Footer */}
        <div style={{
          textAlign:'center', fontSize: 11, color:'#9A968C', padding:'4px 0 16px',
        }}>
          {[((window.SITE || {}).brand || {}).legalName, 'integrated management system', typeof AS_OF !== 'undefined' && AS_OF ? 'data as of ' + AS_OF : null].filter(Boolean).join(' · ')}
        </div>
      </div>
    </div>
  );
}

registerWidget('overview-systems', OverviewSystems);
