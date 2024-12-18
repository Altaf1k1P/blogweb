import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice.js';
import postReducer from './postSlice.js';

// Persist configuration for auth
const persistConfigAuth = {
    key: 'auth',
    storage,
};

const persistedAuthReducer = persistReducer(persistConfigAuth, authReducer);

// Persist configuration for posts (if you want to persist posts)
const persistConfigPosts = {
    key: 'posts',
    storage,
};

const persistedPostReducer = persistReducer(persistConfigPosts, postReducer);

const Store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        post: persistedPostReducer,  // Now persistedPostReducer is defined
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
    devTools: true,
});

export const persistor = persistStore(Store);
export default Store;
