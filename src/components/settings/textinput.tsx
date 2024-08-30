import React, { useEffect, useState } from "react";
import { getTextSetting } from "../../utils/settings_utils";

interface TextInputProps {
  settingName: string;
}

export const SettingsTextInput: React.FC<TextInputProps> = ({ settingName }) => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const getSetting = async () => {
      const setting = await getTextSetting(settingName);

      setValue(setting);
    }

    getSetting();
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
