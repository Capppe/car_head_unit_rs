import React, { useState } from "react";

interface SliderProps {
  defaultValue: number;
  max: number;
  min: number;
}

export const SettingsSlider: React.FC<SliderProps> = ({ defaultValue, max, min }) => {
  const [value, setValue] = useState<number>(defaultValue);

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
