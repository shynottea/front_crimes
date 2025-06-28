// hooks/useFilters.js
import { useState, useCallback, useEffect } from 'react';
import { TimeProcessor } from '../utils/dataProcessing';

const DEFAULT_FILTERS = {
    period: '2024-q4',
    crimeType: 'all',
    timeOfDay: 'all',
    narcoOnly: false,
    visualization: 'heat',
    district: 'all',
    minCrimes: 0,
    maxCrimes: 1000,
    dateRange: {
        start: null,
        end: null
    }
};

export const useFilters = (initialFilters = {}) => {
    const [filters, setFilters] = useState({
        ...DEFAULT_FILTERS,
        ...initialFilters
    });

    const [filterHistory, setFilterHistory] = useState([DEFAULT_FILTERS]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Обновление одного фильтра
    const updateFilter = useCallback((filterName, value) => {
        setFilters(prev => {
            const newFilters = {
                ...prev,
                [filterName]: value
            };

            // Сохраняем в историю
            setFilterHistory(prevHistory => {
                const newHistory = prevHistory.slice(0, historyIndex + 1);
                newHistory.push(newFilters);
                return newHistory;
            });
            setHistoryIndex(prev => prev + 1);

            return newFilters;
        });
    }, [historyIndex]);

    // Обновление нескольких фильтров одновременно
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => {
            const updatedFilters = {
                ...prev,
                ...newFilters
            };

            // Сохраняем в историю
            setFilterHistory(prevHistory => {
                const newHistory = prevHistory.slice(0, historyIndex + 1);
                newHistory.push(updatedFilters);
                return newHistory;
            });
            setHistoryIndex(prev => prev + 1);

            return updatedFilters;
        });
    }, [historyIndex]);

    // Сброс фильтров
    const resetFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
        setFilterHistory([DEFAULT_FILTERS]);
        setHistoryIndex(0);
    }, []);

    // Отмена последнего действия
    const undoFilter = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
            setFilters(filterHistory[historyIndex - 1]);
        }
    }, [historyIndex, filterHistory]);

    // Повтор отмененного действия
    const redoFilter = useCallback(() => {
        if (historyIndex < filterHistory.length - 1) {
            setHistoryIndex(prev => prev + 1);
            setFilters(filterHistory[historyIndex + 1]);
        }
    }, [historyIndex, filterHistory]);

    // Проверка возможности отмены/повтора
    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < filterHistory.length - 1;

    // Получение активных фильтров (не равных значениям по умолчанию)
    const getActiveFilters = useCallback(() => {
        const activeFilters = {};

        Object.keys(filters).forEach(key => {
            if (filters[key] !== DEFAULT_FILTERS[key]) {
                activeFilters[key] = filters[key];
            }
        });

        return activeFilters;
    }, [filters]);

    // Получение количества активных фильтров
    const activeFiltersCount = Object.keys(getActiveFilters()).length;

    // Получение текстового описания фильтров
    const getFilterDescription = useCallback(() => {
        const descriptions = [];

        if (filters.period !== 'all') {
            descriptions.push(TimeProcessor.formatPeriod(filters.period));
        }

        if (filters.crimeType !== 'all') {
            const typeNames = {
                'theft': 'Кражи',
                'robbery': 'Грабежи',
                'assault': 'Нападения',
                'fraud': 'Мошенничество',
                'vandalism': 'Вандализм',
                'drugs': 'Наркопреступления'
            };
            descriptions.push(typeNames[filters.crimeType] || filters.crimeType);
        }

        if (filters.timeOfDay !== 'all') {
            const timeNames = {
                'day': 'День',
                'night': 'Ночь',
                'morning': 'Утро',
                'evening': 'Вечер'
            };
            descriptions.push(timeNames[filters.timeOfDay] || filters.timeOfDay);
        }

        if (filters.narcoOnly) {
            descriptions.push('Только наркопреступления');
        }

        if (filters.district !== 'all') {
            descriptions.push(`Район: ${filters.district}`);
        }

        return descriptions.length > 0 ? descriptions.join(', ') : 'Все данные';
    }, [filters]);

    // Валидация фильтров
    const validateFilters = useCallback(() => {
        const errors = [];

        if (filters.dateRange.start && filters.dateRange.end) {
            if (new Date(filters.dateRange.start) > new Date(filters.dateRange.end)) {
                errors.push('Начальная дата не может быть больше конечной');
            }
        }

        if (filters.minCrimes > filters.maxCrimes) {
            errors.push('Минимальное количество преступлений не может быть больше максимального');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }, [filters]);

    // Сохранение фильтров в localStorage
    const saveFiltersToStorage = useCallback(() => {
        try {
            localStorage.setItem('crimeAnalytics_filters', JSON.stringify(filters));
        } catch (error) {
            console.warn('Не удалось сохранить фильтры в localStorage:', error);
        }
    }, [filters]);

    // Загрузка фильтров из localStorage
    const loadFiltersFromStorage = useCallback(() => {
        try {
            const saved = localStorage.getItem('crimeAnalytics_filters');
            if (saved) {
                const parsedFilters = JSON.parse(saved);
                setFilters(prev => ({ ...prev, ...parsedFilters }));
            }
        } catch (error) {
            console.warn('Не удалось загрузить фильтры из localStorage:', error);
        }
    }, []);

    // Автосохранение фильтров
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            saveFiltersToStorage();
        }, 1000); // Сохраняем через секунду после изменения

        return () => clearTimeout(timeoutId);
    }, [filters, saveFiltersToStorage]);

    // Создание URL с параметрами фильтров
    const getFiltersURL = useCallback(() => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== DEFAULT_FILTERS[key] && value !== null && value !== '') {
                if (typeof value === 'object') {
                    params.set(key, JSON.stringify(value));
                } else {
                    params.set(key, value.toString());
                }
            }
        });

        return params.toString();
    }, [filters]);

    // Загрузка фильтров из URL
    const loadFiltersFromURL = useCallback((urlParams) => {
        const params = new URLSearchParams(urlParams);
        const urlFilters = {};

        params.forEach((value, key) => {
            try {
                // Пробуем парсить как JSON для объектов
                if (value.startsWith('{') || value.startsWith('[')) {
                    urlFilters[key] = JSON.parse(value);
                } else {
                    // Обрабатываем булевы значения
                    if (value === 'true') urlFilters[key] = true;
                    else if (value === 'false') urlFilters[key] = false;
                    else urlFilters[key] = value;
                }
            } catch {
                urlFilters[key] = value;
            }
        });

        if (Object.keys(urlFilters).length > 0) {
            updateFilters(urlFilters);
        }
    }, [updateFilters]);

    // Предустановленные наборы фильтров
    const presets = {
        'recent': {
            period: '2024-q4',
            crimeType: 'all',
            timeOfDay: 'all',
            narcoOnly: false
        },
        'narco': {
            period: '2024-q4',
            crimeType: 'drugs',
            timeOfDay: 'all',
            narcoOnly: true
        },
        'nightCrimes': {
            period: '2024-q4',
            crimeType: 'all',
            timeOfDay: 'night',
            narcoOnly: false
        },
        'theft': {
            period: '2024-q4',
            crimeType: 'theft',
            timeOfDay: 'all',
            narcoOnly: false
        }
    };

    const applyPreset = useCallback((presetName) => {
        if (presets[presetName]) {
            updateFilters(presets[presetName]);
        }
    }, [updateFilters]);

    return {
        // Текущие фильтры
        filters,

        // Методы обновления
        updateFilter,
        updateFilters,
        resetFilters,

        // История фильтров
        undoFilter,
        redoFilter,
        canUndo,
        canRedo,

        // Информация о фильтрах
        activeFiltersCount,
        getActiveFilters,
        getFilterDescription,

        // Валидация
        validateFilters,

        // Работа с хранилищем
        saveFiltersToStorage,
        loadFiltersFromStorage,

        // Работа с URL
        getFiltersURL,
        loadFiltersFromURL,

        // Предустановки
        presets,
        applyPreset,

        // Константы
        DEFAULT_FILTERS
    };
};