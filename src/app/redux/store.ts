import { configureStore } from '@reduxjs/toolkit';
import { authAPI } from '../services/auth.service';
import { authReducer } from './slices/auth.slice';
import { generalReducer } from './slices/general.slice';
import { userReducer } from './slices/user.slice';
import { operationReducer } from './slices/operation.slice';
import { operationAPI } from '../services/operation.service';
import { recordReducer } from './slices/record.slice';
import { recordAPI } from '../services/record.service';

export const store = configureStore({
  reducer: {
    authReducer,
    userReducer,
    generalReducer,
    operationReducer,
    recordReducer,

    [authAPI.reducerPath]: authAPI.reducer,
    [operationAPI.reducerPath]: operationAPI.reducer,
    [recordAPI.reducerPath]: recordAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([authAPI.middleware]).concat([operationAPI.middleware]).concat([recordAPI.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
