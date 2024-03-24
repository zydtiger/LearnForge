import { CustomNodeElementProps } from "react-d3-tree";
import { Flex, Input, Popover, Button } from 'antd';
import { NodeExpandOutlined, NodeCollapseOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import SliderInput from "./SliderInput"; // replaces standard antd components

function SkillTreeNode({ nodeDatum, hierarchyPointNode, onNodeClick }: CustomNodeElementProps) {
  const width = 180;
  const height = 65;
  const isLeafNode = !nodeDatum.children || nodeDatum.children.length == 0;
  const isRootNode = hierarchyPointNode.parent == null

  return (
    <g>
      {/* Background */}
      <rect width={width} height={height} x={-width / 2} y={-height / 2} fill="white" stroke="none" />

      {/* Progress Bar */}
      <rect width={nodeDatum.progressPercent / 100 * width} height={height} x={-width / 2} y={-height / 2} fill="#9cec5b" stroke="none" />

      {/* Title */}
      <foreignObject x={-width / 2 + 10} y={-height / 2 + 10} width={90} height={30}>
        <Flex align="center">
          <p style={{ fontWeight: isLeafNode ? 'normal' : '600' }}>{nodeDatum.name}</p>
          <Popover
            content={
              <Input
                defaultValue={nodeDatum.name}
                style={{ width: 120 }}
                onChange={(event) => {
                  event.type = 'changeName';
                  onNodeClick(event);
                }}
              />
            }
            trigger="click"
          >
            <Button type="link" size="middle" icon={<EditOutlined />} />
          </Popover>
        </Flex>
      </foreignObject>

      {/* Percentage */}
      <foreignObject x={width / 2 - 55} y={height / 2 - 30} width={50} height={20}>
        <Flex justify="flex-end" align="center">
          <p style={{ fontSize: 12 }}>{Math.round(nodeDatum.progressPercent)}%</p>
          {/* Only allow percentage change if at leaf node */}
          {isLeafNode ?
            <Popover
              placement="bottom"
              content={
                <SliderInput
                  min={0}
                  max={100}
                  defaultValue={nodeDatum.progressPercent}
                  style={{
                    slider: { width: 100 },
                    input: { width: 65 }
                  }}
                  onChange={(event) => {
                    event.type = 'changePercent';
                    onNodeClick(event);
                  }}
                />
              }
              trigger="click"
            >
              <Button type="link" size="small" icon={<EditOutlined />} />
            </Popover> :
            <div style={{ width: 10 }}></div> // placeholder for aligning percentage label
          }
        </Flex>
      </foreignObject>

      {/* Delete Btn */}
      {!isRootNode &&
        <foreignObject x={width / 2 - 45} y={-height / 2 - 5} width={50} height={50}>
          <Flex justify="center" align="center" style={{ width: '100%', height: '100%' }}>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={(event) => {
                event.type = 'deleteNode';
                onNodeClick(event);
              }}
            />
          </Flex>
        </foreignObject>
      }

      {/* Border */}
      <rect width={width} height={height} x={-width / 2} y={-height / 2} fill="none" stroke="black" />

      {/* Expand / Collapse Btn */}
      {!isLeafNode &&
        <foreignObject x={width / 2 + 5} y={-16} width={50} height={50}>
          <Button
            type="primary"
            shape="circle"
            icon={nodeDatum.__rd3t.collapsed ? <NodeExpandOutlined /> : <NodeCollapseOutlined />}
            onClick={(event) => {
              event.type = 'toggleNode';
              onNodeClick(event);
            }}
          />
        </foreignObject>
      }
    </g>
  );
}

export default SkillTreeNode;