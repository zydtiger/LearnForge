import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ViewState {
  viewMode: 'tree' | 'list';  // determines the current view
  isManualModalOpen: boolean; // whether manual modal is open 
}

const initialState: ViewState = {
  viewMode: 'tree',
  isManualModalOpen: false
};

const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setViewMode(state, action: PayloadAction<typeof state.viewMode>) {
      state.viewMode = action.payload;
    },
    setIsManualModalOpen(state, action: PayloadAction<boolean>) {
      state.isManualModalOpen = action.payload;
    },
  }
});

export const { setViewMode, setIsManualModalOpen } = viewSlice.actions;

export const selectViewMode = (state: RootState) => state.view.viewMode;
export const selectIsManualModalOpen = (state: RootState) => state.view.isManualModalOpen;

export default viewSlice.reducer;