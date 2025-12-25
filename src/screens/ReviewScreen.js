import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Card } from '../components/UI';
import { getCompletionStatsForDateRange, getEnabledRoutines } from '../database/queries';
import { getLastNDays, formatDateForDB } from '../utils/dateHelpers';
import { colors, spacing, textStyles } from '../theme';
import { format } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

export const ReviewScreen = () => {
    const [stats, setStats] = useState([]);
    const [totalRoutines, setTotalRoutines] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setIsLoading(true);

            const last7Days = getLastNDays(7);
            const startDate = last7Days[0];
            const endDate = last7Days[last7Days.length - 1];

            const completionData = await getCompletionStatsForDateRange(startDate, endDate);
            const enabledRoutines = await getEnabledRoutines();

            setTotalRoutines(enabledRoutines.length);

            // Create full stats array with zeros for missing days
            const fullStats = last7Days.map((date) => {
                const found = completionData.find((d) => d.date === date);
                return {
                    date,
                    count: found ? found.completed_count : 0,
                };
            });

            setStats(fullStats);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateAverage = () => {
        if (stats.length === 0 || totalRoutines === 0) return 0;

        const totalCompleted = stats.reduce((sum, day) => sum + day.count, 0);
        const totalPossible = stats.length * totalRoutines;

        return Math.round((totalCompleted / totalPossible) * 100);
    };

    const getBestDay = () => {
        if (stats.length === 0) return null;

        const best = stats.reduce((max, day) =>
            day.count > max.count ? day : max
            , stats[0]);

        return best;
    };

    const chartConfig = {
        backgroundColor: colors.surface,
        backgroundGradientFrom: colors.surface,
        backgroundGradientTo: colors.surface,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(91, 124, 153, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: colors.primary,
        },
    };

    const barData = {
        labels: stats.map((s) => format(new Date(s.date), 'EEE')),
        datasets: [
            {
                data: stats.map((s) => s.count),
            },
        ],
    };

    const lineData = {
        labels: stats.map((s) => format(new Date(s.date), 'EEE')),
        datasets: [
            {
                data: stats.map((s) => (s.count / totalRoutines) * 100 || 0),
            },
        ],
    };

    const bestDay = getBestDay();
    const average = calculateAverage();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Progress</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Summary Cards */}
                <Card style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>{average}%</Text>
                            <Text style={styles.summaryLabel}>7-Day Average</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>
                                {stats.reduce((sum, day) => sum + day.count, 0)}
                            </Text>
                            <Text style={styles.summaryLabel}>Total Completed</Text>
                        </View>
                    </View>
                </Card>

                {bestDay && bestDay.count > 0 && (
                    <Card style={styles.bestDayCard}>
                        <Text style={styles.bestDayTitle}>🌟 Best Day</Text>
                        <Text style={styles.bestDayDate}>
                            {format(new Date(bestDay.date), 'EEEE, MMM d')}
                        </Text>
                        <Text style={styles.bestDayValue}>
                            {bestDay.count}/{totalRoutines} routines completed
                        </Text>
                    </Card>
                )}

                {/* Bar Chart */}
                <Text style={styles.chartTitle}>Daily Completions</Text>
                <Card style={styles.chartCard}>
                    {stats.length > 0 ? (
                        <BarChart
                            data={barData}
                            width={screenWidth - spacing.md * 4}
                            height={200}
                            chartConfig={chartConfig}
                            style={styles.chart}
                            showValuesOnTopOfBars
                            fromZero
                        />
                    ) : (
                        <Text style={styles.noDataText}>No data available yet</Text>
                    )}
                </Card>

                {/* Line Chart */}
                <Text style={styles.chartTitle}>Completion Percentage Trend</Text>
                <Card style={styles.chartCard}>
                    {stats.length > 0 && totalRoutines > 0 ? (
                        <LineChart
                            data={lineData}
                            width={screenWidth - spacing.md * 4}
                            height={200}
                            chartConfig={chartConfig}
                            style={styles.chart}
                            bezier
                            formatYLabel={(value) => `${Math.round(value)}%`}
                        />
                    ) : (
                        <Text style={styles.noDataText}>No data available yet</Text>
                    )}
                </Card>

                {/* Daily Breakdown */}
                <Text style={styles.chartTitle}>Daily Breakdown</Text>
                {stats.map((day) => (
                    <Card key={day.date} style={styles.dayCard}>
                        <View style={styles.dayRow}>
                            <Text style={styles.dayDate}>
                                {format(new Date(day.date), 'EEEE, MMM d')}
                            </Text>
                            <Text style={styles.dayCount}>
                                {day.count}/{totalRoutines}
                            </Text>
                        </View>

                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${totalRoutines > 0 ? (day.count / totalRoutines) * 100 : 0}%`,
                                    },
                                ]}
                            />
                        </View>
                    </Card>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.lg,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        ...textStyles.h2,
        color: colors.text,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: spacing.xxl,
    },
    summaryCard: {
        marginBottom: spacing.md,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryValue: {
        ...textStyles.h1,
        color: colors.primary,
    },
    summaryLabel: {
        ...textStyles.caption,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: colors.border,
    },
    bestDayCard: {
        marginBottom: spacing.md,
        backgroundColor: colors.success + '20',
        borderColor: colors.success,
        borderWidth: 1,
    },
    bestDayTitle: {
        ...textStyles.h3,
        color: colors.success,
        marginBottom: spacing.xs,
    },
    bestDayDate: {
        ...textStyles.bodyMedium,
        color: colors.text,
    },
    bestDayValue: {
        ...textStyles.caption,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    chartTitle: {
        ...textStyles.h3,
        color: colors.text,
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    chartCard: {
        marginBottom: spacing.md,
        padding: spacing.sm,
    },
    chart: {
        marginVertical: spacing.xs,
        borderRadius: 16,
    },
    noDataText: {
        ...textStyles.body,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingVertical: spacing.xl,
    },
    dayCard: {
        marginBottom: spacing.sm,
    },
    dayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    dayDate: {
        ...textStyles.bodyMedium,
        color: colors.text,
    },
    dayCount: {
        ...textStyles.bodyMedium,
        color: colors.primary,
    },
    progressBar: {
        height: 8,
        backgroundColor: colors.border,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
    },
});
