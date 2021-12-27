import React from 'react';

const Input = props => {
  return (
    <div className="row justify-align-center">
      <div className="column-50">
        <input onChange = {props.onChange} className={props.className} type={props.type} id={props.id} placeholder={props.id} onFocus={props.onFocus} onBlur = {props.onBlur} accept={props.accept}/>
      </div>
    </div>
  );
};

export default Input;
