import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <h2>SaveWell</h2>
      <nav>
        <NavLink to="/Home">Home </NavLink>
        <NavLink to="/register">Register</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/Profile">Profile</NavLink>
        <NavLink to="/feedback">Feedback</NavLink>
        <NavLink to="/logout">Logout</NavLink>
      </nav>
    </header>
  );
};

export default Header;