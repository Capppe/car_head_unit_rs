import React from "react";
import { Dropdown } from "../generic/dropdown";
import { CustomDropdownOption } from "../../utils/constants";

interface DropdownProps {
  defaultValue: number;
  options: CustomDropdownOption[];
  onChange: Function;
}

export const SettingsDropdown: React.FC<DropdownProps> = ({ defaultValue, onChange, options }) => {
  return (
    <div>
      <Dropdown
        options={options}
        placeholder={options[defaultValue] ? options[defaultValue].label || "" : ""}
        label=""
        onChange={(o: number) => onChange(o)}
        classNames="custom-select settings-dropdown"
      />
    </div>
  );
}
