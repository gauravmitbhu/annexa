// Risks page — 3×3 canonical matrix (Policy 23 v1.0), key risks, acceptance authority, evidence.
// Day 1 · 11:30–12:30 audit slot (clauses 6.1 + 8.2/8.3).

const RK_SCORE_COLOR = { 1:'#ECFDF5', 2:'#D1FAE5', 3:'#FEF3C7', 4:'#FED7AA', 6:'#FCA5A5', 9:'#DC2626' };
const RK_LEVEL_PILL = {
  'Very Low':{bg:'#ECFDF5',fg:'#047857'}, 'Low':{bg:'#ECFDF5',fg:'#047857'},
  'Medium':{bg:'#FFFBEB',fg:'#B45309'}, 'High':{bg:'#FEF2F2',fg:'#B91C1C'}, 'Very High':{bg:'#DC2626',fg:'#fff'},
};

function RKTile({ icon, label, value, color }) {
  return (
    <Card padding={16}>
      <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:11.5, color:'#6B7280', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.04em' }}>
        <Icon name={icon} size={13} color="#6B2FA0"/> {label}
      </div>
      <div style={{ fontSize:28, fontWeight:600, color, marginTop:8, lineHeight:1 }}>{value}</div>
    </Card>
  );
}

function RKMatrix3() {
  const lik = ['Likely (3)','Possible (2)','Unlikely (1)'];
  const imp = ['Low (1)','Medium (2)','High (3)'];
  return (
    <Card padding={20}>
      <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'#111827' }}>Risk Matrix — 3×3 (canonical)</h2>
      <div style={{ fontSize:11.5, color:'#6B7280', marginTop:2, marginBottom:14 }}>
        Likelihood × Impact per Policy 23 v1.0 (Appendix 5); Risk Level New = L × I in the live register. 50 risks total.
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <div style={{ writingMode:'vertical-rl', transform:'rotate(180deg)', fontSize:9.5, color:'#9CA3AF', fontWeight:500, letterSpacing:'0.08em', textAlign:'center', textTransform:'uppercase' }}>Likelihood ↑</div>
        <div style={{ flex:1, maxWidth:430 }}>
          {RISK_GRID3.map((row, ri) => (
            <div key={ri} style={{ display:'grid', gridTemplateColumns:'90px repeat(3, 1fr)', gap:4, marginBottom:4 }}>
              <div style={{ fontSize:10.5, color:'#6B7280', alignSelf:'center', textAlign:'right', paddingRight:6 }}>{lik[ri]}</div>
              {row.map((n, ci) => {
                const score = (3-ri) * (ci+1);
                const isCallout = (3-ri)===2 && (ci+1)===3; // ISMS-104 cell: L2 × I3 = 6
                return (
                  <div key={ci} style={{
                    aspectRatio:'2.1', background: RK_SCORE_COLOR[score], borderRadius:6,
                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                    boxShadow: isCallout ? '0 0 0 2px #6B2FA0' : 'none', position:'relative',
                  }}>
                    <div style={{ fontSize:16, fontWeight:600, color: score>=6 ? (score===9?'#fff':'#7F1D1D') : '#111827' }}>{n}</div>
                    <div style={{ fontSize:9, color: score===9 ? '#FECACA' : '#6B7280' }}>score {score} · {RISK_SCORE_LEVEL[score]}</div>
                  </div>
                );
              })}
            </div>
          ))}
          <div style={{ display:'grid', gridTemplateColumns:'90px repeat(3, 1fr)', gap:4 }}>
            <div/>
            {imp.map(l => <div key={l} style={{ fontSize:10.5, color:'#6B7280', textAlign:'center' }}>{l}</div>)}
          </div>
          <div style={{ fontSize:9.5, color:'#9CA3AF', textAlign:'center', marginTop:4, letterSpacing:'0.08em', textTransform:'uppercase' }}>Impact →</div>
        </div>
      </div>
      <div style={{ marginTop:12, padding:10, borderRadius:8, background:'rgba(107,47,160,0.06)', border:'1px solid rgba(107,47,160,0.18)', fontSize:11.5, color:'#4A1F70', lineHeight:1.5 }}>
        Score → level: 1 Very Low · 2 Low · 3–4 Medium · 6 High · <strong>9 Very High</strong> (Board acceptance only, via Exception Register, ≤ 6 months). No Very High residual risks currently open.
      </div>
    </Card>
  );
}

