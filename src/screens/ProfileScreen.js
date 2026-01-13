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
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, getUserTier } from '../services/userService';
import Button from '../components/Button';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing, { borderRadius, shadows } from '../theme/spacing';

import FadeInView from '../components/FadeInView';

const ProfileScreen = ({ navigation }) => {
    const { user, logout } = useAuth();
    const [userProfile, setUserProfile] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useFocusEffect(
        React.useCallback(() => {
            const fetchProfile = async () => {
                if (user?.uid) {
                    try {
                        const profile = await getUserProfile(user.uid);
                        setUserProfile(profile);
                    } catch (error) {
                        console.error('Error fetching profile in ProfileScreen:', error);
                    } finally {
                        setLoading(false);
                    }
                }
            };

            fetchProfile();
        }, [user?.uid])
    );

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

    const adminItem = {
        icon: 'shield-checkmark-outline',
        title: 'Admin Panel',
        onPress: () => navigation.navigate('AdminDashboard'),
    };

    const displayMenuItems = user?.role === 'admin' ? [adminItem, ...menuItems] : menuItems;

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

                    {/* Ayla Points Badge */}
                    <View style={styles.pointsBadgeContainer}>
                        <View style={styles.pointsBadge}>
                            <Ionicons name="sparkles" size={16} color={colors.accent} />
                            <Text style={styles.pointsText}>{userProfile?.points || 0} Ayla Points</Text>
                        </View>
                        {userProfile?.points > 0 && (
                            <View style={[styles.tierBadge, { backgroundColor: getUserTier(userProfile.points).color }]}>
                                <Text style={styles.tierBadgeText}>{getUserTier(userProfile.points).name}</Text>
                            </View>
                        )}
                    </View>

                    {user?.role === 'admin' && (
                        <View style={styles.adminBadge}>
                            <Text style={styles.adminBadgeText}>ADMIN</Text>
                        </View>
                    )}
                </FadeInView>

                {/* Menu Items */}
                <FadeInView style={styles.menuContainer} delay={200}>
                    {displayMenuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuItemLeft}>
                                <View style={styles.iconContainer}>
                                    <Ionicons
                                        name={item.icon}
                                        size={24}
                                        color={item.title === 'Admin Panel' ? colors.charcoal : colors.accent}
                                    />
                                </View>
                                <Text style={[
                                    styles.menuItemText,
                                    item.title === 'Admin Panel' && { fontWeight: 'bold' }
                                ]}>{item.title}</Text>
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
        paddingVertical: spacing.lg,
        alignItems: 'center', // Center title
    },
    headerTitle: {
        ...textStyles.h2,
        color: colors.charcoal,
    },
    userCard: {
        // Removed card styling (bg, shadow, radius) for elegance
        marginBottom: spacing.xxl, // More breathing room
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    avatar: {
        width: 110, // Slightly larger
        height: 110,
        borderRadius: 55,
        backgroundColor: colors.white, // White bg for avatar placeholder
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
        ...shadows.sm, // Keep subtle shadow only on avatar
        borderWidth: 2,
        borderColor: colors.white,
    },
    userName: {
        ...textStyles.h2, // Larger name
        color: colors.charcoal,
        marginBottom: 4,
    },
    userEmail: {
        ...textStyles.body,
        color: colors.gray,
        marginBottom: spacing.lg,
    },
    menuContainer: {
        // Removed container styling
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.xl,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.03)', // Very subtle divider
        marginBottom: spacing.xs,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        // Removed background color and size constraints
        width: 30, // Just enough space
        alignItems: 'center',
        marginRight: spacing.md,
    },
    menuItemText: {
        ...textStyles.body,
        fontSize: 16,
        color: colors.charcoal,
        fontWeight: '400', // Lighter weight for elegance
    },
    pointsBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    pointsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border,
    },
    tierBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
    },
    tierBadgeText: {
        ...textStyles.caption,
        color: colors.white,
        fontWeight: '600',
    },
    pointsText: {
        ...textStyles.caption,
        color: colors.charcoal,
        fontWeight: '600',
        marginLeft: spacing.xs,
    },
    logoutContainer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    version: {
        ...textStyles.caption,
        color: colors.gray,
        textAlign: 'center',
        marginBottom: spacing.xl,
        opacity: 0.5,
    },
    adminBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.charcoal,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    adminBadgeText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
