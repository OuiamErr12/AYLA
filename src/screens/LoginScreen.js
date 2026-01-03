import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    StatusBar,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import FadeInView from '../components/FadeInView';
import Input from '../components/Input';

const LoginScreen = ({ navigation }) => {
    const { login, resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Reset state when screen comes into focus
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setLoading(false);
            // Optional: clear fields or keep them? Usually keep is better for UX, but clear if needed.
            // setErrors({}); 
        });
        return unsubscribe;
    }, [navigation]);

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert('Required', 'Please enter your email address first to reset your password.');
            return;
        }

        setLoading(true);
        try {
            const result = await resetPassword(email);
            if (result.success) {
                Alert.alert('Success', 'Password reset email sent! Check your inbox.');
            } else {
                Alert.alert('Error', result.error);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const result = await login(email, password);
            if (!result.success) {
                Alert.alert('Login Failed', result.error);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Header Section */}
                    <FadeInView style={styles.headerContainer} delay={100}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to your account</Text>
                    </FadeInView>

                    {/* Form Section */}
                    <FadeInView style={styles.formContainer} delay={300}>

                        {/* Email Input */}
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            icon="mail-outline"
                        />

                        {/* Password Input */}
                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            icon="lock-closed-outline"
                        />

                        {/* Forgot Password */}
                        <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 20 }} onPress={handleForgotPassword}>
                            <Text style={{ color: '#D4A574', fontWeight: 'bold' }}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Signing In...' : 'SIGN IN'}
                            </Text>
                        </TouchableOpacity>

                        {/* Register Link */}
                        <View style={styles.footer}>
                            <Text style={{ color: '#666' }}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={{ color: '#D4A574', fontWeight: 'bold' }}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>

                    </FadeInView>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Pure white background
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    headerContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000000', // Explicit Black
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666', // Explicit Gray
    },
    formContainer: {
        width: '100%',
    },
    button: {
        backgroundColor: '#D4B098', // Beige/Nude
        borderRadius: 30, // Rounded button
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoginScreen;
