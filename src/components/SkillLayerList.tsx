import React from 'react';
import { RawNodeDatum } from 'react-d3-tree';
import { Tree, ConfigProvider, Flex } from 'antd';
import type { TreeDataNode } from 'antd';

/**
 * Generates tree data recursively from data prop.
 * @param currentNode current node to convert
 * @param parentKey inherited parent key for key generation
 * @param index inherited index in parent's children array
 * @param keysCollect keys collector
 * @returns converted current node
 */
function convertToTreeDataRecursive(currentNode: RawNodeDatum, parentKey: React.Key, index: number): TreeDataNode {
  const key = parentKey + '-' + String(index);

  const node: TreeDataNode = {
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
    </Flex>
  };

  if (currentNode.children) {
    node.children = currentNode.children!.map((val, index) => convertToTreeDataRecursive(val, key, index));
  }

  return node;
}

/**
 * Generates tree data from data prop.
 * @param rootNode root node of the tree
 * @returns generated tree data
 */
function convertToTreeData(rootNode: RawNodeDatum): TreeDataNode[] {
  return [convertToTreeDataRecursive(rootNode, '0', 0)];
}

function SkillLayerList({ data }: { data: RawNodeDatum; }) {
  const treeData = convertToTreeData(data);

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
          blockNode
          defaultExpandAll
          treeData={treeData}
        />
      </div>
    </ConfigProvider>
  );
};

export default SkillLayerList;