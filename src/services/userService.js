import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';

// Get user profile
export const getUserProfile = async (userId) => {
    try {
        const userDoc = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
            return { id: userSnapshot.id, ...userSnapshot.data() };
        }

        return null;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

// Create user profile
export const createUserProfile = async (userId, userData) => {
    try {
        const userDoc = doc(db, 'users', userId);
        await setDoc(userDoc, {
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        return true;
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
    try {
        const userDoc = doc(db, 'users', userId);
        await updateDoc(userDoc, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });

        return true;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

export default {
    getUserProfile,
    createUserProfile,
    updateUserProfile,
};
