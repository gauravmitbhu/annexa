// Controls (Annex A) page — tabs, filters, table and slide-over drawer.
// Everything shown here is driven by data/: controls.json for status and
// ownership, control-detail.json for the SoA implementation description,
// applicability justification and the findings attached to each control.

const { useState: useCtrlState, useMemo: useCtrlMemo } = React;

// Primary governing document per control, keyed to POLICY_REGISTER.
const CTRL_POLICY = {
  '5.1':'POL-01','5.2':'POL-01','5.3':'POL-01','5.4':'POL-01','5.5':'POL-01','5.6':'POL-01','5.7':'POL-13',
  '5.8':'POL-01','5.9':'POL-17','5.10':'POL-02','5.11':'POL-17','5.12':'POL-17','5.13':'POL-17','5.14':'STD-01',
  '5.15':'STD-01','5.16':'STD-01','5.17':'STD-01','5.18':'STD-01',
  '5.19':'POL-14','5.20':'POL-14','5.21':'POL-14','5.22':'POL-14','5.23':'POL-05',
  '5.24':'POL-01','5.25':'POL-01','5.26':'POL-01','5.27':'POL-01','5.28':'POL-01',
  '5.29':'POL-01','5.30':'POL-01','5.31':'POL-01','5.32':'POL-01','5.33':'POL-06','5.34':'POL-08',
  '5.35':'POL-01','5.36':'POL-01','5.37':'POL-06',
  '6.1':'POL-18','6.2':'POL-18','6.3':'POL-01','6.4':'POL-18','6.5':'POL-18','6.6':'POL-18','6.7':'POL-02','6.8':'POL-01',
  '7.1':'POL-11','7.2':'POL-10','7.3':'POL-11','7.4':'STD-02','7.5':'POL-11','7.6':'POL-11','7.7':'POL-04',
  '7.8':'POL-11','7.9':'POL-11','7.10':'STD-02','7.11':'POL-11','7.12':'POL-11','7.13':'POL-11','7.14':'STD-02',
  '8.1':'STD-03','8.2':'STD-01','8.3':'STD-01','8.4':'STD-01','8.5':'STD-01','8.6':'STD-01','8.7':'STD-01',
  '8.8':'STD-01','8.9':'STD-01','8.10':'POL-08','8.11':'STD-01','8.12':'STD-01','8.13':'STD-01','8.14':'STD-01',
  '8.15':'STD-01','8.16':'STD-01','8.17':'STD-01','8.18':'STD-01','8.19':'POL-02','8.20':'STD-01','8.21':'STD-01',
  '8.22':'STD-01','8.23':'STD-01','8.24':'STD-01','8.25':'STD-01','8.26':'POL-05','8.27':'STD-01','8.28':'STD-01',
  '8.29':'STD-01','8.30':'POL-14','8.31':'STD-01','8.32':'STD-01','8.33':'STD-01','8.34':'POL-01',
};

// Owning process per control, keyed to OPSPROC_PROCEDURES.
const CTRL_PROCESS = {
  '5.7':'PRC-09','5.9':'PRC-01','5.11':'PRC-20','5.16':'PRC-20','5.18':'PRC-20',
  '5.19':'PRC-15','5.20':'PRC-15','5.21':'PRC-16','5.22':'PRC-16','5.23':'PRC-17',
  '5.24':'PRC-10','5.25':'PRC-10','5.26':'PRC-10','5.27':'PRC-10','5.28':'PRC-10',
  '5.29':'PRC-26','5.30':'PRC-26','5.31':'PRC-02','5.34':'PRC-18','5.35':'PRC-04','5.37':'PRC-01',
  '6.1':'PRC-21','6.2':'PRC-20','6.3':'PRC-22','6.5':'PRC-20','6.8':'PRC-10',
  '7.1':'PRC-23','7.2':'PRC-24','7.3':'PRC-23','7.4':'PRC-23','7.5':'PRC-23','7.6':'PRC-23',
  '7.10':'PRC-25','7.14':'PRC-25',
  '8.10':'PRC-19','8.13':'PRC-27','8.14':'PRC-27','8.32':'PRC-13','8.34':'PRC-04',
};

