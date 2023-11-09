import type React from "react";

const frames = [1, 2, 3, 4];

const FrameSelect = (): React.ReactElement => {
  return (
    <div className="frame-border p-1">
      {frames.map(item => (
        <img src={`images/frame-${item}.png`} className="text-light" style={{ cursor: "pointer" }} />
      ))}
    </div>
  );
};

export default FrameSelect;
