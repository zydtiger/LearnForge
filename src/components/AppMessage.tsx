import { message } from "antd";
import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectMessageQueue } from "../redux/slices/messageSlice";

function AppMessage() {
  const [messageApi, contextHolder] = message.useMessage();
  const messageQueue = useAppSelector(selectMessageQueue);

  useEffect(() => {
    if (messageQueue.length > 0) {
      messageApi.open(messageQueue[messageQueue.length - 1]);
    }
  }, [messageQueue]);

  return contextHolder;
}

export default AppMessage;
