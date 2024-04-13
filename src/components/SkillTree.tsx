import { Ref, useRef } from "react";
import { useAppDispatch } from "../redux/hooks";
import { setSkillset } from "../redux/slices/skillsetSlice";
import { RawNodeDatum, Point, TreeProps } from "react-d3-tree";
import { FloatButton } from "antd";
import { ExpandOutlined } from "@ant-design/icons";
import SkillTreeInner from "./SkillTreeInner";
import SkillTreeNode from "./SkillTreeNode";

import { convertToRaw } from "../lib/skillTree";

function SkillTree({ data }: { data: RawNodeDatum; }) {
  const dispatch = useAppDispatch();
  const tree: Ref<SkillTreeInner> = useRef(null);

  const initialZoom = 0.8;
  const initialTranslate: Point = { x: 200, y: window.innerHeight / 2 };

  const handleOnNodeClick: TreeProps['onNodeClick'] = (node, event) => {
    const newTreeData = tree.current!.handleNodeChange!(node, event);
    if (newTreeData) {
      const oldCollapseState = tree.current!.geteCollapseState();
      tree.current!.setFrozen(true); // freeze rendering before update finished
      dispatch(setSkillset(convertToRaw(newTreeData)));
      setTimeout(() => {
        tree.current!.setCollapseState(oldCollapseState);
        tree.current!.setFrozen(false); // allow rendering to continue
      });
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