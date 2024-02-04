import './index.css';
import { Routes, Route } from 'react-router-dom';

import Signup from './PAGES/Signup';
import Login from './PAGES/Login';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path = '/signup' element={<Signup />} />
        <Route path = '/login' element={<Login />} />
      </Routes>
    </div>
    
  );
}

export default App;
