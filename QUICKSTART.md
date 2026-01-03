# 🚀 Guide de Démarrage Rapide - Ayla

## ⚡ Démarrage en 3 Étapes

### 1️⃣ Configurer Firebase (5 minutes)

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet "Ayla"
3. Activez **Authentication** → Email/Password
4. Créez une base **Firestore** en mode Test
5. Dans Paramètres → Vos applications → Web, copiez les identifiants
6. Collez-les dans `firebase.config.js`

### 2️⃣ Installer les Dépendances

```bash
cd C:\Users\pc\Desktop\Ayla
npm install
```

### 3️⃣ Lancer l'Application

```bash
npm start
```

Ensuite :
- Scannez le QR code avec **Expo Go** (iOS/Android)
- Ou appuyez sur `w` pour ouvrir dans le navigateur
- Ou appuyez sur `a` pour Android Emulator
- Ou appuyez sur `i` pour iOS Simulator

## 📱 Premier Test

1. **Créer un compte** : Cliquez sur "Sign Up"
2. **Remplir le formulaire** : Nom, Email, Mot de passe
3. **Explorer** : Parcourez les produits sur l'écran d'accueil
4. **Ajouter à la wishlist** : Cliquez sur le ❤️ sur un produit
5. **Voir les détails** : Cliquez sur un produit
6. **Vérifier la wishlist** : Allez dans l'onglet Wishlist

## 🎨 Fonctionnalités à Tester

✅ **Authentification**
- Inscription
- Connexion
- Déconnexion

✅ **Navigation**
- 4 onglets : Home, Search, Wishlist, Profile
- Navigation vers les détails produit

✅ **Produits**
- Filtrage par catégorie
- Recherche
- Galerie d'images
- Lien vers site marchand

✅ **Wishlist**
- Ajout/Suppression
- Partage
- Persistance

## 🔧 Dépannage

**L'app ne démarre pas ?**
```bash
npx expo start -c
```

**Erreur Firebase ?**
- Vérifiez que les identifiants sont corrects dans `firebase.config.js`
- Assurez-vous que Authentication et Firestore sont activés

**Problème de dépendances ?**
```bash
rm -rf node_modules
npm install
```

## 📚 Documentation Complète

- **README.md** : Instructions détaillées
- **walkthrough.md** : Guide complet de toutes les fonctionnalités
- **implementation_plan.md** : Plan technique

## 🎉 C'est Tout !

Votre application BeautyBox est prête à être utilisée ! 💄✨
