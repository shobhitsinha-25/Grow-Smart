import React, { useRef, useEffect } from "react";
import Lottie from "lottie-react";
import fanOn from "../FanOn.json";
import fanOffImg from "../images/FanOff.png";
import fanSound from "../Sounds/Fanonsound.mp3"; 

const FanStatus = ({ isOn }) => {
  const audioRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    if (!isOn) return;

    // Stop previous sound
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      clearTimeout(timeoutRef.current);
    }

    const audio = new Audio(fanSound);
    audio.volume = 0.5;
    audio.play().catch((err) => console.warn("Fan sound failed:", err));
    audioRef.current = audio;

    timeoutRef.current = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 4000);
  };

  return (
    <div className="text-center my-6 cursor-pointer" onClick={handleClick}>
      <div className="w-[200px] h-[200px] mx-auto flex items-center justify-center">
        {isOn ? (
          <Lottie animationData={fanOn} loop={true} />
        ) : (
          <img
            src={fanOffImg}
            alt="Fan Off"
            className="w-[200px] h-[200px] object-contain opacity-70 rounded-full"
          />
        )}
      </div>
      <p className={`mt-2 font-bold ${isOn ? "text-blue-500" : "text-yellow-500"}`}>
        {isOn ? "Fan is ON" : "Fan is OFF"}
      </p>
    </div>
  );
};

export default FanStatus;
