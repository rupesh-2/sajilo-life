
import { useState, useEffect } from 'react';
import { Coordinates } from '../../../types/globalTypes';

export const useTrackingSimulation = (initialCoords: Coordinates) => {
    const [coords, setCoords] = useState<Coordinates>(initialCoords);

    useEffect(() => {
        const timer = setInterval(() => {
            setCoords((prev) => ({
                latitude: prev.latitude + 0.0001,
                longitude: prev.longitude + 0.0001,
            }));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return coords;
};
