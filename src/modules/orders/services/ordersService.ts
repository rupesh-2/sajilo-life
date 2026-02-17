import { Order } from "../../../types/globalTypes";

const MOCK_ORDERS: Order[] = [
    {
        id: "101",
        sender: "John Doe",
        recipient: "Alice Smith",
        address: "123 Main St, New York, NY",
        contact: "+1 555-0101",
        deliveryStatus: "Pending",
        createdAt: new Date().toISOString(),
    },
    {
        id: "102",
        sender: "Jane Roe",
        recipient: "Bob Jones",
        address: "456 Market St, San Francisco, CA",
        contact: "+1 555-0102",
        deliveryStatus: "In Transit",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: "103",
        sender: "Company A",
        recipient: "Charlie Brown",
        address: "789 Broadway, Seattle, WA",
        contact: "+1 555-0103",
        deliveryStatus: "Delivered",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
];

export const fetchOrders = async (): Promise<Order[]> => {
    // Simulate network delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...MOCK_ORDERS]);
        }, 1000);
    });
};

export const createOrderApi = async (order: Order): Promise<Order> => {
    // Simulate network request
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Randomly succeed or fail to simulate network issues
            if (Math.random() > 0.1) {
                resolve({ ...order, id: Math.random().toString(36).substr(2, 9) });
            } else {
                reject(new Error("Network error"));
            }
        }, 1000);
    });
};
