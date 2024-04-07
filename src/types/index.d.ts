import { RawNodeDatum } from "react-d3-tree";
import { TreeDataNode } from "antd";

/* Augment the node datum to contain progress percentage */
declare module 'react-d3-tree' {
  export interface RawNodeDatum {
    name: string;
    progressPercent: number;
    attributes?: Record<string, string | number | boolean>;
    children?: RawNodeDatum[];
  }
}

/* Augment the data node to contain extra information for regeneration */
export type SkillListDataNode = TreeDataNode & {
  name: string;
  progressPercent: number;
  children?: SkillListDataNode[];
};