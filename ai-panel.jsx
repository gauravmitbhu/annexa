// AI co-pilot side panel — "Ask Claude" with example thread + composer
const { useState: useAIState, useEffect: useAIEffect, useRef: useAIRef } = React;

const AI_MODELS = [
  { id: 'claude-fable-5',             label: 'Fable 5',    badge: 'Latest' },
  { id: 'claude-opus-4-8',            label: 'Opus 4.8',   badge: 'Powerful' },
  { id: 'claude-sonnet-4-6',          label: 'Sonnet 4.6', badge: 'Fast' },
  { id: 'claude-haiku-4-5-20251001',  label: 'Haiku 4.5',  badge: 'Compact' },
];

function ModelSelector({ value, onChange }) {
  const [open, setOpen] = useAIState(false);
  const current = AI_MODELS.find(m => m.id === value) || AI_MODELS[0];
  return (
    <div style={{ position:'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display:'inline-flex', alignItems:'center', gap: 5,
          padding:'3px 8px 3px 7px', borderRadius: 6,
          border:'1px solid rgba(107,47,160,0.25)',
          background: open ? 'rgba(107,47,160,0.1)' : 'rgba(107,47,160,0.05)',
          color:'#6B2FA0', fontSize: 11, fontWeight: 600,
          fontFamily:'Poppins, sans-serif', cursor:'pointer',
          transition:'all 120ms',
        }}>
        <Icon name="cpu" size={10} color="#6B2FA0"/>
        {current.label}
        <Icon name="chevron-down" size={9} color="#6B2FA0"/>
      </button>
      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 4px)', right: 0, zIndex: 200,
          background:'#fff', border:'1px solid #E5E7EB', borderRadius: 8,
          boxShadow:'0 4px 16px rgba(0,0,0,0.1)', minWidth: 192, overflow:'hidden',
        }}>
          {AI_MODELS.map(m => {
            const active = m.id === value;
            return (
              <button key={m.id}
                onClick={() => { onChange(m.id); setOpen(false); }}
                style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  width:'100%', padding:'8px 12px', border:'none', textAlign:'left',
                  background: active ? 'rgba(107,47,160,0.07)' : '#fff',
                  fontFamily:'Poppins, sans-serif', cursor:'pointer',
                  borderBottom:'1px solid #F3F4F6',
                }}
                onMouseEnter={e=>e.currentTarget.style.background='#FAFAFC'}
                onMouseLeave={e=>e.currentTarget.style.background=active?'rgba(107,47,160,0.07)':'#fff'}>
                <span style={{ fontSize: 12.5, color: active?'#6B2FA0':'#111827', fontWeight: active?600:400 }}>
                  {m.label}
                </span>
                <span style={{
                  fontSize: 10, padding:'1px 6px', borderRadius: 9999, fontWeight: 500,
                  background: active ? 'rgba(107,47,160,0.12)' : '#F3F4F6',
                  color: active ? '#6B2FA0' : '#6B7280',
                }}>{m.badge}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---- live chat helpers ----------------------------------------------------
function newThreadId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  // RFC4122-ish fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// Parse an SSE chunk into discrete `data: {...}` JSON events. Buffers across
// network chunks because a single event can be split mid-line.
function makeSSEParser(onEvent) {
  let buf = '';
  return function feed(chunk) {
    buf += chunk;
    let nl;
    while ((nl = buf.indexOf('\n\n')) !== -1) {
      const block = buf.slice(0, nl);
      buf = buf.slice(nl + 2);
      for (const line of block.split('\n')) {
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (!payload) continue;
        try { onEvent(JSON.parse(payload)); }
        catch (e) { /* ignore malformed */ }
      }
    }
  };
}

function Citation({ source, refLabel: r }) {
  const [h, setH] = useAIState(false);
  return (
    <span
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:'inline-flex', alignItems:'center', gap: 4,
        padding:'2px 7px 2px 6px', borderRadius: 9999,
        fontSize: 10.5, fontWeight: 500,
        background: h ? 'rgba(107,47,160,0.1)' : '#F3F4F6',
        color: h ? '#4A1F70' : '#4B5563',
        border: `1px solid ${h ? 'rgba(107,47,160,0.25)' : '#E5E7EB'}`,
        cursor:'pointer', transition:'all 150ms',
        marginRight: 4, marginTop: 4,
      }}>
      <Icon name="paperclip" size={10} />
      <strong style={{ fontWeight: 600 }}>{source}</strong>
      <span style={{ color:'#9CA3AF' }}>·</span>{r}
    </span>
  );
}

