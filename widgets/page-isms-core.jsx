// IMS Core — the management-system clauses 4–10 shared by ISO/IEC 27001,
// ISO 14001 and ISO 9001, with the open nonconformity per clause.
// Grouped by clause, each sub-clause shows status, owner, note and evidence refs.
const { useState: useCoreState } = React;

// Map status → short readiness verb for the rollup chips.
const CLAUSE_STATE_LABEL = { ok:'Ready', amber:'Attention', red:'Gap', na:'N/A' };

function clauseRollup(items) {
  const t = { ok:0, amber:0, red:0, na:0 };
  items.forEach(i => { t[i.status] = (t[i.status]||0) + 1; });
  // worst status drives the group chip
  const worst = t.red ? 'red' : t.amber ? 'amber' : t.na && !t.ok ? 'na' : 'ok';
  return { t, worst };
}

function CoreStatusPill({ status, children }) {
  const c = STATUS_COLOR[status];
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap: 5,
      padding:'2px 9px', borderRadius: 9999,
      background: c.soft, color: c.fg,
      fontSize: 11, fontWeight: 600, whiteSpace:'nowrap',
    }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background: c.bg }}/>
      {children || c.label}
    </span>
  );
}

const LINK_ICON = { doc:'file-text', ticket:'square-check-big', ext:'external-link', sheet:'table-2' };

// Brief plain-language guidance per ISO/IEC 27001:2022 clause (paraphrased from the
// standard's requirements — what each clause expects). Toggle on the page header.
const ISO_CLAUSE_HELP = {
  '4.1': 'Determine the external and internal issues relevant to your purpose that affect the ISMS’s ability to achieve its intended outcomes.',
  '4.2': 'Identify the interested parties relevant to the ISMS and their relevant requirements (including legal, regulatory and contractual).',
  '4.3': 'Define the boundaries and applicability of the ISMS to set its scope, considering the 4.1/4.2 issues and interfaces/dependencies. Scope must be documented.',
  '4.4': 'Establish, implement, maintain and continually improve the ISMS, including the processes needed and their interactions.',
  '4.x': '2024 amendment: determine whether climate change is a relevant issue (4.1) and whether interested parties have climate-related requirements (4.2).',
  '5.1': 'Top management demonstrates leadership and commitment — setting policy and objectives, ensuring resources, and integrating the ISMS into business processes.',
  '5.2': 'Top management establishes an information security policy appropriate to the organisation, available as documented information and communicated.',
  '5.3': 'Assign and communicate the responsibilities and authorities for ISMS roles (conformance to the standard, and reporting on ISMS performance).',
  '6.1': 'Determine risks and opportunities to address; define and apply a risk assessment process (6.1.2) and a risk treatment process (6.1.3) producing the Statement of Applicability.',
  '6.2': 'Establish measurable information security objectives and plan how to achieve them (what, resources, who, when, how evaluated); retain as documented information.',
  '6.3': 'When a change to the ISMS is needed, carry it out in a planned manner.',
  '7.1': 'Determine and provide the resources needed to establish, implement, maintain and improve the ISMS.',
  '7.2': 'Determine necessary competence, ensure persons are competent (education, training or experience), and retain evidence.',
  '7.3': 'Persons working under the organisation’s control are aware of the policy, their contribution to the ISMS, and the implications of not conforming.',
  '7.4': 'Determine the need for internal and external communications relevant to the ISMS — what, when, with whom, and how.',
  '7.5': 'Create, control and make available the documented information required by the standard and by the organisation (7.5.1–7.5.3).',
  '8.1': 'Plan, implement and control the processes needed to meet requirements and to apply risk-treatment actions; keep documented information to have confidence they run as planned; control changes and externally provided processes.',
  '8.2': 'Perform information security risk assessments at planned intervals and when significant changes occur; retain documented results.',
  '8.3': 'Implement the risk treatment plan and retain documented results.',
  '9.1': 'Monitor, measure, analyse and evaluate ISMS performance and effectiveness — define what to monitor, the methods, when, and by whom; retain documented evidence.',
  '9.2': 'Conduct internal audits at planned intervals to confirm the ISMS conforms and is effectively implemented; run an audit programme and retain evidence of results.',
  '9.3': 'Top management reviews the ISMS at planned intervals (defined inputs: changes, performance, risk, improvement) and records results and decisions.',
  '10.1': 'Continually improve the suitability, adequacy and effectiveness of the ISMS.',
  '10.2': 'React to nonconformities, take corrective action to eliminate the causes, review effectiveness, and retain documented evidence.',
};

