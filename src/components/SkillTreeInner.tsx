import Tree, { TreeNodeDatum } from "react-d3-tree";

interface CollapseState {
  collapsed: boolean;
  children?: CollapseState[];
}

class SkillTreeInner extends Tree {
  private isFrozen = false;

  /**
   * Freezes / unfreezes the rendering process.
   * @param frozen whether the tree should be frozen
   */
  setFrozen(frozen: boolean) {
    this.isFrozen = frozen;
  }

  /**
   * Determines whether the class component can re-render.
   * @returns whether the component can re-render
   */
  shouldComponentUpdate(): boolean {
    return !this.isFrozen;
  }

  /**
   * Finds the target node in the designated subtree.
   * @param currentNode root node of current subtree
   * @param targetId target id to find
   * @returns node if found, null if not found
   */
  findNodeInTree(currentNode: TreeNodeDatum, targetId: string): TreeNodeDatum | null {
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
  };

  /**
   * Sets the collapse state of the current tree.
   * @param collapseState collapse state to match
   */
  setCollapseState(collapseState: CollapseState) {
    const setCollapsedState = (node: TreeNodeDatum, currentState: CollapseState | undefined) => {
      node.__rd3t.collapsed = currentState?.collapsed || false;
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          setCollapsedState(node.children[i], currentState?.children?.[i]);
        }
      }
    };

    const dataClone = [...this.state.data];
    setCollapsedState(dataClone[0], collapseState);
    this.setState({ data: dataClone });
  }

  /**
   * Gets the collapse state of the current tree.
   * @returns current collapse state
   */
  geteCollapseState(): CollapseState {
    const getCollapsedState = (node: TreeNodeDatum): CollapseState => {
      const state: CollapseState = {
        collapsed: node.__rd3t.collapsed
      };
      if (node.children) {
        state.children = node.children.map((value) => getCollapsedState(value));
      }
      return state;
    };

    const rootNode = this.state.data[0];
    return getCollapsedState(rootNode);
  }

  /**
   * Expands recursively at the target node.
   * @param nodeDatum target node
   */
  static override expandNode(nodeDatum: TreeNodeDatum): void {
    super.expandNode(nodeDatum);
    nodeDatum.children?.forEach(child => SkillTreeInner.expandNode(child));
  }
}

export default SkillTreeInner;