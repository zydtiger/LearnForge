import {
  getStorageReadEndpoint,
  getStorageWriteEndpoint,
  getStorageImportEndpoint,
  getStorageExportEndpoint,
} from "../constants/endpoints";
import { DefaultRootNode } from "../types/defaults";
import { SkillsetState } from "../redux/slices/skillsetSlice";
import { TAURI_ENV } from "../constants/env";

const DefaultPersistedSillset = () => ({
  data: DefaultRootNode(),
  isInitialBoot: true,
  lastSaveTime: new Date().toISOString(),
});

function readStorage(): Object {
  const data = localStorage.getItem("skillset");
  if (data == null) {
    localStorage.setItem("skillset", JSON.stringify(DefaultPersistedSillset()));
    return DefaultPersistedSillset();
  }
  return JSON.parse(data);
}

function writeStorage({ state }: { state: SkillsetState }) {
  const { data, isInitialBoot, lastSaveTime } = state;
  localStorage.setItem(
    "skillset",
    JSON.stringify({ data, isInitialBoot, lastSaveTime }),
  );
}

async function readFile(fileHandle: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve(reader.result as string);
    });
    reader.addEventListener("error", () => {
      reject(reader.error);
    });
    reader.readAsText(fileHandle);
  });
}

export async function invoke(endpoint: string, args?: Record<string, unknown>) {
  // sends to tauri backend directly
  if (TAURI_ENV) {
    const api = await import("@tauri-apps/api");
    return await api.invoke(endpoint, args);
  }
  // browser environment
  if (endpoint == getStorageReadEndpoint()) {
    return readStorage();
  } else if (endpoint == getStorageWriteEndpoint()) {
    writeStorage(args as { state: SkillsetState });
  } else if (endpoint == getStorageImportEndpoint()) {
    const { filePath } = args as { filePath: FileSystemFileHandle[] };
    const fileHandle = await filePath[0].getFile();
    const contents = await readFile(fileHandle);
    writeStorage({ state: JSON.parse(contents) });
  } else if (endpoint == getStorageExportEndpoint()) {
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
  }
}
