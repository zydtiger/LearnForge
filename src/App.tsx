import { useEffect } from "react";

// component imports
import AppContextMenu from "./components/AppContextMenu";
import LoadingSpin from "./components/LoadingSpin";
import AppMenu from "./components/AppMenu";
import AppMessage from "./components/AppMessage";
import ManualModal from "./components/ManualModal";
import Viewport from "./components/Viewport";

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
  selectIsManualModalOpen,
  setIsManualModalOpen,
} from "./redux/slices/viewSlice";

function App() {
  const dispatch = useAppDispatch();
  const isFirstTimeLoading = useAppSelector(selectIsFirstTimeLoading);

  useEffect(() => {
    dispatch(fetchSkillset());
    setInterval(() => dispatch(saveSkillset()), 10000); // saves every 10s
  }, [dispatch]);

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
          {isFirstTimeLoading && <LoadingSpin />}
          <AppMenu />
          <AppMessage />
          <ManualModal
            isModalOpen={isManualModalOpen || isInitialBoot}
            closeModal={closeModal}
          />
          <Viewport />
        </div>
      </AppContextMenu>
    </div>
  );
}

export default App;
