import { SyntheticEvent, useState } from "react";
import { Popover, Input, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface NameEditProps {
  defaultValue: string;
  onChange: (event: SyntheticEvent) => void;
}

function NameEdit({ defaultValue, onChange }: NameEditProps) {
  const [open, setOpen] = useState(false)

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
      <Button type="link" size="middle" icon={<EditOutlined />} />
    </Popover>
  );
}

NameEdit.defaultProps = {
  defaultValue: '',
  onChange: () => { }
};

export default NameEdit;