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

## Stack

No build step. React (via CDN, JSX transpiled in-browser) + a small Flask backend
that serves the static app and provides optional API bridges (AI chat, Moodle
training stats).

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
