import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Button } from '../components/UI';
import { colors, spacing, textStyles, borderRadius } from '../theme';
import { setUserName, setHasCompletedOnboarding } from '../database/userSettings';

export const OnboardingScreen = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleContinue = async () => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            setError('Please enter your name');
            return;
        }

        if (trimmedName.length < 2) {
            setError('Name should be at least 2 characters');
            return;
        }

        try {
            await setUserName(trimmedName);
            await setHasCompletedOnboarding();
            onComplete();
        } catch (err) {
            console.error('Error saving name:', err);
            setError('Failed to save. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.header}>
                    <Text style={styles.emoji}>👋</Text>
                    <Text style={styles.title}>Welcome to Life Tracker</Text>
                    <Text style={styles.subtitle}>
                        A calm, private space for daily awareness
                    </Text>
                </View>

                <View style={styles.inputSection}>
                    <Text style={styles.label}>What should we call you?</Text>
                    <TextInput
                        style={[styles.input, error ? styles.inputError : null]}
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            setError('');
                        }}
                        placeholder="Enter your name"
                        placeholderTextColor={colors.textSecondary}
                        autoFocus
                        autoCapitalize="words"
                        autoCorrect={false}
                    />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <Text style={styles.hint}>
                        We'll use this for personalized greetings and reminders
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Button
                        title="Continue"
                        onPress={handleContinue}
                        disabled={!name.trim()}
                    />
                    <Text style={styles.privacyNote}>
                        🔒 Your data stays on your device. Always.
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        justifyContent: 'space-between',
        paddingVertical: spacing.xxl,
    },
    header: {
        alignItems: 'center',
        marginTop: spacing.xxl * 2,
    },
    emoji: {
        fontSize: 64,
        marginBottom: spacing.lg,
    },
    title: {
        ...textStyles.h1,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...textStyles.body,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: spacing.lg,
    },
    inputSection: {
        marginTop: spacing.xl,
    },
    label: {
        ...textStyles.h3,
        color: colors.text,
        marginBottom: spacing.md,
    },
    input: {
        ...textStyles.bodyLarge,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderWidth: 2,
        borderColor: colors.border,
        color: colors.text,
    },
    inputError: {
        borderColor: colors.error,
    },
    errorText: {
        ...textStyles.caption,
        color: colors.error,
        marginTop: spacing.xs,
        marginLeft: spacing.sm,
    },
    hint: {
        ...textStyles.caption,
        color: colors.textSecondary,
        marginTop: spacing.sm,
        marginLeft: spacing.sm,
    },
    footer: {
        gap: spacing.md,
    },
    privacyNote: {
        ...textStyles.caption,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
