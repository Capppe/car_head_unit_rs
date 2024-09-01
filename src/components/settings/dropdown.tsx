import React, { useEffect, useState } from "react";
import { Dropdown } from "../generic/dropdown";
import { CustomDropdownOption } from "../../utils/constants";
import { getSetting } from "../../utils/settings_utils";

interface DropdownProps {
  settingName: string;
  getCurrentValue?: Function;
  options: CustomDropdownOption[];
  onChange: Function;
}

export const SettingsDropdown: React.FC<DropdownProps> = ({ settingName, getCurrentValue, onChange, options }) => {
  const [value, setValue] = useState<string>("None");

  useEffect(() => {
    const awaitSetting = async () => {
      const setting = getCurrentValue ? await getCurrentValue() : await getSetting(settingName);

      setValue(setting || "None");
    }

    awaitSetting();
  }, []);

  return (
    <div>
      <Dropdown
        options={options}
        placeholder={value}
        label=""
        onChange={(o: number) => onChange(o)}
        classNames="custom-select settings-dropdown"
      />
    </div>
  );
}
