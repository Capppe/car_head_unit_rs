import { getDockImg } from "../../utils/image_utils";

export const PowerMenu = () => {

  const reboot = () => {
    console.log("Rebooting");
    //todo invoke reboot
  }

  const displayOff = () => {
    console.log("Shutting off display");
    //todo invoke display off
  }

  const exit = () => {
    console.log("Exiting");
    //todo invoke exit
  }

  const powerOff = () => {
    console.log("Powering off");
    //todo power off
  }

  return (
    <div className="" id="notification_container" >
      <div id="notification_icon">
        <img src={getDockImg("power.svg")} alt="notification image" id="notif_image" />
      </div>

      <div id="notification_text_container">
        <div id="notification_header">
          <h3 className="notif_text" id="notif_header">Select option</h3>
        </div>
        <div id="powerMenuButtons">
          <button onClick={() => reboot()}>
            <img src={getDockImg("restart.svg")} />
            Reboot
          </button>
          <button onClick={() => displayOff()}>
            <img src={getDockImg("monitor-off.svg")} />
            Display off
          </button>
          <button onClick={() => exit()}>
            <img src={getDockImg("exit.svg")} />
            Exit
          </button>
          <button onClick={() => powerOff()}>
            <img src={getDockImg("power.svg")} />
            Power off
          </button>
        </div>
      </div>

      <div id="notification_actions_container">
      </div>
    </div >
  );
}
