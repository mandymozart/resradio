import React from "react";

const KeyFieldParagraph = ({ text }) => {
  if (!text) return <></>;
  return (
    <div>
      {text?.split("\n").map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ))}
    </div>
  );
};

export default KeyFieldParagraph;
