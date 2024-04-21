import { RawNodeDatum } from 'react-d3-tree';
import { DefaultRootNode } from '../../types/defaults';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface NoteState {
  noteViewNode: RawNodeDatum;   // the current node to edit in note view
}

const initialState: NoteState = {
  noteViewNode: DefaultRootNode,
};

const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    setNoteViewNode(state, action: PayloadAction<RawNodeDatum>) {
      state.noteViewNode = action.payload;
    },
    updateMarkdownNote(state, action: PayloadAction<string>) {
      state.noteViewNode.mdNote = action.payload;
    }
  }
});

export const { setNoteViewNode, updateMarkdownNote } = noteSlice.actions;

export const selectNoteViewNode = (state: RootState) => state.note.noteViewNode;

export default noteSlice.reducer;