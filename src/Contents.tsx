import { useEffect, lazy, Suspense } from "react";
import { startAutoSave, stopAutoSave } from "./lib/autoSave";

// component imports
import AppMessage from "./components/AppMessage";
const AppContextMenu = lazy(() => import("./components/AppContextMenu"));
const AppMenu = lazy(() => import("./components/AppMenu"));
const ManualModal = lazy(() => import("./components/ManualModal"));
const Viewport = lazy(() => import("./components/Viewport"));
const Settings = lazy(() => import("./components/Settings"));

// redux imports
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { selectIsInitialBoot } from "./redux/slices/skillsetSlice";
import {
  fetchSkillset,
  setNotInitialBoot,
} from "./redux/thunks/skillsetThunks";
import {
  selectIsManualModalOpen,
  setIsManualModalOpen,
} from "./redux/slices/viewSlice";
import { fetchSettings } from "./redux/thunks/settingsThunk";

const Contents = () => {
  const dispatch = useAppDispatch();
  const isAutoSave = useAppSelector((state) => state.settings.isAutoSave);

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
    <Suspense fallback={null}>
      <AppContextMenu>
        <div className="main viewport">
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
  );
};

export default Contents;
