"""
ISMS Dashboard backend — serves the static SPA and bridges the AI panel
to a headless Claude Code subprocess.

Headless invocation:
    claude -p "<user msg>" \
        --output-format stream-json --include-partial-messages \
        --allowedTools "Read Grep Glob" \
        --append-system-prompt "<ISMS context>" \
        --session-id <uuid>     # first turn of a thread
        --resume <uuid>         # subsequent turns

cwd is the ISMS project root so Claude Code can read the SoA xlsx,
policy PDFs, and other artifacts via its built-in Read/Grep tools.
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import threading
from pathlib import Path
from typing import Iterable

from flask import Flask, Response, jsonify, request, send_from_directory

# ---- paths -----------------------------------------------------------------
DASHBOARD_DIR = Path(__file__).resolve().parent          # .../annexa
PROJECT_ROOT  = DASHBOARD_DIR.parent                     # .../isms

CLAUDE_BIN = shutil.which("claude") or "claude"

# In-memory record of which thread IDs have been initialized in Claude Code's
# session store. First send uses --session-id, subsequent use --resume.
_seen_threads: set[str] = set()
_seen_lock = threading.Lock()

# ---- system prompt ---------------------------------------------------------
def _site_context() -> str:
    """Organisation context for the AI prompts, taken from site/site.json so the
    same code serves any company. Optional site.json key `aiContext` (string or
    list of strings) adds free-text facts: standards, scope, certifier, etc."""
    try:
        site = json.loads((DASHBOARD_DIR / "site" / "site.json").read_text(encoding="utf-8"))
    except Exception:                                         # noqa: BLE001
        site = {}
    brand, user = site.get("brand") or {}, site.get("user") or {}
    org = brand.get("legalName") or brand.get("name") or "the organisation"
    extra = site.get("aiContext") or []
    if isinstance(extra, str):
        extra = [extra]
    lines = [f"Organisation: {org}."]
    if user.get("name"):
        lines.append(f"The user is {user['name']}{', ' + user['role'] if user.get('role') else ''}.")
    lines += [f"- {x}" for x in extra]
    return "\n".join(lines)


def _chat_prompt() -> str:
    return f"""
You are the AI co-pilot for this integrated management system (IMS) dashboard.
{_site_context()}

