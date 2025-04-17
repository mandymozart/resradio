import React from 'react';
import StationShortInfo from '../StationShortInfo';

/**
 * Component for displaying stream information or status messages
 */
const StreamInfo = ({ streamStatus, offlineMessage, onClick }) => {
  return (
    <div className="info-container">
      {streamStatus === 'online' ? (
        <StationShortInfo onClick={onClick} />
      ) : (
        <div className="stream-status-message">
          {offlineMessage}
        </div>
      )}
    </div>
  );
};

export default StreamInfo;