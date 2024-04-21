import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { RawNodeDatum } from "react-d3-tree";
import { invoke } from "@tauri-apps/api";
import {
  getStorageReadEndpoint,
  getStorageWriteEndpoint,
  getStorageExportEndpoint,
  getStorageImportEndpoint
} from "../../constants/endpoints";
import { DefaultRootNode } from "../../types/defaults";
import { openDialog, saveDialog } from '../../lib/dialogs';
import { nanoid } from 'nanoid';
import { EditHistory } from '../../lib/history';

interface SkillsetState {
  data: RawNodeDatum;         // skillset data
  isInitialBoot: boolean;     // whether to show manual modal on app opening
  lastSaveTime: string;       // ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)

  // fields below should not be persisted
  isFirstTimeLoading: boolean;// whether to show loading page
  isSaved: boolean;           // whether the current state is persisted
}

const initialState: SkillsetState = {
  data: DefaultRootNode,
  isInitialBoot: false,
  lastSaveTime: new Date().toISOString(),
  isFirstTimeLoading: true,
  isSaved: true,
};

/**
 * Fetches the skillset from backend.
 */
export const fetchSkillset = createAsyncThunk(
  "skillset/fetchSkillset",
  async () => {
    const response = await invoke(getStorageReadEndpoint());
    return response;
  }
);

const unwrapState = (state: unknown) => {
  return (state as RootState).skillset;
};

const writeState = async (state: SkillsetState, callback: () => void) => {
  await invoke(getStorageWriteEndpoint(), { state });
  callback();
};

const generateIds = (state: SkillsetState) => {
  const generateIdsRecursive = (node: RawNodeDatum, isRoot: boolean) => {
    node.id = isRoot ? 'root' : nanoid();
    if (node.children) {
      for (const child of node.children) {
        generateIdsRecursive(child, false);
      }
    }
  };
  generateIdsRecursive(state.data, true);
};

/**
 * Saves the skillset to backend, runs periodically
 */
export const saveSkillset = createAsyncThunk(
  "skillset/saveState",
  async (_, { getState, dispatch }) => {
    const state = { ...unwrapState(getState()) };
    state.lastSaveTime = new Date().toISOString();
    writeState(state, () => dispatch(fetchSkillset()));
  }
);

/**
 * Sets not initial boot.
 */
export const setNotInitialBoot = createAsyncThunk(
  "skillset/setNotInitialBoot",
  async (_, { getState, dispatch }) => {
    const state = { ...unwrapState(getState()) };
    state.isInitialBoot = false;
    writeState(state, () => dispatch(fetchSkillset()));
  }
);

/**
 * Exports to chosen path in dialog.
 */
export const exportSkillset = createAsyncThunk(
  "skillset/exportSkillset",
  async (_, { dispatch }) => {
    await dispatch(saveSkillset()); // saves the current workspace
    const filePath = await saveDialog();
    invoke(getStorageExportEndpoint(), { filePath });
  }
);

/**
 * Imports from chosen path in dialog.
 */
export const importSkillset = createAsyncThunk(
  "skillset/importSkillset",
  async (_, { dispatch }) => {
    const filePath = await openDialog();
    await invoke(getStorageImportEndpoint(), { filePath });
    dispatch(fetchSkillset());
  }
);

const loadRawNodeDatum = (state: SkillsetState, payload: RawNodeDatum) => {
  Object.assign(state.data, payload);
  state.isSaved = false;
};

const history = new EditHistory<RawNodeDatum>(); // edit history

const skillsetSlice = createSlice({
  name: 'skillset',
  initialState,
  reducers: {
    // reducer is here to update state locally.
    // saving to the remote side will be processed at set intervals
    // to decrease lag.
    setSkillset(state, action: PayloadAction<RawNodeDatum>) {
      loadRawNodeDatum(state, action.payload);
      history.push({ ...state.data }); // pushes in state
    },
    undo(state) {
      history.undo();
      loadRawNodeDatum(state, history.current()!);
    },
    redo(state) {
      history.redo();
      loadRawNodeDatum(state, history.current()!);
    }
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
  }
});

export const { setSkillset, undo, redo } = skillsetSlice.actions;

export const selectSkillset = (state: RootState) => state.skillset.data;
export const selectIsInitialBoot = (state: RootState) => state.skillset.isInitialBoot;
export const selectLastSaveTime = (state: RootState) => state.skillset.lastSaveTime;
export const selectIsSaved = (state: RootState) => state.skillset.isSaved;
export const selectIsUndoable = () => history.isUndoable();
export const selectIsRedoable = () => history.isRedoable();
export const selectIsFirstTimeLoading = (state: RootState) => state.skillset.isFirstTimeLoading;

export default skillsetSlice.reducer;