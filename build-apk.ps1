# Life Tracker - Quick Build Helper Script (PowerShell)
# This script helps build the APK for Android

Write-Host "🎯 Life Tracker - APK Build Helper" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check if EAS CLI is installed
$easInstalled = Get-Command eas -ErrorAction SilentlyContinue

if (-not $easInstalled) {
    Write-Host "❌ EAS CLI not found" -ForegroundColor Red
    Write-Host "📦 Installing EAS CLI globally..." -ForegroundColor Yellow
    npm install -g eas-cli
}
else {
    Write-Host "✅ EAS CLI is installed" -ForegroundColor Green
}

Write-Host ""

# Check if logged in
Write-Host "🔐 Checking Expo login status..." -ForegroundColor Yellow
eas whoami

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Expo" -ForegroundColor Red
    Write-Host "📝 Please login now:" -ForegroundColor Yellow
    eas login
}

Write-Host ""
Write-Host "🏗️  Building APK..." -ForegroundColor Cyan
Write-Host "This will take approximately 10-15 minutes" -ForegroundColor Yellow
Write-Host ""

# Build APK
eas build --platform android --profile preview

Write-Host ""
Write-Host "✅ Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Next steps:" -ForegroundColor Cyan
Write-Host "1. Download the APK from the link provided above"
Write-Host "2. Transfer to your Android device"
Write-Host "3. Enable 'Install from Unknown Sources' in Android Settings"
Write-Host "4. Tap the APK file to install"
Write-Host ""
Write-Host "🎉 Enjoy your Personal Life Tracker!" -ForegroundColor Green
