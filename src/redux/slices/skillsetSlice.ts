import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { RawNodeDatum } from "react-d3-tree";
import { invoke } from "@tauri-apps/api";
import { getStorageReadEndpoint, getStorageWriteEndpoint } from "../../constants/endpoints";
import { DefaultRootNode } from "../../types/defaults";

interface SkillsetState {
  data: RawNodeDatum,
  isInitialBoot: boolean,
}

const initialState: SkillsetState = {
  data: DefaultRootNode,
  isInitialBoot: false,
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

export const setSkillset = createAsyncThunk(
  "skillset/setSkillset",
  async (skillset: RawNodeDatum, { getState, dispatch }) => {
      const state = { ...unwrapState(getState()) };
      state.data = skillset;
      await invoke(getStorageWriteEndpoint(), { state });
      dispatch(fetchSkillset());
  }
);

export const setNotInitialBoot = createAsyncThunk(
  "skillset/setNotInitialBoot",
  async (_, { getState, dispatch }) => {
    const state = { ...unwrapState(getState()) };
    state.isInitialBoot = false;
    await invoke(getStorageWriteEndpoint(), { state });
    dispatch(fetchSkillset());
  }
);

export const skillsetSlice = createSlice({
  name: 'skillset',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSkillset.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })
      .addCase(fetchSkillset.rejected, (_, action) => {
        console.error(action.error);
      });
  }
});

export const selectSkillset = (state: RootState) => state.skillset.data;
export const selectIsInitialBoot = (state: RootState) => state.skillset.isInitialBoot;

export default skillsetSlice.reducer;