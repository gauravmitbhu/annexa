// Settings → Branding. Whitelabel the dashboard from a company website:
// scan the URL (POST /api/brand/scan), review and adjust the proposed colours,
// fonts, logo and name with a live preview, then apply (POST /api/brand/apply),
// which writes site/theme.json and site.json brand{}. Reset restores defaults.

const BRAND_COLOR_FIELDS = [
  ['accent', 'Accent', 'Buttons, active nav, highlights'],
  ['accent2', 'Accent (light)', 'Taglines, secondary highlights'],
  ['accentDark', 'Accent (dark)', 'Hover states, link hover'],
  ['ink', 'Ink', 'Sidebar and headings'],
  ['muted', 'Muted text', 'Secondary copy'],
  ['surface', 'Surface', 'Subtle fills'],
  ['border', 'Border', 'Hairlines'],
  ['onAccent', 'Text on accent', 'Label colour on accent buttons'],
];

function brandInput(extra) {
  return {
    fontFamily: 'inherit', fontSize: 12.5, padding: '7px 10px', borderRadius: 6,
    border: '1px solid var(--brand-border)', background: '#fff', color: 'var(--brand-ink)',
    outline: 'none', ...extra,
  };
}

function BrandField({ label, hint, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand-ink)' }}>{label}</span>
      {children}
      {hint && <span style={{ fontSize: 10.5, color: 'var(--brand-muted)' }}>{hint}</span>}
    </label>
  );
}

