// Ayla Typography System
export const typography = {
    // Font Families
    fonts: {
        heading: 'System', // Will use system default, can be customized with expo-font
        body: 'System',
        mono: 'monospace',
    },

    // Font Sizes
    sizes: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
    },

    // Font Weights
    weights: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
    },

    // Line Heights
    lineHeights: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2,
    },

    // Letter Spacing
    letterSpacing: {
        tight: -0.5,
        normal: 0,
        wide: 0.5,
        wider: 1,
    },
};

// Pre-defined Text Styles
export const textStyles = {
    h1: {
        fontSize: typography.sizes['4xl'],
        fontWeight: typography.weights.bold,
        letterSpacing: typography.letterSpacing.tight,
    },
    h2: {
        fontSize: typography.sizes['3xl'],
        fontWeight: typography.weights.bold,
    },
    h3: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.weights.semibold,
    },
    h4: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.semibold,
    },
    body: {
        fontSize: typography.sizes.base,
        fontWeight: typography.weights.regular,
    },
    bodyLarge: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.regular,
    },
    bodySmall: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.regular,
    },
    caption: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.regular,
        letterSpacing: typography.letterSpacing.wide,
    },
    button: {
        fontSize: typography.sizes.base,
        fontWeight: typography.weights.semibold,
        letterSpacing: typography.letterSpacing.wide,
    },
};

export default typography;
