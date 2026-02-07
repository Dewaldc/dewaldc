<#
.SYNOPSIS
  Idempotently scaffold a static HTML/CSS/JS repo structure (no duplicates).

.DESCRIPTION
  - Creates only missing folders and files.
  - Never overwrites; skips existing items.
  - Adds .gitkeep ONLY when a folder has no other content.
  - Optional: starter files (index.html, css/style.css, js/app.js).
  - Optional: GitHub Pages workflow.
  - Optional: Dry run to preview actions.

.PARAMETER Root
  Repository root. Defaults to current directory.

.PARAMETER WithStarterFiles
  Create minimal index.html, css/style.css, js/app.js if missing.

.PARAMETER WithPagesWorkflow
  Create .github/workflows/pages.yml if missing.

.PARAMETER DryRun
  Preview actions without changing anything.

.EXAMPLE
  ./init-static-web.ps1 -Root "C:\dev\omniassist-website" -WithStarterFiles -WithPagesWorkflow

.EXAMPLE (Dry run)
  ./init-static-web.ps1 -DryRun
#>

[CmdletBinding(SupportsShouldProcess)]
param(
  [string]$Root = (Get-Location).Path,
  [switch]$WithStarterFiles,
  [switch]$WithPagesWorkflow,
  [switch]$DryRun
)

function Write-Info($msg) { Write-Host $msg -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host $msg -ForegroundColor Green }
function Write-Skip($msg) { Write-Host $msg -ForegroundColor DarkGray }
function Write-Warn($msg) { Write-Host $msg -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host $msg -ForegroundColor Red }

Write-Info "Scaffolding static site in: $Root"
if (-not (Test-Path -LiteralPath $Root)) {
  if ($DryRun) { Write-Warn "[DryRun] Would create root: $Root" }
  else {
    try {
      New-Item -ItemType Directory -Path $Root -Force | Out-Null
      Write-Ok "Created root: $Root"
    } catch { Write-Err "Failed to create root: $($_.Exception.Message)"; exit 1 }
  }
}

# Desired directories
$dirs = @(
  ".github/workflows",
  ".vscode",
  "assets",
  "assets/fonts",
  "assets/icons",
  "assets/images",
  "assets/media",
  "css",
  "js",
  "lib",
  "data",
  "components",
  "pages",
  "styles",
  "scripts",
  "tests",
  "docs"
)

# Create folder if missing
function Ensure-Dir($relPath) {
  $full = Join-Path $Root $relPath
  if (Test-Path -LiteralPath $full) {
    Write-Skip "Exists:  $relPath"
  } else {
    if ($DryRun) { Write-Warn "[DryRun] Would create: $relPath" }
    else {
      try {
        New-Item -ItemType Directory -Path $full -Force | Out-Null
        Write-Ok "Created: $relPath"
      } catch { Write-Err "Failed to create $relPath: $($_.Exception.Message)" }
    }
  }
  return $full
}

# Ensure .gitkeep when folder is empty (no duplicates)
function Ensure-GitKeep($fullDir) {
  $items = @(Get-ChildItem -LiteralPath $fullDir -Force -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -ne ".gitkeep" })
  if ($items.Count -eq 0) {
    $gitkeep = Join-Path $fullDir ".gitkeep"
    if (Test-Path -LiteralPath $gitkeep) {
      Write-Skip "Exists:  .gitkeep in $($fullDir.Replace($Root,''))"
    } else {
      if ($DryRun) { Write-Warn "[DryRun] Would add: $gitkeep" }
      else {
        try {
          New-Item -ItemType File -Path $gitkeep -Force | Out-Null
          Write-Ok "Added:   $gitkeep"
        } catch { Write-Err "Failed to add .gitkeep in $fullDir: $($_.Exception.Message)" }
      }
    }
  } else {
    Write-Skip "Skip .gitkeep (non-empty): $($fullDir.Replace($Root,''))"
  }
}

# Create all directories and .gitkeep if empty
foreach ($d in $dirs) {
  $dirFull = Ensure-Dir -relPath $d
  Ensure-GitKeep -fullDir $dirFull
}

# Optional starter files (create only if missing — never overwrite)
if ($WithStarterFiles) {
  $indexPath = Join-Path $Root "index.html"
  $cssPath   = Join-Path $Root "css\style.css"
  $jsPath    = Join-Path $Root "js\app.js"

  if (Test-Path -LiteralPath $indexPath) {
    Write-Skip "Exists:  index.html (no overwrite)"
  } else {
@"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>OmniAssist — Automotive Tech</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header class="site-header">
    <h1>OmniAssist</h1>
    <p>Automotive tech solutions — static site starter</p>
  </header>

  <main id="app">
    <section class="hero">
      <h2>Welcome</h2>
      <p>Your static site is up. Edit <code>index.html</code>, <code>css/style.css</code>, and <code>js/app.js</code> to begin.</p>
    </section>
  </main>

  <script src="js/app.js"></script>
</body>
</html>
"@ | ForEach-Object {
      if ($DryRun) { Write-Warn "[DryRun] Would create: index.html" }
      else {
        $_ | Set-Content -LiteralPath $indexPath -Encoding UTF8
        Write-Ok "Created: index.html"
      }
    }
  }

  if (Test-Path -LiteralPath $cssPath) {
    Write-Skip "Exists:  css/style.css (no overwrite)"
  } else {
@"
/* Base styles for OmniAssist static site */
:root { --brand: #0a6cff; --ink: #111; --muted: #666; --bg: #fff; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; color: var(--ink); background: var(--bg); }
.site-header { padding: 2rem; border-bottom: 1px solid #eee; }
.hero { padding: 2rem; }
a { color: var(--brand); text-decoration: none; }
a:hover { text-decoration: underline; }
"@ | ForEach-Object {
      if ($DryRun) { Write-Warn "[DryRun] Would create: css/style.css" }
      else {
        $_ | Set-Content -LiteralPath $cssPath -Encoding UTF8
        Write-Ok "Created: css/style.css"
      }
    }
  }

  if (Test-Path -LiteralPath $jsPath) {
    Write-Skip "Exists:  js/app.js (no overwrite)"
  } else {
@"
// Vanilla JS entry point
document.addEventListener('DOMContentLoaded', () => {
  console.log('OmniAssist static site ready.');
});
"@ | ForEach-Object {
      if ($DryRun) { Write-Warn "[DryRun] Would create: js/app.js" }
      else {
        $_ | Set-Content -LiteralPath $jsPath -Encoding UTF8
        Write-Ok "Created: js/app.js"
      }
    }
  }
}

# Optional GitHub Pages workflow (only if missing)
if ($WithPagesWorkflow) {
  $wf = Join-Path $Root ".github\workflows\pages.yml"
  if (Test-Path -LiteralPath $wf) {
    Write-Skip "Exists:  .github/workflows/pages.yml (no overwrite)"
  } else {
@"
name: Deploy static site to Pages
on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "."
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
"@ | ForEach-Object {
      if ($DryRun) { Write-Warn "[DryRun] Would create: .github/workflows/pages.yml" }
      else {
        $null = New-Item -ItemType Directory -Path (Split-Path $wf) -Force
        $_ | Set-Content -LiteralPath $wf -Encoding UTF8
        Write-Ok "Created: .github/workflows/pages.yml"
      }
    }
  }
}

Write-Ok "`nAll done."
Write-Info "Tip: Run with -DryRun to preview; add -WithStarterFiles and -WithPagesWorkflow for extras."