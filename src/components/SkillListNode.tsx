import { RawNodeDatum } from "react-d3-tree";
import { Flex } from 'antd';

function SkillListNode({ name, progressPercent }: RawNodeDatum) {
  return (
    <Flex align="center">
      <p style={{ marginRight: 10 }}>{name}</p>
      <svg width={60} height={5} xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect width={60} height={5} fill="lightgray" />
          <rect width={progressPercent / 100 * 60} height={5} fill="#87cc4f" />
        </g>
      </svg>
      <p style={{ marginLeft: 10 }}>{Math.round(progressPercent)}%</p>
    </Flex>
  );
}

export default SkillListNode;