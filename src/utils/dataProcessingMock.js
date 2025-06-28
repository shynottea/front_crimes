// utils/dataProcessingMock.js

// Мок данные для разработки (заменится на реальные данные из API)
export const MOCK_CRIME_DATA = [
    // Данные за декабрь 2024 (больше данных с разными датами)
    {
        id: 1,
        crime_type: 'theft',
        date: '2024-12-01T10:30:00Z',
        latitude: 43.238493,
        longitude: 76.889440,
        district: 'Медеуский',
        description: 'Кража мобильного телефона',
        hex_id: 'hex_001'
    },
    {
        id: 2,
        crime_type: 'theft',
        date: '2024-12-01T14:15:00Z',
        latitude: 43.245678,
        longitude: 76.895123,
        district: 'Бостандыкский',
        description: 'Кража из автомобиля',
        hex_id: 'hex_002'
    },
    {
        id: 3,
        crime_type: 'robbery',
        date: '2024-12-01T20:45:00Z',
        latitude: 43.252341,
        longitude: 76.901234,
        district: 'Ауэзовский',
        description: 'Грабеж на улице',
        hex_id: 'hex_003'
    },
    {
        id: 4,
        crime_type: 'drugs',
        date: '2024-12-02T16:20:00Z',
        latitude: 43.240987,
        longitude: 76.887654,
        district: 'Алмалинский',
        description: 'Незаконный оборот наркотиков',
        hex_id: 'hex_001'
    },
    {
        id: 5,
        crime_type: 'theft',
        date: '2024-12-02T11:30:00Z',
        latitude: 43.248765,
        longitude: 76.892341,
        district: 'Медеуский',
        description: 'Кража велосипеда',
        hex_id: 'hex_004'
    },
    {
        id: 6,
        crime_type: 'assault',
        date: '2024-12-02T13:45:00Z',
        latitude: 43.255432,
        longitude: 76.898765,
        district: 'Жетысуский',
        description: 'Нападение на прохожего',
        hex_id: 'hex_005'
    },
    {
        id: 7,
        crime_type: 'fraud',
        date: '2024-12-03T09:15:00Z',
        latitude: 43.243210,
        longitude: 76.885432,
        district: 'Турксибский',
        description: 'Мошенничество с картами',
        hex_id: 'hex_006'
    },
    {
        id: 8,
        crime_type: 'theft',
        date: '2024-12-03T22:30:00Z',
        latitude: 43.250123,
        longitude: 76.894567,
        district: 'Наурызбайский',
        description: 'Квартирная кража',
        hex_id: 'hex_002'
    },
    {
        id: 9,
        crime_type: 'drugs',
        date: '2024-12-03T15:20:00Z',
        latitude: 43.247890,
        longitude: 76.891234,
        district: 'Алатауский',
        description: 'Хранение наркотиков',
        hex_id: 'hex_007'
    },
    {
        id: 10,
        crime_type: 'vandalism',
        date: '2024-12-04T18:45:00Z',
        latitude: 43.241567,
        longitude: 76.888901,
        district: 'Медеуский',
        description: 'Вандализм в парке',
        hex_id: 'hex_001'
    },
    {
        id: 11,
        crime_type: 'theft',
        date: '2024-12-04T12:00:00Z',
        latitude: 43.239876,
        longitude: 76.890123,
        district: 'Медеуский',
        description: 'Кража сумки',
        hex_id: 'hex_001'
    },
    {
        id: 12,
        crime_type: 'assault',
        date: '2024-12-04T14:30:00Z',
        latitude: 43.246543,
        longitude: 76.893456,
        district: 'Бостандыкский',
        description: 'Драка в баре',
        hex_id: 'hex_002'
    },
    {
        id: 13,
        crime_type: 'theft',
        date: '2024-12-05T20:15:00Z',
        latitude: 43.253210,
        longitude: 76.899876,
        district: 'Ауэзовский',
        description: 'Кража из магазина',
        hex_id: 'hex_003'
    },
    {
        id: 14,
        crime_type: 'fraud',
        date: '2024-12-05T23:45:00Z',
        latitude: 43.245123,
        longitude: 76.887890,
        district: 'Алмалинский',
        description: 'Интернет мошенничество',
        hex_id: 'hex_004'
    },
    {
        id: 15,
        crime_type: 'drugs',
        date: '2024-12-05T16:30:00Z',
        latitude: 43.251789,
        longitude: 76.896543,
        district: 'Жетысуский',
        description: 'Распространение наркотиков',
        hex_id: 'hex_005'
    },
    {
        id: 16,
        crime_type: 'theft',
        date: '2024-12-06T10:00:00Z',
        latitude: 43.242345,
        longitude: 76.888123,
        district: 'Турксибский',
        description: 'Кража телефона',
        hex_id: 'hex_006'
    },
    {
        id: 17,
        crime_type: 'robbery',
        date: '2024-12-06T19:30:00Z',
        latitude: 43.249876,
        longitude: 76.894321,
        district: 'Алатауский',
        description: 'Ограбление прохожего',
        hex_id: 'hex_007'
    },
    {
        id: 18,
        crime_type: 'assault',
        date: '2024-12-07T21:15:00Z',
        latitude: 43.238901,
        longitude: 76.889567,
        district: 'Медеуский',
        description: 'Нападение у метро',
        hex_id: 'hex_001'
    },
    {
        id: 19,
        crime_type: 'theft',
        date: '2024-12-07T13:45:00Z',
        latitude: 43.246789,
        longitude: 76.892678,
        district: 'Бостандыкский',
        description: 'Кража кошелька',
        hex_id: 'hex_002'
    },
    {
        id: 20,
        crime_type: 'vandalism',
        date: '2024-12-08T17:20:00Z',
        latitude: 43.252456,
        longitude: 76.900123,
        district: 'Ауэзовский',
        description: 'Граффити на здании',
        hex_id: 'hex_003'
    },
    {
        id: 21,
        crime_type: 'fraud',
        date: '2024-12-08T11:10:00Z',
        latitude: 43.240678,
        longitude: 76.887345,
        district: 'Алмалинский',
        description: 'Телефонное мошенничество',
        hex_id: 'hex_004'
    },
    {
        id: 22,
        crime_type: 'theft',
        date: '2024-12-09T14:55:00Z',
        latitude: 43.248234,
        longitude: 76.891789,
        district: 'Жетысуский',
        description: 'Кража из офиса',
        hex_id: 'hex_005'
    },
    {
        id: 23,
        crime_type: 'drugs',
        date: '2024-12-09T22:40:00Z',
        latitude: 43.243567,
        longitude: 76.885678,
        district: 'Турксибский',
        description: 'Торговля наркотиками',
        hex_id: 'hex_006'
    },
    {
        id: 24,
        crime_type: 'assault',
        date: '2024-12-10T16:25:00Z',
        latitude: 43.247123,
        longitude: 76.890456,
        district: 'Алатауский',
        description: 'Избиение в подъезде',
        hex_id: 'hex_007'
    },
    {
        id: 25,
        crime_type: 'theft',
        date: '2024-12-10T12:30:00Z',
        latitude: 43.239456,
        longitude: 76.888789,
        district: 'Медеуский',
        description: 'Кража автомобиля',
        hex_id: 'hex_001'
    },
    // Добавим данные за ноябрь для фильтра "III квартал"
    {
        id: 26,
        crime_type: 'theft',
        date: '2024-11-15T12:00:00Z',
        latitude: 43.239876,
        longitude: 76.890123,
        district: 'Медеуский',
        description: 'Кража велосипеда',
        hex_id: 'hex_001'
    },
    {
        id: 27,
        crime_type: 'fraud',
        date: '2024-11-20T14:30:00Z',
        latitude: 43.246543,
        longitude: 76.893456,
        district: 'Бостандыкский',
        description: 'Интернет-мошенничество',
        hex_id: 'hex_002'
    },
    // Данные за октябрь
    {
        id: 28,
        crime_type: 'robbery',
        date: '2024-10-10T20:15:00Z',
        latitude: 43.253210,
        longitude: 76.899876,
        district: 'Ауэзовский',
        description: 'Ограбление магазина',
        hex_id: 'hex_003'
    },
    {
        id: 29,
        crime_type: 'drugs',
        date: '2024-10-25T23:45:00Z',
        latitude: 43.245123,
        longitude: 76.887890,
        district: 'Алмалинский',
        description: 'Распространение наркотиков',
        hex_id: 'hex_004'
    },
    // Данные за сентябрь
    {
        id: 30,
        crime_type: 'vandalism',
        date: '2024-09-30T16:30:00Z',
        latitude: 43.251789,
        longitude: 76.896543,
        district: 'Жетысуский',
        description: 'Граффити на здании',
        hex_id: 'hex_005'
    },
    {
        id: 31,
        crime_type: 'vandalism',
        date: '2024-01-30T16:30:00Z',
        latitude: 43.251789,
        longitude: 76.896543,
        district: 'Жетысуский',
        description: 'Граффити на здании',
        hex_id: 'hex_005'
    },
    {
        id: 32,
        crime_type: 'drugs',
        date: '2024-2-25T23:45:00Z',
        latitude: 43.245123,
        longitude: 76.887890,
        district: 'Алмалинский',
        description: 'Распространение наркотиков',
        hex_id: 'hex_004'
    },
    {
        id: 33,
        crime_type: 'drugs',
        date: '2024-5-25T23:45:00Z',
        latitude: 43.245123,
        longitude: 76.887890,
        district: 'Алмалинский',
        description: 'Распространение наркотиков',
        hex_id: 'hex_004'
    },
];

