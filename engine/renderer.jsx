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
          color: '#fff', background: 'linear-gradient(135deg,var(--brand-accent),var(--brand-accent))',
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
        color: active ? '#fff' : 'rgba(235,235,232,0.9)',
        fontSize: 13, fontWeight: active ? 600 : 500,
        textDecoration:'none', transition:'all 150ms',
        position:'relative',
      }}>
      {active && !collapsed && (
        <span style={{
          position:'absolute', left: 0, top: 6, bottom: 6, width: 2,
          background:'var(--brand-accent)', borderRadius: 9999,
        }}/>
      )}
      <Icon name={item.icon} size={17}/>
      {!collapsed && <span>{item.label}</span>}
    </a>
  );
}

function useThemeLogo() {
  const [logo, setLogo] = useAppState(() => (window.THEME_LIVE || {}).logo || '');
  React.useEffect(() => {
    const h = (e) => setLogo((e.detail || {}).logo || '');
    window.addEventListener('theme:changed', h);
    return () => window.removeEventListener('theme:changed', h);
  }, []);
  return logo;
}

function BrandMark({ size, brand, logo, bg }) {
  if (logo) return <img src={logo} alt='' style={{ width: size, height: size, objectFit:'contain', borderRadius: 5, background:'#fff', padding: 2, flexShrink: 0 }}/>;
  return (
    <div style={{
      width: size, height: size, borderRadius: Math.round(size/4),
      background: bg, color:'var(--brand-on-accent)',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontWeight: 800, fontSize: Math.round(size*0.48), flexShrink: 0,
    }}>{(brand.legalName || brand.name || 'S')[0].toUpperCase()}</div>
  );
}

function Sidebar({ active, setActive, collapsed, onToggle }) {
  const w = collapsed ? 64 : 220;
  const brand = SITE.brand || {};
  const logo = useThemeLogo();
  return (
    <aside style={{
      width: w, background:'var(--brand-ink)',
      color:'#EBEBE8', flexShrink: 0,
      display:'flex', flexDirection:'column',
      transition:'width 200ms',
    }}>
      <div style={{
        padding: collapsed ? '18px 8px 18px' : '18px 18px 18px',
        display:'flex', alignItems:'center',
        justifyContent: collapsed ? 'center' : 'space-between',
      }}>
        {!collapsed ? (
          <div style={{ display:'flex', alignItems:'center', gap: 10, minWidth: 0 }}>
            {logo && <BrandMark size={28} brand={brand} logo={logo}/>}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 1000, color:'#fff', letterSpacing:'-0.02em', lineHeight: 1,
                            fontFamily:'var(--font-display)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {brand.name || 'site'}
              </div>
              <div style={{ fontSize: 9.5, color:'var(--brand-accent-2)', marginTop: 3, fontWeight: 500, letterSpacing:'0.04em' }}>
                {brand.tagline || ''}
              </div>
            </div>
          </div>
        ) : (
          <BrandMark size={28} brand={brand} logo={logo} bg="var(--brand-accent)"/>
        )}
        {!collapsed && (
          <button onClick={onToggle} style={{
            border:'none', background:'transparent', cursor:'pointer',
            color:'rgba(235,235,232,0.7)', padding: 4,
          }}><Icon name="panel-left-close" size={16}/></button>
        )}
      </div>

      {collapsed && (
        <button onClick={onToggle} style={{
          border:'none', background:'transparent', cursor:'pointer',
          color:'rgba(235,235,232,0.7)', padding: '0 0 10px',
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
        <Avatar name={(SITE.user || {}).name || 'U'} size={collapsed ? 30 : 32} bg="var(--brand-accent)"/>
        {!collapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, color:'#fff', fontWeight: 500 }}>{(SITE.user || {}).name || ''}</div>
              <div style={{ fontSize: 10, color:'#9A968C' }}>{(SITE.user || {}).role || ''}</div>
            </div>
            <Icon name="log-out" size={14} color="#9A968C"/>
          </>
        )}
      </div>
    </aside>
  );
}

function TopBar({ routeLabel }) {
  const brand = SITE.brand || {};
  const logo = useThemeLogo();
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'12px 24px', borderBottom:'1px solid var(--brand-border)',
      background:'#fff', flexShrink: 0,
    }}>
      {/* minWidth:0 lets the breadcrumb shrink and ellipsise. Without it a long
          legal name pushed the countdown chip over the page
          title instead of truncating. */}
      <div style={{ display:'flex', alignItems:'center', gap: 14, flexShrink: 0 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8, fontSize: 13, whiteSpace:'nowrap' }}>
          <BrandMark size={22} brand={brand} logo={logo} bg="var(--brand-ink)"/>
          <span style={{ color:'var(--brand-ink)', fontWeight: 600 }}>{brand.legalName || brand.name}</span>
          <span style={{ color:'#C6C4BB', flexShrink: 0 }}>/</span>
          <span style={{ color:'var(--brand-muted)', flexShrink: 0 }}>{brand.section || 'ISMS'}</span>
          <span style={{ color:'#C6C4BB', flexShrink: 0 }}>/</span>
          <span style={{ color:'var(--brand-ink)', fontWeight: 500, flexShrink: 0 }}>{routeLabel}</span>
        </div>
      </div>
      {/* The breadcrumb is short and fixed; the countdown chip is the variable
          part, so the chip absorbs the squeeze and ellipsises rather than the
          brand name being truncated. */}
      <div style={{ display:'flex', alignItems:'center', gap: 14, flex: 1, minWidth: 0, marginLeft: 16, justifyContent:'flex-end' }}>
        {typeof CountdownChip === 'function' && SITE.countdownDays != null && <CountdownChip days={SITE.countdownDays}/>}
        <div style={{ display:'flex', alignItems:'center', gap: 4 }}>
          <button style={topIconBtn}><Icon name="search" size={15} color="var(--brand-muted)"/></button>
          <button style={topIconBtn}>
            <Icon name="bell" size={15} color="var(--brand-muted)"/>
            <span style={{
              position:'absolute', top: 6, right: 6,
              width: 7, height: 7, borderRadius: 9999,
              background:'var(--brand-accent)', border:'2px solid #fff',
            }}/>
          </button>
          <button style={topIconBtn}><Icon name="help-circle" size={15} color="var(--brand-muted)"/></button>
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
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color:'var(--brand-ink)', letterSpacing:'-0.01em' }}>{title}</h1>
        <div style={{ fontSize: 13, color:'var(--brand-muted)', marginTop: 4 }}>{subtitle}</div>
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
        background:'color-mix(in srgb, var(--brand-accent) 8%, transparent)',
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        marginBottom: 16,
      }}><Icon name="construction" size={28} color="var(--brand-accent)"/></div>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color:'var(--brand-ink)' }}>{title}</h2>
      <div style={{ fontSize: 13, color:'var(--brand-muted)', marginTop: 6 }}>
        Read-only view of this domain. Pulled from connected systems.
      </div>
    </div>
  );
}

