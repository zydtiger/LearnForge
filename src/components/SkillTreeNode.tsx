import { CustomNodeElementProps } from "react-d3-tree";
import { Flex, Button } from 'antd';
import { PlusOutlined, MinusOutlined, PlusSquareOutlined } from '@ant-design/icons';
import NameEdit from "./common/NameEdit";
import PercentEdit from "./common/PercentEdit";
import DeleteBtn from "./common/DeleteBtn";

function SkillTreeNode({ nodeDatum, hierarchyPointNode, onNodeClick }: CustomNodeElementProps) {
  const width = 180;
  const height = 75;
  const isLeafNode = !nodeDatum.children || nodeDatum.children.length == 0;
  const isRootNode = hierarchyPointNode.parent == null;
  const isCollapsed = nodeDatum.__rd3t.collapsed;

  return (
    <g>
      {/* Background */}
      <rect width={width} height={height} x={-width / 2} y={-height / 2} fill="white" stroke="none" />

      {/* Progress Bar */}
      <rect width={nodeDatum.progressPercent / 100 * width} height={height} x={-width / 2} y={-height / 2} fill="#9cec5b" stroke="none" />

      {/* Title */}
      <foreignObject x={-width / 2 + 10} y={-height / 2 + 10} width={120} height={60}>
        <p style={{ fontWeight: isLeafNode ? 'normal' : '600', width: '100%', wordWrap: 'normal' }}>
          {nodeDatum.name}
          <NameEdit defaultValue={nodeDatum.name} onChange={onNodeClick} />
        </p>
      </foreignObject>

      {/* Percentage */}
      <foreignObject x={width / 2 - 55} y={height / 2 - 30} width={50} height={20}>
        <Flex justify="flex-end" align="center">
          <p style={{ fontSize: 12 }}>{Math.round(nodeDatum.progressPercent)}%</p>
          {/* Only allow percentage change if at leaf node */}
          {isLeafNode ?
            <PercentEdit defaultValue={nodeDatum.progressPercent} onChange={onNodeClick} /> :
            <div style={{ width: 10 }}></div> // placeholder for aligning percentage label
          }
        </Flex>
      </foreignObject>

      {/* Delete Btn */}
      {!isRootNode &&
        <foreignObject x={width / 2 - 45} y={-height / 2 - 5} width={50} height={50}>
          <Flex justify="center" align="center" style={{ width: '100%', height: '100%' }}>
            <DeleteBtn onClick={onNodeClick} />
          </Flex>
        </foreignObject>
      }

      {/* Border */}
      <rect width={width} height={height} x={-width / 2} y={-height / 2} fill="none" stroke="black" />

      {/* Expand / Collapse Btn */}
      {!isLeafNode &&
        <foreignObject x={width / 2 - 10} y={-25} width={50} height={50}>
          <Flex justify="center" align="center" style={{ width: '100%', height: '100%' }}>
            <Button
              type="primary"
              size="small"
              shape="circle"
              danger={!isCollapsed}
              icon={isCollapsed ? <PlusOutlined /> : <MinusOutlined />}
              onClick={(event) => {
                event.type = 'toggleNode';
                onNodeClick(event);
              }}
            />
          </Flex>
        </foreignObject>
      }

      {/* Add Btn */}
      {!isCollapsed &&
        <foreignObject x={isLeafNode ? width / 2 - 10 : width / 2 + 60} y={-25} width={50} height={50}>
          <Flex justify="center" align="center" style={{ width: '100%', height: '100%' }}>
            <Button
              type="primary"
              size="small"
              icon={<PlusSquareOutlined />}
              onClick={(event) => {
                event.type = 'addNode';
                onNodeClick(event);
              }}
            />
          </Flex>
        </foreignObject>
      }
    </g>
  );
}

export default SkillTreeNode;