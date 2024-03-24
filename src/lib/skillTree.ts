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

export { convertToRaw, findNodeInSiblings };