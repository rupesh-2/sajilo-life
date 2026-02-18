
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, MapViewProps } from 'react-native-maps';
import { useTrackingStore } from '../../../core/store/trackingStore';
import { Coordinates } from '../../../types/globalTypes';

const INITIAL_REGION = {
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

// Simulated route coordinates
const MOCK_ROUTE: Coordinates[] = [
    { latitude: 40.7128, longitude: -74.0060 },
    { latitude: 40.7150, longitude: -74.0080 },
    { latitude: 40.7180, longitude: -74.0100 },
    { latitude: 40.7210, longitude: -74.0120 },
    { latitude: 40.7250, longitude: -74.0150 },
    { latitude: 40.7280, longitude: -74.0200 },
];

export const TrackingScreen = () => {
    const { vehicleLocation, setVehicleLocation, isTracking, startTracking, stopTracking } = useTrackingStore();
    const [routeIndex, setRouteIndex] = useState(0);
    const mapRef = useRef<MapView>(null);

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

                    // Smoothly animate map to follow marker
                    mapRef.current?.animateToRegion({
                        ...nextCoords,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    }, 1000);

                    return next;
                });
            }, 3000); // Update every 3 seconds
        }

        return () => clearInterval(interval);
    }, [isTracking]);

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={INITIAL_REGION}
            >
                {vehicleLocation && (
                    <Marker
                        coordinate={vehicleLocation}
                        title="Delivery Vehicle"
                        description="On the way to destination"
                    >
                        <View style={styles.markerContainer}>
                            <Text style={styles.markerEmoji}>🚚</Text>
                        </View>
                    </Marker>
                )}
                <Polyline
                    coordinates={MOCK_ROUTE}
                    strokeColor="#2196F3"
                    strokeWidth={3}
                    lineDashPattern={[5, 5]}
                />
            </MapView>

            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.statusTitle}>
                        {isTracking ? 'Delivery in Progress' : 'Tracking Paused'}
                    </Text>
                    <Text style={styles.locationText}>
                        Current: {vehicleLocation?.latitude.toFixed(4)}, {vehicleLocation?.longitude.toFixed(4)}
                    </Text>

                    <TouchableOpacity
                        style={[styles.button, isTracking ? styles.stopButton : styles.startButton]}
                        onPress={isTracking ? stopTracking : startTracking}
                    >
                        <Text style={styles.buttonText}>
                            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
    overlay: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    statusTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    locationText: { color: '#666', marginBottom: 15 },
    button: { padding: 15, borderRadius: 10, alignItems: 'center' },
    startButton: { backgroundColor: '#4CAF50' },
    stopButton: { backgroundColor: '#F44336' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    markerContainer: {
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#2196F3',
        elevation: 3
    },
    markerEmoji: { fontSize: 24 }
});
