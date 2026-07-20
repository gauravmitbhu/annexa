// Exceptions page — exception register governance (Policy 23 v1.0 §7.4, clause 6.1/8.3).
// Audit focus flagged by J. Miller (external advisor) for the re-cert audit 16–17 June 2026.
// Data is fictional demo content shaped like an "Exception Request Form" register
// snapshot — incl. custom fields (Title, Requestor, Details, Justification/risks,
// Board approval required) and start/due dates as the validity window.

const EXP_LIST_URL = '#';

const EXP_EXCEPTIONS = {
  asOf: '12.06.2026',
  items: [
    {
      id: 'EX-001',
      title: 'Streamlined policy approval (CISO-drafted, single board/CTO approver)',
      requestor: 'Alex (CISO)',
      start: '05.05.2026', end: '05.05.2027',
      boardRequired: true,
      // Board approval recorded on the task: Jordan (Board) comment
      // "I approve the EX-001 Streamlined policy approval", 19.05.2026.
      approval: 'approved', approvedBy: 'Jordan (Board)', approvedOn: '19.05.2026',
      compensating: 'Mandatory board/CTO approval before any rollout; rolling 30-day post-rollout objection window (rollback/revision); full task-tracker audit trail; status reviewed at each Management Review.',
      url: '#',
    },
    {
      id: 'EX-002',
      title: 'Four-eyes relaxation for code changes (AI/automation as second reviewer)',
      requestor: 'Alex (CISO)',
      start: '05.05.2026', end: '05.05.2027',
      boardRequired: true,
      approval: 'pending', approvedBy: null, approvedOn: null,
      compensating: 'Four-eyes stays the default — AI/automated checks substitute only when no second human is available; CTO harm review each cycle (reverts if harmful); GitLab vulnerability + Elastic monitoring; incidents logged via IR process.',
      url: '#',
    },
  ],
};

// 'DD.MM.YYYY' → Date
function EXP_parseDate(s) {
  const [d, m, y] = s.split('.').map(Number);
  return new Date(y, m - 1, d);
}

function EXP_expiringSoon(item, asOf, days = 90) {
  const diff = EXP_parseDate(item.end) - EXP_parseDate(asOf);
  return diff >= 0 && diff <= days * 24 * 3600 * 1000;
}

function EXPTile({ icon, label, value, sub, color }) {
  return (
    <Card padding={16}>
      <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:11.5, color:'#6B7280', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.04em' }}>
        <Icon name={icon} size={13} color="#6B2FA0"/> {label}
      </div>
      <div style={{ fontSize:28, fontWeight:600, color, marginTop:8, lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:10.5, color:'#9CA3AF', marginTop:4 }}>{sub}</div>}
    </Card>
  );
}

function EXPApprovalPill({ item }) {
  if (item.approval === 'approved') {
    return (
      <Pill color="#047857" bg="#ECFDF5" size="xs">
        <Icon name="check" size={10}/> Yes — approved {item.approvedOn}
      </Pill>
    );
  }
  return (
    <Pill color="#B45309" bg="#FFFBEB" size="xs">
      <Icon name="clock" size={10}/> Yes — pending Board
    </Pill>
  );
}

