# Run from any directory to refresh shared navigation in all static HTML pages.
$root = Split-Path $PSScriptRoot -Parent
$utf8 = [System.Text.UTF8Encoding]::new($false)
foreach ($file in Get-ChildItem -LiteralPath $root -Filter '*.html') {
  $html = [IO.File]::ReadAllText($file.FullName)
  $italian = $html.Contains('<html lang="it"')
  $pages = if ($italian) {
    @(@('app-it.html', 'Scopri Movelory'), @('it.html', 'Informativa privacy'), @('terms-it.html', 'Condizioni d&#8217;uso'), @('location-demo-it.html', 'Registrazione GPS'), @('recap-demo-it.html', 'Recap Studio'))
  } else {
    @(@('app.html', 'Discover Movelory'), @('index.html', 'Privacy policy'), @('terms.html', 'Terms of use'), @('location-demo.html', 'GPS recording'), @('recap-demo.html', 'Recap Studio'))
  }
  $canonical = [regex]::Match($html, '<link rel="canonical" href="([^"]+)"').Groups[1].Value
  $label = if ($italian) { 'Menu principale' } else { 'Main navigation' }
  $items = foreach ($page in $pages) {
    $current = if ($page[0] -eq $canonical) { ' aria-current="page"' } else { '' }
    '<li><a href="' + $page[0] + '"' + $current + '>' + $page[1] + '</a></li>'
  }
  $menu = '<nav class="site-nav" aria-label="' + $label + '"><ul>' + ($items -join '') + '</ul></nav>'
  $html = [regex]::Replace($html, '\s*<nav class="site-nav".*?</nav>', '', 'Singleline')
  $html = $html.Replace('</header>', "</header>`n  $menu")
  $html = [regex]::Replace($html, '<nav aria-label="([^"]+)"><h2>(.*?)</h2>(.*?)</nav>', {
    param($match)
    '<nav class="page-nav" aria-label="' + $match.Groups[1].Value + '"><details class="page-contents" open><summary>' + $match.Groups[2].Value + '</summary>' + $match.Groups[3].Value + '</details></nav>'
  }, 'Singleline')
  if (!$html.Contains('src="navigation.js"')) {
    $html = $html.Replace('</head>', "  <script src=`"navigation.js`" defer></script>`n</head>")
  }
  [IO.File]::WriteAllText($file.FullName, $html, $utf8)
}
