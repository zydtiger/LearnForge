import { Menu } from 'antd';
import { FileFilled, EditFilled, EyeFilled, QuestionCircleOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../redux/hooks';
import { importSkillset, exportSkillset, saveSkillset, undo, redo } from '../redux/slices/skillsetSlice';
import { setViewMode, setIsManualModalOpen } from '../redux/slices/viewSlice';
import shortcuts from "../assets/shortcuts.json";

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

  // define actions
  const actions = {
    import: {
      shortcuts: shortcuts['import'],
      exec: () => dispatch(importSkillset())
    },
    export: {
      shortcuts: shortcuts['export'],
      exec: () => dispatch(exportSkillset())
    },
    save: {
      shortcuts: shortcuts['save'],
      exec: () => dispatch(saveSkillset())
    },
    undo: {
      shortcuts: shortcuts['undo'],
      exec: () => dispatch(undo())
    },
    redo: {
      shortcuts: shortcuts['redo'],
      exec: () => dispatch(redo())
    },
    reset: {
      shortcuts: shortcuts['reset'],
      exec: () => window.location.reload()
    },
    tree: {
      shortcuts: shortcuts['tree'],
      exec: () => dispatch(setViewMode('tree'))
    },
    list: {
      shortcuts: shortcuts['list'],
      exec: () => dispatch(setViewMode('list'))
    },
    help: {
      shortcuts: shortcuts['help'],
      exec: () => dispatch(setIsManualModalOpen(true))
    }
  };

  // bind shortcuts to events
  window.onkeydown = (event) => {
    const modifier = window.navigator.userAgent.indexOf('Mac') != -1 ? event.metaKey : event.ctrlKey;
    if (!modifier) return;
    for (const name in actions) {
      const action = actions[name as keyof typeof actions];
      for (const shortcut of action.shortcuts) {
        const shortcutKeys = shortcut.split('+');
        let targetKey = shortcutKeys[1] == 'shift' ? shortcutKeys[2].toUpperCase() : shortcutKeys[1];
        if (event.key == targetKey) {
          action.exec();
          return;
        }
      }
    };
  };

  return <Menu
    mode="horizontal"
    onClick={(e) => actions[e.key as keyof typeof actions].exec()}
    selectable={false}
    items={items}
    style={{ lineHeight: '30px' }
    }
  />;
};

export default AppMenu;