The registers in data/*.json are the organisation's compliance position. Do not
invent figures, people or findings, and do not soften what the registers say.
If a register does not answer the question, say so rather than filling the gap.

You have read-only access to the local working tree (the project root this
server runs from). Use Read/Grep/Glob to consult artifacts present there, e.g.
the Statement of Applicability, policy documents, registers and README.md.

Style:
- Be a colleague to a senior compliance lead: direct, concise, no hedging.
- Cite sources when you reference files (e.g. "SoA, row 47").
- For audit prep, drafting, or risk questions, lead with the actionable answer.
- Never invent control IDs, ticket numbers, or ownership — read the file.
- This is a read-only context. Do not propose Edit/Write actions.
""".strip()

# Tools we let Claude Code use in this surface.
ALLOWED_TOOLS = "Read Grep Glob"

# ---- Evolve mode -------------------------------------------------------------
# In evolve mode the agent gets write tools inside the dashboard directory and
# the site becomes self-modifying: edits to site/, widgets/, data/ hot-reload
# in the browser (~2s) and every turn is auto-committed for one-click revert.
# The protected core (engine/, app.py, index.html) is hard-denied via
# .claude/settings.json in this directory — the prompt below is guidance,
# the settings file is enforcement.
EVOLVE_ALLOWED_TOOLS = "Read Grep Glob Edit Write"

def _evolve_prompt() -> str:
    return ("""
You are the EVOLVE agent for this IMS dashboard — a self-modifying web
app. The user asks for changes in plain language; you implement them by
editing files in this directory. The browser hot-reloads ~2s after any file
changes, and the server auto-commits your changes to git after each turn
(the UI offers one-click revert), so apply changes directly — do not ask for
confirmation.

## Substrate (how this site works)
- No build step. CDN React 18 + Babel-standalone. Flask (app.py) serves it.
- `site/site.json` — THE site spec: brand, user, nav[], pages{}, drawers{}.
  * pages.<id> = { title, subtitle, aiContext, aiContextDetail, drawerType?,
    sections: [ { widget: "<name>", props?: {...} } ] }
  * Strings support {expr} templates evaluated against window globals,
    e.g. "{CONTROLS.length} controls".
  * Adding a nav item + a pages entry = a new page. No other wiring.
- `widgets/*.jsx` — one component per file, discovered automatically (no
  registration list). A widget file defines React components with plain
  `function Foo() {...}` and MUST end with `registerWidget('<name>', Foo);`.
  Conventions: no imports/exports (globals only); shared UI primitives are
  global (Icon, Card, Button, Pill, Avatar, PageHeader…); data is global
  (CONTROLS, INCIDENTS, OFIS, VENDORS, …); inline styles, and ALWAYS the theme tokens rather than hex literals for brand
  colours: var(--brand-accent), var(--brand-accent-2), var(--brand-accent-dark),
  var(--brand-ink), var(--brand-muted), var(--brand-surface), var(--brand-border),
  var(--brand-on-accent); tints via color-mix(in srgb, var(--brand-accent) 10%, transparent).
  The theme is set from site/theme.json (Settings page) — never hard-code a company palette. Widgets that open detail drawers
  receive an `onOpenDrawer(item)` prop.
- `data/*.json` — each file is { GLOBAL_NAME: value, ... }; every key becomes
  a window global at boot. Edit or add records here; add new files freely.
- PROTECTED (never edit, tool calls will be denied): engine/, app.py,
  branding.py, index.html. If a request truly requires engine changes, explain why and
  stop. colors_and_type.css MAY be edited for theme/token changes.

## Rules
- The data/ registers are the organisation's compliance records. Never invent
  records, figures, people or findings to fill a gap — if a register does not
  say it, say so. Treat the content as confidential.
- Keep edits minimal and consistent with neighbouring style.
- A broken widget shows an error card (not a crash); if the user reports one,
  Read the file, fix the error.
- After structural edits to site/site.json, mentally validate: every
  sections[].widget must exist in widgets/ (or be registered by one).
"""
        + "\n\n" + _site_context())


# ---- Flask app -------------------------------------------------------------
app = Flask(__name__, static_folder=str(DASHBOARD_DIR), static_url_path="")


@app.get("/")
def index() -> Response:
    return send_from_directory(DASHBOARD_DIR, "index.html")


@app.get("/health")
def health():
    return jsonify(
        ok=True,
        claude=CLAUDE_BIN,
        cwd=str(PROJECT_ROOT),
    )


@app.get("/api/version")
def version():
    """Returns max mtime across engine/site/widgets/data — used by the browser
    for live-reload polling. Recursive so evolve-mode edits anywhere in the
    evolvable layer trigger a reload."""
    exts = {".jsx", ".css", ".html", ".json"}
    ts = 0.0
    roots = [DASHBOARD_DIR] + [DASHBOARD_DIR / d for d in ("engine", "site", "widgets", "data")]
    for root in roots:
        if not root.is_dir():
            continue
        it = root.iterdir() if root == DASHBOARD_DIR else root.rglob("*")
        for p in it:
            if p.is_file() and p.suffix in exts:
                ts = max(ts, p.stat().st_mtime)
    return jsonify(v=ts)


@app.get("/api/manifest")
def manifest():
    """Discovery endpoint for the boot loader: site spec, data files, widgets.
    Globbed on every call — the agent can drop new files in and they appear
    on the next reload with no registration step."""
    def rel(paths):
        return sorted(str(p.relative_to(DASHBOARD_DIR)) for p in paths)
    return jsonify(
        site="site/site.json",
        data=rel((DASHBOARD_DIR / "data").glob("*.json")),
        widgets=rel((DASHBOARD_DIR / "widgets").glob("*.jsx")),
    )


# ---- Moodle bridge ----------------------------------------------------------
# Live overview from Moodle Cloud. Token comes from the MOODLE_TOKEN env var so
# it never reaches the browser; without a valid token the endpoint reports
# live=false and the frontend falls back to its last-known snapshot.
import time
import urllib.parse
import urllib.request

def _load_dotenv() -> None:
    """Load KEY=VALUE pairs from PROJECT_ROOT/.env (kept outside the static
    dir so Flask can never serve it). Real env vars take precedence."""
    env_file = PROJECT_ROOT / ".env"
    if not env_file.exists():
        return
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        os.environ.setdefault(k.strip(), v.strip())


_load_dotenv()

MOODLE_BASE = os.environ.get("MOODLE_URL", "")
MOODLE_TOKEN = os.environ.get("MOODLE_TOKEN", "")
_moodle_cache: dict = {"ts": 0.0, "data": None}


def _moodle_call(fn: str, **params) -> dict | list:
    qs = urllib.parse.urlencode({
        "wstoken": MOODLE_TOKEN,
        "wsfunction": fn,
        "moodlewsrestformat": "json",
        **params,
    })
    with urllib.request.urlopen(f"{MOODLE_BASE}/webservice/rest/server.php?{qs}", timeout=10) as r:
        out = json.loads(r.read().decode("utf-8"))
    if isinstance(out, dict) and out.get("exception"):
        raise RuntimeError(out.get("message", out["exception"]))
    return out


@app.get("/api/moodle/overview")
def moodle_overview():
    now = time.time()
    if _moodle_cache["data"] is not None and now - _moodle_cache["ts"] < 60:
        return jsonify(_moodle_cache["data"])

    if not MOODLE_TOKEN:
        data = {"live": False, "reason": "MOODLE_TOKEN not set"}
    else:
        try:
            site = _moodle_call("core_webservice_get_site_info")
            courses = [c for c in _moodle_call("core_course_get_courses")
                       if c.get("id") != 1                                  # site front page
                       and "restoring" not in (c.get("shortname") or "")]   # restore placeholders
            course_data = []
            for c in courses:
                row = {"id": c["id"], "name": c.get("fullname"), "shortname": c.get("shortname")}
                try:
                    users = _moodle_call("core_enrol_get_enrolled_users", courseid=c["id"])
                    students = [u for u in users
                                if any(r.get("shortname") == "student" for r in u.get("roles", []))] or users
                    row["enrolled"] = len(students)
                    completed = 0
                    for u in students:
                        try:
                            st = _moodle_call("core_completion_get_course_completion_status",
                                              courseid=c["id"], userid=u["id"])
                            if (st.get("completionstatus") or {}).get("completed"):
                                completed += 1
                        except Exception:
                            completed = None
                            break
                    row["completed"] = completed
                except Exception as e:
                    row["enrolled"] = None
                    row["error"] = str(e)[:120]
                course_data.append(row)
            course_data.sort(key=lambda r: r.get("enrolled") or 0, reverse=True)
            data = {"live": True, "site": site.get("sitename"),
                    "release": site.get("release"), "courses": course_data}
        except Exception as e:
            data = {"live": False, "reason": str(e)[:200]}

    _moodle_cache.update(ts=now, data=data)
    return jsonify(data)


# ---- Whitelabel / branding --------------------------------------------------
# The Settings page scans a company website for its colours, fonts and logo
# (branding.scan), lets the user adjust the proposal, then applies it: the
# theme goes to site/theme.json and the name to site.json brand{}.
import branding


@app.post("/api/brand/scan")
def brand_scan():
    url = ((request.get_json(silent=True) or {}).get("url") or "").strip()
    if not url:
        return jsonify(ok=False, reason="missing url"), 400
    try:
        return jsonify(ok=True, proposal=branding.scan(url))
    except branding.ScanError as e:
        return jsonify(ok=False, reason=str(e)), 400
    except Exception as e:                                    # noqa: BLE001
        return jsonify(ok=False, reason=f"{type(e).__name__}: {e}"[:300]), 502


@app.post("/api/brand/apply")
def brand_apply():
    body = request.get_json(silent=True) or {}
    theme = body.get("theme") or {}
    if body.get("reset"):
        branding.THEME_PATH.unlink(missing_ok=True)
        return jsonify(ok=True, theme=None)
    # Logos and favicons are embedded as data: URIs so the dashboard never
    # hot-links (or leaks views to) the company's website after applying.
    for k in ("logo", "favicon"):
        v = theme.get(k) or ""
        if v and not v.startswith("data:"):
            try:
                theme[k] = branding.embed_image(v)
            except Exception:                                 # noqa: BLE001
                theme[k] = ""
    clean = branding.write_theme(theme)

    brand = body.get("brand") or {}
    site_path = DASHBOARD_DIR / "site" / "site.json"
    site = json.loads(site_path.read_text(encoding="utf-8"))
    for k in ("name", "legalName", "tagline"):
        v = brand.get(k)
        if isinstance(v, str) and v.strip():
            site.setdefault("brand", {})[k] = v.strip()[:80]
    site_path.write_text(json.dumps(site, ensure_ascii=False, indent=2), encoding="utf-8")
    return jsonify(ok=True, theme=clean, brand=site.get("brand"))


# ---- Claude bridge ---------------------------------------------------------
VALID_MODELS = {
    "claude-fable-5",
    "claude-opus-4-8",
    "claude-sonnet-4-6",
    "claude-haiku-4-5-20251001",
}

def _build_args(user_msg: str, thread_id: str, model: str | None = None,
                mode: str = "chat") -> list[str]:
    with _seen_lock:
        first = thread_id not in _seen_threads
        _seen_threads.add(thread_id)

    evolve = mode == "evolve"
    args = [
        CLAUDE_BIN,
        "-p", user_msg,
        "--output-format", "stream-json",
        "--include-partial-messages",
        "--verbose",                       # required for stream-json output
        "--allowedTools", EVOLVE_ALLOWED_TOOLS if evolve else ALLOWED_TOOLS,
        "--append-system-prompt", _evolve_prompt() if evolve else _chat_prompt(),
    ]
    if not evolve:
        args += ["--add-dir", str(PROJECT_ROOT)]
    if model and model in VALID_MODELS:
        args += ["--model", model]
    if first:
        args += ["--session-id", thread_id]
    else:
        args += ["--resume", thread_id]
    return args


# ---- git substrate -----------------------------------------------------------
def _git(*argv: str) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["git", *argv], cwd=str(DASHBOARD_DIR),
        capture_output=True, text=True, timeout=30,
    )


def _git_autocommit(user_msg: str) -> dict | None:
    """Commit any working-tree changes after an evolve turn. Returns commit
    info for the UI, or None when the turn changed nothing."""
    _git("add", "-A")
    if _git("diff", "--cached", "--quiet").returncode == 0:
        return None
    subject = "evolve: " + " ".join(user_msg.split())[:60]
    r = _git("commit", "-m", subject)
    if r.returncode != 0:
        return {"error": r.stderr.strip()[:300]}
    sha = _git("rev-parse", "HEAD").stdout.strip()
    files = [f for f in _git("show", "--name-only", "--format=", sha).stdout.splitlines() if f]
    return {"sha": sha, "subject": subject, "files": files}


def _sse(event_obj: dict) -> bytes:
    return f"data: {json.dumps(event_obj)}\n\n".encode("utf-8")


def _stream_claude(user_msg: str, thread_id: str, model: str | None = None,
                   mode: str = "chat") -> Iterable[bytes]:
    """
    Spawn `claude -p` and translate its stream-json output to SSE the
    frontend can consume. We forward only what the UI needs:
      - {type:"delta", text:"..."} — text token
      - {type:"tool",  name:"Read", input:{...}} — tool call (for citations)
      - {type:"done"}               — terminal
      - {type:"error", message:"..."} — non-recoverable
    """
    args = _build_args(user_msg, thread_id, model, mode)
    try:
        proc = subprocess.Popen(
            args,
            cwd=str(DASHBOARD_DIR if mode == "evolve" else PROJECT_ROOT),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            bufsize=1,
            text=True,
        )
    except FileNotFoundError:
        yield _sse({"type": "error", "message": f"claude binary not found at {CLAUDE_BIN}"})
        return

    assert proc.stdout is not None
    saw_partials = False
    try:
        for line in proc.stdout:
            line = line.strip()
            if not line:
                continue
            try:
                evt = json.loads(line)
            except json.JSONDecodeError:
                # Non-JSON line — forward as a debug delta so we can see it
                yield _sse({"type": "debug", "text": line})
                continue

            for forwarded in _translate(evt, saw_partials):
                if forwarded["type"] == "delta":
                    saw_partials = True
                yield _sse(forwarded)

        rc = proc.wait()
        stderr = proc.stderr.read() if proc.stderr else ""
        if rc != 0:
            yield _sse({
                "type": "error",
                "message": f"claude exited {rc}: {stderr.strip()[:500]}",
            })
        else:
            if mode == "evolve":
                commit = _git_autocommit(user_msg)
                if commit:
                    yield _sse({"type": "commit", **commit})
            yield _sse({"type": "done"})
    finally:
        if proc.poll() is None:
            proc.kill()


def _translate(evt: dict, saw_partials: bool) -> Iterable[dict]:
    """
    Map a single stream-json event from Claude Code → 0+ events for our UI.

    Claude Code emits a mix of:
      {"type": "system", "subtype": "init", ...}
      {"type": "assistant", "message": {"content": [{"type":"text","text":"..."}]}}
      {"type": "stream_event", "event": {...}}   # with --include-partial-messages
      {"type": "user", ...}                      # tool results echoed back
      {"type": "result", ...}                    # final summary
    """
    t = evt.get("type")

    # Streaming partial text (preferred — token-by-token)
    if t == "stream_event":
        ev = evt.get("event", {})
        if ev.get("type") == "content_block_delta":
            delta = ev.get("delta") or {}
            if delta.get("type") == "text_delta" and delta.get("text"):
                yield {"type": "delta", "text": delta["text"]}
        elif ev.get("type") == "content_block_start":
            block = ev.get("content_block") or {}
            if block.get("type") == "tool_use":
                yield {
                    "type": "tool",
                    "name": block.get("name", "?"),
                    "input": block.get("input") or {},
                }
        return

    # Fallback: full assistant message. Skip text if partials already streamed —
    # otherwise the frontend would render the same answer twice.
    if t == "assistant":
        msg = evt.get("message") or {}
        for block in msg.get("content") or []:
            if block.get("type") == "text" and block.get("text") and not saw_partials:
                yield {"type": "delta", "text": block["text"]}
            elif block.get("type") == "tool_use":
                yield {
                    "type": "tool",
                    "name": block.get("name", "?"),
                    "input": block.get("input") or {},
                }
        return

    # Final result envelope — surface usage if present, then we'll emit done
    if t == "result":
        usage = evt.get("usage") or {}
        if usage:
            yield {"type": "usage", "usage": usage}
        return

    # Init / user / unknown — ignore for now
    return


@app.post("/api/chat")
def chat():
    body = request.get_json(silent=True) or {}
    msg = (body.get("message") or "").strip()
    thread_id = (body.get("threadId") or "").strip()
    model = (body.get("model") or "").strip() or None
    mode = "evolve" if (body.get("mode") or "").strip() == "evolve" else "chat"
    if not msg:
        return jsonify(error="empty message"), 400
    if not thread_id:
        return jsonify(error="missing threadId"), 400

    return Response(
        _stream_claude(msg, thread_id, model, mode),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",   # disable nginx-style buffering if any
            "Connection": "keep-alive",
        },
    )


# ---- git history / revert -----------------------------------------------------
@app.get("/api/git/log")
def git_log():
    n = min(int(request.args.get("n", 20)), 100)
    r = _git("log", f"-{n}", "--format=%H%x1f%s%x1f%ct")
    commits = []
    for line in r.stdout.splitlines():
        sha, subject, ts = line.split("\x1f")
        files = [f for f in _git("show", "--name-only", "--format=", sha).stdout.splitlines() if f]
        commits.append({"sha": sha, "subject": subject, "ts": int(ts), "files": files,
                        "evolve": subject.startswith("evolve:") or subject.startswith("Revert")})
    return jsonify(commits=commits)


@app.get("/api/git/diff/<sha>")
def git_diff(sha: str):
    if not all(c in "0123456789abcdef" for c in sha.lower()) or not (7 <= len(sha) <= 40):
        return jsonify(error="bad sha"), 400
    r = _git("show", "--format=", sha)
    return jsonify(diff=r.stdout[:200_000])


@app.post("/api/git/revert")
def git_revert():
    sha = ((request.get_json(silent=True) or {}).get("sha") or "").strip()
    if not all(c in "0123456789abcdef" for c in sha.lower()) or not (7 <= len(sha) <= 40):
        return jsonify(error="bad sha"), 400
    r = _git("revert", "--no-edit", sha)
    if r.returncode != 0:
        _git("revert", "--abort")
        return jsonify(error=f"revert conflict: {r.stderr.strip()[:300]}"), 409
    new_sha = _git("rev-parse", "HEAD").stdout.strip()
    return jsonify(ok=True, sha=new_sha)


@app.post("/api/validate")
def validate():
    """Validate site/site.json: well-formed JSON, schema shape, and every
    referenced widget name present in some widgets/*.jsx registerWidget call."""
    problems = []
    site_path = DASHBOARD_DIR / "site" / "site.json"
    try:
        site = json.loads(site_path.read_text())
    except Exception as e:
        return jsonify(ok=False, problems=[f"site.json: {e}"])
    try:
        import jsonschema
        schema = json.loads((DASHBOARD_DIR / "schema" / "site.schema.json").read_text())
        for err in jsonschema.Draft202012Validator(schema).iter_errors(site):
            problems.append(f"schema: {'/'.join(map(str, err.path))}: {err.message}")
    except ImportError:
        pass
    registered = set()
    for w in (DASHBOARD_DIR / "widgets").glob("*.jsx"):
        import re
        registered |= set(re.findall(r"registerWidget\(\s*['\"]([\w-]+)['\"]", w.read_text()))
    for pid, page in (site.get("pages") or {}).items():
        for sec in page.get("sections") or []:
            if sec.get("widget") not in registered:
                problems.append(f"pages.{pid}: widget '{sec.get('widget')}' is not registered by any widgets/*.jsx")
    for dtype, cfg in (site.get("drawers") or {}).items():
        if cfg.get("widget") not in registered:
            problems.append(f"drawers.{dtype}: widget '{cfg.get('widget')}' is not registered")
    return jsonify(ok=not problems, problems=problems)


# ---- entrypoint ------------------------------------------------------------
def main() -> None:
    port = int(os.environ.get("PORT", "8765"))
    print(f"annexa IMS dashboard → http://127.0.0.1:{port}")
    print(f"  static : {DASHBOARD_DIR}")
    print(f"  cwd    : {PROJECT_ROOT}")
    print(f"  claude : {CLAUDE_BIN}")
    sys.stdout.flush()
    # threaded=True so a streaming /api/chat doesn't block static asset serving
    app.run(host="127.0.0.1", port=port, threaded=True, debug=False)


if __name__ == "__main__":
    main()
