import React from "react";
import FadeIn from "../Animations/FadeIn";

const KeyFieldParagraph = ({ text }) => {
  if (!text) return <></>;
  return (
    <div>
      {text?.split("\n").map((line,index) => (
        <FadeIn key={index}>
          <span key={index}>
          {line}
          <br />
        </span>
          </FadeIn>
      ))}
    </div>
  );
};

export default KeyFieldParagraph;
