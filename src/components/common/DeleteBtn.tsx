import { Popconfirm, Button, ButtonProps } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { SyntheticEvent } from "react";

interface DeleteBtnProps {
  type: ButtonProps['type'];
  onClick: (event: SyntheticEvent) => void;
}

function DeleteBtn({ type, onClick }: DeleteBtnProps) {
  return (
    <Popconfirm
      title="Delete"
      description="Are you sure to delete this node?"
      onConfirm={(event) => {
        event!.type = 'deleteNode';
        onClick(event!);
      }}
      okText="Yes"
      cancelText="Cancel"
    >
      <Button
        type={type}
        size="small"
        danger
        icon={<DeleteOutlined />}
      />
    </Popconfirm>
  );
}

DeleteBtn.defaultProps = {
  type: 'default',
  onClick: () => { },
};

export default DeleteBtn;