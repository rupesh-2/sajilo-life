
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const PendingBadge = ({ count }: { count: number }) => {
    if (count === 0) return null;
    return (
        <View style={styles.badge}>
            <Text style={styles.text}>{count}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        backgroundColor: 'red',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    text: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
