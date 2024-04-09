import { SyntheticEvent, useState, useRef } from "react";
import { Flex, Popover, Input, Button, ButtonProps } from "antd";
import { EditOutlined, CheckOutlined } from "@ant-design/icons";

interface NameEditProps {
  size: ButtonProps['size'],
  defaultValue: string;
  onChange: (event: SyntheticEvent) => void;
}

function NameEdit({ size, defaultValue, onChange }: NameEditProps) {
  const [open, setOpen] = useState(false);
  const [edited, setEdited] = useState(false);
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
        <Flex align="center">
          <Input
            ref={inputRef}
            allowClear
            defaultValue={defaultValue}
            style={{ width: 120 }}
            onChange={() => setEdited(true)}
            onPressEnter={emitEvent}
          />
          {edited && <Button type="link" icon={<CheckOutlined />} onClick={emitEvent} />}
        </Flex>
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