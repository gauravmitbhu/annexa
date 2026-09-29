// Sites & Offices page: the offices inside the certified scope (SITES),
// the IT operating model per country (SITE_COUNTRIES), and the open nonconformities per office.
// Optional globals: SITE_SCOPE_NOTE (string), SITE_IT_NOTE (string).

const { useState: useSiteState } = React;

const CC_COLOR = {
  GB: { bg: '#EFF6FF', fg: '#1D4ED8', flag: '🇬🇧' },
  IE: { bg: '#ECFDF5', fg: '#047857', flag: '🇮🇪' },
  CA: { bg: '#FEF2F2', fg: '#B91C1C', flag: '🇨🇦' },
};

function STTile({ icon, label, value, sub, color }) {
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

function SiteCard({ s }) {
  const cc = CC_COLOR[s.country] || {};
  return (
    <Card padding={16} hover>
      <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
        <div style={{
          width:42, height:42, borderRadius:8, flexShrink:0,
          background: cc.bg, color: cc.fg,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        }}>
          <span style={{ fontSize:11.5, fontWeight:700, letterSpacing:'-0.01em' }}>{s.id}</span>
        </div>
        <div style={{ minWidth:0, flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:14, fontWeight:600, color:'var(--brand-ink)' }}>{s.name}</span>
            {s.open > 0
              ? <Pill color="#B91C1C" bg="#FEF2F2" size="xs"><strong style={{ fontWeight:600 }}>{s.open} open</strong></Pill>
              : <Pill color="#047857" bg="#ECFDF5" size="xs">clear</Pill>}
          </div>
          <div style={{ fontSize:11, color:'var(--brand-muted)', marginTop:3, display:'flex', gap:12, flexWrap:'wrap' }}>
            <span><Icon name="hard-hat" size={10} style={{ verticalAlign:'middle', marginRight:4 }}/>{s.owner}</span>
            <span><Icon name="server" size={10} style={{ verticalAlign:'middle', marginRight:4 }}/>{s.itOperator}</span>
          </div>
          <div style={{ fontSize:12, color:'#343128', marginTop:8, lineHeight:1.55 }}>{s.notes}</div>
        </div>
      </div>
    </Card>
  );
}

function SitesPage() {
  const [country, setCountry] = useSiteState('all');
  const rows = SITES.filter(s => country === 'all' || s.country === country);
  const totalOpen = SITES.reduce((n, s) => n + s.open, 0);
  const clean = SITES.filter(s => s.open === 0).length;

  return (
    <div style={{ padding:'16px 24px 40px', display:'flex', flexDirection:'column', gap:18, maxWidth:1320 }}>
      <div style={{ padding:'12px 16px', borderRadius:10, background:'color-mix(in srgb, var(--brand-accent) 6%, transparent)', border:'1px solid color-mix(in srgb, var(--brand-accent) 18%, transparent)', fontSize:12.5, color:'#B8410F', lineHeight:1.55, display:'flex', alignItems:'flex-start', gap:10 }}>
        <Icon name="info" size={16} color="var(--brand-accent)" style={{ marginTop:2 }}/>
        <span>
          <strong style={{ fontWeight:600 }}>Offices in the certified scope:</strong> {SITES.map(s => s.id).join(', ')}.{' '}
          {typeof SITE_SCOPE_NOTE !== 'undefined' ? SITE_SCOPE_NOTE : ''}
        </span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <STTile icon="building-2"    label="Offices"  value={SITES.length}  sub={`${SITE_COUNTRIES.length} countries`} color="var(--brand-ink)"/>
        <STTile icon="globe"         label="Countries"   value={SITE_COUNTRIES.length} sub={SITE_COUNTRIES.map(c => c.code).join(' · ')} color="var(--brand-ink)"/>
        <STTile icon="check-circle-2" label="No open items" value={clean}      sub={`of ${SITES.length} offices`} color="#047857"/>
        <STTile icon="file-warning"  label="Site nonconformities" value={totalOpen}   sub="from the latest audit round" color="#B45309"/>
      </div>

      <Card padding={18}>
        <SectionTitle>IT operating model per country</SectionTitle>
        <div style={{ fontSize:12, color:'var(--brand-muted)', marginBottom:14, lineHeight:1.55 }}>
          {typeof SITE_IT_NOTE !== 'undefined' ? SITE_IT_NOTE : 'Who operates IT and owns the office in each country.'}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
          {SITE_COUNTRIES.map(c => {
            const cc = CC_COLOR[c.code] || {};
            return (
              <div key={c.code} style={{ padding:'14px', borderRadius:8, background:'#F7F6F3', border:'1px solid var(--brand-border)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:16 }}>{cc.flag}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:'var(--brand-ink)' }}>{c.label}</span>
                  <span style={{ marginLeft:'auto', fontSize:11, color:'#9A968C' }}>
                    {SITES.filter(s => s.country === c.code).length} offices
                  </span>
                </div>
                <div style={{ fontSize:11.5, color:'var(--brand-accent)', fontWeight:500, marginTop:8 }}>
                  <Icon name="server" size={11} style={{ verticalAlign:'middle', marginRight:5 }}/>{c.itOperator}
                </div>
                <div style={{ fontSize:11.5, color:'#4A473F', marginTop:4 }}>
                  <Icon name="hard-hat" size={11} style={{ verticalAlign:'middle', marginRight:5 }}/>{c.facilityOwner}
                </div>
                <div style={{ fontSize:11.5, color:'var(--brand-muted)', marginTop:8, lineHeight:1.5 }}>{c.note}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{ display:'flex', gap:10, alignItems:'center' }}>
        {['all', ...SITE_COUNTRIES.map(x => x.code)].map(c => (
          <button key={c} onClick={()=>setCountry(c)} style={{
            fontFamily:'Poppins, sans-serif', fontSize:12, padding:'5px 12px', borderRadius:9999, cursor:'pointer',
            border:'1px solid ' + (country === c ? 'var(--brand-accent)' : 'var(--brand-border)'),
            background: country === c ? 'color-mix(in srgb, var(--brand-accent) 8%, transparent)' : '#fff',
            color: country === c ? 'var(--brand-accent)' : '#4A473F', fontWeight: country === c ? 600 : 500,
          }}>{c === 'all' ? 'All offices' : (CC_COLOR[c] || {}).flag + ' ' + c}</button>
        ))}
        <span style={{ marginLeft:'auto', fontSize:11.5, color:'var(--brand-muted)' }}>{rows.length} shown</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {rows.map(s => <SiteCard key={s.id} s={s}/>)}
      </div>

      <Card padding={18}>
        <SectionTitle>Reporting authorities per country</SectionTitle>
        <div style={{ fontSize:12, color:'var(--brand-muted)', marginBottom:12, lineHeight:1.55 }}>
          Recorded per incident in the register, alongside any regulatory notification deadlines that apply (for example the GDPR 72-hour breach notification).
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
          {SITE_AUTHORITIES.map(a => {
            const cc = CC_COLOR[a.country] || {};
            return (
              <div key={a.country}>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--brand-ink)', marginBottom:7 }}>{cc.flag} {a.country}</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {a.bodies.map(b => <Pill key={b} color={cc.fg} bg={cc.bg} size="xs">{b}</Pill>)}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { SitesPage });

registerWidget('page-sites', SitesPage);
