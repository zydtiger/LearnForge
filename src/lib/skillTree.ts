import { RawNodeDatum } from "react-d3-tree";


/**
   * Finds the target node in the designated subtree.
   * @param currentNode root node of current subtree
   * @param targetNode target node to find
   * @returns node if found, null if not found
   */
function findNodeInTree(currentNode: RawNodeDatum, targetNode: RawNodeDatum): RawNodeDatum | null {
  if (currentNode.id == targetNode.id) {
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
function findNodeInSiblings(siblings: RawNodeDatum[], targetNode: RawNodeDatum): [RawNodeDatum[], number] | null {
  for (let i = 0; i < siblings.length; i++) {
    if (siblings[i].id == targetNode.id) {
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