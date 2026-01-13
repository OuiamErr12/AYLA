import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import CategoryChip from '../components/CategoryChip';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { getAllProducts, getProductsByCategory, searchProducts } from '../services/productService';
import { getUserProfile } from '../services/userService';
import { categories, sampleProducts } from '../data/sampleProducts';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing, { borderRadius, shadows } from '../theme/spacing';
import { useAuth } from '../contexts/AuthContext';
import { isInWishlist } from '../utils/storage';

const HomeScreen = ({ navigation, route }) => {
    const { user } = useAuth();
    const [activeCategory, setActiveCategory] = useState('all');

    // Controls visibility of the full product header (categories) and list
    const [showCatalog, setShowCatalog] = useState(true);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlistStatus, setWishlistStatus] = useState({});
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        loadProducts();
    }, [activeCategory]);

    // Handle navigation params to open catalog
    useFocusEffect(
        React.useCallback(() => {
            if (route.params?.openCatalog) {
                setShowCatalog(true);
                setActiveCategory('all');
                navigation.setParams({ openCatalog: undefined });
            }
        }, [route.params?.openCatalog])
    );

    // Initial data fetch - Only run on mount/user change to avoid resetting view mode
    useEffect(() => {
        const fetchInitialData = async () => {
            if (user?.uid) {
                try {
                    const profile = await getUserProfile(user.uid);
                    setUserProfile(profile);

                    // If user matches our "routine available" check, hide catalog by default
                    if (user?.role?.trim().toLowerCase() !== 'admin' && profile?.skinProfile) {
                        setShowCatalog(false);
                    } else {
                        setShowCatalog(true);
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                }
            }
        };
        fetchInitialData();
    }, [user?.uid]);

    // Wishlist check handles product updates separately
    useEffect(() => {
        const checkWishlist = async () => {
            const status = {};
            for (const product of products) {
                status[product.id] = await isInWishlist(product.id);
            }
            setWishlistStatus(status);
        };
        checkWishlist();
    }, [products]);

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

    const renderListHeader = () => (
        <View>
            {renderHeader()}

            {/* SkinCare Section: Banner or Personalized Routine */}
            {user?.role?.trim().toLowerCase() !== 'admin' && (!userProfile?.skinProfile ? (
                /* 1. NO PROFILE: Show Quiz Banner */
                <TouchableOpacity
                    style={styles.quizBanner}
                    onPress={() => navigation.navigate('SkinCareQuiz')}
                    activeOpacity={0.9}
                >
                    <View style={styles.quizBannerContent}>
                        <View style={styles.quizTextContainer}>
                            <Text style={styles.quizBannerTitle}>Diagnostic Peau</Text>
                            <Text style={styles.quizBannerSub}>Trouvez votre routine idéale en 3 questions ✨</Text>
                        </View>
                        <Ionicons name="arrow-forward-circle" size={44} color={colors.white} />
                    </View>
                </TouchableOpacity>
            ) : (
                /* 2. PROFILE EXISTS: Toggle between Routine and Catalog */
                !showCatalog ? (
                    /* VIEW A: Routine Only */
                    <View style={styles.personalizedSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Votre Routine {userProfile.skinProfile.type}</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SkinCareQuiz')}>
                                <Text style={styles.retestLink}>Refaire le test</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.routineTypeLabel}>Soin du Matin ☀️</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.routineScroll}>
                            {sampleProducts
                                .filter(p => p.category === 'skincare' && (p.subCategory === 'Sunscreen' || p.subCategory === 'Serums'))
                                .slice(0, 3)
                                .map((product, idx) => (
                                    <ProductCard
                                        key={`am-${product.id}`}
                                        product={product}
                                        index={idx}
                                        style={styles.miniCard}
                                        onPress={() => navigation.navigate('ProductDetail', { product })}
                                    />
                                ))
                            }
                        </ScrollView>

                        <Text style={styles.routineTypeLabel}>Soin du Soir 🌙</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.routineScroll}>
                            {sampleProducts
                                .filter(p => p.category === 'skincare' && (p.subCategory === 'Cream' || p.subCategory === 'Masks'))
                                .slice(0, 3)
                                .map((product, idx) => (
                                    <ProductCard
                                        key={`pm-${product.id}`}
                                        product={product}
                                        index={idx}
                                        style={styles.miniCard}
                                        onPress={() => navigation.navigate('ProductDetail', { product })}
                                    />
                                ))
                            }
                        </ScrollView>

                        <Button
                            title="Voir tous les produits"
                            onPress={() => {
                                setShowCatalog(true);
                                setActiveCategory('all');
                            }}
                            variant="outline"
                            style={{ marginHorizontal: spacing.lg, marginTop: spacing.md }}
                        />
                    </View>
                ) : (
                    /* VIEW B: Back to Routine Banner (shown above catalog) */
                    <TouchableOpacity
                        style={styles.quizBanner}
                        onPress={() => setShowCatalog(false)}
                        activeOpacity={0.9}
                    >
                        <View style={styles.quizBannerContent}>
                            <View style={styles.quizTextContainer}>
                                <Text style={styles.quizBannerTitle}>Ma Routine</Text>
                                <Text style={styles.quizBannerSub}>Retour à mes recommandations</Text>
                            </View>
                            <Ionicons name="arrow-back-circle" size={44} color={colors.white} />
                        </View>
                    </TouchableOpacity>
                )
            ))}

            {/* Catalog Elements: Search & Categories (Only if showCatalog is true) */}
            {showCatalog && (
                <>
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
                </>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.contentContainer}
                    ListHeaderComponent={renderListHeader}
                    data={showCatalog ? products : []}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={showCatalog ? styles.columnWrapper : null}
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
                        showCatalog ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No products found.</Text>
                            </View>
                        ) : null
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.offWhite,
    },
    contentContainer: {
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
    quizBanner: {
        backgroundColor: colors.accent,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        ...shadows.md,
    },
    quizBannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    quizTextContainer: {
        flex: 1,
        marginRight: spacing.md,
    },
    quizBannerTitle: {
        ...textStyles.h3,
        color: colors.white,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    quizBannerSub: {
        ...textStyles.bodySmall,
        color: colors.white,
        opacity: 0.9,
    },
    personalizedSection: {
        marginBottom: spacing.xl,
        backgroundColor: colors.white,
        padding: spacing.lg,
        borderRadius: borderRadius.xl,
        ...shadows.sm,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...textStyles.h3,
        color: colors.charcoal,
        textTransform: 'capitalize',
    },
    retestLink: {
        ...textStyles.caption,
        color: colors.accent,
        textDecorationLine: 'underline',
    },
    routineTypeLabel: {
        ...textStyles.bodySmall,
        fontWeight: 'bold',
        color: colors.gray,
        marginTop: spacing.sm,
        marginBottom: spacing.xs,
    },
    routineScroll: {
        marginBottom: spacing.md,
    },
    miniCard: {
        width: 140,
        marginRight: spacing.sm,
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
