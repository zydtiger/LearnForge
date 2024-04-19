// external imports
import { useEffect } from 'react';
import { Flex, FloatButton, Spin } from 'antd';
import {
  UnorderedListOutlined,
  SisternodeOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  LogoutOutlined,
  LoginOutlined
} from '@ant-design/icons';

// component imports
import SkillTree from './components/SkillTree';
import SkillList from './components/SkillList';
import ManualModal from './components/ManualModal';
import AppMenu from './components/AppMenu';
import GlobalContextMenu from './components/GlobalContextMenu';

// redux imports
import { useAppSelector, useAppDispatch } from './redux/hooks';
import {
  selectSkillset,
  selectIsInitialBoot,
  selectLastSaveTime,
  selectIsSaved,
  selectIsUndoable,
  selectIsRedoable,
  selectIsFirstTimeLoading,
  undo,
  redo,
  fetchSkillset,
  setNotInitialBoot,
  saveSkillset,
  exportSkillset,
  importSkillset
} from './redux/slices/skillsetSlice';
import {
  selectViewMode,
  selectIsManualModalOpen,
  setViewMode,
  setIsManualModalOpen
} from './redux/slices/viewSlice';

function App() {
  const dispatch = useAppDispatch();
  const skillset = useAppSelector(selectSkillset);
  const lastSaveTime = useAppSelector(selectLastSaveTime);
  const isSaved = useAppSelector(selectIsSaved);
  const isUndoable = useAppSelector(selectIsUndoable);
  const isRedoable = useAppSelector(selectIsRedoable);
  const isFirstTimeLoading = useAppSelector(selectIsFirstTimeLoading);

  useEffect(() => {
    dispatch(fetchSkillset());
    setInterval(() => dispatch(saveSkillset()), 10000); // saves every 10s
  }, [dispatch]);

  const ports = {
    tree: {
      Icon: <UnorderedListOutlined />,
      Component: <SkillTree data={skillset} />
    },
    list: {
      Icon: <SisternodeOutlined />,
      Component: <SkillList data={skillset} />
    }
  };

  const viewMode = useAppSelector(selectViewMode);
  const isInitialBoot = useAppSelector(selectIsInitialBoot);
  const isManualModalOpen = useAppSelector(selectIsManualModalOpen);

  const closeModal = () => {
    if (isInitialBoot) dispatch(setNotInitialBoot());
    dispatch(setIsManualModalOpen(false));
  };

  return (
    <div className="app">
      {/* Loading page */}
      {isFirstTimeLoading && <Flex
        justify='center'
        align='center'
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          backgroundColor: '#f6f6f6'
        }}>
        <Spin size='large' />
      </Flex>}

      {/* App Menu */}
      <AppMenu />

      {/* Manual Modal */}
      <ManualModal isModalOpen={isManualModalOpen || isInitialBoot} closeModal={closeModal} />

      {/* Core view port */}
      <GlobalContextMenu>
        <div className='viewport' style={{ width: '100%', height: '100%' }}>
          {/* Do not re-render component from scratch, simply SHOW (improves performance by 2x) */}
          <div className="tree" hidden={viewMode != 'tree'} style={{ width: '100%', height: '100%' }}>
            {ports.tree.Component}
          </div>
          <div className="list" hidden={viewMode != 'list'} style={{ width: '100%', height: '100%' }}>
            {ports.list.Component}
          </div>
        </div>
      </GlobalContextMenu>

      {/* Function Btns */}
      <FloatButton.Group
        trigger='click'
        style={{ right: 20, bottom: 176 }}
      >
        <FloatButton
          tooltip={"Import"}
          icon={<LoginOutlined />}
          onClick={() => dispatch(importSkillset())}
        />
        <FloatButton
          tooltip={"Export"}
          icon={<LogoutOutlined />}
          onClick={() => dispatch(exportSkillset())}
        />
      </FloatButton.Group>
      <FloatButton
        type={isSaved ? 'default' : 'primary'}
        style={{ right: 20, bottom: 124 }}
        badge={{ dot: !isSaved }}
        tooltip={"Last Saved " + new Date(lastSaveTime).toLocaleString()}
        icon={<SaveOutlined />}
        onClick={() => dispatch(saveSkillset())}
      />
      <FloatButton
        style={{ right: 20, bottom: 72 }}
        tooltip={"View Manual"}
        icon={<QuestionCircleOutlined />}
        onClick={() => dispatch(setIsManualModalOpen(true))}
      />
      <FloatButton
        type="primary"
        style={{ right: 20, bottom: 20 }}
        tooltip={"Toggle " + (viewMode == 'tree' ? "List View" : "Tree View")}
        icon={ports[viewMode].Icon}
        onClick={() => dispatch(setViewMode(viewMode == 'tree' ? 'list' : 'tree'))}
      />

      {/* Undo / redo */}
      <FloatButton
        type={isUndoable ? "primary" : "default"}
        style={{ left: 20, bottom: 72 }}
        tooltip={"Undo"}
        icon={<UndoOutlined />}
        onClick={() => dispatch(undo())}
      />
      <FloatButton
        type={isRedoable ? "primary" : "default"}
        style={{ left: 20, bottom: 20 }}
        tooltip={"Redo"}
        icon={<RedoOutlined />}
        onClick={() => dispatch(redo())}
      />
    </div>
  );
}

export default App;
