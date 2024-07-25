import { createAsyncThunk } from "@reduxjs/toolkit";
import { invoke } from "../../middleware/storage";
import {
  getSettingsReadEndpoint,
  getSettingsWriteEndpoint,
} from "../../constants/endpoints";
import { RootState } from "../store";

/**
 * Fetches the settings from backend.
 */
export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async () => {
    return await invoke(getSettingsReadEndpoint());
  },
);

/**
 * Saves the settings to backend.
 */
export const saveSettings = createAsyncThunk(
  "settings/saveSettings",
  async (_, { getState, dispatch }) => {
    await invoke(getSettingsWriteEndpoint(), {
      state: (getState() as RootState).settings,
    });
    dispatch(fetchSettings());
  },
);
