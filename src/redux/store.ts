import { configureStore } from '@reduxjs/toolkit';
import skillsetReducer from './slices/skillsetSlice';
import viewReducer from './slices/viewSlice';
import noteReducer from './slices/noteSlice';

const store = configureStore({
  reducer: {
    view: viewReducer,
    skillset: skillsetReducer,
    note: noteReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;