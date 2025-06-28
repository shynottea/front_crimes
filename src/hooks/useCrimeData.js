// hooks/useCrimeData.js
import { useState, useEffect, useCallback } from 'react';
import crimeAPI from '../services/api';
import { DataFilter, StatsCalculator, DataValidator } from '../utils/dataProcessing';

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

    // Загрузка базовых данных
    const loadBaseData = useCallback(async () => {
        setLoading(prev => ({ ...prev, crimes: true, hexagons: true }));
        setError(null);

        try {
            const [crimesData, hexagonsData] = await Promise.all([
                crimeAPI.getAllCrimes(),
                crimeAPI.getHexagons()
            ]);

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
    }, []);

    // Загрузка данных для тепловой карты
    const loadHeatmapData = useCallback(async (currentFilters) => {
        setLoading(prev => ({ ...prev, heatmap: true }));

        try {
            const heatmapData = await crimeAPI.getHeatmapData(currentFilters);
            setData(prev => ({ ...prev, heatmapData }));
        } catch (err) {
            console.error('Ошибка загрузки данных тепловой карты:', err);
        } finally {
            setLoading(prev => ({ ...prev, heatmap: false }));
        }
    }, []);

    // Загрузка временных рядов
    const loadTimeSeriesData = useCallback(async (currentFilters) => {
        setLoading(prev => ({ ...prev, timeSeries: true }));

        try {
            const timeSeriesData = await crimeAPI.getTimeSeriesData(currentFilters);
            setData(prev => ({ ...prev, timeSeriesData }));
        } catch (err) {
            console.error('Ошибка загрузки временных рядов:', err);
        } finally {
            setLoading(prev => ({ ...prev, timeSeries: false }));
        }
    }, []);

    // Загрузка статистики по типам преступлений
    const loadCrimeTypeStats = useCallback(async (currentFilters) => {
        setLoading(prev => ({ ...prev, crimeTypes: true }));

        try {
            const crimeTypeStats = await crimeAPI.getCrimeTypeStats(currentFilters);
            setData(prev => ({ ...prev, crimeTypeStats }));
        } catch (err) {
            console.error('Ошибка загрузки статистики типов:', err);
        } finally {
            setLoading(prev => ({ ...prev, crimeTypes: false }));
        }
    }, []);

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
            return await crimeAPI.getDistrictData(districtName, filters);
        } catch (err) {
            console.error('Ошибка получения данных района:', err);
            return [];
        }
    }, [filters]);

    // Принудительное обновление
    const forceRefresh = useCallback(async () => {
        crimeAPI.clearCache();
        await loadBaseData();
        await updateData(filters);
    }, [loadBaseData, updateData, filters]);

    // Экспорт данных
    const exportData = useCallback((format = 'json') => {
        const { DataExporter } = require('../utils/dataProcessing');

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
                const data = await crimeAPI.getHeatmapData(filters);
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
                const data = await crimeAPI.getTimeSeriesData(filters);
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

// Хук для кешированных данных
export const useCachedCrimeData = (cacheKey, fetcher, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await crimeAPI.getCachedData(cacheKey, fetcher);
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [cacheKey, ...dependencies]);

    return { data, loading, error };
};