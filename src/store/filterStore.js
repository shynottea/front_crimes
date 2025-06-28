// store/filterStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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

const DEFAULT_UI_STATE = {
    sidebarCollapsed: false,
    modalOpen: false,
    currentModal: null,
    mapLoaded: false,
    chartsLoaded: false,
    notifications: [],
    theme: 'dark'
};

export const useFilterStore = create(
    persist(
        (set, get) => ({
            // Состояние фильтров
            filters: DEFAULT_FILTERS,
            filterHistory: [DEFAULT_FILTERS],
            historyIndex: 0,

            // Состояние UI
            ui: DEFAULT_UI_STATE,

            // Состояние данных
            dataCache: {
                crimes: null,
                hexagons: null,
                lastUpdated: null,
                isLoading: false
            },

            // Состояние загрузки
            loading: {
                crimes: false,
                hexagons: false,
                heatmap: false,
                charts: false
            },

            // Ошибки
            errors: [],

            // === ДЕЙСТВИЯ С ФИЛЬТРАМИ ===

            updateFilter: (filterName, value) => {
                const currentFilters = get().filters;
                const newFilters = { ...currentFilters, [filterName]: value };

                set((state) => {
                    // Обновляем историю
                    const newHistory = state.filterHistory.slice(0, state.historyIndex + 1);
                    newHistory.push(newFilters);

                    return {
                        filters: newFilters,
                        filterHistory: newHistory,
                        historyIndex: state.historyIndex + 1
                    };
                });
            },

            updateFilters: (newFilters) => {
                const currentFilters = get().filters;
                const updatedFilters = { ...currentFilters, ...newFilters };

                set((state) => {
                    const newHistory = state.filterHistory.slice(0, state.historyIndex + 1);
                    newHistory.push(updatedFilters);

                    return {
                        filters: updatedFilters,
                        filterHistory: newHistory,
                        historyIndex: state.historyIndex + 1
                    };
                });
            },

            resetFilters: () => {
                set({
                    filters: DEFAULT_FILTERS,
                    filterHistory: [DEFAULT_FILTERS],
                    historyIndex: 0
                });
            },

            undoFilter: () => {
                const { historyIndex, filterHistory } = get();
                if (historyIndex > 0) {
                    set({
                        historyIndex: historyIndex - 1,
                        filters: filterHistory[historyIndex - 1]
                    });
                }
            },

            redoFilter: () => {
                const { historyIndex, filterHistory } = get();
                if (historyIndex < filterHistory.length - 1) {
                    set({
                        historyIndex: historyIndex + 1,
                        filters: filterHistory[historyIndex + 1]
                    });
                }
            },

            // === ДЕЙСТВИЯ С UI ===

            toggleSidebar: () => {
                set((state) => ({
                    ui: {
                        ...state.ui,
                        sidebarCollapsed: !state.ui.sidebarCollapsed
                    }
                }));
            },

            openModal: (modalType, data = null) => {
                set((state) => ({
                    ui: {
                        ...state.ui,
                        modalOpen: true,
                        currentModal: { type: modalType, data }
                    }
                }));
            },

            closeModal: () => {
                set((state) => ({
                    ui: {
                        ...state.ui,
                        modalOpen: false,
                        currentModal: null
                    }
                }));
            },

            setMapLoaded: (loaded) => {
                set((state) => ({
                    ui: {
                        ...state.ui,
                        mapLoaded: loaded
                    }
                }));
            },

            setChartsLoaded: (loaded) => {
                set((state) => ({
                    ui: {
                        ...state.ui,
                        chartsLoaded: loaded
                    }
                }));
            },

            toggleTheme: () => {
                set((state) => ({
                    ui: {
                        ...state.ui,
                        theme: state.ui.theme === 'dark' ? 'light' : 'dark'
                    }
                }));
            },

            // === УВЕДОМЛЕНИЯ ===

            addNotification: (notification) => {
                const id = Date.now().toString();
                const newNotification = {
                    id,
                    timestamp: new Date(),
                    ...notification
                };

                set((state) => ({
                    ui: {
                        ...state.ui,
                        notifications: [...state.ui.notifications, newNotification]
                    }
                }));

                // Автоудаление через 5 секунд
                if (notification.autoRemove !== false) {
                    setTimeout(() => {
                        get().removeNotification(id);
                    }, 5000);
                }

                return id;
            },

            removeNotification: (id) => {
                set((state) => ({
                    ui: {
                        ...state.ui,
                        notifications: state.ui.notifications.filter(n => n.id !== id)
                    }
                }));
            },

            clearNotifications: () => {
                set((state) => ({
                    ui: {
                        ...state.ui,
                        notifications: []
                    }
                }));
            },

            // === УПРАВЛЕНИЕ ДАННЫМИ ===

            setDataCache: (data) => {
                set((state) => ({
                    dataCache: {
                        ...state.dataCache,
                        ...data,
                        lastUpdated: new Date()
                    }
                }));
            },

            clearDataCache: () => {
                set({
                    dataCache: {
                        crimes: null,
                        hexagons: null,
                        lastUpdated: null,
                        isLoading: false
                    }
                });
            },

            setLoading: (loadingType, isLoading) => {
                set((state) => ({
                    loading: {
                        ...state.loading,
                        [loadingType]: isLoading
                    }
                }));
            },

            setError: (error) => {
                const errorObj = {
                    id: Date.now().toString(),
                    message: error.message || error,
                    timestamp: new Date(),
                    stack: error.stack
                };

                set((state) => ({
                    errors: [...state.errors, errorObj]
                }));

                // Также добавляем как уведомление
                get().addNotification({
                    type: 'error',
                    title: 'Ошибка',
                    message: errorObj.message,
                    autoRemove: false
                });
            },

            clearErrors: () => {
                set({ errors: [] });
            },

            removeError: (errorId) => {
                set((state) => ({
                    errors: state.errors.filter(e => e.id !== errorId)
                }));
            },

            // === СЕЛЕКТОРЫ ===

            getActiveFilters: () => {
                const { filters } = get();
                const activeFilters = {};

                Object.keys(filters).forEach(key => {
                    if (filters[key] !== DEFAULT_FILTERS[key]) {
                        activeFilters[key] = filters[key];
                    }
                });

                return activeFilters;
            },

            getFilterDescription: () => {
                const { filters } = get();
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
                        'night': 'Ночь'
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
            },

            canUndo: () => {
                return get().historyIndex > 0;
            },

            canRedo: () => {
                const { historyIndex, filterHistory } = get();
                return historyIndex < filterHistory.length - 1;
            },

            isLoading: () => {
                const { loading } = get();
                return Object.values(loading).some(Boolean);
            },

            hasErrors: () => {
                return get().errors.length > 0;
            },

            // === ПРЕДУСТАНОВКИ ===

            applyPreset: (presetName) => {
                const presets = {
                    recent: {
                        period: '2024-q4',
                        crimeType: 'all',
                        timeOfDay: 'all',
                        narcoOnly: false
                    },
                    narco: {
                        period: '2024-q4',
                        crimeType: 'drugs',
                        timeOfDay: 'all',
                        narcoOnly: true
                    },
                    nightCrimes: {
                        period: '2024-q4',
                        crimeType: 'all',
                        timeOfDay: 'night',
                        narcoOnly: false
                    },
                    theft: {
                        period: '2024-q4',
                        crimeType: 'theft',
                        timeOfDay: 'all',
                        narcoOnly: false
                    }
                };

                if (presets[presetName]) {
                    get().updateFilters(presets[presetName]);
                }
            },

            // === ЭКСПОРТ СОСТОЯНИЯ ===

            exportState: () => {
                const state = get();
                return {
                    filters: state.filters,
                    ui: state.ui,
                    timestamp: new Date().toISOString(),
                    version: '1.0.0'
                };
            },

            importState: (importedState) => {
                if (importedState.filters) {
                    set({
                        filters: { ...DEFAULT_FILTERS, ...importedState.filters },
                        ui: { ...DEFAULT_UI_STATE, ...importedState.ui }
                    });
                }
            }
        }),
        {
            name: 'crime-analytics-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                filters: state.filters,
                ui: {
                    theme: state.ui.theme,
                    sidebarCollapsed: state.ui.sidebarCollapsed
                }
            }),
            version: 1,
            migrate: (persistedState, version) => {
                // Миграция данных при обновлении версии
                if (version === 0) {
                    return {
                        ...persistedState,
                        filters: { ...DEFAULT_FILTERS, ...persistedState.filters },
                        ui: { ...DEFAULT_UI_STATE, ...persistedState.ui }
                    };
                }
                return persistedState;
            }
        }
    )
);