import store from "../redux/store";
import { setViewMode } from "../redux/slices/viewSlice";
import {
  setIsHovered,
  setMouseCoords,
  setNoteViewNode,
} from "../redux/slices/noteSlice";
import { selectSkillset, setSkillset } from "../redux/slices/skillsetSlice";
import { pushMessage } from "../redux/slices/messageSlice";
import { SkillsetRawNode } from "../types";
import { DefaultNode, DefaultRootNode } from "../types/defaults";
import { SyntheticEvent } from "react";

export const NodeEventTypes = [
  "changeName",
  "changePercent",
  "addNode",
  "deleteNode",
  "clear",
  "triggerNote",
  "openFloatNote",
  "closeFloatNote",
];

/**
 * Finds the target node in the designated subtree.
 * @param currentNode root node of current subtree
 * @param targetId target id to find
 * @returns node if found, null if not found
 */
function findNode(
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
function findSiblingsWithNode(
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
function updatePercentages(node: SkillsetRawNode): number {
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

/**
 * Handles generic node change actions.
 * @param nodeId node id to update
 * @param event event to process
 */
function handleNodeChange(nodeId: string, event: SyntheticEvent) {
  const eventType = event.type;
  const payload = (event.target as HTMLInputElement).value;

  const rootNode = selectSkillset(store.getState());
  const rootNodeClone = JSON.parse(JSON.stringify(rootNode)); // deep clone through JSON
  const targetNode = findNode(rootNodeClone, nodeId)!;

  switch (eventType) {
    case "changeName":
      targetNode.name = payload!;
      break;

    case "changePercent":
      targetNode.progressPercent = Number(payload!);
      updatePercentages(rootNodeClone); // triggers update cascade
      break;

    case "addNode":
      targetNode.children = targetNode.children || []; // in case the children is null
      const defaultNode = DefaultNode(); // get default node
      // inherit progress percent from parent if adding to a leaf node
      if (targetNode.children.length == 0) {
        defaultNode.progressPercent = targetNode.progressPercent;
      }
      targetNode.children.push(defaultNode);
      updatePercentages(rootNodeClone);
      break;

    case "deleteNode":
      const [siblings, index] = findSiblingsWithNode(
        [rootNodeClone],
        targetNode.id,
      )!;
      siblings.splice(index, 1);
      updatePercentages(rootNodeClone);
      store.dispatch(
        pushMessage({
          type: "success",
          content: "Successfully deleted node!",
        }),
      );
      break;

    case "clear":
      Object.assign(rootNodeClone, DefaultRootNode());
      rootNodeClone.children = []; // manual override
      store.dispatch(
        pushMessage({
          type: "success",
          content: "Successfully cleared tree!",
        }),
      );
      break;

    case "triggerNote":
      store.dispatch(setNoteViewNode(targetNode));
      store.dispatch(setViewMode("note"));
      return; // skip store updating

    case "openFloatNote":
      const mouseEvent = event.nativeEvent as MouseEvent;
      store.dispatch(setNoteViewNode(targetNode));
      store.dispatch(
        setMouseCoords([mouseEvent.pageX + 10, mouseEvent.pageY + 10]),
      );
      store.dispatch(setIsHovered(true));
      return;

    case "closeFloatNote":
      store.dispatch(setIsHovered(false));
      return;

    default:
      return;
  }

  store.dispatch(setSkillset(rootNodeClone));
}

export { findNode, updatePercentages, handleNodeChange };
