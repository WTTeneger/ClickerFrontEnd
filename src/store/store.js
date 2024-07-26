import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';
import { userApi } from './user/user.api.js';
import { setupListeners } from '@reduxjs/toolkit/query';
export const store = configureStore({
  reducer: {
    user: userReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([userApi.middleware]),
});

setupListeners(store.dispatch);
