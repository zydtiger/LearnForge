import { Menu } from 'antd';
import { FileFilled, EditFilled, EyeFilled, QuestionCircleOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../redux/hooks';
import { bindShortcuts, convertMenuToDisplayMode, invokeAction } from '../lib/menu';

// define menu items
const items = [
  {
    label: 'File',
    key: 'file',
    icon: <FileFilled />,
    children: [
      {
        label: 'Import',
        key: 'import'
      },
      {
        label: 'Export',
        key: 'export',
      },
      {
        type: 'divider'
      },
      {
        label: 'Save',
        key: 'save'
      }
    ]
  },
  {
    label: 'Edit',
    key: 'edit',
    icon: <EditFilled />,
    children: [
      {
        label: 'Undo',
        key: 'undo',
      },
      {
        label: 'Redo',
        key: 'redo',
      }
    ]
  },
  {
    label: 'View',
    key: 'view',
    icon: <EyeFilled />,
    children: [
      {
        label: 'Reset View',
        key: 'reset',
      },
      {
        type: 'divider'
      },
      {
        label: 'Tree',
        key: 'tree'
      },
      {
        label: 'List',
        key: 'list'
      },
    ],
  },
  {
    label: 'Help',
    key: 'help',
    icon: <QuestionCircleOutlined />
  }
];

function AppMenu() {
  const dispatch = useAppDispatch();
  bindShortcuts(dispatch);

  return <Menu
    mode="horizontal"
    onClick={({ key }) => invokeAction(key, dispatch)}
    selectable={false}
    items={convertMenuToDisplayMode(items)}
    style={{ lineHeight: '30px' }
    }
  />;
};

export default AppMenu;