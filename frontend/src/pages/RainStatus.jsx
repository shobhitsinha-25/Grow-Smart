import React from "react";
import Lottie from "lottie-react";
import rainAnimation from "../rain.json";       // animation when rain is detected
import cloudyAnimation from "../clearSky.json";   // animation when no rain

const RainStatus = ({ rainDetected }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-6">
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
