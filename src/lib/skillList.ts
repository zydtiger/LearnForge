import React, { SyntheticEvent } from 'react';
import { SkillListDataNode, SkillsetRawNode } from '../types';

import SkillListNode from '../components/SkillListNode';

/**
 * Generates list data recursively from data prop.
 * @param currentNode current node to convert
 * @param parentKey inherited parent key for key generation
 * @param index inherited index in parent's children array
 * @param onChange callback that node event is hooked to
 * @param keysCollect collect all the keys
 * @returns converted current node
 */
function convertToListDataRecursive(
  currentNode: SkillsetRawNode,
  parentKey: React.Key,
  index: number,
  onChange: (event: SyntheticEvent) => void,
  keysCollect: React.Key[]
): SkillListDataNode {
  const key = parentKey + '-' + String(index);
  keysCollect.push(key);

  const node: SkillListDataNode = {
    key,
    title: SkillListNode({
      nodeDatum: currentNode,
      onChange: (event) => {
        event.type += `|${currentNode.id}`; // exposes the key of the current node for event location
        onChange(event);
      },
      isRoot: parentKey == '0'
    }),

    // stores name and progress for regeneration
    id: currentNode.id,
    name: currentNode.name,
    progressPercent: currentNode.progressPercent,
  };

  if (currentNode.mdNote) {
    node.mdNote = currentNode.mdNote;
  }

  if (currentNode.children) {
    node.children = currentNode.children.map((val, index) => convertToListDataRecursive(val, key, index, onChange, keysCollect));
  }

  return node;
}

/**
 * Generates list data from data prop.
 * @param rootNode root node of the tree
 * @param onChange callback that node event is hooked to
 * @param keysCollect collect all the keys
 * @returns generated tree data
 */
function convertToListData(
  rootNode: SkillsetRawNode,
  onChange: (event: SyntheticEvent) => void,
  keysCollect: React.Key[]
): SkillListDataNode[] {
  return [convertToListDataRecursive(rootNode, '0', 0, onChange, keysCollect)];
}

/**
 * Regenerates tree data from manipulation.
 * @param currentNode current node to convert
 * @returns converted current node
 */
function convertToRawData(currentNode: SkillListDataNode): SkillsetRawNode {
  const node: SkillsetRawNode = {
    id: currentNode.id,
    name: currentNode.name,
    progressPercent: currentNode.progressPercent,
  };

  if (currentNode.mdNote) {
    node.mdNote = currentNode.mdNote;
  }

  if (currentNode.children) {
    node.children = currentNode.children.map((val: SkillListDataNode) => convertToRawData(val));
  }

  return node;
}

/**
   * Finds the target key in siblings recursively.
   * @param siblings the current siblings set to look at
   * @param key the target key to find
   * @returns [siblings, index, node]
   */
function findListNode(siblings: SkillListDataNode[], key: React.Key): [SkillListDataNode[], number, SkillListDataNode] | null {
  for (let i = 0; i < siblings.length; i++) {
    if (siblings[i].key == key) {
      return [siblings, i, siblings[i]];
    }
    if (siblings[i].children) {
      const res = findListNode(siblings[i].children!, key);
      if (res) return res;
    }
  }
  return null;
};

export { convertToListData, convertToRawData, findListNode };