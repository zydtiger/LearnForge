import { Ref, useRef } from "react";
import { Point, TreeProps } from "react-d3-tree";
import { FloatButton } from "antd";
import { ExpandOutlined } from "@ant-design/icons";
import SkillTreeInner from "./SkillTreeInner";
import SkillTreeNode from "./SkillTreeNode";

import { handleNodeChange } from "../lib/skillset";
import { useAppSelector } from "../redux/hooks";
import { selectSkillset } from "../redux/slices/skillsetSlice";

function SkillTree() {
  const data = useAppSelector(selectSkillset);
  const tree: Ref<SkillTreeInner> = useRef(null);

  const initialZoom = 0.8;
  const initialTranslate: Point = { x: 200, y: window.innerHeight / 2 };

  const handleOnNodeClick: TreeProps['onNodeClick'] = (node, event) => {
    switch (event.type) {
      case 'toggleNode':
        tree.current!.handleToggleNode(node.data);
        break;

      case 'changeName':
      case 'changePercent':
      case 'addNode':
      case 'deleteNode':
      case 'clear':
      case 'triggerNote':
        let oldCollapseState: any;
        handleNodeChange(
          node.data.id,
          event.type,
          (event.target as HTMLInputElement).value, // this will automatically be undefined for actions like deleteNode
          // preupdate
          () => {
            oldCollapseState = tree.current!.geteCollapseState();
            tree.current!.setFrozen(true); // freeze rendering before update finished
          },
          // postupdate
          () => {
            setTimeout(() => {
              tree.current!.setCollapseState(oldCollapseState);
              tree.current!.setFrozen(false); // allow rendering to continue
            });
          });
        break;

      default:
        break;
    }
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