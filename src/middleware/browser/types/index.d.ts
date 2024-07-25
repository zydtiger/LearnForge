import { SkillsetRawNode } from "../../../types";
import { PreviewThemes } from "md-editor-rt";

export interface PersistedSkillsetState {
  data: SkillsetRawNode; // skillset data
  isInitialBoot: boolean; // whether to show manual modal on app opening
  lastSaveTime: string; // ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
}

export interface PersistedSettingsState {
  globalTheme: "light" | "dark" | "system"; // the global theme setting
  mdPreviewTheme: PreviewThemes; // the preview theme setting for note editor
}
