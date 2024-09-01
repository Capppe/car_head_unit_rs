import React from "react";
import { SettingsSwitch } from "./switch";
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
  settingName: string;
  title: string;
  label?: string | undefined;
  btnLabel?: string | undefined;
  ddOptions?: CustomDropdownOption[];
  getCurrentValue: Function;
  onInput: Function;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({ inputType, title, settingName, label, btnLabel, ddOptions, getCurrentValue, onInput }) => {
  return (
    <div className="row settings-row expand" style={{ width: '85%', alignItems: 'center' }}>
      <div className="col">
        {title && (<label className="text30">{title}</label>)}
        {label && (<label className="text20">{label}</label>)}
      </div>
      <div>
        {inputType === SettingsRowType.Switch ? (
          <SettingsSwitch getCurrentValue={getCurrentValue} settingName={settingName} onChange={onInput} />
        ) : inputType === SettingsRowType.Slider ? (
          <SettingsSlider getCurrentValue={getCurrentValue} settingName={settingName} max={100} min={0} />
        ) : inputType === SettingsRowType.Button ? (
          <SettingsButton title={btnLabel || ""} onClick={onInput} />
        ) : inputType === SettingsRowType.DropDown ? (
          <SettingsDropdown getCurrentValue={getCurrentValue} settingName={settingName} options={ddOptions || []} onChange={onInput} />
        ) : inputType === SettingsRowType.TextInput ? (
          <SettingsTextInput getCurrentValue={getCurrentValue} settingName={settingName} />
        ) : inputType === SettingsRowType.ColorInput ? (
          <SettingsColorPicker getCurrentValue={getCurrentValue} settingName={settingName} onChange={onInput} />
        ) : (<div />)}
      </div>
    </div>
  );
}
