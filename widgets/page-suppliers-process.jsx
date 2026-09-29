// Suppliers → Process — the approved supplier management process.
//
// The two flows are drawn as swimlane diagrams in SVG from
// data/supplier-process.json, not shown as the PNG images that went to the
// auditor. That matters for three reasons: the PNGs are raster and unreadable
// when zoomed, they cannot be searched or corrected, and they would go stale the
// moment the process changes while the JSON is the thing the dashboard already
// reads. Everything rendered here is the document's own wording.
//
// Colours come from the app's CSS variables rather than hex literals, so the
// diagram follows the light/dark theme instead of fighting it.

const SP_COL_W = 176;
const SP_LANE_H = 150;
const SP_PAD_L = 132;   // room for the rotated lane labels
const SP_PAD_T = 16;
const SP_BOX_W = 134;
const SP_BOX_H = 54;
const SP_GATE = 52;     // diamond across the diagonal

// Wrap a label into short lines so it fits inside a box.
function spWrap(text, perLine, maxLines) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  words.forEach(w => {
    if (!cur.length) { cur = w; return; }
    if ((cur + ' ' + w).length <= perLine) cur += ' ' + w;
    else { lines.push(cur); cur = w; }
  });
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/\s+\S*$/, '') + '…';
    return kept;
  }
  return lines;
}

