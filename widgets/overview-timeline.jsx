// Overview · Row 5: the certification and remediation timeline.
//
// Reads CERT_TIMELINE when present:
//   { year: 2026, subtitle?: string, note?: string,
//     milestones: [ { date: 'YYYY-MM-DD', label, dateLabel?: string,
//                     state: 'done'|'milestone'|'next'|'certified'|'future',
//                     side: 'above'|'below', row?: 0|1 } ] }
// Without it the track is drawn with no milestones.
//
// Layout: labels live inside fixed-height lanes above and below the track and
// are aligned against it, so a label can grow to two lines without escaping;
// and every x (milestones, today, month names) comes from one function,
// day-of-year / 365.

const TL_TOP = 100;   // height of the lane above the track
const TL_BOT = 96;    // height of the lane below it
const TL_TRACK = 8;
const TL_ROW = 44;    // how far a row-1 label sits back from the track

const TL_DATA = (typeof CERT_TIMELINE !== 'undefined' && CERT_TIMELINE) ? CERT_TIMELINE : {};
const TL_YEAR = TL_DATA.year || new Date().getFullYear();

const _tlPct = (m, d) => {
  const day = (Date.UTC(TL_YEAR, m, d) - Date.UTC(TL_YEAR, 0, 1)) / 86400000;
  return Math.max(0, Math.min(1, day / 365));
};

const _tlFmt = iso => {
  const d = new Date(iso + 'T00:00:00Z');
  return isNaN(d) ? String(iso || '') : d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric', timeZone:'UTC' });
};

// `row` keeps neighbouring labels apart: row 1 sits a line further back from the
// track than row 0.
const TL_MILESTONES = (TL_DATA.milestones || []).map(m => {
  const d = new Date(m.date + 'T00:00:00Z');
  return {
    at: isNaN(d) ? 0 : _tlPct(d.getUTCMonth(), d.getUTCDate()),
    label: m.label, date: m.dateLabel || _tlFmt(m.date),
    state: m.state || 'future', side: m.side || 'above', row: m.row || 0,
  };
});

// A label near either end would hang off the card if it stayed centred on its
// dot, so the outer ones anchor to the edge instead of to the middle.
function tlAnchor(pct) {
  if (pct < 0.05) return { left: 0, transform: 'none', textAlign: 'left' };
  if (pct > 0.95) return { right: 0, left: 'auto', transform: 'none', textAlign: 'right' };
  return { left: '50%', transform: 'translateX(-50%)', textAlign: 'center' };
}

