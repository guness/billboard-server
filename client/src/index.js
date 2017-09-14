import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './index.html';
import Sider from './components/sider';


function App() {
  return (
    <div>
        <Sider/>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
