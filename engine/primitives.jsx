// Shared primitives — Icon, Button, Pill, Card, etc.
const { useState, useEffect, useRef, useMemo } = React;

function Icon({ name, size = 18, color, strokeWidth = 2, style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '';
      const i = document.createElement('i');
      i.setAttribute('data-lucide', name);
      ref.current.appendChild(i);
      window.lucide.createIcons({ attrs: { width: size, height: size, 'stroke-width': strokeWidth } });
    }
  }, [name, size, strokeWidth]);
  return <span ref={ref} style={{ display: 'inline-flex', color, lineHeight: 0, ...style }} />;
}

function Card({ children, padding = 20, style, hover }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => hover && setH(false)}
      style={{
        background: '#fff',
        border: `1px solid ${h ? 'color-mix(in srgb, var(--brand-accent) 30%, transparent)' : 'var(--brand-border)'}`,
        borderRadius: 8,
        padding,
        boxShadow: h ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
        transition: 'all 150ms',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ children, color = 'var(--brand-muted)', bg = 'var(--brand-surface)', size = 'sm', style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: size === 'xs' ? '2px 7px' : '3px 9px',
      borderRadius: 9999,
      fontSize: size === 'xs' ? 10.5 : 11,
      fontWeight: 500,
      color, background: bg,
      whiteSpace: 'nowrap',
      ...style,
    }}>{children}</span>
  );
}

function StatusDot({ status, size = 8 }) {
  return <span style={{
    display: 'inline-block', width: size, height: size,
    borderRadius: 9999, background: STATUS_COLOR[status].bg,
  }}/>;
}

function Avatar({ name, size = 24, bg }) {
  const initials = name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();
  // hash name → hue for diversity, anchored on the brand palette
  const palette = ['var(--brand-accent)','var(--brand-accent)','var(--brand-accent-dark)','var(--brand-accent-2)','var(--brand-accent-2)','var(--brand-accent-dark)'];
  const idx = name.split('').reduce((a,c) => a + c.charCodeAt(0), 0) % palette.length;
  return (
    <div style={{
      width: size, height: size, borderRadius: 9999,
      background: bg || palette[idx], color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size <= 24 ? 10 : 11, fontWeight: 600,
      flexShrink: 0,
      letterSpacing: '0.02em',
    }}>{initials}</div>
  );
}

function SectionTitle({ children, right, style }) {
  return (
    <div style={{
      display:'flex', alignItems:'baseline', justifyContent:'space-between',
      marginBottom: 12, ...style,
    }}>
      <h2 style={{
        margin: 0, fontSize: 13, fontWeight: 600, color: '#343128',
        letterSpacing: '0.02em', textTransform: 'uppercase',
      }}>{children}</h2>
      {right}
    </div>
  );
}

function Button({ variant='primary', size='md', children, onClick, icon, iconRight, style }) {
  const [h, setH] = useState(false);
  const base = {
    fontFamily:'Poppins, sans-serif', fontWeight: 500,
    borderRadius: 6, cursor:'pointer',
    display:'inline-flex', alignItems:'center', gap: 7,
    padding: size==='sm' ? '5px 10px' : size==='lg' ? '10px 18px' : '7px 14px',
    fontSize: size==='sm' ? 12 : 13,
    transition: 'all 150ms', border: '1px solid transparent',
    lineHeight: 1.4,
  };
  const variants = {
    primary: { background: h?'var(--brand-accent-dark)':'var(--brand-accent)', color:'var(--brand-on-accent)', borderColor:'var(--brand-accent)' },
    accent:  { background: h?'var(--brand-accent-dark)':'var(--brand-accent)', color:'var(--brand-on-accent)', borderColor:'var(--brand-accent)' },
    outline: { background: h?'#F7F6F3':'#fff', color:'#343128', borderColor:'var(--brand-border)' },
    ghost:   { background: h?'var(--brand-surface)':'transparent', color:'#4A473F', borderColor:'transparent' },
    dashed:  { background:'#fff', color:'var(--brand-accent)', border:'1px dashed var(--brand-accent)' },
  };
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ ...base, ...variants[variant], ...style }}>
      {icon && <Icon name={icon} size={size==='sm'?13:14} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size==='sm'?13:14} />}
    </button>
  );
}

// Next-milestone chip. Reads SITE.milestone ({label, date, detail}) so the
// header follows the site spec rather than a date baked into the engine.
function CountdownChip() {
  const m = (window.SITE && window.SITE.milestone) || {};
  if (!m.date) return null;
  const days = Math.max(0, Math.ceil((new Date(m.date) - new Date()) / 86400000));
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap: 8,
      background: 'linear-gradient(90deg, color-mix(in srgb, var(--brand-accent) 8%, transparent), color-mix(in srgb, var(--brand-accent-2) 8%, transparent))',
      border: '1px solid color-mix(in srgb, var(--brand-accent) 20%, transparent)',
      padding: '5px 11px', borderRadius: 9999,
      fontSize: 12, color:'var(--brand-accent-dark)', fontWeight: 500,
      // Long milestone detail must ellipsise, or the chip wraps and covers the title.
      whiteSpace:'nowrap', maxWidth: 560, minWidth: 0, flexShrink: 1, overflow:'hidden',
    }}>
      <Icon name="calendar-clock" size={13} color="var(--brand-accent)" style={{ flexShrink: 0 }} />
      <span style={{ overflow:'hidden', textOverflow:'ellipsis' }}>
        <strong style={{ fontWeight: 600 }}>{m.label || 'Next milestone'} · {m.date}</strong>
        {m.detail ? ` · ${m.detail}` : ''} · T-minus {days} {days === 1 ? 'day' : 'days'}
      </span>
    </div>
  );
}

Object.assign(window, { Icon, Card, Pill, StatusDot, Avatar, SectionTitle, Button, CountdownChip });
