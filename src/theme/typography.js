// Typography system
export const fonts = {
    regular: {
        fontFamily: 'System',
        fontWeight: '400',
    },
    medium: {
        fontFamily: 'System',
        fontWeight: '500',
    },
    bold: {
        fontFamily: 'System',
        fontWeight: '700',
    },
};

export const fontSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
};

// Text presets
export const textStyles = {
    h1: {
        ...fonts.bold,
        fontSize: fontSizes.xxxl,
        lineHeight: 40,
    },
    h2: {
        ...fonts.bold,
        fontSize: fontSizes.xxl,
        lineHeight: 32,
    },
    h3: {
        ...fonts.medium,
        fontSize: fontSizes.xl,
        lineHeight: 28,
    },
    body: {
        ...fonts.regular,
        fontSize: fontSizes.md,
        lineHeight: 24,
    },
    bodyMedium: {
        ...fonts.medium,
        fontSize: fontSizes.md,
        lineHeight: 24,
    },
    caption: {
        ...fonts.regular,
        fontSize: fontSizes.sm,
        lineHeight: 20,
    },
    small: {
        ...fonts.regular,
        fontSize: fontSizes.xs,
        lineHeight: 16,
    },
};
