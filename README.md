# Movelory Privacy

Privacy information for Movelory, the travel diary that turns your journeys into memories.

The policy explains how Movelory handles your information, including location, photos, videos, maps and subscriptions. It is available in Italian and English, with a language selector on each page.

## Discover the app

- [English](app.html)
- [Italiano](app-it.html)

The app presentation includes eight promotional images per language, feature descriptions and links to the GPS and Recap Studio demos. Its circular feature carousel keeps adjacent screens visible and centers the selected screen at a larger size. The last screen continues into the first, and vice versa, with no visible scrollbar. Visual copies at either edge are hidden from assistive technologies and omitted from print. Navigation buttons, previous/next controls, touch scrolling, mouse dragging and keyboard controls stay synchronized. Without JavaScript all feature cards remain available as a static gallery. WebP copies in `assets/promotional/` are optimized from the original Play Store promotional PNGs.

## Privacy policy

- [English](index.html)
- [Italiano](it.html)

## Terms of use

- [English](terms.html)
- [Italiano](terms-it.html)

The terms cover Free and Premium features, subscription renewal and cancellation, your content and support.

## Cookies and the website

- [English](cookies.html)
- [Italiano](cookies-it.html)

Each page displays a dismissible informational banner and links to the cookie information in its menu and footer. The portal code uses no cookies, localStorage, analytics or trackers. After dismissal, sessionStorage stores only `movelory.cookieNotice.dismissed.v1 = 1` for the current tab session. Resources are served locally from the site; external provider links are ordinary links. The banner is informational: closing it with × keeps it hidden across pages and reloads in the same tab session. A persistent Cookie info tab lets visitors reopen the notice without clearing their saved dismissal. The flag is not transmitted to a server. If sessionStorage is unavailable, dismissal still works for the current page. Without JavaScript the notice remains readable in the page. The cookie information distinguishes website behavior from the mobile app and technical data handled by hosting providers.

## Walkthrough videos

| Page | English (primary) | Italiano |
| --- | --- | --- |
| Background location | [English](location-demo.html) | [Italiano](location-demo-it.html) |
| Recap Studio | [English](recap-demo.html) | [Italiano](recap-demo-it.html) |

English is the default language. Each page lists English first in its language selector and links to the corresponding Italian version. Canonical and `hreflang` links identify the primary URLs, with English as `x-default`. The existing `en.html`, `terms-en.html`, `location-demo-en.html` and `recap-demo-en.html` URLs remain available as English aliases.

Every page includes the same main navigation, with links in the selected language and the current page highlighted. On mobile, the sticky toolbar provides separate Menu and On this page buttons. Both open animated modal panels above the page, with a dimmed backdrop, internal scrolling, keyboard focus containment, Escape and outside-click dismissal. Closing restores the reading position; choosing a section scrolls it into view below the toolbar. Reduced-motion preferences disable animations. Desktop navigation remains expanded. Without JavaScript, the main menu remains expanded and page contents can be opened manually.

To update the shared main navigation after changing its labels or destinations, edit and run `scripts/update-navigation.ps1` with PowerShell. Generated links are saved directly in the HTML, so navigation works without a build step or JavaScript.

## Search and social sharing

All root HTML pages include static Open Graph and Twitter/X large-image metadata, localized titles, descriptions, image alternative text and absolute public canonical and language URLs. Social preview images are `assets/social/movelory-en.png` and `assets/social/movelory-it.png` (1200 × 630), built from the app icon and existing promotional images. Crawlers can read this metadata without JavaScript.

Run `python scripts/update-seo.py` after changing titles or descriptions. The default public base URL is `https://asor-studio.github.io/movelory-privacy/`; pass `--base-url https://example.com/path/` if hosting changes. The command also updates `sitemap.xml`, excluding duplicate English aliases and demo pages marked `noindex`, and writes a `robots.txt` template. On GitHub project Pages, the repository's `robots.txt` is served below the project path; only a domain-root `robots.txt` controls crawlers. The sitemap can be submitted separately to a search engine.

To rebuild share images, run `node scripts/render-social-previews.cjs` with Playwright available. Optional environment variables `PLAYWRIGHT_MODULE` and `CHROMIUM_EXECUTABLE` select an installed module and browser. The editable image layout is `scripts/social-preview.html`; it is a rendering source, not a public content page.

Publish both the HTML and image files before testing actual social previews. Preview services may cache earlier metadata and images; local files and localhost links cannot be fetched by public social crawlers. Individual platforms control the final card layout.

## Contact

For privacy questions or support, contact [asorstudio.contact@gmail.com](mailto:asorstudio.contact@gmail.com).

## Ownership

Copyright © 2026 robrosc. All rights reserved.

This repository publishes Movelory’s information website, legal pages and promotional materials. It does not contain the Flutter application's source project. Its original code, design, text and media are proprietary to the extent owned by robrosc. Public visibility is not an open-source license or permission to republish, adapt or reuse these materials. Reuse requires written permission, except where allowed by law or the applicable GitHub terms. See [LICENSE](LICENSE) for details.

Public repositories can be read and downloaded, and GitHub's terms permit viewing and forking through its service. The proprietary license reserves rights outside those permissions; it does not technically prevent copying. See [GitHub's licensing guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository).

Public visibility does not grant write access to this repository. Direct pushes and merges require the appropriate repository permissions; a pull request from a fork is a proposed change rather than a change to the published site. See [GitHub's repository roles](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization).

The Geist font belongs to its respective authors and is covered by its own [license](assets/OFL.txt).
