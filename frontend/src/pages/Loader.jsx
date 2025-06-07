// components/LottieLoader.jsx
import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../loading.json"; 

const LottieLoader = () => {
  return (
    <div className="flex justify-center items-center h-[70vh]">
      <Lottie animationData={loadingAnimation} loop={true} style={{ height: 200, width: 200 }} />
    </div>
  );
};

export default LottieLoader;
