import { green, yellow } from "@ant-design/colors";

export const calcProgressColor = (progress: number) =>
  // progress == 100 ? green[4] : yellow[5];
  progress == 100 ? green[7] : yellow[7];
