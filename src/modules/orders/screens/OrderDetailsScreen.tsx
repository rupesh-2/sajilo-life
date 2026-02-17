
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrderStore } from '../../../core/store/orderStore';

export const OrderDetailsScreen = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { orders, pendingOrders } = useOrderStore();

    const order = [...orders, ...pendingOrders].find(o => o.id === id || (o.isOffline && !o.id && `pending-${id}` === id));

    if (!order) {
        return (
            <View style={styles.center}>
                <Text>Order not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.link}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Order Details</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Status: {order.deliveryStatus}</Text>
                {order.isOffline && <Text style={styles.offlineText}>Awaiting Sync...</Text>}

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>Order ID:</Text>
                    <Text style={styles.value}>{order.id || 'N/A'}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>{new Date(order.createdAt).toLocaleDateString()}</Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.subTitle}>Sender</Text>
                <Text style={styles.value}>{order.sender}</Text>

                <Text style={styles.subTitle}>Recipient</Text>
                <Text style={styles.value}>{order.recipient}</Text>

                <Text style={styles.subTitle}>Delivery Address</Text>
                <Text style={styles.value}>{order.address}</Text>

                <Text style={styles.subTitle}>Contact</Text>
                <Text style={styles.value}>{order.contact}</Text>

                <TouchableOpacity
                    style={styles.trackButton}
                    onPress={() => router.push('/(main)/tracking')}
                >
                    <Text style={styles.trackText}>Track Delivery</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    link: { color: '#2196F3', marginTop: 10, fontSize: 16 },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center'
    },
    backButton: { marginRight: 15 },
    backText: { fontSize: 24, fontWeight: 'bold' },
    title: { fontSize: 22, fontWeight: 'bold' },
    card: { margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 12, elevation: 3 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2196F3' },
    offlineText: { color: '#E65100', fontWeight: '600' },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    label: { color: '#666', fontWeight: '500' },
    value: { color: '#333', fontSize: 16, fontWeight: '400' },
    subTitle: { fontSize: 14, color: '#999', marginTop: 15, marginBottom: 5, textTransform: 'uppercase' },
    trackButton: {
        marginTop: 30,
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center'
    },
    trackText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
