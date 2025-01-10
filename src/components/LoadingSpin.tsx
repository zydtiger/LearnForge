import { Flex, Spin } from "antd";

function LoadingSpin() {
  return (
    <Flex
      justify="center"
      align="center"
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Spin size="large" />
    </Flex>
  );
}

export default LoadingSpin;
