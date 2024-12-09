//import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Import from "./pages/Import";
import Input from "./pages/Input";
import Submit from "./pages/Submit";
import Navbar from "./constants/Navbar";
import CreateWallet from "./pages/createWallet";
import NewWallet from "./pages/NewWallet";

function App() {
  return (
    <Router>
      <div className="mx-auto min-h-screen max-w-7xl ">
        <Navbar />
        <div className="flex justify-center items-center">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/create-wallet" element={<CreateWallet />} />
            <Route path="/new-wallet" element={<NewWallet />} />
            <Route path="/import" element={<Import />} />
            <Route path="/input" element={<Input />} />
            <Route path="/submit" element={<Submit />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
