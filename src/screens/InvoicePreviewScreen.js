import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing, { shadows, borderRadius } from '../theme/spacing';
import Button from '../components/Button';
import FadeInView from '../components/FadeInView';

const InvoicePreviewScreen = ({ navigation, route }) => {
    const { orderData, html } = route.params;
    const [sharing, setSharing] = useState(false);

    const handleShare = async () => {
        try {
            setSharing(true);
            const { uri } = await Print.printToFileAsync({ html });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Partager votre facture Ayla',
                    UTI: 'com.adobe.pdf'
                });
            } else {
                Alert.alert('Erreur', 'Le partage n\'est pas disponible sur cet appareil.');
            }
        } catch (error) {
            console.error('Error sharing PDF:', error);
            Alert.alert('Erreur', 'Impossible de partager la facture.');
        } finally {
            setSharing(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
                    style={styles.backButton}
                >
                    <Ionicons name="close" size={28} color={colors.charcoal} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Aperçu de la Facture</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.previewContainer}>
                <WebView
                    originWhitelist={['*']}
                    source={{ html }}
                    style={styles.webview}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            <FadeInView style={styles.footer} delay={300}>
                <View style={styles.buttonContainer}>
                    <Button
                        title={sharing ? "Préparation..." : "Télécharger / Partager"}
                        onPress={handleShare}
                        variant="primary"
                        style={styles.mainButton}
                        leftIcon={<Ionicons name="share-outline" size={20} color={colors.white} />}
                        disabled={sharing}
                    />
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
                    >
                        <Text style={styles.secondaryButtonText}>Retour à l'accueil</Text>
                    </TouchableOpacity>
                </View>
            </FadeInView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        ...textStyles.h3,
        color: colors.charcoal,
    },
    previewContainer: {
        flex: 1,
        backgroundColor: colors.offWhite,
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    footer: {
        padding: spacing.lg,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
        ...shadows.lg,
    },
    buttonContainer: {
        gap: spacing.md,
    },
    mainButton: {
        borderRadius: borderRadius.full,
    },
    secondaryButton: {
        alignItems: 'center',
        padding: spacing.sm,
    },
    secondaryButtonText: {
        ...textStyles.body,
        color: colors.gray,
        textDecorationLine: 'underline',
    },
});

export default InvoicePreviewScreen;
