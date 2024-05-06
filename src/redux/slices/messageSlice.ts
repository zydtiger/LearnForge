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
  },
});

export const { pushMessage } = messageSlice.actions;

export const selectMessageQueue = (state: RootState) =>
  state.message.messageQueue;

export default messageSlice.reducer;