function RKKeyRisks() {
  return (
    <Card padding={0}>
      <div style={{ padding:'16px 20px 10px' }}>
        <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'#111827' }}>Key Risks under Treatment</h2>
        <div style={{ fontSize:11.5, color:'#6B7280', marginTop:2 }}>From the live Risk Register (Risk Analysis Annex A) and ISMS incident/change registers.</div>
      </div>
      {KEY_RISKS.map(r => {
        const pc = RK_LEVEL_PILL[r.level];
        return (
          <div key={r.id} style={{ padding:'12px 20px', borderTop:'1px solid #F3F4F6', display:'grid', gridTemplateColumns:'86px 1fr 120px', gap:14, alignItems:'start' }}>
            <span style={{ padding:'2px 8px', borderRadius:4, background:'rgba(107,47,160,0.08)', color:'#6B2FA0', fontSize:11, fontWeight:600, textAlign:'center', fontFamily:'ui-monospace, monospace' }}>{r.id}</span>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:500, color:'#111827' }}>{r.title}</div>
              <div style={{ fontSize:11.5, color:'#6B7280', lineHeight:1.45, marginTop:3 }}>{r.treatment}</div>
              <div style={{ display:'flex', gap:8, marginTop:6, alignItems:'center', flexWrap:'wrap' }}>
                <span style={{ fontSize:10.5, color:'#9CA3AF' }}>L{r.l} × I{r.i} = {r.score} · owner {r.owner}</span>
                {r.links.map((l,i) => (
                  <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:10.5, color:'#6B2FA0', display:'inline-flex', alignItems:'center', gap:3 }}>
                    <Icon name={l.type==='ticket'?'square-check-big':'file-text'} size={10}/> {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div style={{ justifySelf:'end' }}>
              <Pill color={pc.fg} bg={pc.bg}><strong style={{ fontWeight:600 }}>{r.level} ({r.score})</strong></Pill>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

function RisksPage() {
  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:18, maxWidth:1280 }}>
      <div style={{ padding:'12px 16px', borderRadius:10, background:'rgba(107,47,160,0.06)', border:'1px solid rgba(107,47,160,0.18)', fontSize:12.5, color:'#4A1F70', lineHeight:1.5, display:'flex', alignItems:'center', gap:10 }}>
        <Icon name="calendar-clock" size={16} color="#6B2FA0"/>
        <span><strong style={{ fontWeight:600 }}>Day 1 · 11:30–12:30 audit slot.</strong> Clause 6.1 risk assessment & treatment + Clause 8.2/8.3 operational risk. Methodology: Policy 23 v1.0 (approved 10.06.2026) — 3×3 matrix canonical, aligned with the live risk register.</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <RKTile icon="alert-triangle" label="Risks in register"   value={50} color="#111827"/>
        <RKTile icon="activity"       label="Active treatment"    value={12} color="#B45309"/>
        <RKTile icon="flame"          label="High (score 6)"      value={8}  color="#B91C1C"/>
        <RKTile icon="shield-alert"   label="Very High (score 9)" value={0}  color="#047857"/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:14 }}>
        <RKMatrix3/>
        <Card padding={20}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'#111827' }}>Acceptance Authority</h2>
          <div style={{ fontSize:11.5, color:'#6B7280', marginTop:2, marginBottom:12 }}>Policy 23 v1.0 §7.4 — by residual level.</div>
          {RISK_ACCEPTANCE.map(a => (
            <div key={a.level} style={{ display:'flex', justifyContent:'space-between', gap:10, padding:'9px 0', borderTop:'1px solid #F3F4F6', fontSize:12.5 }}>
              <span style={{ color:'#111827', fontWeight:500 }}>{a.level}</span>
              <span style={{ color:'#6B7280', textAlign:'right' }}>{a.authority}</span>
            </div>
          ))}
          <div style={{ marginTop:12, fontSize:11, color:'#6B7280', borderTop:'1px solid #F3F4F6', paddingTop:10 }}>
            Very High specifics (§7.3.1): 24h CISO triage · 72h interim controls · 2-week treatment plan to Board · weekly tracking · downgrade only when residual ≤ 6 verified by CISO + CTO.
          </div>
        </Card>
      </div>

      <RKKeyRisks/>

      <Card padding={20}>
        <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'#111827', marginBottom:10 }}>Evidence</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:6, maxWidth:560 }}>
          {RISK_EVIDENCE.map((l,i) => <CoreLinkRow key={i} link={l}/>)}
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { RisksPage });

registerWidget('page-risks', RisksPage);
