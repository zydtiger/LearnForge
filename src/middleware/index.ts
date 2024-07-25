import { TAURI_ENV } from "../constants/env";

export default async function invoke(
  endpoint: string,
  args?: Record<string, unknown>,
) {
  // sends to tauri backend directly
  if (TAURI_ENV) {
    const api = await import("@tauri-apps/api");
    return await api.invoke(endpoint, args);
  }
  // browser environment
  else {
    const browser = await import("./browser");
    return await browser.invoke(endpoint, args);
  }
}
