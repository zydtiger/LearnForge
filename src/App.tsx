// external imports
import { useEffect } from 'react';
import { Flex, Spin } from 'antd';
import { UnorderedListOutlined, SisternodeOutlined, FormOutlined } from '@ant-design/icons';

// component imports
import SkillTree from './components/SkillTree';
import SkillList from './components/SkillList';
import SkillNote from './components/SkillNote';
import ManualModal from './components/ManualModal';
import AppMenu from './components/AppMenu';
import SkillContextMenu from './components/SkillContextMenu';
import SkillBtns from './components/SkillBtns';

// redux imports
import { useAppSelector, useAppDispatch } from './redux/hooks';
import {
  selectSkillset,
  selectIsInitialBoot,
  selectIsFirstTimeLoading,
  fetchSkillset,
  setNotInitialBoot,
  saveSkillset,
} from './redux/slices/skillsetSlice';
import {
  selectViewMode,
  selectIsManualModalOpen,
  setIsManualModalOpen,
  setViewMode
} from './redux/slices/viewSlice';

function App() {
  const dispatch = useAppDispatch();
  const skillset = useAppSelector(selectSkillset);
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
    },
    note: {
      Icon: <FormOutlined />,
      Component: <SkillNote />
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

      {/* Skillset view port */}
      <div className="viewport" hidden={viewMode != 'tree' && viewMode != 'list'}>
        <SkillContextMenu>
          <div className='skillset' style={{ width: '100%', height: '100%' }}>
            {/* Do not re-render component from scratch, simply SHOW (improves performance by 2x) */}
            <div className="tree" hidden={viewMode != 'tree'} style={{ width: '100%', height: '100%' }}>
              {ports.tree.Component}
            </div>
            <div className="list" hidden={viewMode != 'list'} style={{ width: '100%', height: '100%' }}>
              {ports.list.Component}
            </div>

            {/* Global Functional Btns */}
            <SkillBtns
              toggleViewBtn={{
                tooltip: "Toggle " + (viewMode == 'tree' ? "List View" : "Tree View"),
                Icon: ports[viewMode].Icon,
              }}
              onToggleView={() => dispatch(setViewMode(viewMode == 'tree' ? 'list' : 'tree'))}
            />
          </div>
        </SkillContextMenu>
      </div>

      {/* Note view port */}
      <div className="viewport" hidden={viewMode != 'note'}>
        {ports.note.Component}
      </div>
    </div>
  );
}

export default App;
