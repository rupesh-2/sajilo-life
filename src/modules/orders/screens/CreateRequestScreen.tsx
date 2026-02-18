
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useOrderStore } from '../../../core/store/orderStore';
import { useRouter } from 'expo-router';
import { createOrderApi } from '../services/ordersService';
import { Order } from '../../../types/globalTypes';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';
import { typography } from '../../../core/theme/typography';
import { AppButton } from '../../shared/components/AppButton';
import { AppCard } from '../../shared/components/AppCard';
import { Ionicons } from '@expo/vector-icons';

export const CreateRequestScreen = () => {
    const [recipient, setRecipient] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [loading, setLoading] = useState(false);
    const { addOrder, addPendingOrder } = useOrderStore();
    const router = useRouter();

    const handleSubmit = async () => {
        if (!recipient || !address || !contact) {
            return Alert.alert('Missing Info', 'Please provide all required details to create a delivery request.');
        }

        const newOrder: Order = {
            id: '',
            sender: 'Me (Current User)',
            recipient,
            address,
            contact,
            deliveryStatus: 'Pending',
            createdAt: new Date().toISOString(),
        };

        setLoading(true);
        try {
            const syncedOrder = await createOrderApi(newOrder);
            addOrder({ ...syncedOrder, isOffline: false });
            Alert.alert('Success', 'Your delivery request has been created!');
            router.back();
        } catch (error) {
            console.log('Online creation failed, saving locally:', error);
            addPendingOrder(newOrder);
            Alert.alert(
                'Saved Locally',
                'Your request was saved for later sync as you are currently offline.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.title}>New Delivery</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.form}>
                    <Text style={styles.sectionTitle}>Recipient Details</Text>

                    <AppCard variant="flat" style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                            <View style={styles.inputContent}>
                                <Text style={styles.inputLabel}>Recipient Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={recipient}
                                    onChangeText={setRecipient}
                                    placeholder="Who are we delivering to?"
                                    placeholderTextColor={colors.text.hint}
                                />
                            </View>
                        </View>
                    </AppCard>

                    <AppCard variant="flat" style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="call-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                            <View style={styles.inputContent}>
                                <Text style={styles.inputLabel}>Contact Number</Text>
                                <TextInput
                                    style={styles.input}
                                    value={contact}
                                    onChangeText={setContact}
                                    placeholder="How can we reach them?"
                                    placeholderTextColor={colors.text.hint}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>
                    </AppCard>

                    <View style={styles.spacer} />
                    <Text style={styles.sectionTitle}>Delivery Location</Text>

                    <AppCard variant="flat" style={StyleSheet.flatten([styles.inputContainer, styles.textAreaCard])}>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="location-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                            <View style={styles.inputContent}>
                                <Text style={styles.inputLabel}>Full Address</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={address}
                                    onChangeText={setAddress}
                                    placeholder="Building, street, and city..."
                                    placeholderTextColor={colors.text.hint}
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>
                        </View>
                    </AppCard>

                    <View style={styles.footer}>
                        <AppButton
                            title={loading ? 'Creating Request...' : 'Create Delivery Request'}
                            onPress={handleSubmit}
                            loading={loading}
                            size="lg"
                            style={styles.submitButton}
                        />
                        <Text style={styles.helperText}>
                            Available online and offline. Requests will sync automatically.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.paper },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    backButton: {
        padding: spacing.xs,
        marginRight: spacing.md,
    },
    title: { ...typography.h2, color: colors.text.primary },
    scrollContent: { flexGrow: 1 },
    form: { padding: spacing.lg },
    sectionTitle: {
        ...typography.subtitle2,
        color: colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: spacing.md,
    },
    inputContainer: {
        marginBottom: spacing.md,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: colors.background.subtle,
    },
    textAreaCard: {
        minHeight: 120,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    inputIcon: {
        marginTop: 2,
        marginRight: spacing.md,
    },
    inputContent: {
        flex: 1,
    },
    inputLabel: {
        ...typography.caption,
        color: colors.text.secondary,
        marginBottom: 2,
    },
    input: {
        ...typography.body1,
        color: colors.text.primary,
        padding: 0,
    },
    textArea: {
        textAlignVertical: 'top',
        minHeight: 80,
    },
    spacer: { height: spacing.lg },
    footer: {
        marginTop: spacing.xl,
        alignItems: 'center',
    },
    submitButton: {
        width: '100%',
    },
    helperText: {
        ...typography.caption,
        color: colors.text.secondary,
        marginTop: spacing.md,
        textAlign: 'center',
    },
});

