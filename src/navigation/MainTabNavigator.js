import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CartScreen from '../screens/CartScreen';
import WishlistScreen from '../screens/WishlistScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../screens/admin/AdminDashboard';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
    const { user } = useAuth();
    const isAdmin = user?.role?.trim() === 'admin';

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Search') {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name === 'Cart') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    } else if (route.name === 'Wishlist') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Admin') {
                        iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.gray,
                tabBarStyle: {
                    borderTopColor: colors.lightGray,
                    backgroundColor: colors.white,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                }
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            {!isAdmin ? (
                <>
                    <Tab.Screen name="Cart" component={CartScreen} />
                    <Tab.Screen name="Wishlist" component={WishlistScreen} />
                </>
            ) : (
                <Tab.Screen name="Admin" component={AdminDashboard} />
            )}
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
