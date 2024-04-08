import { SyntheticEvent, useState } from "react";
import { Button, Popover } from "antd";
import { EditOutlined } from "@ant-design/icons";
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