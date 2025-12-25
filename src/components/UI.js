import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, textStyles } from '../theme';

export const Button = ({ title, onPress, variant = 'primary', size = 'medium', disabled = false, icon }) => {
    const buttonStyle = [
        styles.button,
        styles[`button_${variant}`],
        styles[`button_${size}`],
        disabled && styles.button_disabled,
    ];

    const textStyle = [
        styles.buttonText,
        styles[`buttonText_${variant}`],
        styles[`buttonText_${size}`],
    ];

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            disabled={Boolean(disabled)}
            activeOpacity={0.7}
        >
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text style={textStyle}>{title}</Text>
        </TouchableOpacity>
    );
};

export const Card = ({ children, style, onPress }) => {
    const Component = onPress ? TouchableOpacity : View;
    const componentProps = {
        style: [styles.card, style],
    };

    // Only add activeOpacity for TouchableOpacity
    if (onPress) {
        componentProps.onPress = onPress;
        componentProps.activeOpacity = 0.8;
    }

    return (
        <Component {...componentProps}>
            {children}
        </Component>
    );
};

export const Toast = ({ message, visible, type = 'success' }) => {
    if (!visible) return null;

    return (
        <View style={[styles.toast, styles[`toast_${type}`]]}>
            <Text style={styles.toastText}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    // Button styles
    button: {
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button_primary: {
        backgroundColor: colors.primary,
    },
    button_secondary: {
        backgroundColor: colors.secondary,
    },
    button_outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    button_disabled: {
        opacity: 0.5,
    },
    button_small: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
    },
    button_medium: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    button_large: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    buttonText: {
        ...textStyles.bodyMedium,
    },
    buttonText_primary: {
        color: colors.surface,
    },
    buttonText_secondary: {
        color: colors.surface,
    },
    buttonText_outline: {
        color: colors.primary,
    },
    buttonText_small: {
        fontSize: 14,
    },
    buttonText_medium: {
        fontSize: 16,
    },
    buttonText_large: {
        fontSize: 18,
    },
    icon: {
        marginRight: spacing.xs,
    },

    // Card styles
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    // Toast styles
    toast: {
        position: 'absolute',
        bottom: spacing.xl,
        left: spacing.md,
        right: spacing.md,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        zIndex: 1000,
        alignItems: 'center',
    },
    toast_success: {
        backgroundColor: colors.success,
    },
    toast_error: {
        backgroundColor: colors.error,
    },
    toast_info: {
        backgroundColor: colors.info,
    },
    toastText: {
        ...textStyles.bodyMedium,
        color: colors.surface,
    },
});
