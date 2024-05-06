import Tree, { TreeNodeDatum } from "react-d3-tree";

class SkillTreeInner extends Tree {
  /**
   * Finds the target node in the designated subtree.
   * @param currentNode root node of current subtree
   * @param targetId target id to find
   * @returns node if found, null if not found
   */
  findNodeInTree(
    currentNode: TreeNodeDatum,
    targetId: string,
  ): TreeNodeDatum | null {
    if (currentNode.__rd3t.id == targetId) {
      return currentNode;
    }
    if (currentNode.children) {
      for (let child of currentNode.children) {
        const res = this.findNodeInTree(child, targetId);
        if (res) return res;
      }
    }
    return null;
  }

  /**
   * Handles the toggle node event.
   */
  handleToggleNode(node: TreeNodeDatum) {
    const dataClone = [...this.state.data];
    const nodeDatum = this.findNodeInTree(dataClone[0], node.__rd3t.id)!;

    if (nodeDatum.__rd3t.collapsed) {
      SkillTreeInner.expandNode(nodeDatum);
    } else {
      SkillTreeInner.collapseNode(nodeDatum);
    }

    this.setState({ data: dataClone });
  }

  /**
   * Expands recursively at the target node.
   * @param nodeDatum target node
   */
  static override expandNode(nodeDatum: TreeNodeDatum): void {
    super.expandNode(nodeDatum);
    nodeDatum.children?.forEach((child) => SkillTreeInner.expandNode(child));
  }
}

export default SkillTreeInner;
