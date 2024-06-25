import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SkillsetRawNode } from "../../types";
import { DefaultRootNode } from "../../types/defaults";
import { RootState } from "../store";
import { EditHistory } from "../../lib/editHistory";

interface NoteState {
  noteViewNode: SkillsetRawNode; // the current node to edit in note view
  isNoteSaved: boolean; // whether the current note is saved into skillset tree
  isHovered: boolean; // whether the node should display a floating note view
  mouseCoords: [number, number]; // the mouse coordinates of floating note view
}

const initialState: NoteState = {
  noteViewNode: DefaultRootNode(),
  isNoteSaved: true,
  isHovered: false,
  mouseCoords: [0, 0],
};

const history = new EditHistory<string>(); // edit history
let editCounter = 0;
const EditSensitivity = 5; // determines how many edits triggers history management

const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    setNoteViewNode(state, action: PayloadAction<SkillsetRawNode>) {
      state.noteViewNode = action.payload;
      history.clear();
      history.push(state.noteViewNode.mdNote || "");
      state.isNoteSaved = true;
    },
    setIsHovered(state, action: PayloadAction<boolean>) {
      state.isHovered = action.payload;
    },
    setMouseCoords(state, action: PayloadAction<[number, number]>) {
      state.mouseCoords = action.payload;
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
    },
  },
});

export const {
  setNoteViewNode,
  setIsHovered,
  setMouseCoords,
  updateMarkdownNote,
  updateName,
  undo,
  redo,
} = noteSlice.actions;

export const selectNoteViewNode = (state: RootState) => state.note.noteViewNode;
export const selectIsNoteSaved = (state: RootState) => state.note.isNoteSaved;
export const selectIsHovered = (state: RootState) => state.note.isHovered;
export const selectMouseCoords = (state: RootState) => state.note.mouseCoords;
export const selectIsUndoable = () => history.isUndoable();
export const selectIsRedoable = () => history.isRedoable();

export default noteSlice.reducer;