function ExceptionsPage() {
  const { asOf, items } = EXP_EXCEPTIONS;
  const approved = items.filter(e => e.approval === 'approved').length;
  const pending  = items.filter(e => e.approval === 'pending').length;
  const expiring = items.filter(e => EXP_expiringSoon(e, asOf)).length;

  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:18, maxWidth:1280 }}>
      <div style={{ padding:'12px 16px', borderRadius:10, background:'rgba(107,47,160,0.06)', border:'1px solid rgba(107,47,160,0.18)', fontSize:12.5, color:'#4A1F70', lineHeight:1.5, display:'flex', alignItems:'center', gap:10 }}>
        <Icon name="file-warning" size={16} color="#6B2FA0"/>
        <span><strong style={{ fontWeight:600 }}>Exception governance.</strong> Every exception is documented in the register with justification and compensating controls, formally approved (Board where required), and reviewed within 12 months aligned with the Management Review. Very High residual risk (score 9) may only be accepted by the Board via this register, time-bounded to max. 6 months (Policy 23 v1.0 §7.4).</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <EXPTile icon="file-warning"   label="Exceptions on register" value={items.length} color="#111827" sub="live Exception Request Form register"/>
        <EXPTile icon="check-circle-2" label="Board-approved"         value={approved} color="#047857" sub="approval evidenced on the task"/>
        <EXPTile icon="clock"          label="Pending approval"       value={pending} color={pending > 0 ? '#B45309' : '#047857'} sub="Board approval required, not yet recorded"/>
        <EXPTile icon="calendar-clock" label="Expiring ≤ 90 days"     value={expiring} color={expiring > 0 ? '#B91C1C' : '#047857'} sub={`next expiry 05.05.2027`}/>
      </div>

      <Card padding={0}>
        <div style={{ padding:'16px 20px 10px' }}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'#111827' }}>Exception Register</h2>
          <div style={{ fontSize:11.5, color:'#6B7280', marginTop:2 }}>Validity = native task start/due dates; compensating controls from the task's Details / Justification fields.</div>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
          <thead><tr style={{ background:'#FAFAFC' }}>
            {['ID','Title','Requestor','Validity','Board approval','Compensating controls'].map(h => (
              <th key={h} style={{ textAlign:'left', padding:'9px 16px', fontSize:10.5, fontWeight:600, color:'#6B7280', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {items.map(e => (
              <tr key={e.id} style={{ borderTop:'1px solid #F3F4F6', verticalAlign:'top' }}>
                <td style={{ padding:'11px 16px' }}>
                  <span style={{ padding:'2px 8px', borderRadius:4, background:'rgba(107,47,160,0.08)', color:'#6B2FA0', fontSize:11, fontWeight:600, fontFamily:'ui-monospace, monospace', whiteSpace:'nowrap' }}>{e.id}</span>
                </td>
                <td style={{ padding:'11px 16px', minWidth:200 }}>
                  <a href={e.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight:500, color:'#111827', textDecoration:'none', display:'inline-flex', alignItems:'flex-start', gap:5 }}
                     onMouseEnter={ev => ev.currentTarget.style.color = '#6B2FA0'}
                     onMouseLeave={ev => ev.currentTarget.style.color = '#111827'}>
                    {e.title} <Icon name="arrow-up-right" size={11} color="#9CA3AF" style={{ marginTop:2 }}/>
                  </a>
                </td>
                <td style={{ padding:'11px 16px', color:'#374151', whiteSpace:'nowrap' }}>{e.requestor}</td>
                <td style={{ padding:'11px 16px', color:'#374151', whiteSpace:'nowrap', fontFamily:'ui-monospace, monospace', fontSize:11.5 }}>{e.start} → {e.end}</td>
                <td style={{ padding:'11px 16px', whiteSpace:'nowrap' }}>
                  <EXPApprovalPill item={e}/>
                  {e.approvedBy && <div style={{ fontSize:10.5, color:'#9CA3AF', marginTop:4 }}>{e.approvedBy}, task comment</div>}
                </td>
                <td style={{ padding:'11px 16px', color:'#6B7280', lineHeight:1.45, minWidth:260 }}>{e.compensating}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding:'10px 16px', fontSize:10.5, color:'#9CA3AF', borderTop:'1px solid #F3F4F6', lineHeight:1.5 }}>
          Snapshot of the live <a href={EXP_LIST_URL} target="_blank" rel="noopener noreferrer" style={{ color:'#6B2FA0' }}>Exception Request Form</a>, {asOf}. EX-001 approval evidenced by Board comment on the task (Jordan, 19.05.2026); EX-002 Board approval not yet recorded.
        </div>
      </Card>

      <Card padding={20}>
        <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'#111827', marginBottom:10 }}>Evidence</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:6, maxWidth:560 }}>
          {[
            { label:'Exception Request Form — live register',          url: EXP_LIST_URL, type:'ticket' },
            { label:'Policy 23 · Information Security Risk Management v1.0 (§7.4 acceptance authority)', url:'#', type:'doc' },
            { label:'Exception Register — ISMS Ticketing Systems (EX-001 / EX-002)', url:'#', type:'ticket' },
          ].map((l,i) => <CoreLinkRow key={i} link={l}/>)}
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { ExceptionsPage });
