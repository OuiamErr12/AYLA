import { collection, getDocs, query, where, addDoc, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';

/**
 * Fetch all reviews for a specific product
 * @param {string} productId - The ID of the product
 * @returns {Promise<Array>} List of reviews
 */
export const getProductReviews = async (productId) => {
    try {
        const reviewsCol = collection(db, 'reviews');
        const q = query(
            reviewsCol,
            where('productId', '==', productId)
        );

        const reviewSnapshot = await getDocs(q);
        const data = reviewSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort client-side to avoid mandatory composite index
        return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
        console.error('Error fetching product reviews:', error);
        throw error;
    }
};

/**
 * Add a new review for a product
 * @param {Object} reviewData - The review details (productId, userId, userName, rating, comment)
 * @returns {Promise<string>} The new review ID
 */
export const addReview = async (reviewData) => {
    try {
        const reviewsCol = collection(db, 'reviews');
        const docRef = await addDoc(reviewsCol, {
            ...reviewData,
            createdAt: Timestamp.now().toDate().toISOString(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
};

/**
 * Calculate the average rating for a product
 * @param {Array} reviews - List of reviews
 * @returns {number} Average rating
 */
export const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
};

export default {
    getProductReviews,
    addReview,
    calculateAverageRating
};
