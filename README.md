# Crime Analytics Almaty

Система анализа преступности в Алматы с интерактивными графиками и картой.

## 🚀 Установка и запуск

```bash
npm install
npm install recharts
npm start
```

## 📁 Основные файлы

```
src/
├── components/Charts/    # Графики
├── hooks/               # useCrimeData.js
├── utils/               # dataProcessingMock.js
└── services/            # api.js (для будущего API)
```

## 🔄 Переключение на реальное API

1. В `useCrimeData.js`: `USE_MOCK_DATA = false`
2. Поменять импорты: `dataProcessingMock` → `dataProcessing`

## 🧪 Данные

- **Сейчас**: Мок данные (30 записей за 2024 год)
- **Будущее**: API Smart Almaty

## 🛠️ Команды

```bash
npm start          # Запуск
npm run build      # Сборка
npm test           # Тесты
```