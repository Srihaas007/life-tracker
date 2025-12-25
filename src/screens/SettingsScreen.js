import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, textStyles } from '../theme';
import { useData } from '../context/DataContext';
import { getDatabase } from '../database/schema';
import { setUserName } from '../database/userSettings';

export const SettingsScreen = () => {
    const { userName, refresh } = useData();

    const handleResetData = () => {
        // First warning
        Alert.alert(
            '⚠️ Reset All Data?',
            'This will permanently delete:\n\n• All routines\n• All completion history\n• Your user name\n• Everything!\n\nThis action CANNOT be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Continue',
                    style: 'destructive',
                    onPress: showFinalWarning,
                },
            ]
        );
    };

    const showFinalWarning = () => {
        // Second warning - more emphatic
        Alert.alert(
            '🚨 FINAL WARNING',
            'Are you ABSOLUTELY SURE?\n\nThere is NO way to recover your data after this.\n\nAll your progress, routines, and history will be gone forever.',
            [
                { text: 'No, Keep My Data', style: 'cancel' },
                {
                    text: 'Yes, Delete Everything',
                    style: 'destructive',
                    onPress: performReset,
                },
            ]
        );
    };

    const performReset = async () => {
        try {
            const db = await getDatabase();

            // Delete all data from all tables
            await db.execAsync(`
        DELETE FROM routine_completions;
        DELETE FROM routine_items;
        DELETE FROM daily_entries;
        DELETE FROM weight_logs;
        DELETE FROM reading_sessions;
        DELETE FROM project_logs;
        DELETE FROM user_settings;
      `);

            // Reset user name in context
            await setUserName('');

            // Show success message
            Alert.alert(
                '✅ Reset Complete',
                'All data has been deleted. The app will reload with default routines.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Trigger app reload/re-initialization
                            refresh();
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Error resetting data:', error);
            Alert.alert('Error', 'Failed to reset data. Please try again or reinstall the app.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* User Info Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.card}>
                        <MaterialCommunityIcons name="account-circle" size={24} color={colors.primary} />
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>User Name</Text>
                            <Text style={styles.cardSubtitle}>{userName || 'Not set'}</Text>
                        </View>
                    </View>
                </View>

                {/* App Info Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.card}>
                        <MaterialCommunityIcons name="information" size={24} color={colors.primary} />
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>Life Tracker</Text>
                            <Text style={styles.cardSubtitle}>Version 1.0.0</Text>
                        </View>
                    </View>
                </View>

                {/* Danger Zone */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Danger Zone</Text>
                    <TouchableOpacity
                        style={styles.dangerCard}
                        onPress={handleResetData}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="delete-forever" size={24} color={colors.error} />
                        <View style={styles.cardContent}>
                            <Text style={styles.dangerTitle}>Reset All Data</Text>
                            <Text style={styles.dangerSubtitle}>
                                Permanently delete all routines and history
                            </Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.error} />
                    </TouchableOpacity>
                </View>

                {/* Privacy Notice */}
                <View style={styles.privacySection}>
                    <Text style={styles.privacyText}>
                        🔒 All data is stored locally on your device. Nothing is sent to any server.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: spacing.lg,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        ...textStyles.h2,
        color: colors.text,
    },
    content: {
        flex: 1,
    },
    section: {
        padding: spacing.lg,
    },
    sectionTitle: {
        ...textStyles.bodyMedium,
        color: colors.textSecondary,
        marginBottom: spacing.md,
        textTransform: 'uppercase',
        fontSize: 12,
        letterSpacing: 0.5,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardContent: {
        flex: 1,
        marginLeft: spacing.md,
    },
    cardTitle: {
        ...textStyles.bodyMedium,
        color: colors.text,
        fontWeight: '600',
    },
    cardSubtitle: {
        ...textStyles.caption,
        color: colors.textSecondary,
        marginTop: spacing.xs / 2,
    },
    dangerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: colors.error,
    },
    dangerTitle: {
        ...textStyles.bodyMedium,
        color: colors.error,
        fontWeight: '600',
    },
    dangerSubtitle: {
        ...textStyles.caption,
        color: colors.textSecondary,
        marginTop: spacing.xs / 2,
    },
    privacySection: {
        padding: spacing.lg,
        paddingTop: spacing.xxl,
    },
    privacyText: {
        ...textStyles.caption,
        color: colors.textSecondary,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
