// Risk Register page: 5×5 risk matrix,
// tracked risks with inherent and residual scores, and the acceptance model.

const RK_LEVEL_PILL = {
  'Very Low':  { bg:'#ECFDF5', fg:'#047857' },
  'Low':       { bg:'#ECFDF5', fg:'#047857' },
  'Medium':    { bg:'#FFFBEB', fg:'#B45309' },
  'High':      { bg:'#FEF2F2', fg:'#B91C1C' },
  'Very High': { bg:'#DC2626', fg:'#fff' },
};

// 5×5 heat: colour by likelihood × consequence product.
function rkCellColor(score) {
  if (score >= 16) return '#DC2626';
  if (score >= 10) return '#F87171';
  if (score >= 6)  return '#FCA5A5';
  if (score >= 4)  return '#FEF3C7';
  return '#ECFDF5';
}
function rkCellText(score) { return score >= 16 ? '#fff' : score >= 10 ? '#7F1D1D' : 'var(--brand-ink)'; }

function RKTile({ icon, label, value, sub, color }) {
  return (
    <Card padding={16}>
      <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:11.5, color:'var(--brand-muted)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.04em' }}>
        <Icon name={icon} size={13} color="var(--brand-accent)"/> {label}
      </div>
      <div style={{ fontSize:28, fontWeight:600, color, marginTop:8, lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:'#9A968C', marginTop:4 }}>{sub}</div>}
    </Card>
  );
}

