import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { DefaultRootNode } from "@/types/defaults";
import { findNode } from "@/utils/skillset";
import { SkillsetRawNode } from "@/types";

import { fetchSkillset, saveSkillset } from "../thunks/skillsetThunks";
import { history } from "../history";
import { RootState, SkillsetState } from "../types";

const initialState: SkillsetState = {
  data: DefaultRootNode(),
  isInitialBoot: false,
  lastSaveTime: new Date().toISOString(),
  isFirstTimeLoading: true,
  isSaved: true,
  selectedNodeId: null,
};

const generateIds = (state: SkillsetState) => {
  const generateIdsRecursive = (node: SkillsetRawNode, isRoot: boolean) => {
    if (!node.id) {
      // assigns node.id only when it does not exist
      node.id = isRoot ? "root" : nanoid();
    }
    if (node.children) {
      for (const child of node.children) {
        generateIdsRecursive(child, false);
      }
    }
  };
  generateIdsRecursive(state.data, true);
};

const skillsetSlice = createSlice({
  name: "skillset",
  initialState,
  reducers: {
    // reducer is here to update state locally.
    // saving to the remote side will be processed at set intervals
    // to decrease lag.
    setSkillset(state, action: PayloadAction<SkillsetRawNode>) {
      Object.assign(state.data, action.payload);
      state.isSaved = false;
      history.push({ ...state.data }); // pushes in state
    },
    setSkillsetNodeById(state, action: PayloadAction<SkillsetRawNode>) {
      const targetNode = findNode(state.data, action.payload.id)!;
      Object.assign(targetNode, action.payload);
      history.push({ ...state.data });
      state.isSaved = false;
    },
    setSelectedNodeId(state, action: PayloadAction<SkillsetRawNode["id"]>) {
      state.selectedNodeId = action.payload;
    },
    undo(state) {
      history.undo(state.data);
      state.isSaved = false;
    },
    redo(state) {
      history.redo(state.data);
      state.isSaved = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSkillset.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        generateIds(state);
        if (history.length() == 0) {
          history.push({ ...state.data }); // init history
        }
        state.isFirstTimeLoading = false;
      })
      .addCase(fetchSkillset.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(saveSkillset.fulfilled, (state, _) => {
        state.isSaved = true;
      });
  },
});

export const {
  setSkillset,
  setSkillsetNodeById,
  setSelectedNodeId,
  undo,
  redo,
} = skillsetSlice.actions;

export const selectSkillset = (state: RootState) => state.skillset.data;
export const selectIsInitialBoot = (state: RootState) =>
  state.skillset.isInitialBoot;
export const selectLastSaveTime = (state: RootState) =>
  state.skillset.lastSaveTime;
export const selectIsSaved = (state: RootState) => state.skillset.isSaved;
export const selectIsUndoable = () => history.isUndoable();
export const selectIsRedoable = () => history.isRedoable();
export const selectIsFirstTimeLoading = (state: RootState) =>
  state.skillset.isFirstTimeLoading;

export default skillsetSlice.reducer;
