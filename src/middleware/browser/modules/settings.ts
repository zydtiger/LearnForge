import { SettingsState } from "../../../redux/slices/settingsSlice";
import { PersistedSettingsState } from "../types";
import { DefaultPersistedSettings } from "../types/default";

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

export function writeSettings({ state }: { state: SettingsState }) {
  const persistedState = {};
  // only collect needed keys
  for (const key in DefaultPersistedSettings()) {
    // @ts-ignore
    persistedState[key] = state[key];
  }
  localStorage.setItem("settings", JSON.stringify(persistedState));
}
