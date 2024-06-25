import { CustomNodeElementProps } from "react-d3-tree";
import { Flex, Button, Tooltip } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import NameEdit from "./common/NameEdit";
import PercentEdit from "./common/PercentEdit";
import DeleteBtn from "./common/DeleteBtn";
import ClearBtn from "./common/ClearBtn";
import { calcProgressColor } from "../constants/color";

function SkillTreeNode({
  nodeDatum,
  hierarchyPointNode,
  onNodeClick,
}: CustomNodeElementProps) {
  const maxWidth = 250;
  const width = Math.min(nodeDatum.name.length * 8 + 100, maxWidth);
  const height = 75;
  const isLeafNode = !nodeDatum.children || nodeDatum.children.length == 0;
  const isRootNode = hierarchyPointNode.parent == null;
  const isCollapsed = nodeDatum.__rd3t.collapsed;

  return (
    <g
      onClick={(event) => {
        if (event.detail == 2) {
          // this means a double click on the node
          event.type = "triggerNote";
          setTimeout(() => onNodeClick(event)); // solves node rendering error by queueing
        }
      }}
      onMouseMove={(event) => {
        event.type = "openFloatNote";
        onNodeClick(event);
      }}
      onMouseLeave={(event) => {
        event.type = "closeFloatNote";
        onNodeClick(event);
      }}
    >
      {/* Background */}
      <rect
        width={width}
        height={height}
        x={-width / 2}
        y={-height / 2}
        fill="white"
        stroke="none"
      />

      {/* Progress Bar */}
      <rect
        width={(nodeDatum.progressPercent / 100) * width}
        height={height}
        x={-width / 2}
        y={-height / 2}
        fill={calcProgressColor(nodeDatum.progressPercent)}
        stroke="none"
      />

      {/* Title */}
      <foreignObject
        className="title"
        x={-width / 2 + 10}
        y={-height / 2 + 10}
        width={width - 30}
        height={60}
      >
        <Flex align="center">
          <Tooltip title={nodeDatum.name}>
            <p
              style={{
                fontWeight: isLeafNode ? "normal" : "600",
                maxWidth: width - 80,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {nodeDatum.name}
            </p>
          </Tooltip>
          <NameEdit defaultValue={nodeDatum.name} onChange={onNodeClick} />
        </Flex>
      </foreignObject>

      {/* Percentage */}
      <foreignObject
        className="percentage"
        x={width / 2 - 55}
        y={height / 2 - 30}
        width={50}
        height={20}
      >
        <Flex justify="flex-end" align="center">
          <p style={{ fontSize: 12 }}>
            {Math.round(nodeDatum.progressPercent)}%
          </p>
          {/* Only allow percentage change if at leaf node */}
          {
            isLeafNode ? (
              <PercentEdit
                defaultValue={nodeDatum.progressPercent}
                onChange={onNodeClick}
              />
            ) : (
              <div style={{ width: 10 }}></div>
            ) // placeholder for aligning percentage label
          }
        </Flex>
      </foreignObject>

      {/* Delete Btn */}
      {!isRootNode && (
        <foreignObject
          x={width / 2 - 45}
          y={-height / 2 - 5}
          width={50}
          height={50}
        >
          <Flex
            justify="center"
            align="center"
            style={{ width: "100%", height: "100%" }}
          >
            <DeleteBtn onClick={onNodeClick} />
          </Flex>
        </foreignObject>
      )}

      {/* Clear Btn */}
      {isRootNode && (
        <foreignObject
          x={width / 2 - 45}
          y={-height / 2 - 5}
          width={50}
          height={50}
        >
          <Flex
            justify="center"
            align="center"
            style={{ width: "100%", height: "100%" }}
          >
            <ClearBtn onClick={onNodeClick} />
          </Flex>
        </foreignObject>
      )}

      {/* Border */}
      <rect
        width={width}
        height={height}
        x={-width / 2}
        y={-height / 2}
        fill="none"
        stroke="black"
      />

      {/* Expand / Collapse Btn */}
      {!isLeafNode && (
        <foreignObject x={width / 2 - 10} y={-25} width={50} height={50}>
          <Flex
            justify="center"
            align="center"
            style={{ width: "100%", height: "100%" }}
          >
            <Button
              type="primary"
              size="small"
              shape="circle"
              danger={!isCollapsed}
              icon={isCollapsed ? <PlusOutlined /> : <MinusOutlined />}
              onClick={(event) => {
                event.type = "toggleNode";
                onNodeClick(event);
              }}
            />
          </Flex>
        </foreignObject>
      )}

      {/* Add Btn */}
      {!isCollapsed && (
        <foreignObject
          x={isLeafNode ? width / 2 - 10 : 150}
          y={-25}
          width={50}
          height={50}
        >
          <Flex
            justify="center"
            align="center"
            style={{ width: "100%", height: "100%" }}
          >
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={(event) => {
                event.type = "addNode";
                onNodeClick(event);
              }}
            />
          </Flex>
        </foreignObject>
      )}
    </g>
  );
}

export default SkillTreeNode;
