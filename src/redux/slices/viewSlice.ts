import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { RawNodeDatum } from 'react-d3-tree';
import { DefaultRootNode } from '../../types/defaults';

interface ViewState {
  viewMode: 'tree' | 'list' | 'note'; // determines the current view
  isManualModalOpen: boolean;         // whether manual modal is open 
  noteViewNode: RawNodeDatum;         // the current node to edit in note view
}

const initialState: ViewState = {
  viewMode: 'tree',
  isManualModalOpen: false,
  noteViewNode: DefaultRootNode,
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
    setNoteViewNode(state, action: PayloadAction<RawNodeDatum>) {
      state.noteViewNode = action.payload;
    },
    updateMarkdownNote(state, action: PayloadAction<string>) {
      state.noteViewNode.mdNote = action.payload;
    }
  }
});

export const { setViewMode, setIsManualModalOpen, setNoteViewNode, updateMarkdownNote } = viewSlice.actions;

export const selectViewMode = (state: RootState) => state.view.viewMode;
export const selectIsManualModalOpen = (state: RootState) => state.view.isManualModalOpen;
export const selectNoteViewNode = (state: RootState) => state.view.noteViewNode;

export default viewSlice.reducer;