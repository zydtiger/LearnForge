import { Dropdown, MenuProps } from 'antd';
import { convertMenuToDisplayMode, invokeAction } from '../lib/menu';
import { useAppDispatch } from '../redux/hooks';

const items: MenuProps['items'] = [
  {
    label: 'Save',
    key: 'save'
  },
  {
    type: 'divider'
  },
  {
    label: 'Undo',
    key: 'undo',
  },
  {
    label: 'Redo',
    key: 'redo',
  },
  {
    type: 'divider'
  },
  {
    label: 'Reset View',
    key: 'reset',
  },
  {
    label: 'Tree',
    key: 'tree'
  },
  {
    label: 'List',
    key: 'list'
  },
  {
    type: 'divider'
  },
  {
    label: 'Help',
    key: 'help',
  }
];

function SkillContextMenu(props: React.PropsWithChildren) {
  const dispatch = useAppDispatch();

  return (
    <Dropdown
      menu={{
        items: convertMenuToDisplayMode(items),
        onClick: ({ key }) => invokeAction(key, dispatch)
      }}
      trigger={['contextMenu']}
    >
      {props.children}
    </Dropdown>
  );
}

export default SkillContextMenu;