function RKMatrix5() {
  // RISK_GRID rows are likelihood 1..5; render highest likelihood at the top.
  const rows = RISK_GRID.slice().reverse();
  return (
    <Card padding={20}>
      <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'var(--brand-ink)' }}>Risk matrix — 5×5</h2>
      <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:2, marginBottom:14, lineHeight:1.5 }}>
        {RISK_META.method}. Cell counts are inherent scores across all {RISK_META.total} risks in the register.
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <div style={{ writingMode:'vertical-rl', transform:'rotate(180deg)', fontSize:9.5, color:'#9A968C', fontWeight:500, letterSpacing:'0.08em', textAlign:'center', textTransform:'uppercase' }}>Likelihood →</div>
        <div style={{ flex:1 }}>
          {rows.map((row, ri) => {
            const lik = 5 - ri;
            return (
              <div key={ri} style={{ display:'grid', gridTemplateColumns:'26px repeat(5, 1fr)', gap:4, marginBottom:4 }}>
                <div style={{ fontSize:11, color:'var(--brand-muted)', alignSelf:'center', textAlign:'right', paddingRight:4, fontWeight:500 }}>{lik}</div>
                {row.map((n, ci) => {
                  const score = lik * (ci + 1);
                  return (
                    <div key={ci} style={{
                      aspectRatio:'1.9', background: rkCellColor(score), borderRadius:6,
                      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                      border: n > 0 ? '1px solid rgba(0,0,0,0.06)' : '1px dashed rgba(0,0,0,0.05)',
                      opacity: n > 0 ? 1 : 0.55,
                    }} title={`Likelihood ${lik} × consequence ${ci + 1} = ${score} · ${n} risk${n === 1 ? '' : 's'}`}>
                      <div style={{ fontSize:16, fontWeight:600, color: rkCellText(score) }}>{n || ''}</div>
                      <div style={{ fontSize:9, color: score >= 16 ? '#FECACA' : 'var(--brand-muted)' }}>{score}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          <div style={{ display:'grid', gridTemplateColumns:'26px repeat(5, 1fr)', gap:4 }}>
            <div/>
            {[1,2,3,4,5].map(c => <div key={c} style={{ fontSize:11, color:'var(--brand-muted)', textAlign:'center', fontWeight:500 }}>{c}</div>)}
          </div>
          <div style={{ fontSize:9.5, color:'#9A968C', textAlign:'center', marginTop:4, letterSpacing:'0.08em', textTransform:'uppercase' }}>Consequence →</div>
        </div>
      </div>
      <div style={{ marginTop:12, padding:10, borderRadius:8, background:'color-mix(in srgb, var(--brand-accent) 6%, transparent)', border:'1px solid color-mix(in srgb, var(--brand-accent) 18%, transparent)', fontSize:11.5, color:'#B8410F', lineHeight:1.55 }}>
        <strong style={{ fontWeight:600 }}>Data quality.</strong> {RISK_META.dataNote}
      </div>
    </Card>
  );
}

function RKKeyRisks() {
  return (
    <Card padding={0}>
      <div style={{ padding:'16px 20px 10px' }}>
        <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'var(--brand-ink)' }}>Tracked risks</h2>
        <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:2 }}>
          From the RAS. Where treatment has been verified, the residual score is shown alongside the inherent score.
        </div>
      </div>
      {KEY_RISKS.map(r => {
        const pc = RK_LEVEL_PILL[r.level] || RK_LEVEL_PILL['Medium'];
        const sc = OFI_STATUS_COLOR[r.status] || OFI_STATUS_COLOR['Open'];
        return (
          <div key={r.id} style={{ padding:'13px 20px', borderTop:'1px solid var(--brand-surface)', display:'grid', gridTemplateColumns:'92px 1fr 150px', gap:14, alignItems:'start' }}>
            <span style={{ padding:'2px 8px', borderRadius:4, background:'color-mix(in srgb, var(--brand-accent) 8%, transparent)', color:'var(--brand-accent)', fontSize:10.5, fontWeight:600, textAlign:'center', fontFamily:'ui-monospace, monospace' }}>{r.id}</span>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:500, color:'var(--brand-ink)', lineHeight:1.45 }}>{r.title}</div>
              <div style={{ fontSize:11.5, color:'var(--brand-muted)', lineHeight:1.5, marginTop:4 }}>{r.treatment}</div>
              <div style={{ display:'flex', gap:10, marginTop:7, alignItems:'center', flexWrap:'wrap' }}>
                <span style={{ fontSize:10.5, color:'#9A968C' }}>
                  L{r.l} × C{r.i} = <strong style={{ fontWeight:600, color:'#4A473F' }}>{r.score}</strong>
                  {r.residual > 0 && <> → residual L{r.rl} × C{r.ri} = <strong style={{ fontWeight:600, color:'#047857' }}>{r.residual}</strong></>}
                </span>
                <span style={{ fontSize:10.5, color:'#9A968C' }}>
                  action owner <strong style={{ fontWeight:600, color:'#4A473F' }}>{r.owner}</strong> · risk owner <strong style={{ fontWeight:600, color:'#4A473F' }}>{r.riskOwner}</strong>
                </span>
                {r.due && <span style={{ fontSize:10.5, color:'#9A968C' }}>due {r.due}</span>}
                {(r.links || []).map((l, i) => (
                  <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:10.5, color:'var(--brand-accent)', display:'inline-flex', alignItems:'center', gap:3 }}>
                    <Icon name={l.type === 'ticket' ? 'square-check-big' : l.type === 'sheet' ? 'table' : 'file-text'} size={10}/> {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div style={{ justifySelf:'end', textAlign:'right' }}>
              <Pill color={pc.fg} bg={pc.bg}><strong style={{ fontWeight:600 }}>{r.level} ({r.score})</strong></Pill>
              <div style={{ marginTop:5 }}>
                <Pill color={sc.fg} bg={sc.bg} size="xs">{r.status}</Pill>
              </div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

function RisksPage() {
  const inProgress = KEY_RISKS.filter(r => r.status === 'In Progress').length;
  const high       = KEY_RISKS.filter(r => r.score >= 10).length;
  const veryHigh   = KEY_RISKS.filter(r => r.score >= 16).length;

  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:18, maxWidth:1320 }}>
      <div style={{ padding:'12px 16px', borderRadius:10, background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.28)', fontSize:12.5, color:'#7C2D12', lineHeight:1.55, display:'flex', alignItems:'flex-start', gap:10 }}>
        <Icon name="alert-triangle" size={16} color="#B45309" style={{ marginTop:2 }}/>
        <span><strong style={{ fontWeight:600 }}>Risk-owner acceptance.</strong> {RISK_META.acceptanceNote}</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <RKTile icon="alert-triangle" label="Risks in register" value={RISK_META.total} sub="risk register" color="var(--brand-ink)"/>
        <RKTile icon="activity"       label="Under treatment"   value={inProgress}      sub="of the tracked set" color="#B45309"/>
        <RKTile icon="flame"          label="Inherent ≥ 10"     value={high}            sub="high and above" color="#B91C1C"/>
        <RKTile icon="shield-alert"   label="Inherent ≥ 16"     value={veryHigh}        sub="very high" color="#B91C1C"/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:14 }}>
        <RKMatrix5/>
        <Card padding={20}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'var(--brand-ink)' }}>Acceptance model</h2>
          <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:2, marginBottom:12 }}>{RISK_META.process || 'Per the risk management process.'}</div>
          {RISK_ACCEPTANCE.map(a => (
            <div key={a.level} style={{ display:'grid', gridTemplateColumns:'110px 1fr', gap:10, padding:'9px 0', borderTop:'1px solid var(--brand-surface)', fontSize:12 }}>
              <span style={{ color:'var(--brand-ink)', fontWeight:500 }}>{a.level}</span>
              <span style={{ color:'var(--brand-muted)', lineHeight:1.5 }}>{a.authority}</span>
            </div>
          ))}
          <div style={{ marginTop:12, fontSize:11, color:'var(--brand-muted)', borderTop:'1px solid var(--brand-surface)', paddingTop:10, lineHeight:1.5 }}>
            {RISK_META.reviewCadence}. Escalation from departmental to group register follows the escalation procedure in the risk assessment process.
          </div>
        </Card>
      </div>

      <RKKeyRisks/>

      <Card padding={20}>
        <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'var(--brand-ink)', marginBottom:10 }}>Evidence</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:6, maxWidth:600 }}>
          {RISK_EVIDENCE.map((l, i) => <CoreLinkRow key={i} link={l}/>)}
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { RisksPage });

registerWidget('page-risks', RisksPage);
