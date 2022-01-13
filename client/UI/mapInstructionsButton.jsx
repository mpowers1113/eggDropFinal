import React from "react";

const MapInstructionsButton = (props) => {
  return (
    <i
      onClick={props.click}
      className="light-brown map-instructions-button far fa-question-circle fa-2x"
    ></i>
  );
};

export default MapInstructionsButton;
