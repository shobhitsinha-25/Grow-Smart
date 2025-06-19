import React, { useRef, useEffect } from "react";
import Lottie from "lottie-react";
import rainAnimation from "../rain.json";
import cloudyAnimation from "../clearSky.json";

import rainSound from "../Sounds/rain.mp3";
import sunnySound from "../Sounds/sunny.mp3";

const RainStatus = ({ rainDetected }) => {
  const audioRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    // If audio is already playing, stop it before starting new
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      clearTimeout(timeoutRef.current);
    }

    // Create new audio instance
    const sound = new Audio(rainDetected ? rainSound : sunnySound);
    sound.volume = 0.7;
    sound.play().catch((err) => {
      console.warn("Autoplay blocked or error playing audio:", err);
    });

    audioRef.current = sound;

    // Stop after 4 seconds
    timeoutRef.current = setTimeout(() => {
      sound.pause();
      sound.currentTime = 0;
    }, 4000);
  };

  return (
    <div
      className="w-full flex flex-col items-center justify-center mt-6 cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-[150px] h-[150px]">
        <Lottie
          animationData={rainDetected ? rainAnimation : cloudyAnimation}
          loop={true}
        />
      </div>
      <p className="text-lg font-semibold text-blue-400">
        {rainDetected ? "Rain Detected" : "Clear Sky"}
      </p>
    </div>
  );
};

export default RainStatus;
