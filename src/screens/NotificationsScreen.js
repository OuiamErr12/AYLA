import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing from '../theme/spacing';

const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        title: 'Order Shipped!',
        message: 'Your order #12345 has been shipped and is on its way.',
        time: '2 hours ago',
        read: false,
    },
    {
        id: '2',
        title: 'New Collection Alert',
        message: 'The new Summer Glow collection is now available. Check it out!',
        time: '1 day ago',
        read: true,
    },
    {
        id: '3',
        title: 'Flash Sale',
        message: '50% off on all Lipsticks for the next 24 hours!',
        time: '2 days ago',
        read: true,
    },
];

const NotificationsScreen = ({ navigation }) => {
    const renderItem = ({ item }) => (
        <TouchableOpacity style={[styles.notificationItem, !item.read && styles.unreadItem]}>
            <View style={styles.iconContainer}>
                <Ionicons name="notifications" size={24} color={colors.primary} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                <Text style={styles.time}>{item.time}</Text>
            </View>
            {!item.read && <View style={styles.dot} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.charcoal} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={MOCK_NOTIFICATIONS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    headerTitle: {
        ...textStyles.h3,
        color: colors.charcoal,
    },
    listContent: {
        padding: spacing.md,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: spacing.md,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
        alignItems: 'center',
    },
    unreadItem: {
        backgroundColor: '#FFF5F5', // Very light tint 
    },
    iconContainer: {
        marginRight: spacing.md,
        padding: spacing.sm,
        backgroundColor: colors.primaryLight,
        borderRadius: 20,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        ...textStyles.body,
        fontWeight: '600',
        color: colors.charcoal,
        marginBottom: 2,
    },
    message: {
        ...textStyles.caption,
        color: colors.darkGray,
        marginBottom: 4,
    },
    time: {
        ...textStyles.caption,
        color: colors.gray,
        fontSize: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.accent,
        marginLeft: spacing.sm,
    },
});

export default NotificationsScreen;
