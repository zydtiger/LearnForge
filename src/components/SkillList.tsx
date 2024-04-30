import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setSkillset, selectIsFirstTimeLoading, selectSkillset } from "../redux/slices/skillsetSlice";
import { Tree, ConfigProvider, Typography, Divider } from 'antd';
import type { TreeProps } from 'antd';
import React, { SyntheticEvent, useEffect, useState } from "react";

import { convertToListData, convertToRawData, findListNode } from '../lib/skillList';
import { NodeEventTypes, updatePercentages, handleNodeChange } from "../lib/skillset";

function SkillList() {
  const data = useAppSelector(selectSkillset);
  const dispatch = useAppDispatch();

  const handleOnChange = (event: SyntheticEvent) => {
    const [eventType, id] = event.type.split('|');
    if (NodeEventTypes.includes(eventType)) {
      const value = (event.target as HTMLInputElement).value;
      handleNodeChange(id, eventType, value);
    } else {
      console.error('Undefined node event is triggered');
    }
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
    const [dragSiblings, dragIndex, dragNode] = findListNode(listDataClone, dragKey)!;
    dragSiblings.splice(dragIndex, 1);

    // inserts dragNode at correct location
    const [dropSiblings, dropIndex, dropNode] = findListNode(listDataClone, dropKey)!;
    if (relPos == 0) { // if dropped on a parent
      dropNode.children = dropNode.children || []; // in case the children is null
      dropNode.children.unshift(dragNode);
    } else { // if dropped on a sibling
      dropSiblings.splice(dropIndex + 1, 0, dragNode);
    }

    const newTreeData = convertToRawData(listDataClone[0]);
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