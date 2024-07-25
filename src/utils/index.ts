/**
 * Reads file contents from a file handle using async/await syntax.
 *
 * @param fileHandle File type object to read from
 * @returns the full file contents
 */
export async function readFile(fileHandle: File): Promise<string> {
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
