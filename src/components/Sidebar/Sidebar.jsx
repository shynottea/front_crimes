import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar = ({ filters, onFilterChange, onGenerateReport }) => {
    return (
        <div className={styles.sidebar}>
            <h2 className={styles.title}>
                <span className={styles.icon}>Аналитика преступности️</span>
            </h2>

            <div className={styles.filterSection}>
                <label>Период</label>
                <select
                    value={filters.period}
                    onChange={(e) => onFilterChange('period', e.target.value)}
                >
                    <option value="2024-q4">IV квартал 2024</option>
                    <option value="2024-q3">III квартал 2024</option>
                    <option value="2024-q2">II квартал 2024</option>
                    <option value="2024-q1">I квартал 2024</option>
                </select>
            </div>

            <div className={styles.filterSection}>
                <label>Тип преступлений</label>
                <select
                    value={filters.crimeType}
                    onChange={(e) => onFilterChange('crimeType', e.target.value)}
                >
                    <option value="all">Все типы</option>
                    <option value="theft">Кражи</option>
                    <option value="robbery">Грабежи</option>
                    <option value="assault">Нападения</option>
                    <option value="fraud">Мошенничество</option>
                    <option value="vandalism">Вандализм</option>
                    <option value="drugs">Наркопреступления</option>
                </select>
            </div>

            <div className={styles.filterSection}>
                <label>Время суток</label>
                <select
                    value={filters.timeOfDay}
                    onChange={(e) => onFilterChange('timeOfDay', e.target.value)}
                >
                    <option value="all">Весь день</option>
                    <option value="day">День (06:00 - 18:00)</option>
                    <option value="night">Ночь (18:00 - 06:00)</option>
                </select>
            </div>

            <div className={styles.filterSection}>
                <label>Дополнительные фильтры</label>
                <div className={styles.checkboxGroup}>
                    <input
                        type="checkbox"
                        id="narcoCheck"
                        checked={filters.narcoOnly}
                        onChange={(e) => onFilterChange('narcoOnly', e.target.checked)}
                    />
                    <label htmlFor="narcoCheck">Только наркопреступления</label>
                </div>
            </div>

            <div className={styles.filterSection}>
                <label>Тип визуализации</label>
                <div className={styles.layerSelector}>
                    <button
                        className={`${styles.layerBtn} ${filters.visualization === 'heat' ? styles.active : ''}`}
                        onClick={() => onFilterChange('visualization', 'heat')}
                    >
                        Тепловая
                    </button>
                    <button
                        className={`${styles.layerBtn} ${filters.visualization === 'cluster' ? styles.active : ''}`}
                        onClick={() => onFilterChange('visualization', 'cluster')}
                    >
                        Кластеры
                    </button>
                    <button
                        className={`${styles.layerBtn} ${filters.visualization === 'points' ? styles.active : ''}`}
                        onClick={() => onFilterChange('visualization', 'points')}
                    >
                        Точки
                    </button>
                </div>
            </div>

            <button className={styles.generateBtn} onClick={onGenerateReport}>
                <span>📊</span> Сформировать рекомендации
            </button>
        </div>
    );
};

export default Sidebar;