import { RawNodeDatum } from "react-d3-tree";
import { nanoid } from 'nanoid';

export const DefaultNode = (): RawNodeDatum => ({
  id: nanoid(),
  name: 'New Node',
  progressPercent: 0
});

export const DefaultRootNode: RawNodeDatum = {
  id: 'root',
  name: 'Root',
  progressPercent: 0
};