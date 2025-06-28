// utils/dataProcessing.js

// Типы преступлений с переводом
export const CRIME_TYPES = {
    'theft': 'Кражи',
    'robbery': 'Грабежи',
    'assault': 'Нападения',
    'fraud': 'Мошенничество',
    'vandalism': 'Вандализм',
    'drugs': 'Наркопреступления',
    'unknown': 'Неизвестно'
};

// Районы Алматы
export const ALMATY_DISTRICTS = [
    'Ауэзовский',
    'Бостандыкский',
    'Жетысуский',
    'Медеуский',
    'Наурызбайский',
    'Турксибский',
    'Алатауский',
    'Алмалинский'
];

// Временные интервалы
export const TIME_PERIODS = {
    'morning': { start: 6, end: 12, label: 'Утро (06:00-12:00)' },
    'day': { start: 12, end: 18, label: 'День (12:00-18:00)' },
    'evening': { start: 18, end: 22, label: 'Вечер (18:00-22:00)' },
    'night': { start: 22, end: 6, label: 'Ночь (22:00-06:00)' }
};

// Обработка временных данных
export class TimeProcessor {
    static getQuarter(date) {
        const month = new Date(date).getMonth() + 1;
        return Math.ceil(month / 3);
    }

    static getMonth(date) {
        return new Date(date).getMonth() + 1;
    }

    static getWeekOfYear(date) {
        const d = new Date(date);
        const yearStart = new Date(d.getFullYear(), 0, 1);
        return Math.ceil((((d - yearStart) / 86400000) + yearStart.getDay() + 1) / 7);
    }

    static getTimeOfDay(time) {
        const hour = new Date(time).getHours();

        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'afternoon';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    }

    static formatPeriod(period) {
        const periodMap = {
            '2024-q4': 'IV квартал 2024',
            '2024-q3': 'III квартал 2024',
            '2024-q2': 'II квартал 2024',
            '2024-q1': 'I квартал 2024',
            '2024': '2024 год',
            '2023': '2023 год'
        };
        return periodMap[period] || period;
    }
}

// Фильтрация данных
export class DataFilter {
    static filterByPeriod(data, period) {
        const now = new Date();
        const currentYear = now.getFullYear();

        return data.filter(item => {
            const itemDate = new Date(item.date || item.created_at);

            switch (period) {
                case '2024-q4':
                    return itemDate.getFullYear() === 2024 &&
                        TimeProcessor.getQuarter(itemDate) === 4;
                case '2024-q3':
                    return itemDate.getFullYear() === 2024 &&
                        TimeProcessor.getQuarter(itemDate) === 3;
                case '2024-q2':
                    return itemDate.getFullYear() === 2024 &&
                        TimeProcessor.getQuarter(itemDate) === 2;
                case '2024-q1':
                    return itemDate.getFullYear() === 2024 &&
                        TimeProcessor.getQuarter(itemDate) === 1;
                case '2024-12':
                    return itemDate.getFullYear() === 2024 &&
                        itemDate.getMonth() === 11;
                case '2024-11':
                    return itemDate.getFullYear() === 2024 &&
                        itemDate.getMonth() === 10;
                case '2024-10':
                    return itemDate.getFullYear() === 2024 &&
                        itemDate.getMonth() === 9;
                case '2024':
                    return itemDate.getFullYear() === 2024;
                case '2023':
                    return itemDate.getFullYear() === 2023;
                default:
                    return true;
            }
        });
    }

    static filterByCrimeType(data, crimeType) {
        if (crimeType === 'all') return data;

        return data.filter(item => {
            const type = item.crime_type || item.type;
            return type === crimeType;
        });
    }

    static filterByTimeOfDay(data, timeOfDay) {
        if (timeOfDay === 'all') return data;

        return data.filter(item => {
            const time = item.time || item.created_at;
            if (!time) return true;

            if (timeOfDay === 'day') {
                return TimeProcessor.getTimeOfDay(time) === 'morning' ||
                    TimeProcessor.getTimeOfDay(time) === 'afternoon';
            }
            if (timeOfDay === 'night') {
                return TimeProcessor.getTimeOfDay(time) === 'evening' ||
                    TimeProcessor.getTimeOfDay(time) === 'night';
            }

            return TimeProcessor.getTimeOfDay(time) === timeOfDay;
        });
    }

