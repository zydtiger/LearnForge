import React from 'react';
import { useAppDispatch } from "../redux/hooks";
import { setSkillset } from "../redux/slices/skillsetSlice";
import { RawNodeDatum } from 'react-d3-tree';
import { Tree, ConfigProvider, Flex } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';

/* Augment the data node to contain extra information for regeneration */
type SkillListDataNode = TreeDataNode & {
  name: string;
  progressPercent: number;
  children?: SkillListDataNode[];
};

/**
 * Generates list data recursively from data prop.
 * @param currentNode current node to convert
 * @param parentKey inherited parent key for key generation
 * @param index inherited index in parent's children array
 * @returns converted current node
 */
function convertToListDataRecursive(currentNode: RawNodeDatum, parentKey: React.Key, index: number): SkillListDataNode {
  const key = parentKey + '-' + String(index);

  const node: SkillListDataNode = {
    key,
    title: <Flex align="center">
      <p style={{ marginRight: 10 }}>{currentNode.name}</p>
      <svg width={60} height={5} xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect width={60} height={5} fill="lightgray" />
          <rect width={currentNode.progressPercent / 100 * 60} height={5} fill="#87cc4f" />
        </g>
      </svg>
      <p style={{ marginLeft: 10 }}>{Math.round(currentNode.progressPercent)}%</p>
    </Flex>,

    // stores name and progress for regeneration
    name: currentNode.name,
    progressPercent: currentNode.progressPercent
  };

  if (currentNode.children) {
    node.children = currentNode.children.map((val, index) => convertToListDataRecursive(val, key, index));
  }

  return node;
}

/**
 * Generates list data from data prop.
 * @param rootNode root node of the tree
 * @returns generated tree data
 */
function convertToListData(rootNode: RawNodeDatum): SkillListDataNode[] {
  return [convertToListDataRecursive(rootNode, '0', 0)];
}

/**
 * Regenerates tree data from manipulation.
 * @param currentNode current node to convert
 * @returns converted current node
 */
function convertToTreeData(currentNode: SkillListDataNode): RawNodeDatum {
  const node: RawNodeDatum = {
    name: currentNode.name,
    progressPercent: currentNode.progressPercent,
  };

  if (currentNode.children) {
    node.children = currentNode.children.map((val: SkillListDataNode) => convertToTreeData(val));
  }

  return node;
}

/**
   * Finds the target key in siblings recursively.
   * @param siblings the current siblings set to look at
   * @param key the target key to find
   * @returns [siblings, index, node]
   */
function findNode(siblings: SkillListDataNode[], key: React.Key): [SkillListDataNode[], number, SkillListDataNode] | null {
  for (let i = 0; i < siblings.length; i++) {
    if (siblings[i].key == key) {
      return [siblings, i, siblings[i]];
    }
    if (siblings[i].children) {
      const res = findNode(siblings[i].children!, key);
      if (res) return res;
    }
  }
  return null;
};

function SkillLayerList({ data }: { data: RawNodeDatum; }) {
  const dispatch = useAppDispatch();
  const listData = convertToListData(data);

  const handleTreeOnDrop: TreeProps['onDrop'] = (info) => {
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
          onDrop={handleTreeOnDrop}
        />
      </div>
    </ConfigProvider>
  );
};

export default SkillLayerList;