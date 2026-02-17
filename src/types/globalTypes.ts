
export interface User {
    id: string;
    email: string;
    name: string;
}

export interface Order {
    id: string;
    sender: string;
    recipient: string;
    address: string;
    contact: string;
    deliveryStatus: 'Pending' | 'In Transit' | 'Delivered';
    createdAt: string;
    isOffline?: boolean;
    items?: OrderItem[]; // Optional for now as per simple requirements
    total?: number;
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
}