// Paraphrased ISO/IEC 27002:2022 control intent, for the drawer guidance line.
const ISO_CONTROL_HELP = {
  '5.14':'Information-transfer rules, procedures or agreements should cover all transfer types — internal and with external parties.',
  '5.19':'Define and implement processes to manage the information security risks of using suppliers’ products or services.',
  '5.20':'Establish and agree the relevant information security requirements with each supplier, based on the relationship type.',
  '5.21':'Define and implement processes to manage information security risks across the ICT products and services supply chain.',
  '5.22':'Regularly monitor, review, evaluate and manage change in supplier security practices and service delivery.',
  '5.23':'Establish processes for acquisition, use, management and exit of cloud services per your security requirements.',
  '5.29':'Plan how to maintain information security at an appropriate level during disruption.',
  '5.30':'Plan, implement, maintain and test ICT readiness based on business-continuity objectives and ICT continuity requirements.',
  '5.31':'Identify, document and keep current the legal, statutory, regulatory and contractual requirements relevant to information security.',
  '5.32':'Implement procedures to protect intellectual property rights.',
  '5.33':'Protect records from loss, destruction, falsification, unauthorised access and unauthorised release.',
  '5.34':'Identify and meet requirements for privacy and protection of PII per applicable laws, regulations and contracts.',
  '5.35':'Independently review the organisation’s approach to managing information security at planned intervals or on significant change.',
  '5.36':'Regularly review that information processing complies with the security policies, rules and standards.',
  '6.6':'Identify, document and regularly review confidentiality and non-disclosure agreements reflecting the organisation’s needs.',
  '7.1':'Define and use security perimeters to protect areas that hold information and associated assets.',
  '7.2':'Protect secure areas with appropriate entry controls and access points.',
  '7.3':'Design and implement physical security for offices, rooms and facilities.',
  '7.4':'Continuously monitor premises for unauthorised physical access.',
  '7.5':'Design and implement protection against physical and environmental threats such as natural disasters.',
  '7.6':'Design and implement security measures for working in secure areas.',
  '7.7':'Define and enforce clear-desk rules for papers and removable media, and clear-screen rules for facilities.',
  '7.8':'Site equipment securely and protect it.',
  '7.9':'Protect assets used off-premises.',
  '7.10':'Manage storage media across their lifecycle — acquisition, use, transport, disposal — per the classification scheme.',
  '7.11':'Protect information processing facilities from power failures and other supporting-utility disruptions.',
  '7.12':'Protect power, data and supporting cabling from interception, interference or damage.',
  '7.13':'Maintain equipment correctly to ensure availability, integrity and confidentiality of information.',
  '7.14':'Verify equipment with storage media has sensitive data or licensed software removed or securely overwritten before disposal or re-use.',
  '8.1':'Manage and protect user endpoint devices to prevent unauthorised access, loss or compromise of information.',
  '8.8':'Obtain information on technical vulnerabilities, evaluate exposure, and take appropriate measures.',
  '8.10':'Delete information stored in systems, devices or other storage media when it is no longer required.',
  '8.14':'Implement information processing facilities with redundancy sufficient to meet availability requirements.',
  '8.20':'Secure, manage and control networks and network devices to protect information in systems and applications.',
  '8.21':'Identify, implement and monitor the security mechanisms, service levels and requirements of network services.',
  '8.22':'Segregate groups of information services, users and information systems within the networks.',
  '8.23':'Manage access to external websites to reduce exposure to malicious content.',
  '8.24':'Define and implement rules for the effective use of cryptography, including cryptographic key management.',
  '8.25':'Establish and apply rules for the secure development of software and systems.',
  '8.26':'Identify, specify and approve information security requirements when developing or acquiring applications.',
  '8.27':'Establish, document, maintain and apply secure system-engineering principles to development activities.',
  '8.28':'Apply secure coding principles to software development.',
  '8.29':'Define and implement security testing processes within the development lifecycle.',
  '8.30':'Direct, monitor and review the activities of outsourced system development.',
  '8.31':'Separate and secure development, test and production environments.',
  '8.32':'Subject changes to information processing facilities and systems to change management procedures.',
  '8.33':'Appropriately select, protect and manage test information.',
};

const findingsFor = (id) => (typeof CTRL_FINDINGS !== 'undefined' && CTRL_FINDINGS[id]) || [];
const implFor     = (id) => (typeof CTRL_IMPL !== 'undefined' && CTRL_IMPL[id]) || [];
const justifyFor  = (id) => (typeof CTRL_JUSTIFY !== 'undefined' && CTRL_JUSTIFY[id]) || '';
const policyFor   = (num) => (typeof POLICY_REGISTER !== 'undefined' && POLICY_REGISTER.find(p => p.num === num)) || null;
const processFor  = (pid) => (typeof OPSPROC_PROCEDURES !== 'undefined' && OPSPROC_PROCEDURES.find(p => p.id === pid)) || null;

