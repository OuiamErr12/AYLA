import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import spacing, { borderRadius, shadows } from '../../theme/spacing';
import { addProduct, updateProduct } from '../../services/productService';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AnimatedButton from '../../components/AnimatedButton';
import FadeInView from '../../components/FadeInView';

const AdminProductForm = ({ navigation, route }) => {
    const product = route.params?.product;
    const isEditing = !!product;

    const [name, setName] = useState(product?.name || '');
    const [brand, setBrand] = useState(product?.brand || '');
    const [price, setPrice] = useState(product?.price?.toString() || '');
    const [category, setCategory] = useState(product?.category || '');
    const [description, setDescription] = useState(product?.description || '');
    const [image, setImage] = useState(product?.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=500&q=80'); // Default placeholder
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name || !brand || !price || !category || !description) {
            Alert.alert('Missing Info', 'Please fill in all required fields');
            return;
        }

        const productData = {
            name,
            brand,
            price: parseFloat(price),
            category: category.toLowerCase(),
            description,
            image,
        };

        setLoading(true);
        try {
            if (isEditing) {
                await updateProduct(product.id, productData);
                Alert.alert('Success', 'Product updated successfully');
            } else {
                await addProduct(productData);
                Alert.alert('Success', 'Product added successfully');
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <AnimatedButton onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.charcoal} />
                </AnimatedButton>
                <Text style={styles.headerTitle}>{isEditing ? 'Edit Product' : 'Add Product'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <FadeInView delay={100}>
                        <Input
                            label="Product Name"
                            value={name}
                            onChangeText={setName}
                            placeholder="e.g. Silk Body Cream"
                        />
                        <Input
                            label="Brand"
                            value={brand}
                            onChangeText={setBrand}
                            placeholder="e.g. Ayla Glow"
                        />
                        <Input
                            label="Price ($)"
                            value={price}
                            onChangeText={setPrice}
                            placeholder="e.g. 24.99"
                            keyboardType="numeric"
                        />
                        <Input
                            label="Category"
                            value={category}
                            onChangeText={setCategory}
                            placeholder="e.g. skincare, makeup, hair"
                        />
                        <Input
                            label="Image URL"
                            value={image}
                            onChangeText={setImage}
                            placeholder="https://..."
                        />
                        <Input
                            label="Description"
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Product description..."
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            style={{ height: 100 }}
                        />

                        <Button
                            title={loading ? "Saving..." : "Save Product"}
                            onPress={handleSave}
                            variant="primary"
                            disabled={loading}
                            style={{ marginTop: spacing.xl }}
                        />
                    </FadeInView>
                </ScrollView>
            </KeyboardAvoidingView>
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
    headerTitle: {
        ...textStyles.h2,
        color: colors.charcoal,
    },
    content: {
        padding: spacing.lg,
    },
});

export default AdminProductForm;
