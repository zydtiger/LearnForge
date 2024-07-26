import { PersistedSettingsState, PersistedSkillsetState } from ".";
import { DefaultRootNode } from "../../../types/defaults";

export const DefaultPersistedSkillset = (): PersistedSkillsetState => ({
  data: DefaultRootNode(),
  isInitialBoot: true,
  lastSaveTime: new Date().toISOString(),
});

export const DefaultPersistedSettings = (): PersistedSettingsState => ({
  globalTheme: "system",
  mdPreviewTheme: "default",
});
