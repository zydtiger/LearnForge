import { CustomNodeElementProps } from "react-d3-tree";
import { Flex, Input, Popover, Button } from 'antd';
import { NodeExpandOutlined, NodeCollapseOutlined, EditOutlined } from '@ant-design/icons';
import SliderInput from "./SliderInput"; // replaces standard antd components

function SkillTreeNode({ nodeDatum, onNodeClick }: CustomNodeElementProps) {
  const width = 180;
  const height = 65;

  return (
    <g>
      {/* Background */}
      <rect width={width} height={height} x={-width / 2} y={-height / 2} fill="white" stroke="none" />

      {/* Progress Bar */}
      <rect width={nodeDatum.progressPercent / 100 * width} height={height} x={-width / 2} y={-height / 2} fill="#9cec5b" stroke="none" />

      {/* Title */}
      <foreignObject x={-width / 2 + 10} y={-height / 2 + 10} width={90} height={30}>
        <Flex align="center">
          <p style={{fontWeight: nodeDatum.children ? '600' : 'normal'}}>{nodeDatum.name}</p>
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
          {!nodeDatum.children ?
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

      {/* Border */}
      <rect width={width} height={height} x={-width / 2} y={-height / 2} fill="none" stroke="black" />

      {/* Expand / Collapse Btn */}
      {nodeDatum.children &&
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