// SoA · Home — the position across all three certified standards, plus the
// Confidential / Client view switch that every SoA tab obeys.
//
// Only ISO/IEC 27001 has a Statement of Applicability. Rather than show three
// identical-looking documents, Home says which standard has one, what stands in
// its place for the other two, and what is wrong with the one that exists.

// ---------------------------------------------------------------------------
// View mode. Shared by all four SoA tabs, which are separate widgets, so it
// lives on window with an event rather than in one component's state.
//
//   confidential — the full, exact SoA: justifications, implementation text,
//                  owners, open findings, version history with authors.
//   client       — what the organisation can hand to a customer: which controls are in
//                  scope and whether they are implemented, and nothing about
//                  how, by whom, or where the gaps are.
// ---------------------------------------------------------------------------

const SOA_VIEW_EVENT = 'annexa:soa-view';

function soaSetView(v) {
  window.__SOA_VIEW = v;
  window.dispatchEvent(new CustomEvent(SOA_VIEW_EVENT, { detail: v }));
}

function useSoaView() {
  const [v, setV] = useState(window.__SOA_VIEW || 'confidential');
  useEffect(() => {
    const h = (e) => setV(e.detail);
    window.addEventListener(SOA_VIEW_EVENT, h);
    return () => window.removeEventListener(SOA_VIEW_EVENT, h);
  }, []);
  return v;
}

function SoaViewToggle() {
  const view = useSoaView();
  const opts = [
    { id:'confidential', label:'Confidential', icon:'lock',
      note:'The full document exactly as issued' },
    { id:'client',       label:'Client view',  icon:'share-2',
      note:'Only what can be shared externally' },
  ];
  return (
    <div style={{
      display:'flex', alignItems:'center', gap: 14, flexWrap:'wrap',
      padding:'12px 14px', borderRadius: 10,
      background: view === 'client' ? 'rgba(4,120,87,0.05)' : 'color-mix(in srgb, var(--brand-accent) 5%, transparent)',
      border: `1px solid ${view === 'client' ? 'rgba(4,120,87,0.22)' : 'color-mix(in srgb, var(--brand-accent) 22%, transparent)'}`,
    }}>
      <div style={{ display:'flex', gap: 16 }}>
        {opts.map(o => {
          const on = view === o.id;
          return (
            <label key={o.id} style={{ display:'inline-flex', alignItems:'center', gap: 7, cursor:'pointer' }}>
              <input
                type="radio" name="soa-view" value={o.id} checked={on}
                onChange={() => soaSetView(o.id)}
                style={{ accentColor:'var(--brand-accent)', width: 14, height: 14, cursor:'pointer', margin: 0 }}
              />
              <Icon name={o.icon} size={13} color={on ? 'var(--brand-ink)' : '#9A968C'}/>
              <span style={{ fontSize: 12.5, fontWeight: on ? 600 : 500, color: on ? 'var(--brand-ink)' : 'var(--brand-muted)' }}>
                {o.label}
              </span>
            </label>
          );
        })}
      </div>
      <div style={{ fontSize: 11, color:'var(--brand-muted)', flex: 1, minWidth: 220, lineHeight: 1.5 }}>
        {view === 'client'
          ? 'Showing control scope and implementation status only. Applicability justifications, implementation descriptions, owners, open findings and nonconformity references are hidden.'
          : 'Showing the document exactly as issued, including implementation detail and the open items against each control.'}
      </div>
    </div>
  );
}

// A one-off banner for the client view. It is a presentation filter, not a
// security boundary — the underlying data is still in the browser — so anything
// leaving the organisation should be produced with Export rather than from a screen.
function SoaClientBanner() {
  return (
    <div style={{ padding:'10px 13px', borderRadius: 8, background:'rgba(4,120,87,0.06)',
                  border:'1px solid rgba(4,120,87,0.25)', fontSize: 11.5, color:'#065F46', lineHeight: 1.6 }}>
      <Icon name="share-2" size={12} style={{ verticalAlign:'middle', marginRight: 6 }}/>
      <strong>Client view.</strong> Safe to show to a customer: control scope and implementation
      status only. It is a display filter, not a security boundary — the full data is still loaded
      in this browser, so anything that actually leaves the organisation should be produced through Export.
    </div>
  );
}

const SOA_TONE = {
  high: { fg:'#B91C1C', bg:'#FEF2F2', br:'rgba(185,28,28,0.2)', label:'High' },
  med:  { fg:'#B45309', bg:'#FFFBEB', br:'rgba(180,83,9,0.2)',  label:'Medium' },
  low:  { fg:'var(--brand-muted)', bg:'#F6F5F2', br:'#E4E2DC',             label:'Note' },
};

