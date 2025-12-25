import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Switch,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, Toast } from '../components/UI';
import { AddRoutineModal } from '../components/AddRoutineModal';
import { useData } from '../context/DataContext';
import { getAllRoutines, updateRoutine, addRoutine } from '../database/queries';
import { shareData, pickAndImportData } from '../services/exportService';
import { colors, spacing, borderRadius, textStyles } from '../theme';
import { CATEGORIES } from '../utils/constants';
import { formatTimeForDisplay } from '../utils/dateHelpers';

export const TrackScreen = () => {
    const { refresh } = useData();
    const [routines, setRoutines] = useState([]);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [addModalVisible, setAddModalVisible] = useState(false);

    useEffect(() => {
        loadRoutines();
    }, []);

    const loadRoutines = async () => {
        try {
            const data = await getAllRoutines();
            setRoutines(data);
        } catch (error) {
            console.error('Error loading routines:', error);
        }
    };

    const handleToggleEnabled = async (routineId, newValue) => {
        try {
            // Store as integer: 1 for true, 0 for false
            await updateRoutine(routineId, { is_enabled: newValue ? 1 : 0 });
            await loadRoutines();
            refresh();
        } catch (error) {
            console.error('Error updating routine:', error);
        }
    };

    const handleExport = async () => {
        try {
            showToast('Preparing export...');
            const result = await shareData();

            if (result.success) {
                showToast('Data exported successfully!');
            } else {
                Alert.alert('Export Failed', result.error || 'Could not export data');
            }
        } catch (error) {
            Alert.alert('Export Error', error.message);
        }
    };

    const handleImport = async () => {
        try {
            showToast('Opening file picker...');
            const result = await pickAndImportData();

            if (result.success) {
                Alert.alert('Success', result.message, [
                    {
                        text: 'OK', onPress: () => {
                            loadRoutines();
                            refresh();
                        }
                    }
                ]);
            } else if (result.error !== 'Import cancelled') {
                Alert.alert('Import Failed', result.error || 'Could not import data');
            }
        } catch (error) {
            Alert.alert('Import Error', error.message);
        }
    };

    const handleAddRoutine = () => {
        setAddModalVisible(true);
    };

    const handleAddSubmit = async (routine) => {
        try {
            await addRoutine(routine);
            await loadRoutines();
            refresh();
            showToast(`✅ "${routine.name}" added successfully!`);
        } catch (error) {
            console.error('Error adding routine:', error);
            Alert.alert('Error', 'Failed to add routine. Please try again.');
        }
    };

    const showToast = (message) => {
        setToastMessage(message);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    };

    const groupRoutinesByCategory = () => {
        const grouped = {};

        routines.forEach((routine) => {
            if (!grouped[routine.category]) {
                grouped[routine.category] = [];
            }
            grouped[routine.category].push(routine);
        });

        return grouped;
    };

    const renderRoutineItem = (routine) => {
        const categoryInfo = CATEGORIES[routine.category] || CATEGORIES.morning;

        return (
            <Card key={routine.id} style={styles.routineCard}>
                <View style={styles.routineHeader}>
                    <View style={styles.routineNameContainer}>
                        <View
                            style={[
                                styles.categoryDot,
                                { backgroundColor: categoryInfo.color },
                            ]}
                        />
                        <Text style={styles.routineName}>{routine.name}</Text>
                    </View>

                    <Switch
                        value={Boolean(routine.is_enabled)}
                        onValueChange={(newValue) =>
                            handleToggleEnabled(routine.id, newValue)
                        }
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={colors.surface}
                    />
                </View>

                {routine.scheduled_time && (
                    <View style={styles.timeContainer}>
                        <MaterialCommunityIcons
                            name="clock-outline"
                            size={16}
                            color={colors.textSecondary}
                        />
                        <Text style={styles.timeText}>
                            {formatTimeForDisplay(routine.scheduled_time)}
                        </Text>
                    </View>
                )}
            </Card>
        );
    };

    const renderCategorySection = (category, categoryRoutines) => {
        const categoryInfo = CATEGORIES[category] || CATEGORIES.morning;

        return (
            <View key={category} style={styles.categorySection}>
                <View style={styles.categoryHeaderContainer}>
                    <MaterialCommunityIcons
                        name={categoryInfo.icon}
                        size={24}
                        color={categoryInfo.color}
                    />
                    <Text style={styles.categoryTitle}>{categoryInfo.name}</Text>
                    <Text style={styles.categoryCount}>
                        {categoryRoutines.filter(r => Boolean(r.is_enabled)).length}/
                        {categoryRoutines.length}
                    </Text>
                </View>

                {categoryRoutines.map(renderRoutineItem)}
            </View>
        );
    };

    const groupedRoutines = groupRoutinesByCategory();
    const categoryOrder = ['morning', 'work', 'exercise', 'household', 'evening'];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Manage Routines</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={styles.importButton}
                        onPress={handleImport}
                    >
                        <MaterialCommunityIcons name="import" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.exportButton}
                        onPress={handleExport}
                    >
                        <MaterialCommunityIcons name="export" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddRoutine}
                    >
                        <MaterialCommunityIcons name="plus" size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                {categoryOrder.map((category) => {
                    if (groupedRoutines[category]) {
                        return renderCategorySection(category, groupedRoutines[category]);
                    }
                    return null;
                })}
            </ScrollView>

            <AddRoutineModal
                visible={addModalVisible}
                onClose={() => setAddModalVisible(false)}
                onSubmit={handleAddSubmit}
            />

            <Toast visible={toastVisible} message={toastMessage} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        ...textStyles.h2,
        color: colors.text,
    },
    headerButtons: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    importButton: {
        padding: spacing.sm,
    },
    exportButton: {
        padding: spacing.sm,
    },
    addButton: {
        padding: spacing.sm,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: spacing.xxl,
    },
    categorySection: {
        marginBottom: spacing.xl,
    },
    categoryHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    categoryTitle: {
        ...textStyles.h3,
        color: colors.text,
        marginLeft: spacing.sm,
        flex: 1,
    },
    categoryCount: {
        ...textStyles.caption,
        color: colors.textSecondary,
    },
    routineCard: {
        marginBottom: spacing.sm,
    },
    routineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    routineNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: spacing.sm,
    },
    routineName: {
        ...textStyles.bodyMedium,
        color: colors.text,
        flex: 1,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.sm,
        marginLeft: spacing.md + 8,
    },
    timeText: {
        ...textStyles.caption,
        color: colors.textSecondary,
        marginLeft: spacing.xs,
    },
});
