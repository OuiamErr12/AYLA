import { collection, getDocs, doc, getDoc, query, where, addDoc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../../firebase.config';

// Create a new order
export const createOrder = async (orderData) => {
    try {
        const ordersCol = collection(db, 'orders');
        const docRef = await addDoc(ordersCol, {
            ...orderData,
            status: 'Pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        return { id: docRef.id, ...orderData };
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

// Get all orders (Admin only)
export const getAllOrders = async () => {
    try {
        const ordersCol = collection(db, 'orders');
        const q = query(ordersCol, orderBy('createdAt', 'desc'));
        const orderSnapshot = await getDocs(q);
        return orderSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
};

// Get orders for a specific user
export const getUserOrders = async (userId) => {
    try {
        const ordersCol = collection(db, 'orders');
        const q = query(
            ordersCol,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const orderSnapshot = await getDocs(q);
        return orderSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
};

// Update order status (Admin only)
export const updateOrderStatus = async (orderId, status) => {
    try {
        const orderDoc = doc(db, 'orders', orderId);
        await updateDoc(orderDoc, {
            status,
            updatedAt: new Date().toISOString(),
        });
        return true;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

export default {
    createOrder,
    getAllOrders,
    getUserOrders,
    updateOrderStatus,
};
