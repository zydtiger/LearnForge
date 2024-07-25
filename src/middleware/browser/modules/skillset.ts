import { SkillsetState } from "../../../redux/slices/skillsetSlice";
import { readFile } from "../../../utils";
import { PersistedSkillsetState } from "../types";
import { DefaultPersistedSkillset } from "../types/default";

/**
 * Reads the skillset from local storage. If not exist, create default.
 *
 * @returns the persisted skillset state in local storage
 */
export function readStorage(): PersistedSkillsetState {
  const data = localStorage.getItem("skillset");
  if (data == null) {
    localStorage.setItem(
      "skillset",
      JSON.stringify(DefaultPersistedSkillset()),
    );
    return DefaultPersistedSkillset();
  }
  return JSON.parse(data);
}

/**
 * Writes the skillset to local storage.
 */
export function writeStorage({ state }: { state: SkillsetState }) {
  const persistedState = {};
  // only collect needed keys
  for (const key in DefaultPersistedSkillset()) {
    // @ts-ignore
    persistedState[key] = state[key];
  }
  localStorage.setItem("skillset", JSON.stringify(persistedState));
}

/**
 * Writes payload to the file handle.
 *
 * @param filePath file handle to write into
 * @param payload contents to write to the file handle
 */
export async function exportStorage({
  filePath,
  payload,
}: {
  filePath: FileSystemFileHandle;
  payload: ArrayBuffer;
}) {
  const parts = filePath.name.split(".");
  const extension = parts[parts.length - 1];
  const contents =
    extension == "lf" ? JSON.stringify(readStorage()) : new Uint8Array(payload);
  const writableStream = await filePath.createWritable();
  await writableStream.write(contents);
  await writableStream.close();
}

/**
 * Imports skillset from file and overrides current state.
 *
 * @param filePath file handle to read from
 */
export async function importStorage({
  filePath,
}: {
  filePath: FileSystemFileHandle[];
}) {
  const fileHandle = await filePath[0].getFile();
  const contents = await readFile(fileHandle);
  writeStorage({ state: JSON.parse(contents) });
}
