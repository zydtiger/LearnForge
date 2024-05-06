import { Flex } from "antd";
import React from "react";

interface MenuItemProps {
  actionLabel: React.ReactNode;
  shortcuts: string[];
}

function MenuItem({ actionLabel, shortcuts }: MenuItemProps) {
  return (
    <Flex justify="space-between" align="baseline" style={{ minWidth: 150 }}>
      <p>{actionLabel}</p>
      <p style={{ color: "gray", fontSize: 10 }}>
        {shortcuts[0].toUpperCase()}
      </p>
    </Flex>
  );
}

export default MenuItem;
