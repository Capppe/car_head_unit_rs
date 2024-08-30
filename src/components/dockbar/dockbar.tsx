import React from "react";
import { VolumeSlider } from "./volumeslider";
import { useGlobalState } from "../globalstatecontext";
import { PowerMenu } from "../notification_templates/power_menu";
import { getDockImg } from "../../utils/image_utils";
import { SettingsWindow } from "../../screens/settings";

interface DockBarProps {
  goHome: Function;
  changeWindow: Function;
}

export const DockBar: React.FC<DockBarProps> = ({ goHome, changeWindow }) => {

  const { state } = useGlobalState();

  const showPowerMenu = () => {
    state.showNotif ? state.showNotif(<PowerMenu />, 15000) : console.log("State not initialized!");
  }

  const showSettings = () => {
    changeWindow(<SettingsWindow changeWindow={changeWindow} />);
  }

  return (
    <div className="dockbar">

      <div className="dockbar_section dockar_left" id="dockbar_homeButton">
        <button className="dockbar_button" onClick={() => { goHome() }}>
          <img src={getDockImg("home")} alt="home" />
        </button>
        <VolumeSlider />
      </div>

      <div className="dockbar_section dockar_middle">
      </div>

      <div className="dockbar_section dockar_right">
        <button className="dockbar_button" id="dockbar_powerButton" onClick={() => { showPowerMenu() }}>
          <img src={getDockImg('power')} alt="home" />
        </button>
        <button className="dockbar_button" id="dockbar_settingsButton" onClick={() => { showSettings() }}>
          <img src={getDockImg('settings')} alt="home" />
        </button>
      </div>
    </div>
  );
}
