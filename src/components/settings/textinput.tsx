import React, { useEffect, useState } from "react";
import { getSetting } from "../../utils/settings_utils";

interface TextInputProps {
  settingName: string;
  getCurrentValue: Function;
}

export const SettingsTextInput: React.FC<TextInputProps> = ({ settingName, getCurrentValue }) => {
  const [value, setValue] = useState<string>("None");

  useEffect(() => {
    const awaitSetting = async () => {
      const setting = await getSetting(settingName);
      const current = await getCurrentValue();

      setValue(setting ? setting : current || "None");
    }

    awaitSetting();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }

  return (
    <div>
      <input
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
