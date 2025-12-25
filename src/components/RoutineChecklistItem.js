import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, textStyles } from '../theme';
import { CATEGORIES } from '../utils/constants';
import { formatTimeForDisplay } from '../utils/dateHelpers';
import { isWithinTimeWindow, getTimeWindowColor } from '../utils/timeWindowHelper';

export const RoutineChecklistItem = ({ routine, completed, onToggle, onLongPress, onEdit, selectedDate }) => {
    const categoryInfo = CATEGORIES[routine.category] || CATEGORIES.morning;

    // Check time window
    const timeWindow = isWithinTimeWindow(routine.scheduled_time, selectedDate ? new Date(selectedDate) : new Date());
    const canCheck = timeWindow.canCheck;
    const windowColor = getTimeWindowColor(routine.scheduled_time, selectedDate ? new Date(selectedDate) : new Date());

    const handlePress = () => {
        if (canCheck && onToggle) {
            onToggle();
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                completed && styles.completedContainer,
                !canCheck && styles.disabledContainer,
            ]}
            onPress={handlePress}
            onLongPress={onLongPress}
            activeOpacity={canCheck ? 0.7 : 1}
            disabled={!canCheck && completed}
        >
            <View style={styles.content}>
                {/* Checkbox */}
                <View style={[styles.checkbox, completed && styles.checkboxCompleted]}>
                    {completed && (
                        <MaterialCommunityIcons name="check" size={18} color={colors.surface} />
                    )}
                </View>

                {/* Routine Info */}
                <View style={styles.infoContainer}>
                    <View style={styles.nameRow}>
                        <View style={[styles.categoryDot, { backgroundColor: categoryInfo.color }]} />
                        <Text
                            style={[
                                styles.name,
                                completed && styles.nameCompleted,
                                !canCheck && styles.nameDisabled,
                            ]}
                        >
                            {routine.name}
                        </Text>
                    </View>

                    {/* Time and Window Status */}
                    <View style={styles.timeRow}>
                        {routine.scheduled_time && (
                            <>
                                <MaterialCommunityIcons
                                    name="clock-outline"
                                    size={14}
                                    color={windowColor}
                                />
                                <Text style={[styles.time, { color: windowColor }]}>
                                    {formatTimeForDisplay(routine.scheduled_time)}
                                </Text>
                                {!canCheck && timeWindow.message && (
                                    <Text style={[styles.windowMessage, { color: windowColor }]}>
                                        • {timeWindow.message}
                                    </Text>
                                )}
                            </>
                        )}
                    </View>
                </View>

                {/* Edit Button */}
                {onEdit && (
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                    >
                        <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Time Window Indicator Bar */}
            {routine.scheduled_time && (
                <View style={[styles.windowIndicator, { backgroundColor: windowColor }]} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
        overflow: 'hidden',
    },
    completedContainer: {
        opacity: 0.7,
    },
    disabledContainer: {
        opacity: 0.5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    checkboxCompleted: {
        backgroundColor: colors.success,
        borderColor: colors.success,
    },
    infoContainer: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    categoryDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: spacing.sm,
    },
    name: {
        ...textStyles.bodyMedium,
        color: colors.text,
        flex: 1,
    },
    nameCompleted: {
        textDecorationLine: 'line-through',
        color: colors.textSecondary,
    },
    nameDisabled: {
        color: colors.textSecondary,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    time: {
        ...textStyles.caption,
        fontWeight: '500',
    },
    windowMessage: {
        ...textStyles.caption,
        fontStyle: 'italic',
    },
    editButton: {
        padding: spacing.sm,
        marginLeft: spacing.sm,
    },
    windowIndicator: {
        height: 3,
        width: '100%',
    },
});

