import { TAURI_ENV } from "./env";

export const getStorageReadEndpoint = () =>
  TAURI_ENV ? "plugin:skillset|read" : "skillset/read";
export const getStorageWriteEndpoint = () =>
  TAURI_ENV ? "plugin:skillset|write" : "skillset/write";
export const getStorageExportEndpoint = () =>
  TAURI_ENV ? "plugin:skillset|export" : "skillset/export";
export const getStorageImportEndpoint = () =>
  TAURI_ENV ? "plugin:skillset|import" : "skillset/import";

export const getSettingsReadEndpoint = () =>
  TAURI_ENV ? "plugin:settings|read" : "settings/read";
export const getSettingsWriteEndpoint = () =>
  TAURI_ENV ? "plugin:settings|write" : "settings/write";
