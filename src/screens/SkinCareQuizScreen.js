import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing, { borderRadius, shadows } from '../theme/spacing';
import Button from '../components/Button';
import FadeInView from '../components/FadeInView';

import { sampleProducts } from '../data/sampleProducts';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../contexts/AuthContext';
import { updateUserSkinProfile } from '../services/userService';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.7;

const quizData = [
    {
        id: 1,
        question: "Quel est votre type de peau ?",
        options: [
            { label: "Sèche", value: "dry", icon: "water-outline" },
            { label: "Grasse", value: "oily", icon: "water-outline" },
            { label: "Mixte", value: "combination", icon: "contrast-outline" },
            { label: "Normale", value: "normal", icon: "checkmark-circle-outline" },
        ]
    },
    {
        id: 2,
        question: "Quelle est votre préoccupation principale ?",
        options: [
            { label: "Imperfections / Acné", value: "blemishes", icon: "bug-outline" },
            { label: "Rides / Relâchement", value: "aging", icon: "hourglass-outline" },
            { label: "Teint Terne / Éclat", value: "dullness", icon: "sunny-outline" },
            { label: "Sensibilité / Rougeurs", value: "sensitivity", icon: "thermometer-outline" },
        ]
    },
    {
        id: 3,
        question: "De combien de temps disposez-vous ?",
        options: [
            { label: "Routine Essentielle (< 5 min)", value: "basic", icon: "time-outline" },
            { label: "Routine Complète (> 10 min)", value: "advanced", icon: "star-outline" },
        ]
    }
];

