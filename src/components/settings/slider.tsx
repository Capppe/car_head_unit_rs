import React, { useEffect, useState } from "react";
import { getSetting } from "../../utils/settings_utils";

interface SliderProps {
  settingName: string;
  getCurrentValue: Function;
  max: number;
  min: number;
}

export const SettingsSlider: React.FC<SliderProps> = ({ settingName, getCurrentValue, max, min }) => {
  const [value, setValue] = useState<number>(-1);

  useEffect(() => {
    const awaitSetting = async () => {
      const setting = await getSetting(settingName);
      const current = await getCurrentValue();

      setValue(setting ? setting : current || -1);
    }

    awaitSetting();
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
