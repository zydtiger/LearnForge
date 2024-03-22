import { Ref, useRef, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { setSkillset } from "../redux/slices/skillsetSlice";
import { RawNodeDatum, Point } from "react-d3-tree";
import { Flex, FloatButton } from "antd";
import { ExpandOutlined } from "@ant-design/icons";
import SkillTreeInner from "./SkillTreeInner";

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

  return (
    <>
      <SkillTreeInner
        ref={tree}
        data={data}
        renderCustomNodeElement={SkillTreeInner.renderRectNode}
        onNodeClick={(node, event) => {
          const newTreeData = tree.current!.handleNodeChange!(node, event);
          if (newTreeData) {
            const oldCollapseState = tree.current!.geteCollapseState();
            tree.current!.setFrozen(true); // freeze rendering before update finished
            dispatch(setSkillset(newTreeData));
            setTimeout(() => {
              tree.current!.setCollapseState(oldCollapseState);
              tree.current!.setFrozen(false); // allow rendering to continue
            });
          }
        }}
        onUpdate={({ zoom, translate }) => {
          // HACK: the internal d3 state emits default values after component update, filtering out the bad case
          if (zoom != initialZoom || translate.x != initialTranslate.x || translate.y != initialTranslate.y) {
            setZoom(zoom);
            setTranslate(translate);
          }
        }}
        zoom={zoom}
        translate={translate}
        pathFunc="step"
        depthFactor={350}
      />
      {/* Add text showing current zoom level and translation */}
      <Flex align="center" style={{ position: 'absolute', bottom: 12, right: 25, fontSize: 13, color: 'gray' }}>
        <p style={{ textAlign: 'right' }}>{Math.round(zoom / initialZoom * 100)}%</p>
        <code style={{ width: 20, textAlign: 'center' }}>:</code>
        <p style={{ width: 80, textAlign: 'right' }}>
          {`(${-Math.round(translate.x - initialTranslate.x)}, ${-Math.round(translate.y - initialTranslate.y)})`}
        </p>
      </Flex>
      {/* Add button to reset zoom & translate */}
      <FloatButton icon={<ExpandOutlined />} style={{ top: 20 }} onClick={() => {
        setZoom(initialZoom);
        setTranslate(initialTranslate);
      }} />
    </>
  );
}

export default SkillTree;