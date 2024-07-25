import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PreviewThemes } from "md-editor-rt";
import { RootState } from "../store";

interface SettingsState {
  isSettingsOpen: boolean; // whether settings modal is open
  globalTheme: "light" | "dark" | "system"; // the global theme setting
  mdPreviewTheme: PreviewThemes; // the preview theme setting for note editor
}

const initialState: SettingsState = {
  isSettingsOpen: false,
  globalTheme: "system",
  mdPreviewTheme: "default",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setIsSettingsOpen(state, action: PayloadAction<boolean>) {
      state.isSettingsOpen = action.payload;
    },
    setGlobalTheme(state, action: PayloadAction<SettingsState["globalTheme"]>) {
      state.globalTheme = action.payload;
    },
    setMdPreviewTheme(state, action: PayloadAction<PreviewThemes>) {
      state.mdPreviewTheme = action.payload;
    },
  },
});

export const { setIsSettingsOpen, setGlobalTheme, setMdPreviewTheme } =
  settingsSlice.actions;

export const selectGlobalTheme = (state: RootState) =>
  state.settings.globalTheme;
export const selectGlobalThemeAuto = (state: RootState) => {
  if (state.settings.globalTheme == "system") {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }
  return state.settings.globalTheme;
};
export const selectMdPreviewTheme = (state: RootState) =>
  state.settings.mdPreviewTheme;

export default settingsSlice.reducer;
