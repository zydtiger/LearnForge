import {
  getStorageReadEndpoint,
  getStorageWriteEndpoint,
  getStorageImportEndpoint,
  getStorageExportEndpoint,
} from "../constants/endpoints";
import { invoke as tauriInvoke, tauri } from "@tauri-apps/api";
import { DefaultRootNode } from "../types/defaults";

const DefaultPersistedSillset = () => ({
  data: DefaultRootNode(),
  isInitialBoot: true,
  lastSaveTime: new Date().toISOString(),
});

function readStorage(): Object {
  const data = sessionStorage.getItem("skillset");
  if (data == null) {
    sessionStorage.setItem(
      "skillset",
      JSON.stringify(DefaultPersistedSillset()),
    );
    return DefaultPersistedSillset();
  }
  return JSON.parse(data);
}

// @ts-ignore
function writeStorage({ state }: Object) {
  // @ts-ignore
  const { data, isInitialBoot, lastSaveTime } = state;
  sessionStorage.setItem(
    "skillset",
    JSON.stringify({ data, isInitialBoot, lastSaveTime }),
  );
}

export async function invoke(endpoint: string, payload?: Object) {
  switch (endpoint) {
    case getStorageReadEndpoint():
      return readStorage();
      // return tauriInvoke(endpoint);
      break;

    case getStorageWriteEndpoint():
      writeStorage(payload!);
      // return tauriInvoke(endpoint, payload as tauri.InvokeArgs);
      break;

    case getStorageImportEndpoint():
      return tauriInvoke(endpoint, payload as tauri.InvokeArgs);
      break;

    case getStorageExportEndpoint():
      return tauriInvoke(endpoint, payload as tauri.InvokeArgs);
      break;

    default:
      break;
  }
}
