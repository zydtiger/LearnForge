import { Typography } from "antd";
import MDEditor from '@uiw/react-md-editor';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectNoteViewNode, updateMarkdownNote } from '../redux/slices/viewSlice';

function SkillNote() {
  const nodeDatum = useAppSelector(selectNoteViewNode);
  const dispatch = useAppDispatch();

  return (
    <div data-color-mode="light" style={{ padding: 30 }}>
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