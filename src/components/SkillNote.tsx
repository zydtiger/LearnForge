import { KeyboardEventHandler, useEffect } from 'react';
import { FloatButton, Typography } from "antd";
import { CheckOutlined, UndoOutlined, RedoOutlined } from "@ant-design/icons";
import MDEditor from '@uiw/react-md-editor';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  selectPrevViewBeforeNote,
  selectViewMode,
  setViewMode
} from '../redux/slices/viewSlice';
import {
  selectNoteViewNode,
  selectIsNoteSaved,
  updateMarkdownNote,
  undo,
  redo,
  selectIsUndoable,
  selectIsRedoable
} from '../redux/slices/noteSlice';

function SkillNote() {
  const nodeDatum = useAppSelector(selectNoteViewNode);
  const isNoteSaved = useAppSelector(selectIsNoteSaved);
  const isUndoable = useAppSelector(selectIsUndoable);
  const isRedoable = useAppSelector(selectIsRedoable);

  const viewMode = useAppSelector(selectViewMode);
  const prevView = useAppSelector(selectPrevViewBeforeNote);

  const dispatch = useAppDispatch();

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key == 'Escape') {
      dispatch(setViewMode(prevView)); // quits note view
    }
  };

  useEffect(() => {
    // auto focus on the editor if note view is shown
    if (viewMode == 'note') {
      document.querySelector('textarea')?.focus();
    }
  }, [viewMode]);

  return (
    <div
      onKeyDown={handleKeyDown}
      data-color-mode="light"
      style={{ padding: 30 }}
    >
      <Typography.Title level={2} editable={true} style={{ top: 0, left: 0 }}>
        {nodeDatum.name}
      </Typography.Title>

      {/* Editor */}
      <MDEditor
        height={'calc(100vh - 145px)'}
        visibleDragbar={false}
        value={nodeDatum.mdNote}
        onChange={(val) => dispatch(updateMarkdownNote(val!))}
      />

      {/* Functional Btns */}
      <>
        {/* Save Btn */}
        <FloatButton
          type={isNoteSaved ? 'default' : 'primary'}
          style={{ right: 20, bottom: 20 }}
          tooltip="Done"
          icon={<CheckOutlined />}
        />

        {/* Undo / Redo Btns */}
        <FloatButton
          type={isUndoable ? "primary" : "default"}
          style={{ left: 20, bottom: 72 }}
          tooltip={"Undo ????"}
          icon={<UndoOutlined />}
          onClick={() => dispatch(undo())}
        />
        <FloatButton
          type={isRedoable ? "primary" : "default"}
          style={{ left: 20, bottom: 20 }}
          tooltip={"Redo"}
          icon={<RedoOutlined />}
          onClick={() => dispatch(redo())}
        />
      </>
    </div>
  );
}

export default SkillNote;