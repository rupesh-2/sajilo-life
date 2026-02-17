
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Order } from '../../../types/globalTypes';

export const OrderItem = ({ order }: { order: Order }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Order #{order.id}</Text>
            <Text>Total: ${order.total}</Text>
            <Text>Status: {order.status}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: 'white',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});
