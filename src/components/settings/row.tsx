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

  return (
    <div className="row settings-row expand" style={{ width: '85%', alignItems: 'center' }}>
      <div className="col">
        {title && (<label className="text30">{title}</label>)}
        {label && (<label className="text20">{label}</label>)}
      </div>
      <div>
        {inputType === SettingsRowType.Switch ? (
          <SettingsSwitch settingName={setting} onChange={onInput} />
        ) : inputType === SettingsRowType.Slider ? (
          <SettingsSlider settingName={setting} max={100} min={0} />
        ) : inputType === SettingsRowType.Button ? (
          <SettingsButton title={btnLabel || ""} onClick={onInput} />
        ) : inputType === SettingsRowType.DropDown ? (
          <SettingsDropdown settingName={setting} options={ddOptions || []} onChange={onInput} />
        ) : inputType === SettingsRowType.TextInput ? (
          <SettingsTextInput settingName={setting} />
        ) : inputType === SettingsRowType.ColorInput ? (
          <SettingsColorPicker settingName={setting} onChange={onInput} />
        ) : (<div />)}
      </div>
    </div>
  );
}
