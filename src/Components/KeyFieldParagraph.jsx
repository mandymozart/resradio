import React from "react";
import FadeIn from "../Animations/FadeIn";

const KeyFieldParagraph = ({ text }) => {
  if (!text) return <></>;
  return (
    <p>
      {text?.split("\n").map((line,index) => (
        <FadeIn>
          <span key={index}>
          {line}
          <br />
        </span>
          </FadeIn>
      ))}
    </p>
  );
};

export default KeyFieldParagraph;
