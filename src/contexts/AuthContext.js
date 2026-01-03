import React, { createContext, useState, useContext, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile
} from 'firebase/auth';
import { auth } from '../../firebase.config';
import { saveUser, getUser, removeUser } from '../utils/storage';
import { createUserProfile, getUserProfile } from '../services/userService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check for saved user on mount
        checkSavedUser();

        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userProfile = await getUserProfile(firebaseUser.uid);

                    // Auto-sync displayName from Firestore if missing in Firebase Auth
                    if (!firebaseUser.displayName && userProfile?.name) {
                        await updateProfile(firebaseUser, {
                            displayName: userProfile.name
                        });
                        // Refresh the user object to get updated displayName
                        await firebaseUser.reload();
                    }

                    const userData = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName || userProfile?.name,
                        ...userProfile,
                    };
                    setUser(userData);
                    await saveUser(userData);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                    });
                }
            } else {
                setUser(null);
                await removeUser();
            }
            setInitializing(false);
        });

        return unsubscribe;
    }, []);

    const checkSavedUser = async () => {
        try {
            const savedUser = await getUser();
            if (savedUser) {
                setUser(savedUser);
            }
        } catch (error) {
            console.error('Error checking saved user:', error);
        } finally {
            // We don't set initializing false here because onAuthStateChanged will handle it
            // or we can let it run until auth state is confirmed
        }
    };

    const register = async (email, password, name) => {
        try {
            setError(null);
            setLoading(true);

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Update Firebase Auth profile with display name
            await updateProfile(firebaseUser, {
                displayName: name
            });

            // Create user profile in Firestore
            await createUserProfile(firebaseUser.uid, {
                name,
                email,
            });

            // Prevent auto-login: Sign out immediately
            await signOut(auth);
            setUser(null);
            await removeUser();

            return { success: true };
        } catch (error) {
            console.error('Registration error:', error);
            let errorMessage = 'Registration failed';

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered. Please login instead.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak.';
            } else {
                errorMessage = error.message;
            }

            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            setLoading(true);

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Fetch user profile
            const userProfile = await getUserProfile(firebaseUser.uid);

            const userData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                ...userProfile,
            };

            setUser(userData);
            await saveUser(userData);

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Invalid email or password';

            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            }

            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await signOut(auth);
            setUser(null);
            await removeUser();
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (email) => {
        try {
            setLoading(true);
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            console.error('Reset password error:', error);
            let errorMessage = 'Failed to send reset email';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            }
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const updateUserProfile = async (data) => {
        if (!user) return { success: false, error: 'No user logged in' };

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) return { success: false, error: 'No authenticated user' };

            // Update Firebase Auth profile
            await updateProfile(currentUser, {
                displayName: data.name,
                photoURL: data.photoURL
            });

            // Update local user state
            const updatedUser = {
                ...user,
                displayName: data.name,
                name: data.name,
                photoURL: data.photoURL
            };
            setUser(updatedUser);
            await saveUser(updatedUser);

            return { success: true };
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        loading,
        initializing,
        error,
        register,
        login,
        logout,
        resetPassword,
        updateUserProfile,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
