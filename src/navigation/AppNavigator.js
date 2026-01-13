import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProductListScreen from '../screens/ProductListScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import StaticPageScreen from '../screens/StaticPageScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import AdminProductList from '../screens/admin/AdminProductList';
import AdminProductForm from '../screens/admin/AdminProductForm';
import AdminUserList from '../screens/admin/AdminUserList';
import AdminOrderList from '../screens/admin/AdminOrderList';
import InvoicePreviewScreen from '../screens/InvoicePreviewScreen';
import SkinCareQuizScreen from '../screens/SkinCareQuizScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { isAuthenticated, initializing } = useAuth();

    if (initializing) {
        return null; // Or a loading screen
    }

    return (
        <NavigationContainer>
            {/* ... existing navigators ... */}
            {isAuthenticated ? (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="MainTabs" component={MainTabNavigator} />
                    <Stack.Screen
                        name="ProductDetail"
                        component={ProductDetailScreen}
                        options={{ presentation: 'modal' }}
                    />
                    <Stack.Screen
                        name="ProductList"
                        component={ProductListScreen}
                    />
                    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                    <Stack.Screen name="Settings" component={SettingsScreen} />
                    <Stack.Screen name="Notifications" component={NotificationsScreen} />
                    <Stack.Screen name="StaticPage" component={StaticPageScreen} />
                    <Stack.Screen name="Checkout" component={CheckoutScreen} />

                    {/* Admin Screens */}
                    <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
                    <Stack.Screen name="AdminProductList" component={AdminProductList} />
                    <Stack.Screen name="AdminProductForm" component={AdminProductForm} />
                    <Stack.Screen name="AdminUserList" component={AdminUserList} />
                    <Stack.Screen name="AdminOrderList" component={AdminOrderList} />
                    <Stack.Screen name="InvoicePreview" component={InvoicePreviewScreen} />
                    <Stack.Screen name="SkinCareQuiz" component={SkinCareQuizScreen} />
                </Stack.Navigator>
            ) : (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
};

export default AppNavigator;
