import { useState } from 'react';
import { FloatButton } from 'antd';
import { UnorderedListOutlined, SisternodeOutlined } from '@ant-design/icons';
import SkillTree from './components/SkillTree';
import SkillLayerList from './components/SkillLayerList';

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
      Component: <SkillLayerList data={skillset} />
    }
  };
  const [viewMode, setViewMode] = useState('tree' as keyof typeof ports);

  return (
    <div className="app">
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
