import { Ref, useRef } from "react";
import Tree, { RawNodeDatum, TreeNodeDatum, CustomNodeElementProps, TreeNodeEventCallback } from "react-d3-tree";
import { Button, Flex, Input } from "antd";
import { NodeExpandOutlined, NodeCollapseOutlined } from '@ant-design/icons';

/* Augment the node datum to contain progress percentage */
declare module 'react-d3-tree' {
  export interface RawNodeDatum {
    progressPercent: number
  }
}

class SkillTreeClass extends Tree {
  /**
   * Handles the node click event:
   * 1) toggles expand/collapse
   * 2) changes title
   * 3) TODO: enters edit mode
   */
  handleNodeChange = ((node, event) => {
    const findNodeInTree = (currentNode: TreeNodeDatum, targetNode: TreeNodeDatum): TreeNodeDatum | null => {
      if (currentNode.__rd3t.id == targetNode.__rd3t.id) {
        return currentNode;
      }
      if (currentNode.children) {
        for (let child of currentNode.children) {
          const res = findNodeInTree(child, targetNode);
          if (res) return res;
        }
      }
      return null;
    }

    const dataClone = [...this.state.data]
    const nodeDatum = findNodeInTree(dataClone[0], node.data)!;

    if (event.type == 'click') {
      SkillTreeClass.handleNodeSubtreeToggle(nodeDatum)
    } else if (event.type == 'change') {
      SkillTreeClass.handleNodeNameChange(nodeDatum, (event.target as HTMLInputElement).value)
    }

    this.setState({ data: dataClone })

  }) as TreeNodeEventCallback;

  static handleNodeSubtreeToggle(nodeDatum: TreeNodeDatum) {
    if (nodeDatum.__rd3t.collapsed) {
      SkillTreeClass.expandNode(nodeDatum);
    } else {
      SkillTreeClass.collapseNode(nodeDatum);
    }
  }

  static handleNodeNameChange(nodeDatum: TreeNodeDatum, newName: string) {
    nodeDatum.name = newName;
  }

  /**
   * Expands recursively at the target node
   * @param nodeDatum target node
   */
  static override expandNode(nodeDatum: TreeNodeDatum): void {
    super.expandNode(nodeDatum);
    nodeDatum.children?.forEach(child => SkillTreeClass.expandNode(child))
  }

  /**
   * Generates custom node based on props
   * @param param0 custom node props
   * @returns svg for the custom node
   */
  static renderRectNode({ nodeDatum, onNodeClick }: CustomNodeElementProps): JSX.Element {
    return (
      <g>
        <rect width={150} height={50} x={-75} y={-25} fill="white" stroke="none" />
        <rect width={nodeDatum.progressPercent / 100 * 150} height={50} x={-75} y={-25} fill="#9cec5b" stroke="none" />
        <foreignObject x={-60} y={-14.5} width={90} height={30}>
          <Flex justify="center" align="center">
            <Input variant="outlined" defaultValue={nodeDatum.name} onChange={onNodeClick} width={80} height={20} />
          </Flex>
        </foreignObject>
        <text x={50} y={15} fill="black" strokeWidth={0.2} fontSize={10}>
          {Math.round(nodeDatum.progressPercent)}%
        </text>
        <rect width={150} height={50} x={-75} y={-25} fill="none" stroke="black" />
        {nodeDatum.children && <foreignObject x={80} y={-14.5} width={50} height={50}>
          <Button
            type="primary"
            shape="circle"
            icon={nodeDatum.__rd3t.collapsed ? <NodeExpandOutlined /> : <NodeCollapseOutlined />}
            onClick={onNodeClick}
          />
        </foreignObject>}
      </g>
    )
  }
}

function SkillTree({ data }: { data: RawNodeDatum }) {
  const tree: Ref<SkillTreeClass> = useRef(null)

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