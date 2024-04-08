import { SyntheticEvent, useState } from "react";
import { Popover, Input, Button, ButtonProps } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface NameEditProps {
  size: ButtonProps['size'],
  defaultValue: string;
  onChange: (event: SyntheticEvent) => void;
}

function NameEdit({ size, defaultValue, onChange }: NameEditProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      content={
        <Input
          allowClear
          defaultValue={defaultValue}
          style={{ width: 120 }}
          onChange={(event) => {
            event.type = 'changeName';
            onChange(event);
          }}
          onPressEnter={() => setOpen(false)}
        />
      }
      open={open}
      onOpenChange={(newOpen) => setOpen(newOpen)}
      trigger="click"
    >
      <Button type="link" size={size} icon={<EditOutlined />} />
    </Popover>
  );
}

NameEdit.defaultProps = {
  size: 'middle',
  defaultValue: '',
  onChange: () => { }
};

export default NameEdit;