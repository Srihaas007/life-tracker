#!/bin/bash

# Life Tracker - Quick Build Helper Script
# This script helps build the APK for Android

echo "🎯 Life Tracker - APK Build Helper"
echo "==================================="
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found"
    echo "📦 Installing EAS CLI globally..."
    npm install -g eas-cli
fi

echo "✅ EAS CLI is installed"
echo ""

# Check if logged in
echo "🔐 Checking Expo login status..."
eas whoami

if [ $? -ne 0 ]; then
    echo "❌ Not logged in to Expo"
    echo "📝 Please login now:"
    eas login
fi

echo ""
echo "🏗️  Building APK..."
echo "This will take approximately 10-15 minutes"
echo ""

# Build APK
eas build --platform android --profile preview

echo ""
echo "✅ Build complete!"
echo ""
echo "📱 Next steps:"
echo "1. Download the APK from the link provided above"
echo "2. Transfer to your Android device"
echo "3. Enable 'Install from Unknown Sources' in Android Settings"
echo "4. Tap the APK file to install"
echo ""
echo "🎉 Enjoy your Personal Life Tracker!"
