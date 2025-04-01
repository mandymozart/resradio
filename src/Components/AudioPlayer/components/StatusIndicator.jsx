import React from 'react';
import useBroadcastStore from '../../../Stores/BroadcastStore';
import Dot from '../../../images/Dot';
import DotEmpty from '../../../images/DotEmpty';
import DotGrey from '../../../images/DotGrey';
import LoadingSpinnerSmall from '../../Loaders/LoadingSpinnerSmall';

/**
 * Component that displays the current stream status with appropriate icons
 */
const StatusIndicator = ({ canPlay, streamStatus }) => {
  const { isLive, isStreaming } = useBroadcastStore();

  return (
    <div className="status">
      {canPlay && streamStatus === 'online' ? (
        isLive() ? (
          <Dot />
        ) : (
          isStreaming() && <DotGrey />
        )
      ) : streamStatus === 'reconnecting' ? (
        <LoadingSpinnerSmall />
      ) : (
        <DotEmpty />
      )}
    </div>
  );
};

export default StatusIndicator;