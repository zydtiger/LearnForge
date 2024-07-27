import { KeyboardEventHandler, useEffect } from "react";
import { FloatButton, Tooltip, Typography } from "antd";
import { CheckOutlined, UndoOutlined, RedoOutlined } from "@ant-design/icons";

// markdown
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "../assets/css/md-editor.css";

// redux
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectPrevViewBeforeNote,
  selectViewMode,
  setViewMode,
} from "../redux/slices/viewSlice";
import {
  selectNoteViewNode,
  selectIsNoteSaved,
  selectIsUndoable,
  selectIsRedoable,
  updateMarkdownNote,
  updateName,
  undo,
  redo,
} from "../redux/slices/noteSlice";
import {
  selectGlobalThemeAuto,
  selectMdPreviewTheme,
} from "../redux/slices/settingsSlice";
import { pushMessage } from "../redux/slices/messageSlice";
import { saveSkillset } from "../redux/thunks/skillsetThunks";
import { setSkillsetNodeById } from "../redux/slices/skillsetSlice";

function SkillNote() {
  const nodeDatum = useAppSelector(selectNoteViewNode);
  const isNoteSaved = useAppSelector(selectIsNoteSaved);
  const isUndoable = useAppSelector(selectIsUndoable);
  const isRedoable = useAppSelector(selectIsRedoable);

  const viewMode = useAppSelector(selectViewMode);
  const prevView = useAppSelector(selectPrevViewBeforeNote);
  const globalTheme = useAppSelector(selectGlobalThemeAuto);
  const previewTheme = useAppSelector(selectMdPreviewTheme);

  const dispatch = useAppDispatch();

  const handleDone = () => {
    dispatch(setViewMode(prevView)); // quits note view
    dispatch(setSkillsetNodeById(nodeDatum));
    dispatch(saveSkillset());
    dispatch(
      pushMessage({
        type: "success",
        content: "Successfully saved note!",
      }),
    );
  };

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key == "Escape") {
      dispatch(setViewMode(prevView)); // quits note view
    }
  };

  useEffect(() => {
    // auto focus on the editor if note view is shown
    if (viewMode == "note") {
      const div = document.querySelector("div[contenteditable='true']")!;
      const selection = window.getSelection()!;
      const range = document.createRange();
      range.selectNodeContents(div);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [viewMode]);

  return (
    <div
      onKeyDown={handleKeyDown}
      data-color-mode="light"
      style={{ padding: 30 }}
    >
      <Typography.Title
        level={2}
        editable={{
          onChange: (value) => {
            dispatch(updateName(value));
          },
        }}
        style={{ top: 0, left: 0 }}
      >
        {nodeDatum.name}
      </Typography.Title>

      {/* Editor */}
      <MdEditor
        theme={globalTheme}
        previewTheme={previewTheme}
        language="en-US"
        editorId="md-editor-rt"
        style={{
          height: "calc(100vh - 180px)",
        }}
        toolbarsExclude={["image", "revoke", "next", "save", "github"]}
        modelValue={nodeDatum.mdNote || ""}
        onChange={(val) => dispatch(updateMarkdownNote(val))}
      />

      {/* Save Btn */}
      <Tooltip title={"Done"}>
        <FloatButton
          type={isNoteSaved ? "default" : "primary"}
          style={{ right: 20, bottom: 20 }}
          icon={<CheckOutlined />}
          onClick={handleDone}
        />
      </Tooltip>

      {/* Undo / Redo Btns */}
      <Tooltip title={"Undo"}>
        <FloatButton
          type={isUndoable ? "primary" : "default"}
          style={{ left: 20, bottom: 20 }}
          icon={<UndoOutlined />}
          onClick={() => dispatch(undo())}
        />
      </Tooltip>
      <Tooltip title={"Redo"}>
        <FloatButton
          type={isRedoable ? "primary" : "default"}
          style={{ left: 72, bottom: 20 }}
          icon={<RedoOutlined />}
          onClick={() => dispatch(redo())}
        />
      </Tooltip>
    </div>
  );
}

export default SkillNote;
