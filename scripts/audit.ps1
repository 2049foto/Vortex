# Vortex Protocol - Production Audit Script
# Run from project root: .\scripts\audit.ps1

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  VORTEX PROTOCOL - PRODUCTION AUDIT" -ForegroundColor Cyan
Write-Host "  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$ErrorCount = 0
$WarningCount = 0

function Write-Check {
    param([string]$Name, [bool]$Passed, [string]$Details = "")
    if ($Passed) {
        Write-Host "  [PASS] $Name $Details" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] $Name $Details" -ForegroundColor Red
        $script:ErrorCount++
    }
}

function Write-Warning {
    param([string]$Message)
    Write-Host "  [WARN] $Message" -ForegroundColor Yellow
    $script:WarningCount++
}

# Step 1: Code Quality
Write-Host "`n[1/6] CODE QUALITY" -ForegroundColor Yellow
Write-Host "-------------------"

# Check for console.log in production code
$consoleLogs = Get-ChildItem -Path "packages/*/src" -Recurse -Filter "*.ts" | Select-String -Pattern "console\.(log|debug|info|warn|error)" | Where-Object { $_.Path -notlike "*seed.ts*" -and $_.Path -notlike "*logger.ts*" }
Write-Check -Name "No console.log in production" -Passed ($consoleLogs.Count -eq 0) -Details "(found: $($consoleLogs.Count))"

# Check for any types
$anyTypes = Get-ChildItem -Path "packages/*/src" -Recurse -Filter "*.ts" | Select-String -Pattern ": any|as any"
Write-Check -Name "No 'any' types" -Passed ($anyTypes.Count -eq 0) -Details "(found: $($anyTypes.Count))"

# Check for debugger statements
$debuggers = Get-ChildItem -Path "packages/*/src" -Recurse -Filter "*.ts" | Select-String -Pattern "debugger"
Write-Check -Name "No debugger statements" -Passed ($debuggers.Count -eq 0) -Details "(found: $($debuggers.Count))"

# Check for TODO/FIXME
$todos = Get-ChildItem -Path "packages/*/src" -Recurse -Filter "*.ts" | Select-String -Pattern "TODO|FIXME|HACK|XXX"
Write-Check -Name "No TODO/FIXME comments" -Passed ($todos.Count -eq 0) -Details "(found: $($todos.Count))"

# Step 2: Security
Write-Host "`n[2/6] SECURITY" -ForegroundColor Yellow
Write-Host "---------------"

# Check .gitignore
$gitignoreContent = Get-Content ".gitignore" -ErrorAction SilentlyContinue
$hasEnv = $gitignoreContent -match "\.env"
$hasNodeModules = $gitignoreContent -match "node_modules"
Write-Check -Name ".gitignore includes .env" -Passed $hasEnv
Write-Check -Name ".gitignore includes node_modules" -Passed $hasNodeModules

# Check for hardcoded secrets
$secrets = Get-ChildItem -Path "packages/*/src" -Recurse -Filter "*.ts" | Select-String -Pattern "(api_key|secret|password)\s*=\s*[`"'](?!process\.env)" -AllMatches
Write-Check -Name "No hardcoded secrets" -Passed ($secrets.Count -eq 0) -Details "(found: $($secrets.Count))"

# Check CORS for wildcards
$corsWildcard = Get-ChildItem -Path "packages/backend/src" -Recurse -Filter "*.ts" | Select-String -Pattern "origin:\s*[`"']\*[`"']"
Write-Check -Name "No CORS wildcard in backend" -Passed ($corsWildcard.Count -eq 0)

# Check for dangerous HTML
$dangerousHtml = Get-ChildItem -Path "packages/frontend/src" -Recurse -Filter "*.tsx" | Select-String -Pattern "dangerouslySetInnerHTML|innerHTML"
Write-Check -Name "No dangerouslySetInnerHTML" -Passed ($dangerousHtml.Count -eq 0)

# Step 3: Configuration
Write-Host "`n[3/6] CONFIGURATION" -ForegroundColor Yellow
Write-Host "-------------------"

# Check strict mode in tsconfig
$backendTsconfig = Get-Content "packages/backend/tsconfig.json" | ConvertFrom-Json
$frontendTsconfig = Get-Content "packages/frontend/tsconfig.json" | ConvertFrom-Json
Write-Check -Name "Backend strict mode enabled" -Passed ($backendTsconfig.compilerOptions.strict -eq $true)
Write-Check -Name "Frontend strict mode enabled" -Passed ($frontendTsconfig.compilerOptions.strict -eq $true)

# Check vercel.json exists
Write-Check -Name "vercel.json exists" -Passed (Test-Path "vercel.json")

# Check for required documentation
Write-Check -Name "README.md exists" -Passed (Test-Path "README.md")
Write-Check -Name "SECURITY.md exists" -Passed (Test-Path "SECURITY.md")
Write-Check -Name "CONTRIBUTING.md exists" -Passed (Test-Path "CONTRIBUTING.md")
Write-Check -Name "CHANGELOG.md exists" -Passed (Test-Path "CHANGELOG.md")

# Step 4: Documentation
Write-Host "`n[4/6] DOCUMENTATION" -ForegroundColor Yellow
Write-Host "-------------------"

Write-Check -Name "docs/ARCHITECTURE.md exists" -Passed (Test-Path "docs/ARCHITECTURE.md")
Write-Check -Name "docs/API.md exists" -Passed (Test-Path "docs/API.md")
Write-Check -Name "docs/DEPLOYMENT.md exists" -Passed (Test-Path "docs/DEPLOYMENT.md")
Write-Check -Name "docs/TESTING.md exists" -Passed (Test-Path "docs/TESTING.md")

# Step 5: Dependencies
Write-Host "`n[5/6] DEPENDENCIES" -ForegroundColor Yellow
Write-Host "------------------"

# Check package.json exists
Write-Check -Name "Root package.json exists" -Passed (Test-Path "package.json")
Write-Check -Name "Frontend package.json exists" -Passed (Test-Path "packages/frontend/package.json")
Write-Check -Name "Backend package.json exists" -Passed (Test-Path "packages/backend/package.json")

# Step 6: Database
Write-Host "`n[6/6] DATABASE" -ForegroundColor Yellow
Write-Host "---------------"

# Check Prisma schema exists
Write-Check -Name "Prisma schema exists" -Passed (Test-Path "packages/backend/prisma/schema.prisma")

# Check for indexes in schema
if (Test-Path "packages/backend/prisma/schema.prisma") {
    $prismaContent = Get-Content "packages/backend/prisma/schema.prisma" -Raw
    $hasIndexes = $prismaContent -match "@@index"
    Write-Check -Name "Database indexes defined" -Passed $hasIndexes
}

# Summary
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  AUDIT SUMMARY" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

if ($ErrorCount -eq 0) {
    Write-Host "`n  STATUS: PASSED" -ForegroundColor Green
    Write-Host "  Errors: $ErrorCount" -ForegroundColor Green
    Write-Host "  Warnings: $WarningCount" -ForegroundColor Yellow
    Write-Host "`n  Ready for production deployment!" -ForegroundColor Green
} else {
    Write-Host "`n  STATUS: FAILED" -ForegroundColor Red
    Write-Host "  Errors: $ErrorCount" -ForegroundColor Red
    Write-Host "  Warnings: $WarningCount" -ForegroundColor Yellow
    Write-Host "`n  Fix the above issues before deploying." -ForegroundColor Red
}

Write-Host ""

