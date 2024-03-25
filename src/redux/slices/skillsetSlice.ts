import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { RawNodeDatum } from "react-d3-tree";

import { invoke } from "@tauri-apps/api";
import { getStorageReadEndpoint, getStorageWriteEndpoint } from "../../constants/endpoints";

/* Augment the node datum to contain progress percentage */
declare module 'react-d3-tree' {
  export interface RawNodeDatum {
    progressPercent: number;
  }
}

let skillset: RawNodeDatum = await invoke(getStorageReadEndpoint());

export const skillsetSlice = createSlice({
  name: 'skillset',
  initialState: skillset,
  reducers: {
    setSkillset(state, action: PayloadAction<RawNodeDatum>) {
      Object.assign(state, action.payload);
      invoke(getStorageWriteEndpoint(), { rawNode: state })
        .catch((err) => console.error(err));
    }
  }
});

export const { setSkillset } = skillsetSlice.actions;

export const selectSkillset = (state: RootState) => state.skillset;

export default skillsetSlice.reducer;