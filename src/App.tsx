import { useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import { startAutoSave } from "./lib/autoSave";

// component imports
import AppContextMenu from "./components/AppContextMenu";
import LoadingSpin from "./components/LoadingSpin";
import AppMenu from "./components/AppMenu";
import AppMessage from "./components/AppMessage";
import ManualModal from "./components/ManualModal";
import Viewport from "./components/Viewport";
import Settings from "./components/Settings";

// redux imports
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import {
  selectIsInitialBoot,
  selectIsFirstTimeLoading,
} from "./redux/slices/skillsetSlice";
import {
  fetchSkillset,
  setNotInitialBoot,
} from "./redux/thunks/skillsetThunks";
import {
  selectIsManualModalOpen,
  setIsManualModalOpen,
} from "./redux/slices/viewSlice";
import { selectGlobalThemeAuto } from "./redux/slices/settingsSlice";
import { fetchSettings } from "./redux/thunks/settingsThunk";

function App() {
  const dispatch = useAppDispatch();
  const isFirstTimeLoading = useAppSelector(selectIsFirstTimeLoading);
  const isAutoSave = useAppSelector((state) => state.settings.isAutoSave);
  const globalTheme = useAppSelector(selectGlobalThemeAuto);

  useEffect(() => {
    dispatch(fetchSkillset());
    dispatch(fetchSettings());
    if (isAutoSave) {
      startAutoSave();
    }
  }, [dispatch]);

  const isInitialBoot = useAppSelector(selectIsInitialBoot);
  const isManualModalOpen = useAppSelector(selectIsManualModalOpen);

  const closeModal = () => {
    if (isInitialBoot) dispatch(setNotInitialBoot());
    dispatch(setIsManualModalOpen(false));
  };

  return (
    <div className={globalTheme == "light" ? "app" : "app dark"}>
      <ConfigProvider // antd
        theme={{
          algorithm:
            globalTheme == "light"
              ? theme.defaultAlgorithm
              : theme.darkAlgorithm,
        }}
      >
        <AppContextMenu>
          <div className="main viewport">
            {isFirstTimeLoading && <LoadingSpin />}
            <AppMenu />
            <AppMessage />
            <ManualModal
              isModalOpen={isManualModalOpen || isInitialBoot}
              closeModal={closeModal}
            />
            <Settings />
            <Viewport />
          </div>
        </AppContextMenu>
      </ConfigProvider>
    </div>
  );
}

export default App;
