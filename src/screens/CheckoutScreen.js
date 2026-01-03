import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import AnimatedButton from '../components/AnimatedButton';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing, { borderRadius, shadows } from '../theme/spacing';
import { getCart, clearCart, getCartTotal } from '../utils/cartStorage';
import { useAuth } from '../contexts/AuthContext';
import FadeInView from '../components/FadeInView';
import Input from '../components/Input';

const CheckoutScreen = ({ navigation, route }) => {
    const { user } = useAuth();
    const { cart, total } = route.params;

    const [fullName, setFullName] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePlaceOrder = async () => {
        // Validation
        if (!fullName || !email || !phone || !address || !city || !postalCode) {
            Alert.alert('Missing Information', 'Please fill in all fields');
            return;
        }

        setLoading(true);

        // Simulate order processing
        setTimeout(async () => {
            setLoading(false);

            // Clear cart after successful order
            await clearCart();

            Alert.alert(
                'Order Placed Successfully! 🎉',
                `Thank you for your order, ${fullName}!\n\nYour order will be delivered to:\n${address}, ${city} ${postalCode}\n\nTotal: $${total.toFixed(2)}`,
                [
                    {
                        text: 'Continue Shopping',
                        onPress: () => navigation.navigate('MainTabs', { screen: 'Home' })
                    }
                ]
            );
        }, 1500);
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
                            <View style={[styles.summaryRow, styles.totalRow]}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
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

                    {/* Payment Note */}
                    <FadeInView style={styles.noteCard} delay={500}>
                        <Ionicons name="information-circle" size={20} color={colors.primary} />
                        <Text style={styles.noteText}>
                            This is a demo app. No actual payment will be processed.
                        </Text>
                    </FadeInView>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Footer */ }
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
});

export default CheckoutScreen;