function SoaStandardCard({ s, client }) {
  const controls = (typeof CONTROLS !== 'undefined' && CONTROLS) || [];
  return (
    <Card padding={20}>
      <SectionTitle right={
        s.exists
          ? <Pill color="#047857" bg="#ECFDF5" size="xs">v{s.version}</Pill>
          : <Pill color="var(--brand-muted)" bg="#F6F5F2" size="xs">no SoA</Pill>
      }>
        {s.standard}
      </SectionTitle>

      <div style={{ fontSize: 11.5, color:'var(--brand-muted)', lineHeight: 1.6, marginTop: 2 }}>
        {s.summary}
      </div>

      {s.exists ? (
        <div style={{ marginTop: 12, display:'flex', gap: 18, flexWrap:'wrap' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, color:'var(--brand-ink)' }}>{s.applicable}</div>
            <div style={{ fontSize: 10.5, color:'#9A968C' }}>applicable of {s.controlCount}</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, color:'var(--brand-ink)' }}>{s.excluded}</div>
            <div style={{ fontSize: 10.5, color:'#9A968C' }}>excluded</div>
          </div>
          {!client && (
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color:'#B45309' }}>
                {controls.filter(c => c.status !== 'ok').length}
              </div>
              <div style={{ fontSize: 10.5, color:'#9A968C' }}>with an open item</div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 10.5, textTransform:'uppercase', letterSpacing:'0.06em',
                        color:'#9A968C', fontWeight: 600, marginBottom: 6 }}>
            What stands in its place
          </div>
          {(s.standsIn || []).map((x, i) => (
            <div key={i} style={{ display:'flex', alignItems:'baseline', gap: 8,
                                  padding:'5px 0', borderBottom:'1px solid var(--brand-surface)', fontSize: 11.5 }}>
              <span style={{ color:'var(--brand-ink)', fontWeight: 500, flex: 1 }}>{x.what}</span>
              <span style={{ color:'#9A968C', fontSize: 10.5 }}>{x.where}</span>
              {/* The state of each stand-in names an open NC, so it is confidential. */}
              {!client && (
                <Pill size="xs"
                  color={/Open/.test(x.state) ? '#B45309' : '#047857'}
                  bg={/Open/.test(x.state) ? '#FFFBEB' : '#ECFDF5'}>{x.state}</Pill>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 12, fontSize: 10.5, color:'#9A968C', lineHeight: 1.5 }}>
        <strong style={{ color:'var(--brand-muted)' }}>Clause</strong> {s.clause}
      </div>
    </Card>
  );
}

function PageSoa() {
  const view = useSoaView();
  const client = view === 'client';
  const std = (typeof SOA_STANDARDS !== 'undefined' && SOA_STANDARDS) || [];
  const issues = (typeof SOA_ISSUES !== 'undefined' && SOA_ISSUES) || [];
  const note = (typeof SOA_NOTE !== 'undefined' && SOA_NOTE) || '';

  return (
    <div style={{ maxWidth: 1320, padding:'18px 24px 32px', display:'flex', flexDirection:'column', gap: 18 }}>
      <SoaViewToggle/>
      {client && <SoaClientBanner/>}

      {note && !client && (
        <div style={{ padding:'11px 13px', borderRadius: 8, background:'#F6F5F2',
                      border:'1px solid #E4E2DC', fontSize: 11.5, color:'#4A473F', lineHeight: 1.6 }}>
          <Icon name="info" size={12} style={{ verticalAlign:'middle', marginRight: 6 }}/>
          {note}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
        {std.map(s => <SoaStandardCard key={s.id} s={s} client={client}/>)}
      </div>

      {/* The whole of this card is internal: it is the list of things the organisation has
          not done about its own controlling document. */}
      {!client && (
        <Card padding={20}>
          <SectionTitle right={<Pill color="#B91C1C" bg="#FEF2F2" size="xs">{issues.length} open</Pill>}>
            What is wrong with the SoA
          </SectionTitle>
          <div style={{ fontSize: 11.5, color:'var(--brand-muted)', marginBottom: 10 }}>
            Every item here is visible in the document itself or in the registers that track it.
          </div>
          {issues.map((it, i) => {
            const t = SOA_TONE[it.sev] || SOA_TONE.low;
            return (
              <div key={i} style={{ display:'flex', gap: 10, padding:'11px 0',
                                    borderBottom: i === issues.length - 1 ? 'none' : '1px solid var(--brand-surface)' }}>
                <span style={{
                  flexShrink: 0, alignSelf:'flex-start', marginTop: 1,
                  fontSize: 9.5, fontWeight: 600, color: t.fg, background: t.bg,
                  border: `1px solid ${t.br}`, borderRadius: 9999, padding:'2px 8px',
                }}>{t.label}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color:'var(--brand-ink)' }}>{it.title}</div>
                  <div style={{ fontSize: 11.5, color:'var(--brand-muted)', marginTop: 3, lineHeight: 1.6 }}>{it.detail}</div>
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}

registerWidget('page-soa', PageSoa);
