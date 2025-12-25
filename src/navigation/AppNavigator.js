import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/DashboardScreen';
import { TrackScreen } from '../screens/TrackScreen';
import { ReviewScreen } from '../screens/ReviewScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Today') {
                            iconName = 'home';
                        } else if (route.name === 'Track') {
                            iconName = 'playlist-check';
                        } else if (route.name === 'Review') {
                            iconName = 'chart-line';
                        }

                        return (
                            <MaterialCommunityIcons
                                name={iconName}
                                size={size}
                                color={color}
                            />
                        );
                    },
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textSecondary,
                })}
            >
                <Tab.Screen
                    name="Today"
                    component={DashboardScreen}
                />
                <Tab.Screen
                    name="Track"
                    component={TrackScreen}
                />
                <Tab.Screen
                    name="Review"
                    component={ReviewScreen}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};
