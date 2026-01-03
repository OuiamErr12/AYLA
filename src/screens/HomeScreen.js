import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CategoryChip from '../components/CategoryChip';
import ProductCard from '../components/ProductCard';
import { getAllProducts, getProductsByCategory, searchProducts } from '../services/productService';
import { categories } from '../data/sampleProducts';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing from '../theme/spacing';
import { useAuth } from '../contexts/AuthContext';
import { isInWishlist } from '../utils/storage';

const HomeScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [activeCategory, setActiveCategory] = useState('all');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlistStatus, setWishlistStatus] = useState({});

    useEffect(() => {
        loadProducts();
    }, [activeCategory]);

    useEffect(() => {
        // Update wishlist status whenever products change or screen focuses
        const checkWishlist = async () => {
            const status = {};
            for (const product of products) {
                status[product.id] = await isInWishlist(product.id);
            }
            setWishlistStatus(status);
        };
        checkWishlist();

        // Add navigation listener to refresh wishlist status
        const unsubscribe = navigation.addListener('focus', () => {
            checkWishlist();
        });

        return unsubscribe;
    }, [products, navigation]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await getProductsByCategory(activeCategory);
            setProducts(data || []);
        } catch (error) {
            console.error('Failed to load products', error);
        } finally {
            setLoading(false);
        }
    };



    const renderHeader = () => (
        <View style={styles.header}>
            <View>
                <Text style={styles.greeting}>Hello, {user?.displayName || 'Beautiful'}!</Text>
                <Text style={styles.subGreeting}>Find your perfect look</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.contentContainer}>
                {renderHeader()}

                <View style={styles.searchContainer}>
                </View>

                <View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryContainer}
                    >
                        {categories.map((category) => (
                            <CategoryChip
                                key={category.id}
                                label={category.label}
                                active={activeCategory === category.id}
                                onPress={() => setActiveCategory(category.id)}
                            />
                        ))}
                    </ScrollView>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <FlatList
                        style={{ flex: 1 }}
                        data={products}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        contentContainerStyle={styles.productList}
                        columnWrapperStyle={styles.columnWrapper}
                        renderItem={({ item, index }) => (
                            <ProductCard
                                product={item}
                                index={index}
                                style={{ width: '48%' }}
                                onPress={() => navigation.navigate('ProductDetail', { product: item })}
                                onToggleWishlist={async () => {
                                    const newStatus = await isInWishlist(item.id);
                                    setWishlistStatus(prev => ({ ...prev, [item.id]: newStatus }));
                                }}
                                isWishlisted={wishlistStatus[item.id]}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No products found.</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.offWhite,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
    greeting: {
        ...textStyles.h2,
        color: colors.charcoal,
    },
    subGreeting: {
        ...textStyles.body,
        color: colors.gray,
    },
    iconButton: {
        padding: spacing.sm,
        backgroundColor: colors.white,
        borderRadius: 50,
        elevation: 2,
    },
    searchContainer: {
        marginBottom: spacing.xs,
    },
    categoryContainer: {
        paddingBottom: spacing.md,
        gap: spacing.sm,
    },
    productList: {
        paddingBottom: spacing.xl,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing['2xl'],
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: spacing['2xl'],
    },
    emptyText: {
        ...textStyles.body,
        color: colors.gray,
    },
});

export default HomeScreen;
