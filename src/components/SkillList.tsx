import { useAppDispatch } from "../redux/hooks";
import { setSkillset } from "../redux/slices/skillsetSlice";
import { RawNodeDatum } from 'react-d3-tree';
import { Tree, ConfigProvider } from 'antd';
import type { TreeProps } from 'antd';

import { convertToListData, convertToTreeData, findNode } from '../lib/skillList';

function SkillList({ data }: { data: RawNodeDatum; }) {
  const dispatch = useAppDispatch();
  const listData = convertToListData(data);

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