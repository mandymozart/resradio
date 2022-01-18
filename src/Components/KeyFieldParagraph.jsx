import React from "react";

const KeyFieldParagraph = ({ text }) => {
  if (!text) return <></>;
  return (
    <p>
      {text?.split("\n").map((line) => (
        <>
          {line}
          <br />
        </>
      ))}
    </p>
  );
};

export default KeyFieldParagraph;
