import { useEffect, useState } from "react";

import { useSession } from "../../auth/useSession";
import { useDevMode } from "../../../atoms";

const Settings = () => {
  const [settings, setSettings] = useState(["Logout", "Close"]);
  const [devMode, setDevMode] = useState(false);

  const { setSession, getSession } = useSession();

  // useEffect(() => {
  //     getSession()
  //     .then(tokens => {
  //         if (tokens.is_admin){
  //             setSettings(['Dev Mode', ...settings]);
  //             useDevMode.set(true);
  //             setDevMode(true);
  //             return;
  //         }
  //     })
  // }, []);

  const handleSettingChange = (setting: string) => {
    // setCurrentSetting(setting);
    if (setting === "Logout") {
      // TODO: Call logout endpoint.
      setSession(undefined);
      window.location.reload();
    } else if (setting === "Dev Mode") {
      useDevMode.set(!useDevMode.get());
      setDevMode(!devMode);
    }
  };
  return (
    <div className="menu dropdown">
      <button className="settings" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Settings
      </button>
      <ul className="dropdown-menu settings-dropdown w-100">
        {settings.map((setting, index) => (
          <li key={index}>
            <button
              className={`dropdown-item ${
                setting === "Dev Mode" && devMode === true ? "active text-danger" : ""
              }`}
              onClick={() => handleSettingChange(setting)}
            >
              {setting}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Settings;
