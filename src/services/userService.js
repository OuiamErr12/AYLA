import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    getDocs
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import colors from '../theme/colors';

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

// Get all users (Admin only)
export const getAllUsers = async () => {
    try {
        console.log('Fetching all users from Firestore...');
        const usersCol = collection(db, 'users');
        const userSnapshot = await getDocs(usersCol);

        const usersList = userSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log(`Found ${usersList.length} users.`);
        return usersList;
    } catch (error) {
        console.error('Error in getAllUsers service:', error);
        throw error;
    }
};

// Update user role (Admin only)
export const updateUserRole = async (userId, role) => {
    return updateUserProfile(userId, { role: role?.trim() });
};

// Add loyalty points
export const addPoints = async (userId, points) => {
    try {
        const user = await getUserProfile(userId);
        const currentPoints = user?.points || 0;
        return updateUserProfile(userId, { points: currentPoints + points });
    } catch (error) {
        console.error('Error adding points:', error);
        throw error;
    }
};

// Update user skin profile
export const updateUserSkinProfile = async (userId, skinProfile) => {
    try {
        return updateUserProfile(userId, {
            skinProfile: {
                ...skinProfile,
                updatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error updating skin profile:', error);
        throw error;
    }
};

// Get user tier based on points
export const getUserTier = (points) => {
    if (points >= 600) return { name: 'Gold', discount: 0.10, color: '#D4AF37' };
    if (points >= 300) return { name: 'Silver', discount: 0.05, color: '#C0C0C0' };
    return { name: 'Bronze', discount: 0, color: colors.accent };
};

// Export as named and default
const userService = {
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    getAllUsers,
    updateUserRole,
    addPoints,
    updateUserSkinProfile,
    getUserTier
};

export default userService;
