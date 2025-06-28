import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Map from '../Map/Map';
import CrimeTypesChart from '../Charts/CrimeTypesChart';
import DynamicsChart from '../Charts/DynamicsChart';
import RecommendationsModal from '../Modal/RecommendationsModal';
import styles from './Layout.module.css';

const Layout = () => {
    const [filters, setFilters] = useState({
        period: '2024-q4',
        crimeType: 'all',
        timeOfDay: 'all',
        narcoOnly: false,
        visualization: 'heat'
    });

    const [showModal, setShowModal] = useState(false);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    return (
        <div className={styles.container}>
            <Sidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onGenerateReport={() => setShowModal(true)}
            />

            <div className={styles.mainContent}>
                <div className={styles.mapContainer}>
                    <Map
                        filters={filters}
                        visualization={filters.visualization}
                    />

                    <div className={styles.statsPanel}>
                        <div className={styles.statsCard}>
                            <h3>Распределение по типам</h3>
                            <div className={styles.chartContainer}>
                                <CrimeTypesChart filters={filters} />
                            </div>
                        </div>

                        <div className={styles.statsCard}>
                            <h3>Динамика за кварталы</h3>
                            <div className={styles.chartContainer}>
                                <DynamicsChart filters={filters} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <RecommendationsModal
                    filters={filters}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default Layout;