import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import AnimatedButton from '../components/AnimatedButton';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing, { borderRadius, shadows } from '../theme/spacing';
import { getCart, clearCart, getCartTotal } from '../utils/cartStorage';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../services/orderService';
import { addPoints, getUserTier, getUserProfile } from '../services/userService';
import FadeInView from '../components/FadeInView';
import Input from '../components/Input';
import { generateInvoiceHtml } from '../utils/pdfGenerator';

const CheckoutScreen = ({ navigation, route }) => {
    const { user } = useAuth();
    const { cart, total } = route.params;

    const [fullName, setFullName] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    const [loading, setLoading] = useState(false);
    const [userTier, setUserTier] = useState({ name: 'Bronze', discount: 0, color: colors.accent });

    React.useEffect(() => {
        const fetchTier = async () => {
            if (user?.uid && user.uid !== 'guest') {
                try {
                    const profile = await getUserProfile(user.uid);
                    const tier = getUserTier(profile?.points || 0);
                    setUserTier(tier);
                } catch (error) {
                    console.error('Error fetching tier:', error);
                }
            }
        };
        fetchTier();
    }, [user?.uid]);

    const discountAmount = total * userTier.discount;
    const finalTotal = total - discountAmount;

    const handlePlaceOrder = async () => {
        // Validation
        const errors = [];
        if (!fullName.trim()) errors.push('Full Name is required');
        if (!email.trim()) errors.push('Email is required');
        else if (!/\S+@\S+\.\S+/.test(email)) errors.push('Email is invalid');
        if (!phone.trim()) errors.push('Phone is required');
        if (!address.trim()) errors.push('Address is required');
        if (!city.trim()) errors.push('City is required');
        if (!postalCode.trim()) errors.push('Postal Code is required');

        if (errors.length > 0) {
            Alert.alert('Missing Information', errors.join('\n'));
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                userId: user?.uid || 'guest',
                customerName: fullName,
                email,
                phone,
                shippingAddress: {
                    address,
                    city,
                    postalCode,
                },
                items: cart,
                subtotal: total,
                discount: discountAmount,
                total: finalTotal,
                paymentMethod,
                tier: userTier.name
            };

            const orderResponse = await createOrder(orderData);
            const orderId = orderResponse.id;
            const finalOrderData = { ...orderData, id: orderId };

            // Generate HTML for preview
            const html = generateInvoiceHtml(finalOrderData);

            // Clear cart
            await clearCart();

            // Award Loyalty Points (if user is logged in)
            if (user && user.uid !== 'guest') {
                try {
                    const pointsToAward = Math.floor(finalTotal);
                    await addPoints(user.uid, pointsToAward);
                    console.log(`Awarded ${pointsToAward} points to user ${user.uid}`);
                } catch (pointsError) {
                    console.error('Failed to award points, but order was placed:', pointsError);
                }
            }

            setLoading(false);

            // Navigate to Preview
            navigation.replace('InvoicePreview', {
                orderData: finalOrderData,
                html
            });
        } catch (error) {
            console.error('Error placing order:', error);
            setLoading(false);
            Alert.alert('Order Failed', `We could not place your order. Please try again.\nError: ${error.message || 'Unknown error'}`);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <AnimatedButton onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={colors.charcoal}
                    />
                </AnimatedButton>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>
                    {/* Order Summary */}
                    <FadeInView style={styles.section} delay={100}>
                        <Text style={styles.sectionTitle}>Order Summary</Text>
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Items ({cart.length})</Text>
                                <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Shipping</Text>
                                <Text style={styles.summaryValue}>Free</Text>
                            </View>
                            {userTier.discount > 0 && (
                                <View style={styles.summaryRow}>
                                    <Text style={[styles.summaryLabel, { color: userTier.color, fontWeight: 'bold' }]}>
                                        Remise Fidélité ({userTier.name})
                                    </Text>
                                    <Text style={[styles.summaryValue, { color: userTier.color }]}>
                                        -${discountAmount.toFixed(2)}
                                    </Text>
                                </View>
                            )}
                            <View style={[styles.summaryRow, styles.totalRow]}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
                            </View>
                        </View>
                    </FadeInView>

                    {/* Shipping Information */}
                    <FadeInView style={styles.section} delay={300}>
                        <Text style={styles.sectionTitle}>Shipping Information</Text>

                        <Input
                            label="Full Name *"
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Enter your full name"
                        />

                        <Input
                            label="Email *"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Input
                            label="Phone Number *"
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                        />

                        <Input
                            label="Address *"
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Street address"
                        />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: spacing.sm }}>
                                <Input
                                    label="City *"
                                    value={city}
                                    onChangeText={setCity}
                                    placeholder="City"
                                />
                            </View>

                            <View style={{ flex: 1, marginLeft: spacing.sm }}>
                                <Input
                                    label="Postal Code *"
                                    value={postalCode}
                                    onChangeText={setPostalCode}
                                    placeholder="Postal code"
                                />
                            </View>
                        </View>
                    </FadeInView>

                    {/* Payment Method */}
                    <FadeInView style={styles.section} delay={500}>
                        <Text style={styles.sectionTitle}>Payment Method</Text>
                        <TouchableOpacity
                            style={[styles.paymentOption, paymentMethod === 'Cash on Delivery' && styles.paymentOptionActive]}
                            onPress={() => setPaymentMethod('Cash on Delivery')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.paymentIconContainer}>
                                <Ionicons name="cash-outline" size={24} color={colors.accent} />
                            </View>
                            <View style={styles.paymentTextContainer}>
                                <Text style={styles.paymentName}>Espèces (Cash on Delivery)</Text>
                                <Text style={styles.paymentDesc}>Pay when you receive your order</Text>
                            </View>
                            <View style={styles.radioButton}>
                                {paymentMethod === 'Cash on Delivery' && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    </FadeInView>

                    {/* Order Summary Note */}
                    <FadeInView style={styles.noteCard} delay={600}>
                        <Ionicons name="information-circle" size={20} color={colors.primary} />
                        <Text style={styles.noteText}>
                            Une facture PDF sera générée automatiquement après la confirmation.
                        </Text>
                    </FadeInView>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Footer */}
            <View style={styles.footer}>
                <Button
                    title={loading ? "Processing..." : "Place Order"}
                    onPress={handlePlaceOrder}
                    variant="primary"
                    disabled={loading}
                />
            </View>
        </SafeAreaView >
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
    content: {
        padding: spacing.lg,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...textStyles.h3,
        color: colors.charcoal,
        marginBottom: spacing.md,
    },
    summaryCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.sm,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    summaryLabel: {
        ...textStyles.body,
        color: colors.darkGray,
    },
    summaryValue: {
        ...textStyles.body,
        color: colors.charcoal,
        fontWeight: '600',
    },
    totalRow: {
        marginTop: spacing.sm,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
        marginBottom: 0,
    },
    totalLabel: {
        ...textStyles.h4,
        color: colors.charcoal,
    },
    totalValue: {
        ...textStyles.h3,
        color: colors.accent,
        fontWeight: '700',
    },
    row: {
        flexDirection: 'row',
    },
    noteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primaryLight,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        gap: spacing.sm,
    },
    noteText: {
        ...textStyles.caption,
        color: colors.primary,
        flex: 1,
    },
    footer: {
        backgroundColor: colors.white,
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
        ...shadows.base,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 2,
        borderColor: colors.lightGray,
        ...shadows.sm,
    },
    paymentOptionActive: {
        borderColor: colors.accent,
        backgroundColor: colors.white,
    },
    paymentIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.accentLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    paymentTextContainer: {
        flex: 1,
    },
    paymentName: {
        ...textStyles.body,
        fontWeight: '700',
        color: colors.charcoal,
    },
    paymentDesc: {
        ...textStyles.caption,
        color: colors.darkGray,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.accent,
    },
});

export default CheckoutScreen;
