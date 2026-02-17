
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useOrderStore } from '../../../core/store/orderStore';
import { fetchOrders } from '../services/ordersService';
import { useRouter } from 'expo-router';
import { Order } from '../../../types/globalTypes';

export const OrderListScreen = () => {
    const { orders, pendingOrders, setOrders, syncPendingOrders } = useOrderStore();
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const loadOrders = async () => {
        setRefreshing(true);
        try {
            const data = await fetchOrders();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const allOrders = [...pendingOrders, ...orders];

    const renderOrderItem = ({ item }: { item: Order }) => (
        <TouchableOpacity
            style={[styles.card, item.isOffline && styles.offlineCard]}
            onPress={() => router.push(`/(main)/orders/${item.id}`)}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.orderId}>ID: {item.id || 'Pending...'}</Text>
                <Text style={[styles.status, { color: getStatusColor(item.deliveryStatus) }]}>
                    {item.deliveryStatus}
                </Text>
            </View>
            <View style={styles.details}>
                <Text><Text style={styles.label}>From:</Text> {item.sender}</Text>
                <Text><Text style={styles.label}>To:</Text> {item.recipient}</Text>
            </View>
            {item.isOffline && (
                <View style={styles.offlineBadge}>
                    <Text style={styles.offlineText}>Awaiting Sync</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered': return '#4CAF50';
            case 'In Transit': return '#2196F3';
            case 'Pending': return '#FF9800';
            default: return '#757575';
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Delivery Hub</Text>
                {pendingOrders.length > 0 && (
                    <TouchableOpacity onPress={syncPendingOrders} style={styles.syncButton}>
                        <Text style={styles.syncText}>Sync ({pendingOrders.length})</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={allOrders}
                keyExtractor={(item, index) => item.id || `pending-${index}`}
                renderItem={renderOrderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadOrders} />
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text>No orders found.</Text>
                    </View>
                }
                contentContainerStyle={styles.listContent}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/(main)/orders/create')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2
    },
    title: { fontSize: 24, fontWeight: 'bold' },
    syncButton: { backgroundColor: '#2196F3', padding: 8, borderRadius: 5 },
    syncText: { color: '#fff', fontWeight: '600' },
    listContent: { padding: 15, paddingBottom: 100 },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 1,
        borderLeftWidth: 5,
        borderLeftColor: '#2196F3'
    },
    offlineCard: { borderLeftColor: '#FF9800' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    orderId: { fontWeight: '700', fontSize: 16 },
    status: { fontWeight: '600' },
    details: { gap: 4 },
    label: { color: '#666', fontWeight: '500' },
    offlineBadge: {
        marginTop: 10,
        backgroundColor: '#FFF3E0',
        padding: 4,
        borderRadius: 4,
        alignSelf: 'flex-start'
    },
    offlineText: { color: '#E65100', fontSize: 12, fontWeight: 'bold' },
    empty: { alignItems: 'center', marginTop: 50 },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    },
    fabText: { color: '#fff', fontSize: 30, fontWeight: 'bold' }
});
