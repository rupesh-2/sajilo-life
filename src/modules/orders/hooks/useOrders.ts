
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { useOrderStore } from '../../../core/store/orderStore';
import { Order } from '../../../types/globalTypes';

export const useOrders = () => {
    const queryClient = useQueryClient();
    const setOrders = useOrderStore((state) => state.setOrders);
    const addOrderStore = useOrderStore((state) => state.addOrder);

    const ordersQuery = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const data = await orderService.getOrders();
            setOrders(data);
            return data;
        },
    });

    const createOrderMutation = useMutation({
        mutationFn: (order: Order) => orderService.createOrder(order),
        onSuccess: (data) => {
            // Optimistically update or invalidate
            // If offline, repository already handled local save, but we might want to update store display
            // For now, let's assume getOrders re-fetch handles it or we manually add
            // addOrderStore(data); // if implementation returns the order object
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    return {
        orders: ordersQuery.data,
        isLoading: ordersQuery.isLoading,
        createOrder: createOrderMutation.mutate,
    };
};
