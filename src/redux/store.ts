import { configureStore } from "@reduxjs/toolkit";
import viewReducer from "./slices/viewSlice";
import messageReducer from "./slices/messageSlice";
import skillsetReducer from "./slices/skillsetSlice";
import noteReducer from "./slices/noteSlice";

const store = configureStore({
  reducer: {
    view: viewReducer,
    message: messageReducer,
    skillset: skillsetReducer,
    note: noteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
