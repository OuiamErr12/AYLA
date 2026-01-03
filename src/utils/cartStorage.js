import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = '@ayla_cart';

export const getCart = async () => {
    try {
        const cart = await AsyncStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error getting cart:', error);
        return [];
    }
};

export const addToCart = async (product, quantity = 1) => {
    try {
        const cart = await getCart();
        const existingIndex = cart.findIndex(item => item.id === product.id);

        if (existingIndex >= 0) {
            // Product already in cart, update quantity
            cart[existingIndex].quantity += quantity;
        } else {
            // Add new product to cart
            cart.push({ ...product, quantity });
        }

        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
        return { success: true, cart };
    } catch (error) {
        console.error('Error adding to cart:', error);
        return { success: false, error };
    }
};

export const removeFromCart = async (productId) => {
    try {
        const cart = await getCart();
        const updatedCart = cart.filter(item => item.id !== productId);
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
        return { success: true, cart: updatedCart };
    } catch (error) {
        console.error('Error removing from cart:', error);
        return { success: false, error };
    }
};

export const updateCartQuantity = async (productId, quantity) => {
    try {
        const cart = await getCart();
        const index = cart.findIndex(item => item.id === productId);

        if (index >= 0) {
            if (quantity <= 0) {
                // Remove item if quantity is 0 or less
                return removeFromCart(productId);
            }
            cart[index].quantity = quantity;
            await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
        }

        return { success: true, cart };
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        return { success: false, error };
    }
};

export const clearCart = async () => {
    try {
        await AsyncStorage.removeItem(CART_KEY);
        return { success: true };
    } catch (error) {
        console.error('Error clearing cart:', error);
        return { success: false, error };
    }
};

export const getCartTotal = (cart) => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartItemCount = (cart) => {
    return cart.reduce((count, item) => count + item.quantity, 0);
};
