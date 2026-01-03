import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryChip from '../components/CategoryChip';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing from '../theme/spacing';
import { getAllProducts, searchProducts, filterByPriceRange } from '../services/productService';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../services/wishlistService';
import { categories } from '../data/sampleProducts';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.xl * 3) / 2;

const ProductListScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [wishlistItems, setWishlistItems] = useState({});

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, selectedCategory, products]);

    const loadProducts = async () => {
        try {
            const allProducts = await getAllProducts();
            setProducts(allProducts);

            // Load wishlist status
            const wishlistStatus = {};
            for (const product of allProducts) {
                wishlistStatus[product.id] = await isInWishlist(product.id);
            }
            setWishlistItems(wishlistStatus);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    const applyFilters = () => {
        let filtered = products;

        // Apply category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Apply search filter
        if (searchQuery) {
            filtered = searchProducts(filtered, searchQuery);
        }

        setFilteredProducts(filtered);
    };

    const handleWishlistToggle = async (product) => {
        try {
            const isInList = wishlistItems[product.id];

            if (isInList) {
                await removeFromWishlist(user?.uid, product.id);
            } else {
                await addToWishlist(user?.uid, product);
            }

            setWishlistItems(prev => ({
                ...prev,
                [product.id]: !isInList
            }));
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    const renderProduct = ({ item, index }) => (
        <View style={viewMode === 'grid' ? styles.gridItem : styles.listItem}>
            <ProductCard
                product={item}
                index={index}
                style={viewMode === 'grid' ? { width: '100%' } : { width: '100%' }}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
                onToggleWishlist={() => handleWishlistToggle(item)}
                isWishlisted={wishlistItems[item.id]}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.charcoal} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Products</Text>
                <TouchableOpacity onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                    <Ionicons
                        name={viewMode === 'grid' ? 'list' : 'grid'}
                        size={24}
                        color={colors.charcoal}
                    />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search products..."
                />
            </View>

            {/* Categories */}
            <View style={styles.categoriesSection}>
                <FlatList
                    horizontal
                    data={categories}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CategoryChip
                            label={item.label}
                            active={selectedCategory === item.id}
                            onPress={() => setSelectedCategory(item.id)}
                        />
                    )}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContainer}
                />
            </View>

            {/* Products List */}
            <FlatList
                data={filteredProducts}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={viewMode === 'grid' ? 2 : 1}
                key={viewMode} // Force re-render when view mode changes
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={64} color={colors.gray} />
                        <Text style={styles.emptyText}>No products found</Text>
                    </View>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.base,
    },
    headerTitle: {
        ...textStyles.h3,
        color: colors.charcoal,
    },
    searchContainer: {
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.base,
    },
    categoriesSection: {
        marginBottom: spacing.base,
    },
    categoriesContainer: {
        paddingHorizontal: spacing.xl,
    },
    listContent: {
        paddingHorizontal: spacing.xl - spacing.sm,
        paddingBottom: spacing.xl,
    },
    gridItem: {
        width: CARD_WIDTH,
        marginHorizontal: spacing.sm,
        marginBottom: spacing.base,
    },
    listItem: {
        marginBottom: spacing.base,
        marginHorizontal: spacing.sm,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing['5xl'],
    },
    emptyText: {
        ...textStyles.body,
        color: colors.gray,
        marginTop: spacing.base,
    },
});

export default ProductListScreen;
