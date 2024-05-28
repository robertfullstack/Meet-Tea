import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Home from "./screens/Home.js";
import Login from "./screens/Login.js";
import Cadastro from "./screens/Cadastro.js";
import Feed from "./screens/Feed.js";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/feed" element={<Feed />} />


        </Routes>
      </Router>
    </>
  );
}

export default App;
