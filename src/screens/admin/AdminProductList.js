import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import spacing, { borderRadius, shadows } from '../../theme/spacing';
import { getAllProducts, deleteProduct } from '../../services/productService';
import Button from '../../components/Button';
import AnimatedButton from '../../components/AnimatedButton';
import FadeInView from '../../components/FadeInView';

const AdminProductList = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
        const unsubscribe = navigation.addListener('focus', () => {
            fetchProducts();
        });
        return unsubscribe;
    }, [navigation]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            Alert.alert('Error', 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (product) => {
        Alert.alert(
            'Delete Product',
            `Are you sure you want to delete ${product.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteProduct(product.id);
                            setProducts(products.filter(p => p.id !== product.id));
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete product');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item, index }) => (
        <FadeInView delay={index * 50} style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productBrand}>{item.brand}</Text>
                <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('AdminProductForm', { product: item })}
                >
                    <Ionicons name="create-outline" size={22} color={colors.accent} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(item)}
                >
                    <Ionicons name="trash-outline" size={22} color={colors.error} />
                </TouchableOpacity>
            </View>
        </FadeInView>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <AnimatedButton onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.charcoal} />
                </AnimatedButton>
                <Text style={styles.headerTitle}>Products</Text>
                <AnimatedButton
                    onPress={() => navigation.navigate('AdminProductForm')}
                    style={styles.addButton}
                >
                    <Ionicons name="add" size={28} color={colors.primary} />
                </AnimatedButton>
            </View>

            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="cube-outline" size={64} color={colors.gray} />
                            <Text style={styles.emptyText}>No products found</Text>
                        </View>
                    )
                }
                refreshing={loading}
                onRefresh={fetchProducts}
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
    addButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        ...textStyles.h2,
        color: colors.charcoal,
    },
    listContent: {
        padding: spacing.lg,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        alignItems: 'center',
        ...shadows.sm,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.lightGray,
    },
    productInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    productName: {
        ...textStyles.body,
        fontWeight: '600',
        color: colors.charcoal,
    },
    productBrand: {
        ...textStyles.caption,
        color: colors.darkGray,
    },
    productPrice: {
        ...textStyles.bodySmall,
        color: colors.accent,
        fontWeight: 'bold',
        marginTop: 2,
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: spacing.sm,
        marginLeft: spacing.xs,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing['5xl'],
    },
    emptyText: {
        ...textStyles.body,
        color: colors.darkGray,
        marginTop: spacing.md,
    },
});

export default AdminProductList;
