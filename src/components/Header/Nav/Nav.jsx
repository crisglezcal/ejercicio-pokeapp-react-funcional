import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="nav">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/new">Nuevo Pokémon</Link></li>
        <li><Link to="/pokemon/">Detalles</Link></li>
      </ul> 
    </nav>
  );
};

export default Nav;