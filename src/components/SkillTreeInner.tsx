import Tree, { RawNodeDatum, TreeNodeDatum } from "react-d3-tree";
import { findNodeInTree } from "../lib/skillTree";

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
   * Handles the toggle node event.
   */
  handleToggleNode(node: RawNodeDatum) {
    const dataClone = [...this.state.data];
    const nodeDatum = findNodeInTree(dataClone[0], node.id) as TreeNodeDatum;

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