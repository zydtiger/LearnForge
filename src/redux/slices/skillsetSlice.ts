import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { DefaultRootNode } from "../../types/defaults";
import { nanoid } from 'nanoid';
import { EditHistory } from '../../lib/editHistory';
import { findNode } from '../../lib/skillset';
import { SkillsetRawNode } from "../../types";
import { fetchSkillset, saveSkillset } from "../thunks/skillsetThunks";

export interface SkillsetState {
  data: SkillsetRawNode;      // skillset data
  isInitialBoot: boolean;     // whether to show manual modal on app opening
  lastSaveTime: string;       // ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)

  // fields below should not be persisted
  isFirstTimeLoading: boolean;// whether to show loading page
  isSaved: boolean;           // whether the current state is persisted
  history: EditHistory<SkillsetRawNode>; // edit history
}

const initialState: SkillsetState = {
  data: DefaultRootNode(),
  isInitialBoot: false,
  lastSaveTime: new Date().toISOString(),
  isFirstTimeLoading: true,
  isSaved: true,
  history: new EditHistory()
};

const generateIds = (state: SkillsetState) => {
  const generateIdsRecursive = (node: SkillsetRawNode, isRoot: boolean) => {
    if (!node.id) { // assigns node.id only when it does not exist
      node.id = isRoot ? 'root' : nanoid();
    }
    if (node.children) {
      for (const child of node.children) {
        generateIdsRecursive(child, false);
      }
    }
  };
  generateIdsRecursive(state.data, true);
};

const loadData = (state: SkillsetState, payload: SkillsetRawNode) => {
  Object.assign(state.data, payload);
  state.isSaved = false;
};

const skillsetSlice = createSlice({
  name: 'skillset',
  initialState,
  reducers: {
    // reducer is here to update state locally.
    // saving to the remote side will be processed at set intervals
    // to decrease lag.
    setSkillset(state, action: PayloadAction<SkillsetRawNode>) {
      loadData(state, action.payload);
      state.history.push({ ...state.data }); // pushes in state
    },
    setSkillsetNodeById(state, action: PayloadAction<SkillsetRawNode>) {
      const targetNode = findNode(state.data, action.payload.id)!;
      Object.assign(targetNode, action.payload);
      state.history.push({ ...state.data });
      state.isSaved = false;
    },
    undo(state) {
      state.history.undo();
      loadData(state, state.history.current()!);
    },
    redo(state) {
      state.history.redo();
      loadData(state, state.history.current()!);
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSkillset.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        generateIds(state);
        if (state.history.length() == 0) {
          state.history.push({ ...state.data }); // init history
        }
        state.isFirstTimeLoading = false;
      })
      .addCase(fetchSkillset.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(saveSkillset.fulfilled, (state, _) => {
        state.isSaved = true;
      });
  }
});

export const { setSkillset, setSkillsetNodeById, undo, redo } = skillsetSlice.actions;

export const selectSkillset = (state: RootState) => state.skillset.data;
export const selectIsInitialBoot = (state: RootState) => state.skillset.isInitialBoot;
export const selectLastSaveTime = (state: RootState) => state.skillset.lastSaveTime;
export const selectIsSaved = (state: RootState) => state.skillset.isSaved;
export const selectIsUndoable = (state: RootState) => state.skillset.history.isUndoable();
export const selectIsRedoable = (state: RootState) => state.skillset.history.isRedoable();
export const selectIsFirstTimeLoading = (state: RootState) => state.skillset.isFirstTimeLoading;

export default skillsetSlice.reducer;