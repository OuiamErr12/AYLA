import { collection, getDocs, doc, getDoc, query, where, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { sampleProducts as importedSampleProducts } from '../data/sampleProducts';

const sampleProducts = importedSampleProducts || [];

// Fetch all products from Firestore
export const getAllProducts = async () => {
    try {
        console.log('Fetching products from Firestore...');
        const productsCol = collection(db, 'products');
        const productSnapshot = await getDocs(productsCol);

        console.log('Snapshot size:', productSnapshot.size);

        const productList = productSnapshot.docs.map(doc => {
            console.log('Processing doc:', doc.id);
            return {
                id: doc.id,
                ...doc.data()
            };
        });

        console.log('Product list length:', productList.length);
        console.log('Sample products length:', sampleProducts?.length);

        // If no products in Firestore, return sample data
        return productList.length > 0 ? productList : sampleProducts;
    } catch (error) {
        console.error('Error fetching products detailed:', error);
        // Return sample data as fallback
        return sampleProducts;
    }
};

// Get product by ID
export const getProductById = async (productId) => {
    try {
        const productDoc = doc(db, 'products', productId);
        const productSnapshot = await getDoc(productDoc);

        if (productSnapshot.exists()) {
            return { id: productSnapshot.id, ...productSnapshot.data() };
        }

        // Fallback to sample data
        return sampleProducts.find(p => p.id === productId);
    } catch (error) {
        console.error('Error fetching product:', error);
        return sampleProducts.find(p => p.id === productId);
    }
};

// Filter products by category
export const getProductsByCategory = async (category) => {
    if (category === 'all') {
        return getAllProducts();
    }

    try {
        const productsCol = collection(db, 'products');
        const q = query(productsCol, where('category', '==', category));
        const querySnapshot = await getDocs(q);
        const productList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Fallback to sample data
        return productList.length > 0
            ? productList
            : sampleProducts.filter(p => p.category === category);
    } catch (error) {
        console.error('Error filtering products:', error);
        return sampleProducts.filter(p => p.category === category);
    }
};

// Search products
export const searchProducts = (products, searchTerm) => {
    if (!searchTerm) return products;

    const term = searchTerm.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
    );
};

// Filter products by price range
export const filterByPriceRange = (products, minPrice, maxPrice) => {
    return products.filter(product =>
        product.price >= minPrice && product.price <= maxPrice
    );
};

// Add new product (Admin only)
export const addProduct = async (productData) => {
    try {
        const productsCol = collection(db, 'products');
        const docRef = await addDoc(productsCol, {
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        return { id: docRef.id, ...productData };
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

// Update existing product (Admin only)
export const updateProduct = async (productId, productData) => {
    try {
        const productDoc = doc(db, 'products', productId);
        await updateDoc(productDoc, {
            ...productData,
            updatedAt: new Date().toISOString(),
        });
        return true;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

// Delete product (Admin only)
export const deleteProduct = async (productId) => {
    try {
        const productDoc = doc(db, 'products', productId);
        await deleteDoc(productDoc);
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

export default {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    filterByPriceRange,
    addProduct,
    updateProduct,
    deleteProduct,
};
