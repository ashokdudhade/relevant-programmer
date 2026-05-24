#!/usr/bin/env python3
"""Download external blog images and rewrite markdown to local paths."""
from __future__ import annotations

import hashlib
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

IMAGE_URL_RE = re.compile(r"!\[([^\]]*)\]\((https?://[^)]+)\)")
MD_IMAGE_RE = re.compile(r"!\[[^\]]*\]\((/images/blog/[^)]+)\)")


def guess_extension(url: str, content_type: str | None) -> str:
    lowered = url.lower()
    for ext in (".png", ".jpg", ".jpeg", ".webp", ".gif"):
        if ext in lowered:
            return ".jpg" if ext == ".jpeg" else ext
    if content_type:
        if "png" in content_type:
            return ".png"
        if "webp" in content_type:
            return ".webp"
        if "gif" in content_type:
            return ".gif"
    return ".jpg"


def safe_filename(url: str, ext: str) -> str:
    digest = hashlib.sha1(url.encode("utf-8")).hexdigest()[:12]
    slug = re.sub(r"[^a-z0-9]+", "-", url.split("/")[-1].split("?")[0].lower()).strip("-")
    slug = slug[:40] if slug else "image"
    return f"{slug}-{digest}{ext}"


def download(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        content_type = resp.headers.get("Content-Type")
        data = resp.read()
    if not dest.suffix:
        dest = dest.with_suffix(guess_extension(url, content_type))
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return dest


def localize_markdown(content: str, post_slug: str, images_dir: Path, cache: dict[str, str]) -> tuple[str, int]:
    replacements = 0

    def replace(match: re.Match[str]) -> str:
        nonlocal replacements
        alt = match.group(1)
        url = match.group(2)
        if url.startswith("/images/blog/"):
            return match.group(0)
        if url not in cache:
            ext = guess_extension(url, None)
            filename = safe_filename(url, ext)
            post_dir = images_dir / post_slug
            dest = post_dir / filename
            if not dest.exists():
                try:
                    actual = download(url, dest)
                    cache[url] = f"/images/blog/{post_slug}/{actual.name}"
                    print(f"  downloaded: {actual.name}")
                except urllib.error.URLError as exc:
                    print(f"  FAILED: {url} ({exc})")
                    return match.group(0)
            else:
                cache[url] = f"/images/blog/{post_slug}/{dest.name}"
        replacements += 1
        return f"![{alt}]({cache[url]})"

    return IMAGE_URL_RE.sub(replace, content), replacements


def main(blog_dir: Path, images_dir: Path) -> None:
    cache: dict[str, str] = {}
    total = 0
    files = sorted(blog_dir.glob("*.md"))
    for md_file in files:
        text = md_file.read_text(encoding="utf-8")
        if "http://" not in text and "https://" not in text:
            continue
        post_slug = md_file.stem
        print(f"Processing {md_file.name}")
        updated, count = localize_markdown(text, post_slug, images_dir, cache)
        if count:
            md_file.write_text(updated, encoding="utf-8")
            total += count
    print(f"\nLocalized {total} image references across {len(files)} posts")


if __name__ == "__main__":
    blog = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("src/content/blog")
    images = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("public/images/blog")
    main(blog, images)
