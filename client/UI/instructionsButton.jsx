import React from 'react';

const InstructionsButton = props => {
  return (
    <i onClick={props.click} className="dark-brown question far fa-question-circle fa-3x"></i>
  );
};

export default InstructionsButton;
