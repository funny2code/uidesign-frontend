import type React from "react";
import { FRAMES, FRAME_WIDTH } from "../Component/constants";

interface IIFrame {
  src: string;
  classNames?: string;
  onClick?: () => void;
  isButton?: boolean;
  frameType?: FRAMES;
}

const IFrame = ({
  src,
  classNames,
  onClick,
  isButton = false,
  frameType = FRAMES.Desktop,
}: IIFrame): React.ReactElement => {
  return (
    <div
      className={`${classNames} position-relative rounded p-1 overflow-hidden frame-border w-100 text-center`}
      onClick={onClick}
    >
      <iframe
        src={src}
        height="100%"
        width={`${FRAME_WIDTH[frameType]}`}
        className={`${isButton ? "buttonIframe" : "border-primary border "}`}
      />
      {isButton ? (
        <div className="h-100 w-100 bg-transparent position-absolute top-0 start-0 rounded z-3"></div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default IFrame;
