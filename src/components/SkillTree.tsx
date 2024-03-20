import { Ref, useRef } from "react";
import Tree, { RawNodeDatum, TreeNodeDatum, CustomNodeElementProps, TreeNodeEventCallback } from "react-d3-tree";
import { Button, Flex, Input, Popover } from "antd";
import { NodeExpandOutlined, NodeCollapseOutlined, EditOutlined } from '@ant-design/icons';
import NumEdit from "./NumEdit"; // replaces InputNumber

/* Augment the node datum to contain progress percentage */
declare module 'react-d3-tree' {
  export interface RawNodeDatum {
    progressPercent: number
  }
}

class SkillTreeClass extends Tree {
  /**
   * Handles the node click event:
   * 1) toggles expand/collapse.
   * 2) changes title.
   * 3) TODO: enters edit mode.
   */
  handleNodeChange = ((node, event) => {
    console.log(event)

    const dataClone = [...this.state.data]
    const nodeDatum = SkillTreeClass.findNodeInTree(dataClone[0], node.data)!;

    switch (event.type) {
      case 'toggleNode':
        if (nodeDatum.__rd3t.collapsed) {
          SkillTreeClass.expandNode(nodeDatum);
        } else {
          SkillTreeClass.collapseNode(nodeDatum);
        }
        break;

      case 'changePercent':
        nodeDatum.progressPercent = parseInt((event.target as HTMLInputElement).value)
        break;

      case 'changeName':
        nodeDatum.name = (event.target as HTMLInputElement).value;
        break;

      default:
        break;
    }

    this.setState({ data: dataClone })

  }) as TreeNodeEventCallback;

  /**
   * Finds the target node in the designated subtree.
   * @param currentNode root node of current subtree
   * @param targetNode target node to find
   * @returns node if found, null if not found
   */
  static findNodeInTree(currentNode: TreeNodeDatum, targetNode: TreeNodeDatum): TreeNodeDatum | null {
    if (currentNode.__rd3t.id == targetNode.__rd3t.id) {
      return currentNode;
    }
    if (currentNode.children) {
      for (let child of currentNode.children) {
        const res = SkillTreeClass.findNodeInTree(child, targetNode);
        if (res) return res;
      }
    }
    return null;
  }

  /**
   * Expands recursively at the target node.
   * @param nodeDatum target node
   */
  static override expandNode(nodeDatum: TreeNodeDatum): void {
    super.expandNode(nodeDatum);
    nodeDatum.children?.forEach(child => SkillTreeClass.expandNode(child))
  }

  /**
   * Generates custom node based on props.
   * @param param0 custom node props
   * @returns svg for the custom node
   */
  static renderRectNode({ nodeDatum, onNodeClick }: CustomNodeElementProps): JSX.Element {
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
          <Flex justify="flex-start" align="center">
            <b>{nodeDatum.name}</b>
            <Popover
              content={
                <Flex justify="space-between" align="center">
                  <b style={{ marginRight: 10 }}>Name:</b>
                  <Input
                    defaultValue={nodeDatum.name}
                    style={{ width: 120 }}
                    onChange={(event) => {
                      event.type = 'changeName';
                      onNodeClick(event);
                    }}
                  />
                </Flex>
              }
              trigger="click"
            >
              <Button type="link" size="middle" icon={<EditOutlined />} />
            </Popover>
          </Flex>
        </foreignObject>

        {/* Percentage */}
        <foreignObject x={width / 2 - 50} y={height / 2 - 30} width={40} height={20}>
          <Flex justify="space-between" align="center">
            <p style={{ width: 30, fontSize: 12 }}>{Math.round(nodeDatum.progressPercent)}%</p>
            <Popover
              placement="bottom"
              content={
                <Flex justify="space-between" align="center">
                  <b style={{ marginRight: 10 }}>Progress:</b>
                  <NumEdit
                    min={0}
                    max={100}
                    defaultValue={nodeDatum.progressPercent}
                    style={{ width: 65 }}
                    onChange={(event) => {
                      event.type = 'changePercent'
                      onNodeClick(event)
                    }}
                  />
                </Flex>
              }
              trigger="click"
            >
              <Button type="link" size="small" icon={<EditOutlined />} />
            </Popover>
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
    )
  }
}

function SkillTree({ data }: { data: RawNodeDatum }) {
  const tree: Ref<SkillTreeClass> = useRef(null);

  return (
    <SkillTreeClass
      ref={tree}
      data={data}
      renderCustomNodeElement={SkillTreeClass.renderRectNode}
      onNodeClick={(...params) => tree.current?.handleNodeChange(...params)}
      pathFunc="step"
      depthFactor={350}
    />
  )
}

export default SkillTree;