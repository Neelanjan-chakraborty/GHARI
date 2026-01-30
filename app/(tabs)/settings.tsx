import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../src/constants/theme';

export default function SettingsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Customize your Ghari experience</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: TYPOGRAPHY.size.xl, color: COLORS.text.primary, fontWeight: 'bold' },
    subtitle: { fontSize: TYPOGRAPHY.size.md, color: COLORS.text.secondary, marginTop: 8 },
});
