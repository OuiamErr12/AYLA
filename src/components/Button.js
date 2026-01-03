import React from 'react';
import { Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedButton from './AnimatedButton';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing, { borderRadius } from '../theme/spacing';

const Button = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    textStyle
}) => {
    const getButtonStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.secondaryButton;
            case 'outline':
                return styles.outlineButton;
            default:
                return null; // Primary uses gradient
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'outline':
                return styles.outlineText;
            default:
                return styles.buttonText;
        }
    };

    const content = (
        <>
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? colors.accent : colors.white} />
            ) : (
                <Text style={[getTextStyle(), textStyle]}>{title}</Text>
            )}
        </>
    );

    if (variant === 'primary' && !disabled) {
        return (
            <AnimatedButton
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.8}
                style={[styles.buttonBase, style]}
            >
                <LinearGradient
                    colors={[colors.gradientStart, colors.gradientMiddle, colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    {content}
                </LinearGradient>
            </AnimatedButton>
        );
    }

    return (
        <AnimatedButton
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.buttonBase,
                getButtonStyle(),
                disabled && styles.disabled,
                style
            ]}
        >
            {content}
        </AnimatedButton>
    );
};

const styles = StyleSheet.create({
    buttonBase: {
        borderRadius: borderRadius.md,
        overflow: 'hidden',
    },
    gradient: {
        paddingVertical: spacing.base,
        paddingHorizontal: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    secondaryButton: {
        backgroundColor: colors.secondary,
        paddingVertical: spacing.base,
        paddingHorizontal: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.accent,
        paddingVertical: spacing.base,
        paddingHorizontal: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    buttonText: {
        ...textStyles.button,
        color: colors.white,
        textTransform: 'uppercase',
    },
    outlineText: {
        ...textStyles.button,
        color: colors.accent,
        textTransform: 'uppercase',
    },
    disabled: {
        opacity: 0.5,
    },
});

export default Button;
