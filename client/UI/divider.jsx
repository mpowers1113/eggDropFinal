import React from "react";

const Divider = (props) => {
  return (
    <div className="row justify-align-center lines">
      <div className="column-full line-break">
        <div className="first-half"></div>
        <p>{props.text}</p>
        <div className="second-half"></div>
      </div>
    </div>
  );
};

export default Divider;
