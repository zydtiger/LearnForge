import store from "../redux/store";
import { setViewMode } from "../redux/slices/viewSlice";
import {
  setIsHovered,
  setMouseCoords,
  setNoteViewNode,
} from "../redux/slices/noteSlice";
import { selectSkillset, setSkillset } from "../redux/slices/skillsetSlice";
import { pushMessage } from "../redux/slices/messageSlice";
import { DefaultNode, DefaultRootNode } from "../types/defaults";
import {
  findNode,
  findSiblingsWithNode,
  updatePercentages,
} from "@/utils/skillset";

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

type NodeEventType = (typeof NodeEventTypes)[number];

/**
 * Handles generic node change actions.
 * @param nodeId node id to update
 * @param eventType event type to trigger
 * @param payload some events depend on payload
 */
function handleNodeChange(
  nodeId: string,
  eventType: NodeEventType,
  payload?: string,
) {
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
      const mouseCoords = payload!.split(":");
      const [x, y] = [Number(mouseCoords[0]), Number(mouseCoords[1])];
      store.dispatch(setNoteViewNode(targetNode));
      store.dispatch(setMouseCoords([x + 10, y + 10]));
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
