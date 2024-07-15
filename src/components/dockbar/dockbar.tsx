import { VolumeSlider } from "./volumeslider";

export const DockBar = () => {
  return (
    <div className="dockbar">

      <div className="dockbar_section dockar_left">
        <button className="dockbar_button">
          <img src="./src/assets/icons/dockbar/home.svg" alt="home" />
        </button>
        <VolumeSlider />
      </div>

      <div className="dockbar_section dockar_middle">
        hej
      </div>

      <div className="dockbar_section dockar_right">
        <button className="dockbar_button">
          Settings
        </button>
      </div>
    </div>
  );
}
