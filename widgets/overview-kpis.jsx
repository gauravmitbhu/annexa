// Overview · Row 1 — KPI strip (control posture, risk, policies, audit position)

function KPICard({ children, style }) {
  return (
    <div style={{
      background:'#fff', border:'1px solid var(--brand-border)', borderRadius: 10,
      padding: 18, display:'flex', flexDirection:'column', gap: 10,
      // minWidth:0 is required: a grid item defaults to min-width:auto, so without
      // this the card refuses to shrink below its content and the whole row
      // overflows the column once the AI panel is open.
      minHeight: 142, minWidth: 0, ...style,
    }}>{children}</div>
  );
}

function KPILabel({ icon, children, right }) {
  return (
    // Labels can be long ("POLICIES & STANDARDS"), so the label is never truncated — if it and the status pill
    // cannot share a line, the pill wraps beneath it. A truncated label is worse
    // than a two-line header.
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap: 8, flexWrap:'wrap', rowGap: 4 }}>
      <div style={{ display:'flex', alignItems:'center', gap: 7, fontSize: 11, color:'var(--brand-muted)', fontWeight: 500, textTransform:'uppercase', letterSpacing:'0.02em', whiteSpace:'nowrap' }}>
        <Icon name={icon} size={13} color="var(--brand-accent)" style={{ flexShrink: 0 }}/>
        <span>{children}</span>
      </div>
      {right}
    </div>
  );
}

function KPIPosture() {
  const total = CONTROLS.length;
  const compliant = CONTROLS.filter(c => c.status === 'ok').length;
  const atRisk = CONTROLS.filter(c => c.status === 'amber').length;
  const gaps = CONTROLS.filter(c => c.status === 'red').length;
  const pct = compliant / total;
  const r = 28, c = 2 * Math.PI * r;
  return (
    <KPICard>
      <KPILabel icon="shield-check">Control posture</KPILabel>
      <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
        <svg width="76" height="76" style={{ flexShrink: 0 }}>
          <circle cx="38" cy="38" r={r} fill="none" style={{ stroke:'var(--brand-surface)' }} strokeWidth="6"/>
          <circle cx="38" cy="38" r={r} fill="none" style={{ stroke:'var(--brand-accent)' }} strokeWidth="6"
            strokeDasharray={c} strokeDashoffset={c*(1-pct)} strokeLinecap="round"
            transform="rotate(-90 38 38)" />
          <text x="38" y="42" textAnchor="middle" fontSize="16" fontWeight="600" style={{ fill:'var(--brand-ink)' }} fontFamily="Poppins">{Math.round(pct*100)}%</text>
        </svg>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 600, color:'var(--brand-ink)', lineHeight: 1.1 }}>
            {compliant}<span style={{ color:'#9A968C', fontWeight: 500 }}>/{total}</span>
          </div>
          <div style={{ fontSize: 11.5, color:'var(--brand-muted)', marginTop: 2, lineHeight: 1.35 }}>clean, no<br/>open finding</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color:'var(--brand-muted)', borderTop:'1px solid var(--brand-surface)', paddingTop: 8, marginTop:'auto' }}>
        {atRisk} <strong style={{ color:'#B45309' }}>with open item</strong> · {gaps} <strong style={{ color:'#B91C1C' }}>gap</strong> · 0 excluded
      </div>
    </KPICard>
  );
}

function KPIRisks() {
  const bands = [
    { k:'Very High', n: KEY_RISKS.filter(r => r.score >= 16).length, c:'#B91C1C' },
    { k:'High',      n: KEY_RISKS.filter(r => r.score >= 10 && r.score < 16).length, c:'#EF4444' },
    { k:'Medium',    n: KEY_RISKS.filter(r => r.score >= 6 && r.score < 10).length,  c:'#F59E0B' },
    { k:'Low',       n: KEY_RISKS.filter(r => r.score < 6).length, c:'#10B981' },
  ];
  const active = KEY_RISKS.filter(r => r.status === 'In Progress').length;
  return (
    <KPICard>
      <KPILabel icon="alert-triangle">Risk register</KPILabel>
      <div>
        <div style={{ fontSize: 28, fontWeight: 600, color:'var(--brand-ink)', lineHeight: 1 }}>
          {active} <span style={{ color:'#9A968C', fontSize: 16, fontWeight: 500 }}>/ {RISK_META.total} total</span>
        </div>
        <div style={{ fontSize: 11.5, color:'var(--brand-muted)', marginTop: 4 }}>under active treatment</div>
      </div>
      <div style={{ marginTop:'auto' }}>
        <div style={{ display:'flex', height: 8, borderRadius: 9999, overflow:'hidden', background:'var(--brand-surface)' }}>
          {bands.map(s => s.n > 0 && <div key={s.k} title={`${s.k}: ${s.n}`} style={{ flex: s.n, background: s.c }}/>)}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize: 10, color:'#9A968C', marginTop: 5 }}>
          <span>Very High</span><span>Low</span>
        </div>
      </div>
    </KPICard>
  );
}

