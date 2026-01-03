import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const KEYS = {
    USER: '@ayla_user',
    TOKEN: '@ayla_token',
    WISHLIST: '@ayla_wishlist',
};

// Save data
export const saveData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
};

// Get data
export const getData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error('Error getting data:', error);
        return null;
    }
};

// Remove data
export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing data:', error);
        return false;
    }
};

// Clear all data
export const clearAll = async () => {
    try {
        await AsyncStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing storage:', error);
        return false;
    }
};

// User-specific helpers
export const saveUser = (user) => saveData(KEYS.USER, user);
export const getUser = () => getData(KEYS.USER);
export const removeUser = () => removeData(KEYS.USER);

export const saveToken = (token) => saveData(KEYS.TOKEN, token);
export const getToken = () => getData(KEYS.TOKEN);
export const removeToken = () => removeData(KEYS.TOKEN);

export default {
    saveData,
    getData,
    removeData,
    clearAll,
    saveUser,
    getUser,
    removeUser,
    saveToken,
    getToken,
    removeToken,
    KEYS,
};
