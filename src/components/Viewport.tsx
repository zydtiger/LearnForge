import { lazy, Suspense } from "react";
import {
  UnorderedListOutlined,
  SisternodeOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectViewMode, setViewMode } from "../redux/slices/viewSlice";

const SkillTree = lazy(() => import("./SkillTree"));
const SkillList = lazy(() => import("./SkillList"));
const SkillNote = lazy(() => import("./SkillNote"));
const SkillBtns = lazy(() => import("./SkillBtns"));
const SkillNoteFloating = lazy(() => import("./SkillNoteFloating"));

function Viewport() {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(selectViewMode);
  const ports = {
    tree: {
      Icon: <UnorderedListOutlined />,
      Component: (
        <Suspense fallback={null}>
          <SkillTree />
        </Suspense>
      ),
    },
    list: {
      Icon: <SisternodeOutlined />,
      Component: (
        <Suspense fallback={null}>
          <SkillList />
        </Suspense>
      ),
    },
    note: {
      Icon: <FormOutlined />,
      Component: (
        <Suspense fallback={null}>
          <SkillNote />
        </Suspense>
      ),
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
          {ports.tree.Component}
        </div>
        <div className="list viewport" hidden={viewMode != "list"}>
          {ports.list.Component}
        </div>

        {/* Functional Btns */}
        <Suspense fallback={null}>
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
        </Suspense>

        {/* Floating note view */}
        <Suspense fallback={null}>
          <SkillNoteFloating />
        </Suspense>
      </div>
      <div className="note viewport" hidden={viewMode != "note"}>
        {ports.note.Component}
      </div>
    </>
  );
}

export default Viewport;
