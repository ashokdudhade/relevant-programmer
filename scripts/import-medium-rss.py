#!/usr/bin/env python3
"""Import Medium RSS feed articles into Astro blog content."""
from __future__ import annotations

import html
import re
import sys
import xml.etree.ElementTree as ET
from datetime import datetime
from email.utils import parsedate_to_datetime
from pathlib import Path

NS = {"content": "http://purl.org/rss/1.0/modules/content/"}


def slugify(title: str) -> str:
    slug = title.lower()
    slug = slug.replace("'", "")
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")


def html_to_markdown(raw_html: str) -> str:
    text = raw_html or ""
    # Remove Medium tracking pixel
    text = re.sub(r'<img[^>]*medium\.com/_/stat[^>]*>', "", text, flags=re.I)
    # Figures / images
    text = re.sub(
        r"<figure>.*?<img[^>]*src=\"([^\"]+)\"[^>]*/?>.*?(?:<figcaption>(.*?)</figcaption>)?.*?</figure>",
        lambda m: f"\n\n![{html.unescape(re.sub('<[^>]+>', '', m.group(2) or '')).strip()}]({m.group(1)})\n\n",
        text,
        flags=re.S | re.I,
    )
    text = re.sub(r"<img[^>]*src=\"([^\"]+)\"[^>]*/?>", r"\n\n![](\1)\n\n", text, flags=re.I)
    # Headings
    for i in range(6, 0, -1):
        text = re.sub(
            rf"<h{i}[^>]*>(.*?)</h{i}>",
            lambda m, level=i: "\n\n" + ("#" * level) + " " + strip_tags(m.group(1)).strip() + "\n\n",
            text,
            flags=re.S | re.I,
        )
    # Strong/em
    text = re.sub(r"<strong[^>]*>(.*?)</strong>", r"**\1**", text, flags=re.S | re.I)
    text = re.sub(r"<b[^>]*>(.*?)</b>", r"**\1**", text, flags=re.S | re.I)
    text = re.sub(r"<em[^>]*>(.*?)</em>", r"*\1*", text, flags=re.S | re.I)
    # Links
    text = re.sub(
        r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>',
        lambda m: f"[{strip_tags(m.group(2)).strip()}]({m.group(1)})",
        text,
        flags=re.S | re.I,
    )
    # Lists
    text = re.sub(r"<li[^>]*>(.*?)</li>", lambda m: f"\n* {strip_tags(m.group(1)).strip()}", text, flags=re.S | re.I)
    text = re.sub(r"</?(?:ul|ol)[^>]*>", "\n", text, flags=re.I)
    # Code blocks
    text = re.sub(
        r"<pre[^>]*><code[^>]*>(.*?)</code></pre>",
        lambda m: "\n\n```\n" + html.unescape(strip_tags(m.group(1))) + "\n```\n\n",
        text,
        flags=re.S | re.I,
    )
    text = re.sub(
        r"<code[^>]*>(.*?)</code>",
        lambda m: "`" + html.unescape(strip_tags(m.group(1))) + "`",
        text,
        flags=re.S | re.I,
    )
    # Paragraphs and breaks
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"<p[^>]*>(.*?)</p>", lambda m: "\n\n" + strip_tags(m.group(1)).strip() + "\n", text, flags=re.S | re.I)
    # Strip remaining tags
    text = strip_tags(text)
    text = html.unescape(text)
    # Cleanup whitespace
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]+\n", "\n", text)
    return text.strip() + "\n"


def strip_tags(value: str) -> str:
    return re.sub(r"<[^>]+>", "", value or "")


def extract_description(raw_html: str, max_len: int = 160) -> str:
    plain = strip_tags(raw_html or "")
    plain = html.unescape(re.sub(r"\s+", " ", plain)).strip()
    if len(plain) <= max_len:
        return plain
    return plain[: max_len - 3].rsplit(" ", 1)[0] + "..."


def format_category(categories: list[str]) -> str:
    if not categories:
        return "General"
    cat = categories[0].replace("-", " ")
    return cat.title() if cat.islower() else cat


def format_tags(categories: list[str]) -> list[str]:
    return [c.replace("-", " ").title() if c.islower() else c for c in categories]


def build_frontmatter(title: str, date: datetime, path: str, category: str, tags: list[str], description: str) -> str:
    tag_lines = "\n".join(f'  - "{t}"' for t in tags)
    iso_date = date.strftime("%Y-%m-%dT%H:%M:%S.000Z")
    return f"""---
title: {json_escape(title)}
date: "{iso_date}"
kind: post
draft: false
path: "{path}"
category: {json_escape(category)}
tags:
{tag_lines}
description: {json_escape(description)}
---
"""


def json_escape(value: str) -> str:
    escaped = value.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{escaped}"'


def import_feed(feed_path: Path, output_dir: Path) -> None:
    tree = ET.parse(feed_path)
    channel = tree.getroot().find("channel")
    items = channel.findall("item")
    output_dir.mkdir(parents=True, exist_ok=True)

    created = 0
    skipped = 0
    for item in items:
        title = (item.findtext("title") or "").strip()
        pub_raw = item.findtext("pubDate")
        date = parsedate_to_datetime(pub_raw)
        categories = [(c.text or "").strip() for c in item.findall("category") if (c.text or "").strip()]
        content_el = item.find("content:encoded", NS)
        raw_html = content_el.text if content_el is not None else ""
        slug = slugify(title)
        filename = output_dir / f"{slug}.md"
        path = f"/posts/{slug}/"

        if filename.exists():
            print(f"SKIP (exists): {title}")
            skipped += 1
            continue

        body = html_to_markdown(raw_html)
        description = extract_description(raw_html)
        category = format_category(categories)
        tags = format_tags(categories) or [category]
        frontmatter = build_frontmatter(title, date, path, category, tags, description)
        filename.write_text(frontmatter + "\n" + body, encoding="utf-8")
        print(f"CREATED: {title} ({date.date()}) -> {filename.name}")
        created += 1

    print(f"\nDone: {created} created, {skipped} skipped, {len(items)} total in feed")


if __name__ == "__main__":
    feed = Path(sys.argv[1])
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("src/content/blog")
    import_feed(feed, out)
