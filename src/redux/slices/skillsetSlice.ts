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

export const skillsetSlice = createSlice({
  name: 'skillset',
  initialState,
  reducers: {
    setSkillset(state, action: PayloadAction<RawNodeDatum>) {
      Object.assign(state.data, action.payload);
      invoke(getStorageWriteEndpoint(), { state })
        .catch((err) => console.error(err));
    },
    setNotInitialBoot(state) {
      state.isInitialBoot = false;
      invoke(getStorageWriteEndpoint(), { state })
        .catch((err) => console.error(err));
    }
  },
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

export const { setSkillset, setNotInitialBoot } = skillsetSlice.actions;

export const selectSkillset = (state: RootState) => state.skillset.data;
export const selectIsInitialBoot = (state: RootState) => state.skillset.isInitialBoot;

export default skillsetSlice.reducer;