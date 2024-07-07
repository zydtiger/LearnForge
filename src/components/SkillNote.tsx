import { KeyboardEventHandler, useEffect } from "react";
import { FloatButton, Typography } from "antd";
import { CheckOutlined, UndoOutlined, RedoOutlined } from "@ant-design/icons";

// markdown
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "../md-editor.css";

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
import { setSkillsetNodeById } from "../redux/slices/skillsetSlice";

function SkillNote() {
  const nodeDatum = useAppSelector(selectNoteViewNode);
  const isNoteSaved = useAppSelector(selectIsNoteSaved);
  const isUndoable = useAppSelector(selectIsUndoable);
  const isRedoable = useAppSelector(selectIsRedoable);

  const viewMode = useAppSelector(selectViewMode);
  const prevView = useAppSelector(selectPrevViewBeforeNote);

  const dispatch = useAppDispatch();

  const handleDone = () => {
    dispatch(setSkillsetNodeById(nodeDatum));
    dispatch(setViewMode(prevView)); // quits note view
  };

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key == "Escape") {
      dispatch(setViewMode(prevView)); // quits note view
    }
  };

  useEffect(() => {
    // auto focus on the editor if note view is shown
    if (viewMode == "note") {
      document.querySelector("textarea")?.focus();
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
        theme="light"
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
      <FloatButton
        type={isNoteSaved ? "default" : "primary"}
        style={{ right: 20, bottom: 20 }}
        tooltip="Done"
        icon={<CheckOutlined />}
        onClick={handleDone}
      />

      {/* Undo / Redo Btns */}
      <FloatButton
        type={isUndoable ? "primary" : "default"}
        style={{ left: 20, bottom: 20 }}
        tooltip={"Undo"}
        icon={<UndoOutlined />}
        onClick={() => dispatch(undo())}
      />
      <FloatButton
        type={isRedoable ? "primary" : "default"}
        style={{ left: 72, bottom: 20 }}
        tooltip={"Redo"}
        icon={<RedoOutlined />}
        onClick={() => dispatch(redo())}
      />
    </div>
  );
}

export default SkillNote;
