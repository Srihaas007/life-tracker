import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { format, addDays, isSameDay } from 'date-fns';
import { colors, spacing, borderRadius, textStyles } from '../theme';

export const CalendarStrip = ({ selectedDate, onDateChange }) => {
    const scrollViewRef = useRef(null);

    // Generate 15 days (7 before, today, 7 after)
    const days = [];
    for (let i = -7; i <= 7; i++) {
        days.push(addDays(new Date(), i));
    }

    const renderDay = (date) => {
        const isSelected = isSameDay(date, selectedDate);
        const isToday = isSameDay(date, new Date());

        return (
            <TouchableOpacity
                key={date.toISOString()}
                onPress={() => onDateChange(date)}
                style={[
                    styles.dayContainer,
                    isSelected && styles.dayContainer_selected,
                    isToday && !isSelected && styles.dayContainer_today,
                ]}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        styles.dayOfWeek,
                        isSelected && styles.dayOfWeek_selected,
                    ]}
                >
                    {format(date, 'EEE')}
                </Text>
                <Text
                    style={[
                        styles.dayNumber,
                        isSelected && styles.dayNumber_selected,
                    ]}
                >
                    {format(date, 'd')}
                </Text>
                {isToday && !isSelected && <View style={styles.todayIndicator} />}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {days.map(renderDay)}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        paddingVertical: spacing.sm,
    },
    scrollContent: {
        paddingHorizontal: spacing.sm,
    },
    dayContainer: {
        width: 50,
        height: 70,
        borderRadius: borderRadius.md,
        marginHorizontal: spacing.xs,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surfaceVariant,
    },
    dayContainer_selected: {
        backgroundColor: colors.primary,
    },
    dayContainer_today: {
        borderWidth: 2,
        borderColor: colors.primary,
    },
    dayOfWeek: {
        ...textStyles.caption,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    dayOfWeek_selected: {
        color: colors.surface,
    },
    dayNumber: {
        ...textStyles.h3,
        color: colors.text,
    },
    dayNumber_selected: {
        color: colors.surface,
    },
    todayIndicator: {
        position: 'absolute',
        bottom: spacing.xs,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.primary,
    },
});
