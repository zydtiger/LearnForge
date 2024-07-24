import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ArgsProps } from "antd/es/message";
import { RootState } from "../store";

interface MessageState {
  messageQueue: ArgsProps[]; // global message queue
}

const initialState: MessageState = {
  messageQueue: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    pushMessage(state, action: PayloadAction<ArgsProps>) {
      state.messageQueue.push(action.payload);
    },
    dropMessage(state) {
      state.messageQueue.shift();
    },
  },
});

export const { pushMessage, dropMessage } = messageSlice.actions;

export const selectMessageQueueSize = (state: RootState) =>
  state.message.messageQueue.length;
export const selectMessageQueueFirst = (state: RootState) =>
  state.message.messageQueue[0];

export default messageSlice.reducer;
