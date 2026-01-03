import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    getDocs,
    query,
    where
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WISHLIST_STORAGE_KEY = '@ayla_wishlist';

// Add product to wishlist
export const addToWishlist = async (userId, product) => {
    try {
        if (userId) {
            // Save to Firestore if user is logged in
            const wishlistRef = doc(db, 'wishlists', `${userId}_${product.id}`);
            await setDoc(wishlistRef, {
                userId,
                productId: product.id,
                product,
                addedAt: new Date().toISOString(),
            });
        }

        // Also save to local storage
        const wishlist = await getLocalWishlist();
        const updatedWishlist = [...wishlist, product];
        await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updatedWishlist));

        return true;
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
    }
};

// Remove product from wishlist
export const removeFromWishlist = async (userId, productId) => {
    try {
        if (userId) {
            // Remove from Firestore
            const wishlistRef = doc(db, 'wishlists', `${userId}_${productId}`);
            await deleteDoc(wishlistRef);
        }

        // Remove from local storage
        const wishlist = await getLocalWishlist();
        const updatedWishlist = wishlist.filter(p => p.id !== productId);
        await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updatedWishlist));

        return true;
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
    }
};

// Get user's wishlist
export const getUserWishlist = async (userId) => {
    try {
        if (userId) {
            // Fetch from Firestore
            const wishlistCol = collection(db, 'wishlists');
            const q = query(wishlistCol, where('userId', '==', userId));
            const querySnapshot = await getDocs(q);

            const wishlist = querySnapshot.docs.map(doc => doc.data().product);

            // Sync with local storage
            await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));

            return wishlist;
        }

        // Return local wishlist if not logged in
        return await getLocalWishlist();
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return await getLocalWishlist();
    }
};

// Get local wishlist from AsyncStorage
export const getLocalWishlist = async () => {
    try {
        const wishlistJson = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
        return wishlistJson ? JSON.parse(wishlistJson) : [];
    } catch (error) {
        console.error('Error getting local wishlist:', error);
        return [];
    }
};

// Check if product is in wishlist
export const isInWishlist = async (productId) => {
    try {
        const wishlist = await getLocalWishlist();
        return wishlist.some(p => p.id === productId);
    } catch (error) {
        console.error('Error checking wishlist:', error);
        return false;
    }
};

// Clear local wishlist
export const clearLocalWishlist = async () => {
    try {
        await AsyncStorage.removeItem(WISHLIST_STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing wishlist:', error);
    }
};

export default {
    addToWishlist,
    removeFromWishlist,
    getUserWishlist,
    getLocalWishlist,
    isInWishlist,
    clearLocalWishlist,
};
