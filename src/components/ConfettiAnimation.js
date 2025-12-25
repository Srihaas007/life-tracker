import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../theme';

const { width, height } = Dimensions.get('window');
const CONFETTI_COUNT = 80;

export const ConfettiAnimation = ({ visible, onComplete }) => {
    const confettiPieces = useRef(
        Array.from({ length: CONFETTI_COUNT }, () => ({
            translateY: useRef(new Animated.Value(0)).current,
            translateX: useRef(new Animated.Value(0)).current,
            rotate: useRef(new Animated.Value(0)).current,
            opacity: useRef(new Animated.Value(1)).current,
            color: colors.confetti[Math.floor(Math.random() * colors.confetti.length)],
            size: Math.random() * 8 + 4,
            startX: Math.random() * width,
            drift: (Math.random() - 0.5) * 200,
        }))
    ).current;

    useEffect(() => {
        if (visible) {
            startAnimation();
        }
    }, [visible]);

    const startAnimation = () => {
        const animations = confettiPieces.flatMap((piece) => [
            Animated.timing(piece.translateY, {
                toValue: height,
                duration: 3000 + Math.random() * 1000,
                useNativeDriver: true,
            }),
            Animated.timing(piece.translateX, {
                toValue: piece.drift,
                duration: 3000 + Math.random() * 1000,
                useNativeDriver: true,
            }),
            Animated.timing(piece.rotate, {
                toValue: Math.random() * 8 - 4,
                duration: 3000,
                useNativeDriver: true,
            }),
            Animated.timing(piece.opacity, {
                toValue: 0,
                duration: 3000,
                useNativeDriver: true,
            }),
        ]);

        Animated.parallel(animations).start(() => {
            // Reset animations
            confettiPieces.forEach((piece) => {
                piece.translateY.setValue(0);
                piece.translateX.setValue(0);
                piece.rotate.setValue(0);
                piece.opacity.setValue(1);
            });

            if (onComplete) {
                onComplete();
            }
        });
    };

    if (!visible) return null;

    return (
        <View style={styles.container} pointerEvents="none">
            {confettiPieces.map((piece, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.confetti,
                        {
                            backgroundColor: piece.color,
                            width: piece.size,
                            height: piece.size * 2,
                            left: piece.startX,
                            transform: [
                                { translateY: piece.translateY },
                                { translateX: piece.translateX },
                                {
                                    rotate: piece.rotate.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0deg', '360deg'],
                                    })
                                },
                            ],
                            opacity: piece.opacity,
                        },
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
    confetti: {
        position: 'absolute',
        borderRadius: 2,
    },
});
