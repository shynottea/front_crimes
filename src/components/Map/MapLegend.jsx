import React from 'react';
import styles from './Map.module.css';

const MapLegend = () => {
    const legendItems = [
        { color: '#10b981', label: 'Низкий (0-10)', range: 'low' },
        { color: '#f59e0b', label: 'Средний (11-25)', range: 'medium' },
        { color: '#ef4444', label: 'Высокий (26+)', range: 'high' }
    ];

    return (
        <div className={styles.mapLegend}>
            <div className={styles.legendTitle}>Уровень преступности</div>
            <div className={styles.legendItems}>
                {legendItems.map((item, index) => (
                    <div key={index} className={styles.legendItem}>
                        <div
                            className={styles.legendColor}
                            style={{ backgroundColor: item.color }}
                        />
                        <span className={styles.legendLabel}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MapLegend;