// Home / Links / Notes tab strip. Every section gets the same three tabs:
// Home is the page's own sections[], Links and Notes are generic widgets keyed
// by the nav id, so a new page picks them up with no extra wiring.
const PAGE_TABS = [
  { id: 'home',  label: 'Home',  icon: 'layout-dashboard' },
  { id: 'links', label: 'Links', icon: 'link' },
  { id: 'notes', label: 'Notes', icon: 'notebook-pen' },
];

// A page may declare extra tabs of its own in site.json:
//   "tabs": [ { "id": "training", "label": "Training status",
//               "icon": "graduation-cap", "widget": "page-training" } ]
// They sit after Home/Links/Notes and render their named widget.
function PageTabs({ tab, setTab, extra }) {
  const tabs = PAGE_TABS.concat(extra || []);
  return (
    <div style={{
      display:'flex', gap: 2, padding:'14px 24px 0',
      borderBottom:'1px solid var(--brand-border)', marginBottom: 0,
    }}>
      {tabs.map(t => {
        const on = t.id === tab;
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display:'inline-flex', alignItems:'center', gap: 6,
            border:'none', background:'transparent', cursor:'pointer',
            fontFamily:'inherit', fontSize: 12.5,
            fontWeight: on ? 600 : 500,
            color: on ? 'var(--brand-ink)' : 'var(--brand-muted)',
            padding:'8px 12px',
            borderBottom: on ? '2px solid var(--brand-accent)' : '2px solid transparent',
            marginBottom: -1,
          }}>
            <Icon name={t.icon} size={13} color={on ? 'var(--brand-accent)' : '#9A968C'}/>
            {t.label}
          </button>
        );
      })}
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
  // Home / Links / Notes. Resets to Home on navigation, so a section is never
  // entered on someone else's tab.
  const [pageTab, setPageTab] = useAppState('home');
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
      <Sidebar active={route} setActive={(id)=>{ setRoute(id); setDrawerPersisted(null); setPageTab('home'); }}
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
                  fontSize: 11, color:'var(--brand-muted)', background:'transparent',
                  border:'1px dashed #C6C4BB', borderRadius: 6, padding:'5px 10px',
                  cursor:'pointer', fontFamily:'Poppins, sans-serif',
                }}>demo: toggle AI {aiMode==='thread'?'empty':'thread'}</button>
            </div>
          }
        />

        <PageTabs tab={pageTab} setTab={setPageTab} extra={(page && page.tabs) || []}/>

        <div style={{ flex: 1, overflow:'auto', position:'relative' }} className="scroll-y">
          {pageTab === 'home' ? (
            <PageBody page={page} pageId={route} openDrawer={setDrawerPersisted}/>
          ) : (
            (() => {
              const custom = ((page && page.tabs) || []).find(t => t.id === pageTab);
              const name = custom ? custom.widget
                         : pageTab === 'links' ? 'page-links' : 'page-notes';
              const W = getWidget(name);
              if (!W) return <WidgetErrorCard name={name}
                error="widget not registered — is the file present in widgets/ and does it call registerWidget()?"/>;
              return (
                <ErrorBoundary name={name}>
                  <W pageId={route}/>
                </ErrorBoundary>
              );
            })()
          )}
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
