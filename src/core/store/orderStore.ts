import { create } from 'zustand';
import { MMKV } from "react-native-mmkv";
import { Order } from '../../types/globalTypes';
import { createOrderApi } from '../../modules/orders/services/ordersService';

const storage = new MMKV();

interface OrderState {
    orders: Order[];
    pendingOrders: Order[];
    addOrder: (order: Order) => void;
    addPendingOrder: (order: Order) => void;
    setOrders: (orders: Order[]) => void;
    syncPendingOrders: () => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    pendingOrders: (storage.getString("pendingOrders") ? JSON.parse(storage.getString("pendingOrders")!) : []) as Order[],

    addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

    addPendingOrder: (order) => {
        const newPending = [...get().pendingOrders, { ...order, isOffline: true }];
        set({ pendingOrders: newPending });
        storage.set("pendingOrders", JSON.stringify(newPending));
    },

    setOrders: (orders) => set({ orders }),

    syncPendingOrders: async () => {
        const { pendingOrders, addOrder } = get();
        if (pendingOrders.length === 0) return;

        const remainingPending: Order[] = [];

        for (const order of pendingOrders) {
            try {
                const syncedOrder = await createOrderApi(order);
                addOrder({ ...syncedOrder, isOffline: false, deliveryStatus: 'Pending' });
            } catch (error) {
                console.error("Failed to sync order:", order.id);
                remainingPending.push(order);
            }
        }

        set({ pendingOrders: remainingPending });
        storage.set("pendingOrders", JSON.stringify(remainingPending));
    },
}));
