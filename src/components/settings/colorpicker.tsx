import React, { useEffect, useState } from "react";
import { getSetting } from "../../utils/settings_utils";

interface ColorPickerProps {
  settingName: string;
  getCurrentValue: Function;
  onChange: Function;
}

export const SettingsColorPicker: React.FC<ColorPickerProps> = ({ settingName, getCurrentValue, onChange }) => {
  const [value, setValue] = useState<string>("#000000");

  useEffect(() => {
    const awaitSetting = async () => {
      const setting = await getSetting(settingName);
      const current = await getCurrentValue();

      setValue(setting ? setting.value : current || "#000000");
    }

    awaitSetting();
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
