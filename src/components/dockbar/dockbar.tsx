import React from "react";
import { VolumeSlider } from "./volumeslider";
import { useGlobalState } from "../globalstatecontext";
import { PowerMenu } from "../notification_templates/power_menu";

interface DockBarProps {
  goHome: Function;
}

export const DockBar: React.FC<DockBarProps> = ({ goHome }) => {

  const { state, setState } = useGlobalState();

  const showPowerMenu = () => {
    state.showNotif ? state.showNotif(<PowerMenu />, 15000) : console.log("State not initialized!");
  }

  return (
    <div className="dockbar">

      <div className="dockbar_section dockar_left" id="dockbar_homeButton">
        <button className="dockbar_button" onClick={() => { goHome() }}>
          <img src="./src/assets/icons/dockbar/home.svg" alt="home" />
        </button>
        <VolumeSlider />
      </div>

      <div className="dockbar_section dockar_middle">
      </div>

      <div className="dockbar_section dockar_right">
        <button className="dockbar_button" id="dockbar_powerButton" onClick={() => { showPowerMenu() }}>
          <img src="./src/assets/icons/dockbar/power.svg" alt="home" />
        </button>
        <button className="dockbar_button" id="dockbar_settingsButton">
          <img src="./src/assets/icons/dockbar/settings.svg" alt="home" />
        </button>
      </div>
    </div>
  );
}
