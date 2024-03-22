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

export { convertToRaw };