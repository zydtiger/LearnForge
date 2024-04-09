import { Popconfirm, Button, ButtonProps } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { SyntheticEvent } from "react";

interface ClearBtnProps {
  type: ButtonProps['type'];
  onClick: (event: SyntheticEvent) => void;
}

function ClearBtn({ type, onClick }: ClearBtnProps) {
  return (
    <Popconfirm
      title="Clear"
      description="Are you sure to clear everything?"
      onConfirm={(event) => {
        event!.type = 'clear';
        onClick(event!);
      }}
      okText="Yes"
      cancelText="Cancel"
    >
      <Button
        type={type}
        size="small"
        danger
        icon={<ClearOutlined />}
      />
    </Popconfirm>
  );
}

ClearBtn.defaultProps = {
  type: 'default',
  onClick: () => { },
};

export default ClearBtn;