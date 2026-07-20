// Generic App shell — everything it renders (brand, nav, pages, drawers) comes
// from site/site.json + the widget registry. This file is part of the
// protected engine: structure changes belong in site.json and widgets/.
const { useState: useAppState } = React;

class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (this.state.err) return <WidgetErrorCard name={this.props.name} error={String(this.state.err)} />;
    return this.props.children;
  }
}

function WidgetErrorCard({ name, error }) {
  const fixPrompt = `The widget "${name}" is broken. Error: ${error}. Please fix it.`;
  return (
    <div style={{
      margin: 24, padding: 20, borderRadius: 10,
      background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C',
    }}>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>
        <Icon name="alert-triangle" size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
        Widget “{name}” failed
      </div>
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: 11.5, margin: '0 0 10px' }}>{error}</pre>
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('askclaude:item', {
          detail: { label: `Fix widget ${name}`, prompt: fixPrompt } }))}
        style={{
          fontFamily: 'Poppins, sans-serif', fontSize: 12, fontWeight: 500,
          color: '#fff', background: 'linear-gradient(135deg,#6B2FA0,#E91E63)',
          border: 'none', borderRadius: 7, padding: '6px 12px', cursor: 'pointer',
        }}>
        <Icon name="sparkles" size={11} style={{ verticalAlign: 'middle', marginRight: 5 }} />
        Fix with AI
      </button>
    </div>
  );
}

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
  const brand = SITE.brand || {};
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
              {brand.name || 'site'}
            </div>
            <div style={{ fontSize: 9.5, color:'#FF5C8D', marginTop: 3, fontWeight: 500, letterSpacing:'0.04em' }}>
              {brand.tagline || ''}
            </div>
          </div>
        ) : (
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background:'#E91E63', color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight: 1000, fontSize: 13,
          }}>{(brand.name || 's')[0]}</div>
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
        {SITE.nav.map(n => (
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
        <Avatar name={(SITE.user || {}).name || 'U'} size={collapsed ? 30 : 32} bg="#E91E63"/>
        {!collapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, color:'#fff', fontWeight: 500 }}>{(SITE.user || {}).name || ''}</div>
              <div style={{ fontSize: 10, color:'#C9B1E0' }}>{(SITE.user || {}).role || ''}</div>
            </div>
            <Icon name="log-out" size={14} color="#C9B1E0"/>
          </>
        )}
      </div>
    </aside>
  );
}

function TopBar({ routeLabel }) {
  const brand = SITE.brand || {};
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
          }}>{(brand.legalName || brand.name || 'S')[0].toUpperCase()}</div>
          <span style={{ color:'#111827', fontWeight: 600 }}>{brand.legalName || brand.name}</span>
          <span style={{ color:'#D1D5DB' }}>/</span>
          <span style={{ color:'#6B7280' }}>{brand.section || 'ISMS'}</span>
          <span style={{ color:'#D1D5DB' }}>/</span>
          <span style={{ color:'#111827', fontWeight: 500 }}>{routeLabel}</span>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
        {typeof CountdownChip === 'function' && SITE.countdownDays != null && <CountdownChip days={SITE.countdownDays}/>}
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

// Renders one page's sections[] from the spec via the widget registry.
function PageBody({ page, pageId, openDrawer }) {
  if (!page || !page.sections || !page.sections.length) {
    const label = (SITE.nav.find(n => n.id === pageId) || {}).label || 'Page';
    return <StubPage title={label}/>;
  }
  return (
    <>
      {page.sections.map((sec, i) => {
        const W = getWidget(sec.widget);
        const loadErr = (window.__WIDGET_ERRORS || []).find(e => e.file.includes(sec.widget));
        if (!W) return <WidgetErrorCard key={i} name={sec.widget}
          error={loadErr ? loadErr.error : 'not registered — is the widget file present and does it call registerWidget()?'}/>;
        // Widgets that open drawers get onOpenDrawer; plain objects are wrapped
        // with the page's drawerType, pre-shaped {type,data} passes through.
        const onOpenDrawer = (x) => openDrawer(
          x && x.type && x.data !== undefined ? x : { type: page.drawerType || 'detail', data: x });
        return (
          <ErrorBoundary key={sec.widget + i} name={sec.widget}>
            <W onOpenDrawer={onOpenDrawer} {...(sec.props || {})}/>
          </ErrorBoundary>
        );
      })}
    </>
  );
}

function App() {
  const [route, setRoute] = useAppState(() => {
    const saved = sessionStorage.getItem('lastRoute');
    const known = saved && (SITE.pages[saved] || SITE.nav.some(n => n.id === saved));
    return known ? saved : (SITE.defaultRoute || SITE.nav[0].id);
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useAppState(false);
  const [aiCollapsed, setAiCollapsed] = useAppState(false);
  const [aiMode, setAiMode] = useAppState('thread'); // 'thread' | 'empty'
  const [drawer, setDrawer] = useAppState(() => {
    try {
      const saved = sessionStorage.getItem('openDrawer');
      if (!saved) return null;
      const { type, id } = JSON.parse(saved);
      if (type === 'control') {
        const ctrl = (window.CONTROLS || []).find(c => c.id === id);
        return ctrl ? { type: 'control', data: ctrl } : null;
      }
    } catch(e) {}
    return null;
  });

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

  const page = SITE.pages[route];
  const routeLabel = (SITE.nav.find(n => n.id === route) || {}).label || '';

  const aiContext = drawer
    ? (drawer.type === 'control'  ? `Control ${drawer.data.id}` :
       drawer.type === 'incident' ? `Incident ${drawer.data.id}` :
       drawer.type === 'ofi'      ? drawer.data.id :
       drawer.type === 'audit'    ? `Audit ${drawer.data.id}` :
       'Detail')
    : (page && page.aiContext) || routeLabel || route;

  const aiContextDetail = drawer
    ? (drawer.data.name || drawer.data.title || 'detail view')
    : tpl((page && page.aiContextDetail) || 'whole ISMS');

  // Drawer rendering from the spec: {"control": {"widget": "...", "prop": "ctrl"}, ...}
  const renderDrawer = () => {
    if (!drawer) return null;
    const cfg = (SITE.drawers || {})[drawer.type];
    if (!cfg) return null;
    const W = getWidget(cfg.widget);
    if (!W) return <WidgetErrorCard name={cfg.widget} error="drawer widget not registered"/>;
    const props = { onClose: () => setDrawerPersisted(null) };
    props[cfg.prop || 'data'] = drawer.data;
    return <ErrorBoundary name={cfg.widget}><W {...props}/></ErrorBoundary>;
  };

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:'Poppins, sans-serif' }}>
      <Sidebar active={route} setActive={(id)=>{ setRoute(id); setDrawerPersisted(null); }}
        collapsed={sidebarCollapsed} onToggle={()=>setSidebarCollapsed(!sidebarCollapsed)}/>

      <div style={{ flex: 1, display:'flex', flexDirection:'column', minWidth: 0, position:'relative' }}>
        <TopBar routeLabel={routeLabel}/>

        <PageHeader
          title={(page && page.title) || routeLabel}
          subtitle={tpl((page && page.subtitle) || '')}
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
          <PageBody page={page} pageId={route} openDrawer={setDrawerPersisted}/>
        </div>

        {renderDrawer()}
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

Object.assign(window, { App, PageHeader, StubPage, WidgetErrorCard, ErrorBoundary });
