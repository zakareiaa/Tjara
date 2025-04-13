import React from "react";
import "./BackgroundTransparentLayer.css";
import { usePopup } from "@components/DataContext";

function BackgroundTransparentLayer() {
  const { hidePopup, displayBgLayer } = usePopup();

  const handleBgLayer = () => {
    hidePopup();
  };

  return (
    <div
      className="background-transparent-layer"
      onClick={handleBgLayer}
      style={{ display: displayBgLayer ? "block" : "none" }}
    ></div>
  );
}

export default BackgroundTransparentLayer;
