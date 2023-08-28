import { css } from "@emotion/react";
import React from "react";
import { RotateLoader } from "react-spinners";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: var(--color);
`;

const PlayerLoader = ({ size = 8 }) => {
    return (
        <RotateLoader css={override} size={size} />

    );
}

export default PlayerLoader;