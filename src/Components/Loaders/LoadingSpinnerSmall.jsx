import React from "react";

const LoadingSpinnerSmall = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" fill="none" />
      <path 
        d="M15 8c0-3.866-3.134-7-7-7" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 8 8"
          to="360 8 8"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
};

export default LoadingSpinnerSmall;