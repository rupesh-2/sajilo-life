
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export const Input = (props: React.ComponentProps<typeof TextInput>) => {
    return <TextInput style={styles.input} {...props} />;
};

const styles = StyleSheet.create({
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        width: '100%',
    },
});
