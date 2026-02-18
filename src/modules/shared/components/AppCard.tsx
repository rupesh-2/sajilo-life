import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';

interface AppCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
    variant?: 'elevated' | 'outlined' | 'flat';
}

export const AppCard: React.FC<AppCardProps> = ({
    children,
    style,
    onPress,
    variant = 'elevated',
}) => {
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            style={[
                styles.base,
                styles[variant],
                style,
            ]}
            onPress={onPress}
            activeOpacity={onPress ? 0.9 : 1}
        >
            {children}
        </Container>
    );
};

const styles = StyleSheet.create({
    base: {
        backgroundColor: colors.background.paper,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    elevated: {
        elevation: 3,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    outlined: {
        borderWidth: 1,
        borderColor: colors.border,
    },
    flat: {
        backgroundColor: colors.background.subtle,
    },
});
