import { useState } from 'react';
import { FloatButton } from 'antd';
import { UnorderedListOutlined, SisternodeOutlined } from '@ant-design/icons';
import SkillTree from './components/SkillTree';
import SkillLayerList from './components/SkillLayerList';

/* Use mock data for UI design */
import skillset from './assets/mock.json';

function App() {
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
