import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing, { borderRadius } from '../theme/spacing';

const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    secureTextEntry,
    icon,
    style,
    inputStyle,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const focusAnim = useRef(new Animated.Value(0)).current;
    const isEditable = props.editable !== false;

    useEffect(() => {
        Animated.timing(focusAnim, {
            toValue: isFocused ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
            easing: Easing.out(Easing.ease),
        }).start();
    }, [isFocused]);

    const borderColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.lightGray || '#E0E0E0', colors.accent || '#D4A574']
    });

    const backgroundColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.offWhite || '#F5F5F5', '#FFFFFF']
    });

    const labelColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.charcoal || '#000', colors.accent || '#D4A574']
    });

    const containerBackgroundColor = isEditable ? backgroundColor : (colors.lightGray || '#F0F0F0');

    return (
        <View style={[styles.container, style]}>
            {label && (
                <Animated.Text style={[styles.label, { color: labelColor }]}>
                    {label}
                </Animated.Text>
            )}
            <Animated.View style={[
                styles.inputContainer,
                {
                    borderColor: error ? colors.error : borderColor,
                    backgroundColor: containerBackgroundColor,
                    transform: [{
                        scale: focusAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.01]
                        })
                    }],
                    opacity: isEditable ? 1 : 0.7
                }
            ]}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={isFocused ? (colors.accent || '#D4A574') : '#666666'}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#999999"
                    secureTextEntry={secureTextEntry}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={[styles.input, inputStyle, !isEditable && { color: colors.gray }]}
                    {...props}
                />
            </Animated.View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.base || 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: borderRadius.md || 12,
        borderWidth: 1.5,
        paddingHorizontal: 16,
        height: 56, // Fixed height for consistency
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000000',
        height: '100%',
    },
    errorText: {
        fontSize: 12,
        color: 'red',
        marginTop: 4,
        marginLeft: 4,
    },
});

export default Input;
