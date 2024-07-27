import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type ViewMode = "tree" | "list" | "note";

interface ViewState {
  viewMode: ViewMode; // determines the current view
  isManualModalOpen: boolean; // whether manual modal is open
  prevViewBeforeNote: ViewMode; // the previous view mode before note view
}

const initialState: ViewState = {
  viewMode: "tree",
  isManualModalOpen: false,
  prevViewBeforeNote: "tree",
};

const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    setViewMode(state, action: PayloadAction<ViewMode>) {
      if (action.payload == "note") {
        state.prevViewBeforeNote = state.viewMode;
      }
      state.viewMode = action.payload;
    },
    setIsManualModalOpen(state, action: PayloadAction<boolean>) {
      state.isManualModalOpen = action.payload;
    },
  },
});

export const { setViewMode, setIsManualModalOpen } = viewSlice.actions;

export const selectViewMode = (state: RootState) => state.view.viewMode;
export const selectIsManualModalOpen = (state: RootState) =>
  state.view.isManualModalOpen;
export const selectPrevViewBeforeNote = (state: RootState) =>
  state.view.prevViewBeforeNote;

export default viewSlice.reducer;
