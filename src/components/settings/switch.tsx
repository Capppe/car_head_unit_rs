import React, { useEffect, useState } from "react";
import "../../styles/Settings.css";
import { getSetting } from "../../utils/settings_utils";
// import { getBooleanSetting } from "../../utils/settings_utils";

interface SwitchProps {
  settingName: string;
  getCurrentValue: Function;
  onChange: Function;
}

export const SettingsSwitch: React.FC<SwitchProps> = ({ settingName, getCurrentValue, onChange }) => {
  const [isToggled, setIsToggled] = useState<boolean>();

  useEffect(() => {
    const awaitSetting = async () => {
      const setting = await getSetting(settingName);
      const currentValue = await getCurrentValue();

      setting ? setIsToggled(setting.value === 'true') : setIsToggled(currentValue);
    }

    awaitSetting();
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
