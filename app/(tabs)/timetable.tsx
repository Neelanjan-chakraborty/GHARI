import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../src/constants/theme';

export default function TimetableScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Weekly Schedule</Text>
            <Text style={styles.subtitle}>Collaboration starts here</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: TYPOGRAPHY.size.xl, color: COLORS.text.primary, fontWeight: 'bold' },
    subtitle: { fontSize: TYPOGRAPHY.size.md, color: COLORS.text.secondary, marginTop: 8 },
});
