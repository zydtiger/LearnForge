import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { findNodeInTree } from '../../lib/skillTree';

interface ViewState {
  viewMode: 'tree' | 'list' | 'note'; // determines the current view
  isManualModalOpen: boolean;         // whether manual modal is open 
  noteViewId: string;                 // the current id to edit in note view
}

const initialState: ViewState = {
  viewMode: 'tree',
  isManualModalOpen: false,
  noteViewId: 'root',
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
    setNoteViewId(state, action: PayloadAction<string>) {
      state.noteViewId = action.payload;
    }
  }
});

export const { setViewMode, setIsManualModalOpen, setNoteViewId } = viewSlice.actions;

export const selectViewMode = (state: RootState) => state.view.viewMode;
export const selectIsManualModalOpen = (state: RootState) => state.view.isManualModalOpen;
export const selectNoteViewContext = (state: RootState) => findNodeInTree(state.skillset.data, state.view.noteViewId)!;

export default viewSlice.reducer;