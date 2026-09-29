// ESG page — sustainability rating and emissions targets. Reads ESG_META / GRESB / SBTI from data/esg.json.

function EsgMetric({ m }) {
  const up = m.direction === 'up';
  // "up" is not automatically good here: renewables rising is good, Scope 1-3
  // rising is not. Colour on the metric's own meaning, not the arrow.
  const good = (m.id === 'renewable' && up) || (m.id !== 'renewable' && !up);
  const col = good ? '#047857' : '#B45309';
  return (
    <div style={{
      background:'#fff', border:'1px solid var(--brand-border)', borderRadius: 10,
      padding: 16, minWidth: 0, display:'flex', flexDirection:'column', gap: 6,
    }}>
      <div style={{ fontSize: 11, color:'var(--brand-muted)', textTransform:'uppercase', letterSpacing:'0.02em' }}>{m.label}</div>
      <div style={{ display:'flex', alignItems:'baseline', gap: 8, flexWrap:'wrap' }}>
        <span style={{ fontSize: 22, fontWeight: 600, color:'var(--brand-ink)' }}>{m.value}</span>
        <span style={{ fontSize: 11.5, color: col, fontWeight: 600 }}>
          <Icon name={up ? 'arrow-up-right' : 'arrow-down-right'} size={11} style={{ verticalAlign:'middle' }}/> from {m.prior}
        </span>
      </div>
      <div style={{ fontSize: 11, color:'var(--brand-muted)', lineHeight: 1.5 }}>{m.note}</div>
    </div>
  );
}

function EsgGresb() {
  const g = GRESB;
  return (
    <Card padding={20}>
      <SectionTitle right={<Pill color="#B45309" bg="#FFFBEB">{g.rating}</Pill>}>Sustainability rating</SectionTitle>

      <div style={{
        background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius: 8,
        padding: 12, fontSize: 11.5, color:'#92400E', lineHeight: 1.55, marginBottom: 14,
      }}>
        <strong>Rating {g.rating}</strong> as at {g.ratingDate}. {g.ratingNote}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {g.metrics.map(m => <EsgMetric key={m.id} m={m}/>)}
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color:'var(--brand-ink)', marginBottom: 6 }}>
          {g.matrix.name} · {g.matrix.version}
        </div>
        <div style={{ fontSize: 11.5, color:'var(--brand-muted)', lineHeight: 1.6 }}>
          <div>{g.matrix.state}</div>
          <div style={{ marginTop: 4 }}>Relevance ratings come from {g.matrix.relevanceSource}</div>
          <div style={{ marginTop: 4, color:'#B45309' }}><strong>Open:</strong> {g.matrix.open}</div>
          <div style={{ marginTop: 4, color:'#B91C1C' }}>⚠ {g.matrix.warning}</div>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color:'var(--brand-ink)', marginBottom: 8 }}>Deadlines</div>
        <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
          {g.deadlines.map((d, i) => {
            const tone = d.state === 'met' ? { c:'#047857', bg:'#ECFDF5' }
                       : d.state === 'blocked' ? { c:'#B91C1C', bg:'#FEF2F2' }
                       : { c:'#B45309', bg:'#FFFBEB' };
            return (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap: 10, fontSize: 11.5 }}>
                <Pill color={tone.c} bg={tone.bg} size="xs">{d.state}</Pill>
                <div style={{ minWidth: 0, color:'#343128', lineHeight: 1.5 }}>
                  {d.what}{d.when ? <span style={{ color:'var(--brand-muted)' }}> · {d.when}</span> : null}
                  {d.note ? <div style={{ color:'var(--brand-muted)', marginTop: 2 }}>{d.note}</div> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function EsgSbti() {
  const s = SBTI;
  return (
    <Card padding={20}>
      <SectionTitle right={<Pill color="var(--brand-muted)" bg="var(--brand-surface)">{s.status}</Pill>}>Emissions targets</SectionTitle>

      <div style={{ fontSize: 11.5, color:'#343128', lineHeight: 1.6 }}>
        <strong>Sequencing.</strong> {s.sequence}
      </div>

      <div style={{
        marginTop: 14, background:'#F7F6F3', border:'1px solid var(--brand-border)',
        borderRadius: 8, padding: 12, fontSize: 11.5, color:'#343128', lineHeight: 1.55,
      }}>
        <strong>{s.questionnaire.name}</strong>
        <div style={{ color:'var(--brand-muted)', marginTop: 3 }}>{s.questionnaire.state} · {s.questionnaire.where}</div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color:'var(--brand-ink)', marginBottom: 6 }}>Open questions</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11.5, color:'var(--brand-muted)', lineHeight: 1.7 }}>
          {s.openQuestions.map((q, i) => <li key={i}>{q}</li>)}
        </ul>
      </div>

      <div style={{
        marginTop: 16, background:'#FEF2F2', border:'1px solid #FECACA',
        borderRadius: 8, padding: 12, fontSize: 11.5, color:'#B91C1C', lineHeight: 1.55,
      }}>
        <strong>{s.boardDeck.what} · {s.boardDeck.when}</strong>
        <div style={{ marginTop: 3 }}>{s.boardDeck.owners}</div>
        <div style={{ marginTop: 3, color:'#7F1D1D' }}>{s.boardDeck.note}</div>
      </div>
    </Card>
  );
}

function PageEsg() {
  return (
    <div style={{ maxWidth: 1320, padding:'24px 24px 32px', display:'flex', flexDirection:'column', gap: 18 }}>
      <div style={{ fontSize: 11.5, color:'var(--brand-muted)', lineHeight: 1.6 }}>
        Owner {ESG_META.owner} · sponsor {ESG_META.sponsor} · stakeholder {ESG_META.investor}{ESG_META.investorContact ? ` (${ESG_META.investorContact})` : ''}.
        <div style={{ marginTop: 2 }}>{ESG_META.note}</div>
      </div>
      <EsgGresb/>
      <EsgSbti/>
    </div>
  );
}

registerWidget('page-esg', PageEsg);
