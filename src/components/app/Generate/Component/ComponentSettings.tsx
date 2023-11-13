import React, { useState } from "react";
import { ENGINE_TYPE } from "./constants";

interface ComponentSettingsProps {
  setSystemPrompt: React.Dispatch<React.SetStateAction<string>>;
  systemPrompt: string;
  isSubscribed: boolean;
  setEngineType: React.Dispatch<React.SetStateAction<string>>;
  engineType: string;
  isImageMode: boolean;
}
const ComponentSettings = ({
  setSystemPrompt,
  systemPrompt,
  isSubscribed,
  setEngineType,
  engineType,
  isImageMode,
}: ComponentSettingsProps): React.ReactElement => {
  const settingButtons = ["Project Config", "System prompt"];
  const settings = [
    <>
      {!isSubscribed && (
        <div className="w-75 p-4 rounded mt-3" style={{ backgroundColor: "#08273090" }}>
          <p className="fw-semibold">You must be subscribed to access these settings</p>
          <div
            className="btn btn-success px-5"
            onClick={() => window.open("https://damidina.com/dami.html", "_blank")}
          >
            Subscribe
          </div>
        </div>
      )}
      <div className="mt-3">
        <p className="ps-2 mb-2">Engine Type</p>
        {isImageMode ? (
          <select className="form-select component-settings-select" disabled={!isSubscribed}>
            <option>gpt-4-vision-preview</option>
          </select>
        ) : (
          <select
            className="form-select component-settings-select"
            defaultValue={ENGINE_TYPE[0].value}
            onChange={e => {
              setEngineType(e.target.value);
            }}
            disabled={!isSubscribed}
          >
            {ENGINE_TYPE.map((item, index) => (
              <option key={index} value={item.value}>
                {item.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="d-flex flex-row justify-content-center align-items-center gap-3 mt-3">
        <div style={{ width: "30%" }}>
          <p className="mb-1">Frontend</p>
          <select className="form-select component-settings-select" defaultValue="react" disabled>
            <option value="react">React</option>
            <option value="1">Vue</option>
            <option value="2">Angular</option>
          </select>
        </div>
        <div style={{ width: "30%" }}>
          <p className="mb-1">Bundler</p>
          <select className="form-select component-settings-select" defaultValue="vite" disabled>
            <option value="vite">Vite</option>
          </select>
        </div>
        <div style={{ width: "30%" }}>
          <p className="mb-1">Styles</p>
          <select className="form-select component-settings-select" defaultValue="tailwind" disabled>
            <option value="tailwind">Tailwind</option>
          </select>
        </div>
      </div>
    </>,
    <div className="mt-4">
      <textarea
        className="form-control"
        style={{
          height: "200px",
          backgroundColor: "#08273090",
          color: "white",
        }}
        disabled={isSubscribed ? false : true}
        value={systemPrompt}
        onChange={e => setSystemPrompt(e.target.value)}
      ></textarea>
    </div>,
  ];
  const [selectedSettings, setSelectedSettings] = useState<number>(0);
  return (
    <ul
      className="dropdown-menu p-3 text-light"
      style={{
        backgroundColor: "#08273090",
        width: "600px",
        transform: "translateX(-50%)",
      }}
      aria-labelledby="dropdownMenuClickable"
    >
      <div className="d-flex flex-row gap-3">
        {settingButtons.map((item, index) => (
          <div
            key={index}
            className="btn btn-primary border-0"
            onClick={() => setSelectedSettings(index)}
            style={{ backgroundColor: `${selectedSettings == index ? "#ffffff2f" : "transparent"}` }}
          >
            {item}
          </div>
        ))}
      </div>
      {settings[selectedSettings]}
    </ul>
  );
};

export default ComponentSettings;
