import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Path, G, Text as SvgText, Circle } from 'react-native-svg';
import * as d3 from 'd3-shape';
import React, { useMemo } from 'react';
import { COLORS, TYPOGRAPHY } from '../../constants/theme';
import Animated, { useAnimatedProps, withTiming, useSharedValue } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const SIZE = width * 0.85;
const RADIUS = SIZE / 2;
const INNER_RADIUS = RADIUS * 0.6;
const OUTER_RADIUS = RADIUS * 0.95;

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Task {
    id: string;
    title: string;
    startTime: string; // "HH:mm"
    endTime: string;   // "HH:mm"
    color: string;
}

interface SectographProps {
    tasks: Task[];
}

const Sectograph: React.FC<SectographProps> = ({ tasks }) => {
    const timeToAngle = (time: string) => {
        const [hrs, mins] = time.split(':').map(Number);
        // 24 hours = 360 degrees, so 1 hour = 15 degrees
        // We subtract 90 to start 00:00 at the top
        return ((hrs * 60 + mins) / (24 * 60)) * 2 * Math.PI - Math.PI / 2;
    };

    const arcs = useMemo(() => {
        return tasks.map((task) => {
            const startAngle = timeToAngle(task.startTime);
            const endAngle = timeToAngle(task.endTime);

            const arcGenerator = d3.arc()
                .innerRadius(INNER_RADIUS)
                .outerRadius(OUTER_RADIUS)
                .startAngle(startAngle + Math.PI / 2) // Adjusting for D3 coordinate system
                .endAngle(endAngle + Math.PI / 2)
                .cornerRadius(12);

            return {
                path: arcGenerator(null as any),
                task,
            };
        });
    }, [tasks]);

    const hourMarkers = useMemo(() => {
        return Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * 2 * Math.PI - Math.PI / 2;
            const x = RADIUS + (INNER_RADIUS - 20) * Math.cos(angle);
            const y = RADIUS + (INNER_RADIUS - 20) * Math.sin(angle);
            return { x, y, label: i % 6 === 0 ? `${i}:00` : i.toString() };
        });
    }, []);

    return (
        <View style={styles.container}>
            <Svg width={SIZE} height={SIZE}>
                <G x={0} y={0}>
                    {/* Background Circle */}
                    <Circle
                        cx={RADIUS}
                        cy={RADIUS}
                        r={OUTER_RADIUS}
                        fill={COLORS.surface}
                        stroke={COLORS.border}
                        strokeWidth={1}
                    />
                    <Circle
                        cx={RADIUS}
                        cy={RADIUS}
                        r={INNER_RADIUS}
                        fill={COLORS.background}
                    />

                    {/* Hour Markers */}
                    {hourMarkers.map((marker, i) => (
                        <SvgText
                            key={i}
                            x={marker.x}
                            y={marker.y}
                            fill={COLORS.text.hint}
                            fontSize="10"
                            fontWeight="bold"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                        >
                            {marker.label}
                        </SvgText>
                    ))}

                    {/* Task Arcs */}
                    <G x={RADIUS} y={RADIUS}>
                        {arcs.map((arc, i) => (
                            <Path
                                key={arc.task.id}
                                d={arc.path || ''}
                                fill={arc.task.color}
                                opacity={0.8}
                            />
                        ))}
                    </G>

                    {/* Center Text */}
                    <SvgText
                        x={RADIUS}
                        y={RADIUS - 10}
                        fill={COLORS.text.primary}
                        fontSize="18"
                        fontWeight="bold"
                        textAnchor="middle"
                    >
                        21:45
                    </SvgText>
                    <SvgText
                        x={RADIUS}
                        y={RADIUS + 15}
                        fill={COLORS.text.secondary}
                        fontSize="12"
                        textAnchor="middle"
                    >
                        Today
                    </SvgText>
                </G>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
});

export default Sectograph;
