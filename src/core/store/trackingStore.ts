
import { create } from 'zustand';
import { Coordinates } from '../../types/globalTypes';

interface TrackingState {
    vehicleLocation: Coordinates | null;
    isTracking: boolean;
    setVehicleLocation: (coords: Coordinates) => void;
    startTracking: () => void;
    stopTracking: () => void;
}

export const useTrackingStore = create<TrackingState>((set) => ({
    vehicleLocation: null,
    isTracking: false,
    setVehicleLocation: (coords) => set({ vehicleLocation: coords }),
    startTracking: () => set({ isTracking: true }),
    stopTracking: () => set({ isTracking: false }),
}));
