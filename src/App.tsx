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

  const appClass = {
    light: "app",
    dark: "app dark",
  };

  const appStyles = {
    light: {
      color: "#0f0f0f",
      backgroundColor: "#f6f6f6",
    },
    dark: {
      color: "#ececec",
      backgroundColor: "#070707",
      colorScheme: "dark",
    },
  };

  const antdAlgo = {
    light: theme.defaultAlgorithm,
    dark: theme.darkAlgorithm,
  };

  return (
    <div className={appClass[globalTheme]} style={appStyles[globalTheme]}>
      {/* antd */}
      <ConfigProvider theme={{ algorithm: antdAlgo[globalTheme] }}>
        {isFirstTimeLoading && <LoadingSpin />}
        <Suspense fallback={null}>
          <Contents />
        </Suspense>
      </ConfigProvider>
    </div>
  );
};

export default App;
