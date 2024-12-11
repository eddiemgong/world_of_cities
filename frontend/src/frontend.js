import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from './navbar.js';
import Default from './home.js';
import Overview from './overview.js';
import Details from './detail.js';
import Modify from "./modify.js";
import Create from "./create.js";
import Stats from "./stats.js";
import Map from "./map.js";
import About from "./about.js";

function App() {
  return (
    <div className="App">
      <Router>
        <div style={{ display: 'flex' }}>
          <Navbar />
          <div style={{
            marginLeft: '250px',
            padding: '20px',
            flexGrow: 1,
            backgroundColor: '#f8f9fa',
            minHeight: '100vh',
          }}>
            <h1 className="text-center" style={{ fontWeight: 'bold', fontSize: '4rem' }}> World of Cities </h1>
            <Routes>
              <Route path="/" element={<Default />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/detail/:name" element={<Details />} />
              <Route path="/modify/:name" element={<Modify />} />
              <Route path="/create" element={<Create />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/map" element={<Map />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
