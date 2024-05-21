import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from "./fiatures/userSlice.ts";

import { 
  persistStore, 
  persistReducer ,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
// ...

const persistConfig = {
  key: 'root',
  storage
}

const rootReduser = combineReducers({
  user: userReducer,
});

const persistedReduser = persistReducer(persistConfig, rootReduser);

const store = configureStore({
  reducer: persistedReduser,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      }
    })
}) 


export default store;
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;