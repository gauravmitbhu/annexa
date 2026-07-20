// Overview page — KPI strip, heatmap, findings + workload, risk + exceptions + training, timeline, systems
const { useState: useOvState, useMemo: useOvMemo } = React;

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

// --- Row 1: KPI strip ---

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

// --- Row 2: Annex A heatmap ---

function ControlSquare({ ctrl }) {
  const c = STATUS_COLOR[ctrl.status];
  return (
    <div className="tt" style={{
      width: 22, height: 22, borderRadius: 4,
      background: c.bg, opacity: ctrl.status === 'ok' ? 0.85 : 1,
      cursor:'pointer',
      boxShadow: ctrl.status === 'red' ? '0 0 0 2px rgba(239,68,68,0.25)' : 'none',
    }}>
      <div className="tt-body">
        <div style={{ fontWeight: 600 }}>A.{ctrl.id} · {ctrl.name}</div>
        <div style={{ color:'#9CA3AF', marginTop: 2 }}>Owner: {ctrl.owner} · reviewed {ctrl.last}</div>
        <div style={{ color: c.bg, marginTop: 2, fontWeight: 600 }}>{c.label}</div>
      </div>
    </div>
  );
}

function HeatmapRow({ group }) {
  const ctrls = CONTROLS.filter(c => c.group === group.id);
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
      <div style={{ width: 130, flexShrink: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color:'#111827' }}>{group.label}</div>
        <div style={{ fontSize: 10.5, color:'#6B7280', marginTop: 1 }}>A.{group.range} · {ctrls.length}</div>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap: 4 }}>
        {ctrls.map(c => <ControlSquare key={c.id} ctrl={c}/>)}
      </div>
    </div>
  );
}

function Heatmap() {
  return (
    <Card padding={20}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color:'#111827' }}>Annex A Control Heatmap</h2>
          <div style={{ fontSize: 11.5, color:'#6B7280', marginTop: 2 }}>93 controls · ISO/IEC 27001:2022</div>
        </div>
        <div style={{ display:'flex', gap: 12, fontSize: 11, color:'#6B7280' }}>
          {Object.entries(STATUS_COLOR).map(([k,v]) => (
            <div key={k} style={{ display:'flex', alignItems:'center', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: v.bg, display:'inline-block' }}/>
              {v.label}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap: 14 }}>
        {ANNEX_GROUPS.map(g => <HeatmapRow key={g.id} group={g} />)}
      </div>
    </Card>
  );
}

// --- Row 3: Findings + Workload ---

function SeverityPill({ sev }) {
  const map = {
    HIGH: { bg:'#FEF2F2', fg:'#B91C1C' },
    MED:  { bg:'#FFFBEB', fg:'#B45309' },
    LOW:  { bg:'#F0FDFA', fg:'#0F766E' },
  };
  const c = map[sev];
  return <Pill color={c.fg} bg={c.bg} size="xs"><strong style={{ fontWeight: 600 }}>{sev}</strong></Pill>;
}

