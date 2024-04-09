import { useEffect, useState } from 'react';
import { FloatButton } from 'antd';
import {
  UnorderedListOutlined,
  SisternodeOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  DownloadOutlined,
  UploadOutlined
} from '@ant-design/icons';
import SkillTree from './components/SkillTree';
import SkillList from './components/SkillList';
import ManualModal from './components/ManualModal';

import { useAppSelector, useAppDispatch } from './redux/hooks';
import {
  selectSkillset,
  selectIsInitialBoot,
  selectLastSaveTime,
  selectIsSaved,
  selectIsUndoable,
  selectIsRedoable,
  undo,
  redo,
  fetchSkillset,
  setNotInitialBoot,
  saveSkillset,
  exportSkillset,
  importSkillset,
} from './redux/slices/skillsetSlice';

function App() {
  const dispatch = useAppDispatch();
  const skillset = useAppSelector(selectSkillset);
  const lastSaveTime = useAppSelector(selectLastSaveTime);
  const isSaved = useAppSelector(selectIsSaved);
  const isUndoable = useAppSelector(selectIsUndoable);
  const isRedoable = useAppSelector(selectIsRedoable);

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

  const [viewMode, setViewMode] = useState('tree' as keyof typeof ports);
  const isInitialBoot = useAppSelector(selectIsInitialBoot);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const closeModal = () => {
    if (isInitialBoot) dispatch(setNotInitialBoot());
    setIsHelpModalOpen(false);
  };

  return (
    <div className="app">
      <ManualModal isModalOpen={isHelpModalOpen || isInitialBoot} closeModal={closeModal} />
      {ports[viewMode].Component}

      {/* Function Btns */}
      <FloatButton.Group
        trigger='click'
        style={{ right: 20, bottom: 176 }}
      >
        <FloatButton
          tooltip={"Import"}
          icon={<UploadOutlined />}
          onClick={() => dispatch(importSkillset())}
        />
        <FloatButton
          tooltip={"Export"}
          icon={<DownloadOutlined />}
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
        onClick={() => setIsHelpModalOpen(true)}
      />
      <FloatButton
        type="primary"
        style={{ right: 20, bottom: 20 }}
        tooltip={"Toggle " + (viewMode == 'tree' ? "List View" : "Tree View")}
        icon={ports[viewMode].Icon}
        onClick={() => setViewMode(viewMode == 'tree' ? 'list' : 'tree')}
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
