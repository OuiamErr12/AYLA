import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { sampleProducts } from '../data/sampleProducts';

export const seedProductsToFirestore = async () => {
    try {
        console.log('Starting database seeding...');
        const productsCollection = collection(db, 'products');
        
        // Optional: Check if collection is already populated to avoid unnecessary writes
        // const snapshot = await getDocs(productsCollection);
        // if (!snapshot.empty) {
        //     console.log('Database already has data. Skipping seed.');
        //     return { success: true, message: 'Database already populated' };
        // }

        let count = 0;
        for (const product of sampleProducts) {
            // Use setDoc to specify the ID (so it matches our local data)
            // This also allows re-running the script to update data without creating duplicates
            await setDoc(doc(db, 'products', product.id), product);
            count++;
        }

        console.log(`Successfully added ${count} products to Firestore.`);
        return { success: true, message: `Successfully added ${count} products.` };
    } catch (error) {
        console.error('Error seeding database:', error);
        return { success: false, error: error.message };
    }
};