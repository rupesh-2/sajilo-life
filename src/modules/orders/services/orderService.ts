
import { orderRepository } from '../repository/orderRepository';
import { Order } from '../../../types/globalTypes';

export const orderService = {
    getOrders: () => {
        return orderRepository.getOrders();
    },

    createOrder: (order: Order) => {
        // Add business logic here if needed (validation, etc.)
        return orderRepository.createOrder(order);
    }
};
