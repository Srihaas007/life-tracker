# How to Build APK for Life Tracker

## Method 1: EAS Build (Recommended - Easiest)

EAS Build is Expo's cloud build service. It's free for personal use and works without Android Studio.

### Steps:

1. **Install EAS CLI globally:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```
   - If you don't have an account, create one at https://expo.dev (it's free!)
   - Enter your credentials

3. **Build the APK:**
   ```bash
   eas build --platform android --profile preview
   ```
   
   - This uploads your code to Expo's servers
   - Expo builds the APK in the cloud
   - Takes about 10-15 minutes

4. **Download your APK:**
   - When build completes, you'll get a download link
   - Download the APK file
   - Transfer to your Android device or install directly

5. **Install on Android:**
   - Enable "Install from Unknown Sources" in Settings → Security
   - Tap the APK file to install
   - Done! 🎉

### Troubleshooting EAS Build:

- **Not logged in**: Run `eas whoami` to check, `eas login` to fix
- **Build fails**: Check the build logs on expo.dev
- **First time setup**: Run `eas build:configure` if prompted

---

## Method 2: Local Build (Advanced - Requires Android Studio)

Only use this if you need full control or can't use cloud builds.

### Prerequisites:

1. **Install Android Studio:**
   - Download from https://developer.android.com/studio
   - Install Android SDK (API level 33 or higher)
   - Set up environment variables (ANDROID_HOME, etc.)

2. **Install Java JDK 17:**
   - Download from https://adoptium.net/
   - Set JAVA_HOME environment variable

### Steps:

1. **Generate Android folder:**
   ```bash
   npx expo prebuild --platform android
   ```

2. **Navigate to android folder:**
   ```bash
   cd android
   ```

3. **Build release APK:**
   ```bash
   ./gradlew assembleRelease
   ```
   (On Windows: `gradlew assembleRelease`)

4. **Find your APK:**
   - Location: `android/app/build/outputs/apk/release/app-release.apk`
   - Copy this file to your phone

5. **Install:**
   - Enable "Install from Unknown Sources"
   - Tap APK to install

### Troubleshooting Local Build:

- **Gradle errors**: Make sure Android SDK is installed
- **Memory errors**: Increase Gradle heap size in `gradle.properties`
- **Build fails**: Try `./gradlew clean` first

---

## Method 3: Using Build Scripts (Windows PowerShell)

We've included a PowerShell script for easy building:

```bash
.\build-apk.ps1
```

This script will:
- Check if EAS CLI is installed
- Guide you through the build process
- Provide the download link

---

## Quick Reference

| Method | Time | Requires | Difficulty |
|--------|------|----------|------------|
| EAS Build | 10-15 min | Expo account | ⭐ Easy |
| Local Build | 30+ min | Android Studio | ⭐⭐⭐ Hard |
| Build Script | 10-15 min | Expo account | ⭐ Easy |

**Recommendation**: Use EAS Build unless you have specific reasons not to.

---

## After Building

1. **Install on your device**
2. **Grant permissions** when prompted (notifications, alarms)
3. **Enjoy your app!** 📱

## APK File Details

- **File name**: `life-tracker-[version].apk`
- **Size**: ~40-50 MB
- **Minimum Android**: 6.0 (API 23)
- **Target Android**: 13 (API 33)

---

## Need Help?

- EAS Build Docs: https://docs.expo.dev/build/introduction/
- Expo Forums: https://forums.expo.dev/
- GitHub Issues: https://github.com/Srihaas007/life-tracker/issues
