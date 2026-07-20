#!/usr/bin/env bash
# Serve the ISMS dashboard + Claude Code bridge.
# Uses the project venv at ../venv if Flask is installed there;
# otherwise installs Flask into it on first run.
set -e
cd "$(dirname "$0")"

VENV="../venv"
PY="$VENV/bin/python3"

if [[ ! -x "$PY" ]]; then
  echo "venv not found at $VENV — create it first: python3 -m venv ../venv"
  exit 1
fi

if ! "$PY" -c "import flask" 2>/dev/null; then
  echo "Installing flask into $VENV…"
  "$VENV/bin/pip" install -q -r requirements.txt
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "warning: 'claude' not on PATH — the AI panel will fail until it is."
fi

PORT="${PORT:-8765}"
exec "$PY" app.py
