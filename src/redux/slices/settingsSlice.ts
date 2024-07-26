import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PreviewThemes } from "md-editor-rt";
import { RootState } from "../store";
import { fetchSettings } from "../thunks/settingsThunk";

export interface SettingsState {
  globalTheme: "light" | "dark" | "system"; // the global theme setting
  mdPreviewTheme: PreviewThemes; // the preview theme setting for note editor

  // fields below should not be persisted
  isSettingsOpen: boolean; // whether settings modal is open
}

const initialState: SettingsState = {
  globalTheme: "system",
  mdPreviewTheme: "default",
  isSettingsOpen: false,
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
  extraReducers(builder) {
    builder
      .addCase(fetchSettings.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })
      .addCase(fetchSettings.rejected, (_, action) => {
        console.error(action.error);
      });
  },
});

export const { setIsSettingsOpen, setGlobalTheme, setMdPreviewTheme } =
  settingsSlice.actions;

export const getSystemTheme = () => {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

export const selectGlobalTheme = (state: RootState) =>
  state.settings.globalTheme;
export const selectGlobalThemeAuto = (state: RootState) => {
  if (state.settings.globalTheme == "system") {
    return getSystemTheme();
  }
  return state.settings.globalTheme;
};
export const selectMdPreviewTheme = (state: RootState) =>
  state.settings.mdPreviewTheme;

export default settingsSlice.reducer;
