import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Switch,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, textStyles } from '../theme';
import { CATEGORIES } from '../utils/constants';

export const AddRoutineModal = ({ visible, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('morning');
    const [scheduledTime, setScheduledTime] = useState('');
    const [isEnabled, setIsEnabled] = useState(true);

    const handleSubmit = () => {
        if (!name.trim()) {
            alert('Please enter a routine name');
            return;
        }

        const routine = {
            name: name.trim(),
            category,
            scheduledTime: scheduledTime.trim() || null,
            isEnabled,
            order: 99, // Add to end by default
        };

        onSubmit(routine);
        handleClose();
    };

    const handleClose = () => {
        // Reset form
        setName('');
        setCategory('morning');
        setScheduledTime('');
        setIsEnabled(true);
        onClose();
    };

    const categories = Object.keys(CATEGORIES);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add New Routine</Text>
                        <TouchableOpacity onPress={handleClose}>
                            <MaterialCommunityIcons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        {/* Name Input */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Routine Name *</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="e.g., Morning Walk, Journal Writing"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        {/* Category Selection */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Category</Text>
                            <View style={styles.categoryGrid}>
                                {categories.map((cat) => {
                                    const catInfo = CATEGORIES[cat];
                                    const isSelected = category === cat;
                                    return (
                                        <TouchableOpacity
                                            key={cat}
                                            style={[
                                                styles.categoryChip,
                                                isSelected && { backgroundColor: catInfo.color },
                                            ]}
                                            onPress={() => setCategory(cat)}
                                        >
                                            <MaterialCommunityIcons
                                                name={catInfo.icon}
                                                size={20}
                                                color={isSelected ? colors.surface : catInfo.color}
                                            />
                                            <Text
                                                style={[
                                                    styles.categoryText,
                                                    isSelected && { color: colors.surface },
                                                ]}
                                            >
                                                {catInfo.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Time Input */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Scheduled Time (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={scheduledTime}
                                onChangeText={setScheduledTime}
                                placeholder="HH:MM (24-hour format, e.g., 08:00)"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="numbers-and-punctuation"
                            />
                            <Text style={styles.hint}>
                                Leave empty for flexible timing
                            </Text>
                        </View>

                        {/* Enabled Toggle */}
                        <View style={styles.field}>
                            <View style={styles.switchRow}>
                                <View>
                                    <Text style={styles.label}>Enable Routine</Text>
                                    <Text style={styles.hint}>
                                        Start tracking this routine immediately
                                    </Text>
                                </View>
                                <Switch
                                    value={isEnabled}
                                    onValueChange={setIsEnabled}
                                    trackColor={{ false: colors.border, true: colors.primary }}
                                    thumbColor={colors.surface}
                                />
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Add Routine</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: colors.background,
        borderRadius: borderRadius.lg,
        width: '90%',
        maxHeight: '80%',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        ...textStyles.h2,
        color: colors.text,
    },
    content: {
        padding: spacing.lg,
    },
    field: {
        marginBottom: spacing.lg,
    },
    label: {
        ...textStyles.bodyMedium,
        color: colors.text,
        marginBottom: spacing.sm,
        fontWeight: '600',
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        ...textStyles.body,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
    },
    hint: {
        ...textStyles.caption,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        gap: spacing.xs,
    },
    categoryText: {
        ...textStyles.body,
        color: colors.text,
        fontSize: 14,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        padding: spacing.lg,
        gap: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    cancelButton: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    cancelButtonText: {
        ...textStyles.bodyMedium,
        color: colors.text,
    },
    submitButton: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary,
        alignItems: 'center',
    },
    submitButtonText: {
        ...textStyles.bodyMedium,
        color: colors.surface,
        fontWeight: '600',
    },
});