// ── Lightweight markdown renderer for Claude responses ──────────────────────
// No external lib (Babel-standalone single scope). Handles headings, bold,
// italic, inline code and bullet/numbered lists — enough for ISMS answers.
const MD_CODE_STYLE = {
  fontFamily:'ui-monospace, SFMono-Regular, monospace', fontSize: 11.5,
  background:'#F3F4F6', borderRadius: 4, padding:'1px 4px', color:'#6B2FA0',
};

function mdInline(str, kp) {
  const out = [];
  const re = /\*\*(.+?)\*\*|`(.+?)`|\*(.+?)\*|_(.+?)_/g;
  let last = 0, m, i = 0;
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) out.push(str.slice(last, m.index));
    if (m[1] != null)      out.push(<strong key={kp+'b'+i} style={{ fontWeight: 600, color:'#111827' }}>{m[1]}</strong>);
    else if (m[2] != null) out.push(<code key={kp+'c'+i} style={MD_CODE_STYLE}>{m[2]}</code>);
    else if (m[3] != null) out.push(<em key={kp+'i'+i}>{m[3]}</em>);
    else if (m[4] != null) out.push(<em key={kp+'u'+i}>{m[4]}</em>);
    last = m.index + m[0].length; i++;
  }
  if (last < str.length) out.push(str.slice(last));
  return out;
}

function Markdown({ text }) {
  const lines = (text || '').split('\n');
  const blocks = [];
  let para = [], list = null;
  const flushPara = () => { if (para.length) { blocks.push({ t:'p', c: para.join(' ') }); para = []; } };
  const flushList = () => { if (list) { blocks.push(list); list = null; } };
  lines.forEach(raw => {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) { flushPara(); flushList(); return; }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    const b = line.match(/^\s*[-*]\s+(.*)$/);
    const n = line.match(/^\s*(\d+)\.\s+(.*)$/);
    if (h)      { flushPara(); flushList(); blocks.push({ t:'h', lvl: h[1].length, c: h[2] }); }
    else if (b) { flushPara(); if (!list || list.t!=='ul') { flushList(); list = { t:'ul', items:[] }; } list.items.push(b[1]); }
    else if (n) { flushPara(); if (!list || list.t!=='ol') { flushList(); list = { t:'ol', items:[] }; } list.items.push(n[2]); }
    else        { flushList(); para.push(line.trim()); }
  });
  flushPara(); flushList();

  return (
    <div style={{ fontSize: 13, lineHeight: 1.55, color:'#1F2937' }}>
      {blocks.map((blk, i) => {
        if (blk.t === 'h') {
          const size = blk.lvl <= 1 ? 15 : blk.lvl === 2 ? 13.5 : 12.5;
          return (
            <div key={i} style={{ fontSize: size, fontWeight: 600, color:'#111827',
              margin: i===0 ? '0 0 6px' : '12px 0 6px' }}>
              {mdInline(blk.c, 'h'+i)}
            </div>
          );
        }
        if (blk.t === 'ul' || blk.t === 'ol') {
          const Tag = blk.t === 'ol' ? 'ol' : 'ul';
          return (
            <Tag key={i} style={{ margin:'6px 0', paddingLeft: 20, display:'flex', flexDirection:'column', gap: 3 }}>
              {blk.items.map((it, j) => <li key={j} style={{ lineHeight: 1.5 }}>{mdInline(it, 'l'+i+'-'+j)}</li>)}
            </Tag>
          );
        }
        return <p key={i} style={{ margin: i===0 ? '0 0 8px' : '8px 0' }}>{mdInline(blk.c, 'p'+i)}</p>;
      })}
    </div>
  );
}

