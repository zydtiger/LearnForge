import { configureStore } from "@reduxjs/toolkit";
import { RootState } from "./types";
import skillsetReducer from "./slices/skillsetSlice";
import settingsReducer from "./slices/settingsSlice";
import viewReducer from "./slices/viewSlice";
import messageReducer from "./slices/messageSlice";
import noteReducer from "./slices/noteSlice";

const store = configureStore<RootState>({
  reducer: {
    settings: settingsReducer,
    view: viewReducer,
    message: messageReducer,
    skillset: skillsetReducer,
    note: noteReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export default store;
