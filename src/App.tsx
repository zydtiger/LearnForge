import { useState } from 'react';
import { FloatButton } from 'antd';
import { UnorderedListOutlined, SisternodeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import SkillTree from './components/SkillTree';
import SkillList from './components/SkillList';
import Manual from './components/Manual';

import { useAppSelector } from './redux/hooks';
import { selectSkillset } from './redux/slices/skillsetSlice';

function App() {
  const skillset = useAppSelector(selectSkillset);

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
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(true);

  return (
    <div className="app">
      <Manual isModalOpen={isHelpModalOpen} closeModal={() => setIsHelpModalOpen(false)} />
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
