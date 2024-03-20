import SkillTree from './components/SkillTree';

/* Use mock data for UI design */
import skillset from './assets/mock.json'

function App() {
  return (
    <div className="app">
      <SkillTree data={skillset} />
    </div>
  );
}

export default App;
