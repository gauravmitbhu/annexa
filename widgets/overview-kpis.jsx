// Overview · Row 1 — KPI strip (posture, risks, policies, audit readiness)

function KPICard({ children, style }) {
  return (
    <div style={{
      background:'#fff', border:'1px solid #E5E7EB', borderRadius: 10,
      padding: 18, display:'flex', flexDirection:'column', gap: 10,
      minHeight: 142, ...style,
    }}>{children}</div>
  );
}

function KPILabel({ icon, children, right }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap: 8 }}>
      <div style={{ display:'flex', alignItems:'center', gap: 7, fontSize: 12, color:'#6B7280', fontWeight: 500, textTransform:'uppercase', letterSpacing:'0.04em' }}>
        <Icon name={icon} size={13} color="#6B2FA0"/>
        {children}
      </div>
      {right}
    </div>
  );
}

function KPIPosture() {
  const applicable = CONTROLS.filter(c => c.status !== 'na');
  const total = applicable.length;
  const compliant = applicable.filter(c => c.status === 'ok').length;
  const atRisk = applicable.filter(c => c.status === 'amber').length;
  const gaps = applicable.filter(c => c.status === 'red').length;
  const pct = compliant / total;
  const r = 28, c = 2 * Math.PI * r;
  return (
    <KPICard>
      <KPILabel icon="shield-check">Compliance Posture</KPILabel>
      <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
        <svg width="76" height="76" style={{ flexShrink: 0 }}>
          <circle cx="38" cy="38" r={r} fill="none" stroke="#F3F4F6" strokeWidth="6"/>
          <circle cx="38" cy="38" r={r} fill="none" stroke="#6B2FA0" strokeWidth="6"
            strokeDasharray={c} strokeDashoffset={c*(1-pct)} strokeLinecap="round"
            transform="rotate(-90 38 38)" />
          <text x="38" y="42" textAnchor="middle" fontSize="16" fontWeight="600" fill="#111827" fontFamily="Poppins">{Math.round(pct*100)}%</text>
        </svg>
        <div>
          <div style={{ fontSize: 22, fontWeight: 600, color:'#111827', lineHeight: 1.1 }}>
            {compliant}<span style={{ color:'#9CA3AF', fontWeight: 500 }}>/{total}</span>
          </div>
          <div style={{ fontSize: 11.5, color:'#6B7280', marginTop: 2 }}>controls compliant</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color:'#6B7280', borderTop:'1px solid #F3F4F6', paddingTop: 8, marginTop:'auto' }}>
        {atRisk} <strong style={{ color:'#B45309' }}>at risk</strong> · {gaps} <strong style={{ color:'#B91C1C' }}>gap</strong> · 1 N/A (A.8.17)
      </div>
    </KPICard>
  );
}

function KPIRisks() {
  // counts by severity: VL, L, M, H, VH
  // Risk levels per Policy 23 (3×3 matrix → 5 bands). No Very High currently open.
  const sev = [{ k:'VH', n: 0, c:'#B91C1C' },{ k:'H', n: 3, c:'#EF4444' },{ k:'M', n: 4, c:'#F59E0B' },{ k:'L', n: 3, c:'#FCD34D' },{ k:'VL', n: 1, c:'#10B981' }];
  const total = sev.reduce((a,s)=>a+s.n, 0);
  return (
    <KPICard>
      <KPILabel icon="alert-triangle">Open Risks</KPILabel>
      <div>
        <div style={{ fontSize: 28, fontWeight: 600, color:'#111827', lineHeight: 1 }}>
          {total} <span style={{ color:'#9CA3AF', fontSize: 16, fontWeight: 500 }}>/ 50 total</span>
        </div>
        <div style={{ fontSize: 11.5, color:'#6B7280', marginTop: 4 }}>active in register</div>
      </div>
      <div style={{ marginTop:'auto' }}>
        <div style={{ display:'flex', height: 8, borderRadius: 9999, overflow:'hidden', background:'#F3F4F6' }}>
          {sev.map(s => <div key={s.k} title={`${s.k}: ${s.n}`} style={{ flex: s.n, background: s.c }}/>)}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize: 10, color:'#9CA3AF', marginTop: 5 }}>
          <span>Very High</span><span>Very Low</span>
        </div>
      </div>
    </KPICard>
  );
}

function KPIPolicies() {
  return (
    <KPICard>
      <KPILabel icon="file-text" right={
        <Pill color="#047857" bg="#ECFDF5" size="xs">
          <Icon name="check-circle-2" size={10}/> all approved
        </Pill>
      }>Policies</KPILabel>
      <div>
        <div style={{ fontSize: 28, fontWeight: 600, color:'#111827', lineHeight: 1 }}>29</div>
        <div style={{ fontSize: 11.5, color:'#6B7280', marginTop: 4 }}>policies in library</div>
      </div>
      <div style={{ marginTop:'auto', fontSize: 11.5, color:'#047857', display:'flex', alignItems:'center', gap: 6 }}>
        <Icon name="check-circle-2" size={12}/> <strong style={{ fontWeight: 600 }}>29</strong> released v1.0+ · approved 10.06.2026
      </div>
    </KPICard>
  );
}

function KPIAuditReadiness() {
  return (
    <KPICard>
      <KPILabel icon="clipboard-check">Audit Readiness</KPILabel>
      <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
        <div style={{
          display:'flex', flexDirection:'column', gap: 4, padding: 6,
          background:'#F9FAFB', borderRadius: 8, border:'1px solid #E5E7EB',
        }}>
          {['#10B981','#F59E0B','#EF4444'].map((c,i) => (
            <div key={i} style={{
              width: 14, height: 14, borderRadius: 9999,
              background: i === 0 ? c : '#F3F4F6',
              border: i === 0 ? `2px solid ${c}` : '2px solid #F3F4F6',
              boxShadow: i === 0 ? `0 0 8px ${c}66` : 'none',
            }}/>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color:'#047857', lineHeight: 1.2 }}>On track</div>
          <div style={{ fontSize: 11.5, color:'#6B7280', marginTop: 2 }}>Re-certification audit · 16–17 June 2026</div>
        </div>
      </div>
      <div style={{ marginTop:'auto', fontSize: 11, color:'#6B7280', borderTop:'1px solid #F3F4F6', paddingTop: 8 }}>
        <strong style={{ color:'#047857' }}>82/92 compliant</strong> · 1 open gap (A.8.10) · EX-002 pending Board
      </div>
    </KPICard>
  );
}

function OverviewKPIs() {
  return (
    <div style={{ maxWidth: 1280, padding:'24px 24px 0' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 14 }}>
        <KPIPosture/>
        <KPIRisks/>
        <KPIPolicies/>
        <KPIAuditReadiness/>
      </div>
    </div>
  );
}

registerWidget('overview-kpis', OverviewKPIs);