function KPIPolicies() {
  const approved = POLICY_REGISTER.filter(p => p.state === 'Approved').length;
  const review = POLICY_REGISTER.filter(p => p.state === 'Under review').length;
  const toAuthor = POLICY_REGISTER.filter(p => p.state === 'To author').length;
  return (
    <KPICard>
      <KPILabel icon="file-text" right={
        <Pill color="#047857" bg="#ECFDF5" size="xs">
          <Icon name="check-circle-2" size={10}/> {approved} approved
        </Pill>
      }>Policies &amp; standards</KPILabel>
      <div>
        <div style={{ fontSize: 28, fontWeight: 600, color:'var(--brand-ink)', lineHeight: 1 }}>{approved}</div>
        <div style={{ fontSize: 11.5, color:'var(--brand-muted)', marginTop: 4 }}>in the approved library</div>
      </div>
      {/* The text is one span, not loose nodes: as separate flex children each
          fragment wrapped independently and the line came apart. */}
      <div style={{ marginTop:'auto', fontSize: 11.5, color:'#B45309', display:'flex', alignItems:'flex-start', gap: 6, lineHeight: 1.45 }}>
        <Icon name="clock" size={12} style={{ flexShrink: 0, marginTop: 2 }}/>
        <span><strong style={{ fontWeight: 600 }}>{review}</strong> under review · <strong style={{ fontWeight: 600 }}>{toAuthor}</strong> to author</span>
      </div>
    </KPICard>
  );
}

function KPIAuditPosition() {
  const pct = Math.round(NC_META.actionsDone / NC_META.actionsTotal * 100);
  return (
    <KPICard>
      <KPILabel icon="clipboard-check" right={
        <Pill color="#047857" bg="#ECFDF5" size="xs">no majors</Pill>
      }>Certification position</KPILabel>
      <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
        <div style={{
          display:'flex', flexDirection:'column', gap: 4, padding: 6,
          background:'#F7F6F3', borderRadius: 8, border:'1px solid var(--brand-border)',
        }}>
          {['#10B981','#F59E0B','#EF4444'].map((c,i) => (
            <div key={i} style={{
              width: 14, height: 14, borderRadius: 9999,
              background: i === 1 ? c : 'var(--brand-surface)',
              border: i === 1 ? `2px solid ${c}` : '2px solid var(--brand-surface)',
              boxShadow: i === 1 ? `0 0 8px ${c}66` : 'none',
            }}/>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color:'#B45309', lineHeight: 1.2 }}>Remediating</div>
          <div style={{ fontSize: 11.5, color:'var(--brand-muted)', marginTop: 2 }}>{NC_META.total} findings · {NC_META.body}</div>
        </div>
      </div>
      <div style={{ marginTop:'auto', fontSize: 11, color:'var(--brand-muted)', borderTop:'1px solid var(--brand-surface)', paddingTop: 8 }}>
        <strong style={{ color:'#B45309' }}>{NC_META.actionsDone}/{NC_META.actionsTotal} actions done ({pct}%)</strong> · {NC_META.minor} minor · {NC_META.observations} observations
      </div>
    </KPICard>
  );
}

function OverviewKPIs() {
  return (
    <div style={{ maxWidth: 1320, padding:'24px 24px 0' }}>
      {/* minmax(0,1fr), not plain 1fr: a grid track's implicit min is auto, which
          is why four cards overflowed the ~930px column once the AI panel was
          open. minmax(0,…) keeps the reference's four-across layout while letting
          the cards actually shrink. */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, minmax(0, 1fr))', gap: 14 }}>
        <KPIPosture/>
        <KPIRisks/>
        <KPIPolicies/>
        <KPIAuditPosition/>
      </div>
    </div>
  );
}

registerWidget('overview-kpis', OverviewKPIs);
