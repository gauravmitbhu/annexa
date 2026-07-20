// App shell — sidebar, top breadcrumb bar, route switching, AI panel orchestration
const { useState: useAppState } = React;

function SidebarItem({ item, active, collapsed, onClick }) {
  const [h, setH] = useAppState(false);
  return (
    <a href="#" onClick={e=>{ e.preventDefault(); onClick(); }}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:'flex', alignItems:'center', gap: 12,
        padding: collapsed ? '10px 0' : '9px 12px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 7,
        background: active ? 'rgba(255,255,255,0.14)' : h ? 'rgba(255,255,255,0.06)' : 'transparent',
        color: active ? '#fff' : 'rgba(233,213,255,0.9)',
        fontSize: 13, fontWeight: active ? 600 : 500,
        textDecoration:'none', transition:'all 150ms',
        position:'relative',
      }}>
      {active && !collapsed && (
        <span style={{
          position:'absolute', left: 0, top: 6, bottom: 6, width: 2,
          background:'#E91E63', borderRadius: 9999,
        }}/>
      )}
      <Icon name={item.icon} size={17}/>
      {!collapsed && <span>{item.label}</span>}
    </a>
  );
}

function Sidebar({ active, setActive, collapsed, onToggle }) {
  const w = collapsed ? 64 : 220;
  return (
    <aside style={{
      width: w, background:'#3B1A6B',
      color:'#E9D5FF', flexShrink: 0,
      display:'flex', flexDirection:'column',
      transition:'width 200ms',
    }}>
      <div style={{
        padding: collapsed ? '18px 8px 18px' : '18px 18px 18px',
        display:'flex', alignItems:'center',
        justifyContent: collapsed ? 'center' : 'space-between',
      }}>
        {!collapsed ? (
          <div>
            <div style={{ fontSize: 18, fontWeight: 1000, color:'#fff', letterSpacing:'-0.02em', lineHeight: 1 }}>
              acme
            </div>
            <div style={{ fontSize: 9.5, color:'#FF5C8D', marginTop: 3, fontWeight: 500, letterSpacing:'0.04em' }}>
              ISMS · ISO 27001
            </div>
          </div>
        ) : (
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background:'#E91E63', color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight: 1000, fontSize: 13,
          }}>a</div>
        )}
        {!collapsed && (
          <button onClick={onToggle} style={{
            border:'none', background:'transparent', cursor:'pointer',
            color:'rgba(233,213,255,0.7)', padding: 4,
          }}><Icon name="panel-left-close" size={16}/></button>
        )}
      </div>

      {collapsed && (
        <button onClick={onToggle} style={{
          border:'none', background:'transparent', cursor:'pointer',
          color:'rgba(233,213,255,0.7)', padding: '0 0 10px',
          display:'flex', justifyContent:'center',
        }}><Icon name="panel-left-open" size={16}/></button>
      )}

      <nav style={{
        flex: 1, padding: collapsed ? '0 8px' : '0 10px',
        display:'flex', flexDirection:'column', gap: 2,
      }}>
        {NAV.map(n => (
          <SidebarItem key={n.id} item={n} active={n.id === active}
            collapsed={collapsed} onClick={()=>setActive(n.id)}/>
        ))}
      </nav>

      <div style={{
        padding: collapsed ? '12px 8px' : '12px 14px',
        borderTop:'1px solid rgba(255,255,255,0.08)',
        display:'flex', alignItems:'center',
        justifyContent: collapsed ? 'center' : 'flex-start', gap: 10,
      }}>
        <Avatar name="Alex" size={collapsed ? 30 : 32} bg="#E91E63"/>
        {!collapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, color:'#fff', fontWeight: 500 }}>Alex</div>
              <div style={{ fontSize: 10, color:'#C9B1E0' }}>CISO · Acme</div>
            </div>
            <Icon name="log-out" size={14} color="#C9B1E0"/>
          </>
        )}
      </div>
    </aside>
  );
}

function TopBar({ collapsed }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'12px 24px', borderBottom:'1px solid #E5E7EB',
      background:'#fff', flexShrink: 0,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8, fontSize: 13 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 5,
            background:'#3B1A6B', color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize: 11, fontWeight: 700,
          }}>A</div>
          <span style={{ color:'#111827', fontWeight: 600 }}>Acme S.A.</span>
          <span style={{ color:'#D1D5DB' }}>/</span>
          <span style={{ color:'#6B7280' }}>ISMS</span>
          <span style={{ color:'#D1D5DB' }}>/</span>
          <span style={{ color:'#111827', fontWeight: 500 }}>Overview</span>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
        <CountdownChip days={56}/>
        <div style={{ display:'flex', alignItems:'center', gap: 4 }}>
          <button style={topIconBtn}><Icon name="search" size={15} color="#6B7280"/></button>
          <button style={topIconBtn}>
            <Icon name="bell" size={15} color="#6B7280"/>
            <span style={{
              position:'absolute', top: 6, right: 6,
              width: 7, height: 7, borderRadius: 9999,
              background:'#E91E63', border:'2px solid #fff',
            }}/>
          </button>
          <button style={topIconBtn}><Icon name="help-circle" size={15} color="#6B7280"/></button>
        </div>
      </div>
    </div>
  );
}

