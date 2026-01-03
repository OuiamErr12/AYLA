import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import spacing from '../theme/spacing';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <ImageBackground
                source={require('../../assets/welcome-bg.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                {/* Overlay Gradient for better text readability if needed */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0)']}
                    style={styles.gradientOverlay}
                />

                {/* Center Button */}
                <View style={styles.centerContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#D4B098', '#C49A80']} // Beige/Nude gradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.buttonGradient}
                        >
                            <Text style={styles.buttonText}>Start</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundImage: {
        flex: 1,
        width: width,
        height: height,
        justifyContent: 'center', // Vertically center content
        alignItems: 'center', // Horizontally center content
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.4,
    },
    centerContainer: {
        width: '60%', // Control button width
        alignItems: 'center',
    },
    button: {
        width: '100%',
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonGradient: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginRight: spacing.sm,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
});

export default WelcomeScreen;
