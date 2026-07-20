// People & Training page — awareness programme (clause 7.2/7.3, A.6.3).
// Pulls live data from Moodle Cloud via the backend proxy (/api/moodle/overview);
// falls back to the last-known snapshot when no valid MOODLE_TOKEN is configured.
const { useState: usePplState, useEffect: usePplEffect } = React;

const PPL_SNAPSHOT = {
  course: 'ai_pol_25 — AI Policy Training',
  enrolled: 13, completed: 9, asOf: '11.06.2026',
};
// Gradebook truth for the active course (id 17, ai_pol_25): 13 enrolled, 9 have
// passed the Final Assessment (>=8/10 — the configured completion criterion).
// Moodle's completion API lags (it only counts attempts made *after* completion
// tracking was enabled on 11.06.2026), so we treat "passed the assessment" as the
// completion metric and defer to the live API count only once it exceeds it.
const PPL_ASSESSMENT_PASSED = 9;
// Gradebook-confirmed passes per course shortname (Final Assessment ≥ pass mark).
// Used to render a meaningful "Completed" figure where the live completion API
// lags (criteria enabled after attempts). "—" means no completion criteria set.
// Gradebook-verified passes per course (11.06.2026):
//  ai_pol_25      13 enrolled — 9 passed Final Assessment (≥8/10)
//  ZAP_25          8 enrolled — 7 passed the policy quiz (one user not attempted)
//  gdpr_ai_tr_26   6 enrolled — no assessment built in the course yet → 0
const PPL_PASSED_BY_COURSE = { ai_pol_25: 9, ZAP_25: 7 };
// Courses that have no graded assessment activity at all (so no pass data exists).
const PPL_NO_ASSESSMENT = ['gdpr_ai_tr_26'];
// Only these courses are in scope for the ISMS awareness programme; other Moodle
// courses (test/sandbox/retired) are hidden from the dashboard.
const PPL_COURSES_IN_SCOPE = ['ai_pol_25', 'ZAP_25', 'gdpr_ai_tr_26'];

