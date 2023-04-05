import { useChannel, usePresence } from "@ably-labs/react-hooks";
import { gql, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useParams } from 'react-router-dom';
import { BroadcastFragment, BroadcastTagsFragement, GetBroadcastsQuery } from './Queries/broadcasts';
import { GetPlaylistQuery, GetPlaylistsQuery, PlaylistBriefFragment, PlaylistFragment, PlaylistTagsFragement } from './Queries/playlists';
dayjs.extend(localizedFormat);


const broadcastsQuery = gql`
${GetBroadcastsQuery}
${BroadcastFragment}
${BroadcastTagsFragement}
`
const playlistsQuery = gql`
${GetPlaylistsQuery}
${PlaylistBriefFragment}
${PlaylistTagsFragement}
`

const playlistQuery = gql`
${GetPlaylistQuery}
${PlaylistFragment}
${BroadcastFragment}
${BroadcastTagsFragement}
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
  > div {
    padding: 1rem 2rem;
    display: flex;
    gap: 1rem;
    
  }
  input {
    width: calc(100% - 4rem);
    margin: 0 2rem;
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
  const [source, setSource] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState();
  const [currentTime, setCurrentTime] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [broadcasts, setBroadcasts] = useState();
  const [trackProgress, setTrackProgress] = useState(0);
  const intervalRef = useRef();

  // ably websocket
  const [rotationInfo, setRotationInfo] = useState();
  const [channel] = useChannel("rotation", (message) => {
    setRotationInfo(message)
    console.log(message);
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

  // send notification to RadioApp/ShortInfo
  const sendRotationMessage = (broadcast) => {
    channel.publish("rotation", { begin: dayjs().toISOString(), end: dayjs().add(parseInt(duration), 'seconds'), title: broadcast.title, hostedby: broadcast.hostedby.title, uid: broadcast._meta.uid });
  }

  const updateBroadcast = (broadcast, index) => {
    console.log(broadcast, index)
    if (broadcast) {
      setSource(broadcast.audio.url);
      getLengthOfMp3(broadcast.audio.url);
      setCurrent(broadcast)
      setCurrentIndex(index)
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
    console.log(broadcast, source)
    if (broadcast) {
      getLengthOfMp3(broadcast.audio.url);
      setSource(broadcast.audio.url);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.load();
      }
      setCurrent(broadcast)
      sendRotationMessage(broadcast)
    }
  }

  useEffect(() => {
    // init Player
    if (data) {
      console.log(data.allPlaylists.edges[0].node.broadcasts.filter(i => i.broadcast.audio))
      setBroadcasts(data.allPlaylists.edges[0].node.broadcasts.filter(i => i.broadcast.audio))
      loadBroadcast(data.allPlaylists.edges[0].node.broadcasts[0].broadcast)
    }
  }, [data])


  const onPlaying = (e) => {
    // TODO: check with length and prepare file change when nessecary
    setCurrentTime(parseInt(e.target.currentTime));
  };

  const handleEnded = () => {
    // TODO: set next track in playlist
    console.warn('Audio Stream ended.')
    if (currentIndex + 1 < broadcasts.length - 1) {
      console.log(broadcasts[currentIndex + 1].broadcast, 'Next stream', currentIndex + 1, broadcasts.length)
      updateBroadcast(broadcasts[currentIndex + 1].broadcast, currentIndex + 1)
    }
    else {
      console.log(broadcasts[0].broadcast, 'Next stream', 0, broadcasts.length)
      updateBroadcast(broadcasts[0].broadcast, 0)
    }
  }

  const handlePlay = () => {
    audioRef.current.play();
    setIsPlaying(true);
    startTimer();
  }

  const handlePause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  }

  const onCanPlay = () => {
    // TODO: maybe don't need
  };

  const logHistory = () => {
    const history = channel.history((err, result) => {
      result.items.forEach((msg) => {
        console.log('' + msg.id + ' - ' + msg.data.uid, msg.data);
      });
    });
  }

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      // audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  if (loading || !broadcasts) return <>Loading...</>;
  if (error) return <>Error : {error.message}</>;
  const playlist = data.allPlaylists.edges[0].node;
  return (
    <PlayerContainer>
      <h4>{playlist.title} ({broadcasts.length} Broadcasts) {!isPlaying && <span>Paused</span>}</h4>
      <div className='controls'>
        <div>
          {isPlaying ?
            <button onClick={() => handlePause()}>Pause</button> :
            <button onClick={() => handlePlay()}>Play</button>}
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
        {broadcasts.map((item, index) => {
          // // TODO: wtf kommt hier ein Shows element mit durch, bzw. ein leeres {} object
          // // KICK OUT ALL WITHOUT MP3
          // if (!item?.broadcast?.audio?.url) return <></>
          // else
          return (
            <div key={index} onClick={() => updateBroadcast(item?.broadcast, index)} className={item.broadcast._meta.id === current._meta.id ? "broadcast current" : "broadcast"}>
              <div>{index}</div> <div>{item.broadcast.hostedby.title} &mdash; {item.broadcast.title}</div>
            </div>
          )
        }
        )}
      </div>
      <div className="status">
        <h6>Status <button onClick={() => logHistory()}>Log history to console</button></h6>
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
    <h6>Listener ({presenceData.filter(m => m.data !== "listener").length})</h6>
    {presenceData.filter(m => m.data === "listener").map(msg => <li>${msg.clientId}</li>)}
  </ListenersContainer>)
}