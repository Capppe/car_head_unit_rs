import React from "react";
import { ImageButton } from "../components/image_button";
import "../styles/Settings.css";
import { AudioSettings } from "./settings_windows/audio";
import { SystemSettings } from "./settings_windows/system";
import { AppearanceSettings } from "./settings_windows/appearance";
import { RearCameraSettings } from "./settings_windows/rear_camera";
import { ConnectivitySettings } from "./settings_windows/connectivity";
import { UpdateSettings } from "./settings_windows/updates";
import { getSettingImgUrl } from "../utils/image_utils";

interface SettingsWindowProps {
  changeWindow: Function;
}

export const SettingsWindow: React.FC<SettingsWindowProps> = ({ changeWindow }) => {
  const setWindow = (window: any) => {
    changeWindow(window);
  }

  return (
    <div className="grid5 self-start">
      <ImageButton id="audio" imgSrc={getSettingImgUrl('audio')} text="Audio" onClick={() => { setWindow(<AudioSettings />) }} />
      <ImageButton id="system" imgSrc={getSettingImgUrl('system')} text="System" onClick={() => { setWindow(<SystemSettings />) }} />
      <ImageButton id="appearance" imgSrc={getSettingImgUrl('appearance')} text="Appearance" onClick={() => { setWindow(<AppearanceSettings />) }} />
      <ImageButton id="rear-camera" imgSrc={getSettingImgUrl('rear-camera')} text="Rear Camera" onClick={() => { setWindow(<RearCameraSettings />) }} />
      <ImageButton id="connectivity" imgSrc={getSettingImgUrl('connectivity')} text="Connectivity" onClick={() => { setWindow(<ConnectivitySettings />) }} />

      <ImageButton id="updates" imgSrc={getSettingImgUrl('updates')} text="Updates" onClick={() => { setWindow(<UpdateSettings />) }} />
    </div>
  );
}
