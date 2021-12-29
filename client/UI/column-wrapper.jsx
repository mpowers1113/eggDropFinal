import React from "react";

const ColumnWrapper = (props) => {
  return (
    <div className={"row flex-column " + props.className}>{props.children}</div>
  );
};

export default ColumnWrapper;
