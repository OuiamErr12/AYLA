import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing, { borderRadius, shadows } from '../theme/spacing';

import FadeInView from '../components/FadeInView';

const ProfileScreen = ({ navigation }) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                    },
                },
            ]
        );
    };

    const menuItems = [
        {
            icon: 'person-outline',
            title: 'Edit Profile',
            onPress: () => navigation.navigate('EditProfile'),
        },
        {
            icon: 'notifications-outline',
            title: 'Notifications',
            onPress: () => navigation.navigate('Notifications'),
        },
        {
            icon: 'settings-outline',
            title: 'Settings',
            onPress: () => navigation.navigate('Settings'),
        },
        {
            icon: 'help-circle-outline',
            title: 'Help & Support',
            onPress: () => navigation.navigate('StaticPage', {
                title: 'Help & Support',
                content: 'Need help? Contact our support team at support@ayla.com.\n\nFAQ:\n\nQ: How do I track my order?\nA: Go to your orders page.\n\nQ: Can I return items?\nA: Yes, within 30 days.'
            }),
        },
        {
            icon: 'information-circle-outline',
            title: 'About',
            onPress: () => navigation.navigate('StaticPage', {
                title: 'About Ayla',
                content: 'Ayla v1.0.0\n\nThe ultimate destination for beauty lovers. Discover, review, and shop the best products.\n\n© 2025 Ayla Inc.'
            }),
        },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>

                {/* User Info Card */}
                <FadeInView style={styles.userCard} delay={100}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={48} color={colors.accent} />
                    </View>
                    <Text style={styles.userName}>{user?.displayName || 'Beauty Lover'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
                </FadeInView>

                {/* Menu Items */}
                <FadeInView style={styles.menuContainer} delay={200}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuItemLeft}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name={item.icon} size={24} color={colors.accent} />
                                </View>
                                <Text style={styles.menuItemText}>{item.title}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
                        </TouchableOpacity>
                    ))}
                </FadeInView>

                {/* Logout Button */}
                <FadeInView style={styles.logoutContainer} delay={300}>
                    <Button
                        title="Logout"
                        onPress={handleLogout}
                        variant="outline"
                    />
                </FadeInView>

                {/* App Version */}
                <FadeInView delay={400}>
                    <Text style={styles.version}>Version 1.0.0</Text>
                </FadeInView>
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
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.base,
    },
    headerTitle: {
        ...textStyles.h2,
        color: colors.charcoal,
    },
    userCard: {
        backgroundColor: colors.white,
        marginHorizontal: spacing.xl,
        marginBottom: spacing.xl,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
        ...shadows.base,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.base,
    },
    userName: {
        ...textStyles.h3,
        color: colors.charcoal,
        marginBottom: spacing.xs,
    },
    userEmail: {
        ...textStyles.body,
        color: colors.darkGray,
    },
    menuContainer: {
        backgroundColor: colors.white,
        marginHorizontal: spacing.xl,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        ...shadows.base,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.base,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.base,
    },
    menuItemText: {
        ...textStyles.body,
        color: colors.charcoal,
        fontWeight: '500',
    },
    logoutContainer: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.xl,
    },
    version: {
        ...textStyles.caption,
        color: colors.gray,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
});

export default ProfileScreen;
