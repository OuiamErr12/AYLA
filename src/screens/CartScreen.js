import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing, { borderRadius, shadows } from '../theme/spacing';
import { getCart, removeFromCart, updateCartQuantity, getCartTotal, clearCart } from '../utils/cartStorage';

import FadeInView from '../components/FadeInView';
import AnimatedButton from '../components/AnimatedButton';

const CartScreen = ({ navigation }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCart();

        // Refresh cart when screen comes into focus
        const unsubscribe = navigation.addListener('focus', () => {
            loadCart();
        });

        return unsubscribe;
    }, [navigation]);

    const loadCart = async () => {
        setLoading(true);
        const cartItems = await getCart();
        setCart(cartItems);
        setLoading(false);
    };

    const handleRemoveItem = async (productId) => {
        Alert.alert(
            'Remove Item',
            'Are you sure you want to remove this item from your cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await removeFromCart(productId);
                        if (result.success) {
                            setCart(result.cart);
                        }
                    }
                }
            ]
        );
    };

    const handleUpdateQuantity = async (productId, newQuantity) => {
        const result = await updateCartQuantity(productId, newQuantity);
        if (result.success) {
            setCart(result.cart);
        }
    };

    const handleClearCart = () => {
        Alert.alert(
            'Clear Cart',
            'Are you sure you want to remove all items from your cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        await clearCart();
                        setCart([]);
                    }
                }
            ]
        );
    };

    const handleCheckout = () => {
        navigation.navigate('Checkout', { cart, total });
    };

    const renderCartItem = ({ item, index }) => (
        <FadeInView delay={index * 100} style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemBrand}>{item.brand}</Text>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

                <View style={styles.quantityContainer}>
                    <AnimatedButton
                        style={styles.quantityButton}
                        onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    >
                        <Ionicons name="remove" size={20} color={colors.charcoal} />
                    </AnimatedButton>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <AnimatedButton
                        style={styles.quantityButton}
                        onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                        <Ionicons name="add" size={20} color={colors.charcoal} />
                    </AnimatedButton>
                </View>
            </View>

            <AnimatedButton
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.id)}
            >
                <Ionicons name="trash-outline" size={20} color={colors.error} />
            </AnimatedButton>
        </FadeInView>
    );

    const total = getCartTotal(cart);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Shopping Cart</Text>
                {cart.length > 0 && (
                    <TouchableOpacity onPress={handleClearCart}>
                        <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>

            {cart.length === 0 ? (
                <FadeInView style={styles.emptyContainer} delay={200}>
                    <Ionicons name="cart-outline" size={80} color={colors.gray} />
                    <Text style={styles.emptyText}>Your cart is empty</Text>
                    <Text style={styles.emptySubtext}>Add some products to get started!</Text>
                    <Button
                        title="Start Shopping"
                        onPress={() => navigation.navigate('Home')}
                        style={styles.shopButton}
                    />
                </FadeInView>
            ) : (
                <>
                    <FlatList
                        data={cart}
                        keyExtractor={(item) => item.id}
                        renderItem={renderCartItem}
                        contentContainerStyle={styles.list}
                    />

                    <FadeInView delay={cart.length * 100} style={styles.footer}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total:</Text>
                            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
                        </View>
                        <Button
                            title="Proceed to Checkout"
                            onPress={handleCheckout}
                            variant="primary"
                        />
                    </FadeInView>
                </>
            )}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    headerTitle: {
        ...textStyles.h2,
        color: colors.charcoal,
    },
    clearText: {
        ...textStyles.body,
        color: colors.error,
        fontWeight: '600',
    },
    list: {
        padding: spacing.lg,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.md,
        backgroundColor: colors.lightGray,
    },
    itemDetails: {
        flex: 1,
        marginLeft: spacing.md,
        justifyContent: 'space-between',
    },
    itemBrand: {
        ...textStyles.caption,
        color: colors.darkGray,
        textTransform: 'uppercase',
    },
    itemName: {
        ...textStyles.body,
        color: colors.charcoal,
        fontWeight: '600',
    },
    itemPrice: {
        ...textStyles.body,
        color: colors.accent,
        fontWeight: '700',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.xs,
    },
    quantityButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.offWhite,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.lightGray,
    },
    quantityText: {
        ...textStyles.body,
        color: colors.charcoal,
        fontWeight: '600',
        minWidth: 30,
        textAlign: 'center',
    },
    removeButton: {
        padding: spacing.sm,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    emptyText: {
        ...textStyles.h3,
        color: colors.charcoal,
        marginTop: spacing.lg,
        marginBottom: spacing.xs,
    },
    emptySubtext: {
        ...textStyles.body,
        color: colors.gray,
        marginBottom: spacing.xl,
    },
    shopButton: {
        minWidth: 200,
    },
    footer: {
        backgroundColor: colors.white,
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
        ...shadows.base,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    totalLabel: {
        ...textStyles.h3,
        color: colors.charcoal,
    },
    totalAmount: {
        ...textStyles.h2,
        color: colors.accent,
        fontWeight: '700',
    },
});

export default CartScreen;
