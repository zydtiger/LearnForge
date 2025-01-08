// database for storing skillset nodes data

import Dexie, { Table } from "dexie";
import { SkillsetRawNode } from "@/types";
import { DefaultRootNode } from "@/types/defaults";

// entry is the same as the node, but with id[] as children instead of node[]
export interface SkillsetRawEntry extends Omit<SkillsetRawNode, "children"> {
  children?: string[];
}

class SkillsetDB extends Dexie {
  skillset!: Table<SkillsetRawEntry, string>;

  constructor() {
    super("SkillsetDB");
    // define the schema for the database, id is the primary key
    this.version(1).stores({ skillset: "&id" });
  }

  async getSkillset(): Promise<SkillsetRawNode> {
    const skillsetArr = await this.skillset.toArray();

    // fill default value if db is empty
    if (skillsetArr.length === 0) {
      const defaultNode = DefaultRootNode();
      await this.setSkillset(defaultNode);
      return defaultNode;
    }

    const rootIndex = skillsetArr.findIndex((entry) => entry.id === "root");
    return entriesToNode(skillsetArr, rootIndex);
  }

  async setSkillset(skillset: SkillsetRawNode) {
    await this.skillset.clear();
    const skillsetArr = nodeToEntries(skillset);
    await this.skillset.bulkAdd(skillsetArr);
  }
}

const entriesToNode = (
  entries: SkillsetRawEntry[],
  index: number,
): SkillsetRawNode => {
  // if there are no children, they are the same
  const entryChildren = entries[index].children;
  if (entryChildren === undefined) {
    return entries[index] as SkillsetRawNode;
  }

  const { children, ...rest } = entries[index];

  // recursively wrap children in node
  return {
    ...rest,
    children: children?.map((id) => {
      const childIndex = entries.findIndex((entry) => entry.id === id);
      if (childIndex === -1) {
        throw new Error(`Child node with id ${id} not found`);
      }
      return entriesToNode(entries, childIndex);
    }),
  };
};

const nodeToEntries = (node: SkillsetRawNode): SkillsetRawEntry[] => {
  const entries: SkillsetRawEntry[] = [];

  // helper function to process each node and its children
  const processNode = (currentNode: SkillsetRawNode) => {
    // create entry from current node
    const { children, ...rest } = currentNode;
    const entry: SkillsetRawEntry = {
      ...rest,
      children: children?.map((child) => child.id),
    };
    entries.push(entry);
    // recursively process children
    children?.forEach(processNode);
  };

  // start processing from root node
  processNode(node);

  return entries;
};

// create and export a single instance of the database
export const skillsetDB = new SkillsetDB();
