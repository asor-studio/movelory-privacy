# Run from any directory to refresh shared navigation in all static HTML pages.
$root = Split-Path $PSScriptRoot -Parent
$utf8 = [System.Text.UTF8Encoding]::new($false)
foreach ($file in Get-ChildItem -LiteralPath $root -Filter '*.html') {
  $html = [IO.File]::ReadAllText($file.FullName)
  $italian = $html.Contains('<html lang="it"')
  $pages = if ($italian) {
    @(@('app-it.html', 'Scopri Movelory'), @('it.html', 'Informativa privacy'), @('terms-it.html', 'Condizioni d&#8217;uso'), @('location-demo-it.html', 'Registrazione GPS'), @('recap-demo-it.html', 'Recap Studio'), @('cookies-it.html', 'Informativa cookie'))
  } else {
    @(@('app.html', 'Discover Movelory'), @('index.html', 'Privacy policy'), @('terms.html', 'Terms of use'), @('location-demo.html', 'GPS recording'), @('recap-demo.html', 'Recap Studio'), @('cookies.html', 'Cookie information'))
  }
  $canonical = [regex]::Match($html, '<link rel="canonical" href="([^"]+)"').Groups[1].Value
  $label = if ($italian) { 'Menu principale' } else { 'Main navigation' }
  $items = foreach ($page in $pages) {
    $current = if ($page[0] -eq $canonical) { ' aria-current="page"' } else { '' }
    '<li><a href="' + $page[0] + '"' + $current + '>' + $page[1] + '</a></li>'
  }
  $active = ($pages | Where-Object { $_[0] -eq $canonical })[1]
  $languages = [regex]::Match($html, '<div class="languages".*?</div>', 'Singleline').Value
  $menu = '<nav class="site-nav" aria-label="' + $label + '"><details class="site-menu" open><summary><span class="menu-label">Menu</span><span class="menu-current">' + $active + '</span></summary><div class="menu-panel"><ul>' + ($items -join '') + '</ul><div class="mobile-languages">' + $languages + '</div></div></details></nav>'
  $html = [regex]::Replace($html, '\s*<nav class="site-nav".*?</nav>', '', 'Singleline')
  $html = $html.Replace('</header>', "</header>`n  $menu")
  $html = [regex]::Replace($html, '<nav aria-label="([^"]+)"><h2>(.*?)</h2>(.*?)</nav>', {
    param($match)
    '<nav class="page-nav" aria-label="' + $match.Groups[1].Value + '"><details class="page-contents" open><summary>' + $match.Groups[2].Value + '</summary>' + $match.Groups[3].Value + '</details></nav>'
  }, 'Singleline')
  if (!$html.Contains('src="navigation.js"')) {
    $html = $html.Replace('</head>', "  <script src=`"navigation.js`" defer></script>`n</head>")
  }
  $html = [regex]::Replace($html, '<details class="page-contents"(?: open)?>(<summary>.*?</summary>)(.*?)</details>', {
    param($match)
    $content = $match.Groups[2].Value
    if (!$content.StartsWith('<div class="contents-panel">')) {
      $content = '<div class="contents-panel">' + $content + '</div>'
    }
    '<details class="page-contents">' + $match.Groups[1].Value + $content + '</details>'
  }, 'Singleline')
  $cookiePage = if ($italian) { 'cookies-it.html' } else { 'cookies.html' }
  $cookieLabel = if ($italian) { 'Informativa cookie' } else { 'Cookie information' }
  $cookieText = if ($italian) { 'Questo portale non utilizza cookie o strumenti di tracciamento per il funzionamento e la navigazione.' } else { 'This portal does not use cookies or tracking tools for its operation or your browsing.' }
  $closeLabel = if ($italian) { 'Chiudi avviso sui cookie' } else { 'Close cookie notice' }
  $notice = '<aside class="cookie-notice" aria-label="' + $cookieLabel + '"><p>' + $cookieText + ' <a href="' + $cookiePage + '">' + $cookieLabel + '</a>.</p><button type="button" class="cookie-close" aria-label="' + $closeLabel + '" hidden>×</button></aside>'
  $html = [regex]::Replace($html, '\s*<aside class="cookie-notice".*?</aside>', '', 'Singleline')
  $html = $html.Replace($menu, $menu + "`n  " + $notice)
  $html = [regex]::Replace($html, '<a class="cookie-footer".*?</a>', '')
  $html = $html.Replace('</footer>', '<a class="cookie-footer" href="' + $cookiePage + '">' + $cookieLabel + '</a></footer>')
  [IO.File]::WriteAllText($file.FullName, $html, $utf8)
}
