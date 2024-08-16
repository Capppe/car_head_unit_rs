import React from "react";
import { ImageButton } from "../components/image_button";
import { BluetoothWindow } from "./bluetooth";
import { InternetRadioWindow } from "./internet_radio";
import { MusicWindow } from "./music";
import { NavigationWindow } from "./navigation";
import { RadioWindow } from "./radio";
import { getMainImgUrl } from "../utils/image_utils";
import { ArduinoManagerWindow } from "./arduino_mgr";

interface MainMenuProps {
  changeWindow: Function;
}

export const MainMenu: React.FC<MainMenuProps> = ({ changeWindow }) => {
  const src = "./src/assets/icons";
  return (
    <div className="col">
      <div className="grid5">
        <ImageButton id="music_button" imgSrc={`${src}/music.svg`} text="Music" onClick={() => changeWindow(<MusicWindow />)} />
        <ImageButton id="bluetooth_button" imgSrc={`${src}/bluetooth.svg`} text="Bluetooth" onClick={() => changeWindow(<BluetoothWindow />)} />
        <ImageButton id="navigation_button" imgSrc={`${src}/navigation.svg`} text="Navigation" onClick={() => changeWindow(<NavigationWindow />)} />
        <ImageButton id="radio_button" imgSrc={`${src}/radio.svg`} text="Radio" onClick={() => changeWindow(<RadioWindow />)} />
        <ImageButton id="internet_radio_button" imgSrc={`${src}/radio.svg`} text="Internet Radio" onClick={() => changeWindow(<InternetRadioWindow />)} />

        <ImageButton id="arduino_button" imgSrc={getMainImgUrl('arduino')} text="Arduino manager" onClick={() => changeWindow(<ArduinoManagerWindow />)} />
      </div>
    </div>
  );
}
