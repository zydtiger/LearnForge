import { Ref, useRef, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { setSkillset } from "../redux/slices/skillsetSlice";
import { RawNodeDatum, Point, TreeProps } from "react-d3-tree";
import { Flex, FloatButton } from "antd";
import { ExpandOutlined } from "@ant-design/icons";
import SkillTreeInner from "./SkillTreeInner";
import SkillTreeNode from "./SkillTreeNode";

import { convertToRaw } from "../lib/skillTree";

/* Gets tauri window size to center tree */
import { appWindow } from '@tauri-apps/api/window';
const scaleFactor = await appWindow.scaleFactor();
const physicalWindowSize = await appWindow.innerSize();
const windowSize = physicalWindowSize.toLogical(scaleFactor);

function SkillTree({ data }: { data: RawNodeDatum; }) {
  const dispatch = useAppDispatch();
  const tree: Ref<SkillTreeInner> = useRef(null);

  const initialZoom = 0.8;
  const [zoom, setZoom] = useState(initialZoom);
  const initialTranslate: Point = { x: 200, y: windowSize.height / 2 };
  const [translate, setTranslate] = useState(initialTranslate);

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

  const handleOnUpdate: TreeProps['onUpdate'] = ({ zoom, translate }) => {
    // HACK: the internal d3 state emits default values after component update, filtering out the bad case
    if (zoom != initialZoom || translate.x != initialTranslate.x || translate.y != initialTranslate.y) {
      setZoom(zoom);
      setTranslate(translate);
    }
  };

  return (
    <>
      <SkillTreeInner
        ref={tree}
        data={data}
        renderCustomNodeElement={SkillTreeNode}
        onNodeClick={handleOnNodeClick}
        onUpdate={handleOnUpdate}
        zoom={zoom}
        translate={translate}
        pathFunc="step"
        depthFactor={350}
      />
      {/* Add text showing current zoom level and translation */}
      <Flex
        align="center"
        style={{
          position: 'absolute',
          background: '#fff',
          borderRadius: 5,
          // This is from antd @shadow-2-down
          boxShadow: `
            0px 3px 6px -4px rgba(0, 0, 0, 0.12),
            0px 6px 16px 0px rgba(0, 0, 0, 0.08),
            0px 9px 28px 8px rgba(0, 0, 0, 0.05)`,
          bottom: 20,
          left: '50vw',
          translate: '-50% 0',
          paddingLeft: 10,
          paddingRight: 10,
          fontSize: 13,
          color: 'gray'
        }}>
        <p style={{ textAlign: 'right' }}>{Math.round(zoom / initialZoom * 100)}%</p>
        <code style={{ width: 20, textAlign: 'center' }}>:</code>
        <p style={{ textAlign: 'left' }}>
          {`(${-Math.round(translate.x - initialTranslate.x)}, ${-Math.round(translate.y - initialTranslate.y)})`}
        </p>
      </Flex>
      {/* Add button to reset zoom & translate */}
      <FloatButton
        tooltip={"Reset View"}
        icon={<ExpandOutlined />}
        style={{ top: 20, right: 20 }}
        onClick={() => {
          setZoom(initialZoom);
          setTranslate(initialTranslate);
        }} />
    </>
  );
}

export default SkillTree;