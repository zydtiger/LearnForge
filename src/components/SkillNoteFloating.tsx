import Markdown from "react-markdown";
import { useAppSelector } from "../redux/hooks";
import {
  selectIsHovered,
  selectMouseCoords,
  selectNoteViewNode,
} from "../redux/slices/noteSlice";
import { useRef } from "react";
import rehypeSanitize from "rehype-sanitize";

function SkillNoteFloating() {
  const nodeDatum = useAppSelector(selectNoteViewNode);
  const isHovered = useAppSelector(selectIsHovered);
  const mouseCoords = useAppSelector(selectMouseCoords);

  const mdRef = useRef(null);
  const isShow = isHovered && nodeDatum.mdNote && nodeDatum.mdNote.length > 0;
  const isShowMore = (() => {
    if (mdRef.current) {
      const mdDisplay = mdRef.current as HTMLElement;
      return mdDisplay.scrollHeight > 170;
    }
    return false;
  })();

  return (
    isShow && (
      <div
        style={{
          position: "absolute",
          left: `${mouseCoords[0]}px`,
          top: `${mouseCoords[1]}px`,
          width: 300,
          height: 200,
          boxSizing: "border-box",
          background: "rgba(255,255,255,0.5)",
          border: "1px solid black",
          padding: 10,
        }}
      >
        {/* Markdown display */}
        <div
          ref={mdRef}
          style={{
            overflow: "hidden",
            height: 170,
          }}
        >
          <Markdown rehypePlugins={[rehypeSanitize]}>
            {nodeDatum.mdNote}
          </Markdown>
        </div>

        {/* Ellipsis for overflow */}
        {isShowMore && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              fontSize: 30,
              color: "#1677FF",
            }}
          >
            ...
          </div>
        )}
      </div>
    )
  );
}

export default SkillNoteFloating;
