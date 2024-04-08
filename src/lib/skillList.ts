import React, { SyntheticEvent } from 'react';
import { SkillListDataNode } from '../types';
import { RawNodeDatum } from 'react-d3-tree';

import SkillListNode from '../components/SkillListNode';

/**
 * Generates list data recursively from data prop.
 * @param currentNode current node to convert
 * @param parentKey inherited parent key for key generation
 * @param index inherited index in parent's children array
 * @returns converted current node
 */
function convertToListDataRecursive(currentNode: RawNodeDatum, parentKey: React.Key, index: number, onChange: (event: SyntheticEvent) => void): SkillListDataNode {
  const key = parentKey + '-' + String(index);

  const node: SkillListDataNode = {
    key,
    title: SkillListNode({
      nodeDatum: currentNode,
      onChange: (event) => {
        event.type += `|${key}`; // exposes the key of the current node for event location
        onChange(event);
      },
      isRoot: parentKey == '0'
    }),

    // stores name and progress for regeneration
    name: currentNode.name,
    progressPercent: currentNode.progressPercent,
  };

  if (currentNode.children) {
    node.children = currentNode.children.map((val, index) => convertToListDataRecursive(val, key, index, onChange));
  }

  return node;
}

/**
 * Generates list data from data prop.
 * @param rootNode root node of the tree
 * @returns generated tree data
 */
function convertToListData(rootNode: RawNodeDatum, onChange: (event: SyntheticEvent) => void): SkillListDataNode[] {
  return [convertToListDataRecursive(rootNode, '0', 0, onChange)];
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

/**
 * Updates percentages at node by calling
 * the recursive inner function.
 */
function updatePercentages(nodeDatum: RawNodeDatum) {
  const generatePercentagesAtNode = (nodeDatum: RawNodeDatum): number => {
    if (nodeDatum.children && nodeDatum.children.length != 0) { // if NOT leaf node
      const childrenPercentageSum = nodeDatum.children.reduce((acc: number, current: RawNodeDatum) => {
        return acc + generatePercentagesAtNode(current);
      }, 0);
      nodeDatum.progressPercent = childrenPercentageSum / nodeDatum.children.length;
    }
    return nodeDatum.progressPercent;
  };
  generatePercentagesAtNode(nodeDatum);
}

export { convertToListDataRecursive, convertToListData, convertToTreeData, findNode, updatePercentages };