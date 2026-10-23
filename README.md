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

## Contact

For privacy questions or support, contact [asorstudio.contact@gmail.com](mailto:asorstudio.contact@gmail.com).

## Ownership

Copyright © 2026 robrosc. All rights reserved.

This repository is publicly available so that people can read Movelory’s privacy information. Its original content and design are proprietary. Reuse requires written permission, except where allowed by law or the terms of the hosting platform. See [LICENSE](LICENSE) for details.

The Geist font belongs to its respective authors and is covered by its own [license](assets/OFL.txt).
