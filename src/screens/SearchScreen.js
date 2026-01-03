import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import FadeInView from '../components/FadeInView';
import { getAllProducts, searchProducts } from '../services/productService';
import { isInWishlist } from '../utils/storage';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing from '../theme/spacing';

const SearchScreen = ({ navigation }) => {
    const [query, setQuery] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [wishlistStatus, setWishlistStatus] = useState({});

    useEffect(() => {
        loadAllProducts();
    }, []);

    useEffect(() => {
        if (query.trim() === '') {
            setFilteredProducts(allProducts);
        } else {
            const results = searchProducts(allProducts, query);
            setFilteredProducts(results);
        }
    }, [query, allProducts]);

    // Track wishlist status
    useEffect(() => {
        const checkWishlist = async () => {
            const status = {};
            for (const product of filteredProducts) {
                status[product.id] = await isInWishlist(product.id);
            }
            setWishlistStatus(status);
        };
        checkWishlist();

        const unsubscribe = navigation.addListener('focus', () => {
            checkWishlist();
        });
        return unsubscribe;
    }, [filteredProducts, navigation]);


    const loadAllProducts = async () => {
        setLoading(true);
        try {
            const products = await getAllProducts();
            setAllProducts(products);
            setFilteredProducts(products);
        } catch (error) {
            console.error('Error loading products for search:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>Search</Text>
            </View>
            <FadeInView style={styles.searchContainer} delay={100}>
                <SearchBar
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search all products..."
                    autoFocus={false}
                />
            </FadeInView>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FadeInView style={{ flex: 1 }} delay={300}>
                    <FlatList
                        data={filteredProducts}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        contentContainerStyle={styles.list}
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
                        ListEmptyComponent={
                            <View style={styles.center}>
                                <Text style={styles.emptyText}>No products found matching "{query}"</Text>
                            </View>
                        }
                    />
                </FadeInView>
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
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    title: {
        ...textStyles.h2,
        color: colors.charcoal,
    },
    searchContainer: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    list: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing['2xl'],
    },
    emptyText: {
        ...textStyles.body,
        color: colors.gray,
    },
});

export default SearchScreen;
