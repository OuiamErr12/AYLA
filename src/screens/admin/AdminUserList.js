import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import spacing, { borderRadius, shadows } from '../../theme/spacing';
import { getAllUsers, updateUserRole } from '../../services/userService';
import AnimatedButton from '../../components/AnimatedButton';
import FadeInView from '../../components/FadeInView';
import SearchBar from '../../components/SearchBar';
import { useAuth } from '../../contexts/AuthContext';

const AdminUserList = ({ navigation }) => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            Alert.alert('Error', 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = users.filter(u =>
                u.name?.toLowerCase().includes(query) ||
                u.email?.toLowerCase().includes(query)
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    const handleRoleToggle = (user) => {
        if (user.id === currentUser.uid) {
            Alert.alert('Action Restricted', 'You cannot change your own role.');
            return;
        }

        const newRole = user.role === 'admin' ? 'user' : 'admin';

        Alert.alert(
            'Change Role',
            `Change ${user.name}'s role to ${newRole}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Change',
                    onPress: async () => {
                        try {
                            await updateUserRole(user.id, newRole);
                            setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
                            Alert.alert('Success', 'User role updated');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to update user role');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item, index }) => (
        <FadeInView delay={index * 50} style={styles.userCard}>
            <View style={styles.userIcon}>
                <Ionicons name="person" size={24} color={colors.primary} />
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <View style={[
                    styles.roleBadge,
                    { backgroundColor: item.role === 'admin' ? colors.accentLight : colors.lightGray }
                ]}>
                    <Text style={[
                        styles.roleText,
                        { color: item.role === 'admin' ? colors.accentDark : colors.darkGray }
                    ]}>
                        {item.role || 'user'}
                    </Text>
                </View>

                {item.points > 0 && (
                    <View style={styles.pointsBadge}>
                        <Ionicons name="sparkles" size={12} color={colors.accent} />
                        <Text style={styles.pointsText}>{item.points} pts</Text>
                    </View>
                )}
            </View>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleRoleToggle(item)}
            >
                <Ionicons
                    name={item.role === 'admin' ? "shield-outline" : "shield-checkmark-outline"}
                    size={24}
                    color={colors.charcoal}
                />
            </TouchableOpacity>
        </FadeInView>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <AnimatedButton onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.charcoal} />
                </AnimatedButton>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.headerTitle}>User Management</Text>
                    <Text style={styles.userCount}>{users.length} total users</Text>
                </View>
                <AnimatedButton onPress={fetchUsers} style={styles.backButton}>
                    <Ionicons name="refresh" size={22} color={colors.charcoal} />
                </AnimatedButton>
            </View>

            <View style={styles.searchSection}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search by name or email..."
                />
            </View>

            <FlatList
                data={filteredUsers}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshing={loading}
                onRefresh={fetchUsers}
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="people-outline" size={64} color={colors.gray} />
                            <Text style={styles.emptyText}>No users found in database</Text>
                        </View>
                    )
                }
            />
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
    },
    backButton: {
        padding: spacing.xs,
    },
    searchSection: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    headerTitle: {
        ...textStyles.h3,
        color: colors.charcoal,
    },
    userCount: {
        ...textStyles.caption,
        color: colors.darkGray,
    },
    listContent: {
        padding: spacing.lg,
    },
    userCard: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        alignItems: 'center',
        ...shadows.sm,
    },
    userIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        ...textStyles.body,
        fontWeight: '600',
        color: colors.charcoal,
    },
    userEmail: {
        ...textStyles.bodySmall,
        color: colors.darkGray,
    },
    roleBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
        marginTop: spacing.xs,
    },
    roleText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    pointsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
        gap: 4,
    },
    pointsText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.accent,
    },
    actionButton: {
        padding: spacing.sm,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing['5xl'],
    },
    emptyText: {
        ...textStyles.body,
        color: colors.darkGray,
        marginTop: spacing.md,
    },
});

export default AdminUserList;
