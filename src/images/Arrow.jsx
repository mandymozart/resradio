import React from "react";

const Arrow = ({ flipped }) => {
  const d = flipped ? "M1 1L14.5 14L28 1" : "M28 15L14.5 2L1 15"
  return (
    <svg width="29" height="16" viewBox="0 0 29 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} stroke="currentColor" strokeWidth="2" />
    </svg>)
}

export default Arrow;
