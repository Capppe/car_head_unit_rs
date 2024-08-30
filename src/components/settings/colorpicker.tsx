import React, { useEffect, useState } from "react";
import { getTextSetting } from "../../utils/settings_utils";

interface ColorPickerProps {
  settingName: string;
  onChange: Function;
}

export const SettingsColorPicker: React.FC<ColorPickerProps> = ({ settingName, onChange }) => {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const getSetting = async () => {
      setValue(await getTextSetting(settingName));
    }
    getSetting();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  }

  return (
    <div className="row center">
      <label>
        <input
          type="color"
          value={value}
          onChange={handleChange}
          style={{ color: value, backgroundColor: value }}
        />
      </label>
    </div>
  );
}
