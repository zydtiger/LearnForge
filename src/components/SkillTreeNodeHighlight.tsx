import { blue } from "@ant-design/colors";
import { useAppSelector } from "../redux/hooks";
import { selectGlobalThemeAuto } from "../redux/slices/settingsSlice";
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
  const globalTheme = useAppSelector(selectGlobalThemeAuto);

  return selectedNodeId == currentNodeId ? (
    <div
      style={{
        marginTop: 15,
        marginLeft: 15,
        width,
        height,
        boxShadow:
          globalTheme === "light"
            ? `0 0 12px 0px ${blue[5]}`
            : `0 0 15px 3px ${blue[6]}`,
      }}
    ></div>
  ) : null;
}

export default SkillTreeNodeHighlight;
