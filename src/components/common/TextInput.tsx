import React, { useState } from 'react';
import {
    TextInput as RNTextInput,
    View,
    Text,
    StyleSheet,
    TextInputProps as RNTextInputProps,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface TextInputProps extends RNTextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
}

export const TextInput: React.FC<TextInputProps> = ({
    label,
    error,
    leftIcon,
    rightIcon,
    containerStyle,
    secureTextEntry,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    
    const isPassword = secureTextEntry !== undefined;
    
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputContainerFocused,
                    error && styles.inputContainerError,
                ]}
            >
                {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
                
                <RNTextInput
                    style={[
                        styles.input,
                        leftIcon && styles.inputWithLeftIcon,
                        (rightIcon || isPassword) && styles.inputWithRightIcon,
                    ]}
                    placeholderTextColor={COLORS.text.hint}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={isPassword && !isPasswordVisible}
                    {...props}
                />
                
                {isPassword && (
                    <TouchableOpacity
                        style={styles.rightIcon}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        {isPasswordVisible ? (
                            <EyeOff size={20} color={COLORS.text.secondary} />
                        ) : (
                            <Eye size={20} color={COLORS.text.secondary} />
                        )}
                    </TouchableOpacity>
                )}
                
                {rightIcon && !isPassword && (
                    <View style={styles.rightIcon}>{rightIcon}</View>
                )}
            </View>
            
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: TYPOGRAPHY.size.sm,
        fontWeight: '500',
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1.5,
        borderColor: COLORS.border,
    },
    inputContainerFocused: {
        borderColor: COLORS.primary,
    },
    inputContainerError: {
        borderColor: COLORS.status.error,
    },
    input: {
        flex: 1,
        fontSize: TYPOGRAPHY.size.md,
        color: COLORS.text.primary,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
    },
    inputWithLeftIcon: {
        paddingLeft: 0,
    },
    inputWithRightIcon: {
        paddingRight: 0,
    },
    leftIcon: {
        paddingLeft: SPACING.md,
    },
    rightIcon: {
        paddingRight: SPACING.md,
    },
    error: {
        fontSize: TYPOGRAPHY.size.xs,
        color: COLORS.status.error,
        marginTop: SPACING.xs,
    },
});
