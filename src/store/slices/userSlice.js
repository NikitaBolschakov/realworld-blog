// Redux Toolkit Slice для управления состоянием пользователя и аутентификации в приложении
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Устанавливаем пользователя в состояние и сохраняем его в localStorage
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    // Очищаем состояние пользователя и удаляем его из localStorage
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    // Инициализируем пользователя из localStorage при загрузке приложения
    initializeUser: (state) => {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData) {
        state.user = userData;
      }
    },
  },
});

export const { setUser, clearUser, initializeUser } = userSlice.actions; // экспортируем действия
export const selectUser = (state) => state.user.user; // селектор для получения пользователя из состояния
export const selectIsAuthenticated = (state) => state.user.isAuthenticated; // селектор для проверки аутентификации пользователя

export default userSlice.reducer; // экспортируем редьюсер для использования в store
