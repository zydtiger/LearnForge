import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { RawNodeDatum } from "react-d3-tree";
import { invoke } from "@tauri-apps/api";
import { getStorageReadEndpoint, getStorageWriteEndpoint } from "../../constants/endpoints";
import { DefaultRootNode } from "../../types/defaults";

interface SkillsetState {
  data: RawNodeDatum,
  isInitialBoot: boolean,
  lastSaveTime: string; // ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
  // fields below should not be persisted
  isSaved: boolean,
}

const initialState: SkillsetState = {
  data: DefaultRootNode,
  isInitialBoot: false,
  lastSaveTime: new Date().toISOString(),
  isSaved: true,
};

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

export const saveSkillset = createAsyncThunk(
  "skillset/saveState",
  async (_, { getState, dispatch }) => {
    const state = { ...unwrapState(getState()) };
    state.lastSaveTime = new Date().toISOString();
    await invoke(getStorageWriteEndpoint(), { state });
    dispatch(fetchSkillset()); // resync
  }
);

export const setNotInitialBoot = createAsyncThunk(
  "skillset/setNotInitialBoot",
  async (_, { getState, dispatch }) => {
    const state = { ...unwrapState(getState()) };
    state.isInitialBoot = false;
    await invoke(getStorageWriteEndpoint(), { state });
    dispatch(fetchSkillset()); // resync
  }
);

export const skillsetSlice = createSlice({
  name: 'skillset',
  initialState,
  reducers: {
    // reducer is here to update state locally.
    // saving to the remote side will be processed at set intervals
    // to decrease lag.
    setSkillset(state, action: PayloadAction<RawNodeDatum>) {
      Object.assign(state.data, action.payload);
      state.isSaved = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSkillset.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })
      .addCase(fetchSkillset.rejected, (_, action) => {
        console.error(action.error);
      })
      .addCase(saveSkillset.fulfilled, (state, _) => {
        state.isSaved = true;
      });
  }
});

export const { setSkillset } = skillsetSlice.actions;

export const selectSkillset = (state: RootState) => state.skillset.data;
export const selectIsInitialBoot = (state: RootState) => state.skillset.isInitialBoot;
export const selectLastSaveTime = (state: RootState) => state.skillset.lastSaveTime;
export const selectIsSaved = (state: RootState) => state.skillset.isSaved;

export default skillsetSlice.reducer;