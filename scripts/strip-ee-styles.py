# -*- coding: utf-8 -*-
from pathlib import Path
import re

path = Path(r"C:\Users\Alberto\trujillo-guides\public\guides\enterprise-email\index.html")
html = path.read_text(encoding="utf-8")

# Exact style string -> extra class
MAP = {
    "display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-secondary, #71717a);": "ee-crumb",
    "color:var(--text-secondary, #71717a);text-decoration:none;": "ee-crumb-link",
    "opacity:0.4;": "ee-crumb-sep",
    "color:#e5e5e5;": "ee-crumb-current",
    "display:none;": "hidden",
    "color:#22c55e;": "text-ok",
    "color:#22c55e;font-weight:700;": "text-ok",
    "display:flex;align-items:center;gap:10px;": "ee-row",
    "font-family:var(--font-mono);font-size:10px;color:#22c55e;": "ee-label ee-label-ok",
    "font-family:var(--font-mono);font-size:10px;color:#38bdf8;": "ee-label ee-label-sky",
    "font-family:var(--font-mono);font-size:10px;color:#a855f7;": "ee-label ee-label-violet",
    "background:#050505;border-radius:8px;overflow:hidden;": "ee-proof",
    "background:#0d0d0d;border-bottom:1px solid #1a1a1a;": "ee-preview",
    "background:#ff5f56;": "mockup-dot-r",
    "background:#ffbd2e;": "mockup-dot-y",
    "background:#27c93f;": "mockup-dot-g",
    "width:30px;": "ee-spacer",
    "background:#000000;border:1px solid #1f1f1f;border-radius:8px;max-width:520px;margin:0 auto;padding:32px 28px;text-align:center;": "ee-mail-card",
    "display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:24px;": "ee-mail-brand",
    "border-radius:50%;border:1px solid #222;": "ee-mail-avatar",
    "font-family:ui-monospace,monospace;font-size:13px;font-weight:800;letter-spacing:0.16em;color:#fff;": "ee-mail-wordmark",
    "font-size:18px;font-weight:700;color:#ffffff;margin-bottom:8px;": "ee-mail-title",
    "font-size:13px;color:#a1a1aa;line-height:1.5;margin-bottom:20px;": "ee-mail-copy",
    "background:#050505;border:1px solid #262626;border-radius:6px;padding:18px 24px;max-width:320px;margin:0 auto 24px;": "ee-mail-code",
    "font-family:ui-monospace,monospace;font-size:32px;font-weight:800;color:#ffffff;letter-spacing:12px;text-indent:12px;": "ee-mail-otp",
    "display:inline-block;padding:10px 26px;background:#ffffff;color:#000000;font-size:12px;font-weight:700;text-decoration:none;border-radius:9999px;": "ee-mail-cta",
    "border-top:1px solid #1a1a1a;margin-top:28px;padding-top:16px;font-family:ui-monospace,monospace;font-size:10px;color:#52525b;": "ee-mail-foot",
}

STYLE_RE = re.compile(r'\sstyle="([^"]*)"', re.I)
MOUSE_RE = re.compile(r'\s(onmouseover|onmouseout)="[^"]*"', re.I)


def inject_class(tag, extra):
    if 'class="' in tag:
        return re.sub(r'class="([^"]*)"', lambda m: f'class="{m.group(1)} {extra}"', tag, count=1)
    return tag.replace("<", f'<{extra and ""}', 1) if False else tag[:-1] + f' class="{extra}">' if tag.endswith(">") else tag


def add_class(full, extra):
    # full is the whole opening tag including style
    if re.search(r'\bclass="', full):
        return re.sub(r'class="([^"]*)"', lambda m: f'class="{m.group(1)} {extra}"', full, count=1)
    return re.sub(r"<([a-zA-Z0-9]+)", lambda m: f'<{m.group(1)} class="{extra}"', full, count=1)


def repl_style(m):
    raw = m.group(1).strip()
    # normalize whitespace
    key = raw.replace(" ", "")
    extra = MAP.get(raw) or MAP.get(key)
    if not extra:
        # try without spaces
        compact = re.sub(r"\s+", "", raw)
        extra = MAP.get(compact)
    return ("__KEEP__" + extra) if extra else "__DROP__"


# We need tag-level rewrite: find tags that contain style=
TAG_RE = re.compile(r"<[^>]+>")


def rewrite_tag(tag):
    if tag.startswith("</") or tag.startswith("<!"):
        return tag
    sm = STYLE_RE.search(tag)
    if not sm:
        tag = MOUSE_RE.sub("", tag)
        return tag
    raw = sm.group(1).strip()
    compact = re.sub(r"\s+", "", raw)
    extra = MAP.get(raw) or MAP.get(compact)
    tag = STYLE_RE.sub("", tag)
    tag = MOUSE_RE.sub("", tag)
    if extra:
        if re.search(r'\bclass="', tag):
            tag = re.sub(r'class="([^"]*)"', lambda m: f'class="{m.group(1)} {extra}"', tag, count=1)
        else:
            tag = re.sub(r"<([a-zA-Z0-9:-]+)", lambda m: f'<{m.group(1)} class="{extra}"', tag, count=1)
    return tag


html = TAG_RE.sub(lambda m: rewrite_tag(m.group(0)), html)

# progress bar
html = html.replace('<div id="progress-bar"></div>', '<progress id="progress-bar" max="100" value="0"></progress>')
html = html.replace(
    '<div class="checklist-bar-fill" id="checklist-fill-en"></div>',
    '<progress class="checklist-bar-fill" id="checklist-fill-en" max="100" value="0"></progress>',
)
html = html.replace(
    '<div class="checklist-bar-fill" id="checklist-fill-es"></div>',
    '<progress class="checklist-bar-fill" id="checklist-fill-es" max="100" value="0"></progress>',
)

left = re.findall(r'\sstyle="[^"]*"', html)
path.write_text(html, encoding="utf-8")
print("remaining style attrs:", len(left))
for s in left[:20]:
    print(s)