const topIconBtn = {
  width: 32, height: 32, borderRadius: 6,
  border:'none', background:'transparent', cursor:'pointer',
  display:'inline-flex', alignItems:'center', justifyContent:'center',
  position:'relative',
};

function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{
      padding:'20px 24px 0', display:'flex', alignItems:'flex-end', justifyContent:'space-between',
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color:'#111827', letterSpacing:'-0.01em' }}>{title}</h1>
        <div style={{ fontSize: 13, color:'#6B7280', marginTop: 4 }}>{subtitle}</div>
      </div>
      {action}
    </div>
  );
}

function StubPage({ title }) {
  return (
    <div style={{ padding: 60, textAlign:'center' }}>
      <div style={{
        width: 56, height: 56, borderRadius: 12,
        background:'rgba(107,47,160,0.08)',
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        marginBottom: 16,
      }}><Icon name="construction" size={28} color="#6B2FA0"/></div>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color:'#111827' }}>{title}</h2>
      <div style={{ fontSize: 13, color:'#6B7280', marginTop: 6 }}>
        Read-only view of this domain. Pulled from connected systems.
      </div>
    </div>
  );
}

function App() {
  const [route, setRoute] = useAppState(() => sessionStorage.getItem('lastRoute') || 'overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useAppState(false);
  const [aiCollapsed, setAiCollapsed] = useAppState(false);
  const [aiMode, setAiMode] = useAppState('thread'); // 'thread' | 'empty'
  // Generalized drawer state: { type: 'control'|'incident'|'ofi'|'audit', data: object } | null
  const [drawer, setDrawer] = useAppState(() => {
    try {
      const saved = sessionStorage.getItem('openDrawer');
      if (!saved) return null;
      const { type, id } = JSON.parse(saved);
      if (type === 'control') {
        const ctrl = CONTROLS.find(c => c.id === id);
        return ctrl ? { type: 'control', data: ctrl } : null;
      }
    } catch(e) {}
    return null;
  });

  // Persist route and drawer so auto-reload restores position
  React.useEffect(() => { sessionStorage.setItem('lastRoute', route); }, [route]);

  // Allow child components (e.g. Overview "View all" button) to navigate.
  React.useEffect(() => {
    const h = (e) => { if (e.detail && e.detail.route) setRoute(e.detail.route); };
    window.addEventListener('claude:setroute', h);
    return () => window.removeEventListener('claude:setroute', h);
  }, []);
  const setDrawerPersisted = React.useCallback((val) => {
    setDrawer(val);
    if (!val) sessionStorage.removeItem('openDrawer');
    else if (val.type === 'control') sessionStorage.setItem('openDrawer', JSON.stringify({ type: 'control', id: val.data.id }));
    else sessionStorage.removeItem('openDrawer');
  }, []);

  const aiContext = drawer
    ? (drawer.type === 'control'  ? `Control ${drawer.data.id}` :
       drawer.type === 'incident' ? `Incident ${drawer.data.id}` :
       drawer.type === 'ofi'      ? drawer.data.id :
       drawer.type === 'audit'    ? `Audit ${drawer.data.id}` :
       'Detail')
    : route === 'overview'  ? 'Overview'
    : route === 'core'      ? 'ISMS Core'
    : route === 'controls'  ? 'Controls'
    : route === 'incidents' ? 'Incidents'
    : route === 'audits'    ? 'Audits & Findings'
    : route.charAt(0).toUpperCase() + route.slice(1);

  const aiContextDetail = drawer
    ? (drawer.data.name || drawer.data.title || 'detail view')
    : route === 'overview'  ? '92 controls in scope'
    : route === 'core'      ? `${ISMS_CLAUSES.reduce((n,g)=>n+g.items.length,0)} clauses · 4–10`
    : route === 'controls'  ? `${CONTROLS.length} controls`
    : route === 'incidents' ? `${INCIDENTS.length} active`
    : route === 'audits'    ? `${AUDIT_REPORTS.length} ${AUDIT_REPORTS.length === 1 ? 'report' : 'reports'} · ${OFIS.length} OFIs`
    : 'whole ISMS';

  const renderMain = () => {
    if (route === 'overview')  return <Overview/>;
    if (route === 'core')      return <ISMSCorePage/>;
    if (route === 'controls')  return <ControlsPage  onOpenDrawer={(c)=>setDrawerPersisted({type:'control',  data: c})}/>;
    if (route === 'incidents') return <IncidentsPage onOpenDrawer={(i)=>setDrawerPersisted({type:'incident', data: i})}/>;
    if (route === 'audits')    return <AuditsPage    onOpenDrawer={setDrawerPersisted}/>;
    if (route === 'risks')     return <RisksPage/>;
    if (route === 'vendors')   return <VendorsPage/>;
    if (route === 'policies')  return <PoliciesPage/>;
    if (route === 'people')    return <PeoplePage/>;
    if (route === 'evidence')  return <EvidenceLibraryPage/>;
    if (route === 'opsproc')   return <OperatingProceduresPage/>;
    if (route === 'roadmap')   return <RoadmapPage/>;
    if (route === 'exceptions')return <ExceptionsPage/>;
    return <StubPage title={NAV.find(n=>n.id===route)?.label || 'Page'} />;
  };

  const subtitleFor = (r) => (
    r === 'overview'  ? 'Posture, gaps, exceptions, and audit timeline.' :
    r === 'core'      ? 'Management-system requirements — the Day 1 morning audit focus.' :
    r === 'controls'  ? 'All 93 ISO/IEC 27001:2022 controls.' :
    r === 'incidents' ? `${INCIDENTS.length} recent incidents across canonical and ISMS lists.` :
    r === 'audits'    ? `${AUDIT_REPORTS.length} audit report(s) · ${OFIS.length}-item OFI register.` :
    r === 'risks'     ? '3×3 canonical matrix (Policy 23 v1.0) · 50 risks · live risk register.' :
    r === 'vendors'   ? `${VENDORS.length} suppliers · review cadence per Policy 22.` :
    r === 'policies'  ? `${POLICY_REGISTER.length} policies · all released v1.0+ and approved.` :
    r === 'people'    ? 'Security awareness programme · live from Moodle when connected.' :
    r === 'evidence'  ? 'Consolidated evidence register across the whole ISMS (clause 7.5).' :
    r === 'exceptions'? `${EXCEPTIONS.length} exceptions · Exception Request Form · 12-month review cycle.` :
    ''
  );

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:'Poppins, sans-serif' }}>
      <Sidebar active={route} setActive={(id)=>{ setRoute(id); setDrawerPersisted(null); }}
        collapsed={sidebarCollapsed} onToggle={()=>setSidebarCollapsed(!sidebarCollapsed)}/>

      <div style={{ flex: 1, display:'flex', flexDirection:'column', minWidth: 0, position:'relative' }}>
        <TopBar collapsed={sidebarCollapsed}/>

        <PageHeader
          title={
            route === 'overview' ? 'Overview' :
            route === 'core'     ? 'ISMS Core (Clauses 4–10)' :
            route === 'controls' ? 'Controls (Annex A)' :
            (NAV.find(n=>n.id===route)?.label || '')
          }
          subtitle={subtitleFor(route)}
          action={
            <div style={{ display:'flex', gap: 8, padding: '0 0 4px' }}>
              <Button variant="outline" size="sm" icon="download">Export</Button>
              <Button variant="outline" size="sm" icon="refresh-cw">Sync</Button>
              <button onClick={()=>setAiMode(m => m==='thread'?'empty':'thread')}
                style={{
                  fontSize: 11, color:'#6B7280', background:'transparent',
                  border:'1px dashed #D1D5DB', borderRadius: 6, padding:'5px 10px',
                  cursor:'pointer', fontFamily:'Poppins, sans-serif',
                }}>demo: toggle AI {aiMode==='thread'?'empty':'thread'}</button>
            </div>
          }
        />

        <div style={{ flex: 1, overflow:'auto', position:'relative' }} className="scroll-y">
          {renderMain()}
        </div>

        {drawer && drawer.type === 'control'  && <ControlDrawer  ctrl={drawer.data}     onClose={()=>setDrawerPersisted(null)}/>}
        {drawer && drawer.type === 'incident' && <IncidentDrawer incident={drawer.data} onClose={()=>setDrawerPersisted(null)}/>}
        {drawer && drawer.type === 'ofi'      && <OFIDrawer      ofi={drawer.data}      onClose={()=>setDrawerPersisted(null)}/>}
        {drawer && drawer.type === 'audit'    && <AuditDrawer    audit={drawer.data}    onClose={()=>setDrawerPersisted(null)}/>}
      </div>

      {aiCollapsed
        ? <CollapsedAI onOpen={()=>setAiCollapsed(false)}/>
        : <AIPanel
            context={aiContext}
            contextDetail={aiContextDetail}
            mode={aiMode}
            drawerOpen={!!(drawer && drawer.type === 'control')}
            controlId={drawer && drawer.type === 'control' ? `A.${drawer.data.id}` : null}
            onCollapse={()=>setAiCollapsed(true)}
          />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
