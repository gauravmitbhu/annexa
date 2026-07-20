// Overview · Row 4 — risk heatmap + exception register + training status

function RiskMatrix() {
  const lik = ['3','2','1'];
  const colors = { 1:'#ECFDF5', 2:'#D1FAE5', 3:'#FEF3C7', 4:'#FED7AA', 6:'#FCA5A5', 9:'#DC2626' };
  return (
    <Card padding={18}>
      <h2 style={{ margin:'0 0 4px 0', fontSize: 14, fontWeight: 600, color:'#111827' }}>Risk Heatmap</h2>
      <div style={{ fontSize: 11, color:'#6B7280', marginBottom: 14 }}>3×3 likelihood × impact (Policy 23 v1.0 canonical) · 50 risks total</div>
      <div style={{ display:'flex', gap: 8 }}>
        <div style={{
          writingMode:'vertical-rl', transform:'rotate(180deg)',
          fontSize: 9.5, color:'#9CA3AF', fontWeight: 500, letterSpacing:'0.08em',
          textAlign:'center', textTransform:'uppercase', paddingTop: 16,
        }}>Likelihood ↑</div>
        <div style={{ flex: 1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 3 }}>
            {RISK_GRID3.map((row, ri) => row.map((n, ci) => {
              const score = (3-ri) * (ci+1);
              const isCallout = (3-ri)===2 && (ci+1)===3; // ISMS-104: L2 × I3 = 6 High
              return (
                <div key={`${ri}-${ci}`} style={{
                  aspectRatio:'1.4', background: colors[score],
                  borderRadius: 4, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  fontSize: 13, fontWeight: 600, color: score===9 ? '#fff' : '#111827',
                  position:'relative',
                  boxShadow: isCallout ? '0 0 0 2px #6B2FA0' : 'none',
                }}>
                  {n || ''}
                  <div style={{ fontSize: 8.5, fontWeight: 500, color: score===9 ? '#FECACA' : '#6B7280' }}>{RISK_SCORE_LEVEL[score]}</div>
                  {isCallout && (
                    <div style={{
                      position:'absolute', top:-7, right:-7,
                      width: 14, height: 14, borderRadius: 9999,
                      background:'#6B2FA0', color:'#fff',
                      fontSize: 9, fontWeight: 700,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      border:'2px solid #fff',
                    }}>!</div>
                  )}
                </div>
              );
            }))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 3, marginTop: 4 }}>
            {['Low (1)','Medium (2)','High (3)'].map(l => (
              <div key={l} style={{ fontSize: 9, color:'#9CA3AF', textAlign:'center', fontWeight: 500 }}>{l}</div>
            ))}
          </div>
          <div style={{ fontSize: 9.5, color:'#9CA3AF', textAlign:'center', marginTop: 2, letterSpacing:'0.08em', textTransform:'uppercase' }}>
            Impact →
          </div>
        </div>
      </div>
      <div style={{
        marginTop: 12, padding: 10, borderRadius: 8,
        background:'rgba(107,47,160,0.06)', border:'1px solid rgba(107,47,160,0.18)',
        fontSize: 11.5, color:'#4A1F70', lineHeight: 1.5,
      }}>
        <strong style={{ fontWeight: 600 }}>ISMS-104</strong> · Privileged-access review gap in a legacy admin tool, L2 × I3 = 6 (High), treatment in progress.
      </div>
    </Card>
  );
}

