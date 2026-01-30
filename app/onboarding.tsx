import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    Animated,
    ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Clock, Users, BarChart3, Sparkles } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../src/constants/theme';
import { Button } from '../src/components/common';
import { useAuthStore } from '../src/store/useAuthStore';

const { width } = Dimensions.get('window');

interface OnboardingItem {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    backgroundColor: string;
}

const onboardingData: OnboardingItem[] = [
    {
        id: '1',
        title: 'Visualize Your Time',
        description: 'Experience your day through our beautiful Sectograph - a 24-hour circular visualization that makes time management intuitive.',
        icon: <Clock size={80} color={COLORS.primary} strokeWidth={1.5} />,
        backgroundColor: COLORS.primary,
    },
    {
        id: '2',
        title: 'Collaborate Seamlessly',
        description: 'Share timetables with family, friends, or team members. See who\'s available and sync your schedules in real-time.',
        icon: <Users size={80} color={COLORS.secondary} strokeWidth={1.5} />,
        backgroundColor: COLORS.secondary,
    },
    {
        id: '3',
        title: 'Track Your Progress',
        description: 'Gain insights into your productivity patterns with beautiful analytics and focus statistics.',
        icon: <BarChart3 size={80} color={COLORS.accent} strokeWidth={1.5} />,
        backgroundColor: COLORS.accent,
    },
    {
        id: '4',
        title: 'Minimal & Beautiful',
        description: 'Designed with Korean minimal aesthetics - clean, calming, and delightful to use every day.',
        icon: <Sparkles size={80} color={COLORS.status.error} strokeWidth={1.5} />,
        backgroundColor: COLORS.status.error,
    },
];

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const { user, completeOnboarding } = useAuthStore();

    const viewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0 && viewableItems[0].index !== null) {
                setCurrentIndex(viewableItems[0].index);
            }
        }
    ).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const handleNext = async () => {
        if (currentIndex < onboardingData.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            // User completed onboarding
            if (user) {
                // User is already signed in, complete onboarding and go to tabs
                await completeOnboarding();
                router.replace('/(tabs)');
            } else {
                // User needs to sign in
                router.replace('/login');
            }
        }
    };

    const handleSkip = async () => {
        if (user) {
            await completeOnboarding();
            router.replace('/(tabs)');
        } else {
            router.replace('/login');
        }
    };

    const renderItem = ({ item }: { item: OnboardingItem }) => (
        <View style={styles.slide}>
            <View style={[styles.iconContainer, { backgroundColor: `${item.backgroundColor}20` }]}>
                {item.icon}
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
    );

    const renderDots = () => (
        <View style={styles.dotsContainer}>
            {onboardingData.map((_, index) => {
                const inputRange = [
                    (index - 1) * width,
                    index * width,
                    (index + 1) * width,
                ];

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [8, 24, 8],
                    extrapolate: 'clamp',
                });

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                width: dotWidth,
                                opacity,
                            },
                        ]}
                    />
                );
            })}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo}>घड़ी</Text>
                {currentIndex < onboardingData.length - 1 && (
                    <Button
                        title="Skip"
                        variant="ghost"
                        size="sm"
                        onPress={handleSkip}
                    />
                )}
            </View>

            <FlatList
                ref={flatListRef}
                data={onboardingData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                scrollEventThrottle={16}
            />

            {renderDots()}

            <View style={styles.footer}>
                <Button
                    title={currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
                    variant="primary"
                    size="lg"
                    fullWidth
                    onPress={handleNext}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    logo: {
        fontSize: TYPOGRAPHY.size.xxl,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    slide: {
        width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.xl,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: BORDER_RADIUS.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xxl,
    },
    title: {
        fontSize: TYPOGRAPHY.size.xxl,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    description: {
        fontSize: TYPOGRAPHY.size.md,
        color: COLORS.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: SPACING.md,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: SPACING.xl,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginHorizontal: 4,
    },
    footer: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xl,
    },
});
