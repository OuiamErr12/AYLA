import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import spacing, { borderRadius, shadows } from '../../theme/spacing';
import FadeInView from '../../components/FadeInView';
import AnimatedButton from '../../components/AnimatedButton';

const AdminDashboard = ({ navigation }) => {
    const adminActions = [
        {
            id: 'products',
            title: 'Manage Products',
            description: 'Add, edit, or remove products from the catalog',
            icon: 'cube-outline',
            screen: 'AdminProductList',
            color: '#A8C9A5', // Greenish
        },
        {
            id: 'orders',
            title: 'Manage Orders',
            description: 'Track and update customer orders',
            icon: 'cart-outline',
            screen: 'AdminOrderList',
            color: '#A5C4D4', // Bluish
        },
        {
            id: 'users',
            title: 'Manage Users',
            description: 'Update user roles and view user details',
            icon: 'people-outline',
            screen: 'AdminUserList',
            color: '#D4A5A5', // Reddish
        },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <AnimatedButton onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.charcoal} />
                </AnimatedButton>
                <Text style={styles.headerTitle}>Admin Panel</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <FadeInView delay={100}>
                    <Text style={styles.welcomeText}>Welcome, Admin</Text>
                    <Text style={styles.subtitle}>Select a section to manage the application.</Text>
                </FadeInView>

                <View style={styles.grid}>
                    {adminActions.map((action, index) => (
                        <FadeInView key={action.id} delay={200 + index * 100}>
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => navigation.navigate(action.screen)}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: action.color + '20' }]}>
                                    <Ionicons name={action.icon} size={32} color={action.color} />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{action.title}</Text>
                                    <Text style={styles.cardDescription}>{action.description}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.gray} />
                            </TouchableOpacity>
                        </FadeInView>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.offWhite,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
        ...shadows.sm,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        ...textStyles.h2,
        color: colors.charcoal,
    },
    content: {
        padding: spacing.lg,
    },
    welcomeText: {
        ...textStyles.h1,
        color: colors.charcoal,
        marginTop: spacing.md,
    },
    subtitle: {
        ...textStyles.body,
        color: colors.darkGray,
        marginBottom: spacing.xl,
    },
    grid: {
        gap: spacing.lg,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        ...shadows.base,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.lg,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        ...textStyles.h4,
        color: colors.charcoal,
        marginBottom: spacing.xs,
    },
    cardDescription: {
        ...textStyles.caption,
        color: colors.darkGray,
    },
});

export default AdminDashboard;
