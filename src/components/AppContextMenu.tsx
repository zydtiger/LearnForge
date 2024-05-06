import { Dropdown, MenuProps } from "antd";
import { convertMenuToDisplayMode, invokeAction } from "../lib/menu";

const items: MenuProps["items"] = [
  {
    label: "Save",
    key: "save",
  },
  {
    type: "divider",
  },
  {
    label: "Undo",
    key: "undo",
  },
  {
    label: "Redo",
    key: "redo",
  },
  {
    type: "divider",
  },
  {
    label: "Reset View",
    key: "reset",
  },
  {
    label: "Tree",
    key: "tree",
  },
  {
    label: "List",
    key: "list",
  },
  {
    type: "divider",
  },
  {
    label: "Help",
    key: "help",
  },
];

function SkillContextMenu(props: React.PropsWithChildren) {
  return (
    <Dropdown
      menu={{
        items: convertMenuToDisplayMode(items),
        onClick: ({ key }) => invokeAction(key),
      }}
      trigger={["contextMenu"]}
    >
      {props.children}
    </Dropdown>
  );
}

export default SkillContextMenu;