function ExceptionsList() {
  return (
    <Card padding={0}>
      <div style={{ padding:'16px 18px 10px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color:'#111827' }}>Exception Register</h2>
          <div style={{ fontSize: 11, color:'#6B7280', marginTop: 2 }}>Validity 05.05.2026 – 05.05.2027 · snapshot 15.06.2026</div>
        </div>
        <Pill color="#B45309" bg="#FFFBEB">{EXCEPTIONS.filter(e=>e.approval!=='approved').length} pending Board</Pill>
      </div>
      <div className="scroll-y" style={{ maxHeight: 318, overflowY:'auto', borderTop:'1px solid #F3F4F6' }}>
        {EXCEPTIONS.map(e => (
          <div key={e.id} style={{
            padding:'10px 18px', borderBottom:'1px solid #F3F4F6',
            display:'flex', alignItems:'center', gap: 10, cursor:'pointer',
            transition:'background 120ms',
          }}
          onClick={()=>e.link && window.open(e.link, '_blank')}
          onMouseEnter={(ev)=>ev.currentTarget.style.background='#FAFAFC'}
          onMouseLeave={(ev)=>ev.currentTarget.style.background='transparent'}>
            <span style={{
              fontSize: 10.5, fontWeight: 600, color:'#6B2FA0',
              background:'rgba(107,47,160,0.08)', padding:'2px 6px', borderRadius: 4,
              fontFamily:'ui-monospace, monospace', flexShrink: 0, minWidth: 56, textAlign:'center',
            }}>{e.id}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, color:'#111827', fontWeight: 500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {e.title}
              </div>
              <div style={{ fontSize: 10.5, color:'#6B7280', marginTop: 1, fontFamily:'ui-monospace, monospace' }}>
                {e.ctrls.join(' · ')}
              </div>
            </div>
            {e.approval === 'approved'
              ? <Pill color="#047857" bg="#ECFDF5" size="xs">Board approved</Pill>
              : <Pill color="#B45309" bg="#FFFBEB" size="xs">Pending Board</Pill>}
          </div>
        ))}
      </div>
    </Card>
  );
}

function TrainingCard() {
  const completed = 9, headcount = 12;
  const pct = completed/headcount;
  const r = 36, c = 2 * Math.PI * r;
  return (
    <Card padding={18}>
      <h2 style={{ margin:'0 0 2px 0', fontSize: 14, fontWeight: 600, color:'#111827' }}>Training Status</h2>
      <div style={{ fontSize: 11, color:'#6B7280' }}>AI Policy Training · Moodle</div>
      <div style={{ display:'flex', alignItems:'center', gap: 18, marginTop: 14 }}>
        <svg width="92" height="92" style={{ flexShrink: 0 }}>
          <circle cx="46" cy="46" r={r} fill="none" stroke="#F3F4F6" strokeWidth="8"/>
          <circle cx="46" cy="46" r={r} fill="none" stroke="url(#donutgrad)" strokeWidth="8"
            strokeDasharray={c} strokeDashoffset={c*(1-pct)} strokeLinecap="round"
            transform="rotate(-90 46 46)" />
          <defs>
            <linearGradient id="donutgrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6B2FA0"/>
              <stop offset="100%" stopColor="#E91E63"/>
            </linearGradient>
          </defs>
          <text x="46" y="44" textAnchor="middle" fontSize="18" fontWeight="600" fill="#111827" fontFamily="Poppins">{Math.round(pct*100)}%</text>
          <text x="46" y="60" textAnchor="middle" fontSize="9.5" fill="#6B7280" fontFamily="Poppins">complete</text>
        </svg>
        <div>
          <div style={{ fontSize: 22, fontWeight: 600, color:'#111827', lineHeight: 1.1 }}>
            {completed}<span style={{ color:'#9CA3AF', fontWeight: 500, fontSize: 16 }}>/{headcount}</span>
          </div>
          <div style={{ fontSize: 11.5, color:'#6B7280', marginTop: 2 }}>employees completed</div>
          <a href="#" style={{ fontSize: 11.5, color:'#6B2FA0', marginTop: 8, display:'inline-flex', alignItems:'center', gap: 4 }}>
            Open in Moodle <Icon name="external-link" size={11}/>
          </a>
        </div>
      </div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop:'1px solid #F3F4F6', fontSize: 11, color:'#6B7280' }}>
        <strong style={{ color:'#B45309', fontWeight: 600 }}>{headcount-completed} outstanding</strong> · passed Final Assessment ≥8/10 (live from Moodle)
      </div>
    </Card>
  );
}

function OverviewRisk() {
  return (
    <div style={{ maxWidth: 1280, padding:'18px 24px 0' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 14 }}>
        <RiskMatrix/>
        <ExceptionsList/>
        <TrainingCard/>
      </div>
    </div>
  );
}

registerWidget('overview-risk', OverviewRisk);
