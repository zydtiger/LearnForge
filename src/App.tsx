// external imports
import { useEffect } from "react";
import { Flex, Spin } from "antd";
import {
  UnorderedListOutlined,
  SisternodeOutlined,
  FormOutlined,
} from "@ant-design/icons";

// component imports
import SkillTree from "./components/SkillTree";
import SkillList from "./components/SkillList";
import SkillNote from "./components/SkillNote";
import ManualModal from "./components/ManualModal";
import AppMenu from "./components/AppMenu";
import AppMessage from "./components/AppMessage";
import AppContextMenu from "./components/AppContextMenu";
import SkillBtns from "./components/SkillBtns";
import SkillNoteFloating from "./components/SkillNoteFloating";

// redux imports
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import {
  selectIsInitialBoot,
  selectIsFirstTimeLoading,
} from "./redux/slices/skillsetSlice";
import {
  fetchSkillset,
  setNotInitialBoot,
  saveSkillset,
} from "./redux/thunks/skillsetThunks";
import {
  selectViewMode,
  selectIsManualModalOpen,
  setIsManualModalOpen,
  setViewMode,
} from "./redux/slices/viewSlice";

function App() {
  const dispatch = useAppDispatch();
  const isFirstTimeLoading = useAppSelector(selectIsFirstTimeLoading);

  useEffect(() => {
    dispatch(fetchSkillset());
    setInterval(() => dispatch(saveSkillset()), 10000); // saves every 10s
  }, [dispatch]);

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

  const viewMode = useAppSelector(selectViewMode);
  const isInitialBoot = useAppSelector(selectIsInitialBoot);
  const isManualModalOpen = useAppSelector(selectIsManualModalOpen);

  const closeModal = () => {
    if (isInitialBoot) dispatch(setNotInitialBoot());
    dispatch(setIsManualModalOpen(false));
  };

  return (
    <div className="app">
      <AppContextMenu>
        <div className="main viewport">
          {/* Loading page */}
          {isFirstTimeLoading && (
            <Flex
              justify="center"
              align="center"
              style={{
                position: "fixed",
                width: "100vw",
                height: "100vh",
                backgroundColor: "#f6f6f6",
              }}
            >
              <Spin size="large" />
            </Flex>
          )}

          {/* App Menu */}
          <AppMenu />

          {/* App Message */}
          <AppMessage />

          {/* Manual Modal */}
          <ManualModal
            isModalOpen={isManualModalOpen || isInitialBoot}
            closeModal={closeModal}
          />

          {/* Skillset view port */}
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

          {/* Note view port */}
          <div className="note viewport" hidden={viewMode != "note"}>
            {ports.note.Component}
          </div>
        </div>
      </AppContextMenu>
    </div>
  );
}

export default App;
