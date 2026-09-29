// SoA · ISO/IEC 27001: the Statement of Applicability as issued.
//
// Every column comes from data already in the dashboard: CONTROLS for the
// Annex A controls and their status, CTRL_JUSTIFY for the applicability
// justification and CTRL_IMPL for the implementation description, both lifted
// from the workbook itself. Nothing here is written for the dashboard.
//
// Obeys the Confidential / Client view switch defined in page-soa.jsx: the
// client view shows scope and implementation status and drops the justification,
// the implementation text, the owner and the open findings.

function SoaMetaRow({ k, v, flag }) {
  return (
    <div style={{ display:'flex', gap: 10, padding:'7px 0', borderBottom:'1px solid var(--brand-surface)', fontSize: 11.5 }}>
      <span style={{ width: 120, flexShrink: 0, color:'#9A968C' }}>{k}</span>
      <span style={{ color: flag ? '#B45309' : 'var(--brand-ink)', fontWeight: 500, minWidth: 0 }}>{v}</span>
    </div>
  );
}

function Soa27Header({ s, client }) {
  const controls = (typeof CONTROLS !== 'undefined' && CONTROLS) || [];
  const notOk = controls.filter(c => c.status !== 'ok');
  return (
    <Card padding={20}>
      <SectionTitle right={<Pill color="#047857" bg="#ECFDF5" size="xs">v{s.version}</Pill>}>
        {s.docId}
      </SectionTitle>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap: 0, columnGap: 28 }}>
        <div>
          <SoaMetaRow k="Standard"   v={s.standard}/>
          <SoaMetaRow k="Clause"     v={s.clause}/>
          <SoaMetaRow k="Effective"  v={s.effective}/>
          <SoaMetaRow k="Scope"      v={s.scope}/>
        </div>
        <div>
          <SoaMetaRow k="Controls"   v={`${s.applicable} applicable of ${s.controlCount} · ${s.excluded} excluded`}/>
          {!client && <SoaMetaRow k="Author" v={s.author}/>}
          {!client && <SoaMetaRow k="Approved by" v="Not approved — no version has ever been signed off" flag/>}
          {!client && <SoaMetaRow k="Source" v={s.sourcePath}/>}
          {!client && <SoaMetaRow k="Open items" v={`${notOk.length} controls carry an open finding or gap`} flag={notOk.length > 0}/>}
        </div>
      </div>
    </Card>
  );
}

