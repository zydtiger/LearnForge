import { configureStore } from '@reduxjs/toolkit'
import skillsetReducer from './slices/skillsetSlice';

const store = configureStore({
  reducer: {
    skillset: skillsetReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;