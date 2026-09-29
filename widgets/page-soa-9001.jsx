// SoA · ISO 9001 and ISO 14001.
//
// Neither standard has an Annex A, so neither has a Statement of Applicability.
// Both tabs render from the same component and say the same three things: why
// there is no SoA, what performs the same job instead, and where that is
// currently failing. The gaps are internal, so the client view drops them.

function SoaOtherStandard({ id }) {
  const view = useSoaView();
  const client = view === 'client';
  const std = (typeof SOA_STANDARDS !== 'undefined' && SOA_STANDARDS) || [];
  const s = std.find(x => x.id === id);
  if (!s) return null;

  return (
    <div style={{ maxWidth: 1320, padding:'18px 24px 32px', display:'flex', flexDirection:'column', gap: 18 }}>
      <SoaViewToggle/>
      {client && <SoaClientBanner/>}

      <Card padding={20}>
        <SectionTitle right={<Pill color="var(--brand-muted)" bg="#F6F5F2" size="xs">no SoA</Pill>}>
          {s.standard} — {s.title}
        </SectionTitle>
        <div style={{ fontSize: 12, color:'#343128', lineHeight: 1.65 }}>{s.summary}</div>
        <div style={{ marginTop: 12, display:'flex', gap: 10, padding:'7px 0',
                      borderTop:'1px solid var(--brand-surface)', fontSize: 11.5 }}>
          <span style={{ width: 120, flexShrink: 0, color:'#9A968C' }}>Governing clause</span>
          <span style={{ color:'var(--brand-ink)', fontWeight: 500 }}>{s.clause}</span>
        </div>
        <div style={{ display:'flex', gap: 10, padding:'7px 0', borderTop:'1px solid var(--brand-surface)', fontSize: 11.5 }}>
          <span style={{ width: 120, flexShrink: 0, color:'#9A968C' }}>Certified scope</span>
          <span style={{ color:'var(--brand-ink)', fontWeight: 500 }}>{s.scope}</span>
        </div>
      </Card>

      <Card padding={20}>
        <SectionTitle>What determines applicability instead</SectionTitle>
        {(s.standsIn || []).map((x, i) => (
          <div key={i} style={{ display:'flex', alignItems:'baseline', gap: 10,
                                padding:'9px 0', borderBottom:'1px solid var(--brand-surface)', fontSize: 12 }}>
            <span style={{ color:'var(--brand-ink)', fontWeight: 500, flex: 1, minWidth: 0 }}>{x.what}</span>
            <span style={{ fontSize: 11, color:'#9A968C' }}>{x.where}</span>
            {!client && (
              <Pill size="xs"
                color={/Open/.test(x.state) ? '#B45309' : '#047857'}
                bg={/Open/.test(x.state) ? '#FFFBEB' : '#ECFDF5'}>{x.state}</Pill>
            )}
          </div>
        ))}
      </Card>

      {!client && (s.gaps || []).length > 0 && (
        <Card padding={20}>
          <SectionTitle right={<Pill color="#B45309" bg="#FFFBEB" size="xs">{s.gaps.length} open</Pill>}>
            Where it is failing
          </SectionTitle>
          {s.gaps.map((g, i) => (
            <div key={i} style={{ display:'flex', gap: 10, padding:'10px 0',
                                  borderBottom: i === s.gaps.length - 1 ? 'none' : '1px solid var(--brand-surface)' }}>
              <span style={{ flexShrink: 0, fontFamily:'ui-monospace, monospace', fontSize: 11,
                             fontWeight: 600, color:'#B91C1C', width: 92 }}>{g.ref}</span>
              <span style={{ fontSize: 11.5, color:'var(--brand-muted)', lineHeight: 1.6, minWidth: 0 }}>{g.note}</span>
            </div>
          ))}
        </Card>
      )}

      {!client && <SoaLinks s={s}/>}
    </div>
  );
}

function PageSoa9001()  { return <SoaOtherStandard id="9001"/>; }
function PageSoa14001() { return <SoaOtherStandard id="14001"/>; }

registerWidget('page-soa-9001',  PageSoa9001);
registerWidget('page-soa-14001', PageSoa14001);