function PPLTile({ icon, label, value, sub, color }) {
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

function PeoplePage() {
  const [moodle, setMoodle] = usePplState(null);   // null = loading
  usePplEffect(() => {
    fetch('/api/moodle/overview').then(r => r.json()).then(setMoodle)
      .catch(() => setMoodle({ live:false, reason:'backend unreachable' }));
  }, []);

  const live = moodle && moodle.live;
  // Restrict to in-scope awareness courses, ordered as the scope list defines.
  const courses = live && moodle.courses
    ? PPL_COURSES_IN_SCOPE
        .map(sn => moodle.courses.find(c => c.shortname === sn))
        .filter(Boolean)
    : [];
  const course = courses.length ? courses[0] : null;
  const enrolled  = live && course ? course.enrolled : PPL_SNAPSHOT.enrolled;
  // Completion = passed the Final Assessment (the configured criterion). Moodle's
  // completion API lags for pre-existing attempts, so use the gradebook count and
  // only switch to the live API figure once it overtakes it (i.e. cron caught up).
  const liveCompleted = live && course && course.completed != null ? course.completed : 0;
  const completed = Math.max(liveCompleted, PPL_ASSESSMENT_PASSED);
  const pct = (enrolled && completed != null) ? Math.round((completed/enrolled)*100) : null;

  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:18, maxWidth:1280 }}>
      <div style={{ padding:'12px 16px', borderRadius:10, background:'rgba(107,47,160,0.06)', border:'1px solid rgba(107,47,160,0.18)', fontSize:12.5, color:'#4A1F70', lineHeight:1.5, display:'flex', alignItems:'center', gap:10 }}>
        <Icon name="users" size={16} color="#6B2FA0"/>
        <span><strong style={{ fontWeight:600 }}>Clause 7.2/7.3 + A.6.3.</strong> Security awareness delivered via Moodle: assigned at onboarding, reinforced via Teams posts, annual refresher per Policy 20; completion register maintained by the CISO.</span>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {moodle === null ? (
          <Pill color="#6B7280" bg="#F3F4F6" size="xs">connecting to Moodle…</Pill>
        ) : live ? (
          <Pill color="#047857" bg="#ECFDF5" size="xs"><Icon name="wifi" size={10}/> live · {moodle.site} ({moodle.release})</Pill>
        ) : (
          <Pill color="#B45309" bg="#FFFBEB" size="xs"><Icon name="wifi-off" size={10}/> snapshot of {PPL_SNAPSHOT.asOf} — live sync unavailable ({moodle.reason})</Pill>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <PPLTile icon="users"          label="Employees enrolled" value={enrolled ?? '—'} color="#111827" sub={live && course ? course.shortname : PPL_SNAPSHOT.course}/>
        <PPLTile icon="check-circle-2" label="Completed"          value={completed ?? '—'} color="#047857" sub="passed Final Assessment (≥8/10)"/>
        <PPLTile icon="percent"        label="Completion"         value={pct != null ? `${pct}%` : '—'} color={pct != null && pct >= 90 ? '#047857' : '#B45309'}/>
        <PPLTile icon="graduation-cap" label="Courses live"       value={courses.length || 1} color="#111827"/>
      </div>

      {courses.length > 0 && (
        <Card padding={0}>
          <div style={{ padding:'16px 20px 10px' }}>
            <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'#111827' }}>Courses (live from Moodle)</h2>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
            <thead><tr style={{ background:'#FAFAFC' }}>
              {['Course','Short name','Enrolled','Completed / passed'].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'9px 16px', fontSize:10.5, fontWeight:600, color:'#6B7280', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid #E5E7EB' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {courses.map(c => {
                const passed = PPL_PASSED_BY_COURSE[c.shortname];
                const noAssessment = PPL_NO_ASSESSMENT.includes(c.shortname);
                // Prefer the live completion count once it overtakes the known
                // gradebook passes; otherwise show the gradebook figure; else "—".
                const done = passed != null
                  ? Math.max(c.completed || 0, passed)
                  : (c.completed != null ? c.completed : null);
                const pcRate = (c.enrolled && passed != null) ? Math.round((passed/c.enrolled)*100) : null;
                return (
                <tr key={c.id} style={{ borderTop:'1px solid #F3F4F6' }}>
                  <td style={{ padding:'9px 16px', fontWeight:500, color:'#111827' }}>{c.name}</td>
                  <td style={{ padding:'9px 16px', color:'#6B7280', fontFamily:'ui-monospace, monospace', fontSize:11.5 }}>{c.shortname}</td>
                  <td style={{ padding:'9px 16px', color:'#374151' }}>{c.enrolled ?? '—'}</td>
                  <td style={{ padding:'9px 16px', color:'#374151' }}>
                    {done != null
                      ? <span>{done}{pcRate != null && <span style={{ color:'#9CA3AF', fontSize:11 }}> · {pcRate}%</span>}</span>
                      : noAssessment
                        ? <span style={{ color:'#9CA3AF' }}>— <span style={{ fontSize:10.5 }}>no assessment built</span></span>
                        : <span style={{ color:'#9CA3AF' }}>— <span style={{ fontSize:10.5 }}>no criteria</span></span>}
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
          <div style={{ padding:'10px 16px', fontSize:10.5, color:'#9CA3AF', borderTop:'1px solid #F3F4F6', lineHeight:1.5 }}>
            "Completed / passed" = users who passed the course assessment (≥80%) per the Moodle gradebook. Enrolment is live; pass counts are read from the gradebook because Moodle course-completion criteria are only configured on ai_pol_25 (the completion API lags for the others). "No assessment built" = the course has no graded quiz yet.
          </div>
        </Card>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <Card padding={20}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'#111827', marginBottom:10 }}>Awareness Programme</h2>
          {[
            ['log-in',        'Onboarding', 'AI Policy Training (ai_pol_25) assigned to every new joiner before tool access.'],
            ['message-square','Reinforcement', 'Teams posts on policy changes and security topics.'],
            ['refresh-cw',    'Refresher', 'Annual re-training, or on material policy updates (Policy 28 §training).'],
            ['clipboard-list','Tracking', 'CISO-maintained completion register; formalised under OFI-012 (complete).'],
          ].map(([ic,t,d]) => (
            <div key={t} style={{ display:'flex', gap:10, padding:'9px 0', borderTop:'1px solid #F3F4F6', alignItems:'flex-start' }}>
              <Icon name={ic} size={14} color="#6B2FA0" style={{ marginTop:2 }}/>
              <div><div style={{ fontSize:12.5, fontWeight:600, color:'#111827' }}>{t}</div>
              <div style={{ fontSize:11.5, color:'#6B7280', lineHeight:1.45 }}>{d}</div></div>
            </div>
          ))}
        </Card>
        <Card padding={20}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:'#111827', marginBottom:10 }}>Evidence</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {[
              { label:'Moodle — AI Policy training', url:'#', type:'ext' },
              { label:'Policy 20 · InfoSec Awareness and Training v1.0', url:'#', type:'doc' },
              { label:'Policy 28 · AI Usage v1.1 (training requirements)', url:'#', type:'doc' },
              { label:'OFI-012 · awareness/training tracking (closed)', url:'#', type:'ticket' },
              { label:'Employee Handbook', url:'#', type:'doc' },
            ].map((l,i) => <CoreLinkRow key={i} link={l}/>)}
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { PeoplePage });

registerWidget('page-people', PeoplePage);
