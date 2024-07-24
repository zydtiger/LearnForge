import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PreviewThemes } from "md-editor-rt";
import { RootState } from "../store";

interface SettingsState {
  globalTheme: "light" | "dark" | "system";
  mdPreviewTheme: PreviewThemes;
}

const initialState: SettingsState = {
  globalTheme: "system",
  mdPreviewTheme: "default",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setGlobalTheme(state, action: PayloadAction<SettingsState["globalTheme"]>) {
      state.globalTheme = action.payload;
    },
    setMdPreviewTheme(state, action: PayloadAction<PreviewThemes>) {
      state.mdPreviewTheme = action.payload;
    },
  },
});

export const { setGlobalTheme, setMdPreviewTheme } = settingsSlice.actions;

export const selectGlobalTheme = (state: RootState) =>
  state.settings.globalTheme;
export const selectMdPreviewTheme = (state: RootState) =>
  state.settings.mdPreviewTheme;

export default settingsSlice.reducer;
