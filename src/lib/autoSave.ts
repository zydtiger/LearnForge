import { invokeAction } from "./menu";

let timer: any;

/**
 * Starts auto save timer.
 */
export const startAutoSave = () => {
  if (!timer) {
    timer = setInterval(() => invokeAction("save"), 10000);
  }
};

/**
 * Stops auto save timer.
 */
export const stopAutoSave = () => {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
};
