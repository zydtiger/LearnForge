import {
  getStorageReadEndpoint,
  getStorageWriteEndpoint,
  getStorageImportEndpoint,
  getStorageExportEndpoint,
} from "../constants/endpoints";
import { invoke as tauriInvoke, tauri } from "@tauri-apps/api";
import { DefaultRootNode } from "../types/defaults";
import { SkillsetState } from "../redux/slices/skillsetSlice";
import { TAURI_ENV } from "../constants/env";

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

function writeStorage({ state }: { state: SkillsetState }) {
  const { data, isInitialBoot, lastSaveTime } = state;
  sessionStorage.setItem(
    "skillset",
    JSON.stringify({ data, isInitialBoot, lastSaveTime }),
  );
}

export async function invoke(endpoint: string, args?: Object) {
  if (TAURI_ENV) {
    return await tauriInvoke(endpoint, args as tauri.InvokeArgs);
  }
  // browser environment
  switch (endpoint) {
    case getStorageReadEndpoint():
      return readStorage();

    case getStorageWriteEndpoint():
      writeStorage(args as { state: SkillsetState });
      break;

    case getStorageImportEndpoint():
      // TODO:
      break;

    case getStorageExportEndpoint():
      const { filePath } = args as { filePath: FileSystemFileHandle };
      const parts = filePath.name.split(".");
      const extension = parts[parts.length - 1];
      let contents: string | Uint8Array;
      if (extension == "lf") {
        contents = JSON.stringify(readStorage());
      } else {
        const { payload } = args as { payload: ArrayBuffer };
        contents = new Uint8Array(payload);
      }
      const writableStream = await filePath.createWritable();
      await writableStream.write(contents);
      await writableStream.close();
      break;

    default:
      break;
  }
}
