import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface NoteState {
  nodeId: string; // the current node id to edit in note view
  isHovered: boolean; // whether the node should display a floating note view
  mouseCoords: [number, number]; // the mouse coordinates of floating note view
}

const initialState: NoteState = {
  nodeId: "root",
  isHovered: false,
  mouseCoords: [0, 0],
};

const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    setNoteViewNodeId(state, action: PayloadAction<string>) {
      state.nodeId = action.payload;
    },
    setIsHovered(state, action: PayloadAction<boolean>) {
      state.isHovered = action.payload;
    },
    setMouseCoords(state, action: PayloadAction<[number, number]>) {
      state.mouseCoords = action.payload;
    },
  },
});

export const { setNoteViewNodeId, setIsHovered, setMouseCoords } =
  noteSlice.actions;

export const selectNoteNodeId = (state: RootState) => state.note.nodeId;
export const selectIsHovered = (state: RootState) => state.note.isHovered;
export const selectMouseCoords = (state: RootState) => state.note.mouseCoords;

export default noteSlice.reducer;
