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
        border: `1px solid ${h ? 'rgba(107,47,160,0.3)' : '#E5E7EB'}`,
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

function Pill({ children, color = '#6B7280', bg = '#F3F4F6', size = 'sm', style }) {
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
  const palette = ['#6B2FA0','#E91E63','#7c09b3','#8B5FBF','#FF5C8D','#4A1F70'];
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
        margin: 0, fontSize: 13, fontWeight: 600, color: '#374151',
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
    primary: { background: h?'#5A2589':'#6B2FA0', color:'#fff', borderColor:'#6B2FA0' },
    accent:  { background: h?'#D11657':'#E91E63', color:'#fff', borderColor:'#E91E63' },
    outline: { background: h?'#F9FAFB':'#fff', color:'#374151', borderColor:'#E5E7EB' },
    ghost:   { background: h?'#F3F4F6':'transparent', color:'#4B5563', borderColor:'transparent' },
    dashed:  { background:'#fff', color:'#6B2FA0', border:'1px dashed #6B2FA0' },
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

function CountdownChip() {
  // Audit Day 1: 16 June 2026 (re-certification, CertCo)
  const days = Math.max(0, Math.ceil((new Date('2026-06-16') - new Date()) / 86400000));
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap: 8,
      background: 'linear-gradient(90deg, rgba(107,47,160,0.08), rgba(233,30,99,0.08))',
      border: '1px solid rgba(107,47,160,0.2)',
      padding: '5px 11px', borderRadius: 9999,
      fontSize: 12, color:'#4A1F70', fontWeight: 500,
    }}>
      <Icon name="calendar-clock" size={13} color="#6B2FA0" />
      <span><strong style={{ fontWeight: 600 }}>Re-certification Audit · 16–17 June 2026</strong> · T-minus {days} {days === 1 ? 'day' : 'days'}</span>
    </div>
  );
}

Object.assign(window, { Icon, Card, Pill, StatusDot, Avatar, SectionTitle, Button, CountdownChip });