function TlMilestone({ m }) {
  const isMilestone = m.state === 'milestone';
  const isCert = m.state === 'certified';
  const isNext = m.state === 'next';
  const above = m.side === 'above';
  const back = (m.row || 0) * TL_ROW;   // extra distance from the track
  const dot = isCert ? 18 : isMilestone ? 16 : isNext ? 14 : 12;
  const anchor = tlAnchor(m.at);

  const colour = m.state === 'done' ? '#10B981'
               : isCert ? '#047857'
               : isMilestone ? 'var(--brand-accent)'
               : isNext ? '#F59E0B'
               : '#C6C4BB';

  return (
    <div style={{ position:'absolute', left:`${m.at*100}%`, top:0, bottom:0, width:0 }}>
      {/* dot, centred on the track */}
      <div style={{
        position:'absolute', left:'50%', top: TL_TOP + TL_TRACK/2 - dot/2,
        transform:'translateX(-50%)', zIndex: 3,
        width: dot, height: dot, borderRadius: 9999, background: colour,
        border:'3px solid #fff',
        boxShadow: isCert ? '0 0 0 4px rgba(4,120,87,0.20)'
                 : isMilestone ? '0 0 0 3px color-mix(in srgb, var(--brand-accent-2) 25%, transparent)'
                 : isNext ? '0 0 0 3px rgba(245,158,11,0.25)'
                 : '0 0 0 1px var(--brand-border)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        {(m.state === 'done' || isCert) &&
          <span style={{ color:'#fff', fontSize: isCert ? 10 : 8, fontWeight: 700 }}>✓</span>}
      </div>

      {/* hairline from the label to the dot, so a stacked label stays readable */}
      <div style={{
        position:'absolute', left:'50%', transform:'translateX(-50%)', width: 1,
        background:'#E4E2DC',
        ...(above ? { top: TL_TOP - 12 - back, height: 12 + back }
                  : { top: TL_TOP + TL_TRACK, height: 12 + back }),
      }}/>

      {/* Label. It sits inside a fixed-height lane and is aligned against the
          track, so a second line grows away from the track rather than out of
          the card. */}
      <div style={{
        position:'absolute', width: 132, ...anchor,
        display:'flex', flexDirection:'column',
        justifyContent: above ? 'flex-end' : 'flex-start',
        ...(above ? { top: 0, height: TL_TOP - 14 - back }
                  : { top: TL_TOP + TL_TRACK + 14 + back, height: TL_BOT - 14 - back }),
        fontSize: 10.5, lineHeight: 1.25,
        fontWeight: (isMilestone || isNext || isCert) ? 600 : 500,
        color: isCert ? '#047857' : isMilestone ? 'var(--brand-accent)' : isNext ? '#B45309'
             : m.state === 'future' ? '#9A968C' : '#343128',
      }}>
        <div>{m.label}</div>
        <div style={{ fontSize: 9.5, color:'#9A968C', marginTop: 1, fontWeight: 500 }}>{m.date}</div>
      </div>
    </div>
  );
}

function AuditTimeline() {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();
  const todayPct = now.getFullYear() < TL_YEAR ? 0 : now.getFullYear() > TL_YEAR ? 1 : _tlPct(now.getMonth(), now.getDate());
  const todayLabel = `Today · ${now.toLocaleString('en', { month:'short' })} ${now.getDate()}`;
  const H = TL_TOP + TL_TRACK + TL_BOT;

  return (
    <Card padding={20}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between',
                    gap: 12, flexWrap:'wrap', marginBottom: 6 }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color:'var(--brand-ink)' }}>Certification &amp; remediation timeline</h2>
        <div style={{ fontSize: 11.5, color:'var(--brand-muted)' }}>{TL_DATA.subtitle || TL_YEAR}</div>
      </div>

      <div style={{ position:'relative', height: H, overflow:'hidden' }}>
        {/* the track */}
        <div style={{ position:'absolute', left:0, right:0, top: TL_TOP, height: TL_TRACK,
                      background:'var(--brand-surface)', borderRadius: 9999 }}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:`${todayPct*100}%`,
                        background:'color-mix(in srgb, var(--brand-accent) 30%, transparent)', borderRadius: 9999 }}/>
        </div>

        {/* Today marker. The badge rides at the top of the upper lane rather
            than on the track: on the track it sat over the Sep milestone dot
            and hid it. Labels in that lane are bottom-aligned, so the top of it
            is free space. The line runs from the badge down to just past the
            track and stops, instead of cutting through the lower labels. */}
        <div style={{ position:'absolute', left:`${todayPct*100}%`, top: 16,
                      height: TL_TOP + TL_TRACK + 6 - 16,
                      width: 2, background:'var(--brand-accent)', opacity: 0.5, zIndex: 1 }}/>
        <div style={{
          position:'absolute', left:`${todayPct*100}%`, top: 0,
          transform:'translateX(-50%)', zIndex: 4,
          background:'var(--brand-accent)', color:'#fff', fontSize: 9.5, fontWeight: 600,
          padding:'3px 7px', borderRadius: 9999, whiteSpace:'nowrap',
        }}>{todayLabel}</div>

        {TL_MILESTONES.map((m, i) => <TlMilestone key={i} m={m}/>)}
      </div>

      {/* Month names are centred on their month — (i + 0.5)/12 — using the same
          axis as the dots, so the two line up. */}
      <div style={{ position:'relative', height: 22, marginTop: 6, paddingTop: 8,
                    borderTop:'1px dashed var(--brand-border)' }}>
        {months.map((mo, i) => (
          <div key={mo} style={{
            position:'absolute', left:`${((i + 0.5) / 12) * 100}%`, top: 8,
            transform:'translateX(-50%)',
            fontSize: 10, color:'#9A968C', fontWeight: 500,
          }}>{mo}</div>
        ))}
      </div>

      {TL_DATA.note && (
        <div style={{ marginTop: 14, padding:'10px 12px', borderRadius: 8,
                      background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.25)',
                      fontSize: 11.5, color:'#7C2D12', lineHeight: 1.5 }}>
          <Icon name="calendar-clock" size={12} style={{ verticalAlign:'middle', marginRight: 5 }}/>
          {TL_DATA.note}
        </div>
      )}
    </Card>
  );
}

function OverviewTimeline() {
  return (
    <div style={{ maxWidth: 1320, padding:'18px 24px 0' }}>
      <AuditTimeline/>
    </div>
  );
}

registerWidget('overview-timeline', OverviewTimeline);
