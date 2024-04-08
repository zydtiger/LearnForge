import { RawNodeDatum } from "react-d3-tree";
import { Flex } from 'antd';
import { SyntheticEvent } from "react";
import NameEdit from "./common/NameEdit";
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
      <NameEdit defaultValue={nodeDatum.name} onChange={onChange} />

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