import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import spacing, { borderRadius, shadows } from '../../theme/spacing';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import AnimatedButton from '../../components/AnimatedButton';
import FadeInView from '../../components/FadeInView';

const AdminOrderList = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            Alert.alert('Error', 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = (order) => {
        const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

        Alert.alert(
            'Update Status',
            'Select new order status:',
            statuses.map(status => ({
                text: status,
                onPress: async () => {
                    try {
                        await updateOrderStatus(order.id, status);
                        setOrders(orders.map(o => o.id === order.id ? { ...o, status } : o));
                        Alert.alert('Success', `Status updated to ${status}`);
                    } catch (error) {
                        Alert.alert('Error', 'Failed to update status');
                    }
                }
            })).concat([{ text: 'Cancel', style: 'cancel' }])
        );
    };

    const renderItem = ({ item, index }) => (
        <FadeInView delay={index * 50} style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <View>
                    <Text style={styles.orderId}>Order #{item.id.slice(-6).toUpperCase()}</Text>
                    <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}
                    onPress={() => handleStatusUpdate(item)}
                >
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                    <Ionicons name="caret-down" size={12} color={getStatusColor(item.status)} style={{ marginLeft: 4 }} />
                </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.orderContent}>
                <View style={styles.customerInfo}>
                    <Ionicons name="person-outline" size={14} color={colors.darkGray} />
                    <Text style={styles.customerName}>{item.customerName}</Text>
                </View>
                <View style={styles.orderSummary}>
                    <Text style={styles.itemCount}>{item.items.length} item(s)</Text>
                    <View style={{ alignItems: 'flex-end' }}>
                        {item.discount > 0 && (
                            <Text style={styles.discountInfo}>
                                -{item.discount.toFixed(2)}€ ({item.tier})
                            </Text>
                        )}
                        <Text style={styles.totalPrice}>${item.total.toFixed(2)}</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => Alert.alert('Order Details', JSON.stringify(item.shippingAddress, null, 2))}
            >
                <Text style={styles.detailsButtonText}>View Details</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.accent} />
            </TouchableOpacity>
        </FadeInView>
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return colors.warning;
            case 'Shipped': return colors.info;
            case 'Delivered': return colors.success;
            case 'Cancelled': return colors.error;
            case 'Processing': return colors.accent;
            default: return colors.darkGray;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <AnimatedButton onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.charcoal} />
                </AnimatedButton>
                <Text style={styles.headerTitle}>Orders</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshing={loading}
                onRefresh={fetchOrders}
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="cart-outline" size={64} color={colors.gray} />
                            <Text style={styles.emptyText}>No orders yet</Text>
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
    headerTitle: {
        ...textStyles.h2,
        color: colors.charcoal,
    },
    listContent: {
        padding: spacing.lg,
    },
    orderCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderId: {
        ...textStyles.body,
        fontWeight: 'bold',
        color: colors.charcoal,
    },
    orderDate: {
        ...textStyles.caption,
        color: colors.darkGray,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: colors.lightGray,
        marginVertical: spacing.md,
    },
    orderContent: {
        marginBottom: spacing.md,
    },
    customerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
        gap: spacing.xs,
    },
    customerName: {
        ...textStyles.bodySmall,
        color: colors.charcoal,
    },
    orderSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemCount: {
        ...textStyles.caption,
        color: colors.darkGray,
    },
    totalPrice: {
        ...textStyles.body,
        fontWeight: 'bold',
        color: colors.accent,
    },
    discountInfo: {
        ...textStyles.caption,
        color: colors.accentDark,
        fontWeight: '600',
        marginBottom: 2,
    },
    detailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
    },
    detailsButtonText: {
        ...textStyles.button,
        fontSize: 14,
        color: colors.accent,
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

export default AdminOrderList;
