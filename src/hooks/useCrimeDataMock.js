// hooks/useCrimeDataMock.js
import { useState, useEffect, useCallback } from 'react';
import {
    MOCK_CRIME_DATA,
    MOCK_HEXAGONS,
    DataFilter,
    StatsCalculator,
    DataValidator
} from '../utils/dataProcessingMock';

// Флаг для переключения между мок данными и реальным API
const USE_MOCK_DATA = true; // Измените на false когда API будет доступен

export const useCrimeData = (filters = {}) => {
    const [data, setData] = useState({
        crimes: [],
        hexagons: [],
        heatmapData: [],
        timeSeriesData: [],
        crimeTypeStats: [],
        filteredData: []
    });

    const [loading, setLoading] = useState({
        crimes: false,
        hexagons: false,
        heatmap: false,
        timeSeries: false,
        crimeTypes: false
    });

    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Имитация API запроса с задержкой
    const mockApiCall = useCallback((data, delay = 800) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(data), delay);
        });
    }, []);

    // Загрузка базовых данных
    const loadBaseData = useCallback(async () => {
        setLoading(prev => ({ ...prev, crimes: true, hexagons: true }));
        setError(null);

        try {
            let crimesData, hexagonsData;

            if (USE_MOCK_DATA) {
                // Используем мок данные
                [crimesData, hexagonsData] = await Promise.all([
                    mockApiCall(MOCK_CRIME_DATA),
                    mockApiCall(MOCK_HEXAGONS)
                ]);
            } else {
                // TODO: Здесь будут реальные API вызовы
                const crimeAPI = await import('../services/api');
                [crimesData, hexagonsData] = await Promise.all([
                    crimeAPI.default.getAllCrimes(),
                    crimeAPI.default.getHexagons()
                ]);
            }

            // Валидация данных
            const validation = DataValidator.validateCrimeData(crimesData);
            if (!validation.isValid) {
                console.warn('Обнаружены проблемы с данными:', validation.errors);
            }

            const sanitizedCrimes = DataValidator.sanitizeData(crimesData);

            setData(prev => ({
                ...prev,
                crimes: sanitizedCrimes,
                hexagons: hexagonsData
            }));

            setLastUpdated(new Date());
        } catch (err) {
            setError(err.message);
            console.error('Ошибка загрузки базовых данных:', err);
        } finally {
            setLoading(prev => ({ ...prev, crimes: false, hexagons: false }));
        }
    }, [mockApiCall]);

    // Генерация данных для тепловой карты
    const generateHeatmapData = useCallback((crimes, hexagons, currentFilters) => {
        // Группируем преступления по гексагонам
        const crimesByHex = crimes.reduce((acc, crime) => {
            const hexId = crime.hex_id;
            if (hexId) {
                acc[hexId] = (acc[hexId] || 0) + 1;
            }
            return acc;
        }, {});

        // Объединяем с данными гексагонов
        return hexagons.map(hex => ({
            ...hex,
            crimeCount: crimesByHex[hex.id] || 0,
            intensity: calculateIntensity(crimesByHex[hex.id] || 0)
        }));
    }, []);

    // Вычисление интенсивности для тепловой карты
    const calculateIntensity = useCallback((crimeCount) => {
        if (crimeCount === 0) return 0;
        if (crimeCount <= 2) return 0.3;
        if (crimeCount <= 4) return 0.6;
        return 1;
    }, []);

    // Загрузка данных для тепловой карты
    const loadHeatmapData = useCallback(async (currentFilters) => {
        setLoading(prev => ({ ...prev, heatmap: true }));

        try {
            const filteredCrimes = DataFilter.applyAllFilters(data.crimes, currentFilters);
            const heatmapData = generateHeatmapData(filteredCrimes, data.hexagons, currentFilters);
            setData(prev => ({ ...prev, heatmapData }));
        } catch (err) {
            console.error('Ошибка загрузки данных тепловой карты:', err);
        } finally {
            setLoading(prev => ({ ...prev, heatmap: false }));
        }
    }, [data.crimes, data.hexagons, generateHeatmapData]);

    // Загрузка временных рядов
    const loadTimeSeriesData = useCallback(async (currentFilters) => {
        setLoading(prev => ({ ...prev, timeSeries: true }));

        try {
            const filteredCrimes = DataFilter.applyAllFilters(data.crimes, currentFilters);
            const timeSeriesData = StatsCalculator.getDailyStats(filteredCrimes);
            setData(prev => ({ ...prev, timeSeriesData }));
        } catch (err) {
            console.error('Ошибка загрузки временных рядов:', err);
        } finally {
            setLoading(prev => ({ ...prev, timeSeries: false }));
        }
    }, [data.crimes]);

    // Загрузка статистики по типам преступлений
    const loadCrimeTypeStats = useCallback(async (currentFilters) => {
        setLoading(prev => ({ ...prev, crimeTypes: true }));

        try {
            const filteredCrimes = DataFilter.applyAllFilters(data.crimes, currentFilters);
            const crimeTypeStats = StatsCalculator.getTopCrimeTypes(filteredCrimes);
            setData(prev => ({ ...prev, crimeTypeStats }));
        } catch (err) {
            console.error('Ошибка загрузки статистики типов:', err);
        } finally {
            setLoading(prev => ({ ...prev, crimeTypes: false }));
        }
    }, [data.crimes]);

    // Применение фильтров к данным
    const applyFilters = useCallback((crimesData, currentFilters) => {
        const filteredData = DataFilter.applyAllFilters(crimesData, currentFilters);
        setData(prev => ({ ...prev, filteredData }));
        return filteredData;
    }, []);

    // Обновление всех данных при изменении фильтров
    const updateData = useCallback(async (currentFilters) => {
        if (data.crimes.length === 0) return;

        // Применяем фильтры к основным данным
        const filtered = applyFilters(data.crimes, currentFilters);

        // Загружаем дополнительные данные параллельно
        await Promise.all([
            loadHeatmapData(currentFilters),
            loadTimeSeriesData(currentFilters),
            loadCrimeTypeStats(currentFilters)
        ]);
    }, [data.crimes, applyFilters, loadHeatmapData, loadTimeSeriesData, loadCrimeTypeStats]);

    // Первоначальная загрузка данных
    useEffect(() => {
        loadBaseData();
    }, [loadBaseData]);

    // Обновление при изменении фильтров
    useEffect(() => {
        if (data.crimes.length > 0) {
            updateData(filters);
        }
    }, [filters, updateData]);

    // Получение статистики
    const getStats = useCallback(() => {
        const filtered = data.filteredData;
        if (filtered.length === 0) return null;

        return {
            totalCrimes: filtered.length,
            topCrimeTypes: StatsCalculator.getTopCrimeTypes(filtered),
            timeDistribution: StatsCalculator.getTimeDistribution(filtered),
            districtStats: StatsCalculator.getDistrictStats(filtered),
            dailyStats: StatsCalculator.getDailyStats(filtered)
        };
    }, [data.filteredData]);

    // Получение горячих точек
    const getHotspots = useCallback((threshold = 0.8) => {
        return StatsCalculator.calculateHotspots(data.heatmapData, threshold);
    }, [data.heatmapData]);

    // Получение данных для конкретного района
    const getDistrictData = useCallback(async (districtName) => {
        try {
            const filteredData = data.heatmapData.filter(hex =>
                hex.district?.toLowerCase().includes(districtName.toLowerCase())
            );
            return filteredData;
        } catch (err) {
            console.error('Ошибка получения данных района:', err);
            return [];
        }
    }, [data.heatmapData]);

    // Принудительное обновление
    const forceRefresh = useCallback(async () => {
        // Очистка кеша (если используется)
        await loadBaseData();
        await updateData(filters);
    }, [loadBaseData, updateData, filters]);

    // Экспорт данных
    const exportData = useCallback((format = 'json') => {
        const { DataExporter } = require('../utils/dataProcessingMock');

        if (format === 'csv') {
            DataExporter.exportToCSV(data.filteredData, 'crime_analytics.csv');
        } else {
            DataExporter.exportToJSON({
                filters,
                data: data.filteredData,
                stats: getStats(),
                exportDate: new Date().toISOString()
            }, 'crime_analytics.json');
        }
    }, [data.filteredData, filters, getStats]);

    return {
        // Данные
        ...data,

        // Состояние загрузки
        loading: Object.values(loading).some(Boolean),
        loadingDetails: loading,

        // Ошибки
        error,

        // Метаданные
        lastUpdated,

        // Методы
        getStats,
        getHotspots,
        getDistrictData,
        forceRefresh,
        exportData,

        // Статистика
        stats: getStats()
    };
};

