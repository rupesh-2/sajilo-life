
import { Order } from '../../../types/globalTypes';
import { networkService } from '../../../services/network/networkService';
import { mmkvStorage } from '../../../services/storage/mmkvStorage';
import axiosInstance from '../../../services/api/axiosInstance';

const LOCAL_ORDERS_KEY = 'local_orders';

export const orderRepository = {
    getOrders: async (): Promise<Order[]> => {
        if (await networkService.checkConnection()) {
            // Remote fetch
            try {
                const response = await axiosInstance.get('/orders');
                return response.data;
            } catch (e) {
                console.error('Failed to fetch remote orders', e);
                // Fallback to local if needed, or simple error
                return [];
            }
        } else {
            // Local fetch
            const localData = mmkvStorage.getItem(LOCAL_ORDERS_KEY);
            return localData ? JSON.parse(localData) : [];
        }
    },

    createOrder: async (order: Order) => {
        if (await networkService.checkConnection()) {
            return axiosInstance.post('/orders', order);
        } else {
            // Save locally
            const current = mmkvStorage.getItem(LOCAL_ORDERS_KEY);
            const orders = current ? JSON.parse(current) : [];
            orders.push(order);
            mmkvStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
            return Promise.resolve(order);
        }
    },

    saveLocalOrder: (order: Order) => {
        const current = mmkvStorage.getItem(LOCAL_ORDERS_KEY);
        const orders = current ? JSON.parse(current) : [];
        orders.push(order);
        mmkvStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    },

    createRemoteOrder: (order: Order) => {
        return axiosInstance.post('/orders', order);
    }
};
