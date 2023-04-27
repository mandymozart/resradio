import { useChannel, usePresence } from "@ably-labs/react-hooks";
import { gql, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useParams } from 'react-router-dom';
import { BroadcastFragment, BroadcastTagsFragment } from './Queries/broadcasts';
import { GetPlaylistQuery, GetPlaylistsQuery, PlaylistBriefFragment, PlaylistFragment, PlaylistTagsFragement } from './Queries/playlists';
import config from "./config";
import PauseBig from "./images/PauseBig";
import PlayBig from "./images/PlayBig";
dayjs.extend(localizedFormat);

const playlistsQuery = gql`
${GetPlaylistsQuery}
${PlaylistBriefFragment}
${PlaylistTagsFragement}
`

const playlistQuery = gql`
${GetPlaylistQuery}
${PlaylistFragment}
${BroadcastFragment}
${BroadcastTagsFragment}
${PlaylistTagsFragement}
`

function Sandbox() {
  return (
    <Container>
      <header>
        <h1>res.studio</h1>
        <nav>
          <Link to="/studio/playlists">Playlists</Link>
        </nav>
      </header>
      <div>
        <Outlet />
      </div>
    </Container>
  );
}

export default Sandbox;

const Container = styled.div`
header {
  padding: 2rem;
  border-bottom: 2px solid var(--color); 
}
.current {
  font-family: var(--font-bold);
}
`

const PlaylistsContainer = styled.div`
h4 {
  padding: 1rem 2rem;
  margin: 0;
}
.add {
  padding: 2rem;
  text-align: center;
}
`

export const Playlists = () => {

  const { loading, error, data } = useQuery(playlistsQuery);

  if (loading) return <>Loading...</>;
  if (error) return <>Error : {error.message}</>;
  return (
    <PlaylistsContainer>
      <h4>Playlists ({data.allPlaylists.totalCount})</h4>
      <div>
        {data.allPlaylists.edges.map((item) => {
          return (
            <PlaylistItem playlist={item.node} key={item.node._meta.id} />
          )
        }
        )}
      </div>
      <div className="add"><a href="http://resradio.prismic.io" target="_blank">Add Playlist</a></div>
    </PlaylistsContainer>
  )
}

const PlaylistItemContainer = styled.div`
padding: 2rem;
border-bottom: 2px solid var(--color); 
`

const PlaylistItem = ({ playlist }) => {
  return (<PlaylistItemContainer>
    <h3>
      {playlist.title}
    </h3>
    <p>
      {playlist.description}
    </p>
    <Link to={`${playlist._meta.uid}`}>Select</Link>
  </PlaylistItemContainer>)
}

const PlayerContainer = styled.div`
h4 { padding: 1rem 2rem; margin: 0;

  span {
    color: red;
  }
}

.controls {
  padding: 1rem 2rem;
  > div {
    display: flex;
    gap: 1rem;
    
  }
  input {
    width: 100%;
  }
  button {
    cursor: pointer;
    height: 4rem;
    width: 4rem;
  }
  border-bottom: 2px solid var(--color); 
}
.list {
  padding: 2rem;
  border-bottom: 2px solid var(--color); 
  .broadcast {
    display: grid;
    grid-template-columns: 1fr 31fr;
    gap: 1rem;
    cursor: pointer;
    &:hover {
      color: var(--second);
    }
  }
}
.status {
  font-size: 1rem;
  padding: 2rem;
  border-bottom: 2px solid var(--color); 
}

`

