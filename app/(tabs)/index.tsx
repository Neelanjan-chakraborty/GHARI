import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../src/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>Good morning, Ghari</Text>
                    <Text style={styles.subtitle}>You have 4 tasks scheduled for today</Text>
                </View>

                <View style={styles.sectographPlaceholder}>
                    <Text style={styles.placeholderText}>Sectograph Coming Soon</Text>
                </View>

                <View style={styles.taskList}>
                    <Text style={styles.sectionTitle}>Today's Schedule</Text>
                    {/* We will add task cards here */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Morning Focus</Text>
                        <Text style={styles.cardTime}>09:00 - 11:00</Text>
                    </View>
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
    sectographPlaceholder: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.xl,
    },
    placeholderText: {
        color: COLORS.text.hint,
        fontSize: TYPOGRAPHY.size.md,
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
