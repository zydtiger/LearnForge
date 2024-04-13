import { configureStore } from '@reduxjs/toolkit';
import skillsetReducer from './slices/skillsetSlice';
import viewReducer from './slices/viewSlice';

const store = configureStore({
  reducer: {
    skillset: skillsetReducer,
    view: viewReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;