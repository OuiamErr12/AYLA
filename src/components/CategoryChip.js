import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing, { borderRadius } from '../theme/spacing';

const CategoryChip = ({ label, active = false, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.chip, active && styles.chipActive]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.label, active && styles.labelActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.lightGray,
        marginRight: spacing.sm,
    },
    chipActive: {
        backgroundColor: colors.accent,
    },
    label: {
        ...textStyles.bodySmall,
        color: '#000000', // Explicit Black
        fontWeight: '600',
    },
    labelActive: {
        color: '#FFFFFF', // Explicit White
    },
});

export default CategoryChip;
