import { useAppDispatch } from "../redux/hooks";
import { setSkillset } from "../redux/slices/skillsetSlice";
import { RawNodeDatum } from 'react-d3-tree';
import { Tree, ConfigProvider, Typography, Divider } from 'antd';
import type { TreeProps } from 'antd';
import { SyntheticEvent } from "react";
import { DefaultNode } from "../types/defaults";

import { convertToListDataRecursive, convertToListData, convertToTreeData, findNode, updatePercentages } from '../lib/skillList';

function SkillList({ data }: { data: RawNodeDatum; }) {
  const dispatch = useAppDispatch();

  const handleOnChange = (event: SyntheticEvent) => {
    const [type, key] = event.type.split('|');
    const value = (event.target as HTMLInputElement).value;
    const listDataClone = [...listData];
    const [siblings, index, node] = findNode(listDataClone, key)!;

    let isUpdatePercentNeeded = false;
    switch (type) {
      case 'changeName':
        node.name = value;
        break;

      case 'changePercent':
        node.progressPercent = Number(value);
        isUpdatePercentNeeded = true;
        break;

      case 'deleteNode':
        siblings.splice(index, 1);
        isUpdatePercentNeeded = true;
        break;

      case 'addNode':
        node.children = node.children || [];
        const insertIndex = node.children.length;
        const defaultRawNode = { ...DefaultNode };
        if (insertIndex == 0) { // if inserting as first child, inherit progress set in parent
          defaultRawNode.progressPercent = node.progressPercent;
        }
        const defaultNode = convertToListDataRecursive(defaultRawNode, node.key, insertIndex, handleOnChange);
        node.children.push(defaultNode);
        isUpdatePercentNeeded = true;
        break;

      default:
        break;
    }

    const newTreeData = convertToTreeData(listDataClone[0]);
    if (isUpdatePercentNeeded) {
      updatePercentages(newTreeData);
    }
    dispatch(setSkillset(newTreeData));
  };

  const listData = convertToListData(data, handleOnChange);

  const handleOnDrop: TreeProps['onDrop'] = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    // the global index of the drop node (e.g. 0-0-0-0)
    const globalDropIndex = info.node.pos.split('-');
    const localDropIndex = Number(globalDropIndex[globalDropIndex.length - 1]);
    // the drop position relative to the drop node:
    // if dropped on a parent => 0
    // if dropped on a sibling => 1
    // if dropped before root node => -1
    //     - this case is illegal
    const relPos = info.dropPosition - localDropIndex;
    if (relPos == -1) return;

    const listDataClone = [...listData];

    // finds dragNode and removes it from its siblings
    const [dragSiblings, dragIndex, dragNode] = findNode(listDataClone, dragKey)!;
    dragSiblings.splice(dragIndex, 1);

    // inserts dragNode at correct location
    const [dropSiblings, dropIndex, dropNode] = findNode(listDataClone, dropKey)!;
    if (relPos == 0) { // if dropped on a parent
      dropNode.children = dropNode.children || []; // in case the children is null
      dropNode.children.unshift(dragNode);
    } else { // if dropped on a sibling
      dropSiblings.splice(dropIndex + 1, 0, dragNode);
    }

    const newTreeData = convertToTreeData(listDataClone[0]);
    updatePercentages(newTreeData);
    dispatch(setSkillset(newTreeData));
  };

  return (
    <ConfigProvider theme={{
      components: {
        Tree: {
          colorBgContainer: 'transparent',
        }
      }
    }}>
      <div style={{ width: '100%', height: '100%', padding: 20, boxSizing: 'border-box' }}>
        <Typography.Title level={2}>List View</Typography.Title>
        <Divider />
        <Tree
          showLine
          draggable
          blockNode
          defaultExpandAll
          treeData={listData}
          onDrop={handleOnDrop}
        />
      </div>
    </ConfigProvider>
  );
};

export default SkillList;