function CoreLinkRow({ link }) {
  const [h, setH] = useCoreState(false);
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:'flex', alignItems:'center', gap: 9,
        padding:'8px 10px', borderRadius: 7,
        background: h ? 'color-mix(in srgb, var(--brand-accent) 6%, transparent)' : '#fff',
        border:'1px solid ' + (h ? 'color-mix(in srgb, var(--brand-accent) 25%, transparent)' : '#EEF0F3'),
        textDecoration:'none', transition:'all 120ms',
      }}>
      <span style={{
        width: 26, height: 26, borderRadius: 6, flexShrink: 0,
        background:'color-mix(in srgb, var(--brand-accent) 8%, transparent)',
        display:'inline-flex', alignItems:'center', justifyContent:'center',
      }}><Icon name={LINK_ICON[link.type] || 'file-text'} size={13} color="var(--brand-accent)"/></span>
      <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color:'var(--brand-ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{link.label}</span>
      <Icon name="arrow-up-right" size={14} color={h ? 'var(--brand-accent)' : '#9A968C'}/>
    </a>
  );
}

function ClauseRow({ item, showHelp }) {
  const [open, setOpen] = useCoreState(false);
  const links = item.links || [];
  const hasLinks = links.length > 0;
  return (
    <div style={{ borderTop:'1px solid var(--brand-surface)' }}>
      <div
        onClick={()=> hasLinks && setOpen(o => !o)}
        style={{
          display:'grid', gridTemplateColumns:'70px 1fr 150px 120px 22px',
          alignItems:'start', gap: 14,
          padding:'12px 16px',
          cursor: hasLinks ? 'pointer' : 'default',
          background: open ? '#F7F6F3' : 'transparent',
          transition:'background 120ms',
        }}
        onMouseEnter={e=>{ if (hasLinks && !open) e.currentTarget.style.background='#F7F6F3'; }}
        onMouseLeave={e=>{ if (!open) e.currentTarget.style.background='transparent'; }}>
        <span style={{
          alignSelf:'start',
          display:'inline-block', padding:'2px 8px', borderRadius: 4,
          background:'color-mix(in srgb, var(--brand-accent) 8%, transparent)', color:'var(--brand-accent)',
          fontSize: 11.5, fontWeight: 600, textAlign:'center',
          fontFamily:'ui-monospace, SFMono-Regular, monospace',
        }}>{item.id}</span>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color:'var(--brand-ink)' }}>{item.title}</div>
          {showHelp && ISO_CLAUSE_HELP[item.id] && (
            <div style={{ marginTop: 5, padding:'6px 9px', borderRadius: 6,
              background:'color-mix(in srgb, var(--brand-accent) 5%, transparent)', border:'1px solid color-mix(in srgb, var(--brand-accent) 12%, transparent)',
              fontSize: 11, color:'#B8410F', lineHeight: 1.5 }}>
              <Icon name="book-open" size={10} color="var(--brand-accent)" style={{ marginRight: 5, verticalAlign:'middle' }}/>
              <strong style={{ fontWeight: 600 }}>ISO 27001 — {item.id}:</strong> {ISO_CLAUSE_HELP[item.id]}
            </div>
          )}
          <div style={{ fontSize: 11.5, color:'var(--brand-muted)', lineHeight: 1.45, marginTop: 3 }}>{item.note}</div>
          {hasLinks && (
            <div style={{ fontSize: 10.5, color:'#9A968C', marginTop: 5, display:'flex', alignItems:'center', gap: 4 }}>
              <Icon name="link" size={10} color="#9A968C"/> {links.length} linked {links.length === 1 ? 'document' : 'documents'}
            </div>
          )}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap: 7 }}>
          <Avatar name={item.owner} size={22}/>
          <span style={{ fontSize: 12.5, color:'#343128' }}>{item.owner}</span>
        </div>

        <div style={{ justifySelf:'end' }}>
          <CoreStatusPill status={item.status}/>
        </div>

        <div style={{ justifySelf:'center', alignSelf:'start', paddingTop: 2 }}>
          {hasLinks && (
            <span style={{ display:'inline-flex', transform: open ? 'rotate(180deg)' : 'none', transition:'transform 150ms', color:'#9A968C' }}>
              <Icon name="chevron-down" size={16}/>
            </span>
          )}
        </div>
      </div>

      {open && hasLinks && (
        <div style={{ padding:'2px 16px 14px 86px', background:'#F7F6F3' }}>
          <div style={{ fontSize: 10.5, color:'#9A968C', fontWeight: 600, textTransform:'uppercase', letterSpacing:'0.05em', margin:'4px 0 8px' }}>
            Linked documents &amp; evidence
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap: 6, maxWidth: 560 }}>
            {links.map((l, i) => <CoreLinkRow key={i} link={l}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

function ClauseCard({ group, showHelp }) {
  const { worst } = clauseRollup(group.items);
  return (
    <Card padding={0}>
      <div style={{
        padding:'14px 16px', display:'flex', alignItems:'center',
        justifyContent:'space-between', gap: 12,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background:'var(--brand-ink)', color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize: 15, fontWeight: 700,
          }}>{group.clause}</div>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 600, color:'var(--brand-ink)' }}>Clause {group.clause} · {group.title}</div>
            <div style={{ fontSize: 11, color:'#9A968C', marginTop: 1 }}>{group.items.length} sub-clauses</div>
          </div>
        </div>
        <CoreStatusPill status={worst}>{CLAUSE_STATE_LABEL[worst]}</CoreStatusPill>
      </div>
      {group.items.map(it => <ClauseRow key={it.id} item={it} showHelp={showHelp}/>)}
    </Card>
  );
}

