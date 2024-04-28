import { RawNodeDatum } from 'react-d3-tree';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DefaultRootNode } from '../../types/defaults';
import { RootState } from '../store';
import { EditHistory } from '../../lib/editHistory';

interface NoteState {
  noteViewNode: RawNodeDatum;   // the current node to edit in note view
  isNoteSaved: boolean;         // whether the current note is saved into skillset tree
}

const initialState: NoteState = {
  noteViewNode: DefaultRootNode(),
  isNoteSaved: true,
};

const history = new EditHistory<string>(); // edit history
let editCounter = 0;
const EditSensitivity = 5; // determines how many edits triggers history management

const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    setNoteViewNode(state, action: PayloadAction<RawNodeDatum>) {
      state.noteViewNode = action.payload;
      history.clear();
      history.push(state.noteViewNode.mdNote || '');
      state.isNoteSaved = true;
    },
    updateMarkdownNote(state, action: PayloadAction<string>) {
      state.noteViewNode.mdNote = action.payload;
      editCounter++;
      if (editCounter >= EditSensitivity) {
        history.push(state.noteViewNode.mdNote);
        editCounter = 0;
      }
      state.isNoteSaved = false;
    },
    updateName(state, action: PayloadAction<string>) {
      state.noteViewNode.name = action.payload;
      state.isNoteSaved = false;
    },
    undo(state) {
      history.undo();
      state.noteViewNode.mdNote = history.current()!;
    },
    redo(state) {
      history.redo();
      state.noteViewNode.mdNote = history.current()!;
    }
  }
});

export const { setNoteViewNode, updateMarkdownNote, updateName, undo, redo } = noteSlice.actions;

export const selectNoteViewNode = (state: RootState) => state.note.noteViewNode;
export const selectIsNoteSaved = (state: RootState) => state.note.isNoteSaved;
export const selectIsUndoable = () => history.isUndoable();
export const selectIsRedoable = () => history.isRedoable();

export default noteSlice.reducer;