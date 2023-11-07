import { useEffect, useState } from "react";

import { useSession } from "../../auth/useSession";

const Settings = () => {
  const [settings, setSettings] = useState(["Logout", "Close"]);
  const { setSession, getSession } = useSession();

  const handleSettingChange = (setting: string) => {
    // setCurrentSetting(setting);
    if (setting === "Logout") {
      // TODO: Call logout endpoint.
      setSession(undefined);
      window.location.reload();
    }
  };
  return (
    <div className="menu dropdown">
      <button
        className="settings"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Settings
      </button>
      <ul className="dropdown-menu settings-dropdown w-100 settings-form">
        {settings.map((setting, index) => (
          <li key={index}>
            <button className={`dropdown-item`} onClick={() => handleSettingChange(setting)}>
              {setting}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Settings;
