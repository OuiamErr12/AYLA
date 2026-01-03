import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../theme/colors';

const ThemeContext = createContext();

export const lightTheme = {
    dark: false,
    colors: {
        background: colors.offWhite,
        card: colors.white,
        text: colors.charcoal,
        textSecondary: colors.darkGray,
        border: colors.lightGray,
        primary: colors.primary,
        accent: colors.accent,
    }
};

export const darkTheme = {
    dark: true,
    colors: {
        background: '#121212',
        card: '#1E1E1E',
        text: '#FFFFFF',
        textSecondary: '#AAAAAA',
        border: '#333333',
        primary: colors.primary,
        accent: colors.accent,
    }
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [theme, setTheme] = useState(lightTheme);

    useEffect(() => {
        loadTheme();
    }, []);

    useEffect(() => {
        setTheme(isDarkMode ? darkTheme : lightTheme);
        saveTheme(isDarkMode);
    }, [isDarkMode]);

    const loadTheme = async () => {
        try {
            const storedTheme = await AsyncStorage.getItem('theme');
            if (storedTheme) {
                setIsDarkMode(storedTheme === 'dark');
            }
        } catch (error) {
            console.log('Error loading theme:', error);
        }
    };

    const saveTheme = async (isDark) => {
        try {
            await AsyncStorage.setItem('theme', isDark ? 'dark' : 'light');
        } catch (error) {
            console.log('Error saving theme:', error);
        }
    };

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
