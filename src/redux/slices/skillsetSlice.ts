import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { RawNodeDatum } from "react-d3-tree";

/* Use mock data for UI design */
import skillset from '../../assets/mock.json';

/* Augment the node datum to contain progress percentage */
declare module 'react-d3-tree' {
  export interface RawNodeDatum {
    progressPercent: number;
  }
}

export const skillsetSlice = createSlice({
  name: 'skillset',
  initialState: skillset,
  reducers: {
    setSkillset(state, action: PayloadAction<RawNodeDatum>) {
      Object.assign(state, action.payload);
    }
  }
});

export const { setSkillset } = skillsetSlice.actions;

export const selectSkillset = (state: RootState) => state.skillset;

export default skillsetSlice.reducer;