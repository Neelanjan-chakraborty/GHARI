import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../src/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sectograph from '../../src/components/sectograph/Sectograph';
import { useAuthStore } from '../../src/store/useAuthStore';

const DUMMY_TASKS = [
    { id: '1', title: 'Deep Work', startTime: '09:00', endTime: '12:00', color: COLORS.primary },
    { id: '2', title: 'Lunch Break', startTime: '12:00', endTime: '13:00', color: COLORS.secondary },
    { id: '3', title: 'Gym', startTime: '17:00', endTime: '18:30', color: COLORS.accent },
    { id: '4', title: 'Study', startTime: '20:00', endTime: '22:00', color: COLORS.status.error },
];

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
}

export default function HomeScreen() {
    const { user, profile } = useAuthStore();
    const displayName = profile?.name || user?.displayName || 'there';
    const firstName = displayName.split(' ')[0];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>{getGreeting()}, {firstName}</Text>
                    <Text style={styles.subtitle}>You have {DUMMY_TASKS.length} tasks scheduled for today</Text>
                </View>

                <Sectograph tasks={DUMMY_TASKS} />

                <View style={styles.taskList}>
                    <Text style={styles.sectionTitle}>Today's Schedule</Text>
                    {DUMMY_TASKS.map(task => (
                        <View key={task.id} style={[styles.card, { borderLeftColor: task.color }]}>
                            <Text style={styles.cardTitle}>{task.title}</Text>
                            <Text style={styles.cardTime}>{task.startTime} - {task.endTime}</Text>
                        </View>
                    ))}
                </View>
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
    },
    header: {
        marginBottom: SPACING.xl,
    },
    greeting: {
        fontSize: TYPOGRAPHY.size.xl,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.size.md,
        color: COLORS.text.secondary,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.size.lg,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: SPACING.md,
    },
    taskList: {
        gap: SPACING.md,
    },
    card: {
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: 16,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: SPACING.md,
    },
    cardTitle: {
        fontSize: TYPOGRAPHY.size.md,
        fontWeight: '500',
        color: COLORS.text.primary,
    },
    cardTime: {
        fontSize: TYPOGRAPHY.size.sm,
        color: COLORS.text.secondary,
        marginTop: 4,
    },
});
