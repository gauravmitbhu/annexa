"""
Whitelabel helper — derive a dashboard theme from a company website.

    python branding.py https://example.com            # print the proposal
    python branding.py https://example.com --write    # also write site/theme.json

Used by app.py (/api/brand/scan, /api/brand/apply) and the Settings page.

What it reads (stdlib only, no JS execution):
  - <meta name="theme-color">, og:site_name, <title>
  - favicon / apple-touch-icon / og:image, and the first <img> that looks like a logo
  - up to MAX_CSS linked stylesheets plus inline <style> and style="" attributes:
      * CSS custom properties whose name suggests a brand colour (--primary, --brand, --accent…)
      * frequency of every other colour literal
      * font-family declarations (body vs h1–h3)

Heuristics, not magic: the proposal is shown in the UI for review and every
value can be edited before it is applied.
"""
from __future__ import annotations

import colorsys
import ipaddress
import json
import re
import socket
import sys
import time
import urllib.parse
import urllib.request
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
THEME_PATH = ROOT / "site" / "theme.json"

UA = "Mozilla/5.0 (compatible; annexa-brand-scan/1.0)"
MAX_BYTES = 1_500_000
MAX_CSS = 6
TIMEOUT = 10

DEFAULT_THEME = {
    "colors": {
        "accent": "#4F46E5", "accent2": "#818CF8", "accentDark": "#3730A3",
        "ink": "#111827", "muted": "#6B7280", "surface": "#F3F4F6",
        "border": "#E5E7EB", "onAccent": "#FFFFFF",
    },
    "fonts": {"body": "Poppins", "display": "Poppins"},
}

# Fonts available from Google Fonts are loaded automatically by the front end.
GENERIC_FONTS = {
    "sans-serif", "serif", "monospace", "system-ui", "ui-sans-serif", "ui-serif",
    "ui-monospace", "-apple-system", "blinkmacsystemfont", "segoe ui", "roboto",
    "helvetica", "helvetica neue", "arial", "inherit", "initial", "unset",
    "apple color emoji", "segoe ui emoji", "segoe ui symbol", "noto color emoji",
    "var", "cursive", "fantasy", "times new roman", "georgia",
}


# ---- safe fetching -----------------------------------------------------------
class ScanError(Exception):
    pass


def _check_public(url: str) -> None:
    """Refuse non-http(s) schemes and hosts that resolve to private, loopback or
    link-local addresses, so the scan endpoint cannot be used to probe the
    network the server sits on."""
    p = urllib.parse.urlparse(url)
    if p.scheme not in ("http", "https") or not p.hostname:
        raise ScanError("only http(s) URLs are supported")
    try:
        infos = socket.getaddrinfo(p.hostname, None)
    except socket.gaierror as e:
        raise ScanError(f"cannot resolve {p.hostname}") from e
    for info in infos:
        ip = ipaddress.ip_address(info[4][0])
        if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved or ip.is_multicast:
            raise ScanError(f"{p.hostname} resolves to a non-public address")


