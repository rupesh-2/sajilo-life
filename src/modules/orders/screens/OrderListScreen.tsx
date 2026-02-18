
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useOrderStore } from '../../../core/store/orderStore';
import { fetchOrders } from '../services/ordersService';
import { useRouter } from 'expo-router';
import { Order } from '../../../types/globalTypes';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';
import { typography } from '../../../core/theme/typography';
import { AppCard } from '../../shared/components/AppCard';
import { AppButton } from '../../shared/components/AppButton';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export const OrderListScreen = () => {
    const { orders, pendingOrders, setOrders, syncPendingOrders } = useOrderStore();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const loadOrders = async () => {
        try {
            const data = await fetchOrders();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadOrders();
    };

    const allOrders = [...pendingOrders, ...orders];

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Delivered':
                return { color: colors.success, icon: 'checkmark-circle-outline' as const };
            case 'In Transit':
                return { color: colors.primary, icon: 'bicycle-outline' as const };
            case 'Pending':
                return { color: colors.secondary, icon: 'time-outline' as const };
            default:
                return { color: colors.text.secondary, icon: 'help-circle-outline' as const };
        }
    };

    const renderOrderItem = ({ item }: { item: Order }) => {
        const statusConfig = getStatusConfig(item.deliveryStatus);

        return (
            <AppCard
                onPress={() => router.push(`/(main)/orders/${item.id}`)}
                style={styles.card}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.idContainer}>
                        <MaterialCommunityIcons name="package-variant-closed" size={18} color={colors.primary} />
                        <Text style={styles.orderId}>#{item.id || 'SYNCING'}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
                        <Ionicons name={statusConfig.icon} size={14} color={statusConfig.color} />
                        <Text style={[styles.statusText, { color: statusConfig.color }]}>
                            {item.deliveryStatus}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.details}>
                    <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
                        <Text style={styles.detailText} numberOfLines={1}>
                            <Text style={styles.label}>To: </Text>{item.recipient}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Ionicons name="map-outline" size={16} color={colors.text.secondary} />
                        <Text style={styles.detailText} numberOfLines={1}>
                            {item.address}
                        </Text>
                    </View>
                </View>

                {item.isOffline && (
                    <View style={styles.offlineIndicator}>
                        <Ionicons name="cloud-offline-outline" size={12} color={colors.secondaryDark} />
                        <Text style={styles.offlineText}>Local Storage (Needs Sync)</Text>
                    </View>
                )}
            </AppCard>
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Fetching your deliveries...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Delivery Hub</Text>
                    <Text style={styles.subtitle}>You have {allOrders.length} active orders</Text>
                </View>
                {pendingOrders.length > 0 && (
                    <AppButton
                        title={`Sync (${pendingOrders.length})`}
                        onPress={syncPendingOrders}
                        size="sm"
                        variant="secondary"
                        icon={<Ionicons name="sync" size={16} color={colors.text.inverse} />}
                    />
                )}
            </View>

            <FlatList
                data={allOrders}
                keyExtractor={(item, index) => item.id || `pending-${index}`}
                renderItem={renderOrderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="cube-outline" size={64} color={colors.text.hint} />
                        <Text style={styles.emptyTitle}>No Orders Yet</Text>
                        <Text style={styles.emptySubtitle}>Your active delivery requests will appear here.</Text>
                        <AppButton
                            title="Create First Request"
                            onPress={() => router.push('/(main)/orders/create')}
                            style={styles.emptyButton}
                        />
                    </View>
                }
                contentContainerStyle={styles.listContent}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/(main)/orders/create')}
                activeOpacity={0.9}
            >
                <Ionicons name="add" size={32} color={colors.text.inverse} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.default },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.default },
    loadingText: { marginTop: spacing.md, ...typography.body2, color: colors.text.secondary },
    header: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        paddingTop: spacing.md,
        backgroundColor: colors.background.paper,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    title: { ...typography.h1, color: colors.text.primary },
    subtitle: { ...typography.body2, color: colors.text.secondary },
    listContent: { padding: spacing.md, paddingBottom: 100 },
    card: {
        marginBottom: spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    idContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    orderId: {
        ...typography.subtitle2,
        color: colors.text.primary,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    divider: {
        height: 1,
        backgroundColor: colors.divider,
        marginVertical: spacing.sm,
    },
    details: { gap: spacing.xs },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    detailText: {
        ...typography.body2,
        color: colors.text.primary,
        flex: 1,
    },
    label: { color: colors.text.secondary, fontWeight: '500' },
    offlineIndicator: {
        marginTop: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.secondaryLight + '40',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.xs,
        alignSelf: 'flex-start',
    },
    offlineText: { color: colors.secondaryDark, fontSize: 10, fontWeight: 'bold' },
    empty: { alignItems: 'center', marginTop: 100, paddingHorizontal: spacing.xl },
    emptyTitle: { ...typography.h3, color: colors.text.primary, marginTop: spacing.md },
    emptySubtitle: { ...typography.body2, color: colors.text.secondary, textAlign: 'center', marginTop: spacing.xs },
    emptyButton: { marginTop: spacing.lg, width: '100%' },
    fab: {
        position: 'absolute',
        bottom: spacing.xl,
        right: spacing.xl,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
});

