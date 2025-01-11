import { lazy, Suspense } from "react";
import { ConfigProvider, theme } from "antd";
import { useAppSelector } from "./redux/hooks";
import { selectGlobalThemeAuto } from "./redux/slices/settingsSlice";
import { selectIsFirstTimeLoading } from "./redux/slices/skillsetSlice";
import LoadingSpin from "./components/LoadingSpin";

const Contents = lazy(() => import("./Contents"));

const App = () => {
  const globalTheme = useAppSelector(selectGlobalThemeAuto);
  const isFirstTimeLoading = useAppSelector(selectIsFirstTimeLoading);

  return (
    <div
      className={globalTheme == "light" ? "app" : "app dark"}
      style={{
        backgroundColor: globalTheme == "light" ? "#f6f6f6" : "#070707",
      }}
    >
      <ConfigProvider // antd
        theme={{
          algorithm:
            globalTheme == "light"
              ? theme.defaultAlgorithm
              : theme.darkAlgorithm,
        }}
      >
        {isFirstTimeLoading && <LoadingSpin />}
        <Suspense fallback={null}>
          <Contents />
        </Suspense>
      </ConfigProvider>
    </div>
  );
};

export default App;
