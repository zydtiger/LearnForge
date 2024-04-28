import { nanoid } from 'nanoid';
import { SkillsetRawNode } from ".";

export const DefaultNode = (): SkillsetRawNode => ({
  id: nanoid(),
  name: 'New Node',
  progressPercent: 0
});

export const DefaultRootNode: SkillsetRawNode = {
  id: 'root',
  name: 'Root',
  progressPercent: 0
};