function PageBranding() {
  const saved = window.THEME || null;
  const brand = (window.SITE && window.SITE.brand) || {};
  const [url, setUrl] = React.useState((saved && saved.source) || '');
  const [busy, setBusy] = React.useState('');
  const [msg, setMsg] = React.useState(null);
  const [proposal, setProposal] = React.useState(null);
  const [draft, setDraft] = React.useState(() => ({
    colors: { ...((saved && saved.colors) || {}) },
    fonts: { ...((saved && saved.fonts) || {}) },
    logo: (saved && saved.logo) || '',
    favicon: (saved && saved.favicon) || '',
    name: brand.name || '', legalName: brand.legalName || '', tagline: brand.tagline || '',
  }));

  // Live preview: every edit re-themes the whole app until Apply or Discard.
  React.useEffect(() => { window.applyTheme(draft); }, [draft]);
  // Leaving the page without applying restores the saved theme.
  React.useEffect(() => () => window.applyTheme(window.THEME || null), []);

  const set = (path, value) => setDraft(d => {
    const n = { ...d, colors: { ...d.colors }, fonts: { ...d.fonts } };
    if (path.includes('.')) { const [a, b] = path.split('.'); n[a][b] = value; } else n[path] = value;
    return n;
  });

  async function scan() {
    if (!url.trim()) return;
    setBusy('scan'); setMsg(null);
    try {
      const r = await fetch('/api/brand/scan', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.reason || 'scan failed');
      const p = j.proposal;
      setProposal(p);
      setDraft(d => ({
        ...d, colors: { ...p.colors }, fonts: { ...p.fonts }, logo: p.logo || '', favicon: p.favicon || '',
        source: p.source, fetchedAt: p.fetchedAt,
        name: (p.brand.name || d.name || '').toLowerCase(), legalName: p.brand.name || d.legalName,
      }));
      setMsg({ ok: true, text: `Scanned ${p.source}: ${p.stylesheets.length} stylesheet(s) read. Review, then Apply.` });
    } catch (e) { setMsg({ ok: false, text: String(e.message || e) }); }
    setBusy('');
  }

  async function apply(reset) {
    setBusy(reset ? 'reset' : 'apply'); setMsg(null);
    try {
      const { name, legalName, tagline, ...theme } = draft;
      const r = await fetch('/api/brand/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reset ? { reset: true } : { theme, brand: { name, legalName, tagline } }) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.reason || 'apply failed');
      window.THEME = j.theme;
      if (reset) setDraft(d => ({ ...d, colors: {}, fonts: {}, logo: '', favicon: '' }));
      window.applyTheme(j.theme);
      setMsg({ ok: true, text: reset ? 'Theme reset to defaults.' : 'Theme applied. The page reloads with the new brand.' });
    } catch (e) { setMsg({ ok: false, text: String(e.message || e) }); }
    setBusy('');
  }

  return (
    <div style={{ maxWidth: 1100, padding: '20px 24px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card padding={20}>
        <SectionTitle>Whitelabel from a website</SectionTitle>
        <div style={{ fontSize: 12.5, color: 'var(--brand-muted)', marginBottom: 12, lineHeight: 1.6 }}>
          Enter the company's website. The server reads its HTML and stylesheets and proposes an accent colour,
          fonts, logo and name. Nothing changes until you press <strong>Apply</strong>; the logo is embedded
          so the dashboard does not keep loading it from the company's site.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && scan()}
            placeholder="https://www.example.com" style={brandInput({ flex: 1 })}/>
          <Button icon={busy === 'scan' ? 'loader' : 'scan-search'} onClick={scan}>
            {busy === 'scan' ? 'Scanning…' : 'Scan website'}
          </Button>
        </div>
        {msg && (
          <div style={{ marginTop: 10, fontSize: 12, color: msg.ok ? 'var(--ok-fg)' : 'var(--err-fg)' }}>{msg.text}</div>
        )}
        {proposal && proposal.palette && proposal.palette.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand-ink)', marginBottom: 6 }}>
              Colours found on the site. Click one to use it as the accent.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {proposal.palette.map(c => (
                <button key={c} title={c} onClick={() => set('colors.accent', c)} style={{
                  width: 30, height: 30, borderRadius: 6, background: c, cursor: 'pointer',
                  border: draft.colors.accent === c ? '2px solid var(--brand-ink)' : '1px solid var(--brand-border)',
                }}/>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: 16 }}>
        <Card padding={20}>
          <SectionTitle>Colours</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 12 }}>
            {BRAND_COLOR_FIELDS.map(([k, label, hint]) => {
              const v = draft.colors[k] || getComputedStyle(document.documentElement)
                .getPropertyValue('--brand-' + k.replace(/[A-Z0-9]/g, m => '-' + m.toLowerCase())).trim();
              return (
                <BrandField key={k} label={label} hint={hint}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input type="color" value={/^#[0-9a-f]{6}$/i.test(v) ? v : '#000000'}
                      onChange={e => set('colors.' + k, e.target.value.toUpperCase())}
                      style={{ width: 36, height: 32, padding: 0, border: '1px solid var(--brand-border)', borderRadius: 6 }}/>
                    <input value={draft.colors[k] || ''} placeholder={v}
                      onChange={e => set('colors.' + k, e.target.value)} style={brandInput({ flex: 1, fontFamily: 'var(--font-mono)' })}/>
                  </div>
                </BrandField>
              );
            })}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding={20}>
            <SectionTitle>Name &amp; type</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <BrandField label="Short name" hint="Sidebar wordmark">
                <input value={draft.name} onChange={e => set('name', e.target.value)} style={brandInput()}/>
              </BrandField>
              <BrandField label="Legal name" hint="Breadcrumb and browser title">
                <input value={draft.legalName} onChange={e => set('legalName', e.target.value)} style={brandInput()}/>
              </BrandField>
              <BrandField label="Tagline">
                <input value={draft.tagline} onChange={e => set('tagline', e.target.value)} style={brandInput()}/>
              </BrandField>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <BrandField label="Body font" hint="Google Fonts name">
                  <input value={draft.fonts.body || ''} placeholder="Poppins" onChange={e => set('fonts.body', e.target.value)} style={brandInput()}/>
                </BrandField>
                <BrandField label="Heading font">
                  <input value={draft.fonts.display || ''} placeholder="Poppins" onChange={e => set('fonts.display', e.target.value)} style={brandInput()}/>
                </BrandField>
              </div>
            </div>
          </Card>

          <Card padding={20}>
            <SectionTitle>Logo</SectionTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 56, height: 56, borderRadius: 8, border: '1px solid var(--brand-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', overflow: 'hidden' }}>
                {draft.logo ? <img src={draft.logo} alt="" style={{ maxWidth: 52, maxHeight: 52 }}/>
                  : <Icon name="image-off" size={18} color="var(--brand-muted)"/>}
              </div>
              <input value={draft.logo.startsWith('data:') ? '(embedded image)' : draft.logo}
                onChange={e => set('logo', e.target.value)} placeholder="https://…/logo.svg" style={brandInput({ flex: 1 })}/>
            </div>
            {proposal && proposal.logoCandidates && proposal.logoCandidates.length > 1 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {proposal.logoCandidates.map(u => (
                  <button key={u} onClick={() => set('logo', u)} title={u} style={{
                    width: 40, height: 40, borderRadius: 6, background: '#fff', cursor: 'pointer', padding: 3,
                    border: draft.logo === u ? '2px solid var(--brand-accent)' : '1px solid var(--brand-border)',
                  }}><img src={u} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }}/></button>
                ))}
                <button onClick={() => set('logo', '')} style={brandInput({ cursor: 'pointer', fontSize: 11 })}>No logo</button>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Card padding={20}>
        <SectionTitle>Preview</SectionTitle>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--brand-ink)', color: '#fff', padding: '10px 14px', borderRadius: 8,
            fontFamily: 'var(--font-display)', fontWeight: 800 }}>{draft.name || 'name'}</div>
          <Button>Primary action</Button>
          <Button variant="outline">Secondary</Button>
          <Pill color="var(--brand-accent)" bg="color-mix(in srgb, var(--brand-accent) 12%, transparent)">Accent pill</Pill>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brand-muted)' }}>
            Body text in {draft.fonts.body || 'the default font'}.
          </span>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button variant="ghost" icon="rotate-ccw" onClick={() => apply(true)}>
          {busy === 'reset' ? 'Resetting…' : 'Reset to default'}
        </Button>
        <Button variant="outline" icon="x" onClick={() => window.applyTheme(window.THEME || null)}>Discard preview</Button>
        <Button icon="check" onClick={() => apply(false)}>{busy === 'apply' ? 'Applying…' : 'Apply'}</Button>
      </div>
    </div>
  );
}

registerWidget('page-branding', PageBranding);