const POL_STATE_PILL = {
  'Approved':     { bg:'#ECFDF5', fg:'#047857' },
  'Under review': { bg:'#FFFBEB', fg:'#B45309' },
  'To author':    { bg:'#FEF2F2', fg:'#B91C1C' },
  'Archived':     { bg:'var(--brand-surface)', fg:'var(--brand-muted)' },
};

function PolicyCardByNum({ num }) {
  const p = policyFor(num);
  if (!p) return null;
  const sp = POL_STATE_PILL[p.state] || {};
  const btn = { display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:500, color:'var(--brand-accent)', textDecoration:'none', border:'1px solid color-mix(in srgb, var(--brand-accent) 25%, transparent)', borderRadius:6, padding:'3px 8px' };
  return (
    <div style={{ border:'1px solid color-mix(in srgb, var(--brand-accent) 20%, transparent)', background:'color-mix(in srgb, var(--brand-accent) 4%, transparent)', borderRadius:8, padding:'9px 11px', marginBottom:10 }}>
      <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap' }}>
        <Icon name="file-text" size={13} color="var(--brand-accent)"/>
        <span style={{ fontSize:12.5, fontWeight:600, color:'var(--brand-ink)' }}>{p.num} — {p.name}</span>
        <Pill color={sp.fg} bg={sp.bg} size="xs">{p.state}</Pill>
      </div>
      <div style={{ fontSize:10.5, color:'var(--brand-muted)', margin:'3px 0 8px', fontFamily:'ui-monospace, SFMono-Regular, monospace' }}>
        {p.ver} · updated {p.updated}
      </div>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        <a href={p.url} target="_blank" rel="noopener noreferrer" style={btn}><Icon name="external-link" size={11}/> Document library</a>
        {p.pdf && <a href={p.pdf} target="_blank" rel="noopener noreferrer" style={btn}><Icon name="file-text" size={11}/> PDF</a>}
      </div>
    </div>
  );
}

function PolicyCard({ ctrlId }) {
  return <PolicyCardByNum num={CTRL_POLICY[ctrlId]}/>;
}