class _SafeRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        _check_public(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


_opener = urllib.request.build_opener(_SafeRedirect)


def fetch(url: str, binary: bool = False):
    _check_public(url)
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with _opener.open(req, timeout=TIMEOUT) as r:
        data = r.read(MAX_BYTES)
        ctype = r.headers.get("Content-Type", "")
        final = r.geturl()
    if binary:
        return data, ctype, final
    charset = (re.search(r"charset=([\w-]+)", ctype) or [None, "utf-8"])[1]
    return data.decode(charset, errors="replace"), ctype, final


# ---- HTML parsing ------------------------------------------------------------
class _Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.meta: dict[str, str] = {}
        self.icons: list[tuple[str, str]] = []
        self.css_links: list[str] = []
        self.styles: list[str] = []
        self.inline: list[str] = []
        self.logos: list[str] = []
        self.title = ""
        self._in_title = self._in_style = False

    def handle_starttag(self, tag, attrs):
        a = {k.lower(): (v or "") for k, v in attrs}
        if a.get("style"):
            self.inline.append(a["style"])
        if tag == "meta":
            key = (a.get("name") or a.get("property") or "").lower()
            if key and a.get("content"):
                self.meta[key] = a["content"]
        elif tag == "link":
            rel = a.get("rel", "").lower()
            if "stylesheet" in rel and a.get("href"):
                self.css_links.append(a["href"])
            if "icon" in rel and a.get("href"):
                self.icons.append((rel, a["href"]))
        elif tag == "img":
            path = urllib.parse.urlparse(a.get("src", "")).path   # not the host: CDNs carry the brand name
            alt = a.get("alt", "") if len(a.get("alt", "")) <= 40 else ""  # long alt = photo caption
            hay = " ".join([a.get("class", ""), a.get("id", ""), alt, path]).lower()
            if "logo" in hay and a.get("src"):
                self.logos.append((a["src"], hay))
        elif tag == "title":
            self._in_title = True
        elif tag == "style":
            self._in_style = True

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        elif tag == "style":
            self._in_style = False

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        elif self._in_style:
            self.styles.append(data)


# ---- colour maths ------------------------------------------------------------
_HEX = re.compile(r"#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b")
_RGB = re.compile(r"rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})")
_VAR = re.compile(r"(--[\w-]*(?:primary|brand|accent|main|theme|highlight)[\w-]*)\s*:\s*([^;}{]+)", re.I)
_FONT = re.compile(r"([^{}]*)\{[^{}]*?font-family\s*:\s*([^;}]+)", re.I)


def _norm(h: str) -> str:
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return "#" + h.upper()


def _rgb(h: str) -> tuple[float, float, float]:
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def _hex(r: float, g: float, b: float) -> str:
    return "#" + "".join(f"{max(0, min(255, round(x * 255))):02X}" for x in (r, g, b))


def _hls(h: str):
    return colorsys.rgb_to_hls(*_rgb(h))


def _is_brandish(h: str) -> bool:
    _, l, s = _hls(h)
    return s > 0.35 and 0.18 < l < 0.78


def _luminance(h: str) -> float:
    def ch(c):
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(c) for c in _rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def _shade(h: str, dl: float, ds: float = 0.0) -> str:
    hh, l, s = _hls(h)
    return _hex(*colorsys.hls_to_rgb(hh, max(0, min(1, l + dl)), max(0, min(1, s + ds))))


def _colours_in(text: str) -> list[str]:
    out = [_norm(m.group(1)) for m in _HEX.finditer(text)]
    out += [_hex(*(int(x) / 255 for x in m.groups())) for m in _RGB.finditer(text)]
    return out


# ---- the scan ----------------------------------------------------------------
def scan(url: str) -> dict:
    if not re.match(r"^https?://", url, re.I):
        url = "https://" + url
    html, _, final = fetch(url)
    page = _Page()
    page.feed(html)

    css_texts = list(page.styles)
    fetched_css = []
    for href in page.css_links[:MAX_CSS]:
        full = urllib.parse.urljoin(final, href)
        try:
            text, _, _ = fetch(full)
            css_texts.append(text)
            fetched_css.append(full)
        except Exception:                                   # noqa: BLE001
            continue
    css = "\n".join(css_texts)

    # 1. declared brand colours (custom properties, theme-color) carry most weight
    weighted: Counter[str] = Counter()
    for name, value in _VAR.findall(css):
        for c in _colours_in(value):
            weighted[c] += 25
    if page.meta.get("theme-color"):
        for c in _colours_in(page.meta["theme-color"]):
            weighted[c] += 40
    # 2. plain frequency of every colour literal
    freq = Counter(_colours_in(css + "\n" + "\n".join(page.inline)))
    for c, n in freq.items():
        weighted[c] += n

    brandish = [c for c, _ in weighted.most_common() if _is_brandish(c)]
    accent = brandish[0] if brandish else DEFAULT_THEME["colors"]["accent"]
    accent2 = next((c for c in brandish[1:] if abs(_hls(c)[0] - _hls(accent)[0]) > 0.04), _shade(accent, 0.15))

    darks = [c for c, _ in freq.most_common(40) if _luminance(c) < 0.04]
    ink = darks[0] if darks else "#111827"
    hue = _hls(accent)[0]
    tint = lambda l, s: _hex(*colorsys.hls_to_rgb(hue, l, s))  # noqa: E731

    colors = {
        "accent": accent,
        "accent2": accent2,
        "accentDark": _shade(accent, -0.15),
        "ink": ink,
        "muted": tint(0.42, 0.06),
        "surface": tint(0.95, 0.12),
        "border": tint(0.87, 0.10),
        "onAccent": "#FFFFFF" if _luminance(accent) < 0.45 else "#111111",
    }

    # fonts: split body-ish selectors from heading selectors
    body_f, head_f = Counter(), Counter()
    for sel, fam in _FONT.findall(css):
        first = fam.split(",")[0].strip().strip("'\"")
        if not first or first.lower() in GENERIC_FONTS or first.startswith("var("):
            continue
        (head_f if re.search(r"\bh[1-3]\b|heading|title|display", sel, re.I) else body_f)[first] += 1
    body_font = body_f.most_common(1)[0][0] if body_f else "Poppins"
    display_font = head_f.most_common(1)[0][0] if head_f else body_font

    # logo / icon candidates, best first
    def absu(u):
        return urllib.parse.urljoin(final, u)
    icons = sorted(page.icons, key=lambda x: ("apple-touch" not in x[0], "svg" not in x[1]))
    # Rank logo <img>s: the site's own name in src/alt/class beats generic "logo"
    # matches (which are often customer logos further down the page), SVG beats
    # raster, and earlier in the document (header) beats later.
    parsed = urllib.parse.urlparse(final)
    stem = (parsed.hostname or "").removeprefix("www.").split(".")[0].lower()
    ranked = sorted(enumerate(page.logos), key=lambda t: (
        -(2 if stem and stem in t[1][1] else 0) - (1 if ".svg" in t[1][0].lower() else 0), t[0]))
    own = [absu(src) for _, (src, hay) in ranked if stem and stem in hay]
    other = [absu(src) for _, (src, hay) in ranked if not (stem and stem in hay)]
    # Without an own-name match, the touch icon is safer than a random "logo"
    # image (sites commonly label customer logos that way).
    logo_candidates = own[:3] + ([absu(u) for _, u in icons[:3]] or [absu("/apple-touch-icon.png"), absu("/favicon.ico")]) + other[:3]
    if page.meta.get("og:image"):
        logo_candidates.append(absu(page.meta["og:image"]))
    favicon = absu(icons[0][1]) if icons else absu("/favicon.ico")

    title = page.meta.get("og:site_name") or re.split(r"\s[|\-–—·]\s", page.title.strip())[0].strip()

    return {
        "source": final,
        "fetchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "brand": {"name": title or parsed.hostname, "domain": parsed.hostname},
        "colors": colors,
        "fonts": {"body": body_font, "display": display_font},
        "logo": logo_candidates[0] if logo_candidates else "",
        "logoCandidates": list(dict.fromkeys(logo_candidates)),
        "favicon": favicon,
        "palette": [c for c, _ in weighted.most_common(16)],
        "stylesheets": fetched_css,
    }


def embed_image(url: str) -> str:
    """Fetch an image and return it as a data: URI so the applied theme does
    not keep hot-linking the company's site."""
    if not url or url.startswith("data:"):
        return url
    data, ctype, _ = fetch(url, binary=True)
    ctype = ctype.split(";")[0].strip() or "image/png"
    if not ctype.startswith("image/"):
        raise ScanError(f"{url} is not an image ({ctype})")
    import base64
    return f"data:{ctype};base64,{base64.b64encode(data).decode()}"


_HEXFULL = re.compile(r"^#[0-9A-Fa-f]{6}$")
_FONTNAME = re.compile(r"^[\w .'-]{1,60}$")


def sanitize(theme: dict) -> dict:
    """Keep only well-formed values before anything is written to disk."""
    colors = {k: v.upper() for k, v in (theme.get("colors") or {}).items()
              if k in DEFAULT_THEME["colors"] and isinstance(v, str) and _HEXFULL.match(v)}
    fonts = {k: v for k, v in (theme.get("fonts") or {}).items()
             if k in ("body", "display") and isinstance(v, str) and _FONTNAME.match(v)}
    out = {
        "colors": {**DEFAULT_THEME["colors"], **colors},
        "fonts": {**DEFAULT_THEME["fonts"], **fonts},
    }
    for k in ("logo", "favicon"):
        v = theme.get(k) or ""
        if isinstance(v, str) and (v.startswith("data:image/") or v.startswith("https://") or v == ""):
            out[k] = v[:2_000_000]
    for k in ("source", "fetchedAt"):
        if isinstance(theme.get(k), str):
            out[k] = theme[k][:500]
    return out


def write_theme(theme: dict) -> dict:
    clean = sanitize(theme)
    THEME_PATH.write_text(json.dumps(clean, indent=2), encoding="utf-8")
    return clean


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    result = scan(sys.argv[1])
    if "--write" in sys.argv:
        for k in ("logo", "favicon"):
            try:
                result[k] = embed_image(result[k])
            except Exception:                               # noqa: BLE001
                result[k] = ""
        write_theme(result)
        print(f"wrote {THEME_PATH}")
    else:
        print(json.dumps(result, indent=2))
