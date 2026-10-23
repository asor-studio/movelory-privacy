# Movelory Privacy

Privacy information for Movelory, the travel diary that turns your journeys into memories.

The policy explains how Movelory handles your information, including location, photos, videos, maps and subscriptions. It is available in Italian and English, with a language selector on each page.

## Discover the app

- [English](app.html)
- [Italiano](app-it.html)

The app presentation includes eight promotional images per language, feature descriptions and links to the GPS and Recap Studio demos. WebP copies in `assets/promotional/` are optimized from the original Play Store promotional PNGs.

## Privacy policy

- [English](index.html)
- [Italiano](it.html)

## Terms of use

- [English](terms.html)
- [Italiano](terms-it.html)

The terms cover Free and Premium features, subscription renewal and cancellation, your content and support.

## Walkthrough videos

| Page | English (primary) | Italiano |
| --- | --- | --- |
| Background location | [English](location-demo.html) | [Italiano](location-demo-it.html) |
| Recap Studio | [English](recap-demo.html) | [Italiano](recap-demo-it.html) |

English is the default language. Each page lists English first in its language selector and links to the corresponding Italian version. Canonical and `hreflang` links identify the primary URLs, with English as `x-default`. The existing `en.html`, `terms-en.html`, `location-demo-en.html` and `recap-demo-en.html` URLs remain available as English aliases.

Every page includes the same main navigation, with links in the selected language and the current page highlighted. Page contents appear before the article on mobile and can be expanded or collapsed; without JavaScript they remain expanded by default.

To update the shared main navigation after changing its labels or destinations, edit and run `scripts/update-navigation.ps1` with PowerShell. Generated links are saved directly in the HTML, so navigation works without a build step or JavaScript.

## Contact

For privacy questions or support, contact [asorstudio.contact@gmail.com](mailto:asorstudio.contact@gmail.com).

## Ownership

Copyright © 2026 robrosc. All rights reserved.

This repository is publicly available so that people can read Movelory’s privacy information. Its original content and design are proprietary. Reuse requires written permission, except where allowed by law or the terms of the hosting platform. See [LICENSE](LICENSE) for details.

The Geist font belongs to its respective authors and is covered by its own [license](assets/OFL.txt).
