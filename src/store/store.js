import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';
import interfaceReducer from './user/interfaceSlice.js';
import { userApi } from './user/user.api.js';
import { setupListeners } from '@reduxjs/toolkit/query';
export const store = configureStore({
  reducer: {
    user: userReducer,
    interface: interfaceReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([userApi.middleware]),
});

setupListeners(store.dispatch);
