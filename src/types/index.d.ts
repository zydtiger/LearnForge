import { RawNodeDatum } from "react-d3-tree";
import { TreeDataNode } from "antd";

/* Unifies the usage of skillset node */
export interface SkillsetRawNode {
  id: string;
  name: string;
  progressPercent: number;
  mdNote?: string,
  attributes?: Record<string, string | number | boolean>;
  children?: SkillsetRawNode[];
}

/* Augment the node datum to contain progress percentage */
declare module 'react-d3-tree' {
  export interface RawNodeDatum {
    id: string;
    name: string;
    progressPercent: number;
    mdNote?: string,
    attributes?: Record<string, string | number | boolean>;
    children?: RawNodeDatum[];
  }
}

/* Augment the data node to contain extra information for regeneration */
export type SkillListDataNode = TreeDataNode & {
  id: string;
  name: string;
  progressPercent: number;
  mdNote?: string,
  children?: SkillListDataNode[];
};