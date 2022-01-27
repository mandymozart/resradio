import React from "react";
import { useAudioPlayer } from "react-use-audio-player";
import { useEffect } from "react/cjs/react.production.min";
import useAudioPlayerStore from "../../Stores/BroadcastStore";

const STREAM_URL = "https://edge.mixlr.com/channel/zwtuo";
const OFFLINE_URL =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const AudioPlayerLogic = () => {
  //   const audioPlayer = useState(new Audio(STREAM_URL));
  const isPlaying = useAudioPlayerStore((store) => store.isPlaying);
  const volumeStore = useAudioPlayerStore((store) => store.volume);
  const { player, ready, loading, playing, fade, volume } = useAudioPlayer({
    autoplay: false,
    src: OFFLINE_URL,
    html5: true,
    format: ["mp3"],
  });
  useEffect(() => {
    fade(0, 1, 5000);
  }, [fade]);
  console.log(ready, loading, playing, player);
  return <></>;
};

export default AudioPlayerLogic;
