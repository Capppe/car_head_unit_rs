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
  return (
    <div className="col self-start">
      <div className="grid5">
        <ImageButton id="music_button" imgSrc={getMainImgUrl('music')} text="Music" onClick={() => changeWindow(<MusicWindow />)} />
        <ImageButton id="bluetooth_button" imgSrc={getMainImgUrl('bluetooth')} text="Bluetooth" onClick={() => changeWindow(<BluetoothWindow />)} />
        <ImageButton id="navigation_button" imgSrc={getMainImgUrl('navigation')} text="Navigation" onClick={() => changeWindow(<NavigationWindow />)} />
        <ImageButton id="radio_button" imgSrc={getMainImgUrl('radio')} text="Radio" onClick={() => changeWindow(<RadioWindow />)} />
        <ImageButton id="internet_radio_button" imgSrc={getMainImgUrl('radio')} text="Internet Radio" onClick={() => changeWindow(<InternetRadioWindow />)} />

        <ImageButton id="arduino_button" imgSrc={getMainImgUrl('arduino')} text="Arduino manager" onClick={() => changeWindow(<ArduinoManagerWindow />)} />
      </div>
    </div>
  );
}
