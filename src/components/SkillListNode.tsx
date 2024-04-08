import { RawNodeDatum } from "react-d3-tree";
import { Button, Flex, Progress } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { SyntheticEvent } from "react";
import NameEdit from "./common/NameEdit";
import PercentEdit from "./common/PercentEdit";
import DeleteBtn from "./common/DeleteBtn";
import { calcProgressColor } from "../constants/color";

interface SkillListNodeProps {
  nodeDatum: RawNodeDatum,
  onChange: (event: SyntheticEvent) => void;
}

function SkillListNode({ nodeDatum, onChange }: SkillListNodeProps) {
  return (
    <Flex align="center">
      {/* Add Btn */}
      <Button
        type="link"
        size="small"
        icon={<PlusOutlined />}
        onClick={(event) => {
          event.type = 'addNode';
          onChange(event);
        }}
      />

      {/* Title */}
      <p>{nodeDatum.name}</p>
      <NameEdit size="small" defaultValue={nodeDatum.name} onChange={onChange} />

      {/* Progress Bar */}
      <Progress
        percent={Math.round(nodeDatum.progressPercent)}
        size="small"
        strokeColor={calcProgressColor(nodeDatum.progressPercent)}
        style={{ width: '100px' }}
      />

      {/* Progress Label */}
      <PercentEdit defaultValue={nodeDatum.progressPercent} onChange={onChange} />

      {/* Delete Btn */}
      <DeleteBtn type="link" onClick={onChange} />

    </Flex>
  );
}

export default SkillListNode;