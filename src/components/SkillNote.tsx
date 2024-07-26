import { KeyboardEventHandler, useEffect, useState } from "react";
import { Button, FloatButton, Modal, Tooltip, Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";

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
  setSkillsetNodeById,
} from "../redux/slices/skillsetSlice";
import { saveSkillset } from "../redux/thunks/skillsetThunks";

function SkillNote() {
  const nodeId = useAppSelector(selectNoteNodeId);
  const nodeDatum = useAppSelector((state) =>
    selectSkillsetNodeById(state, nodeId),
  )!;
  const isSaved = useAppSelector(selectIsSaved);
  const lastSaveTime = useAppSelector(selectLastSaveTime);

  const viewMode = useAppSelector(selectViewMode);
  const prevView = useAppSelector(selectPrevViewBeforeNote);

  const dispatch = useAppDispatch();

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key == "Escape") {
      if (!isSaved) {
        setIsSaveModalOpen(true);
      } else {
        dispatch(setViewMode(prevView)); // quits note view
      }
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
          height: isSaved ? "calc(100vh - 140px)" : "calc(100vh - 180px)",
        }}
        toolbarsExclude={["image", "save", "revoke", "next", "github"]}
        modelValue={nodeDatum.mdNote || ""}
        onChange={(val) => setTimeout(() => updateMarkdownNote(val))} // delays op to let undo/redo do job first
      />

      {/* Save Btn */}
      {!isSaved && (
        <Tooltip
          title={"Last Saved " + new Date(lastSaveTime).toLocaleString()}
        >
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
      )}

      <Modal
        centered
        open={isSaveModalOpen}
        footer={
          <>
            <Button onClick={() => setIsSaveModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => {
                setIsSaveModalOpen(false);
                dispatch(saveSkillset());
                dispatch(setViewMode(prevView));
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <b>Your note is not safely saved to the disk, do you want to quit?</b>
        <br />
        <span style={{ textDecoration: "underline" }}>Note</span>: This doesn't
        mean your note is not saved: it is only saved in the memory.
      </Modal>
    </div>
  );
}

export default SkillNote;
