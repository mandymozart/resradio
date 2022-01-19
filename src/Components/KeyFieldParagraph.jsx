import React from "react";

const KeyFieldParagraph = ({ text }) => {
  if (!text) return <></>;
  return (
    <p>
      {text?.split("\n").map((line,index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ))}
    </p>
  );
};

export default KeyFieldParagraph;