function UserMsg({ children }) {
  return (
    <div style={{ display:'flex', justifyContent:'flex-end', marginBottom: 14 }}>
      <div style={{
        background: 'rgba(107,47,160,0.1)',
        color: '#3B1A6B',
        padding: '9px 13px',
        borderRadius: '14px 14px 4px 14px',
        fontSize: 13, lineHeight: 1.5, maxWidth: '85%',
        border: '1px solid rgba(107,47,160,0.18)',
      }}>{children}</div>
    </div>
  );
}

function ClaudeMsg({ children, citations, actions }) {
  return (
    <div style={{ display:'flex', gap: 8, marginBottom: 16, alignItems:'flex-start' }}>
      <div style={{
        width: 24, height: 24, borderRadius: 6,
        background:'linear-gradient(135deg,#6B2FA0,#E91E63)',
        display:'flex', alignItems:'center', justifyContent:'center',
        flexShrink: 0, marginTop: 2,
      }}>
        <Icon name="sparkles" size={13} color="#fff" />
      </div>
      <div style={{
        flex: 1, minWidth: 0,
        background: '#fff', border:'1px solid #E5E7EB',
        padding: '10px 13px', borderRadius:'14px 14px 14px 4px',
        fontSize: 13, lineHeight: 1.55, color:'#1F2937',
      }}>
        {children}
        {citations && (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #E5E7EB', display:'flex', flexWrap:'wrap' }}>
            {citations.map((c,i) => <Citation key={i} source={c.source} refLabel={c.ref} />)}
          </div>
        )}
        {actions && (
          <div style={{ marginTop: 10, display:'flex', gap: 8, flexWrap:'wrap' }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

function StreamingDots() {
  return (
    <div style={{ display:'flex', gap: 8, marginBottom: 16, alignItems:'center' }}>
      <div style={{
        width: 24, height: 24, borderRadius: 6,
        background:'linear-gradient(135deg,#6B2FA0,#E91E63)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon name="sparkles" size={13} color="#fff" />
      </div>
      <div style={{
        background:'#fff', border:'1px solid #E5E7EB',
        padding:'10px 14px', borderRadius:'14px 14px 14px 4px',
      }}>
        <span className="dot"/><span className="dot"/><span className="dot"/>
      </div>
    </div>
  );
}

function GhostPrompt({ children, onClick }) {
  const [h, setH] = useAIState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:'block', width:'100%', textAlign:'left',
        padding:'9px 12px', borderRadius: 8,
        background: h ? 'rgba(107,47,160,0.08)' : '#fff',
        border:`1px dashed ${h ? '#6B2FA0' : '#D1D5DB'}`,
        color:'#4A1F70', fontSize: 12.5, fontWeight: 500,
        fontFamily:'Poppins, sans-serif',
        cursor:'pointer', transition:'all 150ms',
        marginBottom: 6,
      }}>
      <Icon name="sparkles" size={11} style={{ marginRight: 6, verticalAlign:'middle' }}/>
      {children}
    </button>
  );
}

function SlashChip({ children, onClick }) {
  const [h, setH] = useAIState(false);
  return (
    <span
      onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        padding:'4px 9px', borderRadius: 6,
        background: h ? '#F3E8FF' : '#F9FAFB',
        border:`1px solid ${h ? 'rgba(107,47,160,0.3)' : '#E5E7EB'}`,
        fontSize: 11, color:'#6B2FA0', fontWeight: 500,
        whiteSpace:'nowrap', cursor:'pointer',
        fontFamily:'ui-monospace, SFMono-Regular, monospace',
        transition:'all 120ms', flexShrink: 0,
      }}>{children}</span>
  );
}

const SUGGESTION_TILES = [
  { icon:'shield-check', text:'Prep me for the CertCo June audit' },
  { icon:'file-check',   text:'Which policies need approval before May?' },
  { icon:'user-cog',     text:'Show me all owner-changes since Jan 2026' },
  { icon:'file-warning', text:'Draft an exception request for [control]' },
  { icon:'alert-octagon',text:'What\u2019s our highest unmitigated risk?' },
  { icon:'clipboard-list',text:'Generate the management review pack' },
];

function EmptyThread({ onPick }) {
  return (
    <div style={{ padding: '20px 16px' }}>
      <div style={{
        textAlign:'center', marginBottom: 18,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background:'linear-gradient(135deg,#6B2FA0,#E91E63)',
          display:'inline-flex', alignItems:'center', justifyContent:'center',
          marginBottom: 10,
        }} className="sparkle-pulse">
          <Icon name="sparkles" size={22} color="#fff" />
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color:'#111827' }}>How can I help?</div>
        <div style={{ fontSize: 12, color:'#6B7280', marginTop: 4 }}>
          Read-only across ticketing, documents, GitLab, Elastic, MDM, LMS.
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8 }}>
        {SUGGESTION_TILES.map((t,i) => (
          <button key={i} onClick={()=>onPick && onPick(t.text)}
            style={{
              padding: 11, borderRadius: 8,
              background:'#fff', border:'1px solid #E5E7EB',
              fontFamily:'Poppins, sans-serif',
              fontSize: 11.5, fontWeight: 500, color:'#374151',
              textAlign:'left', cursor:'pointer',
              transition:'all 150ms',
              display:'flex', flexDirection:'column', gap: 6, alignItems:'flex-start',
            }}
            onMouseEnter={(e)=>{ e.currentTarget.style.borderColor='rgba(107,47,160,0.3)'; e.currentTarget.style.background='#FAFAFC'; }}
            onMouseLeave={(e)=>{ e.currentTarget.style.borderColor='#E5E7EB'; e.currentTarget.style.background='#fff'; }}>
            <Icon name={t.icon} size={14} color="#6B2FA0" />
            <span style={{ lineHeight: 1.35 }}>{t.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CollapsedAI({ onOpen }) {
  return (
    <div style={{
      width: 48, background:'#fff', borderLeft:'1px solid #E5E7EB',
      display:'flex', flexDirection:'column', alignItems:'center',
      padding:'14px 0', flexShrink: 0,
    }}>
      <button onClick={onOpen}
        title="Ask Claude"
        style={{
          width: 36, height: 36, borderRadius: 8,
          background:'linear-gradient(135deg,#6B2FA0,#E91E63)',
          border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          position:'relative',
        }}>
        <Icon name="sparkles" size={18} color="#fff" />
        <span style={{
          position:'absolute', bottom:-2, right:-2,
          width: 10, height: 10, borderRadius: 9999,
          background:'#10B981', border:'2px solid #fff',
        }}/>
      </button>
      <div style={{
        writingMode:'vertical-rl', transform:'rotate(180deg)',
        marginTop: 16, fontSize: 11, color:'#6B7280', fontWeight: 500,
        letterSpacing:'0.05em',
      }}>indexed · ready</div>
    </div>
  );
}

function AIPanel({ context, contextDetail, mode, onCollapse, drawerOpen, controlId }) {
  // mode: 'thread' | 'empty' — used only when there's no live conversation yet
  const [text, setText] = useAIState('');
  const [model, setModel] = useAIState('claude-opus-4-8');
  const [messages, setMessages] = useAIState([]); // [{role:'user'|'assistant', text, citations?}]
  const [streaming, setStreaming] = useAIState(false);
  const [error, setError] = useAIState(null);
  const [pinnedItem, setPinnedItem] = useAIState(null); // item clicked elsewhere in the dashboard
  const threadIdRef = useAIRef(newThreadId());
  const abortRef = useAIRef(null);
  const bodyRef = useAIRef(null);

  // Auto-scroll to the bottom whenever the live thread grows or streams.
  useAIEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

  // Bridge: other parts of the dashboard dispatch 'askclaude:item' to load an
  // item here (with quick-action buttons) without firing a request.
  useAIEffect(() => {
    const handler = (e) => {
      const it = e.detail || {};
      setPinnedItem(it);
      if (it.prompt) setText(it.prompt);
    };
    window.addEventListener('askclaude:item', handler);
    return () => window.removeEventListener('askclaude:item', handler);
  }, []);

  const send = async (rawText) => {
    const msg = (rawText ?? text).trim();
    if (!msg || streaming) return;
    setError(null);
    setText('');
    setMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: '' }]);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const onEvent = (evt) => {
      if (evt.type === 'delta') {
        setMessages(prev => {
          const next = prev.slice();
          const last = next[next.length - 1];
          if (last && last.role === 'assistant') {
            next[next.length - 1] = { ...last, text: last.text + evt.text };
          }
          return next;
        });
      } else if (evt.type === 'tool') {
        setMessages(prev => {
          const next = prev.slice();
          const last = next[next.length - 1];
          if (last && last.role === 'assistant') {
            const tools = (last.tools || []).concat([{ name: evt.name, input: evt.input }]);
            next[next.length - 1] = { ...last, tools };
          }
          return next;
        });
      } else if (evt.type === 'error') {
        setError(evt.message || 'unknown error');
      }
    };
    const feed = makeSSEParser(onEvent);

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId: threadIdRef.current, message: msg, model }),
        signal: controller.signal,
      });
      if (!resp.ok || !resp.body) throw new Error(`HTTP ${resp.status}`);
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        feed(decoder.decode(value, { stream: true }));
      }
    } catch (e) {
      if (e.name !== 'AbortError') setError(String(e.message || e));
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const stopStreaming = () => {
    if (abortRef.current) abortRef.current.abort();
  };

  const newThread = () => {
    if (streaming) stopStreaming();
    setMessages([]);
    setError(null);
    threadIdRef.current = newThreadId();
  };

  const live = messages.length > 0;

  return (
    <aside style={{
      width: 380, background:'#FAFAFC',
      borderLeft:'1px solid #E5E7EB',
      display:'flex', flexDirection:'column',
      flexShrink: 0,
    }}>
      {/* Header w/ subtle gradient */}
      <div style={{
        padding:'14px 16px 12px',
        borderBottom:'1px solid #E5E7EB',
        background:'linear-gradient(180deg, rgba(107,47,160,0.06), transparent)',
        position:'relative',
      }}>
        <div style={{
          position:'absolute', top:0, left:0, right:0, height: 2,
          background:'linear-gradient(90deg,#6B2FA0,#E91E63)',
        }}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background:'linear-gradient(135deg,#6B2FA0,#E91E63)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Icon name="sparkles" size={14} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color:'#111827', lineHeight: 1.2 }}>Ask Claude</div>
              <div style={{ fontSize: 10.5, color:'#6B2FA0', fontWeight: 500 }}>ISMS Co-pilot</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap: 4 }}>
            <ModelSelector value={model} onChange={m => { setModel(m); newThread(); }}/>
            <button title="New thread" style={iconBtn} onClick={newThread}><Icon name="plus" size={14} color="#6B7280"/></button>
            <button title="Collapse" style={iconBtn} onClick={onCollapse}><Icon name="panel-right-close" size={14} color="#6B7280"/></button>
          </div>
        </div>
        <div style={{
          marginTop: 10, fontSize: 11.5, color:'#4B5563',
          background:'rgba(107,47,160,0.06)', padding:'5px 10px', borderRadius: 6,
          display:'inline-flex', alignItems:'center', gap: 6,
        }}>
          <Icon name="locate-fixed" size={11} color="#6B2FA0"/>
          <span>Context: <strong style={{ color:'#4A1F70', fontWeight: 600 }}>{context}</strong> · {contextDetail}</span>
        </div>
      </div>

      {/* Body */}
      <div ref={bodyRef} className="scroll-y" style={{ flex: 1, overflowY:'auto', padding: (!live && mode==='empty') ? 0 : '16px 16px 8px' }}>
        {live ? (
          <LiveThread messages={messages} streaming={streaming}/>
        ) : mode === 'empty' ? (
          <EmptyThread onPick={(t)=> setText(t)}/>
        ) : drawerOpen ? (
          <DrawerSuggestions controlId={controlId} onPick={(t)=> setText(t)} />
        ) : (
          <ExampleThread />
        )}
        {error && (
          <div style={{
            marginTop: 8, padding:'8px 10px', borderRadius: 6,
            background:'#FEF2F2', border:'1px solid #FECACA',
            color:'#B91C1C', fontSize: 11.5,
          }}>{error}</div>
        )}
      </div>

      {/* Trust strip */}
      <div style={{
        padding:'8px 16px', display:'flex', alignItems:'center', justifyContent:'space-between',
        gap: 8, fontSize: 10.5, color:'#6B7280',
        borderTop:'1px solid #F3F4F6',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
          <Icon name="shield" size={11} color="#10B981"/>
          <span>Read-only · write actions need confirmation</span>
        </div>
        <span style={{ color:'#9CA3AF' }}>indexed 4 min ago</span>
      </div>

      {/* Slash chips */}
      <div className="chips-row" style={{
        padding:'6px 14px 4px', display:'flex', gap: 6, overflowX:'auto',
        borderTop:'1px solid #F3F4F6', scrollbarWidth:'none',
      }}>
        {['/summarize-control','/draft-exception','/evidence-pack','/risk-assess','/policy-diff','/audit-prep','/who-owns'].map(s =>
          <SlashChip key={s} onClick={()=>setText(prev => (prev ? prev + ' ' : '') + s + ' ')}>{s}</SlashChip>
        )}
      </div>

      {/* Pinned item (clicked from elsewhere in the dashboard) */}
      {pinnedItem && (
        <div style={{ padding:'8px 14px 0' }}>
          <div style={{ background:'#fff', border:'1px solid rgba(107,47,160,0.3)', borderRadius: 10, padding:'8px 10px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap: 8 }}>
              <div style={{ display:'flex', alignItems:'center', gap: 6, minWidth: 0 }}>
                <Icon name="sparkles" size={12} color="#6B2FA0"/>
                <span style={{ fontSize: 12, fontWeight: 600, color:'#111827', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{pinnedItem.label}</span>
              </div>
              <button title="Dismiss" style={iconBtn} onClick={()=>setPinnedItem(null)}><Icon name="x" size={12} color="#9CA3AF"/></button>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap: 5, marginTop: 8 }}>
              {(pinnedItem.actions || []).map((a, i) => (
                <button key={i} onClick={()=>setText(a.prompt)} style={pinChipStyle}>{a.label}</button>
              ))}
              {pinnedItem.link && (
                <button onClick={()=>window.open(pinnedItem.link, '_blank')} style={pinChipStyle}>
                  <Icon name="external-link" size={10} style={{ marginRight: 4, verticalAlign:'middle' }}/>Open in tracker
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Composer */}
      <div style={{ padding:'8px 14px 14px', borderTop:'1px solid #F3F4F6' }}>
        <div style={{
          background:'#fff', border:'1px solid #E5E7EB', borderRadius: 10,
          padding: 8,
        }}>
          <textarea
            className="composer"
            value={text}
            onChange={e=>setText(e.target.value)}
            onKeyDown={e=>{
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            placeholder={streaming ? 'Streaming…' : 'Ask about controls, risks, policies, or auditor prep…'}
            disabled={streaming}
            rows={2}
            style={{
              width:'100%', resize:'none', border:'none', outline:'none',
              fontFamily:'Poppins, sans-serif', fontSize: 13, color:'#111827',
              background:'transparent', lineHeight: 1.5,
            }}
          />
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 4 }}>
            <div style={{ display:'flex', gap: 4 }}>
              <button style={iconBtn}><Icon name="paperclip" size={14} color="#6B7280"/></button>
              <button style={iconBtn}><Icon name="at-sign" size={14} color="#6B7280"/></button>
            </div>
            {streaming ? (
              <button
                onClick={stopStreaming}
                style={{
                  background:'#fff', color:'#6B2FA0',
                  border:'1px solid #D1D5DB', borderRadius: 7, padding:'6px 12px',
                  fontFamily:'Poppins, sans-serif', fontSize: 12, fontWeight: 500,
                  cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 6,
                }}>
                Stop <Icon name="square" size={11} />
              </button>
            ) : (
              <button
                onClick={()=>send()}
                disabled={!text.trim()}
                style={{
                  background: text.trim() ? 'linear-gradient(135deg,#6B2FA0,#E91E63)' : '#E5E7EB',
                  color: text.trim() ? '#fff' : '#9CA3AF',
                  border:'none', borderRadius: 7, padding:'6px 12px',
                  fontFamily:'Poppins, sans-serif', fontSize: 12, fontWeight: 500,
                  cursor: text.trim() ? 'pointer' : 'not-allowed',
                  display:'inline-flex', alignItems:'center', gap: 6,
                }}>
                Send <Icon name="arrow-up" size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

const iconBtn = {
  width: 26, height: 26, borderRadius: 6,
  border:'none', background:'transparent', cursor:'pointer',
  display:'inline-flex', alignItems:'center', justifyContent:'center',
};

const pinChipStyle = {
  fontFamily:'Poppins, sans-serif', fontSize: 11, fontWeight: 500,
  color:'#4A1F70', background:'rgba(107,47,160,0.08)',
  border:'1px solid rgba(107,47,160,0.2)', borderRadius: 7,
  padding:'4px 9px', cursor:'pointer',
};

function ExampleThread() {
  return (
    <>
      <UserMsg>What's blocking us for the June 2026 re-certification audit?</UserMsg>
      <ClaudeMsg
        citations={[
          { source:'SoA v1.2', ref:'row 47' },
          { source:'Tracker', ref:'ISMS-1204' },
          { source:'Policy 14', ref:'v0.1' },
          { source:'Risk Reg', ref:'ISMS-310' },
        ]}
      >
        Five highest-priority blockers for CertCo (T-4 days):
        <ol style={{ margin:'6px 0 0 18px', padding: 0, lineHeight: 1.6 }}>
          <li><strong>A.8.10 Information deletion</strong> — HIGH gap, no automated routine. Owner: Sam.</li>
          <li><strong>KPI-2 incident SLA ~33%</strong> — ISMS-1310 untriaged; SLA exception not yet filed.</li>
          <li><strong>KPI-3 endpoint coverage ~50%</strong> — Elastic rollout behind (OFI-011, 2 Jun missed).</li>
          <li><strong>EX-002</strong> four-eyes relaxation — Board approval not yet recorded on the task.</li>
          <li><strong>Quick-win OFIs 004/007/009</strong> — still open, owner Sam, due before the audit.</li>
        </ol>
        <div style={{ marginTop: 8, color:'#4B5563', fontSize: 12.5 }}>
          Want me to draft a remediation plan with owners and target dates?
        </div>
      </ClaudeMsg>
      <UserMsg>Yes, focus on 8.10</UserMsg>
      <ClaudeMsg
        citations={[
          { source:'Tracker', ref:'ISMS-1204' },
          { source:'Policy 26', ref:'Data Retention' },
          { source:'Risk Reg', ref:'Feb 2026 review' },
        ]}
        actions={
          <>
            <Button variant="dashed" size="sm" icon="plus">Create draft ticket</Button>
            <Button variant="ghost" size="sm">Just summarize</Button>
          </>
        }
      >
        <strong style={{ color:'#111827' }}>A.8.10 — Information deletion · remediation plan</strong>
        <div style={{ fontSize: 12, color:'#6B7280', margin:'4px 0 6px' }}>Owner: Sam (CTO) · flagged HIGH risk Feb 2026</div>
        <ol style={{ margin:'0 0 0 18px', padding: 0, lineHeight: 1.6 }}>
          <li>Inventory data stores in scope (Postgres, S3 backups, Elastic indices).</li>
          <li>Define retention rules per class — anchor to <em>Policy 26</em>.</li>
          <li>Implement scheduled deletion job in GitLab CI; log to Elastic for evidence.</li>
          <li>Test in staging Q2 2026 → roll out Q3 2026.</li>
        </ol>
      </ClaudeMsg>
    </>
  );
}

function LiveThread({ messages, streaming }) {
  return (
    <>
      {messages.map((m, i) => {
        if (m.role === 'user') return <UserMsg key={i}>{m.text}</UserMsg>;
        const isLast = i === messages.length - 1;
        const empty = !m.text;
        if (empty && isLast && streaming) return <StreamingDots key={i} />;
        const tools = m.tools && m.tools.length > 0 ? (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop:'1px dashed #E5E7EB', display:'flex', flexWrap:'wrap', gap: 6 }}>
            {m.tools.map((t, j) => (
              <span key={j} style={{
                fontSize: 10.5, fontWeight: 500,
                padding:'2px 8px', borderRadius: 9999,
                background:'#F3F4F6', color:'#4B5563', border:'1px solid #E5E7EB',
                fontFamily:'ui-monospace, SFMono-Regular, monospace',
              }}>
                <Icon name="wrench" size={9} style={{ marginRight: 4, verticalAlign:'middle' }}/>
                {t.name}
              </span>
            ))}
          </div>
        ) : null;
        return (
          <ClaudeMsg key={i}>
            <Markdown text={m.text}/>
            {tools}
          </ClaudeMsg>
        );
      })}
    </>
  );
}

function DrawerSuggestions({ controlId, onPick }) {
  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ fontSize: 11, color:'#6B7280', marginBottom: 10, textTransform:'uppercase', letterSpacing:'0.06em', fontWeight: 600 }}>
        Suggested for {controlId}
      </div>
      <GhostPrompt onClick={()=>onPick && onPick(`Summarise current state of ${controlId}`)}>Summarise current state of {controlId}</GhostPrompt>
      <GhostPrompt onClick={()=>onPick && onPick(`Draft remediation plan for ${controlId}`)}>Draft remediation plan</GhostPrompt>
      <GhostPrompt onClick={()=>onPick && onPick(`Compare ${controlId} to ISO 27002 guidance`)}>Compare to ISO 27002 guidance</GhostPrompt>
      <div style={{
        marginTop: 16, padding: 12, borderRadius: 8,
        background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.25)',
        fontSize: 12, color:'#92400E', lineHeight: 1.5,
      }}>
        <Icon name="info" size={12} style={{ verticalAlign:'middle', marginRight: 6 }}/>
        <strong>{controlId}</strong> currently sits as the only HIGH-severity gap. Mentioned in 3 open tickets and 1 risk register row.
      </div>
    </div>
  );
}

Object.assign(window, { AIPanel, CollapsedAI, ExampleThread, EmptyThread, LiveThread });
