import {
  UnorderedListOutlined,
  SisternodeOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Freeze } from "react-freeze";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectViewMode, setViewMode } from "../redux/slices/viewSlice";
import SkillTree from "./SkillTree";
import SkillList from "./SkillList";
import SkillNote from "./SkillNote";
import SkillBtns from "./SkillBtns";
import SkillNoteFloating from "./SkillNoteFloating";

function Viewport() {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(selectViewMode);
  const ports = {
    tree: {
      Icon: <UnorderedListOutlined />,
      Component: <SkillTree />,
    },
    list: {
      Icon: <SisternodeOutlined />,
      Component: <SkillList />,
    },
    note: {
      Icon: <FormOutlined />,
      Component: <SkillNote />,
    },
  };

  return (
    <>
      <div
        className="viewport"
        hidden={viewMode != "tree" && viewMode != "list"}
      >
        {/* Do not re-render component from scratch, simply SHOW (improves performance by 2x) */}
        <div className="tree viewport" hidden={viewMode != "tree"}>
          <Freeze freeze={viewMode != "tree"}>{ports.tree.Component}</Freeze>
        </div>
        <div className="list viewport" hidden={viewMode != "list"}>
          <Freeze freeze={viewMode != "list"}>{ports.list.Component}</Freeze>
        </div>

        {/* Functional Btns */}
        <SkillBtns
          toggleViewBtn={{
            tooltip:
              "Toggle " + (viewMode == "tree" ? "List View" : "Tree View"),
            Icon: ports[viewMode].Icon,
          }}
          onToggleView={() =>
            dispatch(setViewMode(viewMode == "tree" ? "list" : "tree"))
          }
        />

        {/* Floating note view */}
        <SkillNoteFloating />
      </div>
      <div className="note viewport" hidden={viewMode != "note"}>
        <Freeze freeze={viewMode != "note"}>{ports.note.Component}</Freeze>
      </div>
    </>
  );
}

export default Viewport;
