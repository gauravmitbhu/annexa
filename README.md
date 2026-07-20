# ISMS Dashboard

A lightweight, self-hosted **ISO/IEC 27001:2022 compliance dashboard** — a plain-vanilla,
Sprinto/Vanta-style ISMS cockpit you can run locally. All data in this repo is
**fictional demo data** for a made-up company ("Acme").


## What's inside

- **Overview** — control posture at a glance (compliant / at-risk / gap / N/A)
- **ISMS Core** — management-system clauses 4–10 with per-item status, owner, and evidence links
- **Controls** — all 93 Annex A controls across the 4 themes (Organisational, People, Physical, Technological)
- **Risks** — 5×5 risk heat map + register summary
- **Policies, Vendors, People & Training, Evidence Library**
- **Incidents, Audits & Findings, Exceptions, Operating Procedures register, Post-audit roadmap**
- **AI panel** — optional chat side-panel that bridges to a local [Claude Code](https://claude.com/claude-code) subprocess for Q&A over your ISMS files

## Architecture: a living site

annexa is built as a **self-evolving web app**: a small protected engine renders
an evolvable layer, and a built-in AI agent (Claude Code) can restructure the
site by editing that layer — with every change auto-committed to git and
revertable in one click from the UI.

```
engine/            PROTECTED CORE — registry, primitives, loader, renderer, AI panel
app.py, index.html PROTECTED — Flask server + boot page
site/site.json     EVOLVABLE — brand, nav, page composition, drawers (the site spec)
widgets/*.jsx      EVOLVABLE — self-registering components, discovered automatically
data/*.json        EVOLVABLE — all records; each key becomes a window global
schema/            site.json JSON Schema (used by /api/validate)
.claude/settings.json  hard deny-rules: the agent can never edit the protected core
```

- **No build step.** CDN React 18 + Babel-standalone; widgets are transpiled
  in the browser at boot. `GET /api/manifest` globs `site/`, `data/`,
  `widgets/` — drop a file in and it exists.
- **Crash-resilient.** Each widget loads in its own try/catch + ErrorBoundary;
  a broken widget renders an error card with a "Fix with AI" button, never a
  white screen.
- **Evolve mode.** The AI side panel has an Ask/Evolve toggle. In Evolve mode
  the agent gets Edit/Write inside the repo, the browser hot-reloads ~2s after
  any change, each turn is auto-committed (`evolve: …`), and the panel shows
  diff cards + a change-history drawer with one-click revert.
- **Structure = data.** Adding a page is a nav entry + a pages entry in
  `site/site.json` plus (optionally) a new widget file. Renaming a tab is a
  one-line JSON edit. Subtitles support `{expr}` templates evaluated against
  globals (e.g. `"{CONTROLS.length} controls"`).

## Run

```bash
pip install -r requirements.txt
python app.py
# → http://127.0.0.1:8765
```

Optional environment variables:

| Var | Purpose |
|---|---|
| `PORT` | HTTP port (default 8765) |
| `MOODLE_URL` / `MOODLE_TOKEN` | Live training-completion stats from a Moodle instance |

The AI panel requires the `claude` CLI on your PATH; without it the rest of the
dashboard works fine.

## Adapting it to your organisation

All content lives in plain data structures at the top of the `.jsx` files —
start with `data.jsx` (controls, owners, findings, navigation) and edit the
other views' data blocks in place. Replace `#` placeholder links with links to
your own ticketing / document system.

## License

MIT. Fonts: Poppins (SIL Open Font License).

## Disclaimer

This is a demo/reference implementation, not compliance advice. All names,
companies, findings, tickets, and dates are fictional.
