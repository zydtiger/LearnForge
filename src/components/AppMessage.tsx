import { message } from "antd";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  selectMessageQueueFirst,
  selectMessageQueueSize,
  dropMessage,
} from "../redux/slices/messageSlice";

function AppMessage() {
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const messageQueueSize = useAppSelector(selectMessageQueueSize);
  const messageQueueFirst = useAppSelector(selectMessageQueueFirst);

  useEffect(() => {
    if (messageQueueSize > 0) {
      messageApi.open(messageQueueFirst);
      dispatch(dropMessage());
    }
  }, [messageQueueSize]);

  return contextHolder;
}

export default AppMessage;