export const MOCK_HEXAGONS = [
    {
        id: 'hex_001',
        lat: 43.238493,
        lng: 76.889440,
        district: 'Медеуский',
        address: 'ул. Абая, 150'
    },
    {
        id: 'hex_002',
        lat: 43.245678,
        lng: 76.895123,
        district: 'Бостандыкский',
        address: 'пр. Достык, 200'
    },
    {
        id: 'hex_003',
        lat: 43.252341,
        lng: 76.901234,
        district: 'Ауэзовский',
        address: 'ул. Райымбека, 300'
    },
    {
        id: 'hex_004',
        lat: 43.240987,
        lng: 76.887654,
        district: 'Алмалинский',
        address: 'ул. Панфилова, 100'
    },
    {
        id: 'hex_005',
        lat: 43.248765,
        lng: 76.892341,
        district: 'Жетысуский',
        address: 'ул. Момышулы, 250'
    },
    {
        id: 'hex_006',
        lat: 43.243210,
        lng: 76.885432,
        district: 'Турксибский',
        address: 'ул. Сейфуллина, 180'
    },
    {
        id: 'hex_007',
        lat: 43.247890,
        lng: 76.891234,
        district: 'Алатауский',
        address: 'мкр. Самал-2, 50'
    }
];

// Типы преступлений с переводом
export const CRIME_TYPES = {
    'theft': 'Кражи',
    'robbery': 'Грабежи',
    'assault': 'Нападения',
    'fraud': 'Мошенничество',
    'vandalism': 'Вандализм',
    'drugs': 'Наркопреступления',
    'domestic_violence': 'Домашнее насилие',
    'burglary': 'Взлом',
    'vehicle_theft': 'Угон автомобилей',
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
    'afternoon': { start: 12, end: 18, label: 'День (12:00-18:00)' },
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
            const time = item.time || item.created_at || item.date;
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

        const entries = Object.entries(dailyStats)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Если реальных данных мало, возвращаем демо-данные с правильными числами
        return entries.length > 0 ? entries : [
            { date: '2024-12-01', count: 8 },
            { date: '2024-12-02', count: 12 },
            { date: '2024-12-03', count: 6 },
            { date: '2024-12-04', count: 15 },
            { date: '2024-12-05', count: 9 },
            { date: '2024-12-06', count: 11 },
            { date: '2024-12-07', count: 7 },
            { date: '2024-12-08', count: 13 },
            { date: '2024-12-09', count: 10 },
            { date: '2024-12-10', count: 14 }
        ];
    }

    static getTimeDistribution(data) {
        const timeStats = data.reduce((acc, item) => {
            const time = item.time || item.created_at || item.date;
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