#!/usr/bin/env python3
import xml.etree.ElementTree as ET
import sys

tree = ET.parse(sys.argv[1])
channel = tree.getroot().find("channel")
ns = {"content": "http://purl.org/rss/1.0/modules/content/"}
items = channel.findall("item")
print(f"Total articles: {len(items)}\n")
for i, item in enumerate(items, 1):
    title = item.findtext("title")
    pub = item.findtext("pubDate")
    link = item.findtext("link")
    cats = [c.text for c in item.findall("category")]
    content = item.find("content:encoded", ns)
    clen = len(content.text) if content is not None and content.text else 0
    print(f"{i}. {title}")
    print(f"   Date: {pub}")
    print(f"   Link: {link}")
    print(f"   Categories: {', '.join(cats)}")
    print(f"   Content length: {clen}")
    print()
