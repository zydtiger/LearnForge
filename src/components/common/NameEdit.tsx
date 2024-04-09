import { SyntheticEvent, useState, useRef } from "react";
import { Popover, Input, Button, ButtonProps } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface NameEditProps {
  size: ButtonProps['size'],
  defaultValue: string;
  onChange: (event: SyntheticEvent) => void;
}

function NameEdit({ size, defaultValue, onChange }: NameEditProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const emitEvent = (event: SyntheticEvent) => {
    setOpen(false);
    event.type = 'changeName';
    // @ts-ignore
    event.target.value = inputRef.current.input.value; // fake event.target.value for downstream processing
    onChange(event);
  };

  return (
    <Popover
      content={
        <Input
          ref={inputRef}
          allowClear
          defaultValue={defaultValue}
          style={{ width: 120 }}
          onPressEnter={emitEvent}
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