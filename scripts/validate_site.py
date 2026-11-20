#!/usr/bin/env python3
"""Dependency-free sanity checks for the static website."""
from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML_FILE = ROOT / "index.html"
errors: list[str] = []

class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids: set[str] = set()
        self.links: list[str] = []
        self.labels: set[str] = set()
        self.forms = 0
        self.has_title = False
        self.has_viewport = False
        self.has_lang = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html" and attrs.get("lang"):
            self.has_lang = True
        if tag == "title":
            self.has_title = True
        if tag == "meta" and attrs.get("name") == "viewport":
            self.has_viewport = True
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag == "form":
            self.forms += 1
        if tag == "label" and attrs.get("for"):
            self.labels.add(attrs["for"])

if not HTML_FILE.exists():
    errors.append("Missing index.html")
else:
    source = HTML_FILE.read_text(encoding="utf-8")
    parser = SiteParser()
    try:
        parser.feed(source)
        parser.close()
    except Exception as exc:
        errors.append(f"HTML parser error: {exc}")
    if not parser.has_lang:
        errors.append("Missing html lang attribute")
    if not parser.has_title:
        errors.append("Missing page title")
    if not parser.has_viewport:
        errors.append("Missing responsive viewport meta tag")
    for href in parser.links:
        if href.startswith("#") and href[1:] not in parser.ids:
            errors.append(f"Broken in-page link: {href}")
    if parser.forms < 1:
        errors.append("No enquiry form found")
    for required in ("leadForm", "name", "phone", "service"):
        if required not in parser.ids:
            errors.append(f"Missing required enquiry element: #{required}")
    if "wa.me/" not in source:
        errors.append("WhatsApp enquiry destination not found")
    logo = ROOT / "assets" / "usha-logo.svg"
    if not logo.exists():
        errors.append("Missing assets/usha-logo.svg")
    elif "<svg" not in logo.read_text(encoding="utf-8"):
        errors.append("Logo asset does not contain an SVG root element")

if errors:
    print("Website validation failed:")
    for error in errors:
        print(f" - {error}")
    sys.exit(1)

print("Website validation passed.")