function Soa27Table({ client }) {
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('all');
  const [open, setOpen] = useState(null);

  const controls = (typeof CONTROLS !== 'undefined' && CONTROLS) || [];
  const groups = (typeof ANNEX_GROUPS !== 'undefined' && ANNEX_GROUPS) || [];
  const justify = (typeof CTRL_JUSTIFY !== 'undefined' && CTRL_JUSTIFY) || {};
  const impl = (typeof CTRL_IMPL !== 'undefined' && CTRL_IMPL) || {};
  const findings = (typeof CTRL_FINDINGS !== 'undefined' && CTRL_FINDINGS) || {};
  const soaRows = (typeof SOA_ROWS !== 'undefined' && SOA_ROWS) || {};

  const rows = controls.filter(c => {
    if (group !== 'all' && c.group !== group) return false;
    if (!q.trim()) return true;
    const hay = `${c.id} ${c.name} ${client ? '' : (justify[c.id] || '')}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });

  const th = { textAlign:'left', fontSize: 10, textTransform:'uppercase', letterSpacing:'0.06em',
               color:'#9A968C', fontWeight: 600, padding:'0 10px 8px 0', whiteSpace:'nowrap' };
  const td = { fontSize: 11.5, color:'#343128', padding:'9px 10px 9px 0', verticalAlign:'top',
               borderTop:'1px solid var(--brand-surface)' };

  return (
    <Card padding={20}>
      <div style={{ display:'flex', alignItems:'center', gap: 10, flexWrap:'wrap', marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color:'var(--brand-ink)', flex: 1, minWidth: 180 }}>
          Annex A applicability · {rows.length} of {controls.length}
        </h3>
        <div style={{ display:'flex', gap: 4, flexWrap:'wrap' }}>
          {[{ id:'all', label:'All' }].concat(groups.map(g => ({ id: g.id, label: g.label }))).map(g => (
            <button key={g.id} onClick={() => setGroup(g.id)} style={{
              border:'1px solid ' + (group === g.id ? 'var(--brand-accent)' : '#E4E2DC'),
              background: group === g.id ? 'color-mix(in srgb, var(--brand-accent) 8%, transparent)' : '#fff',
              color: group === g.id ? '#B45309' : 'var(--brand-muted)',
              fontFamily:'inherit', fontSize: 11, fontWeight: 500,
              borderRadius: 9999, padding:'4px 10px', cursor:'pointer',
            }}>{g.label}</button>
          ))}
        </div>
        <input
          value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search controls…"
          style={{ fontFamily:'inherit', fontSize: 11.5, padding:'6px 10px', minWidth: 170,
                   border:'1px solid #E4E2DC', borderRadius: 8, color:'var(--brand-ink)', outline:'none' }}
        />
      </div>

      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', tableLayout:'fixed',
                        minWidth: client ? 520 : 1020 }}>
          <thead>
            <tr>
              <th style={{ ...th, width: 52 }}>Ref</th>
              <th style={th}>Control</th>
              <th style={{ ...th, width: 74 }}>Applicable</th>
              <th style={{ ...th, width: 96 }}>Implemented</th>
              {!client && <th style={{ ...th, width: '26%' }}>Justification</th>}
              {!client && <th style={{ ...th, width: '34%' }}>How it is implemented</th>}
              {!client && <th style={{ ...th, width: 60 }}>Open</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map(c => {
              const fs = findings[c.id] || [];
              // Applicable and Implemented are the workbook's OWN values, not the
              // dashboard's RAG status. They are different measures and were
              // conflated here at first: the SoA records 92 of 93 implemented,
              // while 28 controls carry an open finding. A control can be
              // Implemented = Yes in the document and still have an open item,
              // and showing the second as though it were the first misreported
              // the source document on the one tab meant to reproduce it exactly.
              const row = soaRows[c.id] || {};
              const applicable = row.applicable || 'Yes';
              const impl = row.implemented || '';
              const implFull = /^yes$/i.test(impl);
              const isOpen = open === c.id;
              return (
                <React.Fragment key={c.id}>
                  <tr onClick={() => setOpen(isOpen ? null : c.id)} style={{ cursor:'pointer' }}>
                    <td style={{ ...td, fontFamily:'ui-monospace, monospace', fontSize: 11, color:'#B45309' }}>{c.id}</td>
                    <td style={{ ...td, color:'var(--brand-ink)', fontWeight: 500 }}>{c.name}</td>
                    <td style={td}>
                      <Pill size="xs"
                        color={/^yes$/i.test(applicable) ? '#047857' : 'var(--brand-muted)'}
                        bg={/^yes$/i.test(applicable) ? '#ECFDF5' : '#F6F5F2'}>{applicable}</Pill>
                    </td>
                    <td style={td}>
                      <Pill size="xs"
                        color={implFull ? '#047857' : '#B45309'}
                        bg={implFull ? '#ECFDF5' : '#FFFBEB'}>{impl || '—'}</Pill>
                    </td>
                    {/* Justification and the implementation description are the
                        SoA's own two text columns. They are the substance of the
                        document, so in the confidential view they are always on
                        screen — behind a click they may as well not be there. */}
                    {!client && (
                      <td style={{ ...td, color:'var(--brand-muted)', lineHeight: 1.55 }}>
                        {row.justification || justify[c.id] || <span style={{ color:'#C6C4BB' }}>—</span>}
                      </td>
                    )}
                    {!client && (
                      <td style={{ ...td, color:'#343128', lineHeight: 1.55 }}>
                        {row.description || <span style={{ color:'#C6C4BB' }}>—</span>}
                      </td>
                    )}
                    {!client && (
                      <td style={td}>
                        {fs.length > 0
                          ? <Pill color="#B91C1C" bg="#FEF2F2" size="xs">{fs.length}</Pill>
                          : <span style={{ color:'#C6C4BB' }}>—</span>}
                      </td>
                    )}
                  </tr>
                  {isOpen && !client && (
                    <tr>
                      <td colSpan={7} style={{ ...td, background:'#FAF9F7', paddingLeft: 12, paddingRight: 12 }}>
                        <div style={{ fontSize: 10, textTransform:'uppercase', letterSpacing:'0.06em',
                                      color:'#9A968C', fontWeight: 600, marginBottom: 4 }}>
                          Implementation notes
                        </div>
                        {(impl[c.id] || ['—']).map((t, i) => (
                          <div key={i} style={{ fontSize: 11.5, color:'#343128', lineHeight: 1.6, marginBottom: 4 }}>{t}</div>
                        ))}
                        <div style={{ fontSize: 10.5, color:'#9A968C', marginTop: 4 }}>
                          The SoA description plus detail added when this dashboard was built — fuller
                          than the document's own wording, which is the column above.
                        </div>
                        {fs.length > 0 && (
                          <div style={{ marginTop: 8, paddingTop: 8, borderTop:'1px solid #E4E2DC' }}>
                            {fs.map((f, i) => (
                              <div key={i} style={{ fontSize: 11.5, color:'var(--brand-muted)', lineHeight: 1.6 }}>
                                <strong style={{ color:'#B91C1C' }}>{f.ref}</strong>{' '}
                                <span style={{ color:'#9A968C' }}>({f.kind})</span> — {f.note}
                              </div>
                            ))}
                          </div>
                        )}
                        <div style={{ fontSize: 10.5, color:'#9A968C', marginTop: 8 }}>
                          Owner {c.owner} · last reviewed {c.last}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {!client && (
        <div style={{ fontSize: 10.5, color:'#9A968C', marginTop: 10, lineHeight: 1.6 }}>
          <strong style={{ color:'var(--brand-muted)' }}>Applicable</strong>,{' '}
          <strong style={{ color:'var(--brand-muted)' }}>Implemented</strong>,{' '}
          <strong style={{ color:'var(--brand-muted)' }}>Justification</strong> and{' '}
          <strong style={{ color:'var(--brand-muted)' }}>How it is implemented</strong> are the four columns of
          the SoA workbook, reproduced verbatim.{' '}
          <strong style={{ color:'var(--brand-muted)' }}>Open</strong> is not part of the SoA: it counts open
          findings and nonconformities against the control. A control can
          be implemented in the SoA and still have an open item. Click a row for the fuller
          implementation notes, the owner and the open items themselves.
        </div>
      )}
    </Card>
  );
}

function Soa27Versions() {
  const v = (typeof SOA_VERSIONS !== 'undefined' && SOA_VERSIONS) || [];
  return (
    <Card padding={20}>
      <SectionTitle right={<Pill color="#B91C1C" bg="#FEF2F2" size="xs">none approved</Pill>}>
        Version history
      </SectionTitle>
      <div style={{ fontSize: 11.5, color:'var(--brand-muted)', marginBottom: 8 }}>
        Read from the workbook's own <em>Version control</em> sheet. The <strong>Approved by</strong>{' '}
        column exists and is empty for every row.
      </div>
      {v.map((r, i) => (
        <div key={i} style={{ padding:'9px 0', borderBottom: i === v.length - 1 ? 'none' : '1px solid var(--brand-surface)' }}>
          <div style={{ display:'flex', alignItems:'baseline', gap: 10, flexWrap:'wrap' }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color:'var(--brand-ink)', width: 34 }}>v{r.version}</span>
            <span style={{ fontSize: 11.5, color:'var(--brand-muted)', width: 84 }}>{r.date}</span>
            <span style={{ fontSize: 11.5, color:'#343128', flex: 1, minWidth: 160 }}>{r.description}</span>
            <span style={{ fontSize: 11, color:'#9A968C' }}>{r.author}</span>
          </div>
          {r.flag && (
            <div style={{ fontSize: 11, color:'#B45309', marginTop: 4, lineHeight: 1.5 }}>
              ⚠ {r.flag}
            </div>
          )}
        </div>
      ))}
    </Card>
  );
}

function SoaLinks({ s }) {
  return (
    <Card padding={20}>
      <SectionTitle>Where the document lives</SectionTitle>
      {(s.links || []).map((l, i) => (
        <div key={i} style={{ display:'flex', gap: 10, padding:'9px 0', borderBottom:'1px solid var(--brand-surface)' }}>
          <Icon name="external-link" size={14} color="var(--brand-accent)" style={{ flexShrink: 0, marginTop: 2 }}/>
          <div style={{ minWidth: 0 }}>
            <a href={l.url} target="_blank" rel="noopener noreferrer"
               style={{ fontSize: 12.5, fontWeight: 600, color:'var(--brand-ink)', textDecoration:'none' }}>{l.label}</a>
            <div style={{ fontSize: 11.5, color:'var(--brand-muted)', marginTop: 2, lineHeight: 1.5 }}>{l.note}</div>
          </div>
        </div>
      ))}
    </Card>
  );
}

function PageSoa27001() {
  const view = useSoaView();
  const client = view === 'client';
  const std = (typeof SOA_STANDARDS !== 'undefined' && SOA_STANDARDS) || [];
  const s = std.find(x => x.id === '27001');
  if (!s) return null;

  return (
    <div style={{ maxWidth: 1320, padding:'18px 24px 32px', display:'flex', flexDirection:'column', gap: 18 }}>
      <SoaViewToggle/>
      {client && <SoaClientBanner/>}
      <Soa27Header s={s} client={client}/>
      <Soa27Table client={client}/>
      {/* Version history names authors and exposes that nothing was ever
          approved — internal only. */}
      {!client && <Soa27Versions/>}
      {!client && <SoaLinks s={s}/>}
    </div>
  );
}

registerWidget('page-soa-27001', PageSoa27001);
