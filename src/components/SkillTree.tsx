import { Ref, useRef } from "react";
import { useAppDispatch } from "../redux/hooks";
import { setSkillset } from "../redux/slices/skillsetSlice";
import { RawNodeDatum, Point, TreeProps } from "react-d3-tree";
import { FloatButton } from "antd";
import { ExpandOutlined } from "@ant-design/icons";
import SkillTreeInner from "./SkillTreeInner";
import SkillTreeNode from "./SkillTreeNode";

import { findNodeInTree, findNodeInSiblings, updatePercentages } from "../lib/skillTree";
import { DefaultNode, DefaultRootNode } from "../types/defaults";
import { setNoteViewNode, setViewMode } from '../redux/slices/viewSlice';

function SkillTree({ data }: { data: RawNodeDatum; }) {
  const dispatch = useAppDispatch();
  const tree: Ref<SkillTreeInner> = useRef(null);

  const initialZoom = 0.8;
  const initialTranslate: Point = { x: 200, y: window.innerHeight / 2 };

  const handleOnNodeClick: TreeProps['onNodeClick'] = (node, event) => {
    const dataClone = JSON.parse(JSON.stringify(data)); // deep clone through JSON
    const nodeDatum = findNodeInTree(dataClone, node.data.id)!;

    switch (event.type) {
      case 'toggleNode':
        tree.current!.handleToggleNode(nodeDatum);
        return; // skip store updating

      case 'changePercent':
        nodeDatum.progressPercent = Number((event.target as HTMLInputElement).value);
        updatePercentages(dataClone); // triggers update cascade
        break;

      case 'changeName':
        nodeDatum.name = (event.target as HTMLInputElement).value;
        break;

      case 'addNode':
        nodeDatum.children = nodeDatum.children || []; // in case the children is null
        const defaultNode = DefaultNode(); // get default node
        // inherit progress percent from parent if adding to a leaf node
        if (nodeDatum.children.length == 0) {
          defaultNode.progressPercent = nodeDatum.progressPercent;
        }
        nodeDatum.children.push(defaultNode);
        updatePercentages(dataClone);
        break;

      case 'deleteNode':
        const [siblings, index] = findNodeInSiblings([dataClone], nodeDatum.id)!;
        siblings.splice(index, 1);
        updatePercentages(dataClone);
        break;

      case 'clear':
        Object.assign(dataClone, DefaultRootNode);
        dataClone.children = []; // manual override
        break;

      case 'triggerNote':
        dispatch(setNoteViewNode(nodeDatum));
        dispatch(setViewMode('note'));
        break;

      default:
        break;
    }

    // update redux store
    const oldCollapseState = tree.current!.geteCollapseState();
    tree.current!.setFrozen(true); // freeze rendering before update finished
    dispatch(setSkillset(dataClone));
    setTimeout(() => {
      tree.current!.setCollapseState(oldCollapseState);
      tree.current!.setFrozen(false); // allow rendering to continue
    });
  };

  return (
    <>
      <SkillTreeInner
        ref={tree}
        data={data}
        renderCustomNodeElement={SkillTreeNode}
        onNodeClick={handleOnNodeClick}
        zoom={initialZoom}
        translate={initialTranslate}
        pathFunc="step"
        depthFactor={350}
      />
      {/* Add button to reset everything by reloading */}
      <FloatButton
        tooltip={"Reset View"}
        icon={<ExpandOutlined />}
        style={{ top: 50, right: 20 }}
        onClick={() => window.location.reload()} />
    </>
  );
}

export default SkillTree;