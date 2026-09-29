// Audit Programme page: the multi-year internal audit programme plus the
// external certification audits and independent assurance activity.
// AUDIT_PROGRAMME may carry optional `note` (banner text) and `cycle` (e.g. "2026–28").

const { useState: useAudState } = React;

const AUD_STATUS_PILL = {
  'Completed':        { bg:'#ECFDF5', fg:'#047857' },
  'Planned':          { bg:'#EFF6FF', fg:'#1D4ED8' },
  'Not yet recorded': { bg:'#FFFBEB', fg:'#B45309' },
};

function AUTile({ icon, label, value, sub, color }) {
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

function AuditsPage() {
  const years = Array.from(new Set(AUDIT_REPORTS.map(a => a.year))).sort();
  const thisYear = new Date().getFullYear();
  const curYear = years.includes(thisYear) ? thisYear : (years[years.length - 1] || thisYear);
  const [year, setYear] = useAudState(curYear);
  const rows = AUDIT_REPORTS.filter(a => a.year === year);
  const done26 = AUDIT_REPORTS.filter(a => a.year === curYear && a.status === 'Completed').length;
  const total26 = AUDIT_REPORTS.filter(a => a.year === curYear).length;
  const cycle = AUDIT_PROGRAMME.cycle || (years.length ? (years[0] === years[years.length - 1] ? String(years[0]) : years[0] + '–' + String(years[years.length - 1]).slice(-2)) : '—');

  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:18, maxWidth:1320 }}>
      {AUDIT_PROGRAMME.note && <div style={{ padding:'12px 16px', borderRadius:10, background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.28)', fontSize:12.5, color:'#7C2D12', lineHeight:1.55, display:'flex', alignItems:'flex-start', gap:10 }}>
        <Icon name="clipboard-check" size={16} color="#B45309" style={{ marginTop:2 }}/>
        <span>
          {AUDIT_PROGRAMME.note}
          {' '}({AUDIT_PROGRAMME.docId} v{AUDIT_PROGRAMME.version}, {AUDIT_PROGRAMME.date})
        </span>
      </div>}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <AUTile icon="calendar-check" label={`${curYear} audits done`} value={`${done26}/${total26}`} sub="units audited this year" color={done26 === total26 ? '#047857' : '#B45309'}/>
        <AUTile icon="repeat"         label="Programme cycle"  value={cycle}                 sub="every unit, every year" color="var(--brand-ink)"/>
        <AUTile icon="stamp"          label="External audits"  value={EXTERNAL_AUDITS.length} sub="certification and customer audits" color="var(--brand-ink)"/>
        <AUTile icon="microscope"     label="Assurance"        value={ASSURANCE.length}       sub="independent reviews" color="var(--brand-ink)"/>
      </div>

      <Card padding={18}>
        <SectionTitle right={<span style={{ fontSize:11, color:'#9A968C' }}>{AUDIT_PROGRAMME.docId} v{AUDIT_PROGRAMME.version}</span>}>
          Programme rules
        </SectionTitle>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, fontSize:12, color:'#343128', lineHeight:1.55 }}>
          <div><strong style={{ fontWeight:600, color:'var(--brand-ink)' }}>Scope.</strong> {AUDIT_PROGRAMME.scope}</div>
          <div><strong style={{ fontWeight:600, color:'var(--brand-ink)' }}>Frequency.</strong> {AUDIT_PROGRAMME.frequency}</div>
          <div><strong style={{ fontWeight:600, color:'var(--brand-ink)' }}>Responsibilities.</strong> {AUDIT_PROGRAMME.responsibilities}</div>
          <div><strong style={{ fontWeight:600, color:'var(--brand-ink)' }}>Impartiality.</strong> {AUDIT_PROGRAMME.impartiality}</div>
          <div style={{ gridColumn:'1 / -1' }}><strong style={{ fontWeight:600, color:'var(--brand-ink)' }}>Retention.</strong> {AUDIT_PROGRAMME.retention}</div>
        </div>
      </Card>

      <div style={{ display:'flex', gap:10, alignItems:'center' }}>
        <span style={{ fontSize:11, color:'var(--brand-muted)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em' }}>Internal audit schedule</span>
        {years.map(y => (
          <button key={y} onClick={()=>setYear(y)} style={{
            fontFamily:'Poppins, sans-serif', fontSize:12, padding:'5px 12px', borderRadius:9999, cursor:'pointer',
            border:'1px solid ' + (year === y ? 'var(--brand-accent)' : 'var(--brand-border)'),
            background: year === y ? 'color-mix(in srgb, var(--brand-accent) 8%, transparent)' : '#fff',
            color: year === y ? 'var(--brand-accent)' : '#4A473F', fontWeight: year === y ? 600 : 500,
          }}>{y}</button>
        ))}
      </div>

      <Card padding={0}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5, minWidth:880 }}>
            <thead>
              <tr style={{ background:'#F7F6F3' }}>
                {['Audit','Unit and locations','Criteria','Auditor','Auditee','Date','Status'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'9px 12px', fontSize:10.5, fontWeight:600, color:'var(--brand-muted)', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid var(--brand-border)', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((a, i) => {
                const p = AUD_STATUS_PILL[a.status] || { bg:'var(--brand-surface)', fg:'var(--brand-muted)' };
                const ext = a.auditor.indexOf('External') === 0;
                return (
                  <tr key={a.id} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--brand-surface)' }}>
                    <td style={{ padding:'10px 12px', verticalAlign:'top', whiteSpace:'nowrap' }}>
                      <span style={{ fontFamily:'ui-monospace, monospace', fontSize:11, fontWeight:600, color:'var(--brand-accent)', background:'color-mix(in srgb, var(--brand-accent) 8%, transparent)', padding:'1px 6px', borderRadius:4 }}>{a.id}</span>
                    </td>
                    <td style={{ padding:'10px 12px', verticalAlign:'top', color:'var(--brand-ink)', lineHeight:1.5, minWidth:280 }}>{a.unit}</td>
                    <td style={{ padding:'10px 12px', verticalAlign:'top', fontSize:11, color:'var(--brand-muted)', lineHeight:1.5, minWidth:180 }}>{a.criteria}</td>
                    <td style={{ padding:'10px 12px', verticalAlign:'top', fontSize:11.5, color: ext ? 'var(--brand-accent)' : '#4A473F', lineHeight:1.45 }}>
                      {ext && <Icon name="external-link" size={10} style={{ verticalAlign:'middle', marginRight:4 }}/>}{a.auditor}
                    </td>
                    <td style={{ padding:'10px 12px', verticalAlign:'top', fontSize:11.5, color:'#4A473F', lineHeight:1.45 }}>{a.auditee}</td>
                    <td style={{ padding:'10px 12px', verticalAlign:'top', fontSize:11.5, color:'var(--brand-muted)', whiteSpace:'nowrap' }}>{a.actual || a.planned || '—'}</td>
                    <td style={{ padding:'10px 12px', verticalAlign:'top' }}>
                      <Pill color={p.fg} bg={p.bg} size="xs">{a.status}</Pill>
                      {a.report && <div style={{ fontSize:10, color:'#9A968C', marginTop:4, maxWidth:180, wordBreak:'break-word' }}>{a.report}</div>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:14 }}>
        <Card padding={0}>
          <div style={{ padding:'16px 20px 10px' }}>
            <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'var(--brand-ink)' }}>External audits</h2>
            <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:2 }}>Certification and customer supplier audits.</div>
          </div>
          {EXTERNAL_AUDITS.map(e => (
            <div key={e.id} style={{ padding:'12px 20px', borderTop:'1px solid var(--brand-surface)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:9, flexWrap:'wrap' }}>
                <span style={{ fontFamily:'ui-monospace, monospace', fontSize:10.5, fontWeight:600, color:'var(--brand-accent)' }}>{e.id}</span>
                <span style={{ fontSize:13, fontWeight:500, color:'var(--brand-ink)' }}>{e.scope}</span>
                <span style={{ marginLeft:'auto', fontSize:11, color:'#9A968C' }}>{e.date}</span>
              </div>
              <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:4 }}>{e.body} · {e.standards}</div>
              <div style={{ fontSize:12, color:'#343128', marginTop:5, lineHeight:1.5 }}>{e.outcome}</div>
              {e.ncs && <div style={{ fontSize:11, color:'#B45309', marginTop:5, lineHeight:1.45, background:'#FFFBEB', borderRadius:5, padding:'5px 8px' }}>{e.ncs}</div>}
            </div>
          ))}
        </Card>

        <Card padding={0}>
          <div style={{ padding:'16px 20px 10px' }}>
            <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'var(--brand-ink)' }}>Independent assurance</h2>
            <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:2 }}>Third-party reviews feeding A.5.35.</div>
          </div>
          {ASSURANCE.map(a => (
            <div key={a.id} style={{ padding:'12px 20px', borderTop:'1px solid var(--brand-surface)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:12.5, fontWeight:500, color:'var(--brand-ink)' }}>{a.kind}</span>
                <span style={{ marginLeft:'auto', fontSize:11, color:'#9A968C' }}>{a.date}</span>
              </div>
              <div style={{ fontSize:12, color:'#343128', marginTop:4, lineHeight:1.5 }}>{a.what}</div>
              <div style={{ fontSize:11, color:'#047857', marginTop:4, lineHeight:1.45 }}>
                <Icon name="arrow-right" size={10} style={{ verticalAlign:'middle', marginRight:4 }}/>{a.result}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { AuditsPage });

registerWidget('page-audits', AuditsPage);
