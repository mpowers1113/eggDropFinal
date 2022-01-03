import React from "react";
import { useNavigate } from "react-router";

const Navbar = (props) => {
  const navigate = useNavigate();
  return (
    <div className="row navbar-map">
      <i className="fas fa-users fa-3x" onClick={() => navigate("/events")}></i>
      <i className="fas fa-globe fa-3x" onClick={() => navigate("/map")}></i>
      <i className="fas fa-user fa-3x" onClick={() => navigate("/profile")}></i>
    </div>
  );
};

export default Navbar;
