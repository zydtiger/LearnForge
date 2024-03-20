import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

/* Use mock data for UI design */
import skillset from '../../assets/mock.json';

export const skillsetSlice = createSlice({
  name: 'skillset',
  initialState: skillset,
  reducers: {}
})

export const selectSkillset = (state: RootState) => state.skillset

export default skillsetSlice.reducer;