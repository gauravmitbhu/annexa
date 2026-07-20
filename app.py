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
DASHBOARD_DIR = Path(__file__).resolve().parent          # .../isms-dashboard
PROJECT_ROOT  = DASHBOARD_DIR.parent                     # .../isms

CLAUDE_BIN = shutil.which("claude") or "claude"

# In-memory record of which thread IDs have been initialized in Claude Code's
# session store. First send uses --session-id, subsequent use --resume.
_seen_threads: set[str] = set()
_seen_lock = threading.Lock()

# ---- system prompt ---------------------------------------------------------
APPEND_SYSTEM_PROMPT = """
You are the AI co-pilot for Acme's internal ISMS (Information Security
Management System) dashboard. Acme is a fictional B2B SaaS analytics
company; the user is Alex (CISO). All data in this demo is fictional.

Context:
- Standard: ISO/IEC 27001:2022. 93 Annex A controls. 1 N/A (8.17 Clock Sync).
- External certification body: CertCo. Next surveillance audit: June 2026.
- Workforce: ~12. Active roles: Alex (CISO), Sam (CTO), Jordan (COO),
  Casey (Co-founder), Morgan (Data Scientist), Riley (Head of Product).
  External DPO: Dana.
- Highest open gaps: 8.10 Information deletion (HIGH, owner Sam),
  5.30 BC Planner (MED, owner Jordan), several unapproved draft policies,
  and pending exception requests (EXC-01..EXC-10).
- Connected sources (demo integrations): ticketing, document store, GitLab,
  Elastic, MDM, LMS.

You have read-only access to the local ISMS working tree (the project root
this server runs from). Use Read/Grep/Glob to consult any demo artifacts
present there, e.g.:
  - a statement of applicability spreadsheet (SoA)
  - draft policy documents
  - an exception-request register (EXC-01..EXC-10)
  - README.md (project context)

Style:
- Be a colleague to a senior CISO: direct, concise, no hedging.
- Cite sources when you reference files (e.g. "SoA v1.2, row 47").
- For audit prep, drafting, or risk questions, lead with the actionable answer.
- Never invent control IDs, ticket numbers, or ownership — read the file.
- This is a read-only context. Do not propose Edit/Write actions.
""".strip()

# Tools we let Claude Code use in this surface.
ALLOWED_TOOLS = "Read Grep Glob"

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
    """Returns max mtime of all .jsx/.css files — used by the browser for live-reload polling."""
    exts = {".jsx", ".css", ".html"}
    ts = max(
        (p.stat().st_mtime for p in DASHBOARD_DIR.iterdir() if p.suffix in exts),
        default=0,
    )
    return jsonify(v=ts)


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


# ---- Claude bridge ---------------------------------------------------------
VALID_MODELS = {
    "claude-fable-5",
    "claude-opus-4-8",
    "claude-sonnet-4-6",
    "claude-haiku-4-5-20251001",
}

def _build_args(user_msg: str, thread_id: str, model: str | None = None) -> list[str]:
    with _seen_lock:
        first = thread_id not in _seen_threads
        _seen_threads.add(thread_id)

    args = [
        CLAUDE_BIN,
        "-p", user_msg,
        "--output-format", "stream-json",
        "--include-partial-messages",
        "--verbose",                       # required for stream-json output
        "--allowedTools", ALLOWED_TOOLS,
        "--append-system-prompt", APPEND_SYSTEM_PROMPT,
        "--add-dir", str(PROJECT_ROOT),
    ]
    if model and model in VALID_MODELS:
        args += ["--model", model]
    if first:
        args += ["--session-id", thread_id]
    else:
        args += ["--resume", thread_id]
    return args


def _sse(event_obj: dict) -> bytes:
    return f"data: {json.dumps(event_obj)}\n\n".encode("utf-8")


def _stream_claude(user_msg: str, thread_id: str, model: str | None = None) -> Iterable[bytes]:
    """
    Spawn `claude -p` and translate its stream-json output to SSE the
    frontend can consume. We forward only what the UI needs:
      - {type:"delta", text:"..."} — text token
      - {type:"tool",  name:"Read", input:{...}} — tool call (for citations)
      - {type:"done"}               — terminal
      - {type:"error", message:"..."} — non-recoverable
    """
    args = _build_args(user_msg, thread_id, model)
    try:
        proc = subprocess.Popen(
            args,
            cwd=str(PROJECT_ROOT),
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
    if not msg:
        return jsonify(error="empty message"), 400
    if not thread_id:
        return jsonify(error="missing threadId"), 400

    return Response(
        _stream_claude(msg, thread_id, model),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",   # disable nginx-style buffering if any
            "Connection": "keep-alive",
        },
    )


# ---- entrypoint ------------------------------------------------------------
def main() -> None:
    port = int(os.environ.get("PORT", "8765"))
    print(f"Acme ISMS Dashboard → http://127.0.0.1:{port}")
    print(f"  static : {DASHBOARD_DIR}")
    print(f"  cwd    : {PROJECT_ROOT}")
    print(f"  claude : {CLAUDE_BIN}")
    sys.stdout.flush()
    # threaded=True so a streaming /api/chat doesn't block static asset serving
    app.run(host="127.0.0.1", port=port, threaded=True, debug=False)


if __name__ == "__main__":
    main()
