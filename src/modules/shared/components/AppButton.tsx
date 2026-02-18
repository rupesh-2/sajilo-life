import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacityProps,
    ViewStyle,
    TextStyle
} from 'react-native';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';
import { typography } from '../../../core/theme/typography';

interface AppButtonProps extends TouchableOpacityProps {
    title: string;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
    title,
    loading = false,
    variant = 'primary',
    size = 'md',
    icon,
    style,
    textStyle,
    disabled,
    ...props
}) => {
    const isOutline = variant === 'outline';
    const isDanger = variant === 'danger';
    const isSecondary = variant === 'secondary';

    return (
        <TouchableOpacity
            style={[
                styles.base,
                styles[size],
                styles[variant],
                disabled && styles.disabled,
                style,
            ]}
            disabled={disabled || loading}
            activeOpacity={0.8}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={isOutline ? colors.primary : colors.text.inverse} />
            ) : (
                <>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                    <Text
                        style={[
                            styles.textBase,
                            styles[`${size}Text`],
                            isOutline ? styles.outlineText : styles.filledText,
                            isDanger && !isOutline && styles.filledText,
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.md,
        overflow: 'hidden',
    },
    // Variants
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.secondary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    danger: {
        backgroundColor: colors.error,
    },
    disabled: {
        backgroundColor: colors.background.subtle,
        borderColor: colors.border,
        opacity: 0.6,
    },
    // Sizes
    sm: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
    },
    md: {
        paddingVertical: spacing.md - 4,
        paddingHorizontal: spacing.md,
    },
    lg: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    // Text Styles
    textBase: {
        ...typography.button,
        textAlign: 'center',
    },
    smText: { fontSize: 14 },
    mdText: { fontSize: 16 },
    lgText: { fontSize: 18 },
    filledText: {
        color: colors.text.inverse,
    },
    outlineText: {
        color: colors.primary,
    },
    iconContainer: {
        marginRight: spacing.sm,
    },
});

import { View } from 'react-native';
