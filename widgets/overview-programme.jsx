// Overview · Row 3b — awareness training and supplier posture.
//
// TRAINING_STATUS comes from the read-only LMS sync (optional field
// mandatoryCourse names the annual course, default "Information Security");
// OMS is a supplier-assessment export (optional field platform names the tool).
// Each card states how fresh its source is, because the two differ — one is a
// live API pull, the other a hand-downloaded snapshot.

const OVP_MANDATORY = /secur|phish|password|malware|virus|gdpr|privacy|data protect|acceptable use|social engineer|incident|continuity|whistle|briber|money launder|conduct|ai polic|cyber|harassment|discriminat/i;

function OvpTraining() {
  const d = (typeof TRAINING_STATUS !== 'undefined' && TRAINING_STATUS) || null;
  if (!d) return null;

  const people = d.people || [];
  const enrolledOn = (nameRe) => people.filter(p => (p.courses || []).some(c => nameRe.test(String(c.name))));
  const completedOn = (nameRe) => people.filter(p => (p.courses || []).some(
    c => nameRe.test(String(c.name)) && String(c.status || '').toLowerCase().includes('complet')));

  const mandatoryName = d.mandatoryCourse || 'Information Security';
  const INFOSEC = new RegExp('^' + mandatoryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
  const secEnrolled = enrolledOn(INFOSEC).length;
  const secDone = completedOn(INFOSEC).length;
  const pct = secEnrolled ? Math.round(100 * secDone / secEnrolled) : 0;
  const coverage = people.length ? Math.round(100 * secEnrolled / people.length) : 0;

  // Compliance courses enrolled to fewer than half the organisation. This — not
  // the Information Security completion rate — is where "mandatory for all
  // staff" breaks down: a 100% pass rate on a course six people are enrolled on
  // says nothing about the other forty-two.
  const counts = {};
  people.forEach(p => (p.courses || []).forEach(c => {
    if (!OVP_MANDATORY.test(String(c.name))) return;
    counts[c.name] = (counts[c.name] || 0) + 1;
  }));
  const thinCover = Object.entries(counts)
    .filter(([, n]) => n < people.length / 2)
    .map(([name, n]) => ({ name, n }))
    .sort((a, b) => a.n - b.n);

  return (
    <Card padding={20}>
      <SectionTitle right={<Pill color="#047857" bg="#ECFDF5" size="xs">live API</Pill>}>
        Awareness training
      </SectionTitle>
      <div style={{ display:'flex', alignItems:'baseline', gap: 10, flexWrap:'wrap' }}>
        <span style={{ fontSize: 26, fontWeight: 600, color:'var(--brand-ink)' }}>{secDone}</span>
        <span style={{ fontSize: 14, color:'#9A968C' }}>/ {secEnrolled} enrolled</span>
        <Pill color={pct >= 90 ? '#047857' : '#B45309'} bg={pct >= 90 ? '#ECFDF5' : '#FFFBEB'} size="xs">{pct}%</Pill>
      </div>
      <div style={{ fontSize: 11.5, color:'var(--brand-muted)', marginTop: 2 }}>
        completed <strong>{mandatoryName}</strong>, the mandatory annual course
      </div>

      <div style={{ marginTop: 12, paddingTop: 10, borderTop:'1px solid var(--brand-surface)',
                    fontSize: 11.5, color:'var(--brand-muted)', lineHeight: 1.6 }}>
        <strong style={{ color:'#B45309' }}>{secEnrolled - secDone} people outstanding</strong> on
        the mandatory course — enrolment covers all {people.length} ({coverage}%), so this is a
        completion gap, not a coverage one.
        {thinCover.length > 0 && (
          <div style={{ marginTop: 6 }}>
            🚩 <strong style={{ color:'#B91C1C' }}>Coverage IS the gap elsewhere.</strong>{' '}
            {thinCover.length} compliance course{thinCover.length === 1 ? ' is' : 's are'} enrolled
            to fewer than half the organisation — {thinCover.slice(0, 3).map(c => `${c.name} (${c.n})`).join(', ')}
            {thinCover.length > 3 ? ` and ${thinCover.length - 3} more` : ''}.
          </div>
        )}
      </div>
      <div style={{ fontSize: 10.5, color:'#9A968C', marginTop: 8 }}>
        {d.source} · synced {String(d.syncedAt || '').replace('T', ' ').replace('Z', ' UTC')}
      </div>
    </Card>
  );
}

function OvpSuppliers() {
  const d = (typeof OMS !== 'undefined' && OMS) || null;
  if (!d) return null;
  const sup = d.suppliers || [];
  const weak = sup.filter(s => s.score !== null && s.score < 2.5);
  const unval = sup.filter(s => s.validated !== 'Self Declared');
  const stale = sup.filter(s => /Jan|Feb|Mar|Dec/.test(s.lastUpdated || ''));
  const worst = sup.filter(s => s.score !== null).sort((a, b) => a.score - b.score)[0];

  const Row = ({ n, label, tone }) => (
    <div style={{ display:'flex', alignItems:'baseline', gap: 8, fontSize: 11.5, color:'var(--brand-muted)' }}>
      <strong style={{ color: tone || 'var(--brand-ink)', fontSize: 13 }}>{n}</strong> {label}
    </div>
  );

  return (
    <Card padding={20}>
      <SectionTitle right={<Pill color="#B45309" bg="#FFFBEB" size="xs">snapshot</Pill>}>
        Supplier security posture
      </SectionTitle>
      <div style={{ display:'flex', alignItems:'baseline', gap: 10 }}>
        <span style={{ fontSize: 26, fontWeight: 600, color:'var(--brand-ink)' }}>{sup.length}</span>
        <span style={{ fontSize: 11.5, color:'var(--brand-muted)' }}>suppliers assessed in {d.platform || 'the supplier assessment platform'}</span>
      </div>
      <div style={{ marginTop: 10, display:'flex', flexDirection:'column', gap: 4 }}>
        <Row n={weak.length} label="scoring below 2.5" tone="#B91C1C"/>
        <Row n={unval.length} label="with no validation at all" tone="#B45309"/>
        <Row n={stale.length} label="not updated this quarter" tone="#B45309"/>
      </div>
      {worst && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop:'1px solid var(--brand-surface)',
                      fontSize: 11.5, color:'var(--brand-muted)', lineHeight: 1.6 }}>
          Lowest: <strong style={{ color:'#B91C1C' }}>{worst.name}</strong> at {worst.score}
          {worst.vulnHigh ? <> with <strong>{worst.vulnHigh}</strong> high/critical vulnerabilities</> : null}.
          <div style={{ marginTop: 4 }}>
            ⚠ Every score is <strong>self-declared</strong> — the supplier's own assertion, not an
            independent assessment.
          </div>
        </div>
      )}
      <div style={{ fontSize: 10.5, color:'#9A968C', marginTop: 8 }}>
        Export of {d.exportedOn} · does not refresh itself
      </div>
    </Card>
  );
}

function OverviewProgramme() {
  return (
    <div style={{ maxWidth: 1320, padding:'0 24px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
        <OvpTraining/>
        <OvpSuppliers/>
      </div>
    </div>
  );
}

registerWidget('overview-programme', OverviewProgramme);
