// Suppliers -> "Security posture" tab. Reads OMS from data/oms.json.
//
// Deliberately NOT merged into the VENDORS rows. The ISMS supplier register and
// the supplier-assessment platform population are different lists with different purposes, and
// blending them would present a self-declared score as though it were a property
// of the register entry. The reconciliation between the two is the useful part,
// so it gets its own section below.

function OmsScore({ v }) {
  if (v === null || v === undefined) return <span style={{ color:'#C6C4BB' }}>—</span>;
  const tone = v < 2 ? { c:'#B91C1C', bg:'#FEF2F2' } : v < 3 ? { c:'#B45309', bg:'#FFFBEB' }
                                                     : { c:'#047857', bg:'#ECFDF5' };
  return <Pill color={tone.c} bg={tone.bg} size="xs">{v.toFixed(1)}</Pill>;
}

function omsNorm(s) {
  return String(s || '').toLowerCase()
    .replace(/\b(ab|a\/s|as|bv|b\.v\.|nv|gmbh|ltd|limited|inc|group|holding)\b/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function PageSuppliersPosture() {
  const d = (typeof OMS !== 'undefined' && OMS) || null;
  if (!d) {
    return <div style={{ padding: 24, fontSize: 12, color:'var(--brand-muted)' }}>
      No supplier-assessment data loaded. Expected <code>data/oms.json</code>.</div>;
  }

  const sup = d.suppliers || [];
  const vendors = (typeof VENDORS !== 'undefined' && VENDORS) || [];

  const omsKeys = new Set(sup.map(s => omsNorm(s.name)));
  const venKeys = new Set(vendors.map(v => omsNorm(v.name)));
  const onlyOms = sup.filter(s => !venKeys.has(omsNorm(s.name)));
  const onlyVen = vendors.filter(v => !omsKeys.has(omsNorm(v.name)));

  const stale = sup.filter(s => /Jan|Feb|Mar/.test(s.lastUpdated || ''));
  const weak = sup.filter(s => s.score !== null && s.score < 2.5);
  const notValidated = sup.filter(s => s.validated !== 'Self Declared');

  const Stat = ({ n, label, tone }) => (
    <div><div style={{ fontSize: 22, fontWeight: 600, color: tone || 'var(--brand-ink)' }}>{n}</div>
      <div style={{ fontSize: 11.5, color:'var(--brand-muted)', lineHeight: 1.4 }}>{label}</div></div>
  );

  return (
    <div style={{ maxWidth: 1320, padding:'20px 24px 32px', display:'flex', flexDirection:'column', gap: 18 }}>
      <Card padding={20}>
        <SectionTitle right={<Pill color="var(--brand-muted)" bg="var(--brand-surface)" size="xs">snapshot · not live</Pill>}>
          {d.platform ? d.platform + ' · ' : ''}Supplier security posture
        </SectionTitle>
        <div style={{ fontSize: 11.5, color:'var(--brand-muted)', lineHeight: 1.6, marginBottom: 14 }}>
          {d.source} · exported {d.exportedOn}, loaded {d.loadedOn}.<br/>{d.note}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
          <Stat n={sup.length} label="suppliers assessed"/>
          <Stat n={sup.filter(s => s.criticality === 'Critical').length} label="rated Critical"/>
          <Stat n={weak.length} label="scoring below 2.5" tone="#B91C1C"/>
          <Stat n={notValidated.length} label="with no validation at all" tone="#B45309"/>
          <Stat n={stale.length} label="not updated since Q1" tone="#B45309"/>
        </div>
      </Card>

      <Card padding={20}>
        <SectionTitle right={<span style={{ fontSize: 11, color:'var(--brand-muted)' }}>lowest score first</span>}>
          Assessed suppliers
        </SectionTitle>
        <div style={{ overflowX:'auto' }}>
          <table style={{ borderCollapse:'collapse', width:'100%', fontSize: 12 }}>
            <thead><tr style={{ color:'var(--brand-muted)', fontSize: 10.5, textAlign:'left' }}>
              {['Supplier','Country','Criticality','Score','Trend','High/Crit vulns','Validated','Last updated','Cadence']
                .map(h => <th key={h} style={{ padding:'6px 10px 6px 0', fontWeight: 500 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {sup.map(s => (
                <tr key={s.name} style={{ borderTop:'1px solid var(--brand-surface)' }}>
                  <td style={{ padding:'7px 10px 7px 0', color:'var(--brand-ink)' }}>{s.name}</td>
                  <td style={{ padding:'7px 10px 7px 0', color:'var(--brand-muted)' }}>{s.country}</td>
                  <td style={{ padding:'7px 10px 7px 0' }}>
                    <Pill size="xs"
                      color={s.criticality === 'Critical' ? '#B91C1C' : s.criticality === 'Essential' ? '#B45309' : 'var(--brand-muted)'}
                      bg={s.criticality === 'Critical' ? '#FEF2F2' : s.criticality === 'Essential' ? '#FFFBEB' : 'var(--brand-surface)'}>
                      {s.criticality || '—'}</Pill>
                  </td>
                  <td style={{ padding:'7px 10px 7px 0' }}><OmsScore v={s.score}/></td>
                  <td style={{ padding:'7px 10px 7px 0', color:'var(--brand-muted)' }}>{s.trend}</td>
                  <td style={{ padding:'7px 10px 7px 0', color: s.vulnHigh ? '#B91C1C' : '#9A968C', fontWeight: s.vulnHigh ? 600 : 400 }}>
                    {s.vulnHigh || '—'}</td>
                  <td style={{ padding:'7px 10px 7px 0', color: s.validated === 'Self Declared' ? 'var(--brand-muted)' : '#B45309' }}>
                    {s.validated === '-' ? 'none' : s.validated}</td>
                  <td style={{ padding:'7px 10px 7px 0', color:'var(--brand-muted)' }}>{s.lastUpdated}</td>
                  <td style={{ padding:'7px 10px 7px 0', color:'var(--brand-muted)' }}>{s.reporting}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card padding={20}>
        <SectionTitle>Reconciliation against the ISMS supplier register</SectionTitle>
        <div style={{ fontSize: 11.5, color:'var(--brand-muted)', lineHeight: 1.6, marginBottom: 12 }}>
          Matched on a normalised name (legal suffixes stripped), so treat it as indicative rather
          than authoritative. The assessment platform is a separate population from the ISMS register, so the two can drift.
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color:'var(--brand-ink)', marginBottom: 6 }}>
              In the assessment platform but NOT in the ISMS register ({onlyOms.length})
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11.5, color:'var(--brand-muted)', lineHeight: 1.7 }}>
              {onlyOms.map(s => <li key={s.name}>{s.name} <span style={{ color:'#9A968C' }}>· {s.criticality}</span></li>)}
              {onlyOms.length === 0 && <li>None.</li>}
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color:'var(--brand-ink)', marginBottom: 6 }}>
              In the ISMS register but NOT assessed ({onlyVen.length})
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11.5, color:'var(--brand-muted)', lineHeight: 1.7 }}>
              {onlyVen.filter(v => v.crit === 'Critical' || v.crit === 'Important').slice(0, 30)
                .map(v => <li key={v.name}>{v.name} <span style={{ color:'#9A968C' }}>· {v.crit}</span></li>)}
              {onlyVen.length === 0 && <li>None.</li>}
            </ul>
            <div style={{ fontSize: 10.5, color:'#9A968C', marginTop: 6 }}>
              Critical and Important only; {onlyVen.length} unmatched in total.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

registerWidget('page-suppliers-posture', PageSuppliersPosture);
