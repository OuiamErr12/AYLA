import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import FadeInView from '../components/FadeInView';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing from '../theme/spacing';

import { seedProductsToFirestore } from '../utils/seedDatabase';

const SettingsScreen = ({ navigation }) => {
    const { user, resetPassword } = useAuth();
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [seeding, setSeeding] = useState(false);

    const handleSeedDatabase = async () => {
        Alert.alert(
            'Initialize Database',
            'This will upload sample products to your Firestore database. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Upload',
                    onPress: async () => {
                        setSeeding(true);
                        const result = await seedProductsToFirestore();
                        setSeeding(false);
                        
                        if (result.success) {
                            Alert.alert('Success', result.message);
                        } else {
                            Alert.alert('Error', result.error);
                        }
                    }
                }
            ]
        );
    };

    const handleChangePassword = async () => {
        if (user?.email) {
            const result = await resetPassword(user.email);
            if (result.success) {
                Alert.alert('Email Sent', 'We have sent a password reset link to your email.');
            } else {
                Alert.alert('Error', result.error);
            }
        }
    };

    const openPrivacy = () => {
        navigation.navigate('StaticPage', {
            title: 'Privacy Policy',
            content: 'Sensitivity & Data Protection.\n\nWe value your privacy. Your data is secure with us and will never be sold to third parties.\n\n[Full Legal Text Would Go Here]'
        });
    };

    const openTerms = () => {
        navigation.navigate('StaticPage', {
            title: 'Terms of Service',
            content: 'By using Ayla, you agree to our terms.\n\n1. Use responsibly.\n2. Be kind.\n3. Enjoy beauty.\n\n[Full Legal Text Would Go Here]'
        });
    };

    const SettingItem = ({ label, value, onValueChange, type = 'switch', onPress }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={type !== 'switch' ? onPress : undefined}
            disabled={type === 'switch'}
        >
            <Text style={styles.itemLabel}>{label}</Text>
            {type === 'switch' ? (
                <Switch
                    trackColor={{ false: colors.gray, true: colors.accent }}
                    thumbColor={colors.white}
                    ios_backgroundColor={colors.gray}
                    onValueChange={onValueChange}
                    value={value}
                />
            ) : (
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.charcoal} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Developer Tools - Only visible for admin or during dev */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={styles.sectionHeader}>DEVELOPER TOOLS</Text>
                    <SettingItem
                        label={seeding ? "Uploading..." : "Initialize Database"}
                        type="arrow"
                        onPress={handleSeedDatabase}
                    />
                </View>

                <FadeInView delay={100}>
                    <Text style={styles.sectionHeader}>PREFERENCES</Text>

                    <SettingItem
                        label="Push Notifications"
                        value={pushEnabled}
                        onValueChange={setPushEnabled}
                    />
                    <SettingItem
                        label="Email Notifications"
                        value={emailEnabled}
                        onValueChange={setEmailEnabled}
                    />
                </FadeInView>

                <FadeInView delay={300}>
                    <Text style={styles.sectionHeader}>ACCOUNT</Text>

                    <SettingItem
                        label="Change Password"
                        type="arrow"
                        onPress={handleChangePassword}
                    />
                    <SettingItem
                        label="Privacy Policy"
                        type="arrow"
                        onPress={openPrivacy}
                    />
                    <SettingItem
                        label="Terms of Service"
                        type="arrow"
                        onPress={openTerms}
                    />
                </FadeInView>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.offWhite,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    headerTitle: {
        ...textStyles.h3,
        color: colors.charcoal,
    },
    backButton: {
        padding: spacing.xs,
    },
    content: {
        padding: spacing.lg,
    },
    sectionHeader: {
        ...textStyles.caption,
        color: colors.gray,
        marginTop: spacing.xl,
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
        fontWeight: 'bold',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: spacing.sm,
        marginBottom: 1,
    },
    itemLabel: {
        ...textStyles.body,
        color: colors.charcoal,
    },
});

export default SettingsScreen;
