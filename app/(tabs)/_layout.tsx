import React from 'react';
import { Tabs } from 'expo-router';
import { LucideIcon, Home, Calendar, BarChart2, Settings } from 'lucide-react-native';
import { COLORS } from '../../src/constants/theme';
import { View, StyleSheet } from 'react-native';

interface TabIconProps {
    Icon: LucideIcon;
    color: string;
    focused: boolean;
}

const TabIcon = ({ Icon, color, focused }: TabIconProps) => (
    <View style={[styles.iconContainer, focused && styles.focusedIcon]}>
        <Icon size={24} color={color} />
    </View>
);

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.text.secondary,
                tabBarStyle: {
                    backgroundColor: COLORS.surface,
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                headerStyle: {
                    backgroundColor: COLORS.background,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTitleStyle: {
                    fontFamily: 'Outfit', // We'll hope system picks a good match for now
                    fontSize: 20,
                    color: COLORS.text.primary,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Ghari',
                    tabBarIcon: ({ color, focused }) => <TabIcon Icon={Home} color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="timetable"
                options={{
                    title: 'Schedule',
                    tabBarIcon: ({ color, focused }) => <TabIcon Icon={Calendar} color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    title: 'Insights',
                    tabBarIcon: ({ color, focused }) => <TabIcon Icon={BarChart2} color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, focused }) => <TabIcon Icon={Settings} color={color} focused={focused} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        borderRadius: 12,
    },
    focusedIcon: {
        backgroundColor: 'rgba(184, 197, 225, 0.15)',
    },
});
