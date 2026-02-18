
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useTrackingStore } from '../../../core/store/trackingStore';
import { Coordinates } from '../../../types/globalTypes';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';
import { typography } from '../../../core/theme/typography';
import { AppCard } from '../../shared/components/AppCard';
import { AppButton } from '../../shared/components/AppButton';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const INITIAL_REGION = {
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

const MOCK_ROUTE: Coordinates[] = [
    { latitude: 40.7128, longitude: -74.0060 },
    { latitude: 40.7150, longitude: -74.0080 },
    { latitude: 40.7180, longitude: -74.0100 },
    { latitude: 40.7210, longitude: -74.0120 },
    { latitude: 40.7250, longitude: -74.0150 },
    { latitude: 40.7280, longitude: -74.0200 },
];

const DESTINATION = MOCK_ROUTE[MOCK_ROUTE.length - 1];

export const TrackingScreen = () => {
    const { vehicleLocation, setVehicleLocation, isTracking, startTracking, stopTracking } = useTrackingStore();
    const [routeIndex, setRouteIndex] = useState(0);
    const mapRef = useRef<MapView>(null);
    const router = useRouter();

    useEffect(() => {
        if (!vehicleLocation) {
            setVehicleLocation(MOCK_ROUTE[0]);
        }
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isTracking) {
            interval = setInterval(() => {
                setRouteIndex((prev) => {
                    const next = (prev + 1) % MOCK_ROUTE.length;
                    const nextCoords = MOCK_ROUTE[next];
                    setVehicleLocation(nextCoords);

                    mapRef.current?.animateToRegion({
                        ...nextCoords,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    }, 1000);

                    return next;
                });
            }, 3000);
        }

        return () => clearInterval(interval);
    }, [isTracking]);

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={INITIAL_REGION}
                customMapStyle={MAP_STYLE}
            >
                {/* Destination Marker */}
                <Marker coordinate={DESTINATION}>
                    <View style={styles.destMarker}>
                        <Ionicons name="location" size={24} color={colors.error} />
                    </View>
                </Marker>

                {/* Vehicle Marker */}
                {vehicleLocation && (
                    <Marker
                        coordinate={vehicleLocation}
                        title="Delivery Vehicle"
                        description="Professional courier on the way"
                    >
                        <View style={styles.vehicleMarker}>
                            <MaterialCommunityIcons name="moped" size={20} color={colors.text.inverse} />
                        </View>
                    </Marker>
                )}

                <Polyline
                    coordinates={MOCK_ROUTE}
                    strokeColor={colors.primary}
                    strokeWidth={4}
                    lineDashPattern={[1, 0]}
                    lineCap="round"
                    lineJoin="round"
                />
            </MapView>

            <SafeAreaView style={styles.overlayContainer} pointerEvents="box-none">
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                </TouchableOpacity>

                <AppCard style={styles.statusCard}>
                    <View style={styles.cardHeader}>
                        <View style={styles.statusBadgeContainer}>
                            <View style={[styles.statusDot, { backgroundColor: isTracking ? colors.success : colors.secondary }]} />
                            <Text style={styles.statusTitle}>
                                {isTracking ? 'Courier is Moving' : 'Tracking Paused'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Estimated Arrival</Text>
                            <Text style={styles.infoValue}>12:45 PM</Text>
                        </View>
                        <View style={styles.dividerVertical} />
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Status</Text>
                            <Text style={styles.infoValue}>{isTracking ? 'On Track' : 'Stationary'}</Text>
                        </View>
                    </View>

                    <AppButton
                        title={isTracking ? 'Pause Tracking' : 'Resume Tracking'}
                        onPress={isTracking ? stopTracking : startTracking}
                        variant={isTracking ? 'outline' : 'primary'}
                        icon={<Ionicons name={isTracking ? 'pause' : 'play'} size={18} color={isTracking ? colors.primary : colors.text.inverse} />}
                        style={styles.actionButton}
                    />
                </AppCard>
            </SafeAreaView>
        </View>
    );
};

const MAP_STYLE = [
    {
        "featureType": "poi",
        "stylers": [{ "visibility": "off" }]
    }
];

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: spacing.lg,
        justifyContent: 'space-between',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.background.paper,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    statusCard: {
        marginBottom: spacing.xl,
        padding: spacing.lg,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    statusBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusTitle: { ...typography.subtitle1, color: colors.text.primary },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.background.subtle,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
    },
    infoItem: {
        flex: 1,
        alignItems: 'center',
    },
    infoLabel: { ...typography.caption, color: colors.text.secondary, marginBottom: 2 },
    infoValue: { ...typography.subtitle2, color: colors.text.primary },
    dividerVertical: {
        width: 1,
        height: '80%',
        backgroundColor: colors.divider,
    },
    actionButton: {
        width: '100%',
    },
    vehicleMarker: {
        backgroundColor: colors.primary,
        padding: 6,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.text.inverse,
        elevation: 5,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
    },
    destMarker: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

