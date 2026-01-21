// components/Loader.tsx
"use client";

import React from "react";
import Lottie from "lottie-react";
import animationData from "@/assets/loader.json"; // ← direct import

interface LoaderProps {
  loop?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
}

const Loader: React.FC<LoaderProps> = ({
  loop = true,
  autoplay = true,
  style,
}) => {
  return (
    <div
      className="loader-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: 150, height: 150 }}
      />
    </div>
  );
};

export default Loader;
