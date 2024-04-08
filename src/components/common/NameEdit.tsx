import { SyntheticEvent } from "react";
import { Popover, Input, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface NameEditProps {
  defaultValue: string;
  onChange: (event: SyntheticEvent) => void;
}

function NameEdit({ defaultValue, onChange }: NameEditProps) {
  return (
    <Popover
      content={
        <Input
          defaultValue={defaultValue}
          style={{ width: 120 }}
          onChange={(event) => {
            event.type = 'changeName';
            onChange(event);
          }}
        />
      }
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