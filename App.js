import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { DatabaseProvider } from './src/context/DatabaseContext';
import { DataProvider } from './src/context/DataContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { getHasCompletedOnboarding } from './src/database/userSettings';
import { colors } from './src/theme';

export default function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(null);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const completed = await getHasCompletedOnboarding();
    setHasCompletedOnboarding(completed);
  };

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };

  // Show nothing while checking onboarding status
  if (hasCompletedOnboarding === null) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
      </View>
    );
  }

  // Show onboarding if not completed
  if (!hasCompletedOnboarding) {
    return (
      <DatabaseProvider>
        <View style={styles.container}>
          <StatusBar style="dark" />
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        </View>
      </DatabaseProvider>
    );
  }

  // Show main app
  return (
    <DatabaseProvider>
      <DataProvider>
        <View style={styles.container}>
          <StatusBar style="dark" />
          <AppNavigator />
        </View>
      </DataProvider>
    </DatabaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
