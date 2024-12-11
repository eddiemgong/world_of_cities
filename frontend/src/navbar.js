import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div 
      className="d-flex flex-column p-3 bg-light"
      style={{
        width: '250px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        overflowY: 'auto',
        borderRight: '5px solid #ccc'
      }}
    >
      <h2 className="text-center" style={{ fontStyle: 'italic' }}> Navigation </h2>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/" className="nav-link text-dark">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/overview" className="nav-link text-dark">Overview</Link>
        </li>
        <li className="nav-item">
          <Link to="/create" className="nav-link text-dark">Create</Link>
        </li>
        <li className="nav-item">
          <Link to="/stats" className="nav-link text-dark">Stats</Link>
        </li>
        <li className="nav-item">
          <Link to="/map" className="nav-link text-dark">Map</Link>
        </li>
        <li className="nav-item">
          <Link to="/about" className="nav-link text-dark">About</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
