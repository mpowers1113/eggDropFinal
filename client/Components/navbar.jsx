import React from "react";

const Navbar = (props) => {
  return (
    <div className="row navbar-map">
      <i
        className="fas fa-users fa-3x"
        onClick={() => {
          props.openEventFeed();
          props.closeProfile();
        }}
      ></i>
      <i className="fas fa-globe fa-3x"></i>
      <i
        className="fas fa-user fa-3x"
        onClick={() => {
          props.closeFeed(false);
          props.openProfile();
        }}
      ></i>
    </div>
  );
};

export default Navbar;
