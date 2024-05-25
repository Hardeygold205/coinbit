//import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Import from './pages/Import';
import Input from './pages/Input';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-black flex justify-center items-center">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/import" element={<Import />} />
          <Route path="/input" element={<Input />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
