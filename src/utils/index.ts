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