function FindingsTable() {
  const [sortBy, setSortBy] = useOvState('sev');
  return (
    <Card padding={0}>
      <div style={{ padding:'16px 20px 12px', display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color:'#111827' }}>Open Gaps & Findings</h2>
          <div style={{ fontSize: 11.5, color:'#6B7280', marginTop: 2 }}>{FINDINGS.length} active · sortable</div>
        </div>
        <Button variant="ghost" size="sm" iconRight="arrow-right"
          onClick={()=> window.dispatchEvent(new CustomEvent('claude:setroute', { detail:{ route:'audits' } }))}>View all</Button>
      </div>
      <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'Poppins, sans-serif' }}>
        <thead>
          <tr style={{ background:'#FAFAFC', borderTop:'1px solid #F3F4F6', borderBottom:'1px solid #E5E7EB' }}>
            {['Control','Issue','Owner','Severity','Target','Source',''].map((h,i) => (
              <th key={i} style={{
                textAlign:'left', padding:'8px 14px', fontSize: 10.5,
                fontWeight: 600, color:'#6B7280', letterSpacing:'0.05em', textTransform:'uppercase',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FINDINGS.map((f,i) => (
            <tr key={f.ctrl} style={{ borderBottom: i === FINDINGS.length-1 ? 'none' : '1px solid #F3F4F6', cursor:'pointer' }}
              onClick={()=> window.dispatchEvent(new CustomEvent('askclaude:item', { detail: {
                label: `A.${f.ctrl} — ${f.issue}`,
                link: f.link,
                prompt: `Tell me about the open finding on A.${f.ctrl}: "${f.issue}" (owner ${f.owner}, ${f.sev}, target ${f.target}). What's the current state and what should we do before the audit?`,
                actions: [
                  { label:'Summarise state',   prompt:`Summarise the current state of control A.${f.ctrl} (${f.issue}) and whether it is audit-ready.` },
                  { label:'Draft remediation', prompt:`Draft a remediation plan for A.${f.ctrl} — ${f.issue} (owner ${f.owner}, target ${f.target}).` },
                  { label:'Find evidence',     prompt:`What evidence do we have for A.${f.ctrl} (${f.issue}), and what would the auditor ask to see?` },
                ],
              }})) }
              onMouseEnter={(e)=>e.currentTarget.style.background='#FAFAFC'}
              onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
              <td style={tdStyle}>
                <span style={{
                  fontFamily:'ui-monospace, SFMono-Regular, monospace',
                  fontSize: 12, fontWeight: 600, color:'#6B2FA0',
                  background:'rgba(107,47,160,0.08)', padding:'2px 7px', borderRadius: 4,
                }}>A.{f.ctrl}</span>
              </td>
              <td style={{ ...tdStyle, color:'#111827', fontWeight: 500 }}>{f.issue}</td>
              <td style={tdStyle}>
                <div style={{ display:'flex', alignItems:'center', gap: 7 }}>
                  <Avatar name={f.owner} size={22}/>
                  <span style={{ fontSize: 12.5, color:'#374151' }}>{f.owner}</span>
                </div>
              </td>
              <td style={tdStyle}><SeverityPill sev={f.sev}/></td>
              <td style={{ ...tdStyle, fontSize: 12.5, color:'#4B5563' }}>{f.target}</td>
              <td style={tdStyle}>
                <span style={{ fontSize: 11.5, color:'#6B7280' }}>{f.source} · <span style={{ fontFamily:'ui-monospace, monospace', color:'#9CA3AF' }}>{f.ref}</span></span>
              </td>
              <td style={{ ...tdStyle, textAlign:'right' }}>
                <a href={f.link || '#'} target="_blank" rel="noopener noreferrer" title="Open ticket"
                  onClick={(e)=>{ e.stopPropagation(); if (!f.link) e.preventDefault(); }}
                  style={{
                    display:'inline-flex', border:'none', background:'transparent', cursor:'pointer',
                    padding: 4, borderRadius: 4, color:'#9CA3AF',
                  }} onMouseEnter={(e)=>e.currentTarget.style.color='#6B2FA0'}
                  onMouseLeave={(e)=>e.currentTarget.style.color='#9CA3AF'}>
                  <Icon name="external-link" size={13}/>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

const tdStyle = { padding:'10px 14px', fontSize: 13, color:'#1F2937', verticalAlign:'middle' };

function OwnerWorkload() {
  const max = Math.max(...OWNER_LOAD.map(o => o.count));
  return (
    <Card padding={20}>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color:'#111827' }}>Owner Workload</h2>
        <div style={{ fontSize: 11.5, color:'#6B7280', marginTop: 2 }}>open items · across all sources</div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap: 11 }}>
        {OWNER_LOAD.map(o => (
          <div key={o.name}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 4 }}>
              <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                <Avatar name={o.name} size={22}/>
                <span style={{ fontSize: 12.5, color:'#111827', fontWeight: 500 }}>{o.name}</span>
                <span style={{ fontSize: 10.5, color:'#9CA3AF' }}>{o.role}</span>
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 600, color:'#111827' }}>{o.count}</span>
            </div>
            <div style={{ height: 6, background:'#F3F4F6', borderRadius: 9999 }}>
              <div style={{
                height:'100%', borderRadius: 9999,
                width: `${(o.count/max)*100}%`,
                background: o.count >= 12 ? 'linear-gradient(90deg,#6B2FA0,#E91E63)' : '#8B5FBF',
              }}/>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// --- Row 4: Risk heatmap + Exceptions + Training ---

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

// --- Row 5: Audit timeline ---

function AuditTimeline() {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  // current = end of April 2026
  const _now = new Date();
  const todayPct = (_now.getMonth() + _now.getDate()/31) / 12;
  const _todayLabel = `Today · ${_now.toLocaleString('en', {month:'short'})} ${_now.getDate()}`;
  return (
    <Card padding={20}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color:'#111827' }}>Audit Timeline</h2>
        <div style={{ fontSize: 11.5, color:'#6B7280' }}>2026 · ISO 27001 cycle</div>
      </div>
      <div style={{ position:'relative', padding:'60px 0 0' }}>
        {/* track */}
        <div style={{ position:'relative', height: 8, background:'#F3F4F6', borderRadius: 9999 }}>
          {/* completed range */}
          <div style={{ position:'absolute', left: 0, top: 0, bottom: 0, width: `${todayPct*100}%`, background:'rgba(107,47,160,0.3)', borderRadius: 9999 }}/>
        </div>

        {/* milestones */}
        {[
          { pct: 2.5/12, label:'Internal audit',     date:'Mar 2026',         state:'done',      side:'above' },
          { pct: 3.5/12, label:'Mgmt review',        date:'Apr 2026',         state:'done',      side:'below' },
          { pct: 4.5/12, label:'Remediation sweep',  date:'May–Jun 2026',     state:'done',      side:'above' },
          { pct: 5.5/12, label:'Re-cert · CertCo', date:'16–17 Jun 2026', state:'milestone', side:'below' },
          { pct: 11.5/12, label:'Surveillance audit', date:'2027',             state:'future',    side:'above' },
        ].map((m,i) => {
          const isMilestone = m.state === 'milestone';
          const above = m.side === 'above';
          const dotSize = isMilestone ? 16 : 12;
          return (
            <div key={i} style={{
              position:'absolute', left:`${m.pct*100}%`, top: 0,
              transform:'translateX(-50%)',
              width: 0,
            }}>
              {/* dot — centered on the track */}
              <div style={{
                position:'absolute', left:'50%', top: 4 - dotSize/2,
                transform:'translateX(-50%)',
                width: dotSize, height: dotSize, borderRadius: 9999,
                background: m.state === 'done' ? '#10B981'
                          : isMilestone ? '#E91E63'
                          : '#D1D5DB',
                border: '3px solid #fff',
                boxShadow: isMilestone
                  ? '0 0 0 3px rgba(233,30,99,0.25)'
                  : '0 0 0 1px #E5E7EB',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                {m.state === 'done' && <span style={{ color:'#fff', fontSize: 8, fontWeight: 700 }}>✓</span>}
              </div>
              {/* label */}
              <div style={{
                position:'absolute', left:'50%',
                transform:'translateX(-50%)',
                [above ? 'bottom' : 'top']: above ? 16 : 16,
                textAlign:'center',
                fontSize: 11, fontWeight: isMilestone ? 600 : 500,
                color: isMilestone ? '#E91E63' : m.state === 'future' ? '#9CA3AF' : '#374151',
                width: 110, lineHeight: 1.25,
              }}>
                {m.label}
                <div style={{ fontSize: 10, color:'#9CA3AF', marginTop: 1, fontWeight: 500 }}>{m.date}</div>
              </div>
            </div>
          );
        })}

        {/* today line */}
        <div style={{
          position:'absolute', left:`${todayPct*100}%`, top: -2, bottom: 0, width: 2,
          background:'#6B2FA0',
        }}>
          <div style={{
            position:'absolute', top:-18, left:'50%', transform:'translateX(-50%)',
            background:'#6B2FA0', color:'#fff', fontSize: 9.5, fontWeight: 600,
            padding:'2px 6px', borderRadius: 9999, whiteSpace:'nowrap',
          }}>{_todayLabel}</div>
        </div>

        {/* Month labels */}
        <div style={{ display:'flex', justifyContent:'space-between', marginTop: 56, paddingTop: 8, borderTop:'1px dashed #E5E7EB' }}>
          {months.map(m => (
            <div key={m} style={{ fontSize: 10, color:'#9CA3AF', fontWeight: 500 }}>{m}</div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// --- Row 6: Connected Systems ---

function SystemTile({ s, loading }) {
  return (
    <div style={{
      background:'#fff', border:'1px solid #E5E7EB', borderRadius: 10,
      padding: 12, display:'flex', alignItems:'center', gap: 10,
    }}>
      {loading ? (
        <>
          <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8 }}/>
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: '60%', height: 11, marginBottom: 5 }}/>
            <div className="skeleton" style={{ width: '40%', height: 9 }}/>
          </div>
        </>
      ) : (
        <>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: s.connected ? s.color : '#F3F4F6',
            color: s.connected ? '#fff' : '#9CA3AF',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize: 12, fontWeight: 700, letterSpacing:'-0.02em',
            filter: s.connected ? 'none' : 'grayscale(1)',
          }}>{s.glyph}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 5 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: s.connected ? '#111827' : '#6B7280' }}>{s.name}</span>
              {s.connected && <Icon name="check-circle-2" size={11} color="#10B981"/>}
            </div>
            {s.connected ? (
              <div style={{ fontSize: 10.5, color:'#6B7280', display:'flex', alignItems:'center', gap: 4, marginTop: 1 }}>
                <span>synced {s.sync}</span>
                <span style={{ color:'#D1D5DB' }}>·</span>
                <span style={{
                  fontSize: 9.5, color:'#6B2FA0', background:'rgba(107,47,160,0.08)',
                  padding:'1px 5px', borderRadius: 4, fontWeight: 500,
                }}>read-only</span>
              </div>
            ) : (
              <div style={{ fontSize: 10.5, color:'#9CA3AF', marginTop: 1 }}>Not connected</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ConnectedSystems({ skeletonId }) {
  return (
    <Card padding={20}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color:'#111827' }}>Connected Systems</h2>
        <div style={{ fontSize: 11, color:'#6B7280' }}>{SYSTEMS.filter(s=>s.connected).length} connected · {SYSTEMS.filter(s=>!s.connected).length} not yet wired</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap: 10 }}>
        {SYSTEMS.map(s => <SystemTile key={s.id} s={s} loading={s.id === skeletonId}/>)}
      </div>
    </Card>
  );
}

function Overview() {
  // Demonstrate a skeleton on one tile briefly, then resolve.
  const [skel, setSkel] = useOvState('moodle');
  React.useEffect(() => {
    const t = setTimeout(() => setSkel(null), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ padding: 24, display:'flex', flexDirection:'column', gap: 18, maxWidth: 1280 }}>
      {/* Row 1 */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 14 }}>
        <KPIPosture/>
        <KPIRisks/>
        <KPIPolicies/>
        <KPIAuditReadiness/>
      </div>

      {/* Row 2 */}
      <Heatmap/>

      {/* Row 3 */}
      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap: 14 }}>
        <FindingsTable/>
        <OwnerWorkload/>
      </div>

      {/* Row 4 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 14 }}>
        <RiskMatrix/>
        <ExceptionsList/>
        <TrainingCard/>
      </div>

      {/* Row 5 */}
      <AuditTimeline/>

      {/* Row 6 */}
      <ConnectedSystems skeletonId={skel}/>

      {/* Footer */}
      <div style={{
        textAlign:'center', fontSize: 11, color:'#9CA3AF', padding:'4px 0 16px',
      }}>
        ISMS Dashboard v1.0 · Acme · demo data
      </div>
    </div>
  );
}

Object.assign(window, { Overview });

registerWidget('page-overview', Overview);
