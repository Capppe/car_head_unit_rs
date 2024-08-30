import React, { useEffect, useState } from "react";
import { Dropdown } from "../generic/dropdown";
import { CustomDropdownOption } from "../../utils/constants";
import { getNumberSetting } from "../../utils/settings_utils";

interface DropdownProps {
  settingName: string;
  options: CustomDropdownOption[];
  onChange: Function;
}

export const SettingsDropdown: React.FC<DropdownProps> = ({ settingName, onChange, options }) => {
  const [value, setValue] = useState<number | string>();

  useEffect(() => {
    const getSetting = async () => {
      setValue(await getNumberSetting(settingName));
    }

    getSetting();
  }, []);

  return (
    <div>
      <Dropdown
        options={options}
        placeholder={options.find(o => o.value.toString() === value?.toString())?.label || "None"}
        label=""
        onChange={(o: number) => onChange(o)}
        classNames="custom-select settings-dropdown"
      />
    </div>
  );
}
