# Life Tracker - Personal Life Tracking App

A calm, private, grounding tool for daily awareness. Track your routines without pressure, gamification, or social validation.

## Features

✅ **100% Offline** - All data stored locally on your device
✅ **17 Default Routines** - Pre-populated with morning, work, exercise, household, and evening routines
✅ **Beautiful UI** - Calm color palette with smooth animations
✅ **Progress Tracking** - Visual progress indicators and completion statistics
✅ **Calendar Navigation** - View and track any day
✅ **7-Day Review** - Charts and statistics for the last week
✅ **Categories** - Routines organized by time of day
✅ **Confetti Celebration** - Cheerful animation when you complete all routines
✅ **Dynamic Greetings** - Time-aware greetings (morning/afternoon/evening)

## Tech Stack

- **Framework**: Expo / React Native
- **Language**: JavaScript
- **Database**: SQLite (expo-sqlite)
- **Navigation**: React Navigation
- **Charts**: react-native-chart-kit
- **Icons**: @expo/vector-icons

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- For building APK: Expo account (free)

### Setup

1. **Clone or navigate to the project:**
   ```bash
   cd s:\Self_Aware\life-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npx expo start
   ```

4. **Test on device:**
   - Install Expo Go app on your Android device
   - Scan the QR code displayed in the terminal

## Building APK

### Option 1: EAS Build (Recommended - Cloud Build)

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```
   (Create a free account if you don't have one)

3. **Configure project:**
   ```bash
   eas build:configure
   ```

4. **Build APK:**
   ```bash
   eas build --platform android --profile preview
   ```

5. **Download APK:**
   - Wait for the build to complete (~10-15 minutes)
   - EAS will provide a download link
   - Download the APK to your computer or directly to your Android device

6. **Install APK:**
   - Enable "Install from Unknown Sources" in Android settings
   - Tap the APK file to install

### Option 2: Local Build (Requires Android Studio)

1. **Setup Android Studio** with Android SDK

2. **Run local build:**
   ```bash
   npx expo run:android
   ```

3. **Build APK:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

4. **Find APK:**
   - Location: `android/app/build/outputs/apk/release/app-release.apk`

## Project Structure

```
life-tracker/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── UI.js
│   │   ├── CalendarStrip.js
│   │   ├── ProgressCard.js
│   │   ├── ConfettiAnimation.js
│   │   ├── GreetingHeader.js
│   │   └── RoutineChecklistItem.js
│   ├── screens/          # Main screens
│   │   ├── DashboardScreen.js
│   │   ├── TrackScreen.js
│   │   └── ReviewScreen.js
│   ├── database/         # SQLite setup
│   │   ├── schema.js
│   │   └── queries.js
│   ├── context/          # React Context
│   │   ├── DatabaseContext.js
│   │   └── DataContext.js
│   ├── navigation/       # Navigation setup
│   │   └── AppNavigator.js
│   ├── theme/            # Design system
│   │   ├── colors.js
│   │   ├── typography.js
│   │   ├── spacing.js
│   │   └── index.js
│   └── utils/            # Helper functions
│       ├── constants.js
│       └── dateHelpers.js
├── App.js
├── app.json
├── eas.json
└── package.json
```

## Default Routines

The app comes with 18 pre-populated routines:

### Morning (7:00 AM - 9:00 AM)
- Wake up
- Meditation
- Coffee
- Breakfast

### Work (9:00 AM - 6:00 PM)
- Start Work
- Mid-morning Break
- Lunch
- Afternoon Break
- End Work

### Exercise (6:00 PM - 8:00 PM)
- Gym/Workout
- Evening Walk
- Vitamins

### Household (7:00 PM - 9:00 PM)
- Cook Dinner
- Dishes
- Laundry (no scheduled time)
- Clean Room (no scheduled time)

### Evening (9:00 PM - 11:00 PM)
- Reading
- Bedtime

## Usage

### Dashboard (Today Tab)
- View greeting based on time of day
- Select any date using the calendar strip
- Check off completed routines
- See your progress percentage
- Get confetti celebration at 100%!

### Track (Manage Routines)
- View all routines by category
- Enable/disable routines
- See scheduled times

### Review (History)
- View last 7 days statistics
- See daily completion charts
- Track your 7-day average
- Identify your best days

## Privacy

This app is **100% offline and private**:
- All data stored in SQLite database on your device
- No cloud sync or backups (by design)
- No analytics or tracking
- No ads
- No account required
- Your data never leaves your device

## Philosophy

This app is built on core principles:
- **Awareness over perfection** - Track what happened, not what you wish happened
- **Consistency over intensity** - Small daily actions compound
- **Calm over chaos** - No notification spam, no red badges, no pressure
- **Privacy over sharing** - Your data stays on your phone, period

## Troubleshooting

### App doesn't start
- Run `npx expo start --clear` to clear cache
- Delete `node_modules` and run `npm install` again

### Database errors
- The database auto-initializes on first launch
- If issues persist, clear app data in Android settings

### Build fails
- Ensure you're logged into EAS: `eas whoami`
- Check your `app.json` and `eas.json` configuration

## Future Features (Planned)

- [ ] Custom routine builder
- [ ] Time picker for notifications
- [ ] Weekend mode
- [ ] Before/After work split view
- [ ] Weight logging UI
- [ ] Smart daily notes
- [ ] Export data to JSON
- [ ] Batch time blocking

## License

Personal use only. Not for commercial redistribution.

## Support

For issues or questions, refer to the Expo documentation:
- https://docs.expo.dev/
- https://docs.expo.dev/build/setup/

---

**Built with ❤️ for mindful living**
