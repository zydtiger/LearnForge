import { RawNodeDatum } from "react-d3-tree";


/**
   * Finds the target node in the designated subtree.
   * @param currentNode root node of current subtree
   * @param targetId target id to find
   * @returns node if found, null if not found
   */
function findNodeInTree(currentNode: RawNodeDatum, targetId: string): RawNodeDatum | null {
  if (currentNode.id == targetId) {
    return currentNode;
  }
  if (currentNode.children) {
    for (let child of currentNode.children) {
      const res = findNodeInTree(child, targetId);
      if (res) return res;
    }
  }
  return null;
}

/**
 * Finds the siblings of target node.
 * @param siblings current siblings to look at
 * @param targetId target id to search for
 * @returns [siblings, index]
 */
function findNodeInSiblings(siblings: RawNodeDatum[], targetId: string): [RawNodeDatum[], number] | null {
  for (let i = 0; i < siblings.length; i++) {
    if (siblings[i].id == targetId) {
      return [siblings, i];
    }
    if (siblings[i].children) {
      const res = findNodeInSiblings(siblings[i].children!, targetId);
      if (res) return res;
    }
  }
  return null;
}

/**
 * Updates percentages at node by calling
 * the recursive inner function.
 */
function updatePercentages(nodeDatum: RawNodeDatum) {
  const generatePercentagesAtNode = (nodeDatum: RawNodeDatum): number => {
    if (nodeDatum.children && nodeDatum.children.length != 0) { // if NOT leaf node
      const childrenPercentageSum = nodeDatum.children.reduce((acc: number, current: RawNodeDatum) => {
        return acc + generatePercentagesAtNode(current);
      }, 0);
      nodeDatum.progressPercent = childrenPercentageSum / nodeDatum.children.length;
    }
    return nodeDatum.progressPercent;
  };
  generatePercentagesAtNode(nodeDatum);
}

export { findNodeInTree, findNodeInSiblings, updatePercentages };