function ControlsPage({ onOpenDrawer }) {
  const [tab, setTab] = useCtrlState('all');
  const [filterStatus, setFilterStatus] = useCtrlState('all');
  const [filterOpen, setFilterOpen] = useCtrlState(false);
  const [owner, setOwner] = useCtrlState('all');

  const tabs = useCtrlMemo(() => [{ id:'all', label:'All', count: CONTROLS.length }].concat(
    ANNEX_GROUPS.map(g => ({
      id: g.id,
      label: g.prefix + 'x ' + g.label.slice(0, 8),
      count: CONTROLS.filter(c => c.group === g.id).length,
    }))
  ), []);

  const owners = useCtrlMemo(() => ['all'].concat(
    Array.from(new Set(CONTROLS.map(c => c.owner))).sort()), []);

  const filtered = useCtrlMemo(() => {
    let list = CONTROLS;
    if (tab !== 'all') list = list.filter(c => c.group === tab);
    if (filterStatus !== 'all') list = list.filter(c => c.status === filterStatus);
    if (owner !== 'all') list = list.filter(c => c.owner === owner);
    if (filterOpen) list = list.filter(c => findingsFor(c.id).length > 0);
    return list;
  }, [tab, filterStatus, filterOpen, owner]);

  const withFindings = useCtrlMemo(() => CONTROLS.filter(c => findingsFor(c.id).length > 0).length, []);

  return (
    <div style={{ padding: 24, maxWidth: 1320 }}>
      <div style={{ padding:'12px 16px', borderRadius:10, marginBottom:18, background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.25)', fontSize:12.5, color:'#065F46', lineHeight:1.55, display:'flex', alignItems:'flex-start', gap:10 }}>
        <Icon name="shield-check" size={16} color="#047857" style={{ marginTop:2 }}/>
        <span>
          <strong style={{ fontWeight:600 }}>{CONTROLS.length} Annex A controls in the Statement of Applicability.</strong>{' '}
          {CONTROLS.filter(c => c.status === 'red').length} recorded as a gap; {withFindings} controls carry an open finding from the audit round.
        </span>
      </div>

      <div style={{ display:'flex', gap: 4, borderBottom:'1px solid var(--brand-border)', marginBottom: 18 }}>
        {tabs.map(t => {
          const active = t.id === tab;
          return (
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{
                padding:'10px 14px', border:'none', background:'transparent',
                fontFamily:'Poppins, sans-serif', fontSize: 13, fontWeight: active?600:500,
                color: active ? 'var(--brand-accent)' : 'var(--brand-muted)',
                borderBottom: `2px solid ${active ? 'var(--brand-accent)' : 'transparent'}`,
                marginBottom: -1, cursor:'pointer', transition:'all 120ms',
                display:'inline-flex', alignItems:'center', gap: 6,
              }}>
              {t.label}
              <span style={{
                fontSize: 10.5, color: active?'#fff':'var(--brand-muted)',
                background: active ? 'var(--brand-accent)' : 'var(--brand-surface)',
                padding:'1px 6px', borderRadius: 9999, fontWeight: 600,
              }}>{t.count}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display:'flex', gap: 8, marginBottom: 14, flexWrap:'wrap', alignItems:'center' }}>
        <FilterChip
          icon="circle-dot" label="Status"
          value={filterStatus === 'all' ? null : STATUS_COLOR[filterStatus].label}
          onClick={() => {
            const order = ['all','ok','amber','red'];
            const i = order.indexOf(filterStatus);
            setFilterStatus(order[(i+1)%order.length]);
          }}
        />
        <select value={owner} onChange={e=>setOwner(e.target.value)} style={{
          fontFamily:'Poppins, sans-serif', fontSize:12, padding:'5px 10px', borderRadius:9999,
          border:'1px solid ' + (owner === 'all' ? 'var(--brand-border)' : 'var(--brand-accent)'),
          background: owner === 'all' ? '#fff' : 'color-mix(in srgb, var(--brand-accent) 8%, transparent)',
          color: owner === 'all' ? '#343128' : 'var(--brand-accent)', cursor:'pointer',
        }}>
          {owners.map(o => <option key={o} value={o}>{o === 'all' ? 'All owners' : o}</option>)}
        </select>
        <button
          onClick={()=>setFilterOpen(!filterOpen)}
          style={{
            padding:'5px 11px', border:`1px solid ${filterOpen?'var(--brand-accent)':'var(--brand-border)'}`,
            borderRadius: 9999, fontSize: 12, fontWeight: 500,
            background: filterOpen ? 'color-mix(in srgb, var(--brand-accent) 8%, transparent)' : '#fff',
            color: filterOpen ? 'var(--brand-accent)' : '#343128',
            cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 6,
            fontFamily:'Poppins, sans-serif',
          }}>
          <Icon name="alert-triangle" size={12}/> Has open finding
        </button>
        <div style={{ marginLeft:'auto', fontSize: 12, color:'var(--brand-muted)' }}>
          Showing <strong style={{ color:'var(--brand-ink)' }}>{filtered.length}</strong> of {CONTROLS.length}
        </div>
      </div>

      <Card padding={0}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'Poppins, sans-serif', minWidth:960 }}>
            <thead>
              <tr style={{ background:'#F7F6F3', borderBottom:'1px solid var(--brand-border)' }}>
                {['Control','Name','Owner','Status','Last reviewed','Findings','Open item',''].map((h,i) => (
                  <th key={i} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const sc = STATUS_COLOR[c.status];
                const f = findingsFor(c.id);
                return (
                  <tr key={c.id}
                    onClick={()=>onOpenDrawer(c)}
                    style={{ borderBottom:'1px solid var(--brand-surface)', cursor:'pointer', transition:'background 120ms' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#F7F6F3'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={tdStyle}>
                      <span style={{
                        fontFamily:'ui-monospace, monospace', fontSize: 12, fontWeight: 600,
                        color:'var(--brand-accent)', background:'color-mix(in srgb, var(--brand-accent) 8%, transparent)',
                        padding:'2px 7px', borderRadius: 4,
                      }}>A.{c.id}</span>
                    </td>
                    <td style={{ ...tdStyle, color:'var(--brand-ink)', fontWeight: 500, maxWidth: 300 }}>{c.name}</td>
                    <td style={tdStyle}>
                      <div style={{ display:'flex', alignItems:'center', gap: 7 }}>
                        <Avatar name={c.owner} size={20}/>
                        <span style={{ fontSize: 12.5, color:'#343128', whiteSpace:'nowrap' }}>{c.owner}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <Pill color={sc.fg} bg={sc.soft} size="xs">
                        <StatusDot status={c.status}/> {sc.label}
                      </Pill>
                    </td>
                    <td style={{ ...tdStyle, fontSize: 12.5, color:'var(--brand-muted)', whiteSpace:'nowrap' }}>{c.last}</td>
                    <td style={tdStyle}>
                      {f.length > 0
                        ? <span style={{ fontSize: 12, color:'#B91C1C', display:'inline-flex', alignItems:'center', gap: 4, fontWeight:500 }}>
                            <Icon name="alert-triangle" size={11} color="#EF4444"/>{f.length}
                          </span>
                        : <span style={{ fontSize: 12, color:'#9A968C' }}>—</span>}
                    </td>
                    <td style={{ ...tdStyle, fontSize: 12, color:'var(--brand-muted)', maxWidth: 320, lineHeight:1.45 }}>
                      {f.length > 0
                        ? <span><strong style={{ fontWeight:600, color:'#B91C1C' }}>{f[0].ref}</strong> — {f[0].note}</span>
                        : '—'}
                    </td>
                    <td style={{ ...tdStyle, textAlign:'right' }}>
                      <Icon name="chevron-right" size={14} color="#9A968C"/>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

const thStyle = {
  textAlign:'left', padding:'10px 14px', fontSize: 10.5,
  fontWeight: 600, color:'var(--brand-muted)', letterSpacing:'0.05em', textTransform:'uppercase',
};
const tdStyle = { padding:'10px 14px', fontSize: 13, color:'#231F19', verticalAlign:'middle' };

function FilterChip({ icon, label, value, onClick }) {
  const active = !!value;
  return (
    <button onClick={onClick}
      style={{
        padding:'5px 11px', border:`1px solid ${active?'var(--brand-accent)':'var(--brand-border)'}`,
        borderRadius: 9999, fontSize: 12, fontWeight: 500,
        background: active ? 'color-mix(in srgb, var(--brand-accent) 8%, transparent)' : '#fff',
        color: active ? 'var(--brand-accent)' : '#343128',
        cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 6,
        fontFamily:'Poppins, sans-serif',
      }}>
      <Icon name={icon} size={12}/>
      {label}{value && <span>: <strong style={{ fontWeight: 600 }}>{value}</strong></span>}
      <Icon name="chevron-down" size={11}/>
    </button>
  );
}

// --- Slide-over drawer ---

function ControlDrawer({ ctrl, onClose }) {
  if (!ctrl) return null;
  const sc = STATUS_COLOR[ctrl.status];
  const impl = implFor(ctrl.id);
  const just = justifyFor(ctrl.id);
  const finds = findingsFor(ctrl.id);
  const proc = processFor(CTRL_PROCESS[ctrl.id]);
  return (
    <>
      <div onClick={onClose} style={{
        position:'absolute', inset: 0, background:'rgba(0,0,0,0.25)',
        zIndex: 40, animation:'fade 200ms',
      }}/>
      <aside style={{
        position:'absolute', top: 0, bottom: 0, right: 0, width: 500,
        background:'#fff', borderLeft:'1px solid var(--brand-border)',
        zIndex: 50, display:'flex', flexDirection:'column',
        boxShadow:'-12px 0 40px rgba(0,0,0,0.08)',
        animation:'slideIn 220ms cubic-bezier(0.4,0,0.2,1)',
      }}>
        <style>{`
          @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        `}</style>

        <div style={{
          padding:'18px 22px 14px',
          borderBottom:'1px solid var(--brand-border)',
          background:'linear-gradient(180deg, color-mix(in srgb, var(--brand-accent) 4%, transparent), transparent)',
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 10 }}>
            <span style={{
              fontFamily:'ui-monospace, monospace', fontSize: 12, fontWeight: 600,
              color:'var(--brand-accent)', background:'color-mix(in srgb, var(--brand-accent) 10%, transparent)',
              padding:'3px 9px', borderRadius: 6,
            }}>A.{ctrl.id}</span>
            <div style={{ display:'flex', gap: 4 }}>
              <button style={{ ...iconBtnLg }} onClick={onClose} title="Close"><Icon name="x" size={16} color="var(--brand-muted)"/></button>
            </div>
          </div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color:'var(--brand-ink)', lineHeight: 1.3 }}>
            {ctrl.name}
          </h2>
          <div style={{ display:'flex', alignItems:'center', gap: 10, marginTop: 10, flexWrap:'wrap' }}>
            <Pill color={sc.fg} bg={sc.soft}><StatusDot status={ctrl.status}/> {sc.label}</Pill>
            <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
              <Avatar name={ctrl.owner} size={20}/>
              <span style={{ fontSize: 12, color:'#343128' }}>{ctrl.owner}</span>
            </div>
            <span style={{ fontSize: 12, color:'var(--brand-muted)' }}>reviewed {ctrl.last}</span>
          </div>
        </div>

        <div className="scroll-y" style={{ flex: 1, overflowY:'auto', padding:'18px 22px 24px' }}>
          {ISO_CONTROL_HELP[ctrl.id] && (
            <DrawerSection title="Control intent (ISO/IEC 27002:2022)">
              <p style={{ margin: 0, fontSize: 13, color:'#343128', lineHeight: 1.6 }}>{ISO_CONTROL_HELP[ctrl.id]}</p>
            </DrawerSection>
          )}

          <DrawerSection title="Applicability">
            <div style={{ display:'flex', gap:8, marginBottom:8 }}>
              <Pill color="#047857" bg="#ECFDF5" size="xs"><strong style={{ fontWeight:600 }}>Applicable: Yes</strong></Pill>
              <Pill color={sc.fg} bg={sc.soft} size="xs"><strong style={{ fontWeight:600 }}>
                Implemented: {ctrl.status === 'red' ? 'Partially' : 'Yes'}
              </strong></Pill>
            </div>
            {just && <p style={{ margin: 0, fontSize: 13, color:'#343128', lineHeight: 1.6 }}>{just}</p>}
          </DrawerSection>

          {impl.length > 0 && (
            <DrawerSection title="Implementation (SoA)">
              {impl.map((t, i) => (
                <p key={i} style={{ margin: i ? '8px 0 0' : 0, fontSize: 13, color:'#343128', lineHeight: 1.6 }}>{t}</p>
              ))}
            </DrawerSection>
          )}

          {finds.length > 0 && (
            <DrawerSection title={`Open findings (${finds.length})`}>
              <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
                {finds.map((f, i) => (
                  <div key={i} style={{ padding:'9px 11px', borderRadius:8, background:'#FEF2F2', border:'1px solid #FECACA' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:4 }}>
                      <span style={{ fontFamily:'ui-monospace, monospace', fontSize:11, fontWeight:600, color:'#B91C1C' }}>{f.ref}</span>
                      <Pill color="#B91C1C" bg="#fff" size="xs">{f.kind}</Pill>
                    </div>
                    <div style={{ fontSize:12.5, color:'#7F1D1D', lineHeight:1.5 }}>{f.note}</div>
                  </div>
                ))}
              </div>
            </DrawerSection>
          )}

          <DrawerSection title="Governing document">
            <PolicyCard ctrlId={ctrl.id}/>
            {proc && (
              <LinkRow icon="list-ordered"
                label={proc.id + ' — ' + proc.name}
                sub={`${proc.state} · ${proc.ver} · owner ${proc.owner}`}
                href="#"/>
            )}
          </DrawerSection>
        </div>
      </aside>
    </>
  );
}

function DrawerSection({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h3 style={{
        margin:'0 0 8px 0', fontSize: 11, fontWeight: 600, color:'var(--brand-muted)',
        letterSpacing:'0.06em', textTransform:'uppercase',
      }}>{title}</h3>
      {children}
    </div>
  );
}

function LinkRow({ icon, label, sub, href }) {
  const [h, setH] = useCtrlState(false);
  const isExternal = href && href !== '#';
  return (
    <a href={href || '#'}
      onClick={isExternal ? undefined : e=>e.preventDefault()}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:'flex', alignItems:'center', gap: 10,
        padding:'9px 11px', borderRadius: 7,
        background: h ? '#F7F6F3' : '#fff',
        border:'1px solid var(--brand-border)',
        textDecoration:'none', color:'inherit',
      }}>
      <div style={{
        width: 28, height: 28, borderRadius: 6,
        background:'color-mix(in srgb, var(--brand-accent) 8%, transparent)',
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}><Icon name={icon} size={14} color="var(--brand-accent)"/></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, color:'var(--brand-ink)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color:'var(--brand-muted)', marginTop: 1 }}>{sub}</div>
      </div>
    </a>
  );
}

const iconBtnLg = {
  width: 30, height: 30, borderRadius: 7,
  border:'none', background:'transparent', cursor:'pointer',
  display:'inline-flex', alignItems:'center', justifyContent:'center',
};

Object.assign(window, { ControlsPage, ControlDrawer, PolicyCard, PolicyCardByNum });

registerWidget('page-controls', ControlsPage);
registerWidget('drawer-control', ControlDrawer);
