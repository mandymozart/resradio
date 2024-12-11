import { useEffect, useRef, useState } from "react";
import { OFFLINE_URL } from "./config";

const Sandbox = () => {
    const audioRef = useRef()
    const volume = .7;

    const onPlaying = () => {
        console.log(audioRef.current.currentTime)
    }

    const handleEnded = () => {
        console.log("ended")
    }

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {

            const promise = audio.play();

            if (promise !== undefined) {
                promise.then(_ => {
                    // Autoplay started!
                }).catch(error => {
                    // Autoplay was prevented.
                    // Show a "Play" button so that user can start playback.
                    console.log("audio Element failed", error)
                });
            }
        }
        else {
            console.log("no audio")
        }
    }, []); // Empty array ensures effect is only run once on mount

    const [show, setShow] = useState(true)
    return (
        <>
            {show && <audio
                ref={audioRef}
                volume={volume}
                onTimeUpdate={onPlaying}
                onEnded={handleEnded}
            >
                <source src={OFFLINE_URL} type='audio/mpeg'></source>
            </audio>}
            <button onClick={() => setShow(true)}>Play</button>
        </>
    )
}

export default Sandbox;