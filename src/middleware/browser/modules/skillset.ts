import { SkillsetState } from "../../../redux/slices/skillsetSlice";
import { readFile } from "../../../utils";
import { PersistedSkillsetState } from "../types";
import { DefaultPersistedSkillset } from "../types/default";

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

export function writeStorage({ state }: { state: SkillsetState }) {
  const persistedState = {};
  // only collect needed keys
  for (const key in DefaultPersistedSkillset()) {
    // @ts-ignore
    persistedState[key] = state[key];
  }
  localStorage.setItem("skillset", JSON.stringify(persistedState));
}

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

export async function importStorage({
  filePath,
}: {
  filePath: FileSystemFileHandle[];
}) {
  const fileHandle = await filePath[0].getFile();
  const contents = await readFile(fileHandle);
  writeStorage({ state: JSON.parse(contents) });
}
