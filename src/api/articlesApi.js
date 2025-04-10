import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Базовый URL API
const BASE_URL = 'https://blog-platform.kata.academy/api';

export const articlesApi = createApi({
  reducerPath: 'articlesApi', //  ключ, под которым будет храниться состояние в Redux store
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    // Получение списка статей с пагинацией
    getArticles: builder.query({
      query: ({ limit, offset }) => `/articles?limit=${limit}&offset=${offset}`,
    }),

    // Получение одной статьи по slug
    getArticleBySlug: builder.query({
      query: (slug) => `/articles/${slug}`,
    }),

    // Создание нового пользователя, используется для регистрации нового пользователя
    createUser: builder.mutation({
      query: (userData) => ({
        url: 'users',
        method: 'POST',
        body: { user: { ...userData, image: '' } },
      }),
    }),

    loginUser: builder.mutation({
      query: (loginData) => ({
        url: 'users/login',
        method: 'POST',
        body: { user: loginData },
      }),
    }),
  }),
});

// хуки для использования в компонентах
export const { useGetArticlesQuery, useGetArticleBySlugQuery, useCreateUserMutation, useLoginUserMutation } =
  articlesApi;
