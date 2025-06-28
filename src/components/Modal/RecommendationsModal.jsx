import React from 'react';
import styles from './Modal.module.css';

const RecommendationsModal = ({ filters, onClose }) => {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <h2>📊 Аналитические рекомендации</h2>
                <p>Модальное окно с рекомендациями</p>
            </div>
        </div>
    );
};

export default RecommendationsModal;