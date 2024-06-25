import { save, open } from "@tauri-apps/api/dialog";
import { TAURI_ENV } from "../constants/env";

/**
 * Opens a dialog to prompt the selection of saving path.
 * @returns file path | file handle to export to
 */
export const saveDialog = async () => {
  if (TAURI_ENV) {
    return await save({
      filters: [
        {
          name: "LearnForge",
          extensions: ["lf"],
        },
        {
          name: "Scalable Vector Graphics",
          extensions: ["svg"],
        },
        {
          name: "Portable Network Graphics",
          extensions: ["png"],
        },
        {
          name: "Joint Photographic Experts Group",
          extensions: ["jpg", "jpeg"],
        },
      ],
    });
  }
  // browser environment
  return await window.showSaveFilePicker({
    startIn: "downloads",
    types: [
      {
        description: "LearnForge",
        accept: { "application/json": [".lf"] },
      },
      {
        description: "Scalable Vector Graphics",
        accept: { "image/svg+xml": [".svg"] },
      },
      {
        description: "Portable Network Graphics",
        accept: { "image/png": [".png"] },
      },
      {
        description: "Joint Photographic Experts Group",
        accept: { "image/jpeg": [".jpg", ".jpeg"] },
      },
    ],
  });
};

/**
 * Opens a dialog to prompt the selection of opening path.
 * @returns file path | file handle to import from
 */
export const openDialog = async () => {
  if (TAURI_ENV) {
    return await open({
      multiple: false,
      filters: [
        {
          name: "LearnForge",
          extensions: ["lf"],
        },
      ],
    });
  }
  // browser environment
  return await window.showOpenFilePicker({
    startIn: "downloads",
    types: [
      {
        description: "LearnForge",
        accept: { "application/json": [".lf"] },
      },
    ],
  });
};
