import Tree, { RawNodeDatum, TreeNodeDatum, TreeProps } from "react-d3-tree";

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
   * Handles the node click event:
   * 1) toggles expand/collapse.
   * 2) changes title.
   * 3) changes percentage.
   */
  handleNodeChange: TreeProps['onNodeClick'] = (node, event): TreeNodeDatum | null => {
    const dataClone = [...this.state.data];
    const nodeDatum = SkillTreeInner.findNodeInTree(dataClone[0], node.data);

    if (!nodeDatum) {
      return null;
    }

    let isTreeDataModified = true;

    switch (event.type) {
      case 'toggleNode':
        if (nodeDatum.__rd3t.collapsed) {
          SkillTreeInner.expandNode(nodeDatum);
        } else {
          SkillTreeInner.collapseNode(nodeDatum);
        }
        isTreeDataModified = false;
        break;

      case 'changePercent':
        nodeDatum.progressPercent = Number((event.target as HTMLInputElement).value);
        SkillTreeInner.updatePercentages(dataClone[0]); // triggers update cascade
        break;

      case 'changeName':
        nodeDatum.name = (event.target as HTMLInputElement).value;
        break;

      default:
        break;
    }

    if (isTreeDataModified) {
      return dataClone[0]; // expose altered root node for re-rendering
    }

    this.setState({ data: dataClone });
    return null;
  };

  /**
 * Updates percentages at node by calling
 * the recursive inner function.
 */
  static updatePercentages(nodeDatum: TreeNodeDatum) {
    const generatePercentagesAtNode = (nodeDatum: RawNodeDatum): number => {
      if (nodeDatum.children) {
        const childrenPercentageSum = nodeDatum.children.reduce((acc: number, current: RawNodeDatum) => {
          return acc + generatePercentagesAtNode(current);
        }, 0);
        nodeDatum.progressPercent = childrenPercentageSum / nodeDatum.children.length;
      }
      return nodeDatum.progressPercent;
    };
    generatePercentagesAtNode(nodeDatum);
  }

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
        const res = SkillTreeInner.findNodeInTree(child, targetNode);
        if (res) return res;
      }
    }
    return null;
  }

  /**
   * Sets the collapse state of the current tree.
   * @param collapseState collapse state to match
   */
  setCollapseState(collapseState: CollapseState) {
    const setCollapsedState = (node: TreeNodeDatum, currentState: CollapseState) => {
      node.__rd3t.collapsed = currentState.collapsed;
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          setCollapsedState(node.children[i], currentState.children![i]);
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