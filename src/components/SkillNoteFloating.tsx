import Markdown from "react-markdown";
import { useAppSelector } from "../redux/hooks";
import {
  selectIsHovered,
  selectMouseCoords,
  selectNoteViewNode,
} from "../redux/slices/noteSlice";

function SkillNoteFloating() {
  const nodeDatum = useAppSelector(selectNoteViewNode);
  const isShow = useAppSelector(selectIsHovered);
  const mouseCoords = useAppSelector(selectMouseCoords);

  return (
    <div
      hidden={!isShow}
      style={{
        position: "absolute",
        left: `${mouseCoords[0]}px`,
        top: `${mouseCoords[1]}px`,
        width: 300,
        height: 200,
        background: "rgba(255,255,255,0.5)",
        border: "1px solid black",
        padding: 10,
      }}
    >
      <Markdown>{nodeDatum.mdNote}</Markdown>
    </div>
  );
}

export default SkillNoteFloating;
