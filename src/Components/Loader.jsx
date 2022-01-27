import { css } from "@emotion/react";
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: var(--color);
`;

const Loader = ({size=150}) => {
  return (
      <ClipLoader css={override} size={size} />

  );
}

export default Loader;