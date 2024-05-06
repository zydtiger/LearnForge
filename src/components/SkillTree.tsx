import { Ref, useRef } from "react";
import { Point, TreeProps } from "react-d3-tree";
import { FloatButton } from "antd";
import { ExpandOutlined } from "@ant-design/icons";
import SkillTreeInner from "./SkillTreeInner";
import SkillTreeNode from "./SkillTreeNode";

import { NodeEventTypes, handleNodeChange } from "../lib/skillset";
import { useAppSelector } from "../redux/hooks";
import { selectSkillset } from "../redux/slices/skillsetSlice";

function SkillTree() {
  const data = useAppSelector(selectSkillset);
  const tree: Ref<SkillTreeInner> = useRef(null);

  const initialZoom = 0.8;
  const initialTranslate: Point = { x: 200, y: window.innerHeight / 2 };

  const handleOnNodeClick: TreeProps["onNodeClick"] = (node, event) => {
    if (NodeEventTypes.includes(event.type)) {
      const value = (event.target as HTMLInputElement).value;
      handleNodeChange(node.data.id, event.type, value);
    } else if (event.type == "toggleNode") {
      tree.current!.handleToggleNode(node.data);
    } else {
      console.error("Undefined node event is triggered");
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
        onClick={() => window.location.reload()}
      />
    </>
  );
}

export default SkillTree;
