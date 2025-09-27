import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './features/authSlice';
import expensesReducer from './features/expensesSlice';
import { combineReducers } from 'redux';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth', 'expenses'],
};

const rootReducer = combineReducers({
    auth: authReducer,
    expenses: expensesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);