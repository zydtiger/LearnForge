import { SkillsetRawNode } from "@/types";

/**
 * Finds the target node in the designated subtree.
 * @param currentNode root node of current subtree
 * @param targetId target id to find
 * @returns node if found, null if not found
 */
export function findNode(
  currentNode: SkillsetRawNode,
  targetId: string,
): SkillsetRawNode | null {
  if (currentNode.id == targetId) {
    return currentNode;
  }
  if (currentNode.children) {
    for (let child of currentNode.children) {
      const res = findNode(child, targetId);
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
export function findSiblingsWithNode(
  siblings: SkillsetRawNode[],
  targetId: string,
): [SkillsetRawNode[], number] | null {
  for (let i = 0; i < siblings.length; i++) {
    if (siblings[i].id == targetId) {
      return [siblings, i];
    }
    if (siblings[i].children) {
      const res = findSiblingsWithNode(siblings[i].children!, targetId);
      if (res) return res;
    }
  }
  return null;
}

/**
 * Updates percentages at node's subtree.
 * @param node the node to update
 * @returns calculated percentage of the node to propagate upwards
 */
export function updatePercentages(node: SkillsetRawNode): number {
  if (node.children && node.children.length != 0) {
    // if NOT leaf node
    const childrenPercentageSum = node.children.reduce(
      (acc: number, current: SkillsetRawNode) => {
        return acc + updatePercentages(current);
      },
      0,
    );
    node.progressPercent = childrenPercentageSum / node.children.length;
  }
  return node.progressPercent;
}