export const Player = () => {

  const { uid } = useParams();

  const { loading, error, data } = useQuery(playlistQuery, { variables: { uid: uid } });
  const audioRef = useRef();
  const [current, setCurrent] = useState();
  const [next, setNext] = useState();
  const [source, setSource] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState();
  const [currentTime, setCurrentTime] = useState();

  const [broadcasts, setBroadcasts] = useState();
  const [trackProgress, setTrackProgress] = useState(0);
  const intervalRef = useRef();

  // ably websocket
  const [rotationInfo, setRotationInfo] = useState();
  const [channel] = useChannel(config.ABLY_ROTATION_CHANNEL, (message) => {
    setRotationInfo(message)
  });

  const currentPercentage = audioRef.current
    ? `${(trackProgress / audioRef.current) * 100}%`
    : "0%";
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;



  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  };

  const onScrub = (value) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  const onScrubEnd = () => {
    // If not already playing, start
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  const getLengthOfMp3 = async (mp3file) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const request = new XMLHttpRequest()
    request.open('GET', mp3file, true)
    request.responseType = 'arraybuffer'
    request.onload = function () {
      audioContext.decodeAudioData(request.response,
        function (buffer) {
          const duration = buffer.duration
          setDuration(duration)
        }
      )
    }
    request.send()
  }

  const getIndex = (broadcast) => {
    const index = broadcasts.findIndex(node => node.broadcast._meta.id === broadcast._meta.id)
    console.log(index, "get index")
    return index
  }

  // send notification to RadioApp/ShortInfo
  const sendRotationMessage = () => {
    channel.publish(config.ABLY_ROTATION_CHANNEL,
      {
        current:
        {
          begin: dayjs().toISOString(),
          end: dayjs().add(parseInt(duration), 'seconds'),
          title: current.title,
          hostedby: current.hostedby.title,
          // TODO: remove anything but UID (depends on shortinfo)
          uid: current._meta.uid
        }, next:
        {
          title: next.title,
          hostedby: next.hostedby.title,
          // TODO: remove anything but UID (depends on short info update)
          uid: next._meta.uid
        }
      });
  }

  /**
   * 
   * @param {number} index *optional
   */
  const updateBroadcast = (index) => {
    console.log(index, "update")
    const broadcast = index !== undefined ? broadcasts[index].broadcast : getNextBroadcast(getIndex(current))
    console.log("setting current", broadcast, index)
    if (broadcast) {
      setSource(broadcast.audio.url);
      getLengthOfMp3(broadcast.audio.url);
      setCurrent(broadcast);
      setIsPlaying(true);
      setNext(getNextBroadcast(getIndex(broadcast)))
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.load();
        audioRef.current.play();
        startTimer();
        setTrackProgress(audioRef.current.currentTime);
      }
      sendRotationMessage(broadcast)
    }
  }

  // only once
  const loadBroadcast = (broadcast) => {
    if (broadcast) {
      getLengthOfMp3(broadcast.audio.url);
      setSource(broadcast.audio.url);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.load();
      }
      setCurrent(broadcast)
      setNext(getNextBroadcast(getIndex(broadcast)))
    }
  }

  useEffect(() => {
    // init Player
    if (data) {
      setBroadcasts(data.allPlaylists.edges[0].node.broadcasts.filter(i => i.broadcast.audio))
    }
  }, [data])

  useEffect(() => {
    if (broadcasts)
      loadBroadcast(data.allPlaylists.edges[0].node.broadcasts[0].broadcast)
  }, [broadcasts])


  const onPlaying = (e) => {
    // TODO: check with length and prepare file change when nessecary
    setCurrentTime(parseInt(e.target.currentTime));
  };

  const getNextBroadcast = (index) => {
    console.log(index, index + 1, broadcasts.length)
    if (index + 1 < broadcasts.length) {
      return broadcasts[index + 1].broadcast
    }
    else {
      return broadcasts[0].broadcast
    }
  }

  const handleEnded = () => {
    // TODO: set next track in playlist
    updateBroadcast()
  }

  const handlePlay = () => {
    audioRef.current.play();
    setIsPlaying(true);
    sendRotationMessage();
    startTimer();
  }

  const handlePause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  }

  const onCanPlay = () => {
    // TODO: maybe don't need
  };

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      // audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  if (loading || !broadcasts || !current || !next) return <>Loading...</>;
  if (error) return <>Error : {error.message}</>;
  const playlist = data.allPlaylists.edges[0].node;
  return (
    <PlayerContainer>
      <h4>{playlist.title} ({broadcasts.length} Broadcasts) {!isPlaying && <span>Paused</span>}</h4>
      <div className='controls'>
        <div>
          {isPlaying ?
            <button onClick={() => handlePause()}><PauseBig /></button> :
            <button onClick={() => handlePlay()}><PlayBig /></button>}
          <audio ref={audioRef}
            onTimeUpdate={onPlaying}
            onCanPlay={onCanPlay}
            onEnded={handleEnded}>
            <source src={source} type='audio/mpeg'></source>
          </audio>
          <div>{current?.hostedby.title} &mdash; {current?.title}</div>
          <div>
            {currentTime}/{duration}
          </div>
        </div>
        <input
          type="range"
          value={trackProgress}
          step="1"
          min="0"
          max={duration ? duration : `${duration}`}
          className="progress"
          onChange={(e) => onScrub(e.target.value)}
          onMouseUp={onScrubEnd}
          onKeyUp={onScrubEnd}
          style={{ background: trackStyling }}
        />
      </div>
      <div className='list'>
        <h6>Cue</h6>
        {broadcasts.map((node, index) => {
          return (
            <div key={index}
              onClick={() => updateBroadcast(index)}
              className={node.broadcast._meta.id
                ===
                current._meta.id ? "broadcast current" : "broadcast"}>
              <div>{index}</div> <div>{node.broadcast.hostedby.title} &mdash; {node.broadcast.title}</div>
            </div>
          )
        }
        )}
      </div>
      <div className="status">
        <h6>Status</h6>
        {rotationInfo ? (
          <>
            {dayjs(rotationInfo.data.begin).format("ddd, HH:mm")} - {dayjs(rotationInfo.data.end).format("HH:mm")} {rotationInfo.data.hostedby} &mdash; {rotationInfo.data.title}
          </>
        ) : (<>Currently not playing</>)}
        <Listeners />
      </div>
    </PlayerContainer>
  )
}

const ListenersContainer = styled.div`
h6 { 
  font-size: 1rem;
  padding: 1rem 0; margin: 0;
}`
export const Listeners = () => {
  const [presenceData] = usePresence("rotation", "host");
  const members = presenceData.map((msg, index) => <li key={index}>{msg.clientId}: {msg.data}</li>);
  return (<ListenersContainer>
    <h6>Active visitors ({presenceData.filter(m => m.data !== "listener").length})</h6>
    {members}
    <h6>Listener ({presenceData.filter(m => m.data === "listener").length})</h6>
    {presenceData.filter(m => m.data === "listener").map(msg => <li>${msg.clientId}</li>)}
  </ListenersContainer>)
}