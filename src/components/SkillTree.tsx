import { Ref, useRef } from "react";
import Tree, { RawNodeDatum, TreeNodeDatum, CustomNodeElementProps, TreeNodeEventCallback } from "react-d3-tree";

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
   * 2) TODO: changes title
   * 3) TODO: enters edit mode
   */
  handleNodeClick = ((node, event) => {

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

    if (nodeDatum.__rd3t.collapsed) {
      SkillTreeClass.expandNode(nodeDatum);
    } else {
      SkillTreeClass.collapseNode(nodeDatum);
    }
    
    this.setState({ data: dataClone })

  }) as TreeNodeEventCallback;

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
      <g onClick={onNodeClick}>
        <rect width={150} height={50} x={-75} y={-25} fill="white" stroke="none" />
        <rect width={nodeDatum.progressPercent / 100 * 150} height={50} x={-75} y={-25} fill="#9cec5b" stroke="none" />
        <text x={-60} y={6} fill="black" strokeWidth={1}>
          {nodeDatum.name}
        </text>
        <text x={50} y={15} fill="black" strokeWidth={1} fontSize={10}>
          {Math.round(nodeDatum.progressPercent)}%
        </text>
        <rect width={150} height={50} x={-75} y={-25} fill="none" stroke="black" />
      </g>
    )
  }
}

function SkillTree({data}: {data: RawNodeDatum}) {
  const tree: Ref<SkillTreeClass> = useRef(null)

  return (
    <SkillTreeClass
      ref={tree}
      data={data}
      renderCustomNodeElement={SkillTreeClass.renderRectNode}
      onNodeClick={(...params) => tree.current?.handleNodeClick(...params)}
      pathFunc="step"
      depthFactor={350}
    />
  )
}

export default SkillTree;