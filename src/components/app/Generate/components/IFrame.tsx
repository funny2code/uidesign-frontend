import type React from "react";

interface IIFrame {
  src: string;
  classNames?: string;
  onClick?: () => void;
  isButton?: boolean;
}

const IFrame = ({ src, classNames, onClick, isButton = false }: IIFrame): React.ReactElement => {
  return (
    <div
      className={`${classNames} position-relative rounded p-1 overflow-hidden frame-border`}
      onClick={onClick}
    >
      <iframe src={src} height="100%" width="100%" className={`${isButton ? "buttonIframe" : ""}`} />
      {isButton ? (
        <div className="h-100 w-100 bg-transparent position-absolute top-0 start-0 rounded"></div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default IFrame;
