import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { colors, spacing, textStyles } from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ProgressCard = ({ percentage = 0, title = 'Today\'s Progress' }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    const size = 120;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: percentage,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [percentage]);

    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [circumference, 0],
    });

    const getProgressColor = () => {
        if (percentage >= 80) return colors.success;
        if (percentage >= 50) return colors.secondary;
        return colors.primary;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.progressContainer}>
                <Svg width={size} height={size}>
                    {/* Background circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={colors.border}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />

                    {/* Progress circle */}
                    <AnimatedCircle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={getProgressColor()}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation={-90}
                        origin={`${size / 2}, ${size / 2}`}
                    />
                </Svg>

                <View style={styles.percentageContainer}>
                    <Text style={styles.percentage}>{percentage}%</Text>
                    <Text style={styles.percentageLabel}>Complete</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
    },
    title: {
        ...textStyles.h3,
        color: colors.text,
        marginBottom: spacing.md,
    },
    progressContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentageContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    percentage: {
        ...textStyles.h1,
        color: colors.text,
    },
    percentageLabel: {
        ...textStyles.caption,
        color: colors.textSecondary,
    },
});
