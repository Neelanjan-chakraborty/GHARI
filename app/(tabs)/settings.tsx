import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/useAuthStore';
import { signOut } from '../../src/services/auth';
import { 
    User, 
    Bell, 
    Moon, 
    Clock, 
    Shield, 
    HelpCircle, 
    LogOut,
    ChevronRight,
} from 'lucide-react-native';
import { Card } from '../../src/components/common';

interface SettingItemProps {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    danger?: boolean;
}

const SettingItem = ({ icon, title, subtitle, onPress, showChevron = true, danger = false }: SettingItemProps) => (
    <TouchableOpacity 
        style={styles.settingItem} 
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={[styles.settingIconContainer, danger && styles.dangerIcon]}>
            {icon}
        </View>
        <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, danger && styles.dangerText]}>{title}</Text>
            {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
        {showChevron && <ChevronRight size={20} color={COLORS.text.hint} />}
    </TouchableOpacity>
);

export default function SettingsScreen() {
    const { user, profile, reset } = useAuthStore();

    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut();
                            reset();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to sign out. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerTitle}>Settings</Text>

                {/* Profile Section */}
                <Card variant="elevated" style={styles.profileCard}>
                    <View style={styles.profileRow}>
                        {profile?.avatar ? (
                            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <User size={32} color={COLORS.text.secondary} />
                            </View>
                        )}
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>
                                {profile?.name || user?.displayName || 'User'}
                            </Text>
                            <Text style={styles.profileEmail}>
                                {user?.email || 'No email'}
                            </Text>
                        </View>
                        <ChevronRight size={20} color={COLORS.text.hint} />
                    </View>
                </Card>

                {/* Preferences */}
                <Text style={styles.sectionTitle}>Preferences</Text>
                <Card variant="elevated" style={styles.section}>
                    <SettingItem
                        icon={<Bell size={20} color={COLORS.primary} />}
                        title="Notifications"
                        subtitle="Manage notification preferences"
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        icon={<Moon size={20} color={COLORS.primary} />}
                        title="Appearance"
                        subtitle="Light"
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        icon={<Clock size={20} color={COLORS.primary} />}
                        title="Pomodoro Settings"
                        subtitle="25 min focus, 5 min break"
                    />
                </Card>

                {/* Support */}
                <Text style={styles.sectionTitle}>Support</Text>
                <Card variant="elevated" style={styles.section}>
                    <SettingItem
                        icon={<HelpCircle size={20} color={COLORS.primary} />}
                        title="Help & Support"
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        icon={<Shield size={20} color={COLORS.primary} />}
                        title="Privacy Policy"
                    />
                </Card>

                {/* Sign Out */}
                <Card variant="elevated" style={styles.section}>
                    <SettingItem
                        icon={<LogOut size={20} color={COLORS.status.error} />}
                        title="Sign Out"
                        onPress={handleSignOut}
                        showChevron={false}
                        danger
                    />
                </Card>

                <Text style={styles.version}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: SPACING.lg,
        paddingBottom: SPACING.xxl,
    },
    headerTitle: {
        fontSize: TYPOGRAPHY.size.xxl,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        marginBottom: SPACING.lg,
    },
    profileCard: {
        marginBottom: SPACING.lg,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    avatarPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.glass,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    profileName: {
        fontSize: TYPOGRAPHY.size.lg,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    profileEmail: {
        fontSize: TYPOGRAPHY.size.sm,
        color: COLORS.text.secondary,
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.size.sm,
        fontWeight: '600',
        color: COLORS.text.secondary,
        marginBottom: SPACING.sm,
        marginTop: SPACING.md,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    section: {
        marginBottom: SPACING.sm,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
    },
    settingIconContainer: {
        width: 36,
        height: 36,
        borderRadius: BORDER_RADIUS.sm,
        backgroundColor: `${COLORS.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dangerIcon: {
        backgroundColor: `${COLORS.status.error}15`,
    },
    settingContent: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    settingTitle: {
        fontSize: TYPOGRAPHY.size.md,
        fontWeight: '500',
        color: COLORS.text.primary,
    },
    settingSubtitle: {
        fontSize: TYPOGRAPHY.size.sm,
        color: COLORS.text.secondary,
        marginTop: 2,
    },
    dangerText: {
        color: COLORS.status.error,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginLeft: 52,
    },
    version: {
        fontSize: TYPOGRAPHY.size.sm,
        color: COLORS.text.hint,
        textAlign: 'center',
        marginTop: SPACING.xl,
    },
});
