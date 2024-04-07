import { RawNodeDatum } from "react-d3-tree";
import { Flex, Popover, Button, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { SyntheticEvent } from "react";
import PercentEdit from "./common/PercentEdit";
import DeleteBtn from "./common/DeleteBtn";

interface SkillListNodeProps {
  nodeDatum: RawNodeDatum,
  onChange: (event: SyntheticEvent) => void;
}

function SkillListNode({ nodeDatum, onChange }: SkillListNodeProps) {
  return (
    <Flex align="center">
      {/* Title */}
      <p>{nodeDatum.name}</p>
      <Popover
        content={
          <Input
            defaultValue={nodeDatum.name}
            style={{ width: 120 }}
            onChange={(event) => {
              event.type = 'changeName';
              onChange(event);
            }}
          />
        }
        trigger="click"
      >
        <Button type="link" size="small" icon={<EditOutlined />} />
      </Popover>

      {/* Progress Bar */}
      <svg width={60} height={5} xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect width={60} height={5} fill="lightgray" />
          <rect width={nodeDatum.progressPercent / 100 * 60} height={5} fill="#87cc4f" />
        </g>
      </svg>

      {/* Progress Label */}
      <p style={{ marginLeft: 10 }}>{Math.round(nodeDatum.progressPercent)}%</p>
      <PercentEdit defaultValue={nodeDatum.progressPercent} onChange={onChange} /> :

      {/* Delete Btn */}
      <DeleteBtn type="link" onClick={onChange} />

    </Flex>
  );
}

export default SkillListNode;