# 💄 Ayla - Application de Découverte Beauté

Une application mobile React Native élégante pour découvrir des produits de beauté, créer une collection virtuelle et comparer les prix entre différents revendeurs.

![Ayla](./assets/assets/welcome-bg.png)

## 🎨 Fonctionnalités

### ✨ Authentification Complète
- 📧 Inscription avec email et mot de passe
- 🔐 Connexion sécurisée via Firebase Auth
- 👤 Gestion du profil utilisateur
- 🔄 Persistance de session

### 🛍️ Catalogue de Produits
- 🏠 **Écran d'Accueil** : Produits populaires et recommandations personnalisées
- 🔍 **Recherche & Filtres** : Trouvez facilement vos produits préférés
- 📱 **Détails Produit** : Galerie d'images, descriptions, prix et évaluations
- 🏷️ **Catégories** : Soins de la peau, Maquillage, Parfums

### ❤️ Wishlist Personnalisée
- 💾 Sauvegardez vos produits favoris
- 📤 Partagez votre wishlist avec vos amis
- 🗑️ Gérez facilement votre collection

### 🎯 Design Premium
- 🌸 Palette de couleurs beige/nude chaleureuse
- ✨ Accents rose gold élégants
- 🎭 Gradients et ombres sophistiqués
- 📐 Interface moderne et intuitive

## 🚀 Installation

### Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Compte Firebase (gratuit)

### Étapes d'Installation

1. **Cloner le projet**
```bash
cd C:\Users\pc\Desktop\Ayla
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Firebase** (voir section ci-dessous)

4. **Lancer l'application**
```bash
npm start
```

5. **Ouvrir dans Expo Go**
   - Scannez le QR code avec l'application Expo Go (iOS/Android)
   - Ou appuyez sur `w` pour ouvrir dans le navigateur

Votre application Ayla est prête à être utilisée ! 💄✨

## 🔥 Configuration Firebase

### 1. Créer un Projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Suivez les étapes de création

### 2. Activer l'Authentification

1. Dans votre projet Firebase, allez dans **Authentication**
2. Cliquez sur "Commencer"
3. Activez **Email/Password** comme méthode de connexion

### 3. Créer une Base de Données Firestore

1. Allez dans **Firestore Database**
2. Cliquez sur "Créer une base de données"
3. Choisissez le mode **Test** pour commencer (à sécuriser plus tard)
4. Sélectionnez une région proche de vous

### 4. Obtenir les Identifiants

1. Allez dans **Paramètres du projet** (icône engrenage)
2. Faites défiler jusqu'à "Vos applications"
3. Cliquez sur l'icône Web `</>`
4. Enregistrez votre application (nom : "Ayla")
5. Copiez les valeurs de configuration

### 5. Configurer l'Application

Ouvrez le fichier `firebase.config.js` et remplacez les valeurs :

```javascript
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "votre-projet.firebaseapp.com",
    projectId: "votre-projet-id",
    storageBucket: "votre-projet.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};
```

## 📁 Structure du Projet

```
Ayla/
├── App.js                      # Point d'entrée principal
├── firebase.config.js          # Configuration Firebase
├── src/
│   ├── components/            # Composants réutilisables
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── ProductCard.js
│   │   ├── CategoryChip.js
│   │   └── SearchBar.js
│   ├── screens/               # Écrans de l'application
│   │   ├── HomeScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── ProductListScreen.js
│   │   ├── ProductDetailScreen.js
│   │   ├── WishlistScreen.js
│   │   └── ProfileScreen.js
│   ├── navigation/            # Configuration de navigation
│   │   ├── AppNavigator.js
│   │   └── MainTabNavigator.js
│   ├── contexts/              # Contextes React
│   │   └── AuthContext.js
│   ├── services/              # Services API
│   │   ├── productService.js
│   │   ├── wishlistService.js
│   │   └── userService.js
│   ├── theme/                 # Système de design
│   │   ├── colors.js
│   │   ├── typography.js
│   │   └── spacing.js
│   ├── utils/                 # Utilitaires
│   │   ├── share.js
│   │   ├── storage.js
│   │   └── validation.js
│   └── data/                  # Données d'exemple
│       └── sampleProducts.js
└── assets/                    # Images et ressources
```

## 🎨 Palette de Couleurs

- **Primaire** : `#E8D5C4` (Beige chaud)
- **Secondaire** : `#C9A88A` (Brun chaud)
- **Accent** : `#D4A574` (Rose gold)
- **Fond** : `#FAF8F6` (Blanc cassé)

