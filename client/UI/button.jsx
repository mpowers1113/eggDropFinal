import React from "react";

const Button = (props) => {
  return (
    <div className="row justify-align-center">
      <div className="column-50">
        <button
          disabled={props.disabled}
          onClick={props.click}
          className={"button " + props.className}
          type={props.type}
        >
          {props.text}
        </button>
      </div>
    </div>
  );
};

export default Button;