    static filterByNarcoOnly(data, narcoOnly) {
        if (!narcoOnly) return data;

        return data.filter(item => {
            const type = item.crime_type || item.type;
            return type === 'drugs' ||
                (item.description && item.description.toLowerCase().includes('наркотик'));
        });
    }

    static applyAllFilters(data, filters) {
        let filtered = data;

        filtered = this.filterByPeriod(filtered, filters.period);
        filtered = this.filterByCrimeType(filtered, filters.crimeType);
        filtered = this.filterByTimeOfDay(filtered, filters.timeOfDay);
        filtered = this.filterByNarcoOnly(filtered, filters.narcoOnly);

        return filtered;
    }
}

// Статистический анализ
export class StatsCalculator {
    static calculateTrend(currentData, previousData) {
        if (!previousData || previousData.length === 0) return 0;

        const currentCount = currentData.length;
        const previousCount = previousData.length;

        return ((currentCount - previousCount) / previousCount) * 100;
    }

    static calculateHotspots(hexData, threshold = 0.8) {
        const maxCrimes = Math.max(...hexData.map(hex => hex.crimeCount));

        return hexData
            .filter(hex => hex.crimeCount / maxCrimes >= threshold)
            .sort((a, b) => b.crimeCount - a.crimeCount);
    }

    static getTopCrimeTypes(data, limit = 5) {
        const typeCounts = data.reduce((acc, item) => {
            const type = item.crime_type || item.type || 'unknown';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(typeCounts)
            .map(([type, count]) => ({
                type,
                label: CRIME_TYPES[type] || type,
                count,
                percentage: (count / data.length) * 100
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    static getDailyStats(data) {
        const dailyStats = data.reduce((acc, item) => {
            const date = (item.date || item.created_at)?.split('T')[0];
            if (date) {
                acc[date] = (acc[date] || 0) + 1;
            }
            return acc;
        }, {});

        return Object.entries(dailyStats)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    static getTimeDistribution(data) {
        const timeStats = data.reduce((acc, item) => {
            const time = item.time || item.created_at;
            if (time) {
                const timeOfDay = TimeProcessor.getTimeOfDay(time);
                acc[timeOfDay] = (acc[timeOfDay] || 0) + 1;
            }
            return acc;
        }, {});

        return Object.entries(TIME_PERIODS).map(([key, period]) => ({
            period: key,
            label: period.label,
            count: timeStats[key] || 0,
            percentage: ((timeStats[key] || 0) / data.length) * 100
        }));
    }

    static getDistrictStats(data) {
        const districtStats = data.reduce((acc, item) => {
            const district = item.district || 'Неизвестно';
            acc[district] = (acc[district] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(districtStats)
            .map(([district, count]) => ({
                district,
                count,
                percentage: (count / data.length) * 100
            }))
            .sort((a, b) => b.count - a.count);
    }
}

// Экспорт данных
export class DataExporter {
    static exportToCSV(data, filename = 'crime_data.csv') {
        if (!data || data.length === 0) return;

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header =>
                    JSON.stringify(row[header] || '')
                ).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(url);
    }

    static exportToJSON(data, filename = 'crime_data.json') {
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(url);
    }
}

// Валидация данных
export class DataValidator {
    static validateCrimeData(data) {
        const errors = [];

        if (!Array.isArray(data)) {
            errors.push('Данные должны быть массивом');
            return { isValid: false, errors };
        }

        data.forEach((item, index) => {
            if (!item.id) {
                errors.push(`Запись ${index}: отсутствует ID`);
            }

            if (!item.date && !item.created_at) {
                errors.push(`Запись ${index}: отсутствует дата`);
            }

            if (!item.latitude || !item.longitude) {
                errors.push(`Запись ${index}: отсутствуют координаты`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
            validCount: data.length - errors.length,
            totalCount: data.length
        };
    }

    static sanitizeData(data) {
        return data.filter(item => {
            return item.id &&
                (item.date || item.created_at) &&
                item.latitude &&
                item.longitude;
        }).map(item => ({
            ...item,
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
            date: item.date || item.created_at
        }));
    }
}