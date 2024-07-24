import { KeyboardEventHandler, useEffect } from "react";
import { FloatButton, Tooltip, Typography } from "antd";
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
import { selectNoteNodeId } from "../redux/slices/noteSlice";
import {
  selectSkillsetNodeById,
  selectIsSaved,
  selectLastSaveTime,
  selectIsUndoable,
  selectIsRedoable,
  setSkillsetNodeById,
  undo,
  redo,
} from "../redux/slices/skillsetSlice";
import { saveSkillset } from "../redux/thunks/skillsetThunks";

function SkillNote() {
  const nodeId = useAppSelector(selectNoteNodeId);
  const nodeDatum = useAppSelector((state) =>
    selectSkillsetNodeById(state, nodeId),
  )!;
  const isSaved = useAppSelector(selectIsSaved);
  const lastSaveTime = useAppSelector(selectLastSaveTime);
  const isUndoable = useAppSelector(selectIsUndoable);
  const isRedoable = useAppSelector(selectIsRedoable);

  const viewMode = useAppSelector(selectViewMode);
  const prevView = useAppSelector(selectPrevViewBeforeNote);

  const dispatch = useAppDispatch();

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

  const updateName = (val: string) => {
    dispatch(
      setSkillsetNodeById({
        id: nodeId,
        name: val,
      }),
    );
  };

  const updateMarkdownNote = (val: string) => {
    dispatch(
      setSkillsetNodeById({
        id: nodeId,
        mdNote: val,
      }),
    );
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      data-color-mode="light"
      style={{ padding: 30 }}
    >
      <Typography.Title
        level={2}
        editable={{
          onChange: updateName,
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
        onChange={updateMarkdownNote}
      />

      {/* Save Btn */}
      <Tooltip title={"Last Saved " + new Date(lastSaveTime).toLocaleString()}>
        <FloatButton
          type={isSaved ? "default" : "primary"}
          style={{ right: 20, bottom: 20 }}
          icon={<CheckOutlined />}
          onClick={() => {
            dispatch(saveSkillset());
            dispatch(setViewMode(prevView)); // quits note view
          }}
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