function CoreSummary({ groups }) {
  const all = groups.flatMap(g => g.items);
  const t = { ok:0, amber:0, red:0, na:0 };
  all.forEach(i => { t[i.status] = (t[i.status]||0) + 1; });
  const tiles = [
    { label:'Clauses in scope', value: all.length, color:'var(--brand-ink)', icon:'list-checks' },
    { label:'Ready',            value: t.ok,       color:'#047857', icon:'check-circle-2' },
    { label:'Need attention',   value: t.amber,    color:'#B45309', icon:'alert-triangle' },
    { label:'Open gaps',        value: t.red,      color:'#B91C1C', icon:'x-circle' },
  ];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
      {tiles.map(ti => (
        <Card key={ti.label} padding={16}>
          <div style={{ display:'flex', alignItems:'center', gap: 7, fontSize: 11.5, color:'var(--brand-muted)', fontWeight: 500, textTransform:'uppercase', letterSpacing:'0.04em' }}>
            <Icon name={ti.icon} size={13} color="var(--brand-accent)"/> {ti.label}
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, color: ti.color, marginTop: 8, lineHeight: 1 }}>{ti.value}</div>
        </Card>
      ))}
    </div>
  );
}

function ISMSCorePage() {
  const [filter, setFilter] = useCoreState('all');
  const [showHelp, setShowHelp] = useCoreState(true);
  const groups = ISMS_CLAUSES
    .map(g => ({ ...g, items: g.items.filter(i => filter === 'all' || i.status === filter) }))
    .filter(g => g.items.length > 0);

  const filters = [
    { k:'all',   label:'All' },
    { k:'red',   label:'Gaps' },
    { k:'amber', label:'Attention' },
    { k:'ok',    label:'Ready' },
  ];

  return (
    <div style={{ padding:'16px 24px 40px' }}>
      <CoreSummary groups={ISMS_CLAUSES}/>

      <div style={{ display:'flex', gap: 4, marginBottom: 14, alignItems:'center' }}>
        {filters.map(f => (
          <button key={f.k} onClick={()=>setFilter(f.k)}
            style={{
              padding:'4px 12px', borderRadius: 6,
              border:'1px solid ' + (filter === f.k ? 'color-mix(in srgb, var(--brand-accent) 35%, transparent)' : 'var(--brand-border)'),
              background: filter === f.k ? 'color-mix(in srgb, var(--brand-accent) 8%, transparent)' : '#fff',
              color: filter === f.k ? '#B8410F' : 'var(--brand-muted)',
              fontSize: 11.5, fontWeight: 500, cursor:'pointer',
              fontFamily:'Poppins, sans-serif',
            }}>{f.label}</button>
        ))}

        {/* ISO 27001 guidance toggle */}
        <div onClick={()=>setShowHelp(v=>!v)}
          style={{ marginLeft:'auto', display:'inline-flex', alignItems:'center', gap: 8, cursor:'pointer', userSelect:'none' }}>
          <span style={{ fontSize: 11.5, color:'#4A473F', fontWeight: 500, display:'inline-flex', alignItems:'center', gap: 5 }}>
            <Icon name="book-open" size={13} color="var(--brand-accent)"/> ISO 27001 guidance
          </span>
          <span style={{
            width: 34, height: 18, borderRadius: 9999, position:'relative', transition:'background 150ms',
            background: showHelp ? 'var(--brand-accent)' : '#C6C4BB',
          }}>
            <span style={{
              position:'absolute', top: 2, left: showHelp ? 18 : 2, width: 14, height: 14,
              borderRadius:'50%', background:'#fff', transition:'left 150ms',
            }}/>
          </span>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap: 14 }}>
        {groups.map(g => <ClauseCard key={g.clause} group={g} showHelp={showHelp}/>)}
        {groups.length === 0 && (
          <Card padding={40}>
            <div style={{ textAlign:'center', color:'#9A968C', fontSize: 13 }}>No clauses match this filter.</div>
          </Card>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ISMSCorePage });

registerWidget('page-core', ISMSCorePage);
