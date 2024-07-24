import { useAppSelector } from "../redux/hooks";
import { SkillsetRawNode } from "../types";

interface SkillTreeNodeHighlightProps {
  width: number;
  height: number;
  currentNodeId: SkillsetRawNode["id"];
}

function SkillTreeNodeHighlight({
  width,
  height,
  currentNodeId,
}: SkillTreeNodeHighlightProps) {
  const selectedNodeId = useAppSelector(
    (state) => state.skillset.selectedNodeId,
  );

  return selectedNodeId == currentNodeId ? (
    <div style={{ width, height, border: "8px solid #AECEF4" }}></div>
  ) : null;
}

export default SkillTreeNodeHighlight;
