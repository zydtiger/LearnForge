// import { useState } from "react";
import Tree from 'react-d3-tree'
import './tree.css'

import mock from './assets/mock.ts'


function App() {
  return (
    <div className="app">
      <Tree
        data={mock}
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
      />
    </div>
  );
}

export default App;
