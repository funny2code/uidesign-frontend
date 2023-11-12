import React, { useState } from "react";
interface ComponentSettingsProps {
  setSystemPrompt: React.Dispatch<React.SetStateAction<string>>;
  systemPrompt: string;
  isSubscribed: boolean;
}
const ComponentSettings = ({
  setSystemPrompt,
  systemPrompt,
  isSubscribed,
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
