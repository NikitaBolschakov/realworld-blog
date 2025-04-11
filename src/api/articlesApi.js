import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Базовый URL API
const BASE_URL = 'https://blog-platform.kata.academy/api';

export const articlesApi = createApi({
  reducerPath: 'articlesApi', //  ключ, под которым будет храниться состояние в Redux store
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    // Добавление заголовков к запросам, включая токен авторизации
    // который хранится в localStorage при аутентификации пользователя
    prepareHeaders: (headers) => { 
      const token = JSON.parse(localStorage.getItem('user'))?.token; // Получаем токен из localStorage
      // Если токен существует, добавляем его в заголовок Authorization
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
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

    // Логин пользователя, используется для входа в систему
    loginUser: builder.mutation({
      query: (loginData) => ({
        url: 'users/login',
        method: 'POST',
        body: { user: loginData },
      }),
    }),

    // Получение данных текущего пользователя
    getUser: builder.query({
      query: () => 'user',
    }),

    // Обновление данных текущего пользователя
    updateUser: builder.mutation({
      query: (userData) => ({
        url: 'user',
        method: 'PUT',
        body: { user: userData },
      }),
    }),

    // Создание новой статьи
    createArticle: builder.mutation({
      query: (articleData) => ({
        url: 'articles',
        method: 'POST',
        body: { article: articleData },
      }),
    }),
  }),
});

// хуки для использования в компонентах
export const {
  useGetArticlesQuery,
  useGetArticleBySlugQuery,
  useCreateUserMutation,
  useLoginUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useCreateArticleMutation,
} = articlesApi;
