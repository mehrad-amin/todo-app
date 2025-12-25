import React from "react";

const RadioButton = ({ status, setStatus, value, title, children }) => {
  return (
    <div className={value}>
      <lable htmlFor={value}>
        {children}
        {title}
      </lable>
      <input
        type="radio"
        id={value}
        value={value}
        onChange={(e) => setStatus(e.target.value)}
        checked={status === value}
      />
    </div>
  );
};

export default RadioButton;
