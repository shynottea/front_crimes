import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useCrimeData } from '../../hooks/useCrimeDataMock';
import styles from './Charts.module.css';

const COLORS = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'
];

const CrimeTypesChart = ({ filters }) => {
    const { stats, loading } = useCrimeData(filters);

    if (loading) {
        return (
            <div className={styles.chartLoading}>
                <div className={styles.spinner}></div>
                <p>Загрузка данных...</p>
            </div>
        );
    }

    if (!stats || !stats.topCrimeTypes || stats.topCrimeTypes.length === 0) {
        return (
            <div className={styles.chartEmpty}>
                <div className={styles.emptyIcon}>📊</div>
                <p>Нет данных для отображения</p>
                <small>Попробуйте изменить фильтры</small>
            </div>
        );
    }

    const chartData = stats.topCrimeTypes.map((item, index) => ({
        name: item.label,
        value: item.count,
        percentage: item.percentage,
        color: COLORS[index % COLORS.length]
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className={styles.tooltip}>
                    <p className={styles.tooltipTitle}>{data.name}</p>
                    <p className={styles.tooltipValue}>Количество: {data.value}</p>
                    <p className={styles.tooltipValue}>Процент: {data.percentage.toFixed(1)}%</p>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }) => {
        return (
            <div className={styles.legend}>
                {payload.map((entry, index) => (
                    <div key={index} className={styles.legendItem}>
                        <div
                            className={styles.legendColor}
                            style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className={styles.legendLabel}>{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="45%"
                        innerRadius={30}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        content={<CustomLegend />}
                        wrapperStyle={{
                            paddingTop: '10px',
                            fontSize: '11px'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>

            <div className={styles.chartStats}>
                Всего: {stats.totalCrimes}
            </div>
        </div>
    );
};

export default CrimeTypesChart;