import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Базовый URL API
const BASE_URL = 'https://blog-platform.kata.academy/api';

export const articlesApi = createApi({
  reducerPath: 'articlesApi',  // уникальный ключ для редьюсера
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),  // базовый запрос с указанием URL
  endpoints: (builder) => ({  // создание эндпоинтов
    // Получение списка статей с пагинацией
    getArticles: builder.query({  
      query: ({ limit, offset }) => `/articles?limit=${limit}&offset=${offset}`,  // запрос с параметрами пагинации
    }),
    // Получение одной статьи по slug
    getArticleBySlug: builder.query({
      query: (slug) => `/articles/${slug}`,
    }),
  }),
});

// хуки для использования в компонентах
export const { useGetArticlesQuery, useGetArticleBySlugQuery } = articlesApi;  