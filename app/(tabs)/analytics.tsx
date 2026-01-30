import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../src/constants/theme';

export default function AnalyticsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Productivity Insights</Text>
            <Text style={styles.subtitle}>Track your focus growth</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: TYPOGRAPHY.size.xl, color: COLORS.text.primary, fontWeight: 'bold' },
    subtitle: { fontSize: TYPOGRAPHY.size.md, color: COLORS.text.secondary, marginTop: 8 },
});
