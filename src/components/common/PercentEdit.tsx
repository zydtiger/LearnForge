import { SyntheticEvent, useState } from "react";
import { Button, Flex, Popover, Slider, InputNumber } from "antd";
import { EditOutlined, CheckOutlined } from "@ant-design/icons";

interface PercentEditProps {
  defaultValue: number;
  onChange: (event: SyntheticEvent) => void;
}

function PercentEdit({ defaultValue, onChange }: PercentEditProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  const emitEvent = (event: SyntheticEvent, value: number) => {
    setOpen(false);
    event.type = 'changePercent';
    // @ts-ignore
    event.target.value = value; // fake event.target.value for downstream processing
    onChange(event);
  };

  return (
    <Popover
      placement="bottom"
      content={
        <Flex align="center">
          <Slider
            min={0}
            max={100}
            value={value}
            style={{ width: 100, marginRight: 10 }}
            onChange={setValue} />
          <InputNumber
            min={0}
            max={100}
            value={value}
            style={{ width: 65 }}
            onChange={(value) => setValue(value ?? 0)}
            onPressEnter={(event) => emitEvent(event, value)}
          />
          <Button type="link" icon={<CheckOutlined />} onClick={(event) => emitEvent(event, 100)} />
        </Flex>
      }
      open={open}
      onOpenChange={(newOpen) => setOpen(newOpen)}
      trigger="click"
    >
      <Button type="link" size="small" icon={<EditOutlined />} />
    </Popover>
  );
}

PercentEdit.defaultProps = {
  defaultValue: 0,
  onChange: () => { },
};

export default PercentEdit;