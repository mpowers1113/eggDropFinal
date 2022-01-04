import React from "react";
import { Link } from "react-router-dom";

const Navbar = (props) => {
  return (
    <div className="row navbar-map">
      <Link to="/events">
        <i className="fas fa-users fa-3x"></i>
      </Link>
      <Link to="/search">
        <i className="fas fa-search fa-3x"></i>
      </Link>
      <Link to="/map">
        <i className="fas fa-globe fa-3x"></i>
      </Link>
      <Link to="/profile">
        <i className="fas fa-user fa-3x"></i>
      </Link>
    </div>
  );
};

export default Navbar;
