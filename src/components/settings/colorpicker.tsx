import React, { useState } from "react";

interface ColorPickerProps {
  defaultValue: string;
  onChange: Function;
}

export const SettingsColorPicker: React.FC<ColorPickerProps> = ({ defaultValue, onChange }) => {
  const [value, setValue] = useState<string>(defaultValue);

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
