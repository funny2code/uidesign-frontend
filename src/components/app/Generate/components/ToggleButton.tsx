import type React from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";
interface IToggleButton {
  engineType: boolean;
  setEngineType: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleButton = ({ engineType, setEngineType }: IToggleButton): React.ReactElement => {
  return (
    <>
      <span>GPT 3.5</span>
      <Toggle
        className="mx-2"
        defaultChecked={engineType}
        icons={false}
        onChange={() => setEngineType(prevState => !prevState)}
      />
      <span>GPT 4</span>
    </>
  );
};

export default ToggleButton;
