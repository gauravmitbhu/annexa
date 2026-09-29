// Evidence Library page: the clause 7.5 documented-information register.
// Reads EVIDENCE_PACK (data/evidence.json) when present:
//   { intro?: string,
//     areas: [ { id, name, clause, icon,
//                items: [ { doc, type: 'doc'|'sheet'|'ticket'|'image', owner, note? } ] } ] }
// Without it, a small generic example register is shown.

const { useState: useEvlState, useMemo: useEvlMemo } = React;

const EVL_FALLBACK = {
  intro: 'Example register. Supply EVIDENCE_PACK to list your own documented information.',
  areas: [
    { id: 'scope', name: 'Scope & context', clause: '4.1–4.4', icon: 'crosshair',
      items: [
        { doc: 'Management system scope', type: 'doc', owner: 'ISMS Manager', note: 'Services, locations, systems and explicit exclusions.' },
        { doc: 'Interested parties analysis', type: 'sheet', owner: 'ISMS Manager', note: 'Stakeholders and their requirements; reviewed annually.' },
      ]},
    { id: 'policies', name: 'Policies & standards', clause: '5.2, 7.5', icon: 'file-text',
      items: [
        { doc: 'Information security policy', type: 'doc', owner: 'ISMS Manager', note: '' },
        { doc: 'Document management policy', type: 'doc', owner: 'ISMS Manager', note: 'Version control, approval and publication rules.' },
      ]},
    { id: 'risk', name: 'Risk & SoA', clause: '6.1, 8.2, 8.3', icon: 'alert-triangle',
      items: [
        { doc: 'Risk register', type: 'sheet', owner: 'Risk Owner', note: 'Treatment, residual scores and acceptance.' },
        { doc: 'Statement of Applicability', type: 'sheet', owner: 'ISMS Manager', note: '' },
      ]},
    { id: 'audit', name: 'Audits & findings', clause: '9.2, 10.2', icon: 'clipboard-check',
      items: [
        { doc: 'Internal audit programme', type: 'doc', owner: 'Internal Auditor', note: '' },
        { doc: 'Findings register', type: 'ticket', owner: 'ISMS Manager', note: '' },
      ]},
    { id: 'mr', name: 'Management review', clause: '9.3', icon: 'users',
      items: [
        { doc: 'Management review minutes', type: 'doc', owner: 'Top Management', note: '' },
      ]},
  ],
};

function evlPack() {
  return (typeof EVIDENCE_PACK !== 'undefined' && EVIDENCE_PACK && Array.isArray(EVIDENCE_PACK.areas))
    ? EVIDENCE_PACK : EVL_FALLBACK;
}

const EVL_TYPE_META = {
  doc:    { icon: 'file-text',      color: 'var(--brand-accent)', label: 'Document' },
  sheet:  { icon: 'table',          color: '#047857', label: 'Register' },
  ticket: { icon: 'square-check-big', color: '#B45309', label: 'List' },
  image:  { icon: 'image',          color: '#1D4ED8', label: 'Diagram' },
};

function EvidencePage() {
  const [q, setQ] = useEvlState('');
  const [area, setArea] = useEvlState('all');

  const pack = evlPack();
  const EVL_AREAS = pack.areas;
  const areas = useEvlMemo(() => EVL_AREAS.map(a => ({
    ...a,
    items: a.items.filter(i => !q || (i.doc + ' ' + (i.note || '') + ' ' + (i.owner || '')).toLowerCase().includes(q.toLowerCase())),
  })).filter(a => (area === 'all' || a.id === area) && a.items.length > 0), [q, area, EVL_AREAS]);

  const total = EVL_AREAS.reduce((n, a) => n + a.items.length, 0);
  const shown = areas.reduce((n, a) => n + a.items.length, 0);

  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:18, maxWidth:1320 }}>
      <div style={{ padding:'12px 16px', borderRadius:10, background:'color-mix(in srgb, var(--brand-accent) 6%, transparent)', border:'1px solid color-mix(in srgb, var(--brand-accent) 18%, transparent)', fontSize:12.5, color:'#B8410F', lineHeight:1.55, display:'flex', alignItems:'flex-start', gap:10 }}>
        <Icon name="folder-archive" size={16} color="var(--brand-accent)" style={{ marginTop:2 }}/>
        <span>
          <strong style={{ fontWeight:600 }}>Documented information register, clause 7.5.</strong>{' '}
          {pack.intro || ''}
        </span>
      </div>

      <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search the library…" style={{
          fontFamily:'Poppins, sans-serif', fontSize:12, padding:'7px 12px', borderRadius:7,
          border:'1px solid var(--brand-border)', color:'var(--brand-ink)', minWidth:280,
        }}/>
        <select value={area} onChange={e=>setArea(e.target.value)} style={{
          fontFamily:'Poppins, sans-serif', fontSize:12, padding:'7px 10px', borderRadius:7,
          border:'1px solid var(--brand-border)', color:'#4A473F', background:'#fff', cursor:'pointer',
        }}>
          <option value="all">All areas</option>
          {EVL_AREAS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <span style={{ marginLeft:'auto', fontSize:11.5, color:'var(--brand-muted)' }}>{shown} of {total} entries</span>
      </div>

      {areas.map(a => (
        <Card key={a.id} padding={0}>
          <div style={{ padding:'13px 18px', borderBottom:'1px solid var(--brand-surface)', display:'flex', alignItems:'center', gap:10, background:'#F7F6F3' }}>
            <Icon name={a.icon} size={15} color="var(--brand-accent)"/>
            <span style={{ fontSize:14, fontWeight:600, color:'var(--brand-ink)' }}>{a.name}</span>
            <Pill color="var(--brand-accent)" bg="color-mix(in srgb, var(--brand-accent) 8%, transparent)" size="xs">{a.clause}</Pill>
            <span style={{ marginLeft:'auto', fontSize:11, color:'#9A968C' }}>{a.items.length} entr{a.items.length === 1 ? 'y' : 'ies'}</span>
          </div>
          {a.items.map((it, i) => {
            const tm = EVL_TYPE_META[it.type] || EVL_TYPE_META.doc;
            return (
              <div key={i} style={{ padding:'11px 18px', borderTop: i === 0 ? 'none' : '1px solid var(--brand-surface)', display:'grid', gridTemplateColumns:'26px 1fr 180px', gap:12, alignItems:'start' }}>
                <Icon name={tm.icon} size={14} color={tm.color} style={{ marginTop:2 }}/>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:12.5, color:'var(--brand-ink)', fontWeight:500 }}>{it.doc}</div>
                  {it.note && <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:3, lineHeight:1.5 }}>{it.note}</div>}
                </div>
                <div style={{ justifySelf:'end', textAlign:'right' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                    <Avatar name={it.owner} size={19}/>
                    <span style={{ fontSize:11.5, color:'#4A473F' }}>{it.owner}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </Card>
      ))}
    </div>
  );
}

Object.assign(window, { EvidencePage });

registerWidget('page-evidence', EvidencePage);
