import React, { useEffect, useState } from "react";
import { SettingsSwitch } from "./switch";
import { getBooleanSetting, getNumberSetting, getTextSetting } from "../../utils/settings_utils";
import "../../styles/Settings.css";
import { SettingsSlider } from "./slider";
import { SettingsButton } from "./button";
import { SettingsTextInput } from "./textinput";
import { SettingsColorPicker } from "./colorpicker";
import { SettingsDropdown } from "./dropdown";
import { CustomDropdownOption } from "../../utils/constants";

export enum SettingsRowType {
  Switch,
  Slider,
  Button,
  DropDown,
  TextInput,
  ColorInput,
}

interface SettingsRowProps {
  inputType: SettingsRowType;
  setting: string;
  title: string;
  label?: string | undefined;
  btnLabel?: string | undefined;
  ddOptions?: CustomDropdownOption[];
  onInput: Function;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({ inputType, title, setting, label, btnLabel, ddOptions, onInput }) => {
  const [defaultValue, setDefaultValue] = useState<any>();

  useEffect(() => {
    const getSetting = async () => {
      switch (inputType) {
        case SettingsRowType.Switch: setDefaultValue(await getBooleanSetting(setting) || true); break;
        case SettingsRowType.Slider:
        case SettingsRowType.DropDown: setDefaultValue(await getNumberSetting(setting) || 0); break;
        case SettingsRowType.TextInput: setDefaultValue(await getTextSetting(setting) || ""); break;
        case SettingsRowType.ColorInput: setDefaultValue(await getTextSetting(setting) || "#ffffff"); break;
      }
    }

    getSetting();
  }, []);

  return (
    <div className="row settings-row expand" style={{ width: '85%', alignItems: 'center' }}>
      <div className="col">
        {title && (<label className="text30">{title}</label>)}
        {label && (<label className="text20">{label}</label>)}
      </div>
      <div>
        {inputType === SettingsRowType.Switch ? (
          <SettingsSwitch defaultValue={defaultValue} onChange={onInput} />
        ) : inputType === SettingsRowType.Slider ? (
          <SettingsSlider defaultValue={defaultValue} max={100} min={0} />
        ) : inputType === SettingsRowType.Button ? (
          <SettingsButton title={btnLabel || ""} onClick={onInput} />
        ) : inputType === SettingsRowType.DropDown ? (
          <SettingsDropdown defaultValue={defaultValue} options={ddOptions || []} onChange={onInput} />
        ) : inputType === SettingsRowType.TextInput ? (
          <SettingsTextInput defaultValue={defaultValue} />
        ) : inputType === SettingsRowType.ColorInput ? (
          <SettingsColorPicker defaultValue={defaultValue} onChange={onInput} />
        ) : (<div />)}
      </div>
    </div>
  );
}
