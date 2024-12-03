//import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Import from "./pages/Import";
import Input from "./pages/Input";
import Submit from "./pages/Submit";
import Navbar from "./constants/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen flex justify-center items-center">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/import" element={<Import />} />
          <Route path="/input" element={<Input />} />
          <Route path="/submit" element={<Submit />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
