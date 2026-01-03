import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing, { borderRadius, shadows } from '../theme/spacing';

const SearchBar = ({ value, onChangeText, placeholder = "Search products...", style }) => {
    return (
        <View style={[styles.container, style]}>
            <Ionicons name="search" size={20} color={colors.gray} style={styles.icon} />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.gray}
                style={styles.input}
            />
            {value ? (
                <Ionicons
                    name="close-circle"
                    size={20}
                    color={colors.gray}
                    onPress={() => onChangeText('')}
                />
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
        ...shadows.sm,
    },
    icon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        ...textStyles.body,
        color: colors.black,
    },
});

export default SearchBar;
