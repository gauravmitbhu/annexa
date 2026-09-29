// People & Training -> "Training status" tab.
// Displays TRAINING_STATUS from data/training.json, a read-only LMS export.
// The dashboard does not connect to the LMS itself.

const { useState: useTrState } = React;

// Courses that carry compliance weight. Anything matching is shown in the
// matrix; the rest of the catalogue is counted but not listed.
const TR_MANDATORY = /secur|phish|password|malware|virus|gdpr|privacy|data protect|acceptable use|social engineer|incident|continuity|whistle|briber|money launder|conduct|ai polic|cyber|harassment|discriminat/i;

function TrPill({ status, percent }) {
  const s = String(status || '').toLowerCase();
  const done = s.includes('complet');
  const started = !done && (percent > 0 || s.includes('progress'));
  const tone = done ? { c: '#047857', bg: '#ECFDF5', t: 'Complete' }
             : started ? { c: '#B45309', bg: '#FFFBEB', t: `${percent || 0}%` }
             : { c: '#B91C1C', bg: '#FEF2F2', t: 'Not started' };
  return <Pill color={tone.c} bg={tone.bg} size="xs">{tone.t}</Pill>;
}

function PageTraining() {
  const data = (typeof TRAINING_STATUS !== 'undefined' && TRAINING_STATUS) || null;

  const header = (
    <div style={{ display:'flex', alignItems:'center', gap: 12, flexWrap:'wrap', marginBottom: 14 }}>
      <div style={{ minWidth: 0 }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color:'var(--brand-ink)' }}>Training status</h2>
        <div style={{ fontSize: 11.5, color:'var(--brand-muted)', marginTop: 2 }}>
          {data ? <>LMS export · {data.source} · exported {String(data.syncedAt || '').replace('T',' ').replace('Z',' UTC')}</>
                : <>No LMS export loaded.</>}
        </div>
      </div>
    </div>
  );

  if (!data) {
    return (
      <div style={{ maxWidth: 1320, padding:'20px 24px 32px' }}>
        <Card padding={20}>
          {header}
          <div style={{ fontSize: 12, color:'var(--brand-muted)', lineHeight: 1.6 }}>
            Place an LMS export of users and course enrolments in <code>data/training.json</code>
            (global <code>TRAINING_STATUS</code>) to populate this tab.
          </div>
        </Card>
      </div>
    );
  }

  // Courses that matter, ordered by how many people are enrolled on them.
  const counts = {};
  data.people.forEach(p => (p.courses || []).forEach(c => {
    if (!TR_MANDATORY.test(String(c.name))) return;
    counts[c.name] = counts[c.name] || { name: c.name, id: c.id, enrolled: 0, done: 0 };
    counts[c.name].enrolled++;
    if (String(c.status || '').toLowerCase().includes('complet')) counts[c.name].done++;
  }));
  const cols = Object.values(counts).sort((a, b) => b.enrolled - a.enrolled);
  const people = [...data.people].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={{ maxWidth: 1320, padding:'20px 24px 32px', display:'flex', flexDirection:'column', gap: 18 }}>
      <Card padding={20}>
        {header}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
          <div><div style={{ fontSize: 22, fontWeight: 600, color:'var(--brand-ink)' }}>{data.userCount}</div>
            <div style={{ fontSize: 11.5, color:'var(--brand-muted)' }}>active people in the LMS</div></div>
          <div><div style={{ fontSize: 22, fontWeight: 600, color:'var(--brand-ink)' }}>{data.courseCount}</div>
            <div style={{ fontSize: 11.5, color:'var(--brand-muted)' }}>courses in the catalogue</div></div>
          <div><div style={{ fontSize: 22, fontWeight: 600, color:'var(--brand-ink)' }}>{cols.length}</div>
            <div style={{ fontSize: 11.5, color:'var(--brand-muted)' }}>compliance courses with enrolments</div></div>
          <div><div style={{ fontSize: 22, fontWeight: 600, color:'#B45309' }}>
            {data.people.filter(p => !(p.courses || []).some(c => TR_MANDATORY.test(String(c.name)))).length}</div>
            <div style={{ fontSize: 11.5, color:'var(--brand-muted)' }}>people with NO compliance course at all</div></div>
        </div>
      </Card>

      <Card padding={20}>
        <SectionTitle right={<span style={{ fontSize: 11, color:'var(--brand-muted)' }}>enrolled / completed</span>}>
          Compliance courses
        </SectionTitle>
        {cols.length === 0 && <div style={{ fontSize: 12, color:'var(--brand-muted)' }}>No compliance-course enrolments found.</div>}
        {cols.map(c => {
          const pct = c.enrolled ? Math.round(100 * c.done / c.enrolled) : 0;
          return (
            <div key={c.name} style={{ display:'flex', alignItems:'center', gap: 12, padding:'8px 0',
              borderBottom:'1px solid var(--brand-surface)', fontSize: 12.5 }}>
              <div style={{ flex: 1, minWidth: 0, color:'var(--brand-ink)' }}>{c.name}</div>
              <div style={{ width: 150, height: 6, borderRadius: 9999, background:'var(--brand-surface)', overflow:'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#10B981' : 'var(--brand-accent)' }}/>
              </div>
              <div style={{ width: 96, textAlign:'right', color:'var(--brand-muted)' }}>
                {c.done}/{c.enrolled} · {pct}%
              </div>
            </div>
          );
        })}
      </Card>

      <Card padding={20}>
        <SectionTitle right={<span style={{ fontSize: 11, color:'var(--brand-muted)' }}>{people.length} people</span>}>
          Per person
        </SectionTitle>
        <div style={{ overflowX:'auto' }}>
          <table style={{ borderCollapse:'collapse', width:'100%', fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ textAlign:'left', padding:'6px 10px 6px 0', color:'var(--brand-muted)', fontWeight: 500,
                  position:'sticky', left: 0, background:'#fff' }}>Person</th>
                {cols.slice(0, 10).map(c => (
                  <th key={c.name} style={{ padding:'6px 8px', color:'var(--brand-muted)', fontWeight: 500,
                    fontSize: 10.5, textAlign:'left', maxWidth: 110 }}>{c.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {people.map(p => {
                const byName = Object.fromEntries((p.courses || []).map(c => [c.name, c]));
                return (
                  <tr key={p.id} style={{ borderTop:'1px solid var(--brand-surface)' }}>
                    <td style={{ padding:'7px 10px 7px 0', position:'sticky', left: 0, background:'#fff', whiteSpace:'nowrap' }}>
                      <div style={{ color:'var(--brand-ink)' }}>{p.name || p.email}</div>
                      <div style={{ fontSize: 10.5, color:'#9A968C' }}>
                        {p.type}{p.last_login ? '' : ' · never logged in'}
                      </div>
                    </td>
                    {cols.slice(0, 10).map(c => {
                      const e = byName[c.name];
                      return (
                        <td key={c.name} style={{ padding:'7px 8px' }}>
                          {e ? <TrPill status={e.status} percent={e.percent}/>
                             : <span style={{ fontSize: 10.5, color:'#C6C4BB' }}>not enrolled</span>}
                        </td>
                      );
                    })}
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

registerWidget('page-training', PageTraining);
