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

/* Override RawNodeDatum for rendering purposes */
declare module 'react-d3-tree' {
  export interface RawNodeDatum extends SkillsetRawNode {
    children?: RawNodeDatum[]
  }
}

/* Override TreeDataNode to contain extra information for regeneration */
export type SkillListDataNode = TreeDataNode & SkillsetRawNode & {
  children?: SkillListDataNode[]
};