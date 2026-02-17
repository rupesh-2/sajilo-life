
import { Coordinates } from '../../../types/globalTypes';

export const trackingService = {
    getRoute: async (start: Coordinates, end: Coordinates) => {
        // Mock route fetching
        return [start, end]; // simplified
    }
};
