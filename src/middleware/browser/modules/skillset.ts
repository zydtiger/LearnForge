import { SkillsetState } from "@/redux/slices/skillsetSlice";
import { readFile } from "@/utils";
import { skillsetDB } from "../db/skillsetData";
import { PersistedSkillsetState } from "../types";
import { DefaultPersistedSkillset } from "../types/default";

/**
 * Reads the skillset from local storage and IndexedDB.
 * If not exist, create default.
 *
 * @returns the persisted skillset state combining localStorage and IndexedDB data
 */
export async function readStorage(): Promise<PersistedSkillsetState> {
  const skillsetStat = localStorage.getItem("skillset");

  // if stat does not exist, create default values
  if (skillsetStat == null) {
    const defaultSkillset = DefaultPersistedSkillset();
    const { data, ...stat } = defaultSkillset;
    await skillsetDB.setSkillset(data);
    localStorage.setItem("skillset", JSON.stringify(stat));
    return defaultSkillset;
  }

  // combine the stat from localStorage with data from IndexedDB
  const stat = JSON.parse(skillsetStat);
  const data = await skillsetDB.getSkillset();
  return { ...stat, data };
}

/**
 * Writes the skillset state to local storage and IndexedDB.
 */
export async function writeStorage({ state }: { state: SkillsetState }) {
  // only collect needed keys excluding 'data' which goes to IndexedDB
  const skillsetStat: Omit<PersistedSkillsetState, "data"> = {
    isInitialBoot: state.isInitialBoot,
    lastSaveTime: state.lastSaveTime,
  };

  // store the data in IndexedDB & localStorage
  await skillsetDB.setSkillset(state.data);
  localStorage.setItem("skillset", JSON.stringify(skillsetStat));
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
    extension == "lf"
      ? JSON.stringify(await readStorage())
      : new Uint8Array(payload); // binary image data
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
  await writeStorage({ state: JSON.parse(contents) });
}
