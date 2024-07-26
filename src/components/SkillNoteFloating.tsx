import Markdown from "react-markdown";
import { useAppSelector } from "../redux/hooks";
import {
  selectIsHovered,
  selectMouseCoords,
  selectNoteNodeId,
} from "../redux/slices/noteSlice";
import { selectGlobalThemeAuto } from "../redux/slices/settingsSlice";
import { selectSkillsetNodeById } from "../redux/slices/skillsetSlice";
import { useRef } from "react";
import rehypeSanitize from "rehype-sanitize";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "../assets/css/md-viewer.css";

function SkillNoteFloating() {
  const nodeId = useAppSelector(selectNoteNodeId);
  const nodeDatum = useAppSelector((state) =>
    selectSkillsetNodeById(state, nodeId),
  );
  const isHovered = useAppSelector(selectIsHovered);
  const globalTheme = useAppSelector(selectGlobalThemeAuto);
  const mouseCoords = useAppSelector(selectMouseCoords);

  const mdRef = useRef(null);
  const isShow = isHovered && nodeDatum?.mdNote && nodeDatum.mdNote.length > 0;
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
          background:
            globalTheme == "light"
              ? "rgba(255,255,255,0.9)"
              : "rgba(10,10,10,0.9)",
          border:
            globalTheme == "light" ? "1px solid black" : "1px solid white",
          padding: 10,
        }}
      >
        {/* Markdown display */}
        <div
          ref={mdRef}
          style={{
            overflow: "hidden",
            height: 165,
          }}
        >
          <Markdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeSanitize, rehypeKatex]}
          >
            {nodeDatum.mdNote}
          </Markdown>
        </div>

        {/* Ellipsis for overflow */}
        {isShowMore && (
          <div
            style={{
              position: "absolute",
              left: 10,
              fontSize: 14,
              textDecoration: "underline",
              color: "#1677FF",
            }}
          >
            More...
          </div>
        )}
      </div>
    )
  );
}

export default SkillNoteFloating;
