import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { DefaultRootNode } from "../../types/defaults";
import { nanoid } from "nanoid";
import { EditHistory } from "../../lib/editHistory";
import { findNode } from "../../lib/skillset";
import { SkillsetRawNode } from "../../types";
import { fetchSkillset, saveSkillset } from "../thunks/skillsetThunks";

export interface SkillsetState {
  data: SkillsetRawNode; // skillset data
  isInitialBoot: boolean; // whether to show manual modal on app opening
  lastSaveTime: string; // ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)

  // fields below should not be persisted
  isFirstTimeLoading: boolean; // whether to show loading page
  isSaved: boolean; // whether the current state is persisted
}

const initialState: SkillsetState = {
  data: DefaultRootNode(),
  isInitialBoot: false,
  lastSaveTime: new Date().toISOString(),
  isFirstTimeLoading: true,
  isSaved: true,
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

export const history = new EditHistory<Partial<SkillsetRawNode>>("skillset");
let setOpBypassCnt = 0;

const findHistoryTarget = (state: SkillsetState): SkillsetRawNode => {
  if (history.name() == "skillset") {
    return state.data;
  }
  return findNode(state.data, history.current()!.id!)!;
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
    setSkillsetNodeById(
      state,
      action: PayloadAction<Partial<SkillsetRawNode>>,
    ) {
      if (setOpBypassCnt > 0) {
        setOpBypassCnt--;
        return;
      }
      const targetNode = findNode(state.data, action.payload.id!)!;
      if (history.name() == "note" && history.length() == 0) {
        // init note history
        history.push({ id: targetNode.id, mdNote: targetNode.mdNote });
      }
      Object.assign(targetNode, action.payload);
      history.push({ id: targetNode.id, mdNote: targetNode.mdNote });
      state.isSaved = false;
    },
    undo(state) {
      history.undo(findHistoryTarget(state));
      if (history.name() == "note") {
        setOpBypassCnt = 2; // one for note's own undo, one for set note contents callback
      }
    },
    redo(state) {
      history.redo(findHistoryTarget(state));
      if (history.name() == "note") {
        setOpBypassCnt = 2;
      }
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

export const { setSkillset, setSkillsetNodeById, undo, redo } =
  skillsetSlice.actions;

export const selectSkillset = (state: RootState) => state.skillset.data;
export const selectSkillsetNodeById = (state: RootState, id: string) => {
  return findNode(state.skillset.data, id);
};
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
