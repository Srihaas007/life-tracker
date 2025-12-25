import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { CalendarStrip } from '../components/CalendarStrip';
import { GreetingHeader } from '../components/GreetingHeader';
import { ProgressCard } from '../components/ProgressCard';
import { RoutineChecklistItem } from '../components/RoutineChecklistItem';
import { ConfettiAnimation } from '../components/ConfettiAnimation';
import { Toast } from '../components/UI';
import { useData } from '../context/DataContext';
import { toggleRoutineCompletion } from '../database/queries';
import { colors, spacing } from '../theme';
import { CATEGORIES } from '../utils/constants';

export const DashboardScreen = () => {
    const {
        selectedDate,
        changeDate,
        routines,
        completions,
        completionPercentage,
        isLoading,
        refresh,
    } = useData();

    const [showConfetti, setShowConfetti] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [prevPercentage, setPrevPercentage] = useState(0);

    // Show confetti when reaching 100%
    useEffect(() => {
        if (completionPercentage === 100 && prevPercentage < 100) {
            setShowConfetti(true);
            showToast('🎉 All routines completed!');
        }
        setPrevPercentage(completionPercentage);
    }, [completionPercentage]);

    const showToast = (message) => {
        setToastMessage(message);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2000);
    };

    const handleToggleRoutine = async (routineId) => {
        try {
            const isCompleted = await toggleRoutineCompletion(routineId, selectedDate);
            refresh();
            showToast(isCompleted ? '✓ Saved!' : '✗ Removed');
        } catch (error) {
            console.error('Error toggling routine:', error);
            showToast('Error saving');
        }
    };

    const isRoutineCompleted = (routineId) => {
        return completions.some((c) => c.routine_id === routineId);
    };

    const groupRoutinesByCategory = () => {
        const grouped = {};

        routines
            .filter(r => Boolean(r.is_enabled))
            .forEach((routine) => {
                if (!grouped[routine.category]) {
                    grouped[routine.category] = [];
                }
                grouped[routine.category].push(routine);
            });

        return grouped;
    };

    const renderCategorySection = (category, categoryRoutines) => {
        const categoryInfo = CATEGORIES[category] || CATEGORIES.morning;

        return (
            <View key={category} style={styles.categorySection}>
                <View style={styles.categoryHeader}>
                    <View
                        style={[
                            styles.categoryIndicator,
                            { backgroundColor: categoryInfo.color },
                        ]}
                    />
                    <Text style={styles.categoryTitle}>{categoryInfo.name}</Text>
                </View>

                {categoryRoutines.map((routine) => (
                    <RoutineChecklistItem
                        key={routine.id}
                        routine={routine}
                        completed={isRoutineCompleted(routine.id)}
                        selectedDate={selectedDate}
                        onToggle={() => handleToggleRoutine(routine.id)}
                        onEdit={() => {
                            // TODO: Open edit modal
                            showToast('Edit feature coming soon!');
                        }}
                        onLongPress={() => {
                            // TODO: Open edit modal
                        }}
                    />
                ))}
            </View>
        );
    };

    const groupedRoutines = groupRoutinesByCategory();
    const categoryOrder = ['morning', 'work', 'exercise', 'household', 'evening'];

    return (
        <SafeAreaView style={styles.container}>
            <GreetingHeader date={selectedDate} />

            <CalendarStrip
                selectedDate={selectedDate}
                onDateChange={changeDate}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={Boolean(isLoading)} onRefresh={refresh} />
                }
            >
                <ProgressCard percentage={completionPercentage} />

                <View style={styles.routinesContainer}>
                    {categoryOrder.map((category) => {
                        if (groupedRoutines[category]) {
                            return renderCategorySection(category, groupedRoutines[category]);
                        }
                        return null;
                    })}
                </View>
            </ScrollView>

            <ConfettiAnimation
                visible={Boolean(showConfetti)}
                onComplete={() => setShowConfetti(false)}
            />

            <Toast
                message={toastMessage}
                visible={Boolean(toastVisible)}
                type="success"
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
    },
    routinesContainer: {
        paddingHorizontal: spacing.md,
        marginTop: spacing.md,
    },
    categorySection: {
        marginBottom: spacing.lg,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    categoryIndicator: {
        width: 4,
        height: 20,
        borderRadius: 2,
        marginRight: spacing.sm,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
});
