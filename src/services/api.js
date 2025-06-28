// services/api.js
class CrimeAnalyticsAPI {
    constructor() {
        this.baseURL = 'https://admin.smartalmaty.kz/criminalism';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 минут
    }

    // Базовый метод для HTTP запросов
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error for ${endpoint}:`, error);
            throw error;
        }
    }

    // Получение данных с кешированием
    async getCachedData(key, fetcher) {
        const cached = this.cache.get(key);

        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        const data = await fetcher();
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });

        return data;
    }

    // Получение всех гексагональных зон
    async getHexagons() {
        return this.getCachedData('hexagons', async () => {
            return await this.makeRequest('/hexes/get_hexes/');
        });
    }

    // Получение данных о преступлениях с пагинацией
    async getCrimes(page = 1, filters = {}) {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            ...filters
        });

        const cacheKey = `crimes_${queryParams.toString()}`;

        return this.getCachedData(cacheKey, async () => {
            return await this.makeRequest(`/crimes/?${queryParams}`);
        });
    }

    // Получение всех преступлений (постранично)
    async getAllCrimes(filters = {}) {
        const allCrimes = [];
        let page = 1;
        let hasNext = true;

        while (hasNext) {
            try {
                const response = await this.getCrimes(page, filters);
                allCrimes.push(...response.results);

                hasNext = !!response.next;
                page++;

                // Добавляем небольшую задержку между запросами
                if (hasNext) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            } catch (error) {
                console.error(`Error fetching page ${page}:`, error);
                break;
            }
        }

        return allCrimes;
    }

    // Получение метаданных гексагонов
    async getHexMetadata() {
        return this.getCachedData('hex_metadata', async () => {
            return await this.makeRequest('/hexes/');
        });
    }

    // Получение статистики по периоду
    async getCrimeStatistics(startDate, endDate, crimeType = null) {
        const filters = {
            start_date: startDate,
            end_date: endDate
        };

        if (crimeType && crimeType !== 'all') {
            filters.crime_type = crimeType;
        }

        return await this.getAllCrimes(filters);
    }

    // Получение данных для тепловой карты
    async getHeatmapData(filters = {}) {
        const cacheKey = `heatmap_${JSON.stringify(filters)}`;

        return this.getCachedData(cacheKey, async () => {
            const [hexagons, crimes] = await Promise.all([
                this.getHexagons(),
                this.getAllCrimes(filters)
            ]);

            // Группируем преступления по гексагонам
            const crimesByHex = crimes.reduce((acc, crime) => {
                const hexId = crime.hex_id || crime.location?.hex_id;
                if (hexId) {
                    acc[hexId] = (acc[hexId] || 0) + 1;
                }
                return acc;
            }, {});

            // Объединяем с данными гексагонов
            return hexagons.map(hex => ({
                ...hex,
                crimeCount: crimesByHex[hex.id] || 0,
                intensity: this.calculateIntensity(crimesByHex[hex.id] || 0)
            }));
        });
    }

    // Вычисление интенсивности для тепловой карты
    calculateIntensity(crimeCount) {
        if (crimeCount === 0) return 0;
        if (crimeCount <= 10) return 0.3;
        if (crimeCount <= 25) return 0.6;
        return 1;
    }

    // Получение временных рядов
    async getTimeSeriesData(filters = {}) {
        const crimes = await this.getAllCrimes(filters);

        const timeSeries = crimes.reduce((acc, crime) => {
            const date = crime.date ? crime.date.split('T')[0] : crime.created_at?.split('T')[0];
            if (date) {
                acc[date] = (acc[date] || 0) + 1;
            }
            return acc;
        }, {});

        return Object.entries(timeSeries)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Получение статистики по типам преступлений
    async getCrimeTypeStats(filters = {}) {
        const crimes = await this.getAllCrimes(filters);

        const typeStats = crimes.reduce((acc, crime) => {
            const type = crime.crime_type || crime.type || 'unknown';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(typeStats)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count);
    }

    // Очистка кеша
    clearCache() {
        this.cache.clear();
    }

    // Получение данных для конкретного района
    async getDistrictData(districtName, filters = {}) {
        const allData = await this.getHeatmapData(filters);
        return allData.filter(hex =>
            hex.district?.toLowerCase().includes(districtName.toLowerCase())
        );
    }
}

// Создаем единственный экземпляр API
const crimeAPI = new CrimeAnalyticsAPI();

export default crimeAPI;