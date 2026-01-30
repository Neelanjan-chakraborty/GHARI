import { Stack, router, useSegments, useRootNavigationState } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from '../src/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../src/store/useAuthStore';
import { subscribeToAuthState } from '../src/services/auth';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

SplashScreen.preventAutoHideAsync();

function useProtectedRoute() {
    const segments = useSegments();
    const navigationState = useRootNavigationState();
    const { user, loading, initialized, hasCompletedOnboarding, fetchUserProfile, setUser, setLoading, setInitialized } = useAuthStore();

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
            setUser(firebaseUser);
            
            if (firebaseUser) {
                await fetchUserProfile(firebaseUser.uid);
            }
            
            setLoading(false);
            setInitialized(true);
        });

        return () => unsubscribe();
    }, []);

    // Handle navigation based on auth state
    useEffect(() => {
        if (!navigationState?.key || loading || !initialized) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inOnboarding = segments[0] === 'onboarding';
        const inTabs = segments[0] === '(tabs)';

        if (!user) {
            // User is not signed in
            if (!inOnboarding && !inAuthGroup) {
                router.replace('/onboarding');
            }
        } else {
            // User is signed in
            if (!hasCompletedOnboarding) {
                // User hasn't completed onboarding - show onboarding
                if (!inOnboarding) {
                    router.replace('/onboarding');
                }
            } else {
                // User has completed onboarding - go to main app
                if (inAuthGroup || inOnboarding) {
                    router.replace('/(tabs)');
                }
            }
        }
    }, [user, loading, initialized, segments, navigationState?.key, hasCompletedOnboarding]);
}

function LoadingScreen() {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    );
}

export default function RootLayout() {
    const { loading, initialized } = useAuthStore();

    useProtectedRoute();

    useEffect(() => {
        if (initialized) {
            SplashScreen.hideAsync();
        }
    }, [initialized]);

    if (!initialized || loading) {
        return (
            <GestureHandlerRootView style={{ flex: 1 }}>
                <LoadingScreen />
            </GestureHandlerRootView>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: COLORS.background },
                }}
            >
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
});
