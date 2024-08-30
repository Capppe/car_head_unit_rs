import React, { useEffect, useState } from "react";
import { getNumberSetting } from "../../utils/settings_utils";

interface SliderProps {
  settingName: string;
  max: number;
  min: number;
}

export const SettingsSlider: React.FC<SliderProps> = ({ settingName, max, min }) => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const getSetting = async () => {
      const setting = await getNumberSetting(settingName);

      setValue(setting);
    }

    getSetting();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(e.target.value, 10));
  }

  return (
    <div className="row center">
      <input
        type="range"
        value={value}
        onChange={handleChange}
        max={max}
        min={min}
        className="slider"
      />
      <label className="text24">{value}</label>
    </div>
  );
}
