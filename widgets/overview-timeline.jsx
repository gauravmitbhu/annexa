// Overview · Row 5 — audit timeline

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

function OverviewTimeline() {
  return (
    <div style={{ maxWidth: 1280, padding:'18px 24px 0' }}>
      <AuditTimeline/>
    </div>
  );
}

registerWidget('overview-timeline', OverviewTimeline);
