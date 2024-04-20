import { Typography } from "antd";
import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { selectNoteViewNode } from '../redux/slices/viewSlice';

function SkillNote() {
  const nodeDatum = useAppSelector(selectNoteViewNode);
  const [value, setValue] = useState('');

  return (
    <div data-color-mode="light" style={{ padding: 30 }}>
      <Typography.Title level={2} editable={true} style={{ top: 0, left: 0 }}>
        {nodeDatum.name}
      </Typography.Title>
      <MDEditor
        value={value}
        onChange={(val) => setValue(val!)}
      />
    </div>
  );
}

export default SkillNote;