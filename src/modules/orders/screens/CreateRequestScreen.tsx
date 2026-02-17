
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useOrderStore } from '../../../core/store/orderStore';
import { useRouter } from 'expo-router';
import { createOrderApi } from '../services/ordersService';
import { Order } from '../../../types/globalTypes';

export const CreateRequestScreen = () => {
    const [recipient, setRecipient] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [loading, setLoading] = useState(false);
    const { addOrder, addPendingOrder } = useOrderStore();
    const router = useRouter();

    const handleSubmit = async () => {
        if (!recipient || !address || !contact) {
            return Alert.alert('Error', 'Please fill all fields');
        }

        const newOrder: Order = {
            id: '', // Will be assigned by API or marked as pending
            sender: 'Me (Current User)', // Mock sender
            recipient,
            address,
            contact,
            deliveryStatus: 'Pending',
            createdAt: new Date().toISOString(),
        };

        setLoading(true);
        try {
            // Attempt online creation
            const syncedOrder = await createOrderApi(newOrder);
            addOrder({ ...syncedOrder, isOffline: false });
            Alert.alert('Success', 'Order created successfully!');
            router.back();
        } catch (error) {
            // Fallback to offline
            console.log('Online creation failed, saving locally:', error);
            addPendingOrder(newOrder);
            Alert.alert(
                'Offline',
                'Network request failed. Order saved locally and will sync when online.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>New Delivery Request</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Recipient Name</Text>
                <TextInput
                    style={styles.input}
                    value={recipient}
                    onChangeText={setRecipient}
                    placeholder="Enter recipient name"
                />

                <Text style={styles.label}>Delivery Address</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter full address"
                    multiline
                    numberOfLines={3}
                />

                <Text style={styles.label}>Contact Information</Text>
                <TextInput
                    style={styles.input}
                    value={contact}
                    onChangeText={setContact}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Creating...' : 'Create Request'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    backButton: { marginRight: 15 },
    backText: { fontSize: 24, fontWeight: 'bold' },
    title: { fontSize: 22, fontWeight: 'bold' },
    form: { padding: 20 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#fafafa'
    },
    textArea: { height: 100, textAlignVertical: 'top' },
    button: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    },
    disabledButton: { backgroundColor: '#BDBDBD' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
