import { green, yellow } from "@ant-design/colors";
import store from "../redux/store";
import { selectGlobalThemeAuto } from "../redux/slices/settingsSlice";

export const calcProgressColor = (progress: number) => {
  if (selectGlobalThemeAuto(store.getState()) == "light") {
    return progress == 100 ? green[4] : yellow[5];
  }
  return progress == 100 ? green[6] : yellow[6];
};
