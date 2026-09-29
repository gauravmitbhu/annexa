// Overview · Row 4 — risk heatmap + exception register + findings by standard

function ovRiskColor(score) {
  if (score >= 16) return '#DC2626';
  if (score >= 10) return '#F87171';
  if (score >= 6)  return '#FCA5A5';
  if (score >= 4)  return '#FEF3C7';
  return '#ECFDF5';
}

function RiskMatrix() {
  const rows = RISK_GRID.slice().reverse();
  return (
    <Card padding={18}>
      <h2 style={{ margin:'0 0 4px 0', fontSize: 14, fontWeight: 600, color:'var(--brand-ink)' }}>Risk heatmap</h2>
      <div style={{ fontSize: 11, color:'var(--brand-muted)', marginBottom: 14 }}>
        5×5 likelihood × consequence · {RISK_META.total} risks in the register
      </div>
      <div style={{ display:'flex', gap: 8 }}>
        <div style={{
          writingMode:'vertical-rl', transform:'rotate(180deg)',
          fontSize: 9.5, color:'#9A968C', fontWeight: 500, letterSpacing:'0.08em',
          textAlign:'center', textTransform:'uppercase',
        }}>Likelihood →</div>
        <div style={{ flex: 1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap: 3 }}>
            {rows.map((row, ri) => row.map((n, ci) => {
              const lik = 5 - ri;
              const score = lik * (ci + 1);
              return (
                <div key={`${ri}-${ci}`} style={{
                  aspectRatio:'1.25', background: ovRiskColor(score),
                  borderRadius: 4, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  fontSize: 12, fontWeight: 600, color: score >= 16 ? '#fff' : 'var(--brand-ink)',
                  opacity: n > 0 ? 1 : 0.5,
                }} title={`L${lik} × C${ci + 1} = ${score} · ${n} risk${n === 1 ? '' : 's'}`}>
                  {n || ''}
                  <div style={{ fontSize: 8, fontWeight: 500, color: score >= 16 ? '#FECACA' : '#9A968C' }}>{score}</div>
                </div>
              );
            }))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap: 3, marginTop: 4 }}>
            {[1,2,3,4,5].map(l => (
              <div key={l} style={{ fontSize: 9, color:'#9A968C', textAlign:'center', fontWeight: 500 }}>{l}</div>
            ))}
          </div>
          <div style={{ fontSize: 9.5, color:'#9A968C', textAlign:'center', marginTop: 2, letterSpacing:'0.08em', textTransform:'uppercase' }}>
            Consequence →
          </div>
        </div>
      </div>
      <div style={{
        marginTop: 12, padding: 10, borderRadius: 8,
        background:'color-mix(in srgb, var(--brand-accent) 6%, transparent)', border:'1px solid color-mix(in srgb, var(--brand-accent) 18%, transparent)',
        fontSize: 11.5, color:'#B8410F', lineHeight: 1.5,
      }}>
        {RISK_META.highlight || ''}
      </div>
    </Card>
  );
}

function ExceptionsList() {
  return (
    <Card padding={0}>
      <div style={{ padding:'16px 18px 10px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color:'var(--brand-ink)' }}>Accepted deviations</h2>
          <div style={{ fontSize: 11, color:'var(--brand-muted)', marginTop: 2 }}>No Annex A control is excluded from the SoA</div>
        </div>
        <Pill color="var(--brand-accent)" bg="color-mix(in srgb, var(--brand-accent) 8%, transparent)">{EXCEPTIONS.length}</Pill>
      </div>
      <div className="scroll-y" style={{ maxHeight: 318, overflowY:'auto', borderTop:'1px solid var(--brand-surface)' }}>
        {EXCEPTIONS.map(e => (
          <div key={e.id} style={{
            padding:'10px 18px', borderBottom:'1px solid var(--brand-surface)',
            display:'flex', alignItems:'center', gap: 10,
          }}>
            <span style={{
              fontSize: 10, fontWeight: 600, color:'var(--brand-accent)',
              background:'color-mix(in srgb, var(--brand-accent) 8%, transparent)', padding:'2px 6px', borderRadius: 4,
              fontFamily:'ui-monospace, monospace', flexShrink: 0, minWidth: 62, textAlign:'center',
            }}>{e.id}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color:'var(--brand-ink)', fontWeight: 500, lineHeight: 1.35 }}>
                {e.title}
              </div>
              <div style={{ fontSize: 10.5, color:'var(--brand-muted)', marginTop: 2, fontFamily:'ui-monospace, monospace' }}>
                {e.ctrls.join(' · ')} · {e.source}
              </div>
            </div>
            {e.approval === 'accepted'
              ? <Pill color="#047857" bg="#ECFDF5" size="xs">accepted</Pill>
              : <Pill color="#B45309" bg="#FFFBEB" size="xs">recorded</Pill>}
          </div>
        ))}
      </div>
    </Card>
  );
}

function FindingsByStandard() {
  const total = NC_META.total;
  const segs = STANDARDS.map((s, i) => ({
    label: s.label,
    n: s.ncs,
    c: ['var(--brand-accent)', '#10B981', '#3B82F6'][i] || '#9A968C',
  }));
  const r = 36, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <Card padding={18}>
      <h2 style={{ margin:'0 0 2px 0', fontSize: 14, fontWeight: 600, color:'var(--brand-ink)' }}>Findings by standard</h2>
      <div style={{ fontSize: 11, color:'var(--brand-muted)' }}>Latest certification audit · {NC_META.body}</div>
      <div style={{ display:'flex', alignItems:'center', gap: 18, marginTop: 14 }}>
        <svg width="92" height="92" style={{ flexShrink: 0 }}>
          <circle cx="46" cy="46" r={r} fill="none" style={{ stroke:'var(--brand-surface)' }} strokeWidth="8"/>
          {segs.map(s => {
            const len = c * (s.n / total);
            const el = (
              <circle key={s.label} cx="46" cy="46" r={r} fill="none" style={{ stroke: s.c }} strokeWidth="8"
                strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset}
                transform="rotate(-90 46 46)"/>
            );
            offset += len;
            return el;
          })}
          <text x="46" y="44" textAnchor="middle" fontSize="18" fontWeight="600" style={{ fill:'var(--brand-ink)' }} fontFamily="Poppins">{total}</text>
          <text x="46" y="60" textAnchor="middle" fontSize="9.5" style={{ fill:'var(--brand-muted)' }} fontFamily="Poppins">findings</text>
        </svg>
        <div style={{ flex: 1, minWidth: 0 }}>
          {segs.map(s => (
            <div key={s.label} style={{ display:'flex', alignItems:'center', gap: 7, marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 9999, background: s.c, flexShrink: 0 }}/>
              <span style={{ fontSize: 11.5, color:'#343128', flex: 1, minWidth: 0 }}>{s.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color:'var(--brand-ink)' }}>{s.n}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop:'1px solid var(--brand-surface)', fontSize: 11, color:'var(--brand-muted)', lineHeight: 1.5 }}>
        <strong style={{ color:'#047857', fontWeight: 600 }}>No majors.</strong> ISO 14001 carries the largest share — the environmental system is the newest of the three.
      </div>
    </Card>
  );
}

function OverviewRisk() {
  return (
    <div style={{ maxWidth: 1320, padding:'18px 24px 0' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 14 }}>
        <RiskMatrix/>
        <ExceptionsList/>
        <FindingsByStandard/>
      </div>
    </div>
  );
}

registerWidget('overview-risk', OverviewRisk);