// Дополнительный хук для работы с конкретными типами данных
export const useHeatmapData = (filters) => {
    const [heatmapData, setHeatmapData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Для мок данных используем локальную обработку
                const { MOCK_CRIME_DATA, MOCK_HEXAGONS, DataFilter } = await import('../utils/dataProcessingMock');
                const filteredCrimes = DataFilter.applyAllFilters(MOCK_CRIME_DATA, filters);

                // Группируем по гексагонам
                const crimesByHex = filteredCrimes.reduce((acc, crime) => {
                    const hexId = crime.hex_id;
                    if (hexId) {
                        acc[hexId] = (acc[hexId] || 0) + 1;
                    }
                    return acc;
                }, {});

                const data = MOCK_HEXAGONS.map(hex => ({
                    ...hex,
                    crimeCount: crimesByHex[hex.id] || 0,
                    intensity: crimesByHex[hex.id] || 0 > 0 ? Math.min(1, (crimesByHex[hex.id] || 0) / 5) : 0
                }));

                setHeatmapData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [filters]);

    return { heatmapData, loading, error };
};

// Хук для работы с временными рядами
export const useTimeSeriesData = (filters) => {
    const [timeSeriesData, setTimeSeriesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                const { MOCK_CRIME_DATA, DataFilter, StatsCalculator } = await import('../utils/dataProcessingMock');
                const filteredCrimes = DataFilter.applyAllFilters(MOCK_CRIME_DATA, filters);
                const data = StatsCalculator.getDailyStats(filteredCrimes);
                setTimeSeriesData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [filters]);

    return { timeSeriesData, loading, error };
};