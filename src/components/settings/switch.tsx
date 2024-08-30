import React, { useEffect, useState } from "react";
import "../../styles/Settings.css";

interface SwitchProps {
  defaultValue: boolean;
  onChange: Function;
}

export const SettingsSwitch: React.FC<SwitchProps> = ({ defaultValue, onChange }) => {
  const [isToggled, setIsToggled] = useState<boolean>(defaultValue || false);

  useEffect(() => {
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
