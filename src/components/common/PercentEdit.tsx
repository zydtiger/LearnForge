import { SyntheticEvent, useState } from "react";
import { Button, Flex, Popover } from "antd";
import { EditOutlined, CheckOutlined } from "@ant-design/icons";
import SliderInput from "../SliderInput"; // replaces standard antd components

interface PercentEditProps {
  defaultValue: number;
  onChange: (event: SyntheticEvent) => void;
}

function PercentEdit({ defaultValue, onChange }: PercentEditProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      placement="bottom"
      content={
        <Flex align="center">
          <SliderInput
            defaultValue={defaultValue}
            style={{
              slider: { width: 100 },
              input: { width: 65 }
            }}
            onChange={(event) => {
              event.type = 'changePercent';
              onChange(event);
            }}
            onPressEnter={() => setOpen(false)}
          />
          <Button type="link" icon={<CheckOutlined />} onClick={(event) => {
            setOpen(false);
            event.type = 'changePercent';
            // @ts-ignore
            event.target.value = 100; // fake event.target.value for downstream processing
            onChange(event);
          }} />
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