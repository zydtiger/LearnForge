import { RawNodeDatum, TreeNodeDatum } from "react-d3-tree";

/**
 * Generates raw tree from tree.
 * @param currentNode current tree node to convert
 * @returns converted raw node
 */
function convertToRaw(currentNode: TreeNodeDatum): RawNodeDatum {
  const node: RawNodeDatum = {
    name: currentNode.name,
    progressPercent: currentNode.progressPercent
  };

  if (currentNode.children) {
    node.children = currentNode.children.map((val) => convertToRaw(val));
  }

  return node;
}

/**
   * Finds the target node in the designated subtree.
   * @param currentNode root node of current subtree
   * @param targetNode target node to find
   * @returns node if found, null if not found
   */
function findNodeInTree(currentNode: TreeNodeDatum, targetNode: TreeNodeDatum): TreeNodeDatum | null {
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

/**
 * Finds the siblings of target node.
 * @param siblings current siblings to look at
 * @param targetNode node to search for
 * @returns [siblings, index]
 */
function findNodeInSiblings(siblings: TreeNodeDatum[], targetNode: TreeNodeDatum): [TreeNodeDatum[], number] | null {
  for (let i = 0; i < siblings.length; i++) {
    if (siblings[i].__rd3t.id == targetNode.__rd3t.id) {
      return [siblings, i];
    }
    if (siblings[i].children) {
      const res = findNodeInSiblings(siblings[i].children!, targetNode);
      if (res) return res;
    }
  }
  return null;
}

/**
 * Updates percentages at node by calling
 * the recursive inner function.
 */
function updatePercentages(nodeDatum: TreeNodeDatum) {
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

export { convertToRaw, findNodeInTree, findNodeInSiblings, updatePercentages };