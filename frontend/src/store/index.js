import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice.js';
import postReducer from './postSlice.js';

const persistConfigAuth = {
  key: 'auth',
  storage,
};

const persistConfigPosts = {
  key: 'posts',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfigAuth, authReducer);
const persistedPostReducer = persistReducer(persistConfigPosts, postReducer);

const Store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    post: persistedPostReducer,
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
