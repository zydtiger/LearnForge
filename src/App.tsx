import { useState } from 'react';
import { FloatButton } from 'antd';
import { UnorderedListOutlined, SisternodeOutlined } from '@ant-design/icons';
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

  return (
    <div className="app">
      <Manual />
      {ports[viewMode].Component}
      <FloatButton
        type="primary"
        icon={ports[viewMode].Icon}
        onClick={() => setViewMode(viewMode == 'tree' ? 'list' : 'tree')}
      />
    </div>
  );
}

export default App;
