import React from 'react';

const LoadingSpinner = () => (
  <div className="spinner">
    <svg viewBox="0 0 24 24" width="48" height="48">
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none" 
        strokeDasharray="30 20" 
        strokeLinecap="round" 
      >
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          from="0 12 12" 
          to="360 12 12" 
          dur="1s" 
          repeatCount="indefinite" 
        />
      </circle>
    </svg>
  </div>
);

export default LoadingSpinner;