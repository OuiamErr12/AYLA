import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { getProductReviews, addReview, calculateAverageRating } from '../services/reviewService';
import colors from '../theme/colors';
import { textStyles } from '../theme/typography';
import spacing, { borderRadius, shadows } from '../theme/spacing';
import Button from './Button';
import FadeInView from './FadeInView';

const ReviewSection = ({ productId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [showForm, setShowForm] = useState(false);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await getProductReviews(productId);
            setReviews(data);
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const handleSubmit = async () => {
        if (!user) {
            Alert.alert('Accès restreint', 'Veuillez vous connecter pour laisser un avis.');
            return;
        }

        if (!comment.trim()) {
            Alert.alert('Champs requis', 'Veuillez écrire un petit commentaire.');
            return;
        }

        try {
            setSubmitting(true);
            const reviewData = {
                productId,
                userId: user.uid,
                userName: user.displayName || 'Utilisateur Ayla',
                rating,
                comment: comment.trim(),
            };

            await addReview(reviewData);
            setComment('');
            setRating(5);
            setShowForm(false);
            fetchReviews(); // Refresh list
            Alert.alert('Merci !', 'Votre avis a été publié avec succès.');
        } catch (error) {
            console.error('Error submitting review:', error);
            Alert.alert('Erreur', 'Impossible de publier votre avis.');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (count, size = 16, interactive = false) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity
                    key={i}
                    disabled={!interactive}
                    onPress={() => interactive && setRating(i)}
                >
                    <Ionicons
                        name={i <= count ? "star" : "star-outline"}
                        size={size}
                        color={colors.accent}
                        style={interactive ? { marginHorizontal: 4 } : { marginRight: 2 }}
                    />
                </TouchableOpacity>
            );
        }
        return <View style={styles.starsRow}>{stars}</View>;
    };

    const avgRating = calculateAverageRating(reviews);

    if (loading && reviews.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Avis Clients ({reviews.length})</Text>
                <View style={styles.summaryRow}>
                    <Text style={styles.avgScore}>{avgRating}</Text>
                    {renderStars(Math.round(avgRating), 20)}
                </View>
            </View>

            {user && user.role?.trim().toLowerCase() !== 'admin' && !showForm && (
                <TouchableOpacity
                    style={styles.addReviewTrigger}
                    onPress={() => setShowForm(true)}
                >
                    <Ionicons name="create-outline" size={20} color={colors.accent} />
                    <Text style={styles.addReviewText}>Donnez votre avis</Text>
                </TouchableOpacity>
            )}

            {showForm && (
                <FadeInView style={styles.formContainer}>
                    <Text style={styles.formLabel}>Notez ce produit</Text>
                    <View style={styles.ratingSelector}>
                        {renderStars(rating, 32, true)}
                    </View>

                    <TextInput
                        style={styles.commentInput}
                        placeholder="Qu'avez-vous pensé de ce produit ?"
                        placeholderTextColor={colors.gray}
                        multiline
                        numberOfLines={4}
                        value={comment}
                        onChangeText={setComment}
                    />

                    <View style={styles.formActions}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setShowForm(false)}
                        >
                            <Text style={styles.cancelText}>Annuler</Text>
                        </TouchableOpacity>
                        <Button
                            title={submitting ? "Envoi..." : "Publier"}
                            onPress={handleSubmit}
                            variant="primary"
                            style={styles.submitButton}
                            disabled={submitting}
                        />
                    </View>
                </FadeInView>
            )}

            <View style={styles.reviewsList}>
                {reviews.length === 0 ? (
                    <Text style={styles.emptyText}>Soyez le premier à donner votre avis !</Text>
                ) : (
                    reviews.map((item) => (
                        <View key={item.id} style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <Text style={styles.reviewerName}>{item.userName}</Text>
                                {renderStars(item.rating)}
                            </View>
                            <Text style={styles.reviewComment}>{item.comment}</Text>
                            <Text style={styles.reviewDate}>
                                {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                            </Text>
                        </View>
                    ))
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.xl,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
    },
    loadingContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        ...textStyles.h4,
        color: colors.charcoal,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    avgScore: {
        ...textStyles.h3,
        color: colors.accent,
        fontWeight: 'bold',
    },
    starsRow: {
        flexDirection: 'row',
    },
    addReviewTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        padding: spacing.md,
        backgroundColor: colors.primaryLight,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    addReviewText: {
        ...textStyles.button,
        color: colors.accent,
    },
    formContainer: {
        backgroundColor: colors.white,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.xl,
        ...shadows.sm,
        borderWidth: 1,
        borderColor: colors.lightGray,
    },
    formLabel: {
        ...textStyles.bodySmall,
        color: colors.darkGray,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    ratingSelector: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    commentInput: {
        backgroundColor: colors.offWhite,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        minHeight: 100,
        textAlignVertical: 'top',
        color: colors.charcoal,
        ...textStyles.bodySmall,
        marginBottom: spacing.lg,
    },
    formActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: spacing.lg,
    },
    cancelButton: {
        padding: spacing.sm,
    },
    cancelText: {
        ...textStyles.bodySmall,
        color: colors.gray,
    },
    submitButton: {
        paddingHorizontal: spacing.xl,
        height: 44,
    },
    reviewsList: {
        gap: spacing.lg,
    },
    reviewCard: {
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    reviewerName: {
        ...textStyles.bodySmall,
        fontWeight: 'bold',
        color: colors.charcoal,
    },
    reviewComment: {
        ...textStyles.bodySmall,
        color: colors.darkGray,
        lineHeight: 20,
        marginBottom: spacing.xs,
    },
    reviewDate: {
        ...textStyles.caption,
        color: colors.gray,
    },
    emptyText: {
        ...textStyles.bodySmall,
        color: colors.gray,
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: spacing.md,
    },
});

export default ReviewSection;