## 📱 Écrans Principaux

### 1. Authentification
- Écran de connexion avec gradient élégant
- Écran d'inscription avec validation de formulaire
- Gestion des erreurs et feedback utilisateur

### 2. Accueil
- En-tête personnalisé avec salutation
- Catégories de produits (chips interactifs)
- Section "Spécial pour vous" (défilement horizontal)
- Grille de produits populaires
- Recommandations personnalisées

### 3. Liste de Produits
- Barre de recherche
- Filtres par catégorie et prix
- Affichage en grille
- Navigation vers les détails

### 4. Détails Produit
- Galerie d'images avec indicateurs
- Informations complètes (marque, nom, prix, note)
- Description détaillée
- Bouton "Ajouter à la wishlist"
- Lien vers le site marchand
- Partage du produit

### 5. Wishlist
- Liste des produits sauvegardés
- Compteur d'articles
- Suppression avec confirmation
- Partage de la wishlist complète

### 6. Profil
- Informations utilisateur
- Paramètres
- Déconnexion

## 🛠️ Technologies Utilisées

- **React Native** - Framework mobile
- **Expo** - Plateforme de développement
- **Firebase Auth** - Authentification
- **Cloud Firestore** - Base de données
- **React Navigation** - Navigation
- **AsyncStorage** - Stockage local
- **Expo Linear Gradient** - Gradients
- **Expo Vector Icons** - Icônes

## 📝 Scripts Disponibles

```bash
# Démarrer le serveur de développement
npm start

# Lancer sur Android
npm run android

# Lancer sur iOS
npm run ios

# Lancer sur le web
npm run web
```

## 🔐 Sécurité

> **⚠️ Important** : Les règles Firestore actuelles sont en mode test. Avant de déployer en production, configurez des règles de sécurité appropriées :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /wishlists/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚧 Prochaines Étapes

- [ ] Ajouter des tests unitaires
- [ ] Implémenter la comparaison de prix entre marchands
- [ ] Ajouter des notifications push
- [ ] Intégrer des avis et commentaires utilisateurs
- [ ] Créer un système de recommandations IA
- [ ] Ajouter le mode sombre
- [ ] Internationalisation (i18n)

## 🐛 Dépannage

### L'application ne démarre pas
- Vérifiez que Node.js est installé : `node --version`
- Supprimez `node_modules` et réinstallez : `rm -rf node_modules && npm install`
- Effacez le cache Expo : `expo start -c`

### Erreurs d'authentification Firebase
- Vérifiez que les identifiants dans `firebase.config.js` sont corrects
- Assurez-vous que l'authentification Email/Password est activée dans Firebase Console
- Vérifiez votre connexion internet

### Les produits ne s'affichent pas
- Vérifiez la console pour les erreurs
- Assurez-vous que Firestore est configuré en mode test
- Vérifiez les règles de sécurité Firestore

## 👨‍💻 Développement

Pour contribuer ou personnaliser l'application :

1. Modifiez les données de produits dans `src/data/sampleProducts.js`
2. Personnalisez les couleurs dans `src/theme/colors.js`
3. Ajustez la typographie dans `src/theme/typography.js`
4. Créez de nouveaux composants dans `src/components/`

## 📄 Licence

Ce projet est créé à des fins éducatives et de démonstration.

## 🙏 Remerciements

- Design inspiré par les meilleures applications de beauté
- Icônes par Expo Vector Icons (Ionicons)
- Images de produits via Unsplash

---

**Développé avec ❤️ pour les passionnés de beauté**
