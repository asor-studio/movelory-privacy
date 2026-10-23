"""Refresh static sharing metadata, canonical URLs, sitemap and robots.txt.

Run: python scripts/update-seo.py [--base-url https://example.com/path/]
Social image source: scripts/social-preview.html (1200 x 630).
"""
import argparse
from html import escape, unescape
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import urljoin, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_BASE = 'https://asor-studio.github.io/movelory-privacy/'


class Head(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.meta = {}
        self.links = []
        self.lang = ''
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'html':
            self.lang = attrs['lang']
        elif tag == 'meta':
            self.meta[attrs.get('name', attrs.get('property'))] = attrs.get('content', '')
        elif tag == 'link':
            self.links.append(attrs)


def update(base):
    canonical_pages = {}
    for path in sorted(ROOT.glob('*.html')):
        html = path.read_text(encoding='utf-8-sig')
        html = re.sub(r'  <!-- Social sharing -->.*?  <!-- /Social sharing -->\n', '', html, flags=re.S)
        data = Head(html)
        canonical = next(link['href'] for link in data.links if link.get('rel') == 'canonical')
        canonical_file = Path(urlsplit(canonical).path).name or 'index.html'
        canonical_url = urljoin(base, canonical_file)
        html = re.sub(r'(<link rel="(?:canonical|alternate)"[^>]*href=")([^"]+)(")',
                      lambda m: m[1] + urljoin(base, Path(urlsplit(m[2]).path).name or 'index.html') + m[3], html)
        title = unescape(re.search(r'<title>(.*?)</title>', html, re.S)[1])
        description = data.meta['description']
        italian = data.lang == 'it'
        image = urljoin(base, f'assets/social/movelory-{data.lang}.png')
        image_alt = ('Movelory: ogni viaggio merita una storia. Anteprima dell’app con viaggi, foto e ricordi.'
                     if italian else 'Movelory: every journey deserves a story. App preview with journeys, photos and memories.')
        tags = [('property', 'og:type', 'website'), ('property', 'og:site_name', 'Movelory'),
                ('property', 'og:title', title), ('property', 'og:description', description),
                ('property', 'og:url', canonical_url), ('property', 'og:locale', 'it_IT' if italian else 'en_US'),
                ('property', 'og:locale:alternate', 'en_US' if italian else 'it_IT'),
                ('property', 'og:image', image), ('property', 'og:image:secure_url', image),
                ('property', 'og:image:type', 'image/png'), ('property', 'og:image:width', '1200'),
                ('property', 'og:image:height', '630'), ('property', 'og:image:alt', image_alt),
                ('name', 'twitter:card', 'summary_large_image'), ('name', 'twitter:title', title),
                ('name', 'twitter:description', description), ('name', 'twitter:image', image),
                ('name', 'twitter:image:alt', image_alt)]
        block = '  <!-- Social sharing -->\n' + ''.join(
            f'  <meta {attr}="{key}" content="{escape(value, quote=True)}">\n' for attr, key, value in tags
        ) + '  <!-- /Social sharing -->\n'
        html = html.replace('</head>', block + '</head>')
        path.write_text(html, encoding='utf-8', newline='\n')
        # Keep demonstration pages marked noindex and avoid listing duplicate aliases.
        if path.name == canonical_file and 'noindex' not in data.meta.get('robots', ''):
            canonical_pages[canonical_url] = [link for link in data.links if link.get('rel') == 'alternate']

    ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'
    xhtml = 'http://www.w3.org/1999/xhtml'
    ET.register_namespace('', ns)
    ET.register_namespace('xhtml', xhtml)
    sitemap = ET.Element(f'{{{ns}}}urlset')
    for url, alternatives in sorted(canonical_pages.items()):
        entry = ET.SubElement(sitemap, f'{{{ns}}}url')
        ET.SubElement(entry, f'{{{ns}}}loc').text = url
        for link in alternatives:
            href = urljoin(base, Path(urlsplit(link['href']).path).name)
            ET.SubElement(entry, f'{{{xhtml}}}link', rel='alternate', hreflang=link['hreflang'], href=href)
    ET.indent(sitemap, space='  ')
    ET.ElementTree(sitemap).write(ROOT / 'sitemap.xml', encoding='utf-8', xml_declaration=True)
    (ROOT / 'robots.txt').write_text(
        '# Crawlers read robots.txt at the domain root, not a project subdirectory.\n'
        f'User-agent: *\nAllow: /\n\nSitemap: {base}sitemap.xml\n', encoding='utf-8')
    print(f'Updated sharing metadata on {len(list(ROOT.glob("*.html")))} pages; {len(canonical_pages)} canonical sitemap entries.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', default=DEFAULT_BASE)
    base = parser.parse_args().base_url.rstrip('/') + '/'
    if urlsplit(base).scheme != 'https' or not urlsplit(base).netloc:
        parser.error('--base-url must be an absolute HTTPS URL')
    update(base)
