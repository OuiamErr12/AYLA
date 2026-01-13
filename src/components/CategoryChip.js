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
        paddingVertical: 10,
        borderRadius: borderRadius.circle,
        backgroundColor: 'transparent', // No background for inactive
        marginRight: spacing.sm,
    },
    chipActive: {
        backgroundColor: colors.primary, // Using primary (Nude/Beige) or accent based on preference. Let's use accent match the 'brown' look better or stick to existing. 
        // User said "like the photo" which is brown. colors.accent is #C4A484. colors.primary is #E8DCCA (lighter).
        // The photo looked like a stronger beige/brown. I'll stick to accent or primary. 
        // Let's use colors.accent which is darker/richer like the photo.
        backgroundColor: colors.accent,
    },
    label: {
        ...textStyles.bodySmall,
        color: colors.text, // Simple dark text for inactive
        fontWeight: '600',
    },
    labelActive: {
        color: colors.white,
    },
});

export default CategoryChip;
