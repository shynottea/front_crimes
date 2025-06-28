import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useCrimeData } from '../../hooks/useCrimeDataMock';
import styles from './Charts.module.css';

const DynamicsChart = ({ filters }) => {
    const { timeSeriesData, loading } = useCrimeData(filters);

    if (loading) {
        return (
            <div className={styles.chartLoading}>
                <div className={styles.spinner}></div>
                <p>Загрузка данных...</p>
            </div>
        );
    }

    if (!timeSeriesData || timeSeriesData.length === 0) {
        return (
            <div className={styles.chartEmpty}>
                <div className={styles.emptyIcon}>📈</div>
                <p>Нет данных для отображения</p>
                <small>Попробуйте изменить период</small>
            </div>
        );
    }

    // Обработка данных для графика
    const chartData = timeSeriesData.map(item => {
        // Добавим отладочную информацию
        console.log('Processing date:', item.date, 'Type:', typeof item.date);

        const date = new Date(item.date);
        console.log('Parsed date:', date, 'Year:', date.getFullYear());

        return {
            date: item.date,
            count: item.count,
            formattedDate: date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit'
            })
        };
    });

    // Расчет тренда
    const calculateTrend = () => {
        if (chartData.length < 2) return 0;

        const firstHalf = chartData.slice(0, Math.floor(chartData.length / 2));
        const secondHalf = chartData.slice(Math.floor(chartData.length / 2));

        const firstAvg = firstHalf.reduce((sum, item) => sum + item.count, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, item) => sum + item.count, 0) / secondHalf.length;

        return ((secondAvg - firstAvg) / firstAvg) * 100;
    };

    const trend = calculateTrend();
    const maxValue = Math.max(...chartData.map(item => item.count));
    const minValue = Math.min(...chartData.map(item => item.count));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            // Используем оригинальную дату из данных, а не label
            const originalDate = data.payload.date;
            return (
                <div className={styles.tooltip}>
                    <p className={styles.tooltipTitle}>
                        {new Date(originalDate).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                    <p className={styles.tooltipValue}>
                        Преступлений: {data.value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                    <defs>
                        <linearGradient id="crimeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#334155"
                        strokeOpacity={0.5}
                    />
                    <XAxis
                        dataKey="formattedDate"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        width={30}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#crimeGradient)"
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#1e293b' }}
                    />
                </AreaChart>
            </ResponsiveContainer>

            <div className={styles.chartStats}>
                <div className={`${styles.statItem} ${trend >= 0 ? styles.positive : styles.negative}`}>
                    {trend >= 0 ? '↗' : '↘'} {Math.abs(trend).toFixed(1)}%
                </div>
                <div className={styles.statItem}>
                    Макс: {maxValue}
                </div>
                <div className={styles.statItem}>
                    Мин: {minValue}
                </div>
            </div>
        </div>
    );
};

export default DynamicsChart;