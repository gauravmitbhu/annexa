// Notes tab — shown on every section. Reads SECTION_NOTES from data/notes.json,
// keyed by the nav id. The running audit crib sheet: what is here, what an
// auditor will probe, and the gaps with an answer ready.

function PageNotes({ pageId }) {
  const all = (typeof SECTION_NOTES !== 'undefined' && SECTION_NOTES) || {};
  const note = all[pageId];

  if (!note) {
    return (
      <div style={{ maxWidth: 1320, padding:'20px 24px 32px' }}>
        <Card padding={20}>
          <SectionTitle>Notes</SectionTitle>
          <div style={{ fontSize: 12, color:'var(--brand-muted)', lineHeight: 1.6 }}>
            No note for this section yet. Add one to <code>data/notes.json</code> under
            <strong> {pageId}</strong> — these are meant to evolve between audits, not to be versioned.
          </div>
        </Card>
      </div>
    );
  }

  // Blank-line separated blocks; a block whose first line is ALL CAPS is a heading.
  const blocks = String(note.body || '').split(/\n\s*\n/);

  return (
    <div style={{ maxWidth: 1320, padding:'20px 24px 32px' }}>
      <Card padding={22}>
        <h2 style={{ margin:'0 0 14px', fontSize: 15, fontWeight: 600, color:'var(--brand-ink)' }}>{note.title}</h2>
        {blocks.map((b, i) => {
          const lines = b.split('\n');
          const head = lines[0].trim();
          const isHeading = head.length > 3 && head === head.toUpperCase() && /[A-Z]/.test(head);
          return (
            <div key={i} style={{ marginBottom: 14 }}>
              {isHeading && (
                <div style={{
                  fontSize: 11, fontWeight: 600, color:'var(--brand-accent)',
                  textTransform:'uppercase', letterSpacing:'0.04em', marginBottom: 5,
                }}>{head}</div>
              )}
              <div style={{ fontSize: 12.5, color:'#343128', lineHeight: 1.7, whiteSpace:'pre-wrap' }}>
                {(isHeading ? lines.slice(1) : lines).join('\n')}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

registerWidget('page-notes', PageNotes);
