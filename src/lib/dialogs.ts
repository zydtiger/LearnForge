import { save, open } from "@tauri-apps/api/dialog";

/**
 * Opens a dialog to prompt the selection of saving path.
 * @returns file path to export to
 */
export const saveDialog = async () => {
  const filePath = await save({
    filters: [
      {
        name: 'LearnForge',
        extensions: ['lf']
      },
      {
        name: 'Scalable Vector Graphics',
        extensions: ['svg']
      }
    ]
  });
  return filePath;
};

/**
 * Opens a dialog to prompt the selection of opening path.
 * @returns file path to import from
 */
export const openDialog = async () => {
  const filePath = await open({
    multiple: false,
    filters: [{
      name: 'LearnForge',
      extensions: ['lf']
    }]
  });
  return filePath;
};