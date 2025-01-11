import { SettingsState } from "@/redux/types";
import { PersistedSettingsState } from "../types";
import { DefaultPersistedSettings } from "../types/default";

/**
 * Reads the settings from local storage. If not exist, create default.
 *
 * @returns the persisted settings state in local storage
 */
export function readSettings(): PersistedSettingsState {
  const data = localStorage.getItem("settings");
  if (data == null) {
    localStorage.setItem(
      "settings",
      JSON.stringify(DefaultPersistedSettings()),
    );
    return DefaultPersistedSettings();
  }
  return JSON.parse(data);
}

/**
 * Writes the settings to local storage.
 */
export function writeSettings({ state }: { state: SettingsState }) {
  const persistedState = {};
  // only collect needed keys
  for (const key in DefaultPersistedSettings()) {
    // @ts-ignore
    persistedState[key] = state[key];
  }
  localStorage.setItem("settings", JSON.stringify(persistedState));
}
