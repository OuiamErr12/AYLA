import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import FadeInView from '../components/FadeInView';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing, { borderRadius } from '../theme/spacing';

const EditProfileScreen = ({ navigation }) => {
    const { user, updateUserProfile } = useAuth();
    const [name, setName] = useState(user?.displayName || 'Beauty Lover');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        const result = await updateUserProfile({ name });
        setLoading(false);

        if (result.success) {
            Alert.alert('Success', 'Profile updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert('Error', result.error);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.charcoal} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <FadeInView style={styles.avatarContainer} delay={100}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={48} color={colors.accent} />
                    </View>
                    <TouchableOpacity style={styles.changePhotoBtn}>
                        <Text style={styles.changePhotoText}>Change Photo</Text>
                    </TouchableOpacity>
                </FadeInView>

                <FadeInView style={styles.form} delay={300}>
                    <Input
                        label="Full Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your full name"
                        icon="person-outline"
                    />

                    <Input
                        label="Email"
                        value={email}
                        editable={false}
                        icon="mail-outline"
                    />

                    <Input
                        label="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholder="Enter your phone number"
                        icon="call-outline"
                    />
                </FadeInView>
            </ScrollView>
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
    saveText: {
        ...textStyles.body,
        color: colors.primary,
        fontWeight: '600',
    },
    content: {
        padding: spacing.xl,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: spacing['2xl'],
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.base,
    },
    changePhotoText: {
        ...textStyles.body,
        color: colors.primary,
        fontWeight: '500',
    },
    form: {
        gap: spacing.sm, // Reduced gap since Input handles its own margin
    },
});

export default EditProfileScreen;
