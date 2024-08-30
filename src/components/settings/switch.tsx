import React, { useEffect, useState } from "react";
import "../../styles/Settings.css";
import { getBooleanSetting } from "../../utils/settings_utils";

interface SwitchProps {
  settingName: string;
  onChange: Function;
}

export const SettingsSwitch: React.FC<SwitchProps> = ({ settingName, onChange }) => {
  const [isToggled, setIsToggled] = useState<boolean>();

  useEffect(() => {
    const getSetting = async () => {
      const setting = await getBooleanSetting(settingName);
      if (setting === undefined) return;

      setIsToggled(setting);
    }

    getSetting();
  }, []);

  useEffect(() => {
    if (isToggled === undefined) return;

    onChange(isToggled);
  }, [isToggled]);

  const handleChange = () => {
    setIsToggled(!isToggled);
  }

  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={isToggled}
        onChange={handleChange}
      />
      <span className="settings-slider round"></span>
    </label>
  );
}
