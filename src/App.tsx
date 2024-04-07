import { useEffect, useState } from 'react';
import { FloatButton } from 'antd';
import { UnorderedListOutlined, SisternodeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import SkillTree from './components/SkillTree';
import SkillList from './components/SkillList';
import Manual from './components/Manual';

import { useAppSelector, useAppDispatch } from './redux/hooks';
import { selectSkillset, selectIsInitialBoot, fetchSkillset, setNotInitialBoot } from './redux/slices/skillsetSlice';

function App() {
  const dispatch = useAppDispatch();
  const skillset = useAppSelector(selectSkillset);

  useEffect(() => {
    dispatch(fetchSkillset());
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
      <Manual isModalOpen={isHelpModalOpen || isInitialBoot} closeModal={closeModal} />
      {ports[viewMode].Component}
      <FloatButton
        style={{ bottom: 100 }}
        icon={<QuestionCircleOutlined />}
        onClick={() => setIsHelpModalOpen(true)}
      />
      <FloatButton
        type="primary"
        icon={ports[viewMode].Icon}
        onClick={() => setViewMode(viewMode == 'tree' ? 'list' : 'tree')}
      />
    </div>
  );
}

export default App;
