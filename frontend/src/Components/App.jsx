import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../styles/App.css";
import { Header } from "./Header";
import { Home } from "../Pages/Home";
import { Game } from "../Pages/Game";
import { Scores } from "../Pages/Scores";

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ! ADD RULES PAGE TO EXPLAIN HOW TO PLAY YAHTZEE !
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/scores" element={<Scores />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
