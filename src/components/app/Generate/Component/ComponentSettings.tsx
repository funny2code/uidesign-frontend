import React from "react";

const ComponentSettings = (): React.ReactElement => {
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
        <div className="btn btn-primary border-0" style={{ backgroundColor: "#ffffff2f" }}>
          Project Config
        </div>
        <div className="btn btn-primary  border-0 bg-transparent">System Prompt</div>
      </div>
      <div className="w-75 p-4 rounded mt-3" style={{ backgroundColor: "#08273090" }}>
        <p className="fw-semibold">You must be subscribed to access these settings</p>
        <div className="btn btn-success px-5">Subscribe</div>
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
          <p className="mb-1">Something</p>
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
    </ul>
  );
};

export default ComponentSettings;
