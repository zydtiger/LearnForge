import { useEffect, lazy, Suspense } from "react";
import { ConfigProvider, theme } from "antd";
import { startAutoSave, stopAutoSave } from "./lib/autoSave";

// component imports
import LoadingSpin from "./components/LoadingSpin";
import AppMessage from "./components/AppMessage";
const AppContextMenu = lazy(() => import("./components/AppContextMenu"));
const AppMenu = lazy(() => import("./components/AppMenu"));
const ManualModal = lazy(() => import("./components/ManualModal"));
const Viewport = lazy(() => import("./components/Viewport"));
const Settings = lazy(() => import("./components/Settings"));

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
    dispatch(fetchSettings()).then(() => {
      dispatch(fetchSkillset());
    });
  }, [dispatch]);

  useEffect(() => {
    if (isAutoSave) {
      startAutoSave();
    } else {
      stopAutoSave();
    }
  }, [isAutoSave]);

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
        <Suspense fallback={null}>
          <AppContextMenu>
            <div className="main viewport">
              {isFirstTimeLoading && <LoadingSpin />}
              <AppMessage />

              <Suspense fallback={null}>
                <AppMenu />
              </Suspense>

              <Suspense fallback={null}>
                <ManualModal
                  isModalOpen={isManualModalOpen || isInitialBoot}
                  closeModal={closeModal}
                />
              </Suspense>

              <Suspense fallback={null}>
                <Settings />
              </Suspense>

              <Suspense fallback={null}>
                <Viewport />
              </Suspense>
            </div>
          </AppContextMenu>
        </Suspense>
      </ConfigProvider>
    </div>
  );
}

export default App;
