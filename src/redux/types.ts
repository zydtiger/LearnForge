import { ArgsProps } from "antd/es/message";
import { PreviewThemes } from "md-editor-rt";
import { SkillsetRawNode } from "@/types";

export interface MessageState {
  messageQueue: ArgsProps[]; // global message queue
}

export interface NoteState {
  noteViewNode: SkillsetRawNode; // the current node to edit in note view
  isNoteSaved: boolean; // whether the current note is saved into skillset tree
  isHovered: boolean; // whether the node should display a floating note view
  mouseCoords: [number, number]; // the mouse coordinates of floating note view
}

export interface SettingsState {
  isAutoSave: boolean;
  globalTheme: "light" | "dark" | "system"; // the global theme setting
  mdPreviewTheme: PreviewThemes; // the preview theme setting for note editor

  // fields below should not be persisted
  isSettingsOpen: boolean; // whether settings modal is open
}

export interface SkillsetState {
  data: SkillsetRawNode; // skillset data
  isInitialBoot: boolean; // whether to show manual modal on app opening
  lastSaveTime: string; // ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)

  // fields below should not be persisted
  isFirstTimeLoading: boolean; // whether to show loading page
  isSaved: boolean; // whether the current state is persisted
  selectedNodeId: SkillsetRawNode["id"] | null; // currently selected node id by single click
}

export type ViewMode = "tree" | "list" | "note";

export interface ViewState {
  viewMode: ViewMode; // determines the current view
  isManualModalOpen: boolean; // whether manual modal is open
  prevViewBeforeNote: ViewMode; // the previous view mode before note view
}

export interface RootState {
  settings: SettingsState;
  view: ViewState;
  message: MessageState;
  skillset: SkillsetState;
  note: NoteState;
}
