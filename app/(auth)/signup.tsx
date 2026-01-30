import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../src/constants/theme';
import { Button, TextInput } from '../../src/components/common';
import { signUpWithEmail, signInWithGoogleCredential, Google, GOOGLE_CONFIG } from '../../src/services/auth';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    const { fetchUserProfile } = useAuthStore();

    // Google Auth Session - using expoClientId for Expo Go
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: GOOGLE_CONFIG.expoClientId,
        androidClientId: GOOGLE_CONFIG.androidClientId,
        webClientId: GOOGLE_CONFIG.webClientId,
    });

    // Handle Google sign-in response
    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleGoogleSignIn(id_token);
        } else if (response?.type === 'error') {
            setGoogleLoading(false);
            Alert.alert('Sign Up Failed', 'Unable to sign up with Google. Please try again.');
        }
    }, [response]);

    const handleGoogleSignIn = async (idToken: string) => {
        try {
            const user = await signInWithGoogleCredential(idToken);
            await fetchUserProfile(user.uid);
            // Navigation will be handled by auth state listener
        } catch (error: any) {
            console.error('Google Sign-In Error:', error);
            Alert.alert('Sign Up Failed', 'Unable to sign up with Google. Please try again.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: {
            name?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
        } = {};

        if (!name) {
            newErrors.name = 'Name is required';
        } else if (name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const user = await signUpWithEmail(email, password, name);
            await fetchUserProfile(user.uid);
            // Navigation will be handled by auth state listener
        } catch (error: any) {
            let message = 'An error occurred during sign up';
            if (error.code === 'auth/email-already-in-use') {
                message = 'An account with this email already exists';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Invalid email address';
            } else if (error.code === 'auth/weak-password') {
                message = 'Password is too weak';
            }
            Alert.alert('Sign Up Failed', message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setGoogleLoading(true);
        promptAsync();
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <ArrowLeft size={24} color={COLORS.text.primary} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.logo}>घड़ी</Text>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>
                            Start your journey to better time management
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <TextInput
                            label="Full Name"
                            placeholder="Enter your name"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            error={errors.name}
                            leftIcon={<User size={20} color={COLORS.text.secondary} />}
                        />

                        <TextInput
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            error={errors.email}
                            leftIcon={<Mail size={20} color={COLORS.text.secondary} />}
                        />

                        <TextInput
                            label="Password"
                            placeholder="Create a password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            error={errors.password}
                            leftIcon={<Lock size={20} color={COLORS.text.secondary} />}
                        />

                        <TextInput
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            error={errors.confirmPassword}
                            leftIcon={<Lock size={20} color={COLORS.text.secondary} />}
                        />

                        <Button
                            title="Create Account"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                            onPress={handleSignUp}
                            style={styles.signUpButton}
                        />
                    </View>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or continue with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <Button
                        title="Continue with Google"
                        variant="outline"
                        size="lg"
                        fullWidth
                        loading={googleLoading}
                        onPress={handleGoogleSignUp}
                        icon={
                            <View style={styles.googleIcon}>
                                <Text style={styles.googleIconText}>G</Text>
                            </View>
                        }
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={styles.footerLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.terms}>
                        By creating an account, you agree to our{' '}
                        <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                        <Text style={styles.termsLink}>Privacy Policy</Text>
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: SPACING.lg,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
    },
    header: {
        marginBottom: SPACING.xl,
    },
    logo: {
        fontSize: TYPOGRAPHY.size.xxl,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: TYPOGRAPHY.size.xxl,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.size.md,
        color: COLORS.text.secondary,
    },
    form: {
        marginBottom: SPACING.lg,
    },
    signUpButton: {
        marginTop: SPACING.md,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    dividerText: {
        fontSize: TYPOGRAPHY.size.sm,
        color: COLORS.text.secondary,
        marginHorizontal: SPACING.md,
    },
    googleIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    googleIconText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING.xl,
    },
    footerText: {
        fontSize: TYPOGRAPHY.size.md,
        color: COLORS.text.secondary,
    },
    footerLink: {
        fontSize: TYPOGRAPHY.size.md,
        color: COLORS.primary,
        fontWeight: '600',
    },
    terms: {
        fontSize: TYPOGRAPHY.size.xs,
        color: COLORS.text.secondary,
        textAlign: 'center',
        marginTop: SPACING.lg,
        lineHeight: 18,
    },
    termsLink: {
        color: COLORS.primary,
        fontWeight: '500',
    },
});