const SkinCareQuizScreen = ({ navigation }) => {
    const { user } = useAuth(); // Fix: Get user from context
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [saving, setSaving] = useState(false);

    // Animated progress
    const progress = (currentStep + 1) / quizData.length;

    const handleAnswer = async (questionId, value) => {
        const newAnswers = { ...answers, [questionId]: value };
        setAnswers(newAnswers);

        if (currentStep < quizData.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            console.log('Quiz finished. Processing results...');

            // Bypass loading for debug to isolate hang
            setSaving(false);

            // Save in background
            if (user?.uid) {
                updateUserSkinProfile(user.uid, {
                    type: newAnswers[1],
                    concern: newAnswers[2],
                    duration: newAnswers[3]
                }).catch(err => console.error('Background save failed:', err));
            }

            // Immediately show results
            setShowResults(true);
        }
    };

    const getRecommendations = () => {
        try {
            // Safe access to answers with fallback
            const type = answers[1] || answers['1'] || 'combination';
            const concern = answers[2] || answers['2'] || 'blemishes';

            if (!sampleProducts) {
                console.warn('sampleProducts is missing');
                return { am: [], pm: [] };
            }

            let filteredProducts = sampleProducts.filter(p => p.category === 'skincare');

            const amRoutine = filteredProducts.filter(p =>
                p.subCategory === 'Cleansers' || p.subCategory === 'Serums' || p.subCategory === 'Sunscreen'
            ).slice(0, 3);

            const pmRoutine = filteredProducts.filter(p =>
                p.subCategory === 'Cleansers' || p.subCategory === 'Cream' || p.subCategory === 'Masks'
            ).slice(0, 3);

            return { am: amRoutine, pm: pmRoutine };
        } catch (error) {
            console.error('Error getting recommendations:', error);
            return { am: [], pm: [] };
        }
    };

    if (showResults) {
        const { am, pm } = getRecommendations();
        return (
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView contentContainerStyle={styles.resultContent} showsVerticalScrollIndicator={false}>
                    <FadeInView delay={100} style={styles.resultHeader}>
                        <View style={styles.successIcon}>
                            <Ionicons name="sparkles" size={40} color={colors.accent} />
                        </View>
                        <Text style={styles.resultTitle}>Votre Diagnostic Ayla</Text>
                        <Text style={styles.resultSub}>Nous avons analysé vos besoins. Voici votre routine idéale :</Text>
                    </FadeInView>

                    <FadeInView delay={300} style={styles.recommendationsList}>
                        <Text style={styles.routineTypeLabel}>Soin du Matin ☀️</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.productsScroll}
                            snapToInterval={cardWidth + spacing.md}
                            decelerationRate="fast"
                        >
                            {am.map((product, index) => (
                                <ProductCard
                                    key={`am-${product.id}`}
                                    product={product}
                                    index={index}
                                    style={{ width: cardWidth, marginRight: spacing.md }}
                                    onPress={() => navigation.navigate('ProductDetail', { product })}
                                />
                            ))}
                        </ScrollView>

                        <Text style={styles.routineTypeLabel}>Soin du Soir 🌙</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.productsScroll}
                            snapToInterval={cardWidth + spacing.md}
                            decelerationRate="fast"
                        >
                            {pm.map((product, index) => (
                                <ProductCard
                                    key={`pm-${product.id}`}
                                    product={product}
                                    index={index}
                                    style={{ width: cardWidth, marginRight: spacing.md }}
                                    onPress={() => navigation.navigate('ProductDetail', { product })}
                                />
                            ))}
                        </ScrollView>
                    </FadeInView>

                    <FadeInView delay={500} style={styles.resultFooter}>
                        <Button
                            title="Découvrir tout le catalogue"
                            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
                            variant="primary"
                            style={styles.mainButton}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                setCurrentStep(0);
                                setShowResults(false);
                            }}
                            style={styles.retryButton}
                        >
                            <Text style={styles.retryText}>Refaire le test</Text>
                        </TouchableOpacity>
                    </FadeInView>
                </ScrollView>
            </SafeAreaView>
        );
    }

    const currentQuiz = quizData[currentStep];

    if (!currentQuiz && !showResults) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color={colors.accent} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.quizHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="close" size={28} color={colors.charcoal} />
                </TouchableOpacity>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                </View>
                <Text style={styles.stepIndicator}>{currentStep + 1}/{quizData.length}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.quizContent}>
                <FadeInView key={currentStep} delay={100}>
                    <Text style={styles.question}>{currentQuiz.question}</Text>
                    <View style={styles.optionsContainer}>
                        {currentQuiz.options.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={styles.optionCard}
                                onPress={() => handleAnswer(currentQuiz.id, option.value)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.optionIcon}>
                                    <Ionicons name={option.icon} size={28} color={colors.accent} />
                                </View>
                                <Text style={styles.optionLabel}>{option.label}</Text>
                                <Ionicons name="chevron-forward" size={20} color={colors.lightGray} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </FadeInView>
            </ScrollView>
            {/* Loading Overlay */}
            {saving && (
                <View style={[styles.container, styles.loadingOverlay]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.question, { marginTop: spacing.lg, fontSize: 16 }]}>
                        Analyse de votre profil en cours...
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    quizHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        gap: spacing.md,
    },
    backButton: {
        padding: spacing.xs,
    },
    progressBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: colors.lightGray,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: colors.accent,
    },
    stepIndicator: {
        ...textStyles.caption,
        color: colors.gray,
        width: 30,
    },
    quizContent: {
        padding: spacing.xl,
    },
    question: {
        ...textStyles.h2,
        color: colors.charcoal,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
    optionsContainer: {
        gap: spacing.md,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.offWhite,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.lightGray,
        ...shadows.sm,
    },
    optionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
        ...shadows.xs,
    },
    optionLabel: {
        ...textStyles.body,
        color: colors.charcoal,
        fontWeight: '600',
        flex: 1,
    },
    resultContent: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    resultHeader: {
        alignItems: 'center',
        marginVertical: spacing.xl,
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    resultTitle: {
        ...textStyles.h2,
        color: colors.charcoal,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    resultSub: {
        ...textStyles.body,
        color: colors.gray,
        textAlign: 'center',
        paddingHorizontal: spacing.xl,
    },
    recommendationsList: {
        width: '100%',
        marginBottom: spacing.xl,
    },
    routineTypeLabel: {
        ...textStyles.h4,
        color: colors.gray,
        paddingHorizontal: spacing.xl,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    productsScroll: {
        paddingLeft: spacing.xl,
        paddingRight: spacing.xl,
        paddingBottom: spacing.md,
    },
    resultFooter: {
        width: '100%',
        paddingHorizontal: spacing.xl,
        gap: spacing.md,
        marginTop: spacing.lg,
    },
    mainButton: {
        borderRadius: borderRadius.full,
    },
    retryButton: {
        alignItems: 'center',
        padding: spacing.md,
    },
    retryText: {
        ...textStyles.bodySmall,
        color: colors.gray,
        textDecorationLine: 'underline',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        zIndex: 1000,
    },
});

export default SkinCareQuizScreen;
