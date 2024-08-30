import React, { useState } from "react";

interface TextInputProps {
  defaultValue: string;
}

export const SettingsTextInput: React.FC<TextInputProps> = ({ defaultValue }) => {
  const [value, setValue] = useState<string>(defaultValue);

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
