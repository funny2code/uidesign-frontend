import type React from "react";
import { FRAMES } from "../Component/constants";

interface FrameSelectProps {
  frameType: FRAMES;
  setFrameType: React.Dispatch<React.SetStateAction<FRAMES>>;
}

const FrameSelect = ({ frameType, setFrameType }: FrameSelectProps): React.ReactElement => {
  const frames = [FRAMES.Desktop, FRAMES.Tablet, FRAMES.MobileWide, FRAMES.Mobile];
  return (
    <div className="frame-border p-1">
      {frames.map((item, index) => (
        <img
          src={`images/frame-${item}${item == frameType ? "-active" : ""}.png`}
          className="text-light"
          style={{ cursor: "pointer" }}
          key={index}
          onClick={() => setFrameType(item)}
        />
      ))}
    </div>
  );
};

export default FrameSelect;
