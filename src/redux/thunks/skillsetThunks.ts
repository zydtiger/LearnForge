import { createAsyncThunk } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { openDialog, saveDialog } from '../../lib/dialogs';
import { RootState } from "../store";
import { SkillsetState } from "../slices/skillsetSlice";
import { pushMessage } from '../slices/messageSlice';
import {
  getStorageReadEndpoint,
  getStorageWriteEndpoint,
  getStorageExportEndpoint,
  getStorageImportEndpoint
} from "../../constants/endpoints";
import { TreeSVGExport, TreeImageExport } from '../../lib/export';

/**
 * Fetches the skillset from backend.
 */
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

const writeState = async (state: SkillsetState, callback: () => void) => {
  await invoke(getStorageWriteEndpoint(), { state });
  callback();
};

/**
 * Saves the skillset to backend, runs periodically
 */
export const saveSkillset = createAsyncThunk(
  "skillset/saveState",
  async (_, { getState, dispatch }) => {
    const state = { ...unwrapState(getState()) };
    state.lastSaveTime = new Date().toISOString();
    writeState(state, () => dispatch(fetchSkillset()));
  }
);

/**
 * Sets not initial boot.
 */
export const setNotInitialBoot = createAsyncThunk(
  "skillset/setNotInitialBoot",
  async (_, { getState, dispatch }) => {
    const state = { ...unwrapState(getState()) };
    state.isInitialBoot = false;
    writeState(state, () => dispatch(fetchSkillset()));
  }
);

/**
 * Exports to chosen path in dialog.
 */
export const exportSkillset = createAsyncThunk(
  "skillset/exportSkillset",
  async (_, { dispatch }) => {
    await dispatch(saveSkillset()); // saves the current workspace
    const filePath = await saveDialog();
    if (!filePath) return; // don't do anything if user cancels

    const parts = filePath.split('.');
    const extension = parts[parts.length - 1];

    if (extension == 'lf') {
      invoke(getStorageExportEndpoint(), { filePath });
    } else if (extension == 'svg') {
      const encoder = new TextEncoder();
      const payload = Array.from(encoder.encode(TreeSVGExport()));
      invoke(getStorageExportEndpoint(), { filePath, payload });
    } else if (extension == 'png') {
      const payload = Array.from(await TreeImageExport('png'));
      invoke(getStorageExportEndpoint(), { filePath, payload });
    } else if (extension == 'jpg' || extension == 'jpeg') {
      const payload = Array.from(await TreeImageExport('jpeg'));
      invoke(getStorageExportEndpoint(), { filePath, payload });
    } else {
      dispatch(pushMessage({
        type: 'error',
        content: `Exporting to extension .${extension} is undefined`
      }));
    }
  }
);

/**
 * Imports from chosen path in dialog.
 */
export const importSkillset = createAsyncThunk(
  "skillset/importSkillset",
  async (_, { getState, dispatch }) => {
    const filePath = await openDialog();
    await invoke(getStorageImportEndpoint(), { filePath });
    await dispatch(fetchSkillset());

    // push current state to history after import
    const state = { ...unwrapState(getState()) };
    state.history.push({ ...state.data });
  }
);