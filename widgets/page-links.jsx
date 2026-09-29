// Links tab — shown on every section. Reads SECTION_LINKS from data/links.json,
// keyed by the nav id, and always appends the _shared entries.

function PageLinks({ pageId }) {
  const all = (typeof SECTION_LINKS !== 'undefined' && SECTION_LINKS) || {};
  const own = all[pageId] || [];
  const shared = all._shared || [];

  const Row = ({ l }) => (
    <div style={{
      display:'flex', alignItems:'flex-start', gap: 10,
      padding:'10px 0', borderBottom:'1px solid var(--brand-surface)',
    }}>
      <Icon name={l.url ? 'external-link' : 'folder'} size={14} color="var(--brand-accent)"
        style={{ flexShrink: 0, marginTop: 2 }}/>
      <div style={{ minWidth: 0 }}>
        {l.url
          ? <a href={l.url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12.5, fontWeight: 600, color:'var(--brand-ink)', textDecoration:'none' }}>{l.label}</a>
          : <span style={{ fontSize: 12.5, fontWeight: 600, color:'var(--brand-ink)' }}>{l.label}</span>}
        {l.note && <div style={{ fontSize: 11.5, color:'var(--brand-muted)', marginTop: 2, lineHeight: 1.5 }}>{l.note}</div>}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1320, padding:'20px 24px 32px', display:'flex', flexDirection:'column', gap: 18 }}>
      <Card padding={20}>
        <SectionTitle>Links for this section</SectionTitle>
        {own.length
          ? own.map((l, i) => <Row key={i} l={l}/>)
          : <div style={{ fontSize: 12, color:'var(--brand-muted)' }}>
              No section-specific links yet. Add them to <code>data/links.json</code> under
              <strong> {pageId}</strong>.
            </div>}
      </Card>

      {shared.length > 0 && (
        <Card padding={20}>
          <SectionTitle>Always useful</SectionTitle>
          {shared.map((l, i) => <Row key={i} l={l}/>)}
        </Card>
      )}
    </div>
  );
}

registerWidget('page-links', PageLinks);
