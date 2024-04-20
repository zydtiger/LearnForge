import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setSkillset, selectIsFirstTimeLoading } from "../redux/slices/skillsetSlice";
import { setNoteViewNode, setViewMode } from '../redux/slices/viewSlice';
import { RawNodeDatum } from 'react-d3-tree';
import { Tree, ConfigProvider, Typography, Divider } from 'antd';
import type { TreeProps } from 'antd';
import React, { SyntheticEvent, useEffect, useState } from "react";
import { DefaultNode, DefaultRootNode } from "../types/defaults";

import { convertToListDataRecursive, convertToListData, convertToTreeData, findNode, updatePercentages } from '../lib/skillList';

function SkillList({ data }: { data: RawNodeDatum; }) {
  const dispatch = useAppDispatch();

  const handleOnChange = (event: SyntheticEvent) => {
    const [type, key] = event.type.split('|');
    const value = (event.target as HTMLInputElement).value;
    let listDataClone = [...listData];
    const [siblings, index, node] = findNode(listDataClone, key)!;
    const keysCollect: React.Key[] = [];

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

      case 'clear':
        listDataClone = convertToListData(DefaultRootNode, handleOnChange, keysCollect);
        setExpandedKeys(keysCollect);
        listDataClone[0].children = []; // manual override
        break;

      case 'addNode':
        node.children = node.children || [];
        const insertIndex = node.children.length;
        const defaultRawNode = DefaultNode();
        if (insertIndex == 0) { // if inserting as first child, inherit progress set in parent
          defaultRawNode.progressPercent = node.progressPercent;
        }
        const defaultNode = convertToListDataRecursive(defaultRawNode, node.key, insertIndex, handleOnChange, keysCollect);
        setExpandedKeys([...expandedKeys, ...keysCollect]);
        node.children.push(defaultNode);
        isUpdatePercentNeeded = true;
        break;

      case 'triggerNote':
        dispatch(setNoteViewNode(node)); // SkillListDataNode is compatible with RawNodeDatum
        dispatch(setViewMode('note'));
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

  const isFirstTimeLoading = useAppSelector(selectIsFirstTimeLoading);
  const keysCollect: React.Key[] = [];
  const listData = convertToListData(data, handleOnChange, keysCollect);
  const [expandedKeys, setExpandedKeys] = useState(keysCollect);

  // ISSUE: expandedKeys doesn't update after async data fetching is done
  useEffect(() => {
    setExpandedKeys(keysCollect);
  }, [isFirstTimeLoading]);

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
      <div style={{ width: '100%', height: 'calc(100% - 30px)', padding: 20, boxSizing: 'border-box', overflowY: 'auto' }}>
        <Typography.Title level={2}>List View</Typography.Title>
        <Divider />
        <Tree
          showLine
          draggable
          blockNode
          expandedKeys={expandedKeys}
          treeData={listData}
          onDrop={handleOnDrop}
          onExpand={setExpandedKeys}
        />
      </div>
    </ConfigProvider>
  );
};

export default SkillList;