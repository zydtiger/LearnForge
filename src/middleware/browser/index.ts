import { importStorage, readStorage, writeStorage } from "./modules/skillset";
import { readSettings, writeSettings } from "./modules/settings";

const invokeRouter = {
  "skillset/read": () => readStorage(),
  "skillset/write": (args: any) => writeStorage(args),
  "skillset/import": (args: any) => importStorage(args),
  "skillset/export": (args: any) => importStorage(args),
  "settings/read": () => readSettings(),
  "settings/write": (args: any) => writeSettings(args),
};

export async function invoke(endpoint: string, args?: Record<string, unknown>) {
  return invokeRouter[endpoint as keyof typeof invokeRouter](args);
}
