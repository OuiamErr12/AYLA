import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import FadeInView from '../components/FadeInView';
import AnimatedButton from '../components/AnimatedButton';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing from '../theme/spacing';
import { getUserWishlist, removeFromWishlist } from '../services/wishlistService';
import { shareWishlist } from '../utils/share';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.xl * 3) / 2;

const WishlistScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadWishlist();
        }, [])
    );

    const loadWishlist = async () => {
        try {
            setLoading(true);
            const items = await getUserWishlist(user?.uid);
            setWishlist(items);
        } catch (error) {
            console.error('Error loading wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        Alert.alert(
            'Remove from Wishlist',
            'Are you sure you want to remove this product?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await removeFromWishlist(user?.uid, productId);
                            setWishlist(prev => prev.filter(p => p.id !== productId));
                        } catch (error) {
                            console.error('Error removing from wishlist:', error);
                            Alert.alert('Error', 'Failed to remove product');
                        }
                    },
                },
            ]
        );
    };

    const handleShare = async () => {
        if (wishlist.length === 0) {
            Alert.alert('Empty Wishlist', 'Add some products to your wishlist first!');
            return;
        }

        try {
            await shareWishlist(wishlist);
        } catch (error) {
            console.error('Error sharing wishlist:', error);
        }
    };

    const renderProduct = ({ item, index }) => (
        <View style={styles.gridItem}>
            <ProductCard
                product={item}
                index={index}
                style={{ width: '100%' }}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
                onToggleWishlist={() => handleRemove(item.id)}
                isWishlisted={true}
            />
        </View>
    );

    const renderEmpty = () => (
        <FadeInView style={styles.emptyContainer} delay={300}>
            <Ionicons name="heart-outline" size={80} color={colors.gray} />
            <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
            <Text style={styles.emptyText}>
                Start adding products you love to your wishlist
            </Text>
            <Button
                title="Discover Products"
                onPress={() => navigation.navigate('Home')}
                style={styles.discoverButton}
            />
        </FadeInView>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <FadeInView style={styles.header} delay={100}>
                <Text style={styles.headerTitle}>My Wishlist</Text>
                {wishlist.length > 0 && (
                    <AnimatedButton onPress={handleShare}>
                        <Ionicons name="share-outline" size={24} color={colors.accent} />
                    </AnimatedButton>
                )}
            </FadeInView>

            {/* Wishlist Count */}
            {wishlist.length > 0 && (
                <FadeInView style={styles.countContainer} delay={200}>
                    <Text style={styles.countText}>
                        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                    </Text>
                </FadeInView>
            )}

            {/* Products Grid */}
            <FlatList
                data={wishlist}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmpty}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.base,
    },
    headerTitle: {
        ...textStyles.h2,
        color: colors.charcoal,
    },
    countContainer: {
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.base,
    },
    countText: {
        ...textStyles.body,
        color: colors.darkGray,
    },
    listContent: {
        paddingHorizontal: spacing.xl - spacing.sm,
        paddingBottom: spacing.xl,
        flexGrow: 1,
    },
    gridItem: {
        width: CARD_WIDTH,
        marginHorizontal: spacing.sm,
        marginBottom: spacing.base,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing['5xl'],
        paddingHorizontal: spacing.xl,
    },
    emptyTitle: {
        ...textStyles.h3,
        color: colors.charcoal,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    emptyText: {
        ...textStyles.body,
        color: colors.darkGray,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    discoverButton: {
        minWidth: 200,
    },
});

export default WishlistScreen;