function SpFlow({ flow }) {
  const lanes = flow.lanes;
  const laneIndex = {};
  lanes.forEach((l, i) => { laneIndex[l.id] = i; });

  const maxCol = Math.max(...flow.nodes.map(n => n.col));
  const width = SP_PAD_L + (maxCol + 1) * SP_COL_W + 40;
  const height = SP_PAD_T + lanes.length * SP_LANE_H + 16;

  const byId = {};
  flow.nodes.forEach(n => { byId[n.id] = n; });

  const cx = n => SP_PAD_L + n.col * SP_COL_W + SP_COL_W / 2;
  const laneTop = n => SP_PAD_T + laneIndex[n.lane] * SP_LANE_H;
  const cy = n => laneTop(n) + SP_LANE_H / 2;
  const halfW = n => n.type === 'gate' ? SP_GATE / 2 : n.type === 'task' ? SP_BOX_W / 2 : 15;
  const halfH = n => n.type === 'gate' ? SP_GATE / 2 : n.type === 'task' ? SP_BOX_H / 2 : 15;

  // Orthogonal routing. Forward hops within a lane are a straight line; anything
  // that skips columns, goes backwards or crosses a lane is routed through a
  // channel so it cannot be mistaken for a direct step.
  function path(e) {
    const a = byId[e.from], b = byId[e.to];
    if (!a || !b) return null;
    const ax = cx(a), ay = cy(a), bx = cx(b), by = cy(b);
    const sameLane = a.lane === b.lane;

    if (sameLane && b.col - a.col === 1) {
      return { d: `M ${ax + halfW(a)} ${ay} L ${bx - halfW(b)} ${ay}`, lx: (ax + bx) / 2, ly: ay - 7 };
    }
    if (sameLane) {
      const yc = laneTop(a) + SP_LANE_H - 16;
      const enter = b.col > a.col ? by + halfH(b) : by + halfH(b);
      return {
        d: `M ${ax} ${ay + halfH(a)} L ${ax} ${yc} L ${bx} ${yc} L ${bx} ${enter}`,
        lx: ax + 8, ly: ay + halfH(a) + 12,
      };
    }
    const down = laneIndex[b.lane] > laneIndex[a.lane];
    const ymid = down
      ? laneTop(b) - 12
      : laneTop(a) - 12;
    return {
      d: `M ${ax} ${down ? ay + halfH(a) : ay - halfH(a)} L ${ax} ${ymid} L ${bx} ${ymid} L ${bx} ${down ? by - halfH(b) : by + halfH(b)}`,
      lx: ax + 8, ly: down ? ay + halfH(a) + 12 : ay - halfH(a) - 6,
    };
  }

  const ink = 'var(--fg1, var(--brand-ink))';
  const muted = 'var(--fg-muted, #9A968C)';
  const line = 'var(--border-strong, #C6C4BB)';
  const surface = 'var(--bg-surface-raised, #ffffff)';
  const accent = 'var(--brand-accent)';
  const mid = `m-${flow.id}`;

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 6 }}>
      <svg width={width} height={height} role="img"
           aria-label={`${flow.title} swimlane diagram`}
           style={{ display: 'block', minWidth: width }}>
        <defs>
          <marker id={mid} markerWidth="8" markerHeight="8" refX="7" refY="4"
                  orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0,0 L8,4 L0,8 z" style={{ fill: line }}/>
          </marker>
        </defs>

        {/* lanes */}
        {lanes.map((l, i) => {
          const top = SP_PAD_T + i * SP_LANE_H;
          return (
            <g key={l.id}>
              <rect x={0} y={top} width={width - 8} height={SP_LANE_H} strokeWidth="1" style={{ fill: i % 2 ? 'var(--bg-hover, #FAF9F7)' : 'var(--bg-surface, #F6F5F2)', stroke: line }}/>
              <rect x={0} y={top} width={SP_PAD_L - 16} height={SP_LANE_H} strokeWidth="1" style={{ fill: 'none', stroke: line }}/>
              {/* "Security & Compliance" does not fit on one line in the lane
                  header, so lane names wrap like any other label. */}
              {spWrap(l.label, 13, 3).map((t, j, arr) => (
                <text key={j} x={(SP_PAD_L - 16) / 2} y={top + SP_LANE_H / 2 + (j - (arr.length - 1) / 2) * 13}
                      textAnchor="middle" dominantBaseline="central"
                      fontSize="11.5" fontWeight="600" style={{ fill: ink }}>{t}</text>
              ))}
            </g>
          );
        })}

        {/* edges under the nodes so they tuck behind the shapes */}
        {flow.edges.map((e, i) => {
          const p = path(e);
          if (!p) return null;
          return (
            <g key={i}>
              <path d={p.d} style={{ fill: 'none', stroke: line }} strokeWidth="1.3"
                    markerEnd={`url(#${mid})`}/>
              {e.label && (
                <text x={p.lx} y={p.ly} fontSize="9.5"
                      textAnchor={p.d.indexOf('L') === p.d.lastIndexOf('L') ? 'middle' : 'start'} style={{ fill: muted }}>
                  {e.label}
                </text>
              )}
            </g>
          );
        })}

        {/* nodes */}
        {flow.nodes.map(n => {
          const x = cx(n), y = cy(n);
          if (n.type === 'start') {
            return <circle key={n.id} cx={x} cy={y} r="13" strokeWidth="1.6" style={{ fill: surface, stroke: ink }}/>;
          }
          if (n.type === 'end') {
            const tone = n.tone === 'bad' ? '#B91C1C' : n.tone === 'good' ? '#047857' : ink;
            const lines = spWrap(n.label, 18, 2);
            return (
              <g key={n.id}>
                <circle cx={x} cy={y} r="14" strokeWidth="2.6" style={{ fill: surface, stroke: tone }}/>
                {lines.map((t, i) => (
                  <text key={i} x={x} y={y + 30 + i * 11} textAnchor="middle"
                        fontSize="9.5" fontWeight="600" style={{ fill: tone }}>{t}</text>
                ))}
              </g>
            );
          }
          if (n.type === 'gate') {
            const h = SP_GATE / 2;
            const lines = spWrap(n.label, 20, 3);
            return (
              <g key={n.id}>
                {/* the question sits above the diamond, as in the source diagrams */}
                {lines.map((t, i) => (
                  <text key={i} x={x} y={y - h - 8 - (lines.length - 1 - i) * 11}
                        textAnchor="middle" fontSize="9.5" style={{ fill: muted }}>{t}</text>
                ))}
                <polygon points={`${x},${y - h} ${x + h},${y} ${x},${y + h} ${x - h},${y}`}
                         style={{ fill: surface, stroke: ink }} strokeWidth="1.4"/>
                <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                      fontSize="13" fontWeight="600" style={{ fill: ink }}>✕</text>
              </g>
            );
          }
          const lines = spWrap(n.label, 19, 3);
          const startY = y - ((lines.length - 1) * 11) / 2 - (n.tool ? 6 : 0);
          return (
            <g key={n.id}>
              <rect x={x - SP_BOX_W / 2} y={y - SP_BOX_H / 2} width={SP_BOX_W} height={SP_BOX_H}
                    rx="8" strokeWidth="1.3" style={{ fill: surface, stroke: ink }}/>
              {lines.map((t, i) => (
                <text key={i} x={x} y={startY + i * 11} textAnchor="middle" dominantBaseline="central"
                      fontSize="10" style={{ fill: ink }}>{t}</text>
              ))}
              {n.tool && (
                <text x={x} y={y + SP_BOX_H / 2 - 8} textAnchor="middle"
                      fontSize="8.5" fontWeight="600" style={{ fill: accent }}>
                  {n.tool.length > 24 ? n.tool.slice(0, 23) + '…' : n.tool}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function SpGaps({ gaps }) {
  const TONE = {
    high: { fg: '#B91C1C', bg: '#FEF2F2', br: 'rgba(185,28,28,0.2)', label: 'High' },
    med:  { fg: '#B45309', bg: '#FFFBEB', br: 'rgba(180,83,9,0.2)',  label: 'Medium' },
    low:  { fg: 'var(--brand-muted)', bg: '#F6F5F2', br: '#E4E2DC',             label: 'Note' },
  };
  return (
    <Card padding={20}>
      <SectionTitle right={<Pill color="#B91C1C" bg="#FEF2F2" size="xs">{gaps.length}</Pill>}>
        Gaps in the process
      </SectionTitle>
      <div style={{ fontSize: 11.5, color: 'var(--brand-muted)', marginBottom: 10, lineHeight: 1.6 }}>
        Each of these is visible in the approved document itself or in the registers the process
        depends on. None is a judgement about how well the process is followed — only about what it
        says and what exists.
      </div>
      {gaps.map((g, i) => {
        const t = TONE[g.sev] || TONE.low;
        return (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '11px 0',
                                borderBottom: i === gaps.length - 1 ? 'none' : '1px solid var(--brand-surface)' }}>
            <span style={{ flexShrink: 0, alignSelf: 'flex-start', marginTop: 1,
                           fontSize: 9.5, fontWeight: 600, color: t.fg, background: t.bg,
                           border: `1px solid ${t.br}`, borderRadius: 9999, padding: '2px 8px' }}>{t.label}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--brand-ink)' }}>{g.title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--brand-muted)', marginTop: 3, lineHeight: 1.6 }}>{g.detail}</div>
              {g.source && (
                <div style={{ fontSize: 10.5, color: '#9A968C', marginTop: 4 }}>Source: {g.source}</div>
              )}
            </div>
          </div>
        );
      })}
    </Card>
  );
}

function PageSuppliersProcess() {
  const P = (typeof SUPPLIER_PROCESS !== 'undefined' && SUPPLIER_PROCESS) || null;
  if (!P) return null;
  const d = P.doc;

  const th = { textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em',
               color: '#9A968C', fontWeight: 600, padding: '0 10px 8px 0', whiteSpace: 'nowrap' };
  const td = { fontSize: 11.5, color: '#343128', padding: '9px 10px 9px 0', verticalAlign: 'top',
               borderTop: '1px solid var(--brand-surface)' };

  return (
    <div style={{ maxWidth: 1320, padding: '18px 24px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>

      <div style={{ padding: '11px 13px', borderRadius: 8, background: '#F6F5F2',
                    border: '1px solid #E4E2DC', fontSize: 11.5, color: '#4A473F', lineHeight: 1.6 }}>
        <Icon name="info" size={12} style={{ verticalAlign: 'middle', marginRight: 6 }}/>
        {P.note}
      </div>

      {P.flows.map(f => (
        <Card key={f.id} padding={20}>
          <SectionTitle right={<Pill color="var(--brand-muted)" bg="#F6F5F2" size="xs">{f.lanes.length} lanes</Pill>}>
            {f.title}
          </SectionTitle>
          <div style={{ fontSize: 11.5, color: 'var(--brand-muted)', marginBottom: 12 }}>{f.subtitle}</div>
          <SpFlow flow={f}/>
        </Card>
      ))}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
        <Card padding={20}>
          <SectionTitle>{P.contracting.title}</SectionTitle>
          <div style={{ fontSize: 11.5, color: 'var(--brand-muted)', marginBottom: 10, lineHeight: 1.6 }}>
            Owned by the {P.contracting.owner}. {P.contracting.note}
          </div>
          {P.contracting.steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderTop: '1px solid var(--brand-surface)' }}>
              <Icon name={s.gate ? 'git-branch' : 'check'} size={13}
                    color={s.gate ? '#B45309' : '#047857'} style={{ flexShrink: 0, marginTop: 2 }}/>
              <div style={{ minWidth: 0, fontSize: 11.5, lineHeight: 1.6 }}>
                {s.gate && <span style={{ fontWeight: 600, color: 'var(--brand-ink)' }}>{s.gate} </span>}
                <span style={{ color: 'var(--brand-muted)' }}>{s.then}</span>
                {s.tool && <Pill color="#B45309" bg="#FFFBEB" size="xs">{s.tool}</Pill>}
              </div>
            </div>
          ))}
        </Card>

        <Card padding={20}>
          <SectionTitle>Ongoing monitoring & re-evaluation</SectionTitle>
          <div style={{ fontSize: 11.5, color: 'var(--brand-muted)', marginBottom: 10 }}>
            Supplier owners are responsible for ongoing monitoring of their suppliers.
          </div>
          {P.monitoring.map((m, i) => (
            <div key={i} style={{ padding: '9px 0', borderTop: '1px solid var(--brand-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-ink)' }}>{m.activity}</span>
                <span style={{ fontSize: 11, color: '#B45309' }}>{m.frequency}</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--brand-muted)', marginTop: 2 }}>{m.description}</div>
            </div>
          ))}
        </Card>
      </div>

      <Card padding={20}>
        <SectionTitle right={<Pill color="#047857" bg="#ECFDF5" size="xs">{d.status}</Pill>}>
          The process document
        </SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', columnGap: 28 }}>
          <div>
            {[['Document', d.title], ['File', d.file], ['Reference', d.reference],
              ['Version', `${d.version} · ${d.date}`], ['Status', d.status]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--brand-surface)', fontSize: 11.5 }}>
                <span style={{ width: 96, flexShrink: 0, color: '#9A968C' }}>{k}</span>
                <span style={{ color: 'var(--brand-ink)', fontWeight: 500, minWidth: 0 }}>{v}</span>
              </div>
            ))}
          </div>
          <div>
            {[['Author', d.author], ['Owner', d.owner], ['Approved by', d.approvedBy],
              ['Location', d.location]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--brand-surface)', fontSize: 11.5 }}>
                <span style={{ width: 96, flexShrink: 0, color: '#9A968C' }}>{k}</span>
                <span style={{ color: k === 'Owner' ? '#B45309' : 'var(--brand-ink)', fontWeight: 500, minWidth: 0 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--brand-muted)', marginTop: 12, lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--brand-ink)' }}>Purpose.</strong> {d.purpose}
          <div style={{ marginTop: 6 }}><strong style={{ color: 'var(--brand-ink)' }}>Scope.</strong> {d.scope}</div>
          <div style={{ marginTop: 6 }}><strong style={{ color: 'var(--brand-ink)' }}>Critical supplier.</strong> {d.criticalDefinition}</div>
          <div style={{ marginTop: 6 }}><strong style={{ color: 'var(--brand-ink)' }}>How it applies.</strong> {d.granularity}</div>
        </div>
      </Card>

      <Card padding={20}>
        <SectionTitle right={<Pill color="#B45309" bg="#FFFBEB" size="xs">{P.evaluations.length} on file</Pill>}>
          Per-supplier evaluations found
        </SectionTitle>
        <div style={{ fontSize: 11.5, color: 'var(--brand-muted)', marginBottom: 10, lineHeight: 1.6 }}>
          {P.evaluationsNote || 'Completed supplier evaluation sheets located in the document library.'}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 880 }}>
            <thead>
              <tr>
                <th style={th}>Supplier</th>
                <th style={th}>Assessment type</th>
                <th style={{ ...th, width: 92 }}>Date</th>
                <th style={{ ...th, width: 130 }}>Assessor</th>
                <th style={th}>Certification</th>
                <th style={th}>DPA</th>
                <th style={{ ...th, width: 76 }}>Criticality</th>
              </tr>
            </thead>
            <tbody>
              {P.evaluations.map(e => (
                <tr key={e.supplier}>
                  <td style={{ ...td, color: 'var(--brand-ink)', fontWeight: 500 }}>
                    {e.supplier}
                    <div style={{ fontSize: 10.5, color: '#9A968C', fontWeight: 400 }}>
                      {e.service} · {e.dataType} · {e.dataLocation}
                    </div>
                  </td>
                  <td style={{ ...td, color: 'var(--brand-muted)' }}>{e.assessmentType}</td>
                  <td style={{ ...td, color: 'var(--brand-muted)' }}>{e.date}</td>
                  <td style={{ ...td, color: 'var(--brand-muted)' }}>{e.assessor}</td>
                  <td style={{ ...td, color: 'var(--brand-muted)' }}>{e.certification}</td>
                  <td style={{ ...td, color: 'var(--brand-muted)' }}>{e.dpa}</td>
                  <td style={td}><Pill color="#B91C1C" bg="#FEF2F2" size="xs">{e.criticality}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 10.5, color: '#9A968C', marginTop: 10, lineHeight: 1.6 }}>
          {P.evaluationsNote || ''}
        </div>
      </Card>

      <Card padding={20}>
        <SectionTitle>Roles & responsibilities</SectionTitle>
        {P.roles.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '9px 0',
                                borderBottom: i === P.roles.length - 1 ? 'none' : '1px solid var(--brand-surface)' }}>
            <span style={{ width: 210, flexShrink: 0, fontSize: 12, fontWeight: 600, color: 'var(--brand-ink)' }}>{r.role}</span>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: 'var(--brand-muted)', lineHeight: 1.6 }}>
              {r.responsibilities.map((x, j) => <li key={j}>{x}</li>)}
            </ul>
          </div>
        ))}
      </Card>

      <SpGaps gaps={P.gaps}/>
    </div>
  );
}

registerWidget('page-suppliers-process', PageSuppliersProcess);
