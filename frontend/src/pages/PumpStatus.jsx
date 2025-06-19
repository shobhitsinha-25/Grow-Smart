import React, { useRef, useEffect } from "react";
import Lottie from "lottie-react";
import pumpOn from "../PumpOn.json";
import pumpOff from "../PumpOff.json";

import pumpSound from "../Sounds/Pumpsound.mp3"; 

const PumpStatus = ({ isOn }) => {
  const audioRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    // Only play sound if pump is ON
    if (!isOn) return;

    // Stop previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      clearTimeout(timeoutRef.current);
    }

    // Play new pump sound
    const audio = new Audio(pumpSound);
    audio.volume = 0.5;
    audio.play().catch((err) => console.warn("Pump sound failed:", err));
    audioRef.current = audio;

    // Stop after 4 seconds
    timeoutRef.current = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 4000);
  };

  return (
    <div className="text-center my-6 cursor-pointer" onClick={handleClick}>
      <div className="w-[200px] mx-auto">
        <Lottie animationData={isOn ? pumpOn : pumpOff} loop={true} />
        <p className={`mt-2 ml-[40px] font-bold ${isOn ? "text-blue-400" : "text-yellow-500"}`}>
          {isOn ? "Pump is ON (Watering Crops)" : "Pump is OFF"}
        </p>
      </div>
    </div>
  );
};

export default PumpStatus;
