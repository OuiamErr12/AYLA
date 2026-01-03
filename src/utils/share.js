import { Share } from 'react-native';

// Share product
export const shareProduct = async (product) => {
    try {
        const result = await Share.share({
            message: `Check out this amazing product: ${product.name} by ${product.brand} - $${product.price}\n\n${product.merchantUrl}`,
            title: product.name,
        });

        return result;
    } catch (error) {
        console.error('Error sharing product:', error);
        throw error;
    }
};

// Share wishlist
export const shareWishlist = async (wishlist) => {
    try {
        const productList = wishlist.map((p, index) =>
            `${index + 1}. ${p.name} by ${p.brand} - $${p.price}`
        ).join('\n');

        const result = await Share.share({
            message: `My BeautyBox Wishlist:\n\n${productList}`,
            title: 'My Beauty Wishlist',
        });

        return result;
    } catch (error) {
        console.error('Error sharing wishlist:', error);
        throw error;
    }
};

export default {
    shareProduct,
    shareWishlist,
};
