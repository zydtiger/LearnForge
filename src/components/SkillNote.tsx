import { KeyboardEventHandler } from 'react';
import { Typography } from "antd";
import MDEditor from '@uiw/react-md-editor';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  selectNoteViewNode,
  selectPrevViewBeforeNote,
  setViewMode,
  updateMarkdownNote
} from '../redux/slices/viewSlice';

function SkillNote() {
  const nodeDatum = useAppSelector(selectNoteViewNode);
  const prevView = useAppSelector(selectPrevViewBeforeNote);
  const dispatch = useAppDispatch();

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key == 'Escape') {
      dispatch(setViewMode(prevView)); // quits note view
    }
  };

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
        value={nodeDatum.mdNote}
        onChange={(val) => dispatch(updateMarkdownNote(val!))}
      />
    </div>
  );
}

export default SkillNote;