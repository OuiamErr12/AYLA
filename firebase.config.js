// ═══════════════════════════════════════════════════════════════════════════
// 🔥 CONFIGURATION FIREBASE - Ayla
// ═══════════════════════════════════════════════════════════════════════════
//
// ⚠️ IMPORTANT : Remplacez les valeurs ci-dessous par vos identifiants Firebase
//
// 📋 ÉTAPES POUR OBTENIR VOS IDENTIFIANTS :
// 1. Allez sur https://console.firebase.google.com/
// 2. Sélectionnez votre projet (ou créez-en un nouveau)
// 3. Cliquez sur l'icône ⚙️ (Paramètres du projet)
// 4. Faites défiler jusqu'à "Vos applications"
// 5. Cliquez sur l'icône Web </> pour ajouter une application web
// 6. Copiez les valeurs de firebaseConfig
//
// 🔐 SÉCURITÉ : Ne commitez jamais ce fichier avec vos vraies clés sur GitHub !
// ═══════════════════════════════════════════════════════════════════════════

import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
    apiKey: "AIzaSyAJQ9uwAp3LjOwV-_RIzcSyv2fxwKzc8fo",
    authDomain: "beautybox-ec0f7.firebaseapp.com",
    projectId: "beautybox-ec0f7",
    storageBucket: "beautybox-ec0f7.firebasestorage.app",
    messagingSenderId: "4785238840",
    appId: "1:4785238840:web:4263dff30c225d816e87cd",
    measurementId: "G-WTT4SVEWZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
let auth;

if (Platform.OS === 'web') {
    // On Web, use standard initialization
    auth = getAuth(app);
} else {
    // On Native, use AsyncStorage for persistence
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
}

export { auth };

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Firebase Analytics only if supported (web environment)
let analytics = null;
if (Platform.OS === 'web') {
    isSupported().then(supported => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    }).catch(() => {
        // Analytics not supported in this environment
        console.log('Firebase Analytics is not supported in this environment');
    });
}

export { analytics };

export default app;
