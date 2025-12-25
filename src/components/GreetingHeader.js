import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, textStyles } from '../theme';
import { getGreeting, formatDateForDisplay } from '../utils/dateHelpers';
import { useData } from '../context/DataContext';

export const GreetingHeader = ({ date }) => {
    const { userName } = useData();
    const { text, icon } = getGreeting();

    // Personalize greeting if we have a name
    const personalizedGreeting = userName
        ? `${text}, ${userName}!`
        : `${text}!`;

    return (
        <View style={styles.container}>
            <View style={styles.greetingRow}>
                <MaterialCommunityIcons name={icon} size={28} color={colors.primary} />
                <Text style={styles.greeting}>{personalizedGreeting}</Text>
            </View>
            <Text style={styles.date}>{formatDateForDisplay(date)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.lg,
    },
    greetingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    greeting: {
        ...textStyles.h2,
        color: colors.text,
    },
    date: {
        ...textStyles.body,
        color: colors.textSecondary,
        marginTop: spacing.xs,
        marginLeft: spacing.md + 28 + spacing.sm, // Align with greeting text
    },
});
