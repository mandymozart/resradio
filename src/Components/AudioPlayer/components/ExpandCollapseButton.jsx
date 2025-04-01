import React from 'react';
import Arrow from '../../../images/Arrow';

/**
 * Component for the expand/collapse button
 */
const ExpandCollapseButton = ({ isExpanded, onClick }) => {
  return (
    <button onClick={onClick}>
      <Arrow flipped={!isExpanded} />
    </button>
  );
};

export default ExpandCollapseButton;