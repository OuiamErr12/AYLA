import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing, { borderRadius, shadows } from '../theme/spacing';

import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.lg * 2 - spacing.md) / 2;

const ProductCard = ({ product, onPress, onToggleWishlist, isWishlisted, index = 0, style }) => {
    const { user } = useAuth();
    const isAdmin = user?.role?.trim() === 'admin';
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const pressAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 100, // Staggered effect based on index
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 100,
                useNativeDriver: true,
            })
        ]).start();
    }, [index]);

    const handlePressIn = () => {
        Animated.spring(pressAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(pressAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={[
            styles.container,
            style,
            {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }]
            }
        ]}>
            <TouchableOpacity
                style={styles.card}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                <Animated.View style={[
                    styles.contentContainer,
                    { transform: [{ scale: pressAnim }] }
                ]}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: product.image }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        {!isAdmin && (
                            <TouchableOpacity
                                style={styles.wishlistButton}
                                onPress={onToggleWishlist}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={isWishlisted ? "heart" : "heart-outline"}
                                    size={20}
                                    color={isWishlisted ? colors.error : colors.charcoal}
                                />
                            </TouchableOpacity>
                        )}
                        {product.isNew && (
                            <View style={styles.newBadge}>
                                <Text style={styles.newBadgeText}>NEW</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.details}>
                        <Text style={styles.brand} numberOfLines={1}>{product.brand}</Text>
                        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>

                        <View style={styles.footer}>
                            <Text style={styles.price}>${product.price}</Text>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={12} color={colors.accent} />
                                <Text style={styles.rating}>{product.rating}</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
        width: cardWidth,
    },
    card: {
        width: '100%',
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        ...shadows.sm,
        overflow: 'hidden',
    },
    contentContainer: {
        width: '100%',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 0.8,
        backgroundColor: colors.lightGray,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    wishlistButton: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
    newBadge: {
        position: 'absolute',
        top: spacing.sm,
        left: spacing.sm,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
        borderRadius: borderRadius.xs,
    },
    newBadgeText: {
        ...textStyles.caption,
        color: colors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    details: {
        padding: spacing.sm,
    },
    brand: {
        ...textStyles.caption,
        color: '#444', // Darker gray for better visibility
        marginBottom: 2,
    },
    name: {
        ...textStyles.body,
        fontWeight: '600',
        color: '#000', // Black for visibility
        marginBottom: spacing.xs,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    price: {
        ...textStyles.body,
        fontWeight: 'bold',
        color: colors.primary,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    rating: {
        ...textStyles.caption,
        color: '#444',
        fontWeight: '500',
    },
});

export default ProductCard;
