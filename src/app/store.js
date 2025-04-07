import { configureStore } from '@reduxjs/toolkit';
import { articlesApi } from '../api/articlesApi';

// Создание Redux store с использованием RTK Query
// и добавлением middleware для обработки запросов к API
export const store = configureStore({
  reducer: { 
    [articlesApi.reducerPath]: articlesApi.reducer, // редьюсер для работы с API
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(articlesApi.middleware), 
});
