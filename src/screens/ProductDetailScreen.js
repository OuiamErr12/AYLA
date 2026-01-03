import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    Linking,
    Alert,
    Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import FadeInView from '../components/FadeInView';
import AnimatedButton from '../components/AnimatedButton';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing, { borderRadius, shadows } from '../theme/spacing';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../services/wishlistService';
import { addToCart } from '../utils/cartStorage';
import { shareProduct } from '../utils/share';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
    const { product } = route.params;
    const { user } = useAuth();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [inWishlist, setInWishlist] = useState(false);

    useEffect(() => {
        checkWishlistStatus();
    }, []);

    const checkWishlistStatus = async () => {
        const status = await isInWishlist(product.id);
        setInWishlist(status);
    };

    const handleWishlistToggle = async () => {
        try {
            if (inWishlist) {
                await removeFromWishlist(user?.uid, product.id);
                setInWishlist(false);
                Alert.alert('Removed', 'Product removed from wishlist');
            } else {
                await addToWishlist(user?.uid, product);
                setInWishlist(true);
                Alert.alert('Added', 'Product added to wishlist');
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            Alert.alert('Error', 'Failed to update wishlist');
        }
    };

    const handleAddToCart = async () => {
        const result = await addToCart(product, 1);
        if (result.success) {
            Alert.alert(
                'Added to Cart',
                `${product.name} has been added to your cart!`,
                [
                    { text: 'Continue Shopping', style: 'cancel' },
                    { text: 'View Cart', onPress: () => navigation.navigate('MainTabs', { screen: 'Cart' }) }
                ]
            );
        } else {
            Alert.alert('Error', 'Failed to add product to cart');
        }
    };

    const handleShare = async () => {
        try {
            await shareProduct(product);
        } catch (error) {
            console.error('Error sharing product:', error);
        }
    };

    const images = product.images || [product.image];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <AnimatedButton
                        style={styles.headerButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.charcoal} />
                    </AnimatedButton>
                    <AnimatedButton
                        style={styles.headerButton}
                        onPress={handleShare}
                    >
                        <Ionicons name="share-outline" size={24} color={colors.charcoal} />
                    </AnimatedButton>
                </View>

                {/* Image Gallery */}
                <FadeInView style={styles.imageContainer} delay={0}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(event) => {
                            const index = Math.round(event.nativeEvent.contentOffset.x / width);
                            setCurrentImageIndex(index);
                        }}
                    >
                        {images.map((img, index) => (
                            <Image
                                key={index}
                                source={{ uri: img }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        ))}
                    </ScrollView>

                    {/* Image Indicators */}
                    {images.length > 1 && (
                        <View style={styles.indicators}>
                            {images.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.indicator,
                                        currentImageIndex === index && styles.indicatorActive
                                    ]}
                                />
                            ))}
                        </View>
                    )}
                </FadeInView>

                {/* Product Info */}
                <View style={styles.content}>
                    <FadeInView delay={200}>
                        <View style={styles.brandRow}>
                            <Text style={styles.brand}>{product.brand}</Text>
                            {product.rating && (
                                <View style={styles.rating}>
                                    <Ionicons name="star" size={18} color={colors.accent} />
                                    <Text style={styles.ratingText}>{product.rating}</Text>
                                </View>
                            )}
                        </View>

                        <Text style={styles.name}>{product.name}</Text>
                        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    </FadeInView>

                    {/* Description */}
                    <FadeInView style={styles.section} delay={300}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </FadeInView>

                    {/* Action Buttons */}
                    <FadeInView style={styles.actions} delay={400}>
                        <AnimatedButton
                            style={[styles.actionButton, inWishlist && styles.actionButtonActive]}
                            onPress={handleWishlistToggle}
                        >
                            <Ionicons
                                name={inWishlist ? "heart" : "heart-outline"}
                                size={24}
                                color={inWishlist ? colors.error : colors.accent}
                            />
                            <Text style={[styles.actionText, inWishlist && styles.actionTextActive]}>
                                {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                            </Text>
                        </AnimatedButton>

                        <Button
                            title="Add to Cart"
                            onPress={handleAddToCart}
                            variant="primary"
                            style={styles.merchantButton}
                        />
                    </FadeInView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.base,
        zIndex: 10,
    },
    headerButton: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.full,
        padding: spacing.sm,
        ...shadows.sm,
    },
    imageContainer: {
        width: width,
        height: width * 1.2,
        backgroundColor: colors.lightGray,
    },
    image: {
        width: width,
        height: width * 1.2,
    },
    indicators: {
        position: 'absolute',
        bottom: spacing.lg,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.xs,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.white,
        opacity: 0.5,
    },
    indicatorActive: {
        opacity: 1,
        backgroundColor: colors.accent,
    },
    content: {
        padding: spacing.xl,
    },
    brandRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    brand: {
        ...textStyles.caption,
        color: colors.darkGray,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        ...textStyles.body,
        color: colors.darkGray,
        fontWeight: '600',
    },
    name: {
        ...textStyles.h2,
        color: colors.charcoal,
        marginBottom: spacing.base,
    },
    price: {
        ...textStyles.h3,
        color: colors.accent,
        fontWeight: '700',
        marginBottom: spacing.xl,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...textStyles.h4,
        color: colors.charcoal,
        marginBottom: spacing.sm,
    },
    description: {
        ...textStyles.body,
        color: colors.darkGray,
        lineHeight: 24,
    },
    actions: {
        gap: spacing.base,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.offWhite,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.base,
        paddingHorizontal: spacing.xl,
        borderWidth: 2,
        borderColor: colors.accent,
        gap: spacing.sm,
    },
    actionButtonActive: {
        backgroundColor: colors.primaryLight,
    },
    actionText: {
        ...textStyles.button,
        color: colors.accent,
    },
    actionTextActive: {
        color: colors.error,
    },
    merchantButton: {
        marginTop: spacing.sm,
    },
});

export default ProductDetailScreen;
