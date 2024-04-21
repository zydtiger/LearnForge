import { KeyboardEventHandler, useEffect } from 'react';
import { Typography } from "antd";
import MDEditor from '@uiw/react-md-editor';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  selectPrevViewBeforeNote,
  selectViewMode,
  setViewMode
} from '../redux/slices/viewSlice';
import {
  selectNoteViewNode,
  updateMarkdownNote
} from '../redux/slices/noteSlice';

function SkillNote() {
  const nodeDatum = useAppSelector(selectNoteViewNode);
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
      <MDEditor
        height={'calc(100vh - 145px)'}
        value={nodeDatum.mdNote}
        onChange={(val) => dispatch(updateMarkdownNote(val!))}
      />
    </div>
  );
}

export default SkillNote;