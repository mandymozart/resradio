import React from "react";
import { GoMute, GoUnmute } from "react-icons/go";

const Volume = ({ volume }) => {
  return (
    <>
      {volume > 0 && (
        <GoUnmute />
      )}
      {volume <= 0 && (
        <GoMute />
      )}
    </>)
}

export default Volume;


